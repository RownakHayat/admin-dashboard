import EmptyData from '@/components/common/SideEffect/EmptyData'
import moment from 'moment'

const ReportTable = ({ activityReportData, setprint }: any) => {

  if (activityReportData?.data?.length > 0) {
    setprint(true)
  } else {
    setprint(false)
  }

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
            {activityReportData?.data?.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>Activity Performed Other than AWP</h4>
                <p className='text-lg'>SME Foundation</p>
              </div>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    <th className="border border-gray-400 px-2 py-1">Sl.</th>
                    <th className="border border-gray-400 px-2 py-1">Date/ Duration</th>
                    <th className="border border-gray-400 px-2 py-1">Wing</th>
                    <th className="border border-gray-400 px-2 py-1">Venue/ Place</th>
                    <th className="border border-gray-400 px-2 py-1">Name of the Event/ Activity</th>
                    <th className="border border-gray-400 px-2 py-1">Participants/ Organizer</th>
                    <th className="border border-gray-400 px-2 py-1">Specific Tasks performed</th>
                    <th className="border border-gray-400 px-2 py-1">Objective(s)</th>
                    <th className="border border-gray-400 px-2 py-1">Remarks</th>

                  </tr>

                </thead>
                <tbody className=''>

                  {activityReportData?.data?.map((row: any, index: any) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        {moment(row?.start_date).format('D-MM-YYYY')} &mdash; {moment(row?.end_date).format('D-MM-YYYY')}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">{row?.program_info?.wing.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.venue}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.event_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.organizer?.name}</td>
                      <td className="border border-gray-400 px-2 py-1"></td>
                      <td className="border border-gray-400 px-2 py-1"></td>
                      <td className="border border-gray-400 px-2 py-1">{row?.remarks}</td>
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

export default ReportTable
