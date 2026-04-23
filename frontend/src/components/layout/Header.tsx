import React from 'react';
import { motion } from 'framer-motion';
import { Home, Circle } from 'lucide-react';
import { WalletConnect } from '../WalletConnect';
import { useContract } from '../../hooks/useContract';

export const Header: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useContract();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <Home className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                FinanceGuard
              </h1>
              <p className="text-xs text-gray-400">Blockchain Mortgage Security</p>
            </div>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Network Status */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <Circle className="text-green-500 text-xs animate-pulse" />
                <span className="text-sm text-green-300">Connected</span>
              </motion.div>
            )}

            {/* Wallet Connect */}
            <WalletConnect
              account={account}
              isConnected={isConnected}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};