
const FinancialTable = ({tableData,fiscalYear}:any) => {

  const totalYearRoundTargets = tableData.reduce((acc: any, row: { year_round_targets: any; }) => acc + (row?.year_round_targets || 0), 0);
  const totalImplementation = tableData.reduce((acc: any, row: { implementation: any; }) => acc + (row?.implementation || 0), 0);
  const totalAmountAllocatedAnnually = tableData.reduce((acc: number, row: { amount_allocated_annually: any; }) => acc + parseFloat(row?.amount_allocated_annually || '0'), 0);
  const totalActualCost = tableData.reduce((acc: number, row: { actual_cost: any; }) => acc + parseFloat(row?.actual_cost || '0'), 0);
  const totalProceedsFromEventsPrograms = tableData.reduce((acc: number, row: { proceeds_from_events_programs: any; }) => acc + parseFloat(row?.proceeds_from_events_programs || '0'), 0);

  return (
    <>
        <div className="w-[100%] overflow-x-auto">
            {tableData.length > 0 && <>
              <div className='text-center pb-4'>
                <h4 className='text-2xl pt-5'>এসএমই ফাউন্ডেশন</h4>
                <p className='text-lg'>{fiscalYear}</p>
              </div>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">উইং/শাখা</th>
                    <th colSpan={6} className="border border-gray-400 px-2 py-1">{fiscalYear} অর্থবছর</th>
                    <th rowSpan={3} className="border border-gray-400 px-2 py-1">ইভেন্ট/ কর্মসূচী থেকে প্রাপ্ত অর্থ (লক্ষ টাকা)</th>
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th colSpan={3} className="border border-gray-400 px-2 py-1">ইভেন্ট (nos.) বাস্তবায়ন স্ট্যাটাস</th>
                    <th colSpan={3} className="border border-gray-400 px-2 py-1">ব্যয়িত অর্থের পরিমাণ (লক্ষ টাকা)</th>
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th className="border border-gray-400 px-2 py-1">বছরব্যাপী লক্ষ্যমাত্রা </th>
                    <th className="border border-gray-400 px-2 py-1">বাস্তবায়ন</th>
                    <th className="border border-gray-400 px-2 py-1">বাৎসরিক লক্ষ্যের বিপরীতে শতকরা বাস্তবায়ন</th>
                    <th className="border border-gray-400 px-2 py-1">বাৎসরিক বরাদ্দকৃত অর্থ </th>
                    <th className="border border-gray-400 px-2 py-1">প্রকৃত ব্যয় </th>
                    <th className="border border-gray-400 px-2 py-1">বরাদ্দকৃত অর্থ ব্যয়ের হার </th>
                  </tr>
                </thead>
                <tbody className=''>
                  {tableData?.map((row: any, index: any) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.wing_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.year_round_targets}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.implementation}</td>
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
            </>}
          </div>
    </>
  )
}

export default FinancialTable
