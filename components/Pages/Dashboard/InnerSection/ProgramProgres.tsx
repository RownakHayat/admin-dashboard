"use client";
import { FormAutoCompleteOnChange } from "@/components/common/Form/FormAutoCompleteOnChange";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import {
  useGetAllFinancialYearQuery,
  useGetYearProgramDataListViewQuery,
} from "@/store/features/configuration/financialYear";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useForm } from "react-hook-form";
import { z } from "zod";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const defaultSchema = z.object({
  fiscal_year: z.string().nonempty("Fiscal Year is required"),
});
type FormData = z.infer<typeof defaultSchema>;

const ProgramProgress: React.FC = () => {
  const { data: fiscalYear } = useGetAllFinancialYearQuery();
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(defaultSchema),
    defaultValues: {
      fiscal_year: selectedFiscalYear || "",
    },
  });

  const { control, setValue } = form;

  const { data: programProgressData } = useGetYearProgramDataListViewQuery(
    selectedFiscalYear ? { id: selectedFiscalYear } : undefined,
    { skip: !selectedFiscalYear }
  );

  useEffect(() => {
    if (fiscalYear?.data?.length > 0) {
      let fiscalYearId = fiscalYear.data[0]?.id;

      if (programProgressData?.data?.fiscal_year_id) {
        fiscalYearId = programProgressData.data.fiscal_year_id;
      }

      setSelectedFiscalYear(fiscalYearId);
      setValue("fiscal_year", fiscalYearId);
    }
  }, [fiscalYear, programProgressData, setValue]);

  const handleProgramProgressChange = (value: string | null) => {
    setSelectedFiscalYear(value);
    setValue("fiscal_year", value || "");
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Program Progress",
        data:
          selectedFiscalYear && programProgressData
            ? [
              programProgressData?.data?.month_array?.Jan,
              programProgressData?.data?.month_array?.Feb,
              programProgressData?.data?.month_array?.Mar,
              programProgressData?.data?.month_array?.Apr,
              programProgressData?.data?.month_array?.May,
              programProgressData?.data?.month_array?.Jun,
              programProgressData?.data?.month_array?.Jul,
              programProgressData?.data?.month_array?.Aug,
              programProgressData?.data?.month_array?.Sep,
              programProgressData?.data?.month_array?.Oct,
              programProgressData?.data?.month_array?.Nov,
              programProgressData?.data?.month_array?.Dec,
            ]
            : [],
        fill: false,
        borderColor: "green",
        tension: 0.2,
        pointBackgroundColor: "green",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       max: 100,
  //     },
  //   },
  // };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "nearest", // Use "nearest" for compatibility
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    layout: {
      padding: {
        right: 20,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between">
        <h2 className="text-xl font-normal text-[#545454] mb-4">
          Program Progress
        </h2>

        <FormAutoCompleteOnChange
          name="fiscal_year"
          singleListName="fiscalYear"
          value={selectedFiscalYear}
          data={listArrayDaynamicModify(fiscalYear?.data, "fiscalYear", "name")}
          label=""
          placeholder="Select Year"
          control={control}
          onChange={handleProgramProgressChange}
        />
      </div>
      <div className="mb-4 mt-5  w-full">
        {/* <Line
          className="line_chat"
          data={data}
          options={options}
          style={{ width: "100%", height: "100vh" }}
        /> */}
        <Line
          className="line_chat lg:max-h-[390px] xl:!max-h-[290px] 2xl:!max-h-[390px]"
          data={data}
          options={options}
          style={{ width: "100%", height: "100vh", position: 'relative', maxHeight: '295px' }}
        />
      </div>
    </div>
  );
};

export default ProgramProgress;
