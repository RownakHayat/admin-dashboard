"use client"

import React, { useRef, useState } from 'react'
import { useGetEventWiseAttenenceReportListQuery } from '@/store/features/eventManagement/attendance';
import { useParams } from 'next/navigation';
import UserTable from '../UserTable/UserTable';
import moment from 'moment';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';

const UserList = () => {

  const params = useParams();
  const id = params.id;

  const { data: userListData, error } = useGetEventWiseAttenenceReportListQuery(id, {
    skip: id == null || id == undefined,
  });


  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendeance List",
    onAfterPrint: () => console.log("Print Success"),
  })

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
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Attendence List</p>
            <Image
              src="/assets/Image/print.svg"
              alt="Reload"
              width={20}
              height={20}
              className='cursor-pointer'
              onClick={() => handleClickToPrint()}
            />

          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-5" ref={componentRef}>
        <div className="col-span-12">
          <div className='text-center pb-4'>
            <h4 className='text-xl'> SME EVENT ATTENDANCE LIST </h4>
            <h4 className='text-lg'>SME Foundation </h4>
          </div>

          <div className="min-w-full p-4 mb-3">
            <table className="table-auto border-collapse w-full">
              <tbody>
                <tr className="border">
                  <td className="border border-gray-400 px-4 py-2 font-semibold">Event</td>
                  <td colSpan={3} className="border border-gray-400 px-4 py-2 uppercase">{userListData?.data?.event_name}</td>
                </tr>
                <tr className="border">
                  <td className="border border-gray-400 px-4 py-2 font-semibold">Date</td>
                  <td className="border border-gray-400 px-4 py-2">
                    {moment(userListData?.data?.starDate).format('D-MM-YYYY')} &mdash; {moment(userListData?.data?.endDate).format('D-MM-YYYY')}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 font-semibold">Venue</td>
                  <td className="border border-gray-400 px-4 py-2">{userListData?.data?.venue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-12">
          <div className="w-[100%] overflow-x-auto">
            <div className='text-center pb-4'>
              <h4 className='text-xl'>System User List</h4>
            </div>
            <UserTable userData={userListData?.data?.system_user} />
            <div className='text-center pb-4 mt-5'>
              <h4 className='text-xl'>Guest User List</h4>
            </div>
            <UserTable userData={userListData?.data?.guest_user} organizationShow={true}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserList
