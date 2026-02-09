'use client';

import { Message } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ConversationHistoryProps {
  messages: Message[];
}

export default function ConversationHistory({ messages }: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Don't render anything if no messages
  if (messages.length === 0) return null;

  return (
    <div className="sticky top-6 glass-morphism border-2 border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden h-[calc(100vh-8rem)]">
      {/* Luxury Header - Fixed */}
      <div className="bg-[#050816] border-b border-[#D4AF37]/30 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#D4AF37] tracking-wide text-center">
          Conversation History
        </h2>
        <p className="text-xs text-gray-400 text-center mt-1">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </p>
      </div>
      
      {/* Scrollable container - Takes remaining height */}
      <div className="h-[calc(100%-5rem)] overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin bg-[#0A0E27]/50">
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
                {message.role === 'user' ? 'YOU' : 'AI CONCIERGE'}
              </p>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs mt-2 opacity-60">
                {message.timestamp.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
