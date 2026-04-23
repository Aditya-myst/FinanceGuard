import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract } from '../hooks/useContract';
import { parseEther } from 'ethers';
import { FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterMortgageProps {
  propertyHash: string;
  onSuccess: () => void;
}

export const RegisterMortgage: React.FC<RegisterMortgageProps> = ({
  propertyHash,
  onSuccess,
}) => {
  const { contract, isConnected } = useContract();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleRegister = async () => {
    if (!contract || !propertyHash || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setStatus('pending');

      const mortgageAmount = parseEther(amount);
      const tx = await contract.registerMortgage(propertyHash, mortgageAmount);

      await tx.wait();

      setStatus('success');
      setAmount('');
      toast.success('Mortgage registered successfully!');
      onSuccess();

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');

      if (error.reason?.includes('Double financing')) {
        toast.error('⚠️ Double financing detected! Alert sent to primary financier.');
      } else {
        toast.error(error.reason || 'Failed to register mortgage');
      }

      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-6 rounded-2xl mb-6 border-yellow-500/20 bg-yellow-900/10"
      >
        <p className="text-yellow-300 text-center font-semibold">
          🔐 Connect your wallet to register a mortgage
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6 rounded-2xl mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
          <FileText className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold">Register Mortgage</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Mortgage Amount (ETH)
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
            step="0.01"
            className="input-field"
          />
          <p className="text-xs text-gray-400 mt-2">
            💡 Estimated gas: ~193K gas (varies by network)
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegister}
          disabled={loading || !propertyHash}
          className="btn-success w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Processing...
            </>
          ) : (
            <>
              <Send />
              Register Mortgage
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-green-300 font-semibold">✅ Mortgage registered successfully!</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-red-300 font-semibold">❌ Transaction failed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};