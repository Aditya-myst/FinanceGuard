import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract } from '../hooks/useContract';
import { Eye, RefreshCw, Shield } from 'lucide-react';

interface PropertyStatusProps {
  propertyHash: string;
}

export const PropertyStatus: React.FC<PropertyStatusProps> = ({ propertyHash }) => {
  const { contract } = useContract();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!contract || !propertyHash) return;

    try {
      setLoading(true);
      const [financier, timestamp, isActive, amount] = await contract.getMortgageDetails(propertyHash);

      setStatus({
        financier,
        timestamp: Number(timestamp),
        isActive,
        amount: amount.toString(),
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [propertyHash, contract]);

  if (!propertyHash) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-8 rounded-2xl text-center"
      >
        <Eye className="text-4xl text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400">Generate a property hash first</p>
      </motion.div>
    );
  }

  if (!status || status.financier === '0x0000000000000000000000000000000000000000') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
            <Shield className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Property Status</h2>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-blue-300 font-semibold">
            This property has no active mortgage
          </p>
          <p className="text-blue-400 text-sm mt-2">
            Ready to be mortgaged
          </p>
        </div>
      </motion.div>
    );
  }

  const statusDetails = [
    {
      label: 'Financier Address',
      value: `${status.financier.substring(0, 10)}...${status.financier.substring(status.financier.length - 8)}`,
      icon: '🏦',
    },
    {
      label: 'Status',
      value: status.isActive ? 'Active' : 'Closed',
      badge: status.isActive ? 'success' : 'danger',
      icon: status.isActive ? '✅' : '❌',
    },
    {
      label: 'Mortgage Amount',
      value: `${(Number(status.amount) / 1e18).toFixed(4)} ETH`,
      icon: '💰',
    },
    {
      label: 'Registration Date',
      value: new Date(status.timestamp * 1000).toLocaleDateString(),
      icon: '📅',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6 rounded-2xl sticky top-24"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
            <Shield className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Property Status</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={checkStatus}
          disabled={loading}
          className="p-2 hover:bg-purple-600/30 rounded-lg transition"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} />
        </motion.button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {statusDetails.map((detail, index) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-lg hover:border-purple-500/30 transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                  <span className="text-lg">{detail.icon}</span>
                  {detail.label}
                </span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-sm font-semibold ${
                    detail.badge === 'success'
                      ? 'badge-success'
                      : detail.badge === 'danger'
                      ? 'badge-danger'
                      : 'text-purple-300'
                  }`}
                >
                  {detail.value}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={checkStatus}
        disabled={loading}
        className="btn-secondary w-full mt-6 flex items-center justify-center gap-2"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} />
        Refresh Status
      </motion.button>
    </motion.div>
  );
};