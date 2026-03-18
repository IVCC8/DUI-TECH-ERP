import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
  }
};


const defaultLabels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export default function SalesChart({ salesData }) {
  const chartData = salesData || {
    labels: defaultLabels,
    datasets: [
      {
        label: 'Ingresos ($)',
        data: [12000, 19000, 3000, 5000, 22000, 35000, 45200],
        backgroundColor: '#0C324A',
        borderRadius: 4,
      },
      {
        label: 'Costos ($)',
        data: [8000, 12000, 2000, 3000, 15000, 25000, 30000],
        backgroundColor: '#C11720',
        borderRadius: 4,
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}

