'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { motion } from 'framer-motion';
import { ConversationState } from '@/types';
import { HeyGenAvatarService, convertAudioToPCM24kHz, streamAudioInChunks } from '@/lib/heygenService';
import Image from 'next/image';

interface HeyGenAvatarProps {
  state: ConversationState;
  isThinking?: boolean;
  onAudioToPlay?: (audioData: ArrayBuffer) => void;
  onAvatarStartSpeaking?: () => void;
  autoStart?: boolean;
  useSandbox?: boolean;  // Enable sandbox mode for testing (no credit usage, 1 min limit)
}

export interface HeyGenAvatarRef {
  speak: (audioBuffer: ArrayBuffer) => Promise<{ eventId: string; estimatedDelay: number }>;
  waitForSpeakStart: () => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  isReady: () => boolean;  // Check if avatar is initialized and ready
  getEstimatedSyncDelay: () => number; // Get current estimated sync delay
}

const HeyGenAvatar = forwardRef<HeyGenAvatarRef, HeyGenAvatarProps>(({
  state,
  isThinking,
  onAudioToPlay,
  onAvatarStartSpeaking,
  autoStart = false,
  useSandbox = false  // Default to production mode
}, ref) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const heygenServiceRef = useRef<HeyGenAvatarService | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Initialize HeyGen session
  const initializeSession = async () => {
    if (isInitialized || isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      console.log('🎭 Initializing HeyGen LiveAvatar session...');

      // Step 1: Create session token
      const tokenResponse = await fetch('/api/heygen/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useSandbox })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to create HeyGen session token');
      }

      const tokenData = await tokenResponse.json();
      sessionTokenRef.current = tokenData.session_token;
      sessionIdRef.current = tokenData.session_id;

      console.log('✅ Session token created:', tokenData.session_id);

      // Step 2: Start the session
      const startResponse = await fetch('/api/heygen/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: tokenData.session_token })
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start HeyGen session');
      }

      const startData = await startResponse.json();
      console.log('✅ Session started, connecting to LiveKit...');

      // Step 3: Connect to LiveKit room
      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log('📹 Track subscribed:', track.kind);

        if (track.kind === Track.Kind.Video && videoRef.current) {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.error('Error playing video:', e));
        }
      });

      room.on(RoomEvent.Connected, () => {
        console.log('✅ Connected to LiveKit room');
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('❌ Disconnected from LiveKit room');
        setIsInitialized(false);
      });

      await room.connect(startData.livekit_url, startData.livekit_token);

      // Step 4: Connect to HeyGen WebSocket
      const heygenService = new HeyGenAvatarService();
      heygenServiceRef.current = heygenService;

      heygenService.onStateChange((wsState) => {
        console.log('🔌 HeyGen WebSocket state:', wsState);
      });

      heygenService.onSpeakStarted((eventId: string, timestamp: number) => {
        console.log('🗣️ Avatar started speaking:', eventId, 'at', timestamp);
        setAvatarState('speaking');
        if (onAvatarStartSpeaking) onAvatarStartSpeaking();
      });

      heygenService.onSpeakEnded((eventId) => {
        console.log('✅ Avatar finished speaking:', eventId);
        setAvatarState('idle');
      });

      await heygenService.connect({
        websocket_url: startData.websocket_url,
        session_id: startData.session_id
      });

      console.log('✅ HeyGen session fully initialized!');
      setIsInitialized(true);
      setIsConnecting(false);

    } catch (error) {
      console.error('❌ Error initializing HeyGen session:', error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
      setIsConnecting(false);
      cleanup();
    }
  };

  // Cleanup function
  const cleanup = async () => {
    console.log('🧹 Cleaning up HeyGen session...');

    if (heygenServiceRef.current) {
      heygenServiceRef.current.disconnect();
      heygenServiceRef.current = null;
    }

    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }

    if (sessionTokenRef.current) {
      try {
        await fetch('/api/heygen/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_token: sessionTokenRef.current })
        });
      } catch (error) {
        console.error('Error stopping session:', error);
      }
      sessionTokenRef.current = null;
    }

    setIsInitialized(false);
  };

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isInitialized && !isConnecting) {
      initializeSession();
    }
  }, [autoStart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    speak,
    waitForSpeakStart: async () => {
      if (!heygenServiceRef.current) {
        throw new Error('HeyGen not initialized');
      }
      // Wait for the next speak_started event (HeyGen uses its own event IDs)
      try {
        await heygenServiceRef.current.waitForSpeakStart(5000);
      } catch (error) {
        console.warn('Timeout waiting for speak_started event, continuing anyway');
      }
    },
    initialize: initializeSession,
    cleanup,
    isReady: () => isInitialized,  // Expose initialization state
    getEstimatedSyncDelay: () => {
      return heygenServiceRef.current?.getEstimatedDelay() || 300;
    }
  }));

  // Public method to speak text
  const speak = async (audioBuffer: ArrayBuffer) => {
    if (!heygenServiceRef.current || !isInitialized) {
      console.warn('⚠️ HeyGen not initialized, cannot speak');
      throw new Error('HeyGen not initialized');
    }

    try {
      console.log('🎤 Converting audio to PCM 24kHz...');
      const audioBase64 = await convertAudioToPCM24kHz(audioBuffer);

      console.log('📤 Sending audio to HeyGen in chunks...');
      const eventId = `speak_${Date.now()}`;
      const startTime = performance.now();

      // Stream audio in ~1 second chunks
      let chunkCount = 0;
      for await (const chunk of streamAudioInChunks(audioBase64, 1000)) {
        await heygenServiceRef.current.speak(chunk, eventId);
        chunkCount++;
      }

      // Signal end of speaking
      await heygenServiceRef.current.speakEnd(eventId);
      console.log(`✅ Sent ${chunkCount} audio chunks to HeyGen`);

      // Get estimated delay for caller to use
      const estimatedDelay = heygenServiceRef.current.getEstimatedDelay();
      const elapsed = performance.now() - startTime;
      
      // Adjust delay based on how long it took to send chunks
      const adjustedDelay = Math.max(0, estimatedDelay - elapsed);
      
      console.log(`🎯 Estimated sync delay: ${estimatedDelay.toFixed(0)}ms, Adjusted: ${adjustedDelay.toFixed(0)}ms`);

      return { eventId, estimatedDelay: adjustedDelay };
    } catch (error) {
      console.error('❌ Error sending audio to HeyGen:', error);
      throw error;
    }
  };

  // Update avatar visual state based on conversation state
  useEffect(() => {
    if (!heygenServiceRef.current || !isInitialized) return;

    if (state === 'listening') {
      heygenServiceRef.current.startListening().catch(console.error);
    } else if (state === 'idle') {
      heygenServiceRef.current.stopListening().catch(console.error);
    }
  }, [state, isInitialized]);

  const getStateColor = () => {
    switch (state) {
      case 'listening':
        return 'border-blue-500';
      case 'thinking':
        return 'border-yellow-500';
      case 'speaking':
        return 'border-green-500';
      case 'calling':
        return 'border-purple-500';
      default:
        return 'border-gray-400';
    }
  };

  const getStateLabel = () => {
    if (isConnecting) return 'Connecting...';
    if (!isInitialized) return 'Ready to help';

    switch (state) {
      case 'listening':
        return 'Listening...';
      case 'thinking':
        return 'Thinking...';
      case 'speaking':
        return 'Speaking...';
      case 'calling':
        return 'Calling...';
      default:
        return 'Ready to help';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Avatar Video Container */}
      <div className="relative">
        {/* Pulse animation rings for speaking */}
        {state === 'speaking' && isInitialized && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
              animate={{
                scale: [1, 1.8],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#F0C852]"
              animate={{
                scale: [1, 1.8],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Video Element */}
        <div className={`relative ${isInitialized ? 'w-[70vh] h-[70vh]' : 'w-80 h-80'} rounded-full overflow-hidden border-4 ${getStateColor()} shadow-2xl bg-[#10213B]`}>
          {/* Avatar placeholder image - shown when video not ready */}
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/avatar1.png"
                alt="Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={false}
          />

          {/* Loading overlay - only spinner, no button */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#10213B] bg-opacity-70">
              <div className="text-center text-white p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
                <p className="text-sm">Initializing </p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {connectionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90">
              <div className="text-center text-white p-6">
                <p className="text-sm mb-4">❌ {connectionError}</p>
                <button
                  onClick={initializeSession}
                  className="px-4 py-2 bg-white text-red-900 rounded-full hover:bg-gray-100 transition-all"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* State Label */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-white mb-2">
          {getStateLabel()}
        </p>
        {/* {isInitialized && (
          <p className="text-sm text-gray-400">
            HeyGen LiveAvatar{useSandbox && ' (Sandbox)'} • Session: {sessionIdRef.current?.substring(0, 8)}...
          </p>
        )} */}

        {/* Reactivate button - shown when avatar is initialized but might have stopped */}
        {isInitialized && !isConnecting && (
          <button
            onClick={initializeSession}
            className="mt-4 px-6 py-2 bg-[#D4AF37] text-[#10213B] rounded-full hover:bg-[#F0C852] transition-all font-semibold shadow-lg"
          >
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
});

HeyGenAvatar.displayName = 'HeyGenAvatar';

export default HeyGenAvatar;
