'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border-emerald-600 text-emerald-200';
      case 'error':
        return 'bg-gradient-to-r from-red-900/90 to-red-800/90 border-red-600 text-red-200';
      default:
        return 'bg-gradient-to-r from-[#0A0E27]/90 to-[#1E2749]/90 border-[#D4AF37] text-[#D4AF37]';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-6 right-6 z-[10000]"
      >
        <div
          className={`flex items-center space-x-4 px-8 py-5 rounded-2xl shadow-2xl border-2 backdrop-blur-xl ${getColors()}`}
        >
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <p className="font-light text-base tracking-wide flex-1">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-70 transition-all duration-200 hover:rotate-90 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
