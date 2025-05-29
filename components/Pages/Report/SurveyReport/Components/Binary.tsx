import React from 'react'
import ApexChart from './Charts/ApexChart'

const Binary = ({ survey_item }: any) => {

  return (
    <div>
      <div className='pt-4 pb-4'>
        <p>
          <span className='font-medium'>Total Participant: </span>
          <span>{survey_item?.totalParticipant}</span>
        </p>
      </div>
      <div className='w-full flex justify-center'>
        <div className='w-[400px]'>
          {/* <CircleChart chartData={survey_item} /> */}
          <ApexChart chartData={survey_item}/>
        </div>
        {/* <div className='flex gap-10'>
          <div>
            <div className="h-4 w-8 rounded-full bg-teal-800 mb-3" />
            <div className="flex items-center justify-start gap-6">
              <p className="text-sm text-secondary">True</p>
              <p className="text-sm font-semibold text-secondary">{survey_item?.optWiseData[0]?.participant}</p>
            </div>
          </div>
          <div>
            <div className="h-4 w-8 rounded-full bg-[#FF7592] mb-3" />
            <div className="flex items-center justify-start gap-6">
              <p className="text-sm text-secondary">False</p>
              <p className="text-sm font-semibold text-secondary">{survey_item?.optWiseData[1]?.participant}</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Binary
