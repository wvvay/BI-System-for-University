import React, { useState, useEffect } from 'react';
import QRCodeGenerator from '../components/Lecture/QRCodeGenerator';
import QRScanner from '../components/Lecture/QRScanner';
import AttendanceTable from '../components/Lecture/AttendanceTable';
import Sidebar from '../components/Layout/Sidebar';
import axios from 'axios';
import { useRouter } from 'next/router';

const LecturePage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/Me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRole(response.data.role);
      } catch (error) {
        console.error('Ошибка при проверке роли:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
          {role === 'Teacher' ? (
            <>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Генерация QR-кода для лекции</h1>
                <p className="mt-2 text-base md:text-lg text-gray-600">Сгенерируйте QR-код для отметки посещаемости на лекции</p>
              </div>
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-4 md:p-8 backdrop-blur-md">
                  <QRCodeGenerator />
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Посещаемость сегодня</h2>
                  <AttendanceTable />
                </div>
              </div>
            </>
          ) : role === 'Student' ? (
            <div className="space-y-6 md:space-y-8">
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-4 md:p-8 backdrop-blur-md">
                <QRScanner />
              </div>
            </div>
          ) : null}
        </div>
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

export default LecturePage; 