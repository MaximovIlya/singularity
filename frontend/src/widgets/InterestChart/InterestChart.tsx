import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './InterestChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InterestChartProps {
  currency: string;
}

interface ChartDataPoint {
  date: string;
  rate: number;
}

export const InterestChart: React.FC<InterestChartProps> = ({ currency }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки исторических данных
    const generateMockData = () => {
      const data: ChartDataPoint[] = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Генерируем случайные данные с трендом
        const baseRate =
          currency === 'ETH' ? 12 : currency === 'WBTC' ? 11.5 : 8;
        const volatility =
          currency === 'ETH' ? 2 : currency === 'WBTC' ? 1.5 : 0.5;
        const rate = baseRate + (Math.random() - 0.5) * volatility;

        data.push({
          date: date.toISOString().split('T')[0],
          rate: Math.max(rate, 0),
        });
      }

      setChartData(data);
      setLoading(false);
    };

    setLoading(true);
    setTimeout(generateMockData, 500);
  }, [currency]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 36, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#E0E0E8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('ru-RU');
          },
          label: (context: any) => {
            return `Процентная ставка: ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
        },
        ticks: {
          color: '#B8B8CC',
          font: {
            size: 12,
          },
          callback: function (value: any, index: number) {
            if (index % 5 === 0) {
              const date = new Date(chartData[value]?.date);
              return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
              });
            }
            return '';
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
        },
        ticks: {
          color: '#B8B8CC',
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return value.toFixed(1) + '%';
          },
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
        backgroundColor: '#8B5CF6',
        borderColor: '#A78BFA',
        borderWidth: 2,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
    },
  };

  const data = {
    labels: chartData.map(point => point.date),
    datasets: [
      {
        label: `${currency} APY`,
        data: chartData.map(point => point.rate),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#A78BFA',
        pointHoverBackgroundColor: '#A78BFA',
        pointHoverBorderColor: '#FFFFFF',
      },
    ],
  };

  if (loading) {
    return (
      <div className='chart-loading'>
        <div className='loading-spinner'></div>
        <span>Загрузка данных...</span>
      </div>
    );
  }

  return (
    <div className='interest-chart'>
      <div className='chart-info'>
        <span className='currency-label'>{currency}</span>
        <span className='current-rate'>
          {chartData[chartData.length - 1]?.rate.toFixed(2)}% APY
        </span>
      </div>
      <div className='chart-container'>
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};
