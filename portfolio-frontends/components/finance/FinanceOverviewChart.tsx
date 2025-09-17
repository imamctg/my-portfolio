// components/admin/finance/FinanceOverviewChart.tsx
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const data = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [
        12000, 19000, 15000, 18000, 21000, 25000, 22000, 24000, 28000, 30000,
        32000, 35000,
      ],
      backgroundColor: 'rgba(79, 70, 229, 0.8)',
    },
    {
      label: 'Refunds',
      data: [
        2000, 3000, 1500, 1800, 2100, 2500, 2200, 2400, 2800, 3000, 3200, 3500,
      ],
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Revenue Overview',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: number) {
          return '$' + value.toLocaleString()
        },
      },
    },
  },
}

export function FinanceOverviewChart() {
  return <Bar options={options} data={data} />
}
