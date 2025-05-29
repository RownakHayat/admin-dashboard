import EmptyData from '@/components/common/SideEffect/EmptyData';
import React from 'react'

const ReportTable = ({ tableData, setPrint }: any) => {

  if (tableData?.data?.length > 0) {
    setPrint(true)
  } else {
    setPrint(false)
  }

  const data = tableData?.data[0]?.program_detail_financialYear?.name ? tableData?.data[0]?.program_detail_financialYear?.name : ""
  const splitData = data?.split("-")
  const firstValue = splitData[0]
  const secondValue = splitData[1]

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
            {
              tableData?.data?.length > 0 ? <>
                <div className='text-center pb-4'>
                  <h4 className='text-xl'>Implementation Status Report (MPR) </h4>
                  <h4 className='text-lg'>SME Foundation </h4>
                </div>

                <div className="min-w-full p-4 mb-3">
                  <table className="table-auto border-collapse w-full">
                    <tbody>
                      <tr className="border">
                        <td className="border border-gray-400 px-4 py-2 font-semibold">Wing</td>
                        <td colSpan={3} className="border border-gray-400 px-4 py-2 uppercase">{tableData?.data[0]?.program_detail_wing?.name}</td>
                      </tr>
                      <tr className="border">
                        <td className="border border-gray-400 px-4 py-2 font-semibold">Month</td>
                        <td className="border border-gray-400 px-4 py-2"> July {firstValue} - June {secondValue}</td>
                        <td className="border border-gray-400 px-4 py-2 font-semibold">Financial Year</td>
                        <td className="border border-gray-400 px-4 py-2">{tableData?.data[0]?.program_detail_financialYear?.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-300 text-center">
                      <th className="border border-gray-400 px-2 py-1">Sl. No</th>
                      <th className="border border-gray-400 px-2 py-1">Title of the Activity(According to the AWP)</th>
                      <th className="border border-gray-400 px-2 py-1">Implementation Status/ Progress/ sub-activities initiated or implemented</th>
                      <th className="border border-gray-400 px-2 py-1">Budget Allocated (in BDT)</th>
                      <th className="border border-gray-400 px-2 py-1">Budget Spent(in BDT)</th>
                      <th className="border border-gray-400 px-2 py-1">Reason for Not Spending Budget</th>
                      <th className="border border-gray-400 px-2 py-1">Activities completed on July 2022 to June 2023.</th>
                      <th className="border border-gray-400 px-2 py-1">Income</th>
                    </tr>
                  </thead>
                  <tbody className=''>
                    {tableData?.data?.map((row: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                        <td className="border border-gray-400 px-2 py-1">{row?.program_detail}</td>
                        <td className="border border-gray-400 px-2 py-1">
                          {row?.target_of_event} <span>&#8208;</span> {row?.event_details_count}
                        </td>
                        <td className="border border-gray-400 px-2 py-1">{row?.total_amount}</td>
                        <td className="border border-gray-400 px-2 py-1">{row?.event_details_sum_spent_amount == null ? "0" : row?.event_details_sum_spent_amount}</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                        <td className="border border-gray-400 px-2 py-1">{row?.event_details_count}</td>
                        <td className="border border-gray-400 px-2 py-1">{row?.total_income}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </> : <>
                <EmptyData />
              </>
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default ReportTable
