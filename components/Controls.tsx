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
    <div className="flex flex-col items-center justify-center mt-12 relative z-10">
      {/* Main Microphone Button - Luxury Style */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        onClick={isListening ? onStopListening : onStartListening}
        disabled={disabled || isProcessing}
        className={`relative p-10 rounded-full shadow-2xl transition-all duration-300 border-4 ${
          isListening
            ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
            : 'bg-gradient-to-br from-[#D4AF37] to-[#C5A028] hover:from-[#F0C852] hover:to-[#D4AF37] border-[#F0C852] shadow-[0_0_40px_rgba(212,175,55,0.5)]'
        } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-14 h-14 text-white drop-shadow-lg" />
        ) : (
          <Mic className="w-14 h-14 text-[#0A0E27] drop-shadow-lg" />
        )}

        {/* Luxury Pulse effect when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500 border-2 border-red-400"
              animate={{
                scale: [1, 1.6],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500 border-2 border-red-400"
              animate={{
                scale: [1, 1.6],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1,
              }}
            />
          </>
        )}

        {/* Idle glow effect */}
        {!isListening && !disabled && !isProcessing && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#D4AF37]"
            animate={{
              scale: [1, 1.3],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Luxury Status Text */}
      <div className="text-center mt-8">
        <p className="text-2xl font-light text-[#D4AF37] tracking-wider mb-2">
          {isProcessing
            ? 'Processing Request...'
            : isListening
            ? 'Listening...'
            : 'Ready to Assist'}
        </p>
        <p className="text-sm text-gray-400 font-light tracking-widest uppercase">
          {isListening ? 'Click to conclude' : 'Click to speak'}
        </p>
        
        {/* Decorative divider */}
        <div className="mt-4 w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
      </div>
    </div>
  );
}
