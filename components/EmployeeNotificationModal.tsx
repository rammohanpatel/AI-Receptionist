'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Phone, MessageSquare } from 'lucide-react';
import { Employee } from '@/types';

interface NotificationMessage {
  id: number;
  sender: 'ai' | 'employee';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
}

interface EmployeeNotificationModalProps {
  isOpen: boolean;
  employee: Employee | null;
  messages: NotificationMessage[];
  onClose: () => void;
}

export default function EmployeeNotificationModal({
  isOpen,
  employee,
  messages,
  onClose,
}: EmployeeNotificationModalProps) {
  if (!employee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#0A0E27] to-[#1E2749] rounded-2xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden">
              {/* Header - Teams Style */}
              <div className="bg-[#050816] border-b border-[#D4AF37]/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Employee Avatar */}
                    <div className="relative">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-12 h-12 rounded-full border-2 border-[#D4AF37] object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050816]" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-[#D4AF37] tracking-wide">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-400">{employee.title} • {employee.department}</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[#D4AF37]/10 transition-colors text-gray-400 hover:text-[#D4AF37]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Area - Teams Style */}
              <div className="px-6 py-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className={`flex ${
                        message.sender === 'ai' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.sender === 'ai' ? 'order-2' : 'order-1'
                        }`}
                      >
                        {/* Sender Label */}
                        <div
                          className={`text-xs text-gray-400 mb-1 px-2 ${
                            message.sender === 'ai' ? 'text-left' : 'text-right'
                          }`}
                        >
                          {message.sender === 'ai' ? 'AI Receptionist' : employee.name}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-5 py-3 shadow-lg ${
                            message.sender === 'ai'
                              ? 'bg-[#1E2749] border border-[#D4AF37]/30 rounded-tl-sm'
                              : 'bg-gradient-to-br from-[#D4AF37] to-[#C5A028] text-[#0A0E27] rounded-tr-sm'
                          }`}
                        >
                          <p className={`text-sm leading-relaxed ${
                            message.sender === 'ai' ? 'text-gray-200' : 'text-[#0A0E27] font-medium'
                          }`}>
                            {message.content}
                          </p>
                          
                          {/* Timestamp and Status */}
                          <div className={`flex items-center space-x-2 mt-2 text-xs ${
                            message.sender === 'ai' ? 'text-gray-500' : 'text-[#0A0E27]/70'
                          }`}>
                            <span>
                              {message.timestamp.toLocaleTimeString('en-US', {
                                timeZone: 'Asia/Dubai',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {message.status && message.sender === 'ai' && (
                              <span className="flex items-center">
                                {message.status === 'sent' && (
                                  <Check className="w-3 h-3 text-gray-500" />
                                )}
                                {message.status === 'read' && (
                                  <div className="flex">
                                    <Check className="w-3 h-3 text-[#D4AF37]" />
                                    <Check className="w-3 h-3 text-[#D4AF37] -ml-1.5" />
                                  </div>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Avatar for AI messages */}
                      {message.sender === 'ai' && (
                        <div className="order-1 mr-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C5A028] flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-[#0A0E27]" />
                          </div>
                        </div>
                      )}

                      {/* Avatar for employee messages */}
                      {message.sender === 'employee' && (
                        <div className="order-2 ml-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-8 h-8 rounded-full border-2 border-[#D4AF37] object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer with Status */}
              <div className="bg-[#050816] border-t border-[#D4AF37]/30 px-6 py-4">
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <span className="text-sm text-[#D4AF37] font-medium tracking-wide">
                    Notifying {employee.name}...
                  </span>
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export type { NotificationMessage };
