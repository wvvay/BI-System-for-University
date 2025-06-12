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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

interface AttendanceData {
  studentFullName: string;
  gradebookNumber: string;
  groupName: string;
  subjectName: string;
  status: '+' | '-';
  date: string;
  semester: number;
}

interface Filters {
  groupPerformance: {
    selectedGroup: string;
    selectedSubject: string;
    selectedSemester: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  studentPerformance: {
    selectedGroup: string;
    selectedStudent: string;
    selectedSubject: string;
    selectedSemester: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  detailedInfo: {
    selectedGroup: string;
    selectedStudent: string;
    selectedSubject: string;
    selectedSemester: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

const TeacherAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    groupPerformance: {
      selectedGroup: '',
      selectedSubject: '',
      selectedSemester: 1,
      dateRange: { start: '', end: '' }
    },
    studentPerformance: {
      selectedGroup: '',
      selectedStudent: '',
      selectedSubject: '',
      selectedSemester: 1,
      dateRange: { start: '', end: '' }
    },
    detailedInfo: {
      selectedGroup: '',
      selectedStudent: '',
      selectedSubject: '',
      selectedSemester: 1,
      dateRange: { start: '', end: '' }
    }
  });

  // Получаем уникальные значения для фильтров с учетом зависимостей
  const getFilteredGroups = (section: 'groupPerformance' | 'studentPerformance' | 'detailedInfo') => {
    if (filters[section].selectedSemester) {
      return Array.from(new Set(
        attendanceData
          .filter(item => item.semester === filters[section].selectedSemester)
          .map(item => item.groupName)
      ));
    }
    return Array.from(new Set(attendanceData.map(item => item.groupName)));
  };

  const getFilteredStudents = (section: 'studentPerformance' | 'detailedInfo') => {
    let filteredData = attendanceData;
    if (filters[section].selectedSemester) {
      filteredData = filteredData.filter(item => item.semester === filters[section].selectedSemester);
    }
    if (filters[section].selectedGroup) {
      filteredData = filteredData.filter(item => item.groupName === filters[section].selectedGroup);
    }
    return Array.from(new Set(filteredData.map(item => item.studentFullName)));
  };

  const getFilteredSubjects = (section: 'groupPerformance' | 'studentPerformance' | 'detailedInfo') => {
    let filteredData = attendanceData;
    if (filters[section].selectedSemester) {
      filteredData = filteredData.filter(item => item.semester === filters[section].selectedSemester);
    }
    if (filters[section].selectedGroup) {
      filteredData = filteredData.filter(item => item.groupName === filters[section].selectedGroup);
    }
    return Array.from(new Set(filteredData.map(item => item.subjectName)));
  };

  const semesters = Array.from(new Set(attendanceData.map(item => item.semester))).sort();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/Attendance/teacher', {
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

    fetchAttendanceData();
  }, []);

  // Функции для очистки фильтров
  const clearGroupPerformanceFilters = () => {
    setFilters({
      ...filters,
      groupPerformance: {
        selectedGroup: '',
        selectedSubject: '',
        selectedSemester: 1,
        dateRange: { start: '', end: '' }
      }
    });
  };

  const clearStudentPerformanceFilters = () => {
    setFilters({
      ...filters,
      studentPerformance: {
        selectedGroup: '',
        selectedStudent: '',
        selectedSubject: '',
        selectedSemester: 1,
        dateRange: { start: '', end: '' }
      }
    });
  };

  const clearDetailedInfoFilters = () => {
    setFilters({
      ...filters,
      detailedInfo: {
        selectedGroup: '',
        selectedStudent: '',
        selectedSubject: '',
        selectedSemester: 1,
        dateRange: { start: '', end: '' }
      }
    });
  };

  // Данные для первого графика (посещаемость группы)
  const getGroupAttendanceData = () => {
    if (!filters.groupPerformance.selectedGroup || !filters.groupPerformance.selectedSubject) return {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    let groupData = attendanceData.filter(
      item => item.groupName === filters.groupPerformance.selectedGroup && 
      item.subjectName === filters.groupPerformance.selectedSubject &&
      item.semester === filters.groupPerformance.selectedSemester
    );

    // Применяем фильтр по датам
    if (filters.groupPerformance.dateRange.start) {
      groupData = groupData.filter(item => new Date(item.date) >= new Date(filters.groupPerformance.dateRange.start));
    }
    if (filters.groupPerformance.dateRange.end) {
      groupData = groupData.filter(item => new Date(item.date) <= new Date(filters.groupPerformance.dateRange.end));
    }

    const dates = Array.from(new Set(groupData.map(item => item.date)));
    const attendanceRates = dates.map(date => {
      const dayData = groupData.filter(item => item.date === date);
      const presentCount = dayData.filter(item => item.status === '+').length;
      const attendanceRate = (presentCount / dayData.length) * 100;
      return Number(attendanceRate.toFixed(2));
    });

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: `Посещаемость группы ${filters.groupPerformance.selectedGroup} по предмету ${filters.groupPerformance.selectedSubject}`,
        data: attendanceRates,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  // Данные для второго графика (посещаемость студента)
  const getStudentAttendanceData = () => {
    if (!filters.studentPerformance.selectedStudent) return {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    };

    let studentData = attendanceData.filter(
      item => item.studentFullName === filters.studentPerformance.selectedStudent &&
      item.subjectName === filters.studentPerformance.selectedSubject &&
      item.semester === filters.studentPerformance.selectedSemester
    );

    // Применяем фильтр по датам
    if (filters.studentPerformance.dateRange.start) {
      studentData = studentData.filter(item => new Date(item.date) >= new Date(filters.studentPerformance.dateRange.start));
    }
    if (filters.studentPerformance.dateRange.end) {
      studentData = studentData.filter(item => new Date(item.date) <= new Date(filters.studentPerformance.dateRange.end));
    }

    return {
      labels: studentData.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [{
        label: `Посещаемость студента ${filters.studentPerformance.selectedStudent}`,
        data: studentData.map(item => item.status === '+' ? 100 : 0),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    };
  };

  // Данные для таблицы
  const getTableData = () => {
    let filteredData = attendanceData;
    
    if (filters.detailedInfo.selectedSemester) {
      filteredData = filteredData.filter(item => item.semester === filters.detailedInfo.selectedSemester);
    }
    if (filters.detailedInfo.selectedGroup) {
      filteredData = filteredData.filter(item => item.groupName === filters.detailedInfo.selectedGroup);
    }
    if (filters.detailedInfo.selectedStudent) {
      filteredData = filteredData.filter(item => item.studentFullName === filters.detailedInfo.selectedStudent);
    }
    if (filters.detailedInfo.selectedSubject) {
      filteredData = filteredData.filter(item => item.subjectName === filters.detailedInfo.selectedSubject);
    }
    if (filters.detailedInfo.dateRange.start) {
      filteredData = filteredData.filter(item => new Date(item.date) >= new Date(filters.detailedInfo.dateRange.start));
    }
    if (filters.detailedInfo.dateRange.end) {
      filteredData = filteredData.filter(item => new Date(item.date) <= new Date(filters.detailedInfo.dateRange.end));
    }

    // Группируем данные по студентам
    const studentGroups = new Map<string, { present: number, total: number, dates: string[] }>();
    filteredData.forEach(item => {
      if (!studentGroups.has(item.studentFullName)) {
        studentGroups.set(item.studentFullName, { present: 0, total: 0, dates: [] });
      }
      const stats = studentGroups.get(item.studentFullName)!;
      stats.total += 1;
      if (item.status === '+') stats.present += 1;
      stats.dates.push(item.date);
    });

    return Array.from(studentGroups.entries()).map(([student, stats]) => ({
      studentName: student,
      attendanceRate: Number((stats.present / stats.total * 100).toFixed(2)),
      dates: stats.dates
    }));
  };

  // Данные для сравнения групп
  const getGroupComparisonData = () => {
    const groupStats = new Map<string, { present: number, total: number }>();
    
    attendanceData
      .filter(item => item.semester === filters.groupPerformance.selectedSemester)
      .forEach(item => {
        if (!groupStats.has(item.groupName)) {
          groupStats.set(item.groupName, { present: 0, total: 0 });
        }
        const stats = groupStats.get(item.groupName)!;
        stats.total += 1;
        if (item.status === '+') stats.present += 1;
      });

    return Array.from(groupStats.entries()).map(([group, stats]) => ({
      groupName: group,
      attendanceRate: Number((stats.present / stats.total * 100).toFixed(2))
    })).sort((a, b) => b.attendanceRate - a.attendanceRate);
  };

  // Данные для рейтинга групп
  const getGroupRankingData = () => {
    const groupStats = new Map<string, { present: number, total: number, students: Set<string> }>();
    
    attendanceData
      .filter(item => item.semester === filters.groupPerformance.selectedSemester)
      .forEach(item => {
        if (!groupStats.has(item.groupName)) {
          groupStats.set(item.groupName, { present: 0, total: 0, students: new Set() });
        }
        const stats = groupStats.get(item.groupName)!;
        stats.total += 1;
        if (item.status === '+') stats.present += 1;
        stats.students.add(item.studentFullName);
      });

    return Array.from(groupStats.entries()).map(([group, stats]) => ({
      groupName: group,
      attendanceRate: Number((stats.present / stats.total * 100).toFixed(2)),
      totalStudents: stats.students.size,
      totalClasses: stats.total
    })).sort((a, b) => b.attendanceRate - a.attendanceRate);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Статистика посещаемости'
      }
    }
  };

  const generateBlockReport = async (blockName: string, format: 'pdf' | 'excel') => {
    let dataToExport: any[] = [];
    let chartData: any = null;
    let title = '';

    switch (blockName) {
      case 'groupAttendance':
        if (!filters.groupPerformance.selectedGroup || !filters.groupPerformance.selectedSubject) {
          alert('Выберите группу и предмет для генерации отчета');
          return;
        }
        dataToExport = attendanceData.filter(item => {
          const groupMatch = item.groupName === filters.groupPerformance.selectedGroup;
          const subjectMatch = item.subjectName === filters.groupPerformance.selectedSubject;
          const dateMatch = filters.groupPerformance.dateRange.start && filters.groupPerformance.dateRange.end
            ? new Date(item.date) >= new Date(filters.groupPerformance.dateRange.start) &&
              new Date(item.date) <= new Date(filters.groupPerformance.dateRange.end)
            : true;
          return groupMatch && subjectMatch && dateMatch;
        });
        chartData = getGroupAttendanceData();
        title = `Посещаемость группы ${filters.groupPerformance.selectedGroup} по предмету ${filters.groupPerformance.selectedSubject}`;
        break;

      case 'studentAttendance':
        if (!filters.studentPerformance.selectedStudent) {
          alert('Выберите студента для генерации отчета');
          return;
        }
        dataToExport = attendanceData.filter(item => {
          const studentMatch = item.studentFullName === filters.studentPerformance.selectedStudent;
          const subjectMatch = filters.studentPerformance.selectedSubject
            ? item.subjectName === filters.studentPerformance.selectedSubject
            : true;
          const dateMatch = filters.studentPerformance.dateRange.start && filters.studentPerformance.dateRange.end
            ? new Date(item.date) >= new Date(filters.studentPerformance.dateRange.start) &&
              new Date(item.date) <= new Date(filters.studentPerformance.dateRange.end)
            : true;
          return studentMatch && subjectMatch && dateMatch;
        });
        chartData = getStudentAttendanceData();
        title = `Посещаемость студента ${filters.studentPerformance.selectedStudent}`;
        break;

      case 'detailedInfo':
        dataToExport = attendanceData.filter(item => {
          const groupMatch = filters.detailedInfo.selectedGroup
            ? item.groupName === filters.detailedInfo.selectedGroup
            : true;
          const studentMatch = filters.detailedInfo.selectedStudent
            ? item.studentFullName === filters.detailedInfo.selectedStudent
            : true;
          const subjectMatch = filters.detailedInfo.selectedSubject
            ? item.subjectName === filters.detailedInfo.selectedSubject
            : true;
          const dateMatch = filters.detailedInfo.dateRange.start && filters.detailedInfo.dateRange.end
            ? new Date(item.date) >= new Date(filters.detailedInfo.dateRange.start) &&
              new Date(item.date) <= new Date(filters.detailedInfo.dateRange.end)
            : true;
          return groupMatch && studentMatch && subjectMatch && dateMatch;
        });
        title = 'Детальная информация по посещаемости';
        break;
    }

    if (dataToExport.length === 0) {
      alert('Нет данных для генерации отчета');
      return;
    }

    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');
      
      // Добавляем график как изображение
      if (chartData) {
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '600px';
        chartContainer.style.height = '400px';
        chartContainer.style.position = 'absolute';
        chartContainer.style.left = '-9999px';
        document.body.appendChild(chartContainer);

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        chartContainer.appendChild(canvas);

        const chart = new ChartJS(canvas, {
          type: 'line',
          data: chartData,
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: {
              duration: 0
            }
          }
        });

        // Ждем, пока график отрендерится
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Конвертируем график в изображение
        const chartImage = await html2canvas(chartContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        }).then(canvas => canvas.toDataURL('image/png'));

        const chartWorksheet = XLSX.utils.aoa_to_sheet([[{ t: 's', v: 'График' }]]);
        XLSX.utils.book_append_sheet(workbook, chartWorksheet, 'График');

        // Удаляем временный контейнер
        document.body.removeChild(chartContainer);
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_${blockName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      const doc = new jsPDF();
      
      // Добавляем график
      if (chartData) {
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '600px';
        chartContainer.style.height = '400px';
        chartContainer.style.position = 'absolute';
        chartContainer.style.left = '-9999px';
        document.body.appendChild(chartContainer);

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        chartContainer.appendChild(canvas);

        const chart = new ChartJS(canvas, {
          type: 'line',
          data: chartData,
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: {
              duration: 0
            }
          }
        });

        // Ждем, пока график отрендерится
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Конвертируем график в изображение
        const chartImage = await html2canvas(chartContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        }).then(canvas => canvas.toDataURL('image/png'));

        // Добавляем изображение в PDF
        doc.addImage(chartImage, 'PNG', 20, 20, 170, 100);

        // Удаляем временный контейнер
        document.body.removeChild(chartContainer);
      }

      doc.save(`attendance_${blockName}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Блок 1: График посещаемости группы */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Посещаемость группы</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => generateBlockReport('groupAttendance', 'pdf')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!filters.groupPerformance.selectedGroup || !filters.groupPerformance.selectedSubject}
            >
              Скачать график (PDF)
            </button>
            <button
              onClick={() => generateBlockReport('groupAttendance', 'excel')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={!filters.groupPerformance.selectedGroup || !filters.groupPerformance.selectedSubject}
            >
              Скачать отчет (Excel)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.groupPerformance.selectedSemester}
            onChange={(e) => {
              const newSemester = Number(e.target.value);
              setFilters({
                ...filters,
                groupPerformance: {
                  ...filters.groupPerformance,
                  selectedSemester: newSemester,
                  selectedGroup: '', // Сбрасываем группу при смене семестра
                  selectedSubject: '' // Сбрасываем предмет при смене семестра
                }
              });
            }}
          >
            <option value="">Выберите семестр</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester} семестр</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.groupPerformance.selectedGroup}
            onChange={(e) => {
              setFilters({
                ...filters,
                groupPerformance: {
                  ...filters.groupPerformance,
                  selectedGroup: e.target.value,
                  selectedSubject: '' // Сбрасываем предмет при смене группы
                }
              });
            }}
          >
            <option value="">Выберите группу</option>
            {getFilteredGroups('groupPerformance').map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.groupPerformance.selectedSubject}
            onChange={(e) => setFilters({ ...filters, groupPerformance: { ...filters.groupPerformance, selectedSubject: e.target.value } })}
          >
            <option value="">Выберите предмет</option>
            {getFilteredSubjects('groupPerformance').map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <input
            type="date"
            className="px-4 py-2 border rounded-lg"
            value={filters.groupPerformance.dateRange.start}
            onChange={(e) => setFilters({ ...filters, groupPerformance: { ...filters.groupPerformance, dateRange: { ...filters.groupPerformance.dateRange, start: e.target.value } } })}
            placeholder="Начальная дата"
          />
          <input
            type="date"
            className="px-4 py-2 border rounded-lg"
            value={filters.groupPerformance.dateRange.end}
            onChange={(e) => setFilters({ ...filters, groupPerformance: { ...filters.groupPerformance, dateRange: { ...filters.groupPerformance.dateRange, end: e.target.value } } })}
            placeholder="Конечная дата"
          />
        </div>
        {getGroupAttendanceData() && (
          <Line data={getGroupAttendanceData()} options={chartOptions} />
        )}
      </div>

      {/* Блок 2: График посещаемости студента */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Посещаемость студента</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => generateBlockReport('studentAttendance', 'pdf')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!filters.studentPerformance.selectedStudent}
            >
              Скачать график (PDF)
            </button>
            <button
              onClick={() => generateBlockReport('studentAttendance', 'excel')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={!filters.studentPerformance.selectedStudent}
            >
              Скачать отчет (Excel)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.studentPerformance.selectedSemester}
            onChange={(e) => {
              const newSemester = Number(e.target.value);
              setFilters({
                ...filters,
                studentPerformance: {
                  ...filters.studentPerformance,
                  selectedSemester: newSemester,
                  selectedGroup: '', // Сбрасываем группу при смене семестра
                  selectedStudent: '', // Сбрасываем студента при смене семестра
                  selectedSubject: '' // Сбрасываем предмет при смене семестра
                }
              });
            }}
          >
            <option value="">Выберите семестр</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester} семестр</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.studentPerformance.selectedGroup}
            onChange={(e) => {
              setFilters({
                ...filters,
                studentPerformance: {
                  ...filters.studentPerformance,
                  selectedGroup: e.target.value,
                  selectedStudent: '', // Сбрасываем студента при смене группы
                  selectedSubject: '' // Сбрасываем предмет при смене группы
                }
              });
            }}
          >
            <option value="">Выберите группу</option>
            {getFilteredGroups('studentPerformance').map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.studentPerformance.selectedStudent}
            onChange={(e) => {
              setFilters({
                ...filters,
                studentPerformance: {
                  ...filters.studentPerformance,
                  selectedStudent: e.target.value,
                  selectedSubject: '' // Сбрасываем предмет при смене студента
                }
              });
            }}
          >
            <option value="">Выберите студента</option>
            {getFilteredStudents('studentPerformance').map((student) => (
              <option key={student} value={student}>{student}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.studentPerformance.selectedSubject}
            onChange={(e) => setFilters({ ...filters, studentPerformance: { ...filters.studentPerformance, selectedSubject: e.target.value } })}
          >
            <option value="">Выберите предмет</option>
            {getFilteredSubjects('studentPerformance').map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={filters.studentPerformance.dateRange.start}
              onChange={(e) => setFilters({ ...filters, studentPerformance: { ...filters.studentPerformance, dateRange: { ...filters.studentPerformance.dateRange, start: e.target.value } } })}
              placeholder="Начальная дата"
            />
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={filters.studentPerformance.dateRange.end}
              onChange={(e) => setFilters({ ...filters, studentPerformance: { ...filters.studentPerformance, dateRange: { ...filters.studentPerformance.dateRange, end: e.target.value } } })}
              placeholder="Конечная дата"
            />
          </div>
        </div>
        {getStudentAttendanceData() && (
          <Line data={getStudentAttendanceData()} options={chartOptions} />
        )}
      </div>

      {/* Блок 3: Детальная информация */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Детальная информация</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => generateBlockReport('detailedInfo', 'excel')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={attendanceData.length === 0}
            >
              Скачать отчет (Excel)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.detailedInfo.selectedSemester}
            onChange={(e) => {
              const newSemester = Number(e.target.value);
              setFilters({
                ...filters,
                detailedInfo: {
                  ...filters.detailedInfo,
                  selectedSemester: newSemester,
                  selectedGroup: '', // Сбрасываем группу при смене семестра
                  selectedStudent: '', // Сбрасываем студента при смене семестра
                  selectedSubject: '' // Сбрасываем предмет при смене семестра
                }
              });
            }}
          >
            <option value="">Выберите семестр</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester} семестр</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.detailedInfo.selectedGroup}
            onChange={(e) => {
              setFilters({
                ...filters,
                detailedInfo: {
                  ...filters.detailedInfo,
                  selectedGroup: e.target.value,
                  selectedStudent: '', // Сбрасываем студента при смене группы
                  selectedSubject: '' // Сбрасываем предмет при смене группы
                }
              });
            }}
          >
            <option value="">Все группы</option>
            {getFilteredGroups('detailedInfo').map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.detailedInfo.selectedStudent}
            onChange={(e) => {
              setFilters({
                ...filters,
                detailedInfo: {
                  ...filters.detailedInfo,
                  selectedStudent: e.target.value,
                  selectedSubject: '' // Сбрасываем предмет при смене студента
                }
              });
            }}
          >
            <option value="">Все студенты</option>
            {getFilteredStudents('detailedInfo').map((student) => (
              <option key={student} value={student}>{student}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.detailedInfo.selectedSubject}
            onChange={(e) => setFilters({ ...filters, detailedInfo: { ...filters.detailedInfo, selectedSubject: e.target.value } })}
          >
            <option value="">Все предметы</option>
            {getFilteredSubjects('detailedInfo').map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={filters.detailedInfo.dateRange.start}
              onChange={(e) => setFilters({ ...filters, detailedInfo: { ...filters.detailedInfo, dateRange: { ...filters.detailedInfo.dateRange, start: e.target.value } } })}
              placeholder="Начальная дата"
            />
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={filters.detailedInfo.dateRange.end}
              onChange={(e) => setFilters({ ...filters, detailedInfo: { ...filters.detailedInfo, dateRange: { ...filters.detailedInfo.dateRange, end: e.target.value } } })}
              placeholder="Конечная дата"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФИО</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Процент посещаемости</th>
                {getTableData().flatMap(item => item.dates)
                  .filter((date, index, self) => self.indexOf(date) === index)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map(date => (
                    <th key={date} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {new Date(date).toLocaleDateString()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getTableData().map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.attendanceRate}%</td>
                  {getTableData().flatMap(item => item.dates)
                    .filter((date, index, self) => self.indexOf(date) === index)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                    .map(date => {
                      const attendance = attendanceData.find(
                        d => d.studentFullName === item.studentName && d.date === date
                      )?.status || '-';
                      return (
                        <td key={date} className="px-6 py-4 whitespace-nowrap">
                          {attendance === '+' ? 'Присутствовал' : attendance === '-' ? 'Отсутствовал' : '-'}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Блок 4: Сравнение групп */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Сравнение посещаемости групп</h3>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border rounded-lg"
              value={filters.groupPerformance.selectedSemester}
              onChange={(e) => setFilters({ ...filters, groupPerformance: { ...filters.groupPerformance, selectedSemester: Number(e.target.value) } })}
            >
              <option value="">Выберите семестр</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester} семестр</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getGroupComparisonData().map((group, index) => (
            <div key={group.groupName} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{group.groupName}</h4>
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                {group.attendanceRate}%
              </div>
              {index > 0 && (
                <div className="text-sm text-gray-600">
                  Отставание от лидера: {((getGroupComparisonData()[0].attendanceRate - group.attendanceRate) / getGroupComparisonData()[0].attendanceRate * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Блок 5: Рейтинг групп */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Рейтинг групп по посещаемости</h3>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border rounded-lg"
              value={filters.groupPerformance.selectedSemester}
              onChange={(e) => setFilters({ ...filters, groupPerformance: { ...filters.groupPerformance, selectedSemester: Number(e.target.value) } })}
            >
              <option value="">Выберите семестр</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester} семестр</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Место</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Группа</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Процент посещаемости</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Количество студентов</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Всего занятий</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getGroupRankingData().map((group, index) => (
                <tr key={group.groupName}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{group.groupName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{group.attendanceRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{group.totalStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{group.totalClasses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance; 