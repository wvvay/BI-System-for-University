import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ChangePassword from '../components/Profile/ChangePassword';
import { BiCog, BiLockAlt } from 'react-icons/bi';

const Settings: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Мобильное меню-бургер */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Сайдбар */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Основной контент */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <BiCog className="text-2xl text-indigo-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Настройки</h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl shadow-lg p-4 md:p-8 backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 rounded-lg">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <BiLockAlt className="text-xl text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-800">Смена пароля</h3>
                    <p className="text-sm text-gray-600">Обновите свой пароль для безопасности</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Сменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>

        {showChangePassword && (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        )}
      </main>

      {/* Затемнение фона при открытом мобильном меню */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Settings; 