import React from 'react'
import { ProgressLine } from './Charts/ProgressLine'

const Multiple = ({ survey_item }: any) => {
  return (
    <div>
      <div className='pt-3 pb-5'>
      <p className='text-sm font-light'>(Multiple Choice)</p>
        <p>
          <span className='font-medium'>Total Participant: </span> {survey_item?.totalParticipant}
        </p>
      </div>
      <div>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Option</th>
              <th className="border border-gray-300 p-2">Graph</th>
              <th className="border border-gray-300 p-2">Participants</th>
              <th className="border border-gray-300 p-2" rowSpan={survey_item?.optWiseData.length}>Total Participants</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {
              survey_item?.optWiseData?.map((item: any, index: number) => {
                return (
                  <tr>
                    <td className="border border-gray-300 p-2">{item?.option}</td>
                    <td className="border border-gray-300 p-2">
                    <ProgressLine value={item?.participant} total={survey_item?.totalParticipant} bgColor="bg-emerald-600"  className="w-[80%] h-3" />
                    </td>
                    <td className="border border-gray-300 p-2">{item?.participant}</td>
                    {index === 0 && (
                      <td className="border border-gray-300 p-2 text-center" rowSpan={survey_item?.optWiseData.length}>
                        {survey_item?.totalParticipant}
                      </td>
                    )}
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Multiple
