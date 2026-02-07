'use client';

import { Message } from '@/types';
import { motion } from 'framer-motion';

interface ConversationHistoryProps {
  messages: Message[];
}

export default function ConversationHistory({ messages }: ConversationHistoryProps) {
  if (messages.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: message.role === 'user' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-md px-6 py-3 rounded-2xl shadow-md ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            <p className="text-sm font-medium mb-1">
              {message.role === 'user' ? 'You' : 'AI Receptionist'}
            </p>
            <p>{message.content}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
