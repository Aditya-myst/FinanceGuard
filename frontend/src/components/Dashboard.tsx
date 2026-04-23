import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Lock, Trophy, Rocket } from 'lucide-react';

const stats = [
  {
    label: 'Properties Protected',
    value: '12,547',
    icon: Lock,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    label: 'Frauds Prevented',
    value: '847',
    icon: Trophy,
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    label: 'Total Value Secured',
    value: '$2.3B',
    icon: TrendingUp,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    label: 'Transactions/Min',
    value: '1,234',
    icon: Rocket,
    gradient: 'from-orange-600 to-red-600',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ translateY: -5 }}
          className="card-glass p-6 rounded-xl group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg group-hover:scale-110 transition`}>
              <stat.icon className="text-white text-xl" />
            </div>
            <span className="text-xs font-bold text-green-400">↑ 12.5%</span>
          </div>

          <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
          <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>

          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${60 + index * 10}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full bg-gradient-to-r ${stat.gradient}`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};