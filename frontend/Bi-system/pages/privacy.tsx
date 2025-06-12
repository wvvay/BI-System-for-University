import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">Политика конфиденциальности</h1>
            
            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">2. Сбор информации</h2>
              <p className="text-gray-700 mb-4">
                Мы собираем только ту информацию, которая необходима для предоставления наших услуг.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">3. Использование информации</h2>
              <p className="text-gray-700 mb-4">
                Собранная информация используется исключительно для целей, указанных при её сборе.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">4. Защита информации</h2>
              <p className="text-gray-700">
                Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy; 