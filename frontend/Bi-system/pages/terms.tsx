import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">Пользовательское соглашение</h1>
            
            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">1. Общие положения</h2>
              <p className="text-gray-700 mb-4">
                Настоящее Пользовательское соглашение регулирует отношения между Администрацией сервиса и Пользователем.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">2. Права и обязанности сторон</h2>
              <p className="text-gray-700 mb-4">
                Пользователь имеет право использовать сервис в соответствии с его функциональным назначением.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">3. Условия использования</h2>
              <p className="text-gray-700 mb-4">
                Использование сервиса возможно только при соблюдении всех условий настоящего соглашения.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">4. Ответственность</h2>
              <p className="text-gray-700">
                Администрация сервиса не несет ответственности за возможные сбои в работе сервиса.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms; 