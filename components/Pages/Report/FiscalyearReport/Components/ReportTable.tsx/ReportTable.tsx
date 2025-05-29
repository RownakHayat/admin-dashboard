import EmptyData from '@/components/common/SideEffect/EmptyData';
import { useEffect, useState } from 'react';

interface TableRow {
  wing_name: string;
  year_round_targets: number;
  implementation: number;
  percentage_against_annual_target: string;
  amount_allocated_annually: string;
  actual_cost: string;
  expenditure_rate_of_allocated_funds: string;
  proceeds_from_events_programs: string;
}

const ReportTable = ({ fiscalyearReportData, setprint }: any) => {

  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [fiscalYear, setFiscalYear] = useState<string>('');

  useEffect(() => {
    if (fiscalyearReportData?.data) {
      const data = fiscalyearReportData.data;
      const extractedData: TableRow[] = Object.keys(data)
        .filter(key => key !== 'fis_cal_year')
        .map(key => data[key]);

      setTableData(extractedData);
      setFiscalYear(data.fis_cal_year?.name || 'N/A');
    }
  }, [fiscalyearReportData]);


  if (tableData.length > 0) {
    setprint(true)
  } else {
    setprint(false)
  }


  const totalYearRoundTargets = tableData.reduce((acc, row) => acc + (row?.year_round_targets || 0), 0);
  const totalImplementation = tableData.reduce((acc, row) => acc + (row?.implementation || 0), 0);
  const totalAmountAllocatedAnnually = tableData.reduce((acc, row) => acc + parseFloat(row?.amount_allocated_annually || '0'), 0);
  const totalActualCost = tableData.reduce((acc, row) => acc + parseFloat(row?.actual_cost || '0'), 0);
  const totalProceedsFromEventsPrograms = tableData.reduce((acc, row) => acc + parseFloat(row?.proceeds_from_events_programs || '0'), 0);


  return (
    <>
      <style>{`
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    `}</style>
      <div className="grid grid-cols-12 gap-4 mt-5" >
        <div className="col-span-12">
          <div className="w-[100%] overflow-x-auto">
            {tableData.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>এসএমই ফাউন্ডেশন</h4>
                <p className='text-lg'>{fiscalYear}</p>
              </div>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">উইং/শাখা</th>
                    <th colSpan={6} className="border border-gray-400 px-2 py-1">{fiscalYear} অর্থবছর</th>
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">ইভেন্ট/ কর্মসূচী থেকে প্রাপ্ত অর্থ (লক্ষ টাকা) [{fiscalYear}]</th>
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th colSpan={3} className="border border-gray-400 px-2 py-1">ইভেন্ট (nos.) বাস্তবায়ন স্ট্যাটাস</th>
                    <th colSpan={3} className="border border-gray-400 px-2 py-1">ব্যয়িত অর্থের পরিমাণ (লক্ষ টাকা)</th>
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th className="border border-gray-400 px-2 py-1">বছরব্যাপী লক্ষ্যমাত্রা ({fiscalYear})</th>
                    <th className="border border-gray-400 px-2 py-1">বাস্তবায়ন ({fiscalYear})</th>
                    <th className="border border-gray-400 px-2 py-1">বাৎসরিক লক্ষ্যের বিপরীতে শতকরা বাস্তবায়ন ({fiscalYear})</th>
                    <th className="border border-gray-400 px-2 py-1">বাৎসরিক বরাদ্দকৃত অর্থ ({fiscalYear})</th>
                    <th className="border border-gray-400 px-2 py-1">প্রকৃত ব্যয় ({fiscalYear})</th>
                    <th className="border border-gray-400 px-2 py-1">বরাদ্দকৃত অর্থ ব্যয়ের হার ({fiscalYear})</th>
                  </tr>
                </thead>
                <tbody className=''>

                  {tableData?.map((row, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.wing_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.year_round_targets}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.implementation}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.percentage_against_annual_target}%</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.amount_allocated_annually}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.actual_cost}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.expenditure_rate_of_allocated_funds}%</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.proceeds_from_events_programs}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 text-center">
                    <td colSpan={2} className="border border-gray-400 px-2 py-1">Total</td>
                    <td className="border border-gray-400 px-2 py-1">{totalYearRoundTargets}</td>
                    <td className="border border-gray-400 px-2 py-1">{totalImplementation}</td>
                    <td className="border border-gray-400 px-2 py-1"></td>
                    <td className="border border-gray-400 px-2 py-1">{totalAmountAllocatedAnnually.toFixed(2)}</td>
                    <td className="border border-gray-400 px-2 py-1">{totalActualCost.toFixed(2)}</td>
                    <td className="border border-gray-400 px-2 py-1"></td>
                    <td className="border border-gray-400 px-2 py-1">{totalProceedsFromEventsPrograms.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </>) : <>
              <EmptyData />
            </>}
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportTable
