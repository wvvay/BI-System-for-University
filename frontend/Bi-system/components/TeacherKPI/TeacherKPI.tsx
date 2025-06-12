import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TeacherKPI {
  fullName: string;
  post: string;
  experience: number;
  totalTeachingHours: number;
  extraHours: number;
  averageStudentScore: number;
  averageStudentAttendance: number;
  scientificPublicationCount: number;
  countSubject: number;
  countGroup: number;
}

interface PostRequirements {
  minScientificPublications: number;
  minSubjects: number;
  minGroups: number;
  minStudentScore: number;
  minStudentAttendance: number;
  baseSalary: number;
  bonusPerExtraHour: number;
  bonusPerPublication: number;
  bonusPerScorePoint: number;
  bonusPerAttendancePoint: number;
}

const postRequirements: Record<string, PostRequirements> = {
  'Доцент': {
    minScientificPublications: 10,
    minSubjects: 2,
    minGroups: 2,
    minStudentScore: 70,
    minStudentAttendance: 80,
    baseSalary: 50000,
    bonusPerExtraHour: 1000,
    bonusPerPublication: 500,
    bonusPerScorePoint: 500,
    bonusPerAttendancePoint: 300
  },
  'Профессор': {
    minScientificPublications: 10,
    minSubjects: 2,
    minGroups: 2,
    minStudentScore: 70,
    minStudentAttendance: 80,
    baseSalary: 70000,
    bonusPerExtraHour: 1200,
    bonusPerPublication: 500,
    bonusPerScorePoint: 500,
    bonusPerAttendancePoint: 300
  },
  'Старший преподаватель': {
    minScientificPublications: 10,
    minSubjects: 2,
    minGroups: 2,
    minStudentScore: 70,
    minStudentAttendance: 80,
    baseSalary: 40000,
    bonusPerExtraHour: 800,
    bonusPerPublication: 500,
    bonusPerScorePoint: 500,
    bonusPerAttendancePoint: 300
  },
  'Ассистент': {
    minScientificPublications: 10,
    minSubjects: 1,
    minGroups: 1,
    minStudentScore: 70,
    minStudentAttendance: 80,
    baseSalary: 30000,
    bonusPerExtraHour: 600,
    bonusPerPublication: 500,
    bonusPerScorePoint: 500,
    bonusPerAttendancePoint: 300
  }
};

const TeacherKPI = () => {
  const [kpiData, setKpiData] = useState<TeacherKPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/Teacher/kpi', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKpiData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных KPI:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  const calculateSalary = (kpi: TeacherKPI) => {
    if (!kpi) return 0;
    const requirements = postRequirements[kpi.post] || postRequirements['Ассистент'];
    
    // Базовая зарплата
    let salary = requirements.baseSalary;
    
    // Бонус за дополнительные часы
    salary += kpi.extraHours * requirements.bonusPerExtraHour;
    
    // Бонус за публикации
    salary += kpi.scientificPublicationCount * requirements.bonusPerPublication;
    
    // Бонус за средний балл студентов
    if (kpi.averageStudentScore > requirements.minStudentScore) {
      salary += (kpi.averageStudentScore - requirements.minStudentScore) * requirements.bonusPerScorePoint;
    }
    
    // Бонус за посещаемость
    if (kpi.averageStudentAttendance > requirements.minStudentAttendance) {
      salary += (kpi.averageStudentAttendance - requirements.minStudentAttendance) * requirements.bonusPerAttendancePoint;
    }

    return Math.round(salary);
  };

  const getProgressColor = (value: number, minValue: number) => {
    const percentage = (value / minValue) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressWidth = (value: number, minValue: number) => {
    return Math.min((value / minValue) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Не удалось загрузить данные KPI</p>
      </div>
    );
  }

  const requirements = postRequirements[kpiData.post] || postRequirements['Ассистент'];
  const salary = calculateSalary(kpiData);

  // Данные для графика норм
  const normsChartData = {
    labels: ['Научные публикации', 'Средний балл', 'Посещаемость'],
    datasets: [
      {
        label: 'Норма',
        data: [
          requirements.minScientificPublications,
          requirements.minStudentScore,
          requirements.minStudentAttendance
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
      {
        label: 'Факт',
        data: [
          kpiData.scientificPublicationCount,
          kpiData.averageStudentScore,
          kpiData.averageStudentAttendance
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Блок 1: Статистика */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Статистика преподавателя</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">ФИО</p>
            <p className="text-xl font-bold">{kpiData.fullName}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Должность</p>
            <p className="text-xl font-bold">{kpiData.post}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Стаж</p>
            <p className="text-xl font-bold">{kpiData.experience} лет</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Количество предметов</p>
            <p className="text-xl font-bold">{kpiData.countSubject}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Количество групп</p>
            <p className="text-xl font-bold">{kpiData.countGroup}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Часы / Доп. часы</p>
            <p className="text-xl font-bold">{kpiData.totalTeachingHours} / {kpiData.extraHours}</p>
          </div>
        </div>
      </div>

      {/* Блок 2: График норм */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Выполнение норм</h2>
        <div className="h-96">
          <Bar
            data={normsChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>
      </div>

      {/* Блок 3: Прогресс-бары */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Прогресс выполнения норм за текущий учебный год</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Научные публикации</span>
              <span className="text-sm font-medium text-gray-700">{kpiData.scientificPublicationCount} / {requirements.minScientificPublications}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(kpiData.scientificPublicationCount, requirements.minScientificPublications)}`}
                style={{ width: `${getProgressWidth(kpiData.scientificPublicationCount, requirements.minScientificPublications)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Средний балл</span>
              <span className="text-sm font-medium text-gray-700">{kpiData.averageStudentScore} / {requirements.minStudentScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(kpiData.averageStudentScore, requirements.minStudentScore)}`}
                style={{ width: `${getProgressWidth(kpiData.averageStudentScore, requirements.minStudentScore)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Посещаемость</span>
              <span className="text-sm font-medium text-gray-700">{kpiData.averageStudentAttendance}% / {requirements.minStudentAttendance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(kpiData.averageStudentAttendance, requirements.minStudentAttendance)}`}
                style={{ width: `${getProgressWidth(kpiData.averageStudentAttendance, requirements.minStudentAttendance)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок 4: Расчет зарплаты */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Расчет зарплаты</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Формула расчета:</h3>
            <p className="text-sm text-gray-600 mb-2">Зарплата = Базовая зарплата + Бонусы</p>
            <p className="text-sm text-gray-600 mb-2">Бонусы = (Доп. часы × Бонус за час) + (Публикации × Бонус за публикацию) + (Превышение среднего балла × Бонус за балл) + (Превышение посещаемости × Бонус за посещаемость)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Базовая зарплата</p>
              <p className="text-lg font-medium">{Math.round(requirements.baseSalary)} ₽</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Бонус за доп. часы ({kpiData.extraHours} ч × {requirements.bonusPerExtraHour} ₽)</p>
              <p className="text-lg font-medium">{Math.round(kpiData.extraHours * requirements.bonusPerExtraHour)} ₽</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Бонус за публикации ({kpiData.scientificPublicationCount} × {requirements.bonusPerPublication} ₽)</p>
              <p className="text-lg font-medium">{Math.round(kpiData.scientificPublicationCount * requirements.bonusPerPublication)} ₽</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Бонус за средний балл ({(kpiData.averageStudentScore - requirements.minStudentScore).toFixed(1)} × {requirements.bonusPerScorePoint} ₽)</p>
              <p className="text-lg font-medium">
                {Math.round(Math.max(0, (kpiData.averageStudentScore - requirements.minStudentScore) * requirements.bonusPerScorePoint))} ₽
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Бонус за посещаемость ({(kpiData.averageStudentAttendance - requirements.minStudentAttendance).toFixed(1)} × {requirements.bonusPerAttendancePoint} ₽)</p>
              <p className="text-lg font-medium">
                {Math.round(Math.max(0, (kpiData.averageStudentAttendance - requirements.minStudentAttendance) * requirements.bonusPerAttendancePoint))} ₽
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Итоговая зарплата</p>
              <p className="text-2xl font-bold text-indigo-600">{salary} ₽</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherKPI; 