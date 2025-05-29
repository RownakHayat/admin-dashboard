"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from "@/components/common/pipe/roleChecker";
import { Avatar } from "@/components/ui/avatar";
import { useGetAttendanceListQuery } from "@/store/features/eventManagement/attendance";
import { useGetFinancialYearListQuery } from '@/store/features/financialYear';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { z } from "zod";
import Action from "./components/Action/Action";

const columnHelper = createColumnHelper<any>()

export const smeIdMobile = z.object({});

const AttendanceList = () => {
  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const searchParams = useSearchParams();
  const attendanceEventId = searchParams.get('attendance-event-id');


  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const { data: listQuery, refetch, isLoading } = useGetAttendanceListQuery(paramsValue, {
    refetchOnMountOrArgChange: true
  })
  const { data: financialYear } = useGetFinancialYearListQuery()
  const [openAction, setOpenAction] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)

  const [actionPosition, setActionPosition] = useState<{ top: number; left: number } | null>(null);

  const handleActionDialog = (data: any, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActionPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedData(data)
    setOpenAction(true)
  }

  useEffect(() => {
    refetch()
  }, [listQuery, openAction])




  const columns: any = useMemo(() => [
    columnHelper.accessor((tableField) => tableField.id, {
      id: "id",
      header: "SL",
      cell: (props: any) => {
        const sl = IndexSerial(
          params?.page,
          params.limit,
          props.row.index,
          listQuery?.pagination?.total
        )
        return sl
      },
    }),
    columnHelper.accessor((tableField) => tableField?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor((tableField) => tableField?.venue, {
      id: "venue",
      header: "Venue",
    }),
    columnHelper.accessor((tableField) => tableField?.dead_line, {
      id: "deadline",
      header: "Application Deadline",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="w-[100px]">
            {moment(viewData?.dead_line).format('DD MMM YYYY')}
          </div>
        )
      }
    }),

    columnHelper.accessor((tableField) => tableField?.date_range, {
      id: "date_range",
      header: "Date ",
      cell: ({ row }: any) => {
        const viewData = row?.original
        const startDate = moment(viewData?.start_date).format('DD MMM YYYY');
        const endDate = moment(viewData?.end_date).format('DD MMM YYYY');
        return (
          <div className="w-[120px]">
            {startDate} - {endDate}
          </div>
        )
      },
    }),

    columnHelper.accessor((tableField) => tableField?.total_applicants, {
      id: "total_applicants",
      header: "Total Applicants",
    }),
    columnHelper.accessor((tableField) => tableField?.selected_applicants, {
      id: "selected_applicants",
      header: "Selected Participants",
    }),
    columnHelper.accessor((tableField) => tableField?.attendance, {
      id: "attendance",
      header: "Attendance",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            {viewData?.attendance == 0 ? viewData?.attendance : <>
              <Link href={`/admin/event-management/attendance/${viewData?.id}/attendance-list`}>
                <p className='text-[#1C64F2] cursor-pointer'>{viewData?.attendance}</p>
              </Link>
            </>
            }
          </>
        )
      },
    }),
    columnHelper.accessor(() => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <CheckPermission subMod={'attendance'} permission={'attendance_add'}>
              <Avatar className="cursor-pointer w-3/4 rounded-lg bg-green-600 flex justify-center items-center text-center">
                <h1 className="font-medium text-[#ffffff] text-nowrap py-2 px-6 " onClick={(e) => handleActionDialog(viewData, e)}>Add +</h1>
              </Avatar>
            </CheckPermission>
          </>
        )
      },
    }),
  ], [params, listQuery]);


  return (
    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-12 md:col-span-6'>
          <h1 className='font-bold text-[25px]'>Attendance
            {financialYear?.data?.[0] && (
              <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2'>
                {financialYear.data[0]}
              </span>
            )}
          </h1>
        </div>
        <div className='col-span-12 md:col-span-6'>
          <Search />
        </div>
      </div>
      <CheckPermission subMod={'attendance'} permission={'attendance_list'}>

        <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
        <Action open={openAction} setOpen={setOpenAction} id={selectedData?.id} rowData={selectedData} refetch={refetch} actionPosition={actionPosition} />
      </CheckPermission>
    </>
  )
}

export default AttendanceList