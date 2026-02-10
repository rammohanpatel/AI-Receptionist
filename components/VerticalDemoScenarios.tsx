'use client';

import { motion } from 'framer-motion';
import { Play, Calendar, UserX, AlertCircle } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: 'calendar' | 'userx' | 'alert';
  color: string;
}

interface VerticalDemoScenariosProps {
  onSelectScenario: (scenarioId: string) => void;
  disabled?: boolean;
}

const scenarios: DemoScenario[] = [
  {
    id: 'scheduled',
    title: 'Scheduled Appointment',
    description: 'User has a pre-booked meeting',
    icon: 'calendar',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'walk-in',
    title: 'Walk-in Request',
    description: 'Arrive without appointment',
    icon: 'userx',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'fail',
    title: 'Recognition Failure',
    description: 'Escalated to human assistance',
    icon: 'alert',
    color: 'from-red-500 to-red-600',
  },
];

const iconMap = {
  calendar: Calendar,
  userx: UserX,
  alert: AlertCircle,
};

export default function VerticalDemoScenarios({ onSelectScenario, disabled }: VerticalDemoScenariosProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#D4AF37] mb-1 tracking-wide">
          Demo Scenarios
        </h3>
        <p className="text-gray-500 text-xs">
          Try different flows
        </p>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const Icon = iconMap[scenario.icon];
          return (
            <motion.button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              disabled={disabled}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`relative w-full group glass-morphism p-4 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 text-left ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`w-10 h-10 bg-gradient-to-br ${scenario.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#D4AF37] mb-1 tracking-wide">
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                {/* Play Icon */}
                <Play className="w-5 h-5 text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform" />
              </div>

              {/* Hover Effect */}
              {!disabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
