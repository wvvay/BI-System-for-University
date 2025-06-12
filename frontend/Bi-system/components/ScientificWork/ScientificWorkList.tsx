import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScientificWork {
  namePublication: string;
  yearPublication: number;
  categoryPublication: string;
  link: string;
}

const ScientificWorkList = () => {
  const [works, setWorks] = useState<ScientificWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/ScientificWork/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorks(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке научных работ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Группируем работы по категориям
  const groupedWorks = works.reduce((acc, work) => {
    if (!acc[work.categoryPublication]) {
      acc[work.categoryPublication] = [];
    }
    acc[work.categoryPublication].push(work);
    return acc;
  }, {} as Record<string, ScientificWork[]>);

  // Подготавливаем данные для графика
  const years = Array.from(new Set(works.map(work => work.yearPublication))).sort();
  const worksByYear = years.map(year => 
    works.filter(work => work.yearPublication === year).length
  );

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Количество научных работ',
        data: worksByYear,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика научных работ по годам'
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {Object.entries(groupedWorks).map(([category, works]) => (
        <div
          key={category}
          className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-6 backdrop-blur-md"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  <a 
                    href={work.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {work.namePublication}
                  </a>
                </h4>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {work.yearPublication}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScientificWorkList; 