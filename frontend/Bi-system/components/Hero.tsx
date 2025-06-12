import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 -left-4 w-48 md:w-72 h-48 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 -right-4 w-48 md:w-72 h-48 md:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute -bottom-8 left-20 w-48 md:w-72 h-48 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-0">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 gradient-text"
          >
            Добро пожаловать в систему анализа образовательных данных ВУЗа!
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl mb-8 md:mb-12 text-gray-700 px-4 md:px-0"
          >
            Инновационная платформа для студентов и преподавателей, предоставляющая мощные инструменты для анализа и управления образовательным процессом.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Link 
              href="/login" 
              className="glass-button text-blue-600 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto hover:scale-105 transition-transform"
            >
              Войти в систему
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 