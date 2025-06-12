import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/Me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.data.fullName);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                BI-System
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {userName && (
              <span className="text-gray-700 font-medium">
                {userName}
              </span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 