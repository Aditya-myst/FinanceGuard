import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-white/10 bg-slate-900/30 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">About</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Preventing double financing through blockchain technology. Secure, transparent, and immutable.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-purple-400 transition cursor-pointer">🔐 Privacy Protection</li>
              <li className="hover:text-purple-400 transition cursor-pointer">⚡ Instant Verification</li>
              <li className="hover:text-purple-400 transition cursor-pointer">🛡️ Fraud Prevention</li>
              <li className="hover:text-purple-400 transition cursor-pointer">📊 Real-time Alerts</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-purple-400 transition cursor-pointer">Documentation</li>
              <li className="hover:text-purple-400 transition cursor-pointer">API Reference</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Whitepaper</li>
              <li className="hover:text-purple-400 transition cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-700/50 rounded-lg hover:bg-purple-600 transition"
              >
                <ExternalLink className="text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-700/50 rounded-lg hover:bg-purple-600 transition"
              >
                <ExternalLink className="text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-700/50 rounded-lg hover:bg-purple-600 transition"
              >
                <ExternalLink className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 FinanceGuard. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-purple-400 transition">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition">Terms</a>
              <a href="#" className="hover:text-purple-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};