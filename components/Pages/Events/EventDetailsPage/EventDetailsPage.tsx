"use client"

import { Button } from '@/components/ui/button';
import { useGetEventDetailsSingleViewQuery } from '@/store/features/eventManagement/newEvent';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

const EventDetailsPage = () => {
    
  
    const { data: eventDetails } = useGetEventDetailsSingleViewQuery({})

    const [id, setId] = useState(null)

    const handleClick = (data: any) =>{
        setId(data?.id)
        
      }
    

  return (
    <div className='custom_container  grid grid-cols-12 gap-3 py-3'>
    
    <div className= "font-bangla bg-white rounded-lg py-8 px-12 border border-spacing-1">
        <div className='flex  sm:text-[3%] lg:text-lg'>
            <div className='flex justify-between w-[150px] font-bold'>
                <p className='sm:text-sm md:text-lg lg:text-lg text-nowrap'>Event Name</p>
                <p>:</p>
            </div>
            <span
                className='ml-3 sm:text-sm md:text-lg lg:text-lg font-bold break-words'>{eventDetails?.data?.event_name}</span>
        </div>
        <div className='border border-spacing-2 mb-4'></div>
        <div className='flex  sm:text-[4%] lg:text-lg'>
            <div className='flex justify-between w-[170px] lg:w-[150px]'>
                <p className='sm:text-sm md:text-lg lg:text-lg text-nowrap'>Activity</p>
                <p>:</p>
            </div>
            <span
                className='ml-3 sm:text-sm md:text-lg lg:text-lg text-wrap'>{eventDetails?.data?.activity?.name}</span>
        </div>
        <div className='flex'>
            <div className='flex sm:text-[4%] lg:text-lg text-nowrap'>
                <div className='flex justify-between w-[145px] lg:w-[150px]'>
                    <p className='sm:text-sm md:text-lg lg:text-lg text-nowrap'>Date</p>
                    <p>:</p>
                </div>
                <span className='ml-3 sm:text-xs md:text-lg lg:text-lg text-nowrap'>
                    {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')} - {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}

                </span>
            </div>
        </div>
        <div className='flex'>
            <div className='flex sm:text-[4%] lg:text-lg text-nowrap'>
                <div className='flex justify-between w-[145px] lg:w-[150px]'>
                    <p className='sm:text-sm md:text-lg lg:text-lg text-nowrap'>Duration</p>
                    <p>:</p>
                </div>
                <span className='ml-3 sm:text-xs md:text-lg lg:text-lg text-nowrap'>
                    {moment(eventDetails?.data?.end_date).diff(moment(eventDetails?.data?.start_date), 'days') + 1} Day
                </span>
            </div>
        </div>

        <div className='flex'>
            <div className='flex sm:text-[2%] lg:text-lg'>
                <div className='flex justify-between w-[150px]'>
                    <p className='text-nowrap sm:text-sm md:text-lg lg:text-lg'>Program Name</p>
                    <p>:</p>
                </div>
                <span
                    className='ml-3 xs:text-xs sm:text-sm md:text-lg lg:text-lg break-words text-wrap'>{eventDetails?.data?.program_info?.name_en}.</span>
            </div>
        </div>
        <div className='flex'>
            <div className='flex  sm:text-[4%] lg:text-lg'>
                <div className='flex justify-between w-[185px] lg:w-[150px]'>
                    <p className='sm:text-sm md:text-lg lg:text-lg'>Venue</p>
                    <p>:</p>
                </div>
                <span className='ml-3 sm:text-sm md:text-lg lg:text-lg'>{eventDetails?.data?.venue}</span>
            </div>
        </div>
        {/* <div className='flex'>
            <div className='flex  sm:text-[4%] lg:text-lg'>
                <div className='flex justify-between w-[150px]'>
                    <p className='sm:text-sm md:text-lg lg:text-lg'>Location</p>
                    <p>:</p>
                </div>
                <span
                    className='ml-3 sm:text-sm md:text-lg lg:text-lg'>{eventDetails?.data?.district?.name}</span>
            </div>
        </div> */}
        <div className="flex justify-end">
            <span className="cursor-pointer">
                <Button className="bg-[#00CFE8] rounded-lg px-4 py-3 text-white"
                         onClick={() => handleClick(eventDetails.id)}>
                    Apply
                </Button>
            </span>
        </div>
    </div>
</div>
  )
}

export default EventDetailsPage