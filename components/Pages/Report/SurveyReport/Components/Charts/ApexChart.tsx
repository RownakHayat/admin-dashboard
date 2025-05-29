"use client"; // Add this if you're using Next.js (only for Next.js)

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts"; // Import ApexOptions for TypeScript compatibility
import dynamic from "next/dynamic";

// ✅ Disable SSR for ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ApexChart = ({chartData}:any) => {

  const [state, setState] = useState<{ series: number[]; options: ApexOptions }>({
    series: [],
    options: {
      chart: { type: "pie" },
      labels: ["True", "False"],
      colors: ["rgba(17, 94, 89)", "rgba(255, 117, 146, 1)"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  });

    // ✅ Ensure state updates after mount (fixes hydration mismatch)
    useEffect(() => {
      if (chartData?.optWiseData) {
        setState((prevState) => ({
          ...prevState,
          series: chartData.optWiseData.map((data: any) => data.participant),
        }));
      }
    }, [chartData]);

  return (
    <div>
      <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
    </div>
  );
};

export default ApexChart;
