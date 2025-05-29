import EmptyData from '@/components/common/SideEffect/EmptyData';
import { useEffect } from 'react';

const SummaryReportTable = ({ summaryReportData, setprint }: any) => {

  useEffect(() => {
    if (summaryReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [summaryReportData, setprint]);


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
            {summaryReportData?.data?.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>Summary List Report</h4>
                <p className='text-lg'>SME Foundation</p>
              </div>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    {
                      tableHeaderData?.map((headline) => (
                        <th className="border border-gray-400 px-2 py-1" key={headline?.name}>{headline?.name}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody className=''>

                  {summaryReportData?.data?.map((row: any, index: any) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.events}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.expense}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.income}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.programs}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.users}</td>
                    </tr>
                  ))}

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

const tableHeaderData = [
  {
    id: 1,
    name: 'Sl.'
  },
  {
    id: 2,
    name: 'Events'
  },
  {
    id: 3,
    name: 'Expense'
  },
  {
    id: 3,
    name: 'Income'
  },
  {
    id: 3,
    name: 'Programs'
  },
  {
    id: 3,
    name: 'Users'
  },


]

export default SummaryReportTable
