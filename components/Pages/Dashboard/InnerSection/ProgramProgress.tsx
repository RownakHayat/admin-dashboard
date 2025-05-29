"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
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

const ProgramProgressChart: React.FC = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Program Progress",
        data: [20, 60, 40, 70, 30, 50, 30, 50, 60, 80, 70, 90],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Program Progress",
      },
    },
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Program Progress</h2>
          <select className=" border border-spacing-2 rounded-lg p-2 bg-[#fff] text-[15px]">
            <option value="actual value 1" className="bg-white text-black m-2">2023-24</option>
            <option value="actual value 2" className="bg-white text-black m-2">2024-25</option>
          </select>
        </div>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default ProgramProgressChart;
