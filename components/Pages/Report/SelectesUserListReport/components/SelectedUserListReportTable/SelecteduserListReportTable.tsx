import EmptyData from '@/components/common/SideEffect/EmptyData';
import { useEffect } from 'react';


const SelecteduserListReportTable = ({ selecteduserReportData, setprint }: any) => {

  useEffect(() => {
    if (selecteduserReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [selecteduserReportData, setprint]);


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
            {selecteduserReportData?.data?.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>Event Wise Selected SME User List Report</h4>
                <p className='text-lg'>SME Foundation</p>
              </div>
              <div className='my-4'>
                    {selecteduserReportData?.data?.map((event: any, index: number) => (
                      <div className="" key={index}>
                        <h2>{event?.event_name}</h2>
                        <p>User list:</p>
                      </div>
                    ))}
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
                {selecteduserReportData?.data?.map((events: any, index: number) => (
                    events?.event_application?.map((row: any, indexs: any) =>(
                      <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{indexs + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.mobile}</td>
                    </tr>
                    ))
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
    name: 'User Name'
  },
  {
    id: 3,
    name: 'Phone Number'
  },
  {
    id: 4,
    name: 'Email'
  },


]

export default SelecteduserListReportTable
