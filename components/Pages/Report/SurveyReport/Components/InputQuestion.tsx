import React from 'react'

const InputQuestion = ({survey_item}:any) => {
  return (
    <div>
     <p>
      <span className='font-medium'>Total Participant: </span>
      <span>{survey_item?.totalParticipant}</span>
     </p>
    </div>
  )
}

export default InputQuestion
