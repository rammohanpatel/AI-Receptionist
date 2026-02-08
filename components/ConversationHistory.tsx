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

  if (messages.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 relative z-10">
      {/* Luxury Header */}
      <div className="text-center mb-6">
        <div className="inline-block">
          <h2 className="text-xl font-light text-[#D4AF37] tracking-[0.3em] uppercase mb-2">Conversation</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        </div>
      </div>
      
      {/* Scrollable container with max height */}
      <div className="max-h-[450px] overflow-y-auto pr-3 space-y-5 scrollbar-thin">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#C5A028] text-[#0A0E27] border border-[#F0C852] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-[#0A0E27]/80 text-gray-100 border border-[#D4AF37]/30 backdrop-blur-lg'
              }`}
            >
              <p className={`text-xs font-semibold mb-2 tracking-wider uppercase ${
                message.role === 'user' ? 'text-[#0A0E27]/70' : 'text-[#D4AF37]'
              }`}>
                {message.role === 'user' ? '◆ You' : '◆ AI Concierge'}
              </p>
              <p className="text-base leading-relaxed font-light">{message.content}</p>
            </div>
          </motion.div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
