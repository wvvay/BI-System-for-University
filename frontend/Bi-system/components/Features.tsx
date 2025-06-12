import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const studentFeatures = [
    {
      title: 'Успеваемость',
      description: 'Отслеживание оценок и среднего балла в реальном времени',
      icon: '📊'
    },
    {
      title: 'Посещаемость',
      description: 'Статистика пропусков и посещаемости занятий',
      icon: '📅'
    },
    {
      title: 'Научная работа',
      description: 'Мониторинг исследовательской деятельности',
      icon: '🔬'
    },
    {
      title: 'Расчет стипендии',
      description: 'Автоматический расчет на основе успеваемости и посещаемости',
      icon: '💰'
    }
  ];

  const teacherFeatures = [
    {
      title: 'Аналитика успеваемости',
      description: 'Подробный анализ успеваемости студентов',
      icon: '📈'
    },
    {
      title: 'Аналитика посещаемости',
      description: 'Мониторинг посещаемости занятий',
      icon: '👥'
    },
    {
      title: 'KPI и зарплата',
      description: 'Расчет показателей эффективности и зарплаты',
      icon: '📊'
    },
    {
      title: 'Научная деятельность',
      description: 'Учет научной работы и проектов',
      icon: '🔍'
    }
  ];

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
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 gradient-text"
        >
          Возможности платформы
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="glass-effect p-4 md:p-8 rounded-2xl card-hover"
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 gradient-text"
            >
              Для студентов
            </motion.h3>
            <div className="grid gap-4 md:gap-6">
              {studentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 md:space-x-4 glass-effect p-3 md:p-4 rounded-xl hover:scale-105 transition-transform"
                >
                  <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="glass-effect p-4 md:p-8 rounded-2xl card-hover"
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 gradient-text"
            >
              Для преподавателей
            </motion.h3>
            <div className="grid gap-4 md:gap-6">
              {teacherFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 md:space-x-4 glass-effect p-3 md:p-4 rounded-xl hover:scale-105 transition-transform"
                >
                  <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-base md:text-lg mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features; 