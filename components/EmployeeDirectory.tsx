'use client';

import { motion } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { Employee } from '@/types';

interface EmployeeDirectoryProps {
  employees: Employee[];
}

export default function EmployeeDirectory({ employees }: EmployeeDirectoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-2xl border border-[#D4AF37]/30 max-w-6xl mx-auto mb-12"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-[#0A0E27]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#D4AF37] tracking-wide">
            Employee Directory
          </h3>
          <p className="text-xs text-gray-400 tracking-wider">
            {employees.length} employees available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#0A0E27]/50 rounded-xl p-4 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
          >
            <div className="flex items-start space-x-3">
              {/* Avatar Placeholder */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#0A0E27] font-bold text-lg">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-[#D4AF37] truncate">
                    {employee.name}
                  </h4>
                  <div className={`flex items-center space-x-1 ${
                    employee.isAvailable ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    <Circle className={`w-2 h-2 ${
                      employee.isAvailable ? 'fill-green-500' : 'fill-gray-500'
                    }`} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 truncate mb-1">
                  {employee.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {employee.department}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
