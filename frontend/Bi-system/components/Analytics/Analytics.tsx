import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceData {
  subjectName: string;
  date: string;
  score: number;
  semester: number;
}

interface AttendanceData {
  subjectName: string;
  date: string;
  status: string;
  semester: number;
}

interface ScientificWorkData {
  namePublication: string;
  yearPublication: number;
  categoryPublication: string;
}

interface ExamResultData {
  subjectName: string;
  date: string;
  result: number;
  semester: number;
}

interface SubjectStats {
  subjectName: string;
  averageScore: number;
  attendanceRate: number;
  totalWorks: number;
}

const Analytics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [scientificWorkData, setScientificWorkData] = useState<ScientificWorkData[]>([]);
  const [examResults, setExamResults] = useState<ExamResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [scholarship, setScholarship] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [performanceRes, attendanceRes, scientificWorkRes, examResultsRes] = await Promise.all([
          axios.get('/api/AcademicPerformance/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/Attendance/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/ScientificWork/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/AcademicPerformance/me-Result', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPerformanceData(performanceRes.data);
        setAttendanceData(attendanceRes.data);
        setScientificWorkData(scientificWorkRes.data);
        setExamResults(examResultsRes.data);

        // Получаем доступные семестры
        const semesters = Array.from(new Set([
          ...performanceRes.data.map((item: PerformanceData) => item.semester),
          ...attendanceRes.data.map((item: AttendanceData) => item.semester),
          ...examResultsRes.data.map((item: ExamResultData) => item.semester)
        ])).sort((a, b) => a - b);
        
        setAvailableSemesters(semesters);
        if (semesters.length > 0) {
          setSelectedSemester(semesters[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (performanceData.length > 0 && attendanceData.length > 0) {
      calculateScholarship();
    }
  }, [performanceData, attendanceData, scientificWorkData, selectedSemester]);

  const calculateScholarship = () => {
    // Фильтруем данные по выбранному семестру
    const semesterPerformance = performanceData.filter(p => p.semester === selectedSemester);
    const semesterAttendance = attendanceData.filter(a => a.semester === selectedSemester);
    const semesterExamResults = examResults.filter(e => e.semester === selectedSemester);

    // Проверяем наличие данных
    if (semesterExamResults.length === 0) {
      setScholarship(0);
      return;
    }

    // Проверяем наличие оценок 2 или 3 в результатах экзаменов
    const hasLowGrades = semesterExamResults.some(e => e.result <= 3);
    if (hasLowGrades) {
      setScholarship(0);
      return;
    }

    // Базовая стипендия
    let baseScholarship = 0;
    const allGrades = semesterExamResults.map(e => e.result);
    
    if (allGrades.every(grade => grade === 5)) {
      baseScholarship = 5000;
    } else if (allGrades.every(grade => grade === 4)) {
      baseScholarship = 3000;
    } else if (allGrades.some(grade => grade === 5) && allGrades.some(grade => grade === 4)) {
      baseScholarship = 4000;
    }

    // Если базовая стипендия 0, то остальные бонусы не учитываются
    if (baseScholarship === 0) {
      setScholarship(0);
      return;
    }

    // Бонус за научные работы
    const scientificWorkBonus = scientificWorkData.length * 300;

    // Бонус за посещаемость
    const totalAttendance = semesterAttendance.length;
    const presentAttendance = semesterAttendance.filter(a => a.status === '+').length;
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;
    let attendanceBonus = 0;
    if (attendanceRate === 100) {
      attendanceBonus = 1000;
    } else if (attendanceRate >= 90) {
      attendanceBonus = 800;
    } else if (attendanceRate >= 80) {
      attendanceBonus = 700;
    } else if (attendanceRate >= 70) {
      attendanceBonus = 500;
    }

    // Бонус за средний балл
    // Используем общий средний балл по предметам
    const totalScores = subjectStats.reduce((acc, curr) => acc + curr.averageScore, 0);
    const averageScore = subjectStats.length > 0 ? totalScores / subjectStats.length : 0;
    let scoreBonus = 0;
    if (averageScore === 100) {
      scoreBonus = 1500;
    } else if (averageScore >= 90) {
      scoreBonus = 1200;
    } else if (averageScore >= 80) {
      scoreBonus = 1000;
    } else if (averageScore >= 70) {
      scoreBonus = 800;
    }

    // Выводим в консоль для отладки
    console.log('Расчет стипендии:', {
      baseScholarship,
      scientificWorkBonus,
      attendanceBonus,
      scoreBonus,
      attendanceRate,
      averageScore,
      totalScores,
      totalAttendance,
      presentAttendance,
      subjectStats,
      semesterExamResults
    });

    const finalScholarship = Math.round(baseScholarship + scientificWorkBonus + attendanceBonus + scoreBonus);
    setScholarship(finalScholarship);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Фильтруем данные по выбранному семестру
  const semesterPerformance = performanceData.filter(p => p.semester === selectedSemester);
  const semesterAttendance = attendanceData.filter(a => a.semester === selectedSemester);

  // Группируем данные по предметам
  const subjects = Array.from(new Set([
    ...semesterPerformance.map(item => item.subjectName),
    ...semesterAttendance.map(item => item.subjectName)
  ]));

  // Рассчитываем статистику по каждому предмету
  const subjectStats: SubjectStats[] = subjects.map(subject => {
    const performance = semesterPerformance.filter(item => item.subjectName === subject);
    const attendance = semesterAttendance.filter(item => item.subjectName === subject);
    const works = scientificWorkData.filter(item => item.categoryPublication === subject);

    // Считаем общий балл за предмет
    const totalScore = performance.reduce((acc, curr) => acc + curr.score, 0);

    return {
      subjectName: subject,
      averageScore: totalScore, // Теперь это общий балл за предмет
      attendanceRate: Number(((attendance.filter(a => a.status === '+').length / attendance.length) * 100).toFixed(2)),
      totalWorks: works.length
    };
  });

  // Рассчитываем общую статистику
  const totalScores = subjectStats.reduce((acc, curr) => acc + curr.averageScore, 0);
  const totalAverageScore = Number((totalScores / subjectStats.length).toFixed(2));
  const totalAttendanceRate = Number((subjectStats.reduce((acc, curr) => acc + curr.attendanceRate, 0) / subjectStats.length).toFixed(2));

  // Подготавливаем данные для графика успеваемости
  const performanceChartData = {
    labels: subjectStats.map(stat => stat.subjectName),
    datasets: [
      {
        label: 'Общий балл за предмет',
        data: subjectStats.map(stat => stat.averageScore),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      }
    ]
  };

  // Подготавливаем данные для графика посещаемости
  const attendanceChartData = {
    labels: subjectStats.map(stat => stat.subjectName),
    datasets: [
      {
        label: 'Процент посещаемости',
        data: subjectStats.map(stat => stat.attendanceRate),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ]
  };

  // Подготавливаем данные для графика научных работ
  const scientificWorkChartData = {
    labels: ['Научные работы'],
    datasets: [
      {
        label: 'Количество работ',
        data: [scientificWorkData.length],
        backgroundColor: ['rgba(245, 158, 11, 0.5)'],
        borderColor: ['rgb(245, 158, 11)'],
        borderWidth: 1,
      }
    ]
  };

  // Подготавливаем данные для графика результатов за экзамен
  const examResultsChartData = {
    labels: examResults
      .filter(item => item.semester === selectedSemester)
      .map(item => item.subjectName),
    datasets: [
      {
        label: 'Результат за экзамен',
        data: examResults
          .filter(item => item.semester === selectedSemester)
          .map(item => item.result),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Выбор семестра */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Выберите семестр
        </label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {availableSemesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester} семестр
            </option>
          ))}
        </select>
      </div>

      {/* Карточка со стипендией */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Ваша стипендия</h2>
        <p className="text-4xl font-bold mb-4">{scholarship} ₽</p>
        
        {/* Формула расчета стипендии */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Формула расчета:</h3>
          <p className="text-sm mb-2">
            Стипендия = Базовая стипендия + Бонус за научные работы + Бонус за посещаемость + Бонус за средний балл
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Базовая стипендия:</p>
            <ul className="text-sm list-disc list-inside ml-2">
              <li>Все оценки 5 = 5,000 ₽</li>
              <li>Все оценки 4 = 3,000 ₽</li>
              <li>Есть оценки 4 и 5 = 4,000 ₽</li>
              <li>Есть оценки 2 и 3 = 0 ₽</li>
            </ul>
            <p className="text-sm font-semibold">Бонус за научные работы:</p>
            <ul className="text-sm list-disc list-inside ml-2">
              <li>300 ₽ за каждую научную работу</li>
            </ul>
            <p className="text-sm font-semibold">Бонус за посещаемость:</p>
            <ul className="text-sm list-disc list-inside ml-2">
              <li>100% = 1,000 ₽</li>
              <li>90%+ = 800 ₽</li>
              <li>80%+ = 700 ₽</li>
              <li>70%+ = 500 ₽</li>
            </ul>
            <p className="text-sm font-semibold">Бонус за средний балл:</p>
            <ul className="text-sm list-disc list-inside ml-2">
              <li>100 = 1,500 ₽</li>
              <li>90+ = 1,200 ₽</li>
              <li>80+ = 1,000 ₽</li>
              <li>70+ = 800 ₽</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Общий балл по предметам</h3>
          <Bar data={performanceChartData} options={chartOptions} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Посещаемость по предметам</h3>
          <Bar data={attendanceChartData} options={chartOptions} />
        </div>
      </div>

      {/* График результатов экзаменов */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Результаты за экзамен</h3>
        <div className="w-full">
          <Bar data={examResultsChartData} options={chartOptions} />
        </div>
      </div>

      {/* Научные работы */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Научные работы</h3>
        <p className="text-sm text-gray-600 mb-4">Количество работ: {scientificWorkData.length}</p>
        <div className="flex items-center justify-center h-64">
          <Doughnut data={scientificWorkChartData} options={chartOptions} />
        </div>
      </div>

      {/* Детальная статистика */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-800 p-4">Детальная статистика по предметам</h3>
        
        {/* Общая статистика */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Средний балл по всем предметам</p>
              <p className="text-xl font-bold text-indigo-600">{totalAverageScore}</p>
              <p className="text-xs text-gray-500 mt-1">(Сумма баллов: {totalScores}, Количество предметов: {subjectStats.length})</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Средняя посещаемость по всем предметам</p>
              <p className="text-xl font-bold text-indigo-600">{totalAttendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Общий балл</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Посещаемость</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjectStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.averageScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.attendanceRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 