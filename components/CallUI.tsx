'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Video } from 'lucide-react';
import { Employee } from '@/types';

interface CallUIProps {
  isActive: boolean;
  employee: Employee | null;
  onEndCall: () => void;
  countdown?: number;
}

export default function CallUI({ isActive, employee, onEndCall, countdown }: CallUIProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCallStatus('connecting');
      setCallDuration(0);
      return;
    }

    // Simulate call progression
    const statusTimer = setTimeout(() => {
      setCallStatus('ringing');
      
      setTimeout(() => {
        setCallStatus('connected');
      }, 3000);
    }, 1000);

    return () => clearTimeout(statusTimer);
  }, [isActive]);

  useEffect(() => {
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (countdown !== undefined && countdown > 0) {
      return `Connecting in ${countdown}s...`;
    }
    switch (callStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  if (!isActive || !employee) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      >
        {/* Teams-like Call Interface */}
        <div className="w-full h-full flex flex-col">
          {/* Top Bar - Enhanced Visibility */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-center border-b-2 border-[#D4AF37] shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-xl font-bold text-[#D4AF37]">{getStatusMessage()}</span>
            </div>
            <div className="text-sm text-gray-400 font-semibold tracking-wide">DHRE Call System</div>
          </div>

          {/* Main Call Area */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teams-purple to-teams-blue p-8">
            <div className="text-center">
              {/* Employee Avatar */}
              <motion.div
                className="relative mb-8"
                animate={{
                  scale: callStatus === 'ringing' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: callStatus === 'ringing' ? Infinity : 0,
                }}
              >
                {/* Ringing Animation */}
                {callStatus === 'ringing' && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white opacity-20"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.2, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white opacity-20"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.2, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.5,
                      }}
                    />
                  </>
                )}

                <div className="relative w-48 h-48 mx-auto bg-gray-700 rounded-full flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-24 h-24 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
              </motion.div>

              {/* Employee Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-white mb-2">{employee.name}</h2>
                <p className="text-xl text-gray-200 mb-1">{employee.title}</p>
                <p className="text-lg text-gray-300">{employee.department}</p>
              </motion.div>

              {/* Call Status */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {callStatus === 'connected' && (
                  <div className="inline-flex items-center space-x-2 bg-green-500 bg-opacity-20 px-6 py-3 rounded-full">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium">Connected</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-gray-900 p-8">
            <div className="flex justify-center items-center space-x-6">
              {/* Mute Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`p-5 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </motion.button>

              {/* End Call Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEndCall}
                className="p-6 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-lg"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </motion.button>

              {/* Video Button (disabled for demo) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled
                className="p-5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors opacity-50 cursor-not-allowed"
              >
                <Video className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            {/* Call Info */}
            <div className="text-center mt-6 text-gray-400 text-sm">
              <p>This is a simulated call for demonstration purposes</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
