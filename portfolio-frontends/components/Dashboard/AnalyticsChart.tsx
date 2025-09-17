'use client'

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

interface Props {
  chartData: (number | undefined)[]
}

export const AnalyticsChart = ({ chartData }: Props) => {
  const data = {
    labels: ['Visitors', 'Projects', 'Clients'],
    datasets: [
      {
        label: 'Stats',
        data: chartData.map((v) => v || 0),
        backgroundColor: ['#3b82f6', '#10b981', '#facc15'],
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
        text: 'Portfolio Analytics',
      },
    },
  }

  return <Bar data={data} options={options} />
}
