import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceData {
  subjectName: string;
  date: string;
  status: '+' | '-';
  semester: number;
}

interface SubjectStats {
  subjectName: string;
  attendanceRate: number;
  totalClasses: number;
  presentClasses: number;
}

const AttendanceChart = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<AttendanceData[]>('/api/Attendance/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAttendanceData(response.data);
        // Устанавливаем первый доступный семестр по умолчанию
        if (response.data.length > 0) {
          const semesters = Array.from(new Set(response.data.map((item: AttendanceData) => item.semester))).sort();
          setSelectedSemester(semesters[0] as number);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных посещаемости:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Получаем уникальные семестры
  const semesters = Array.from(new Set(attendanceData.map(item => item.semester))).sort();

  // Фильтруем данные по выбранному семестру
  const filteredData = attendanceData.filter(item => item.semester === selectedSemester);

  // Группируем данные по предметам
  const subjects = Array.from(new Set(filteredData.map(item => item.subjectName)));
  
  // Рассчитываем статистику по каждому предмету
  const subjectStats: SubjectStats[] = subjects.map(subject => {
    const subjectData = filteredData.filter(item => item.subjectName === subject);
    const presentClasses = subjectData.filter(item => item.status === '+').length;
    return {
      subjectName: subject,
      attendanceRate: Number(((presentClasses / subjectData.length) * 100).toFixed(2)),
      totalClasses: subjectData.length,
      presentClasses
    };
  });

  // Получаем данные для выбранного предмета
  const getSelectedSubjectData = () => {
    if (!selectedSubject) return null;
    const subjectData = filteredData.filter(item => item.subjectName === selectedSubject);
    const dates = Array.from(new Set(subjectData.map(item => item.date)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const presentClasses = subjectData.filter(item => item.status === '+').length;

    return {
      subjectName: selectedSubject,
      attendanceRate: Number(((presentClasses / subjectData.length) * 100).toFixed(2)),
      dates,
      statuses: dates.map(date => subjectData.find(item => item.date === date)?.status || '-')
    };
  };

  // Преобразуем данные для графика
  const getChartData = (subject: string) => {
    const subjectData = filteredData
      .filter(item => item.subjectName === subject)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        status: item.status === '+' ? 1 : 0,
      }));

    return subjectData;
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
              setSelectedSubject(''); // Сбрасываем выбранный предмет при смене семестра
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Процент посещаемости</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSelectedSubjectData()?.attendanceRate}%</td>
                  {getSelectedSubjectData()?.statuses.map((status, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === '+' 
                          ? 'bg-green-100 text-green-800' 
                          : status === '-' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status === '+' ? 'Присутствует' : status === '-' ? 'Отсутствует' : '-'}
                      </span>
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
              <p className="text-sm text-gray-600">Процент посещаемости: <span className="font-medium">{stat.attendanceRate}%</span></p>
              <p className="text-sm text-gray-600">Посещено занятий: <span className="font-medium">{stat.presentClasses}</span></p>
              <p className="text-sm text-gray-600">Всего занятий: <span className="font-medium">{stat.totalClasses}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Графики посещаемости по предметам */}
      {subjects.map((subject) => (
        <div
          key={subject}
          className="bg-white rounded-lg shadow-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {subject}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData(subject)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="status"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceChart; 