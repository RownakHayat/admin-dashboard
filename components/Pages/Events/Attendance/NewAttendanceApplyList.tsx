"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { Icons } from '@/components/icons';
import { useGetNewEventQuery } from '@/store/features/eventManagement/newEvent';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import QrAttendance from '../../EventManagement/Attendance/components/QrAttendance/QrAttendance';

const columnHelper = createColumnHelper<any>()


const NewAttendanceApplyList = () => {

    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const [openAction, setOpenAction] = useState(false)
    const [selectedData, setSelectedData] = useState<any>(null)

    const handleActionDialog = (data: any) => {
        setSelectedData(data)
        setOpenAction(true)
    }

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetNewEventQuery(paramsValue)

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
        columnHelper.accessor((tableField) => tableField?.start_date, {
            id: "start_date",
            header: "Start Date",
        }),
        columnHelper.accessor((tableField) => tableField?.end_date, {
            id: "end_date",
            header: "End Date",
        }),
        columnHelper.accessor((tableField) => tableField?.dead_line, {
            id: "dead_line",
            header: "Application Deadline",
            cell: ({ row }: any) => {
                const viewData = row?.original || {}
                return (
                    <>{`${moment(viewData?.dead_line || "").format('DD MMM YYYY')}`}</>
                )
            }
        }),
        columnHelper.accessor((tableField) => tableField?.total_applicants, {
            id: "total_applicants",
            header: "Total Applicants",
        }),
        // columnHelper.accessor(() => "", {
        //     id: "action",
        //     header: "Action",
        //     cell: ({ row }: any) => {
        //         const viewData = row?.original
        //         return (
        //             <div className="flex justify-left items-center">
        //                 <span className="cursor-pointer">
        //                     <Link href={`/admin/event-management/new-event/create-event/${viewData?.id}/selection`}
        //                     >
        //                         <p onClick={() =>
        //                             editData(viewData)
        //                         }
        //                             className='bg-[#0CB04D] rounded-lg p-2 text-white font-bold'
        //                         >Apply</p>
        //                     </Link>
        //                 </span>
        //             </div>
        //         )
        //     },
        // }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <div className="flex justify-center items-center  cursor-pointer">
                        <Icons.qrCode
                            onClick={() => handleActionDialog(viewData)}
                        />
                    </div>
                )
            },
        }),
    ], [params, listQuery]);


    return (
        <>
            <div className='grid grid-cols-12 gap-3 items-center'>
                <div className='col-span-12 md:col-span-6'>
                    <h1 className='font-bold text-[25px]'>Attendance</h1>
                </div>
                <div className='col-span-12 md:col-span-6'>
                    <Search />
                </div>
            </div>
            <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            <QrAttendance open={openAction} setOpen={setOpenAction} id={selectedData?.id} rowData={selectedData} />
        </>
    )
}

export default NewAttendanceApplyList