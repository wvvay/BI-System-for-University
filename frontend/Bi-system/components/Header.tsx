import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <Link href="/" className="text-xl md:text-2xl font-bold gradient-text hover:scale-105 transition-transform">
              BI-System
            </Link>
          </motion.div>
          
          {/* Мобильное меню-бургер */}
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>

          {/* Десктопная навигация */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:flex space-x-8"
          >
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transition-transform">
              О сервисе
            </Link>
            <Link href="/contacts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transition-transform">
              Контакты
            </Link>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link 
              href="/login" 
              className="glass-button text-blue-600 hover:scale-105 transition-transform"
            >
              Войти
            </Link>
            <select className="px-3 py-2 rounded-full glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:scale-105 transition-transform">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </motion.div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 py-4 border-t border-gray-200"
            >
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-4"
              >
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  О сервисе
                </Link>
                <Link 
                  href="/contacts" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Контакты
                </Link>
                <Link 
                  href="/login" 
                  className="glass-button text-blue-600 w-full text-center hover:scale-105 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Войти
                </Link>
                <select className="w-full px-3 py-2 rounded-full glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:scale-105 transition-transform">
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header; 