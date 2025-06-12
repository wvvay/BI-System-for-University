import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StudentData {
  fullName: string;
  groupName: string;
  gradebookNumber: string;
  facultyName: string;
  phoneNumber: string;
  dayOfBirth: string;
  courseYear: number;
  course: string;
  dormitoryNumber: string;
  roomNumber: string;
}

interface TeacherData {
  fullName: string;
  education: string;
  facultyName: string;
  post: string;
  experience: number;
}

interface ProfileResponse {
  role: 'Student' | 'Teacher';
  data: StudentData | TeacherData;
}

const ProfileInfo = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/Me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4 md:p-8">Загрузка...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-4 md:p-8">Ошибка загрузки профиля</div>;
  }

  return (
    <div className="rounded-lg bg-white p-4 md:p-8 shadow-lg">
      <h2 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold text-gray-800">Информация о профиле</h2>
      
      {profile.role === 'Student' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500">ФИО</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as StudentData).fullName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Группа</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as StudentData).groupName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Номер зачетки</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as StudentData).gradebookNumber}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Факультет</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as StudentData).facultyName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Телефон</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as StudentData).phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Дата рождения</p>
              <p className="text-base md:text-lg font-medium">
                {new Date((profile.data as StudentData).dayOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Курс</p>
              <p className="text-base md:text-lg font-medium">
                {(profile.data as StudentData).course} ({(profile.data as StudentData).courseYear} год обучения)
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Общежитие</p>
              <p className="text-base md:text-lg font-medium">
                {(profile.data as StudentData).dormitoryNumber}, комната {(profile.data as StudentData).roomNumber}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500">ФИО</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as TeacherData).fullName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Образование</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as TeacherData).education}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Факультет</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as TeacherData).facultyName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Должность</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as TeacherData).post}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Опыт работы</p>
              <p className="text-base md:text-lg font-medium">{(profile.data as TeacherData).experience} лет</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo; 