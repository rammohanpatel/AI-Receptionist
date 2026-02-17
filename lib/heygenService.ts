/**
 * HeyGen LiveAvatar Service
 * Manages WebSocket connection and avatar control for HeyGen LITE mode
 */

export interface HeyGenSessionConfig {
  websocket_url: string;
  session_id: string;
}

export class HeyGenAvatarService {
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private eventId: number = 0;
  private onStateChangeCallback: ((state: 'connected' | 'connecting' | 'closed' | 'closing') => void) | null = null;
  private onSpeakStartedCallback: ((eventId: string) => void) | null = null;
  private onSpeakEndedCallback: ((eventId: string) => void) | null = null;

  constructor() {}

  /**
   * Connect to HeyGen WebSocket
   */
  async connect(config: HeyGenSessionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to HeyGen WebSocket:', config.websocket_url);
        this.websocket = new WebSocket(config.websocket_url);

        this.websocket.onopen = () => {
          console.log('HeyGen WebSocket connected');
          this.isConnected = true;
          resolve();
        };

        this.websocket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.websocket.onerror = (error) => {
          console.error('HeyGen WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('HeyGen WebSocket closed');
          this.isConnected = false;
          this.onStateChangeCallback?.('closed');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      console.log('HeyGen message received:', message);

      switch (message.type) {
        case 'session.state_updated':
          this.onStateChangeCallback?.(message.state);
          break;
        case 'agent.speak_started':
          this.onSpeakStartedCallback?.(message.event_id);
          break;
        case 'agent.speak_ended':
          this.onSpeakEndedCallback?.(message.event_id);
          break;
      }
    } catch (error) {
      console.error('Error parsing HeyGen message:', error);
    }
  }

  /**
   * Send audio to avatar for lip-sync
   * @param audioBase64 - PCM 16-bit 24kHz audio encoded as Base64
   */
  async speak(audioBase64: string, eventId?: string): Promise<string> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('WebSocket not connected');
    }

    const id = eventId || `speak_${this.eventId++}`;
    
    const message = {
      type: 'agent.speak',
      event_id: id,
      audio: audioBase64
    };

    this.websocket.send(JSON.stringify(message));
    return id;
  }

  /**
   * Signal the end of speaking
   */
  async speakEnd(eventId: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type: 'agent.speak_end',
      event_id: eventId
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Interrupt current avatar action
   */
  async interrupt(): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type: 'agent.interrupt'
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Transition avatar to listening state
   */
  async startListening(eventId?: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type: 'agent.start_listening',
      event_id: eventId || `listen_${this.eventId++}`
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Transition avatar from listening to idle state
   */
  async stopListening(eventId?: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type: 'agent.stop_listening',
      event_id: eventId || `stop_listen_${this.eventId++}`
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Keep session alive (send periodically if needed)
   */
  async keepAlive(): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      return;
    }

    const message = {
      type: 'session.keep_alive',
      event_id: `keepalive_${this.eventId++}`
    };

    this.websocket.send(JSON.stringify(message));
  }

  /**
   * Set event callbacks
   */
  onStateChange(callback: (state: 'connected' | 'connecting' | 'closed' | 'closing') => void) {
    this.onStateChangeCallback = callback;
  }

  onSpeakStarted(callback: (eventId: string) => void) {
    this.onSpeakStartedCallback = callback;
  }

  onSpeakEnded(callback: (eventId: string) => void) {
    this.onSpeakEndedCallback = callback;
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

/**
 * Convert audio buffer to PCM 16-bit 24kHz Base64
 * This is required format for HeyGen
 */
export async function convertAudioToPCM24kHz(audioBuffer: ArrayBuffer): Promise<string> {
  const audioContext = new AudioContext({ sampleRate: 24000 });
  const audioData = await audioContext.decodeAudioData(audioBuffer);
  
  // Resample to 24kHz if needed
  const offlineContext = new OfflineAudioContext(
    1, // mono
    audioData.duration * 24000,
    24000
  );
  
  const source = offlineContext.createBufferSource();
  source.buffer = audioData;
  source.connect(offlineContext.destination);
  source.start();
  
  const renderedBuffer = await offlineContext.startRendering();
  const pcmData = renderedBuffer.getChannelData(0);
  
  // Convert to 16-bit PCM
  const pcm16 = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Convert to Base64
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

/**
 * Stream audio in chunks (recommended: ~1 second chunks)
 */
export async function* streamAudioInChunks(
  audioBase64: string,
  chunkDuration: number = 1000 // ms
): AsyncGenerator<string> {
  // Decode base64 to get audio data
  const binaryString = atob(audioBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Calculate chunk size (24kHz, 16-bit = 48000 bytes per second)
  const bytesPerSecond = 24000 * 2; // 16-bit = 2 bytes per sample
  const chunkSize = Math.floor((bytesPerSecond * chunkDuration) / 1000);
  
  // Split into chunks and yield
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length));
    let binary = '';
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
    yield btoa(binary);
  }
}
