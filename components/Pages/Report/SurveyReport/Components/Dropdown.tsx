import React from 'react'
import BarChart from './Charts/BarChart'

const Dropdown = ({ survey_item }: any) => {
  const optWiseData = survey_item?.optWiseData;
  return (
    <>
      <div>
        <p>
          <span className='font-medium'>Total Participant: </span> {survey_item?.totalParticipant}
        </p>
      </div>
      <div className='h-[300px] overflow-x-hidden flex justify-center'>
        <BarChart optWiseData={optWiseData} />
      </div>
    </>
  )
}

export default Dropdown
