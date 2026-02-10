'use client';

import { motion } from 'framer-motion';
import { Play, Calendar, UserX, AlertCircle, ShieldAlert } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: 'calendar' | 'userx' | 'alert' | 'shield';
  color: string;
}

interface DemoScenariosProps {
  onSelectScenario: (scenarioId: string) => void;
  disabled?: boolean;
}

const scenarios: DemoScenario[] = [
  {
    id: 'scheduled',
    title: 'Scheduled Appointment',
    description: 'User has a pre-booked meeting with Ahmed Al Mansoori',
    icon: 'calendar',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'walk-in',
    title: 'Walk-in Request',
    description: 'User arrives without appointment, employee busy, forwarded to alternate',
    icon: 'userx',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'fail',
    title: 'Recognition Failure',
    description: 'Unable to understand employee name, escalated to human assistance',
    icon: 'alert',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'third-party-reference',
    title: 'Third-Party Reference',
    description: 'Visitor requests restricted materials, claims reference - fraud prevention handoff',
    icon: 'shield',
    color: 'from-purple-500 to-purple-600',
  },
];

const iconMap = {
  calendar: Calendar,
  userx: UserX,
  alert: AlertCircle,
  shield: ShieldAlert,
};

export default function DemoScenarios({ onSelectScenario, disabled }: DemoScenariosProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 tracking-wide">
         Scenarios
        </h2>
        <p className="text-gray-400 text-sm tracking-wider">
          Experience conversation flows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {scenarios.map((scenario, index) => {
          const Icon = iconMap[scenario.icon];
          return (
            <motion.button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              disabled={disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`relative group glass-morphism p-6 rounded-2xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 text-left ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
              }`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${scenario.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-[#D4AF37] mb-2 tracking-wide">
                {scenario.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {scenario.description}
              </p>

              {/* Play Button */}
              <div className="flex items-center space-x-2 text-[#D4AF37] text-sm font-medium">
                <Play className="w-4 h-4" />
                <span>Start</span>
              </div>

              {/* Hover Effect */}
              {!disabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
