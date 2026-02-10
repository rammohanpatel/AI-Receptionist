'use client';

import { Message } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ConversationHistoryProps {
  messages: Message[];
  showProcessing?: boolean;
}

export default function ConversationHistory({ messages, showProcessing = false }: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or processing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showProcessing]);

  // Don't render anything if no messages
  if (messages.length === 0) return null;

  return (
    <div className="sticky top-6 glass-morphism border-2 border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden h-[calc(100vh-8rem)] relative">
      {/* Luxury Header - Fixed */}
      <div className="bg-[#050816] border-b border-[#D4AF37]/30 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#D4AF37] tracking-wide text-center">
          Conversation History
        </h2>
        <p className="text-xs text-gray-400 text-center mt-1">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </p>
      </div>
      
      {/* Scroll indicator at top */}
      <div className="absolute top-20 left-0 right-0 h-8 bg-gradient-to-b from-[#0A0E27] to-transparent z-10 pointer-events-none flex items-start justify-center">
        <div className="text-[#D4AF37] text-xs animate-bounce mt-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Scrollable container - Takes remaining height */}
      <div className="h-[calc(100%-5rem)] overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin bg-[#0A0E27]/50 scroll-smooth">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#C5A028] text-[#0A0E27] border border-[#F0C852] shadow-[0_0_15px_rgba(212,175,55,0.3)] rounded-br-sm'
                  : 'bg-[#1E2749]/80 text-gray-100 border border-[#D4AF37]/30 backdrop-blur-lg rounded-bl-sm'
              }`}
            >
              <p className={`text-xs font-semibold mb-2 tracking-wider ${
                message.role === 'user' ? 'text-[#0A0E27]/70' : 'text-[#D4AF37]'
              }`}>
                {message.role === 'user' ? 'YOU' : 'DHRE AI CONCIERGE'}
              </p>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs mt-2 opacity-60">
                {message.timestamp.toLocaleTimeString('en-US', { 
                  timeZone: 'Asia/Dubai',
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* Processing Indicator - Enhanced Visibility */}
        {showProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start sticky bottom-0 pb-2 bg-gradient-to-t from-[#0A0E27] to-transparent pt-4"
          >
            <div className="max-w-[85%] px-5 py-4 rounded-2xl bg-gradient-to-br from-[#1E2749] to-[#2A3A5F] text-gray-100 border-2 border-[#D4AF37] backdrop-blur-lg rounded-bl-sm shadow-2xl shadow-[#D4AF37]/20">
              <p className="text-xs font-bold mb-3 tracking-wider text-[#D4AF37] flex items-center space-x-2">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>DHRE AI CONCIERGE</span>
              </p>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce shadow-lg shadow-[#D4AF37]/50" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
                  <div className="w-3 h-3 bg-[#F0C852] rounded-full animate-bounce shadow-lg shadow-[#F0C852]/50" style={{ animationDelay: '200ms', animationDuration: '1s' }}></div>
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-bounce shadow-lg shadow-[#D4AF37]/50" style={{ animationDelay: '400ms', animationDuration: '1s' }}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-white">Processing your request...</span>
                  <span className="text-xs text-gray-400 mt-0.5">Checking calendar & availability</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
