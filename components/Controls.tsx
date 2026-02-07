'use client';

import { Mic, MicOff, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
}

export default function Controls({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening,
  disabled,
}: ControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      {/* Main Microphone Button */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={isListening ? onStopListening : onStartListening}
        disabled={disabled || isProcessing}
        className={`relative p-8 rounded-full shadow-2xl transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-12 h-12 text-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}

        {/* Pulse effect when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500 opacity-20"
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
              className="absolute inset-0 rounded-full bg-red-500 opacity-20"
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
      </motion.button>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          {isProcessing
            ? 'Processing...'
            : isListening
            ? 'Listening... (Click to stop)'
            : 'Click to speak'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {isListening ? 'Speak naturally' : 'Press and speak your request'}
        </p>
      </div>
    </div>
  );
}
