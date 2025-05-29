"use client"

import SinglePaymentView from "@/components/Pages/Payment/view/SinglePaymentView";
import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { useGetNewPaymentPaginationQuery } from "@/store/features/payment";
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import moment from "moment";
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const columnHelper = createColumnHelper<any>()

const PaymentList = () => {
    const {
        params,
        filterSearchText,
    } = useFormSetting()
    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const paramss = useParams();
    const id = paramss.id as string;

    const { data: listQuery } = useGetNewPaymentPaginationQuery()

    const [userId, setUserId] = useState<any>([])
    const [isCheckedAll, setIsCheckedAll] = useState(false)

    const [activeTab, setActiveTab] = useState('selection');
    const handleTabChange = (tabValue: any) => {
        setActiveTab(tabValue); // Function to update activeTab state
    };

    const [success, setSuccess] = useState(false);

    const handleAllChecked = () => {
        setUserId([])
        setIsCheckedAll(!isCheckedAll)

        if (isCheckedAll) {
            const checkedAll = listQuery?.data?.map((item: any) => {
                return {
                    employee_id: item?.id,
                    status: 0
                }
            })
            setUserId(checkedAll)
        } else {
            const checkedAll = listQuery?.data?.map((item: any) => {
                return {
                    employee_id: item?.id,
                    status: 1
                }
            })
            setUserId(checkedAll)
        }

    }

    const changeCheckValue = (id: number) => {

        const updatedValue = userId?.map((item: any) => {
            if (item.employee_id === id) {
                return {
                    ...item,
                    status: item?.status === 1 ? 0 : 1
                }
            } else {
                return item
            }
        })
        setUserId(updatedValue)

        const checkvalue = userId?.filter((e: any) => e.status === 1)
        setIsCheckedAll(checkvalue?.length === listQuery?.data?.length ? true : false)
    }


    const [openPaymentViewDialog, setPaymentViewDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const { data: financialYear } = useGetFinancialYearListQuery()

    const setPaymentView = (values: any) => {
        setPaymentViewDialog(false);
    };


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

        // columnHelper.accessor((tableField) => tableField?.program_info?.program?.name, {
        //     id: "name",
        //     header: "Program Name",
        // }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
            id: "event_name",
            header: "Event Name",
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.activity?.name, {
            id: "name",
            header: "Activity Type",
        }),
        columnHelper.accessor((tableField) => tableField?.payment?.payment_date, {
            id: "payment_date",
            header: "Venue",
        }),
        columnHelper.accessor((tableField) => moment(tableField?.event_detail?.activity?.name || "").format("DD MMM YYYY"), {
            id: "name",
            header: "Start Date",
        }),
        columnHelper.accessor((tableField) => moment(tableField?.event_detail?.activity?.name || "").format("DD MMM YYYY"), {
            id: "name",
            header: "End Date",
        }),
        columnHelper.accessor((tableField) => moment(tableField?.event_detail?.activity?.name || "").format("DD MMM YYYY"), {
            id: "name",
            header: "Application Deadline",
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.activity?.name, {
            id: "name",
            header: "Total Applicants",
        }),

        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center">


                            <span className="cursor-pointer">

                                <Eye className="text-[#0E9F6E]" onClick={() => {
                                    setSelectedRow(row?.original);
                                    setPaymentViewDialog(true);
                                }} />
                            </span>


                        </div>
                    </>
                )
            },
        }),
    ], [params, listQuery]);


    return (

        <>
            <div className='grid grid-cols-12 gap-3 items-center '>
                <div className='col-span-12 md:col-span-6 '>
                    <h1 className='font-bold text-[25px]'>Attendance
                        <span
                            className='text-[15px] bg-[#c2edf1] rounded-lg p-2'>{financialYear?.data[0]}</span>
                    </h1>
                </div>
                <div className='col-span-12 md:col-span-6 '>
                    <Search />
                </div>
                {/*<div className='col-span-2  sm:col-span-12 md:col-span-2 lg:col-span-2  py-5'>*/}
                {/*    <Link href="/admin/event-management/new-program/create-program">*/}
                {/*        <Button className=' font-bold  text-primary border-primary border'>*/}
                {/*            Create Program +*/}
                {/*        </Button>*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
            <ReactTable dataSource={listQuery} columns={columns} />

            <SinglePaymentView
                open={openPaymentViewDialog}
                onClose={() => setPaymentViewDialog(false)}
                singlePaymentValues={selectedRow}
            />

        </>
    )
}

export default PaymentList