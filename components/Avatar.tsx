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
        {/* Pulse rings for active states */}
        {(state === 'listening' || state === 'speaking') && (
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
            scale: state === 'speaking' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: state === 'speaking' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {/* Avatar Image - AI Receptionist */}
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src="/ai-receptionist.png"
              alt="AI Receptionist"
              className="w-full h-full object-cover"
            />
            {/* Overlay for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Speaking Animation - Sound Waves */}
          {state === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{
                      height: ['10px', '30px', '10px'],
                    }}
                    transition={{
                      duration: 0.8,
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
        <p className="text-2xl font-semibold text-gray-800">{getStateLabel()}</p>
        <p className="text-sm text-gray-500 mt-1">AI Receptionist</p>
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
