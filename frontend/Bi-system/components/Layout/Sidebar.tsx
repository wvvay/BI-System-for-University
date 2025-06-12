import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiUser, BiBook, BiCalendar, BiQrScan, BiCog, BiLogOut, BiMenu, BiX, BiBookAlt, BiBarChartAlt2, BiChart, BiBrain, BiErrorCircle } from 'react-icons/bi';
import axios from 'axios';

const Sidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/Me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsTeacher(response.data.role === 'Teacher');
        setIsStudent(response.data.role === 'Student');
      } catch (error) {
        console.error('Ошибка при получении роли пользователя:', error);
      }
    };

    fetchUserRole();
  }, []);

  const menuItems = [
    { icon: <BiUser size={24} />, label: 'Профиль', path: '/profile' },
    { icon: <BiBook size={24} />, label: 'Успеваемость', path: '/performance' },
    { icon: <BiCalendar size={24} />, label: 'Посещаемость', path: '/attendance' },
    { icon: <BiQrScan size={24} />, label: 'Отметка на лекции', path: '/lecture' },
    { icon: <BiBookAlt size={24} />, label: 'Научная работа', path: '/scientific-work' },
  ];

  const studentMenuItems = [
    { icon: <BiChart size={24} />, label: 'Аналитика', path: '/analytics' },
    { icon: <BiBrain size={24} />, label: 'Аналитика с ИИ', path: '/ai-analytics' },
  ];

  const teacherMenuItems = [
    { icon: <BiBarChartAlt2 size={24} />, label: 'KPI', path: '/kpi' },
    { icon: <BiErrorCircle size={24} />, label: 'Студенты в зоне риска', path: '/at-risk-students' },
  ];

  const bottomMenuItems = [
    { icon: <BiCog size={24} />, label: 'Настройки', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-md shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/20">
        <h1 className="text-xl md:text-2xl font-bold text-white">Bi-system</h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white lg:hidden"
        >
          {isCollapsed ? <BiMenu size={24} /> : <BiX size={24} />}
        </button>
      </div>
      
      <nav className="mt-4 overflow-y-auto h-[calc(100vh-8rem)]">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 md:px-6 py-3 text-white/90 hover:bg-white/20 transition-colors ${
              router.pathname === item.path ? 'bg-white/20' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3 text-sm md:text-base">{item.label}</span>
          </Link>
        ))}
        {isStudent && studentMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 md:px-6 py-3 text-white/90 hover:bg-white/20 transition-colors ${
              router.pathname === item.path ? 'bg-white/20' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3 text-sm md:text-base">{item.label}</span>
          </Link>
        ))}
        {isTeacher && teacherMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 md:px-6 py-3 text-white/90 hover:bg-white/20 transition-colors ${
              router.pathname === item.path ? 'bg-white/20' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3 text-sm md:text-base">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-white/20">
        {bottomMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 md:px-6 py-3 text-white/90 hover:bg-white/20 transition-colors ${
              router.pathname === item.path ? 'bg-white/20' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3 text-sm md:text-base">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 md:px-6 py-3 text-white/90 hover:bg-white/20 transition-colors"
        >
          <BiLogOut size={24} />
          <span className="ml-3 text-sm md:text-base">Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 