
import { siteConfig } from '@/config/site';
import Image from 'next/image';
import { useEffect } from 'react';


const ReportTable = ({ ReportData, setPrint, monthName }: any) => {

  useEffect(() => {
    if (ReportData != null) {
      setPrint(true)
    }
  }, [ReportData])

  const firstValue = ReportData?.data?.financial_year && ReportData?.data?.financial_year.split("-")[0]

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
            <div className="min-w-full mt-4 mb-3">
              <table className="table-auto border-collapse w-full">
                <tbody>
                  <tr className="border">
                    <td colSpan={4} className="border border-gray-400 px-4 py-2 font-semibold text-center">Implementation Status Report (ISR) </td>
                  </tr>
                  <tr className="border">
                    <td colSpan={4} className="border border-gray-400 px-4 py-2 font-semibold text-center">SME Foundation {ReportData?.data?.financial_year} </td>
                  </tr>
                  <tr className="border">
                    <td className="border border-gray-400 px-4 py-2 font-semibold">Wing</td>
                    <td colSpan={3} className="border border-gray-400 px-4 py-2 uppercase">{ReportData?.data?.wing}</td>
                  </tr>
                  <tr className="border">
                    <td className="border border-gray-400 px-4 py-2 font-semibold">Duration</td>
                    <td className="border border-gray-400 px-4 py-2">{monthName} {firstValue}  </td>
                    <td className="border border-gray-400 px-4 py-2 font-semibold">Financial Year</td>
                    <td className="border border-gray-400 px-4 py-2">{ReportData?.data?.financial_year}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mb-4 font-bold'>
              <h1>I. Progress of the Activity of AWP (Excluding detail of the organized event):</h1>
            </div>
            {
              ReportData?.data?.progress_of_activity.length > 0 ? <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    <th className="border border-gray-400 px-2 py-1">Sl.</th>
                    <th className="border border-gray-400 px-2 py-1">Title of the Activity (According to the AWP)</th>
                    <th className="border border-gray-400 px-2 py-1">Implementation Status/ Progress/ sub-activities initiated or implemented
                    </th>
                    <th className="border border-gray-400 px-2 py-1">Budget Allocated (in BDT)</th>
                    <th className="border border-gray-400 px-2 py-1">Budget Spent (in BDT)</th>
                    <th className="border border-gray-400 px-2 py-1">Activities completed on October 2024 only</th>
                    <th className="border border-gray-400 px-2 py-1">No. of beneficiary</th>
                    <th className="border border-gray-400 px-2 py-1">Remarks</th>
                  </tr>
                </thead>
                <tbody className=''>

                  {ReportData?.data?.progress_of_activity?.map((row: any, index: number) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.name_en}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.completed_events} out of {row?.target_of_event}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.total_amount}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.budget_spent}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.completed_events}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.number_of_beneficiary}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.proceeds_from_events_programs}</td>
                    </tr>
                  ))}

                </tbody>
              </table> : <p>No Data Found</p>
            }

            <div className='mt-4 mb-4 font-bold'>
              <h1>II. Event Organized (In Details): </h1>
            </div>
            {
              ReportData?.data?.event_organized.length > 0 ? <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    <th className="border border-gray-400 px-2 py-1">Sl.</th>
                    <th className="border border-gray-400 px-2 py-1">Date/ Duration</th>
                    <th className="border border-gray-400 px-2 py-1">Wing</th>
                    <th className="border border-gray-400 px-2 py-1">Venue</th>
                    <th className="border border-gray-400 px-2 py-1">Event</th>
                    <th className="border border-gray-400 px-2 py-1">Participants (Organization/ Personnel)</th>
                    <th className="border border-gray-400 px-2 py-1">Objective(s)/ Output(s)</th>
                    <th className="border border-gray-400 px-2 py-1">Remarks</th>
                  </tr>
                </thead>
                <tbody className=''>

                  {ReportData?.data?.event_organized?.map((row: any, index: number) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.start_date} - {row?.end_date}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.program_info?.wing?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.venue}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.event_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.attended_participants}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.number_of_beneficiary}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.remarks}</td>
                    </tr>
                  ))}

                </tbody>
              </table> : <p>No Data Found</p>
            }

          </div>
        </div>
        <div className="col-span-12">
          <div className='mt-4 mb-4 font-bold'>
            <h1>Pictures of Different Activities completed on {monthName} {firstValue}  only. </h1>
          </div>
        </div>

        {
          ReportData?.data?.event_attachments.length > 0 ? <>  {ReportData?.data?.event_attachments?.map((row: any, index: number) => (
            <>
              {row?.event_attachments?.map((item: any, index: number) => (
                <div key={item.id} className="text-center space-y-2 col-span-4">
                  {item?.attach_file_path.split('.').pop()?.toLowerCase() != 'pdf' && (
                    <div className='p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                      <div className='flex items-center justify-center'>
                        <Image
                          src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}
                          alt={item?.attachment_name || "Attachment"}
                          width={500}
                          height={800}
                          className='w-[100%] h-[200px] rounded-lg'
                        />
                      </div>
                      <p className="pt-5 text-xl text-gray-700">{item?.attachment_name}</p>
                      <p className=" text-xl text-gray-700">{row?.event_name}</p>
                    </div>
                  )}

                </div>
              ))}
            </>
          ))}
          </> : <div  className="text-start col-span-12">No Image Found</div>
        }

      </div>
    </>
  )
}

export default ReportTable
