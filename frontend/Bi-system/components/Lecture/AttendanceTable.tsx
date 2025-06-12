import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AttendanceData {
  studentFullName: string;
  gradebookNumber: string;
  groupName: string;
  subjectName: string;
  status: '+' | '-';
  date: string;
}

const AttendanceTable: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    group: '',
    subject: '',
    timeFrom: '',
    timeTo: '',
  });

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/Attendance/teacher-today-attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных посещаемости:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 30000); // Обновляем каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const filteredData = attendanceData.filter(item => {
    const itemTime = new Date(item.date);
    const timeFrom = filters.timeFrom ? new Date(`1970-01-01T${filters.timeFrom}`) : new Date(0);
    const timeTo = filters.timeTo ? new Date(`1970-01-01T${filters.timeTo}`) : new Date(86400000);
    
    const timeMatch = !filters.timeFrom && !filters.timeTo ? true :
      itemTime.getHours() * 60 + itemTime.getMinutes() >= timeFrom.getHours() * 60 + timeFrom.getMinutes() &&
      itemTime.getHours() * 60 + itemTime.getMinutes() <= timeTo.getHours() * 60 + timeTo.getMinutes();
    
    return (
      (!filters.group || item.groupName === filters.group) &&
      (!filters.subject || item.subjectName === filters.subject) &&
      timeMatch
    );
  });

  const clearFilters = () => {
    setFilters({
      group: '',
      subject: '',
      timeFrom: '',
      timeTo: '',
    });
  };

  const uniqueGroups = Array.from(new Set(attendanceData.map(item => item.groupName)));
  const uniqueSubjects = Array.from(new Set(attendanceData.map(item => item.subjectName)));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Группа
          </label>
          <select
            value={filters.group}
            onChange={(e) => setFilters({ ...filters, group: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Все группы</option>
            {uniqueGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Предмет
          </label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Все предметы</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время от
          </label>
          <input
            type="time"
            value={filters.timeFrom}
            onChange={(e) => setFilters({ ...filters, timeFrom: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время до
          </label>
          <input
            type="time"
            value={filters.timeTo}
            onChange={(e) => setFilters({ ...filters, timeTo: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Посещаемость сегодня</h2>
          <div className="text-sm text-gray-600">
            Найдено записей: <span className="font-semibold">{filteredData.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ФИО
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Предмет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Время
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((student) => (
                <tr key={`${student.gradebookNumber}-${student.date}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentFullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.groupName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === '+' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === '+' ? 'Присутствует' : 'Отсутствует'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable; 