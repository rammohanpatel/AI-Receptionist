'use client';

import { motion } from 'framer-motion';
import { Users, MessageSquare, Play } from 'lucide-react';

interface QuickNavProps {
  onNavigate: (section: string) => void;
}

export default function QuickNav({ onNavigate }: QuickNavProps) {
  const navItems = [
    { id: 'employees', label: 'Directory', icon: Users },
    { id: 'start', label: 'Start Live', icon: Play },
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] space-y-3">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative glass-morphism p-3 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 bg-[#0A0E27]/80 hover:bg-[#1E2749]/90"
            title={item.label}
          >
            <Icon className="w-5 h-5 text-[#D4AF37]" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1E2749] border border-[#D4AF37]/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              <span className="text-xs font-semibold text-[#D4AF37]">{item.label}</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                <div className="w-2 h-2 bg-[#1E2749] border-l border-b border-[#D4AF37]/50 transform rotate-45"></div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
