import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OptionData {
  id: number;
  option: string;
  participant: number;
}

const BarChart = ({ optWiseData }: { optWiseData: OptionData[]}) => {
  // Chart Data
  const data = {
    labels: optWiseData.map((item) => `${item.option} (${item.participant})`),
    datasets: [
      {
        label: "Participants",
        data: optWiseData.map((item) => item.participant),
        backgroundColor: ["#17a2b8", "#059669", "#dc3545", "#ffc107", "#007bff"],
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      // legend: { display: false },
      title: { display: true, text: ` `, font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options}/>;
};

export default BarChart;

