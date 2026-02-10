'use client';

import { useState, useEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import CallUI from '@/components/CallUI';
import ConversationHistory from '@/components/ConversationHistory';
import Controls from '@/components/Controls';
import Notification, { NotificationType } from '@/components/Notification';
import EmployeeNotificationModal, { NotificationMessage } from '@/components/EmployeeNotificationModal';
import DemoScenarios from '@/components/DemoScenarios';
import VerticalDemoScenarios from '@/components/VerticalDemoScenarios';
import QuickNav from '@/components/QuickNav';
import EmployeeDirectory from '@/components/EmployeeDirectory';
import { ConversationState, Message, Employee } from '@/types';
import { DEMO_SCENARIOS, DemoMessage, DemoScenarioData } from '@/lib/demoScenarios';
import { CallSounds } from '@/lib/sounds';

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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationMessages, setNotificationMessages] = useState<NotificationMessage[]>([]);
  const [pendingEmployee, setPendingEmployee] = useState<Employee | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [showProcessingIndicator, setShowProcessingIndicator] = useState(false);
  const [isUrgentCall, setIsUrgentCall] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);
  const hasGreetedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const demoLogsRef = useRef<HTMLDivElement | null>(null);
  const employeeDirectoryRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);
  const callSoundsRef = useRef<CallSounds | null>(null);
  const currentScenarioRef = useRef<DemoScenarioData | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);

  // Initialize call sounds
  useEffect(() => {
    callSoundsRef.current = new CallSounds();
    return () => {
      callSoundsRef.current?.cleanup();
    };
  }, []);

  // Auto-scroll demo logs to bottom when new logs are added
  useEffect(() => {
    if (demoLogsRef.current) {
      demoLogsRef.current.scrollTop = demoLogsRef.current.scrollHeight;
    }
  }, [demoLogs]);

  // Auto-scroll to countdown timer when it appears
  useEffect(() => {
    if (countdown !== undefined && countdown > 0 && countdownRef.current) {
      countdownRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [countdown]);

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
      const greetingText = 'Welcome to Dubai Holding Real Estate, proud to shape some of the UAE\'s most recognized communities. Sir, may I get your name, please?';
      
      // Add greeting message to conversation
      addMessage(greetingText, 'assistant');
      
      try {
        const ttsResponse = await fetch('/api/elevenlabs-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greetingText, voiceType: 'female' }),
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

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setDemoLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEMO LOG] ${message}`);
  };

  // Play audio with voice synthesis
  const playAudio = async (text: string, voiceType: 'male' | 'female' = 'female') => {
    try {
      addLog(`🔊 Synthesizing ${voiceType} voice: "${text.substring(0, 50)}..."`);
      
      const ttsResponse = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceType }),
      });

      if (ttsResponse.ok) {
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        
        audioRef.current = new Audio(audioUrl);
        
        return new Promise<void>((resolve) => {
          if (audioRef.current) {
            audioRef.current.onended = () => {
              addLog(`✓ Audio playback completed`);
              URL.revokeObjectURL(audioUrl);
              resolve();
            };
            audioRef.current.onerror = () => {
              addLog(`⚠ Audio playback error`);
              URL.revokeObjectURL(audioUrl);
              resolve();
            };
            audioRef.current.play().catch((err) => {
              addLog(`⚠ Audio play failed: ${err.message}`);
              URL.revokeObjectURL(audioUrl);
              resolve();
            });
          } else {
            resolve();
          }
        });
      } else {
        addLog(`⚠ TTS service unavailable - showing text only`);
      }
    } catch (error: any) {
      addLog(`⚠ TTS error: ${error.message}`);
    }
  };

  // Handle demo scenario selection
  const handleDemoScenario = async (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS[scenarioId];
    if (!scenario) return;

    // Store scenario reference for call message
    currentScenarioRef.current = scenario;

    addLog(`🎬 Starting demo scenario: ${scenarioId}`);
    
    // Reset state
    setMessages([]);
    setDemoLogs([]);
    setHasStarted(true);
    setIsDemoMode(true);
    hasInteractedRef.current = true;
    
    // Start camera
    addLog(`📹 Activating camera...`);
    await startCamera();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Play through all messages in sequence
    for (let i = 0; i < scenario.messages.length; i++) {
      const msg = scenario.messages[i];
      const nextMsg = scenario.messages[i + 1];
      
      await new Promise(resolve => setTimeout(resolve, msg.delay));
      
      // Hide processing indicator right before showing the message
      setShowProcessingIndicator(false);
      
      addLog(`💬 ${msg.role === 'user' ? 'User' : 'AI'}: "${msg.content.substring(0, 50)}..."`);
      
      // Add message to conversation
      addMessage(msg.content, msg.role);
      
      // Set conversation state
      if (msg.role === 'assistant') {
        setConversationState('speaking');
      }
      
      // Play audio if requested
      if (msg.useVoice && msg.voiceType) {
        await playAudio(msg.content, msg.voiceType);
      }
      
      setConversationState('idle');
      
      // Show processing indicator before next AI message
      if (nextMsg && nextMsg.role === 'assistant' && msg.role === 'user') {
        setShowProcessingIndicator(true);
        addLog(`🔄 Processing request...`);
        // Don't hide processing indicator here - let it show until next message appears
      }
    }

    // Hide processing indicator before handling connection
    setShowProcessingIndicator(false);

    // Handle connection or failure
    if (scenario.shouldConnect && scenario.employeeId) {
      setShowProcessingIndicator(true);
      if (scenario.isUrgent) {
        addLog(`🚨 URGENT: AI assistance required - escalating to human supervisor...`);
        setIsUrgentCall(true); // Mark call as urgent
      } else {
        addLog(`📞 Checking calendar and initiating call...`);
        setIsUrgentCall(false);
      }
      await new Promise(resolve => setTimeout(resolve, 3000)); // Increased to 3s for visibility
      setShowProcessingIndicator(false);
      await initiateCall(scenario.employeeId, '', scenario);
    } else if (scenario.failureReason && !scenario.shouldConnect) {
      // Old-style failure without connection
      addLog(`❌ Scenario failed: ${scenario.failureReason}`);
      addLog(`👤 Redirecting to human assistance...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('Connecting you with human reception...', 'info');
      await new Promise(resolve => setTimeout(resolve, 2000));
      addLog(`✓ Connected to human receptionist`);
    }

    setIsDemoMode(false);
    addLog(`✅ Demo scenario completed`);
  };

  // Exit demo mode and return to landing page
  const exitDemo = () => {
    // Refresh the page for a clean reset
    window.location.reload();
  };

  // Handle quick navigation
  const handleQuickNav = (section: string) => {
    if (section === 'employees' && employeeDirectoryRef.current) {
      employeeDirectoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'start' && startButtonRef.current) {
      startButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
      // Show processing indicator
      setShowProcessingIndicator(true);
      
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
        setShowProcessingIndicator(false);
        return;
      }

      addMessage(text, 'user');

      // Step 2: AI Processing (keep showing processing indicator)
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
      
      // Hide processing indicator before speaking
      setShowProcessingIndicator(false);

      // Step 3: Handle response
      await speakAndAddMessage(aiResponse.response, 'assistant');

      // Step 4: Handle call intent
      if (aiResponse.canProceedWithCall && aiResponse.employeeId) {
        // Extract visitor name and purpose for the call message
        const visitorName = aiResponse.visitorName || 'A visitor';
        const purpose = aiResponse.purposeOfVisit || 'to meet with you';
        
        // Create a scenario-like object for live calls
        const liveCallScenario: DemoScenarioData = {
          id: 'live-call',
          employeeId: aiResponse.employeeId,
          shouldConnect: true,
          messages: [],
          callMessage: aiResponse.fallbackEmployeeId 
            ? `Hello ${aiResponse.fallbackEmployee || 'there'}, ${visitorName} is waiting in the lobby. They were looking for ${aiResponse.employee}, who is currently unavailable. The purpose of their visit is ${purpose}. I see your calendar is free. Could you kindly assist this visitor?`
            : `Hello ${aiResponse.employee || 'there'}, ${visitorName} is waiting for you in the lobby. The purpose of their visit is ${purpose}. They are ready to speak with you now.`
        };
        
        // Use fallback employee if specified
        const targetEmployeeId = aiResponse.fallbackEmployeeId || aiResponse.employeeId;
        const targetEmployeeName = aiResponse.fallbackEmployee || aiResponse.employee;
        
        await initiateCall(targetEmployeeId, targetEmployeeName, liveCallScenario);
      }

      setIsProcessing(false);
      setConversationState('idle');
    } catch (error) {
      console.error('Error processing audio:', error);
      showNotification('An error occurred. Please try again.', 'error');
      setIsProcessing(false);
      setConversationState('idle');
      setShowProcessingIndicator(false);
    }
  };

  const speakAndAddMessage = async (text: string, role: 'user' | 'assistant') => {
    addMessage(text, role);

    if (role === 'assistant') {
      setConversationState('speaking');
      
      try {
        const ttsResponse = await fetch('/api/elevenlabs-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceType: 'female' }),
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

  const initiateCall = async (employeeId: string, employeeName: string, scenario?: DemoScenarioData) => {
    // Fetch employee details first
    const response = await fetch('/api/employees');
    const { employees } = await response.json();
    const employee = employees.find((emp: Employee) => emp.id === employeeId);

    if (!employee) return;

    setPendingEmployee(employee);
    
    // Show notification about connecting (urgent if applicable)
    if (scenario?.isUrgent) {
      showNotification(`🚨 URGENT: Escalating to ${employeeName || employee.name}...`, 'error');
    } else {
      showNotification(`Notifying ${employeeName || employee.name}...`, 'info');
    }

    // Simplified notification - Just AI sending message to employee
    const messages: NotificationMessage[] = [];
    
    // AI sends notification message (after 1 second)
    setTimeout(() => {
      messages.push({
        id: 1,
        sender: 'ai',
        content: scenario?.isUrgent 
          ? `🚨 URGENT: ${employee.name}, the AI receptionist needs immediate assistance at reception. A visitor requires human help.`
          : `Hi ${employee.name}, there's a visitor at reception who would like to speak with you regarding ${employee.department} matters. Connecting you now...`,
        timestamp: new Date(),
        status: 'sent',
      });
      setNotificationMessages([...messages]);
      setIsNotificationModalOpen(true);
    }, 1000);

    // Message is read (after 3 seconds)
    setTimeout(() => {
      messages[0].status = 'read';
      setNotificationMessages([...messages]);
      if (scenario?.isUrgent) {
        showNotification(`🚨 ${employeeName || employee.name} alerted - Urgent response requested`, 'error');
      } else {
        showNotification(`${employeeName || employee.name} notified. Connecting...`, 'success');
      }
    }, 3000);

    // Close modal and start countdown with ringing sound (after 5 seconds)
    setTimeout(() => {
      setIsNotificationModalOpen(false);
      
      // Start ringing sound (urgent or normal)
      if (scenario?.isUrgent) {
        addLog(`🚨 URGENT call ringing...`);
        callSoundsRef.current?.startRinging(true); // Pass true for urgent
      } else {
        addLog(`🔊 Call ringing...`);
        callSoundsRef.current?.startRinging(false);
      }
      
      // Start countdown
      let count = 5;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        
        if (count <= 0) {
          clearInterval(countdownInterval);
          setCountdown(undefined);
          // Stop ringing and start call
          callSoundsRef.current?.stopRinging();
          startCall(employeeId, scenario);
        }
      }, 1000);
    }, 5000);
  };

  const startCall = async (employeeId: string, scenario?: DemoScenarioData) => {
    // Fetch employee details
    const response = await fetch('/api/employees');
    const { employees } = await response.json();
    const employee = employees.find((emp: Employee) => emp.id === employeeId);

    if (employee) {
      setCurrentEmployee(employee);
      setIsCallActive(true);
      setConversationState('calling');
      
      // Play call connected sound
      addLog(`✅ Call connected`);
      await callSoundsRef.current?.playCallConnectedSound();
      
      // If this is a demo scenario with a call message, speak it via TTS
      if (scenario?.callMessage) {
        addLog(`🔊 Reading message to ${employee.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause after connection
        
        try {
          // Use TTS to speak the call message
          const ttsResponse = await fetch('/api/elevenlabs-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: scenario.callMessage, voiceType: 'female' }),
          });

          if (ttsResponse.ok) {
            const audioBlob = await ttsResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            const audio = new Audio(audioUrl);
            
            // Wait for audio to finish
            await new Promise<void>((resolve) => {
              audio.onended = () => {
                addLog(`✓ Message delivered to ${employee.name}`);
                URL.revokeObjectURL(audioUrl);
                resolve();
              };
              audio.onerror = () => {
                addLog(`⚠ Audio playback error`);
                URL.revokeObjectURL(audioUrl);
                resolve();
              };
              audio.play().catch((err) => {
                addLog(`⚠ Audio play failed: ${err.message}`);
                URL.revokeObjectURL(audioUrl);
                resolve();
              });
            });
          } else {
            addLog(`⚠ TTS service unavailable - showing text only`);
          }
        } catch (error: any) {
          addLog(`⚠ TTS error: ${error.message}`);
        }
        
        // Auto-end call after message is delivered
        addLog(`📞 Ending call...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Brief pause
        await callSoundsRef.current?.playCallEndSound();
        addLog(`✓ Call ended`);
        
        // End the call
        setTimeout(() => {
          endCall();
        }, 500);
      }
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCurrentEmployee(null);
    setConversationState('idle');
    setIsUrgentCall(false); // Reset urgent flag
    showNotification('Call ended', 'info');
    
    // Ask if there's anything else
    setTimeout(() => {
      speakAndAddMessage('Is there anything else I can help you with?', 'assistant');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0A0E27] to-[#1E2749] py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* DHRE Logo - Top Left Corner (Only on landing page) */}
      {!hasStarted && (
        <div className="fixed top-6 left-6 z-[9999]">
          <img 
            src="/DHRE.png" 
            alt="DHRE Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>
      )}

      {/* DigitalAbbot Logo - Bottom Right Corner (Only on landing page) */}
      {!hasStarted && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <img 
            src="/Digitalabbot.png" 
            alt="DigitalAbbot Logo" 
            className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      )}

      {/* Quick Navigation - Only on landing page */}
      {!hasStarted && (
        <QuickNav onNavigate={handleQuickNav} />
      )}

      {/* Camera Video - Top Right */}
      {isCameraActive && (
        <div className="fixed top-6 right-6 z-[9999] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-[#0A0E27] luxury-glow">
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
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl border border-red-400">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg" />
            <span className="tracking-wider">LIVE</span>
          </div>
        </div>
      )}

      {/* Luxury Header with Gradient Text */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-block mb-4">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
        </div>
        <h1 className="text-7xl font-bold mb-4 text-luxury-gradient tracking-tight">
          DHRE AI Receptionist
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
        <p className="text-2xl text-[#D4AF37] font-light tracking-wider">
          Dubai Holding Real Estate Virtual Concierge
        </p>
        <p className="text-sm text-gray-400 mt-2 font-light tracking-widest uppercase">
          Powered by DigitAlchemy® 
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto">
        <div className={`flex gap-6 ${messages.length === 0 ? 'justify-center' : ''}`}>
          {/* Left Column - Chat Section (Only show when there are messages) */}
          {messages.length > 0 && (
            <div className="w-96 flex-shrink-0">
              <ConversationHistory messages={messages} showProcessing={showProcessingIndicator} />
            </div>
          )}

          {/* Right Column - Vertical Demo Scenarios (Only show on landing page) */}
          {!hasStarted && messages.length === 0 && (
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] w-80">
              <div className="glass-morphism p-6 rounded-2xl border-2 border-[#D4AF37]/30 shadow-2xl">
                <VerticalDemoScenarios 
                  onSelectScenario={handleDemoScenario}
                  disabled={isDemoMode}
                />
              </div>
            </div>
          )}

          {/* Center/Main Column - Main Content */}
          <div className={messages.length === 0 ? 'w-full max-w-5xl mx-auto' : 'flex-1'}>
            {/* Avatar Section */}
            <div className="mb-8">
              <Avatar state={conversationState} isThinking={isProcessing} />
            </div>

            {/* Controls */}
            {!isCallActive && (
              <>
                {!hasStarted ? (
                  <div className="flex justify-center mb-12">
                    <button
                      ref={startButtonRef}
                      onClick={handleStart}
                      className="group relative inline-flex items-center justify-center px-16 py-7 text-2xl font-bold text-[#0A0E27] bg-gradient-to-r from-[#D4AF37] via-[#F0C852] to-[#D4AF37] rounded-full shadow-2xl hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transform hover:scale-105 transition-all duration-300 focus:outline-none border-2 border-[#F0C852] overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#F0C852] via-[#D4AF37] to-[#F0C852] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></span>
                      <svg 
                        className="w-10 h-10 mr-4 z-10" 
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span className="z-10 tracking-wide">Start Live Session</span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#F0C852] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                    </button>
                  </div>
                ) : isDemoMode ? (<>
                  <Controls
                    isListening={isListening}
                    isProcessing={isProcessing}
                    onStartListening={startListening}
                    onStopListening={stopListening}
                    disabled={conversationState === 'calling'}
                  />
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={exitDemo}
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transform hover:scale-105 transition-all duration-300 focus:outline-none border-2 border-red-500"
                    >
                      <svg 
                        className="w-6 h-6 mr-3" 
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="tracking-wide">Exit</span>
                    </button>
                  </div>
                  </>
                ) : (
                  <>
                  <Controls
                    isListening={isListening}
                    isProcessing={isProcessing}
                    onStartListening={startListening}
                    onStopListening={stopListening}
                    disabled={conversationState === 'calling'}
                  />
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={exitDemo}
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transform hover:scale-105 transition-all duration-300 focus:outline-none border-2 border-red-500"
                    >
                      <svg 
                        className="w-6 h-6 mr-3" 
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="tracking-wide">Exit</span>
                    </button>
                  </div>
                  </>
                )}
              </>
            )}

            {/* Demo Scenarios - shown before starting (now vertical on right) */}
            {!hasStarted && (
              <div ref={employeeDirectoryRef} className="mt-12">
                <EmployeeDirectory employees={employees} />
              </div>
            )}

            

            {/* Countdown Display */}
            {countdown !== undefined && countdown > 0 && (
              <div ref={countdownRef} className="text-center mt-12">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] text-[#0A0E27] text-5xl font-bold rounded-full shadow-2xl animate-pulse border-4 border-[#F0C852] luxury-glow">
                  {countdown}
                </div>
                <p className="mt-6 text-xl text-[#D4AF37] font-light tracking-wider">Establishing Connection...</p>
              </div>
            )}

            {/* Features Info - Luxury Cards */}
            {!hasStarted && (
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
                <div className="glass-morphism p-8 rounded-2xl shadow-2xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 group hover:scale-105 border border-[#D4AF37]/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <svg className="w-8 h-8 text-[#0A0E27]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
              </div>
              <h3 className="font-bold text-[#D4AF37] mb-3 text-lg tracking-wide">Voice Intelligence</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Natural language processing with human-like understanding</p>
            </div>

            <div className="glass-morphism p-8 rounded-2xl shadow-2xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 group hover:scale-105 border border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300">
                <svg className="w-8 h-8 text-[#0A0E27]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#D4AF37] mb-3 text-lg tracking-wide">Smart Routing</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Intelligent connection to the perfect contact instantly</p>
            </div>

            <div className="glass-morphism p-8 rounded-2xl shadow-2xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 group hover:scale-105 border border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300">
                <svg className="w-8 h-8 text-[#0A0E27]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#D4AF37] mb-3 text-lg tracking-wide">Instant Connect</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Seamless communication established in moments</p>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Call UI Overlay */}
      <CallUI
        isActive={isCallActive}
        employee={currentEmployee}
        onEndCall={endCall}
        countdown={countdown}
        isUrgent={isUrgentCall}
      />

      {/* Demo Logs - Fixed at bottom */}
      {demoLogs.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[9998] w-96 max-h-80 glass-morphism border-2 border-[#D4AF37] rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#050816] px-4 py-3 border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#D4AF37] tracking-wide">
                Demo Logs
              </span>
            </div>
            <button
              onClick={() => setDemoLogs([])}
              className="text-gray-400 hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={demoLogsRef} className="p-4 overflow-y-auto custom-scrollbar max-h-64 bg-[#0A0E27]/80">
            {demoLogs.map((log, index) => (
              <div
                key={index}
                className="text-xs text-gray-300 mb-2 font-mono leading-relaxed"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Employee Notification Modal */}
      <EmployeeNotificationModal
        isOpen={isNotificationModalOpen}
        employee={pendingEmployee}
        messages={notificationMessages}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </main>
  );
}
