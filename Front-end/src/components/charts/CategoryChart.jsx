import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ products }) {
    // Dynamic data aggregation from props or empty array
    const dataList = products || [];
    const categories = {};
    dataList.forEach(p => {
         categories[p.category] = (categories[p.category] || 0) + p.stock;
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [
          {
            label: 'Stock por Categoría',
            data: Object.values(categories),
            backgroundColor: [
              '#0C324A',
              '#C11720',
              '#679CBC',
              '#FEF1D5',
              '#1e293b',
            ],
            borderWidth: 0,
          },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { position: 'right' } 
        },
        cutout: '70%'
    };

  return <Doughnut data={data} options={options} />;
}

