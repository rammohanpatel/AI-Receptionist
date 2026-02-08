'use client';

import { useState, useEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import CallUI from '@/components/CallUI';
import ConversationHistory from '@/components/ConversationHistory';
import Controls from '@/components/Controls';
import Notification, { NotificationType } from '@/components/Notification';
import { ConversationState, Message, Employee } from '@/types';

export default function Home() {
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);
  const hasGreetedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  // Removed auto-greeting - now triggered by Start button

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    setMessages((prev) => [
      ...prev,
      { content, role, timestamp: new Date() },
    ]);
  };

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      console.log('Camera stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      
      videoStreamRef.current = stream;
      setIsCameraActive(true);
      
      // Wait a bit for state to update, then set video source
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        console.log('Setting video srcObject');
        videoRef.current.srcObject = stream;
        // Force play the video
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().catch(err => console.error('Video play error:', err));
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showNotification('Could not access camera. Continuing without video.', 'info');
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Play greeting audio with text message
  const playGreetingAudio = async () => {
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      const greetingText = 'Hello! Welcome to our office. How may I help you today?';
      
      // Add greeting message to conversation
      addMessage(greetingText, 'assistant');
      
      try {
        const ttsResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greetingText }),
        });

        if (ttsResponse.ok) {
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onended = () => URL.revokeObjectURL(audioUrl);
          await audio.play().catch(() => {
            // Silently fail if autoplay is still blocked
            URL.revokeObjectURL(audioUrl);
          });
        } else {
          console.log('TTS service unavailable - text will be displayed only');
        }
      } catch (error) {
        console.log('Could not play greeting audio - continuing without voice');
      }
    }
  };

  // Handle Start button click
  const handleStart = async () => {
    setHasStarted(true);
    hasInteractedRef.current = true;
    
    // Start camera
    await startCamera();
    
    // Play greeting
    await playGreetingAudio();
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setConversationState('listening');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      showNotification('Could not access microphone. Please check permissions.', 'error');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setConversationState('thinking');
      setIsProcessing(true);
      // Keep camera running - don't stop it
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Step 1: Speech to Text
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const sttResponse = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!sttResponse.ok) {
        throw new Error('Speech-to-text failed');
      }

      const { text } = await sttResponse.json();
      
      if (!text || text.trim() === '') {
        showNotification('I didn\'t catch that. Could you please repeat?', 'error');
        setIsProcessing(false);
        setConversationState('idle');
        return;
      }

      addMessage(text, 'user');

      // Step 2: AI Processing
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('AI processing failed');
      }

      const aiResponse = await chatResponse.json();

      // Step 3: Handle response
      await speakAndAddMessage(aiResponse.response, 'assistant');

      // Step 4: Handle call intent
      if (aiResponse.canProceedWithCall && aiResponse.employeeId) {
        await initiateCall(aiResponse.employeeId, aiResponse.employee);
      }

      setIsProcessing(false);
      setConversationState('idle');
    } catch (error) {
      console.error('Error processing audio:', error);
      showNotification('An error occurred. Please try again.', 'error');
      setIsProcessing(false);
      setConversationState('idle');
    }
  };

  const speakAndAddMessage = async (text: string, role: 'user' | 'assistant') => {
    addMessage(text, role);

    if (role === 'assistant') {
      setConversationState('speaking');
      
      try {
        const ttsResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (ttsResponse.ok) {
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          
          audioRef.current = new Audio(audioUrl);
          audioRef.current.onended = () => {
            setConversationState('idle');
            URL.revokeObjectURL(audioUrl);
          };
          audioRef.current.onerror = () => {
            console.error('Audio playback error');
            setConversationState('idle');
            URL.revokeObjectURL(audioUrl);
          };
          
          // Try to play, handle autoplay policy
          try {
            await audioRef.current.play();
          } catch (playError: any) {
            if (playError.name === 'NotAllowedError') {
              console.log('Audio autoplay blocked - this will work after user interaction');
              setConversationState('idle');
            } else {
              throw playError;
            }
          }
        } else {
          // TTS failed, but we already showed the text - just go back to idle
          console.log('TTS service unavailable - showing text only');
          setConversationState('idle');
        }
      } catch (error) {
        console.error('Text-to-speech error:', error);
        // Even if TTS fails, the text message is already displayed
        setConversationState('idle');
      }
    }
  };

  const initiateCall = async (employeeId: string, employeeName: string) => {
    // Show notification about connecting
    showNotification(`Notifying ${employeeName}...`, 'info');

    // Simulate employee notification
    setTimeout(() => {
      showNotification(`${employeeName} has been notified. Connecting...`, 'success');
      
      // Start countdown
      let count = 5;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        
        if (count <= 0) {
          clearInterval(countdownInterval);
          setCountdown(undefined);
          startCall(employeeId);
        }
      }, 1000);
    }, 1500);
  };

  const startCall = async (employeeId: string) => {
    // Fetch employee details
    const response = await fetch('/api/employees');
    const { employees } = await response.json();
    const employee = employees.find((emp: Employee) => emp.id === employeeId);

    if (employee) {
      setCurrentEmployee(employee);
      setIsCallActive(true);
      setConversationState('calling');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCurrentEmployee(null);
    setConversationState('idle');
    showNotification('Call ended', 'info');
    
    // Ask if there's anything else
    setTimeout(() => {
      speakAndAddMessage('Is there anything else I can help you with?', 'assistant');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* Camera Video - Top Left */}
      {isCameraActive && (
        <div className="fixed top-4 left-4 z-[9999] rounded-xl overflow-hidden shadow-2xl border-4 border-blue-500 bg-gray-900">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-80 h-60 object-cover"
            onLoadedMetadata={(e) => {
              console.log('Video element loaded metadata');
              const video = e.currentTarget;
              video.play().catch(err => console.error('Play failed:', err));
            }}
          />
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          AI Receptionist
        </h1>
        <p className="text-xl text-gray-600">
          Your intelligent workplace assistant
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Avatar Section */}
        <div className="mb-8">
          <Avatar state={conversationState} isThinking={isProcessing} />
        </div>

        {/* Controls */}
        {!isCallActive && (
          <>
            {!hasStarted ? (
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleStart}
                  className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  <svg 
                    className="w-8 h-8 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  Start Receptionist
                  <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
                </button>
              </div>
            ) : (
              <Controls
                isListening={isListening}
                isProcessing={isProcessing}
                onStartListening={startListening}
                onStopListening={stopListening}
                disabled={conversationState === 'calling'}
              />
            )}
          </>
        )}

        {/* Countdown Display */}
        {countdown !== undefined && countdown > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 text-white text-4xl font-bold rounded-full shadow-lg animate-pulse">
              {countdown}
            </div>
            <p className="mt-4 text-lg text-gray-700">Connecting to call...</p>
          </div>
        )}

        {/* Conversation History */}
        <ConversationHistory messages={messages} />

        {/* Features Info */}
        {!hasStarted && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice Interaction</h3>
              <p className="text-sm text-gray-600">Speak naturally and I'll understand</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Routing</h3>
              <p className="text-sm text-gray-600">I'll find the right person for you</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Calls</h3>
              <p className="text-sm text-gray-600">Connect in seconds with anyone</p>
            </div>
          </div>
        )}
      </div>

      {/* Call UI Overlay */}
      <CallUI
        isActive={isCallActive}
        employee={currentEmployee}
        onEndCall={endCall}
        countdown={countdown}
      />

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  );
}
