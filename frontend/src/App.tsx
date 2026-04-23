import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useContract } from './hooks/useContract';

// Layout
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Components
import { Dashboard } from './components/Dashboard';
import { PropertyHashGenerator } from './components/PropertyHashGenerator';
import { RegisterMortgage } from './components/RegisterMortgage';
import { PropertyStatus } from './components/PropertyStatus';
import { CloseMortgage } from './components/CloseMortgage';

import './App.css';

function App() {
  const { isConnected } = useContract();
  const [propertyHash, setPropertyHash] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-900" />
        <motion.div
          className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 right-0 w-full h-full bg-gradient-to-l from-pink-600/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 10,
          }}
        />
      </div>

      {/* Content */}
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            // Welcome Screen
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[70vh] flex items-center justify-center"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-2xl"
              >
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Welcome to FinanceGuard
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-300 mb-8 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Secure your real estate financing with blockchain technology.
                  Prevent double financing and protect your assets with our advanced
                  verification system.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-4 text-lg"
                  >
                    📚 Learn More
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary px-8 py-4 text-lg"
                  >
                    📖 Documentation
                  </motion.button>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { icon: '🔐', title: 'Privacy Protected', desc: 'Hashed data, no exposure' },
                    { icon: '⚡', title: 'Instant Verification', desc: 'Real-time fraud detection' },
                    { icon: '🛡️', title: 'Fraud Prevention', desc: '99.9% effective protection' },
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature.title}
                      whileHover={{ translateY: -5 }}
                      className="card-glass p-4 rounded-lg"
                    >
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            // Dashboard
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Dashboard />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2">
                  <PropertyHashGenerator onHashGenerated={setPropertyHash} />
                  <RegisterMortgage propertyHash={propertyHash} onSuccess={handleRefresh} />
                  <CloseMortgage propertyHash={propertyHash} onSuccess={handleRefresh} />
                </div>

                {/* Right Column */}
                <div>
                  <PropertyStatus key={refreshKey} propertyHash={propertyHash} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#ffffff',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            style: {
              borderColor: '#10b981',
            },
          },
          error: {
            style: {
              borderColor: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

export default App;