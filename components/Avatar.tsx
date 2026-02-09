'use client';

import { motion } from 'framer-motion';
import { ConversationState } from '@/types';

interface AvatarProps {
  state: ConversationState;
  isThinking?: boolean;
}

export default function Avatar({ state, isThinking }: AvatarProps) {
  const getStateColor = () => {
    switch (state) {
      case 'listening':
        return 'bg-blue-500';
      case 'thinking':
        return 'bg-yellow-500';
      case 'speaking':
        return 'bg-green-500';
      case 'calling':
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStateLabel = () => {
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
      {/* Avatar Circle with Animation */}
      <div className="relative">
        {/* Enhanced Pulse rings for speaking - Multiple layers */}
        {state === 'speaking' && (
          <>
            {/* Gold expanding rings */}
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
                delay: 0.6,
              }}
            />
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0C852] blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        {/* Pulse rings for listening state */}
        {state === 'listening' && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full ${getStateColor()} opacity-20`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full ${getStateColor()} opacity-20`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Main Avatar */}
        <motion.div
          className={`relative w-48 h-48 rounded-full ${getStateColor()} flex items-center justify-center shadow-2xl`}
          animate={{
            scale: state === 'speaking' ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: state === 'speaking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {/* Avatar Image - AI Receptionist */}
          <motion.div 
            className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#D4AF37]"
            animate={{
              borderColor: state === 'speaking' 
                ? ['#D4AF37', '#F0C852', '#D4AF37'] 
                : '#D4AF37',
            }}
            transition={{
              duration: 1.5,
              repeat: state === 'speaking' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <motion.img
              src="/receptionist.png"
              alt="AI Receptionist"
              className="w-full h-full object-cover"
              animate={{
                scale: state === 'speaking' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.8,
                repeat: state === 'speaking' ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
            {/* Dynamic overlay that pulses during speaking */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 to-transparent"
              animate={{
                opacity: state === 'speaking' ? [0.3, 0.6, 0.3] : 0.3,
              }}
              transition={{
                duration: 1.2,
                repeat: state === 'speaking' ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Speaking Animation - Enhanced Sound Wave Bars */}
          {state === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex space-x-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-[#D4AF37] to-[#F0C852] rounded-full shadow-lg"
                    animate={{
                      height: ['12px', '40px', '12px'],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Thinking Spinner */}
        {isThinking && (
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full" />
          </motion.div>
        )}
      </div>

      {/* State Label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.p 
          className="text-2xl font-semibold text-[#D4AF37] tracking-wide"
          animate={{
            scale: state === 'speaking' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: state === 'speaking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {getStateLabel()}
        </motion.p>
        <p className="text-sm text-gray-400 mt-1 tracking-wider">DigitalAbbot AI Assistant</p>
      </motion.div>

      {/* Visual Indicator for Listening */}
      {state === 'listening' && (
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-blue-500 text-sm flex items-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span>I'm listening</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
