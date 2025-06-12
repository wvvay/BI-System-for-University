import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

interface ExamResult {
  subjectName: string;
  date: string;
  result: number;
  semester: number;
}

interface SubjectStats {
  subjectName: string;
  averageScore: number;
  minScore: number;
  maxScore: number;
  totalAttempts: number;
}

const AcademicPerformance = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [performanceRes, examResultsRes] = await Promise.all([
          axios.get('/api/AcademicPerformance/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/AcademicPerformance/me-Result', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPerformanceData(performanceRes.data);
        setExamResults(examResultsRes.data);
        
        // Устанавливаем первый доступный семестр по умолчанию
        if (performanceRes.data.length > 0) {
          const semesters = Array.from(new Set(performanceRes.data.map((item: PerformanceData) => item.semester))).sort();
          setSelectedSemester(semesters[0] as number);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Получаем уникальные семестры
  const semesters = Array.from(new Set(performanceData.map(item => item.semester))).sort();

  // Фильтруем данные по выбранному семестру
  const filteredData = performanceData.filter(item => item.semester === selectedSemester);

  // Группируем данные по предметам
  const subjects = Array.from(new Set(filteredData.map(item => item.subjectName)));
  
  // Рассчитываем статистику по каждому предмету
  const subjectStats: SubjectStats[] = subjects.map(subject => {
    const subjectData = filteredData.filter(item => item.subjectName === subject);
    const scores = subjectData.map(item => item.score);
    return {
      subjectName: subject,
      averageScore: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      totalAttempts: scores.length
    };
  });

  // Получаем данные для выбранного предмета
  const getSelectedSubjectData = () => {
    if (!selectedSubject) return null;
    const subjectData = filteredData.filter(item => item.subjectName === selectedSubject);
    const dates = Array.from(new Set(subjectData.map(item => item.date)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const totalScore = subjectData.reduce((sum, item) => sum + item.score, 0);

    return {
      subjectName: selectedSubject,
      totalScore,
      dates,
      scores: dates.map(date => subjectData.find(item => item.date === date)?.score || '-')
    };
  };

  // Подготавливаем данные для графика средних баллов
  const averageScoresChartData = {
    labels: subjectStats.map(stat => stat.subjectName),
    datasets: [
      {
        label: 'Средний балл',
        data: subjectStats.map(stat => stat.averageScore),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      }
    ]
  };

  // Подготавливаем данные для графика динамики по каждому предмету
  const subjectProgressChartData = (subject: string) => {
    const subjectData = filteredData
      .filter(item => item.subjectName === subject)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      labels: subjectData.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: subject,
          data: subjectData.map(item => item.score),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика успеваемости'
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Выбор семестра */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Семестр:</label>
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(Number(e.target.value));
              setSelectedSubject('');
            }}
          >
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester} семестр
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Результаты экзаменов */}
      <div className="bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 p-4">Результаты экзаменов</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examResults
                .filter(result => result.semester === selectedSemester)
                .map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.subjectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        result.result === 5 ? 'bg-green-100 text-green-800' :
                        result.result === 4 ? 'bg-blue-100 text-blue-800' :
                        result.result === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Таблица с детальными данными */}
      <div className="bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 p-4">Детальная информация</h3>
        <div className="p-4">
          <select
            className="w-full md:w-64 px-4 py-2 border rounded-lg"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Выберите предмет</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        {selectedSubject && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Общий балл</th>
                  {getSelectedSubjectData()?.dates.map(date => (
                    <th key={date} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {new Date(date).toLocaleDateString()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSelectedSubjectData()?.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSelectedSubjectData()?.totalScore}</td>
                  {getSelectedSubjectData()?.scores.map((score, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {score}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjectStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.subjectName}</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Средний балл: <span className="font-medium">{stat.averageScore}</span></p>
              <p className="text-sm text-gray-600">Минимальный: <span className="font-medium">{stat.minScore}</span></p>
              <p className="text-sm text-gray-600">Максимальный: <span className="font-medium">{stat.maxScore}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* График средних баллов */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Средние баллы по предметам</h3>
        <Bar data={averageScoresChartData} options={chartOptions} />
      </div>

      {/* Графики динамики по каждому предмету */}
      {subjects.map((subject, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика по предмету: {subject}</h3>
          <Line data={subjectProgressChartData(subject)} options={chartOptions} />
        </div>
      ))}
    </div>
  );
};

export default AcademicPerformance; 