import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BiShow, BiHide, BiExpand, BiCollapse, BiSearch, BiX } from 'react-icons/bi';

interface Subject {
  fullName: string;
  subjectName: string;
}

interface Student {
  fullName: string;
  email: string;
}

const QRCodeGenerator: React.FC = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [isMarkingEnabled, setIsMarkingEnabled] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Функция для определения доступных семестров
  const getAvailableSemesters = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() возвращает 0-11
    
    // Если месяц с февраля по август (2-8)
    if (month >= 2 && month <= 8) {
      return [2, 4, 6, 8];
    }
    // Если месяц с сентября по январь (9-1)
    return [1, 3, 5, 7];
  };

  useEffect(() => {
    const checkRole = async () => {
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

        const [subjectsResponse, studentsResponse] = await Promise.all([
          axios.get('/api/Teacher/my-subjects', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('/api/Teacher/my-students', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        setSubjects(subjectsResponse.data);
        setStudents(studentsResponse.data);
        if (subjectsResponse.data.length > 0) {
          setSelectedSubject(subjectsResponse.data[0].subjectName);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        router.push('/login');
      }
    };

    checkRole();
  }, [router]);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const today = new Date();
      const [hours, minutes] = time.split(':');
      today.setHours(parseInt(hours), parseInt(minutes));
      
      const response = await axios.post('/api/QRcode/generate-token', {
        subjectName: selectedSubject,
        date: today.toISOString(),
        semester: selectedSemester
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrToken(response.data.token);
      setShowToken(false);
      setIsMarkingEnabled(true);
    } catch (error) {
      console.error('Ошибка при генерации QR-кода:', error);
    }
    setLoading(false);
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleMarkStudent = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const today = new Date();
      const [hours, minutes] = time.split(':');
      today.setHours(parseInt(hours), parseInt(minutes));

      const student = students.find(s => s.fullName === selectedStudent);
      
      await axios.post('/api/Attendance', {
        email: student?.email,
        subjectName: selectedSubject,
        date: today.toISOString(),
        status: "+",
        semester: selectedSemester
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedStudent('');
      showNotification('Студент успешно отмечен!');
    } catch (error) {
      console.error('Ошибка при отметке студента:', error);
      showNotification('Ошибка при отметке студента');
    }
    setLoading(false);
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Выберите предмет
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            {subjects.map((subject) => (
              <option key={subject.subjectName} value={subject.subjectName}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Выберите семестр
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          >
            {getAvailableSemesters().map((semester) => (
              <option key={semester} value={semester}>
                {semester} семестр
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Выберите время
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <button
          onClick={handleGenerateQR}
          disabled={loading || !time}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Генерация...
            </span>
          ) : (
            'Сгенерировать QR-код'
          )}
        </button>

        {qrToken && (
          <div className="space-y-4 relative">
            <div className={`flex justify-center p-4 bg-white rounded-lg border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
              <div 
                className="relative cursor-pointer"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <QRCode 
                  value={qrToken} 
                  size={isFullscreen ? 400 : 200}
                  className="transition-all duration-300 hover:opacity-90"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Токен:</p>
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="text-indigo-500 hover:text-indigo-600 focus:outline-none"
                >
                  {showToken ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
              <div className={`bg-white p-3 rounded-md border border-gray-200 ${showToken ? '' : 'blur-sm'}`}>
                <p className="text-sm break-all">{qrToken}</p>
              </div>
            </div>
          </div>
        )}

        {qrToken && isMarkingEnabled && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Отметить студента</h3>
            <div className="space-y-2">
              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer flex justify-between items-center"
                >
                  <span className={selectedStudent ? "text-gray-900" : "text-gray-500"}>
                    {selectedStudent || "Выберите студента"}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск студента..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.email}
                          onClick={() => {
                            setSelectedStudent(student.fullName);
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {student.fullName}
                        </div>
                      ))}
                      {filteredStudents.length === 0 && (
                        <div className="px-4 py-2 text-gray-500">
                          Студенты не найдены
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleMarkStudent}
                disabled={loading || !selectedStudent}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Отметка...' : 'Отметить студента'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
          <span>{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 hover:text-gray-200"
          >
            <BiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 