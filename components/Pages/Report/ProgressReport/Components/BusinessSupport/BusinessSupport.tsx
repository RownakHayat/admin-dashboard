
const BusinessSupport = ({ progressReportData }: any) => {

  const data = progressReportData?.data?.financial_year?.name || ""
  const splitData = data?.split("-")
  const firstValue = splitData[0]
  const secondValue = splitData[1]

  return (
    <div className="w-[100%] overflow-x-auto">
      {
        progressReportData?.data?.wing_details?.map((wing_item: any, index: any) => {
           return (
            <>

              {
                wing_item?.programs?.length > 0 && <>
                  <div className='text-center pb-4 mt-5'>
                    <h4 className='text-xl underline underline-offset-8'>{wing_item?.name}</h4>
                  </div>

                  <div className="min-w-full p-4 mb-3">
                    <table className="table-auto border-collapse w-full">
                      <tbody>
                        <tr className="border">
                          <td className="border border-gray-400 px-4 py-2 font-semibold">Name of the Wing</td>
                          <td colSpan={3} className="border border-gray-400 px-4 py-2 uppercase">{wing_item?.name}</td>
                        </tr>
                        <tr className="border">
                          <td className="border border-gray-400 px-4 py-2 font-semibold">Duration</td>
                          <td className="border border-gray-400 px-4 py-2"> {`01 July ${firstValue} - 30 June 20${secondValue}`}</td>
                          <td className="border border-gray-400 px-4 py-2 font-semibold">Financial Year</td>
                          <td className="border border-gray-400 px-4 py-2">{progressReportData?.data?.financial_year?.name}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className='pb-3 font-semibold'>Progress of the Activity of AWP (Excluding detail of the organized event):</p>
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-300 text-center">
                        <th className="border border-gray-400 px-2 py-1">Sl. No</th>
                        <th className="border border-gray-400 px-2 py-1">Title of the Activity(According to the AWP)</th>
                        <th className="border border-gray-400 px-2 py-1">Implementation Status/ Progress/ sub-activities initiated or implemented</th>
                        <th className="border border-gray-400 px-2 py-1">Budget Allocated (in BDT)</th>
                        <th className="border border-gray-400 px-2 py-1">Budget Spent(in BDT)</th>
                        <th className="border border-gray-400 px-2 py-1">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className=''>
                      {wing_item?.programs?.map((program: any, index: any) => (
                        <tr key={index} className="text-center">
                          <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                          <td className="border border-gray-400 px-2 py-1">{program?.name_en}</td>
                          <td className="border border-gray-400 px-2 py-1">
                            {program?.completed_events} Completed out of {program?.target_of_event}</td>
                          <td className="border border-gray-400 px-2 py-1">{program?.total_amount}</td>
                          <td className="border border-gray-400 px-2 py-1">{program?.budget_spent}</td>
                          <td className="border border-gray-400 px-2 py-1"></td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </>
              }

            </>
          )
        })
      }

    </div>
  )
}

export default BusinessSupport
