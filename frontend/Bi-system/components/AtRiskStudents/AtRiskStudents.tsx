import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiFilter, BiRefresh } from 'react-icons/bi';

interface SubjectRisk {
  subjectName: string;
  averageScore: number;
  attendanceRate: number;
  riskFactors: string[];
}

interface AtRiskStudent {
  studentId: number;
  fullName: string;
  groupName: string;
  averageGrade: number;
  attendanceRate: number;
  subjectRisks: SubjectRisk[];
  riskFactors: string[];
  lastUpdateDate: string;
}

const AtRiskStudents = () => {
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    group: '',
    minAverageGrade: '',
    maxAverageGrade: '',
    minAttendanceRate: '',
    maxAttendanceRate: '',
  });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/StudentAnalysis/at-risk', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const getFilteredStudents = () => {
    return students.filter(student => {
      const groupMatch = !filters.group || student.groupName === filters.group;
      const gradeMatch = (!filters.minAverageGrade || student.averageGrade >= parseFloat(filters.minAverageGrade)) &&
                        (!filters.maxAverageGrade || student.averageGrade <= parseFloat(filters.maxAverageGrade));
      const attendanceMatch = (!filters.minAttendanceRate || student.attendanceRate >= parseFloat(filters.minAttendanceRate)) &&
                            (!filters.maxAttendanceRate || student.attendanceRate <= parseFloat(filters.maxAttendanceRate));
      return groupMatch && gradeMatch && attendanceMatch;
    });
  };

  const groups = Array.from(new Set(students.map(student => student.groupName)));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Студенты в зоне риска</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Фильтры</h2>
            <button
              onClick={fetchStudents}
              className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              title="Обновить данные"
            >
              <BiRefresh size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              className="px-4 py-2 border rounded-lg"
              value={filters.group}
              onChange={(e) => setFilters({ ...filters, group: e.target.value })}
            >
              <option value="">Все группы</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Мин. средний балл"
                className="px-4 py-2 border rounded-lg w-full"
                value={filters.minAverageGrade}
                onChange={(e) => setFilters({ ...filters, minAverageGrade: e.target.value })}
              />
              <input
                type="number"
                placeholder="Макс. средний балл"
                className="px-4 py-2 border rounded-lg w-full"
                value={filters.maxAverageGrade}
                onChange={(e) => setFilters({ ...filters, maxAverageGrade: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Мин. посещаемость"
                className="px-4 py-2 border rounded-lg w-full"
                value={filters.minAttendanceRate}
                onChange={(e) => setFilters({ ...filters, minAttendanceRate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Макс. посещаемость"
                className="px-4 py-2 border rounded-lg w-full"
                value={filters.maxAttendanceRate}
                onChange={(e) => setFilters({ ...filters, maxAttendanceRate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {getFilteredStudents().map((student) => (
          <div key={student.studentId} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{student.fullName}</h3>
                <p className="text-gray-600">{student.groupName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Последнее обновление: {new Date(student.lastUpdateDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Общая информация</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Средний балл: <span className="font-semibold">{student.averageGrade.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-600">
                    Посещаемость: <span className="font-semibold">{(student.attendanceRate * 100).toFixed(1)}%</span>
                  </p>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-700 mb-2">Факторы риска</h4>
                <ul className="list-disc list-inside space-y-1">
                  {student.riskFactors.map((factor, index) => (
                    <li key={index} className="text-red-600">{factor}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Риски по предметам</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.subjectRisks.map((subject, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">{subject.subjectName}</h5>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Средний балл: <span className="font-semibold">{subject.averageScore.toFixed(2)}</span>
                      </p>
                      <p className="text-gray-600">
                        Посещаемость: <span className="font-semibold">{(subject.attendanceRate * 100).toFixed(1)}%</span>
                      </p>
                      <div className="mt-2">
                        <h6 className="text-sm font-semibold text-red-600 mb-1">Факторы риска:</h6>
                        <ul className="list-disc list-inside space-y-1">
                          {subject.riskFactors.map((factor, idx) => (
                            <li key={idx} className="text-red-600 text-sm">{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtRiskStudents; 