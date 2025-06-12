import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">Контакты</h1>
            
            <div className="glass-effect p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Свяжитесь с нами</h2>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  Email: mudarisov345@gmail.com
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  Телефон: +7 (XXX) XXX-XX-XX
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  Адрес: г. Казань, ул. Красносельская 51, к4
                </p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Форма обратной связи</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Ваше имя</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Сообщение</label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="glass-button text-blue-600 w-full"
                >
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts; 