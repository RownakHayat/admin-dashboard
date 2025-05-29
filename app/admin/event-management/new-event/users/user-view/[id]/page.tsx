"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import SingleUserViewComponent from '@/components/Pages/EventManagement/NewEvent/selection/user/view/SingleUserView';

const SingleUserView = () => {

  const { id } = useParams();
  const searchParams = useSearchParams();
  const [eventDetailId, setEventDetailId] = useState<string | null>(null);
  const [selection, setSelection] = useState<string | null>(null);

  
  useEffect(() => {
    const eventId = searchParams.get("event_detail_id"); 
    const selectionId = searchParams.get("selected"); 
    if (eventId && selectionId) {
      setEventDetailId(eventId);
      setSelection(selectionId);
    }
  }, [searchParams]); 

  return (
      <div>
        <SingleUserViewComponent eventDetailId={eventDetailId} userId={id} selection={selection}/>
      </div>
  )
}
export default SingleUserView