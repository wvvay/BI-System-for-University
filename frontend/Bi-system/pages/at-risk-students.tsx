import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Layout/Sidebar';
import AtRiskStudents from '../components/AtRiskStudents/AtRiskStudents';
import axios from 'axios';

interface ProfileResponse {
  role: 'Student' | 'Teacher';
  data: {
    fullName: string;
  };
}

const AtRiskStudentsPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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

        if (response.data.role !== 'Teacher') {
          router.push('/');
          return;
        }

        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <AtRiskStudents />
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AtRiskStudentsPage; 