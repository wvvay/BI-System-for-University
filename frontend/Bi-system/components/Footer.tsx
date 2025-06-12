import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-8 md:py-16 glass-effect"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 gradient-text">BI-System</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Инновационная платформа для анализа образовательных данных
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 gradient-text">Ссылки</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base hover:scale-105 transition-transform">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base hover:scale-105 transition-transform">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base hover:scale-105 transition-transform">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 gradient-text">Контакты</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <span>📧</span>
                <span>mudarisov345@gmail.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <span>📞</span>
                <span>+7 (XXX) XXX-XX-XX</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <span>📍</span>
                <span>г. Казань, ул. Красносельская 51, к4</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 gradient-text">Социальные сети</h4>
            <div className="flex justify-center sm:justify-start space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://vk.com/e4zyvvay"
                className="glass-effect p-2 md:p-3 rounded-full"
              >
                <span className="text-lg md:text-xl">VK</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://t.me/EasyVVay"
                className="glass-effect p-2 md:p-3 rounded-full"
              >
                <span className="text-lg md:text-xl">TG</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.youtube.com/@FIREBACK"
                className="glass-effect p-2 md:p-3 rounded-full"
              >
                <span className="text-lg md:text-xl">YT</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/20 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-600 text-sm md:text-base"
        >
          <p>© 2025 BI-System. Все права защищены.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 