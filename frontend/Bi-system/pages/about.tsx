import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">О сервисе</h1>
            
            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Наша миссия</h2>
              <p className="text-gray-700 mb-6">
                Мы стремимся создать современную и удобную платформу для анализа образовательных данных, 
                которая поможет студентам и преподавателям эффективно управлять учебным процессом.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Основные возможности</h2>
              <ul className="space-y-4 text-gray-700">
                <li>• Анализ успеваемости студентов</li>
                <li>• Мониторинг посещаемости</li>
                <li>• Учет научной деятельности</li>
                <li>• Автоматический расчет стипендий</li>
                <li>• Аналитика KPI преподавателей</li>
              </ul>
            </div>

            <div className="glass-effect p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Технологии</h2>
              <p className="text-gray-700">
                Наш сервис построен на современных технологиях, обеспечивающих безопасность, 
                производительность и удобство использования.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About; 