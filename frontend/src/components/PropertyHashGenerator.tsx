import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContract } from '../hooks/useContract';
import { Check, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PropertyHashGeneratorProps {
  onHashGenerated: (hash: string) => void;
}

export const PropertyHashGenerator: React.FC<PropertyHashGeneratorProps> = ({
  onHashGenerated,
}) => {
  const { contract } = useContract();
  const [address, setAddress] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!contract || !address || !propertyId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const generatedHash = await contract.hashPropertyDetails(address, propertyId);
      setHash(generatedHash);
      onHashGenerated(generatedHash);
      toast.success('Hash generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate hash');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    toast.success('Copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6 rounded-2xl mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
          <CheckCircle className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold">Generate Property Hash</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Property Address
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main Street, Downtown"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Property ID
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            placeholder="e.g., 12345"
            className="input-field"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateHash}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Generating...
            </>
          ) : (
            <>
              <CheckCircle />
              Generate Hash
            </>
          )}
        </motion.button>

        {hash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Check className="text-green-400 text-sm" />
              <p className="text-sm font-semibold text-gray-300">Generated Hash:</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-black/30 p-2 rounded overflow-x-auto text-purple-300">
                {hash}
              </code>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyHash}
                className="p-2 hover:bg-purple-600/30 rounded transition"
              >
                <Copy className="text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};