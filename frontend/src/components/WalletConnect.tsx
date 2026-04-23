import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X } from 'lucide-react';

interface WalletConnectProps {
  account: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  account,
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  const shortAddress = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : '';

  return (
    <AnimatePresence mode="wait">
      {isConnected ? (
        <motion.div
          key="connected"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-3"
        >
          <div className="card-glass px-4 py-2 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-sm font-mono text-green-300">{shortAddress}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDisconnect}
            className="btn-danger px-4 py-2 flex items-center gap-2"
          >
            <X className="text-sm" />
            Disconnect
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          key="disconnected"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="btn-primary flex items-center gap-2"
        >
          <Wallet className="text-sm" />
          Connect Wallet
        </motion.button>
      )}
    </AnimatePresence>
  );
};