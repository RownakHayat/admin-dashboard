"use client"

import { useGetEventDetailsSingleViewQuery } from '@/store/features/eventManagement/newEvent';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { SingleEventDetails } from './slider/singleEventDetails';
import { Button } from '@/components/ui/button';
import SignInForm from '../../Auth/SignIn/signInForm';
import SignUpForm from '../../Auth/SignUp/signupForm';


type EventsDetails = {
    event_attachments?: any;
}

const EventsDetails: React.FC<EventsDetails> = () => {
    const params = useParams();
    const id = params.id;
    const { data: eventDetails } = useGetEventDetailsSingleViewQuery(id)

    const [showSignIn, setShowSignIn] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <>
            <div className='custom_container  grid grid-cols-12 gap-3 py-3'>
                <div className={`${showSignIn ? 'col-span-12 lg:col-span-12 2xl:col-span-4' : 'col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6 text-center'}`}>
                    <div className=''>
                        <SingleEventDetails />
                    </div>
                </div>
                <div
                    className={`${showSignIn ? 'col-span-12 lg:col-span-6 2xl:col-span-4' : 'col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6 leading-7 lg:pr-3 '} font-bangla bg-white rounded-lg py-8 px-12 border border-spacing-1`}>
                    <div className='flex  sm:text-[3%] lg:text-lg'>
                        <div className='flex justify-between w-[150px] font-bold'>
                            <p className='sm:text-sm md:text-lg lg:text-lg text-wrap xl:text-nowrap'>Event Name</p>
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
                        <div className='flex sm:text-[4%] lg:text-lg text-wrap lg:text-nowrap'>
                            <div className='flex justify-between w-[150px]'>
                                <p className='sm:text-sm md:text-lg lg:text-lg text-nowrap'>Date</p>
                                <p>:</p>
                            </div>
                            <span className='ml-3 sm:text-xs md:text-lg lg:text-lg text-wrap xl:text-nowrap'>
                                {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')} <br /> - {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}

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
                            <div className='flex justify-between w-[195px] xl:w-[150px]'>
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
                                    onClick={() => setShowSignIn(true)}>
                                Apply
                            </Button>
                        </span>
                    </div>
                </div>
                {
                    showSignIn &&
                    <div className={`${showSignIn ? 'col-span-12  lg:col-span-6 2xl:col-span-4  h-full' : ''
                    } `}>
                        <div className="border border-[#aaa9a9] bg-white  h-full rounded-lg p-6">
                            {!isRegistering && <SignInForm setIsRegistering={setIsRegistering} eventId={id}/>}
                            {isRegistering && <SignUpForm setIsRegistering={setIsRegistering} eventId={id}/>}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default EventsDetails