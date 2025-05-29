"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { Icons } from '@/components/icons';
import { useGetBudgetSpentQuery } from '@/store/features/eventManagement/budgetSpent/intex';
import { useGetFinancialYearListQuery } from '@/store/features/financialYear';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import Link from 'next/link';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()

const BudgetSpentList = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const { data: financialYear } = useGetFinancialYearListQuery()
    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const { data: listQuery, refetch, isLoading } = useGetBudgetSpentQuery(paramsValue)

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
        columnHelper.accessor((tableField) => tableField?.program_info?.total_amount, {
            id: "total_amount",
            header: "Initial Program Budget",
        }),
        columnHelper.accessor((tableField) => tableField?.spent_amount, {
            id: "spent_amount",
            header: "Spent In Event",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <div className="flex justify-left items-center">
                        {viewData?.spent_amount == null ? "0" : viewData?.spent_amount}
                    </div>
                )
            },
        }),
        columnHelper.accessor((tableField) => tableField?.date_range, {
            id: "date_range",
            header: "Date",
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
        columnHelper.accessor((tableField) => tableField?.dead_line, {
            id: "dead_line",
            header: "Application Deadline",
            cell: ({ row }: any) => {
                const viewData = row?.original || {}
                return (
                    <div className='w-[100px]'>
                        {moment(viewData?.dead_line || "").format("DD MMM YYYY")}
                    </div>
                )
            }
        }),
        columnHelper.accessor((tableField) => tableField?.total_applicants, {
            id: "total_applicants",
            header: "Total Applicants",
        }),
        columnHelper.accessor((tableField) => {
            if (tableField?.event_status == 1) return "Pending";
            if (tableField?.event_status == 2) return "Form Generated";
            if (tableField?.event_status == 3) return "Published";
            if (tableField?.event_status == 4) return "Completed";
            if (tableField?.event_status == 5) return "Closed";
            if (tableField?.event_status == 6) return "Postponed";
            if (tableField?.event_status == 7) return "Cancelled";
            return "Pending";
        }, {
            id: "event_status",
            header: "Status",
            cell: (info) => (
                <span className={
                    info.getValue() === "Published" ? "text-green-500" :
                        info.getValue() === "Closed" ? "text-red-500" :
                            "text-gray-500"
                }>
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor((tableField) => tableField?.action, {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original

                return (
                    <div className="flex justify-left items-center">
                        <CheckPermission subMod={'budget_spent'} permission={'budget_spent_edit'}>
                            {viewData?.event_status == 5 ? (
                                <span></span>
                            ) : (
                                <span className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
                                    <Link href={`/admin/event-management/budget-spent/budget-spent-update/${viewData?.id}/edit`}
                                    >
                                        <Icons.edit onClick={() => editData(viewData)} />
                                    </Link>
                                </span>
                            )}
                        </CheckPermission>
                    </div>
                )
            },
        }),
    ], [params, listQuery]);


    return (
        <>
            <div className='grid grid-cols-12 gap-3 items-center'>
                <div className='col-span-12 sm:col-span-6 md:col-span-5 lg:col-span-6'>
                    <h1 className='font-bold text-[25px] flex flex-wrap'>Budget Spent List
                        {financialYear?.data?.[0] && (
                            <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2'>
                                {financialYear.data[0]}
                            </span>
                        )}
                    </h1>
                </div>
                <div className='col-span-12  sm:col-span-6 md:col-span-6 lg:col-span-6'>

                    <div className='col-span-12 xs:col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-8'>
                        <Search />
                    </div>
                </div>
            </div>
            <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
        </>
    )
}

export default BudgetSpentList