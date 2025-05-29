"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const ProgressReportGraph = ({ progressReportData }: any) => {


  const chartData = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Program Progress",
        data:
          progressReportData
            ? [
              progressReportData?.data?.graph?.July,
              progressReportData?.data?.graph?.August,
              progressReportData?.data?.graph?.September,
              progressReportData?.data?.graph?.October,
              progressReportData?.data?.graph?.November,
              progressReportData?.data?.graph?.December,
              progressReportData?.data?.graph?.January,
              progressReportData?.data?.graph?.February,
              progressReportData?.data?.graph?.March,
              progressReportData?.data?.graph?.April,
              progressReportData?.data?.graph?.May,
              progressReportData?.data?.graph?.June,
            ]
            : [],
        fill: false,
        borderColor: '#4f8efc',
        tension: 0.2,
        pointBackgroundColor: "green",
        pointRadius: 6,
        pointHoverRadius: 8,
        backgroundColor: '#4f8efc',
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Number of Events',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (<div className='w-full flex justify-center'>
    <Line
      data={chartData}
      options={options}
      style={{ width: "80%", height: "100vh", position: 'relative', maxHeight: '400px' }}
    />
  </div>)
};

export default ProgressReportGraph;
