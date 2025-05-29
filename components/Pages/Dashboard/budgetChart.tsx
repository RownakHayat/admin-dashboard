"use client";

import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ChartDataLabels);
const BudgetChart: React.FC = () => {
  const data: ChartData<'doughnut'> = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [90, 10], // Assuming 90% of the budget is used
        backgroundColor: ['#8cb3ff', '#e0e7ff'], // Adjust colors as needed
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '80%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: {
        display: true,
        formatter: (value, context) => {
          if (context.dataIndex === 0) {
            return ['Total Budget', '50,00,000'];
          }
          return '';
        },
        color: '#000',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default BudgetChart;
