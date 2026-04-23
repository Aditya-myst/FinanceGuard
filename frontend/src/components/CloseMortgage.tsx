import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract } from '../hooks/useContract';
import { Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

interface CloseMortgageProps {
  propertyHash: string;
  onSuccess: () => void;
}

export const CloseMortgage: React.FC<CloseMortgageProps> = ({ propertyHash, onSuccess }) => {
  const { contract, isConnected } = useContract();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleClose = async () => {
    if (!contract || !propertyHash) {
      toast.error('Property hash required');
      return;
    }

    try {
      setLoading(true);
      setStatus('pending');

      const tx = await contract.closeMortgage(propertyHash);
      await tx.wait();

      setStatus('success');
      toast.success('Mortgage closed successfully!');
      onSuccess();

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');
      toast.error(error.reason || 'Failed to close mortgage');

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
        className="card-glass p-6 rounded-2xl border-yellow-500/20 bg-yellow-900/10"
      >
        <p className="text-yellow-300 text-center font-semibold">
          🔐 Connect your wallet to close a mortgage
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
          <Lock className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold">Close Mortgage</h2>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Close this mortgage after the loan is fully repaid. This will free up the property for future financing.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClose}
        disabled={loading || !propertyHash}
        className="btn-danger w-full flex items-center justify-center gap-2"
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
            <Unlock />
            Close Mortgage
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-green-300 font-semibold">✅ Mortgage closed successfully!</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-red-300 font-semibold">❌ Failed to close mortgage</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};