import React from 'react';

interface WelcomeProps {
  fullName: string;
  role: string;
}

const Welcome = ({ fullName, role }: WelcomeProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-4 md:p-8 backdrop-blur-md">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="relative">
        <h1 className="mb-2 text-xl md:text-3xl font-bold text-gray-800">
          Добро пожаловать, {fullName}!
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Вы вошли в систему как{' '}
          <span className="font-semibold text-indigo-600">
            {role === 'Student' ? 'студент' : 'преподаватель'}
          </span>
        </p>
        <div className="mt-4 md:mt-6">
          <p className="text-sm md:text-base text-gray-600">
            Используйте боковое меню для навигации по системе
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 