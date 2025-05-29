"use client"

import SingleProgramView from "@/components/Pages/EventManagement/NewProgram/view/SingleProgramView";
import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission1 from "@/components/common/pipe/permission";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useGetNewProgramQuery } from '@/store/features/eventManagement/newProgram';
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from "lucide-react";
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';


const columnHelper = createColumnHelper<any>()
const NewProgramList = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const { data: financialYear } = useGetFinancialYearListQuery()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const { data: listQuery, refetch, isLoading } = useGetNewProgramQuery(paramsValue)


    const [openParticipateViewDialog, setParticipateViewDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const setParticipateView = (values: any) => {
        setParticipateViewDialog(false);
    };
    useEffect(() => {
        if (financialYear) {
            refetch();
        }
    }, [financialYear, refetch]);

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
        columnHelper.accessor((tableField) => tableField?.name_en, {
            id: "program_name",
            header: "Program Name",
        }),
        columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
            id: "financial_year",
            header: "Financial Year",
        }),
        columnHelper.accessor((tableField) => tableField?.target_of_event, {
            id: "target_of_event",
            header: "Target of Event",
        }),
        columnHelper.accessor((tableField) => tableField?.total_amount, {
            id: "total_amount",
            header: "Total Amount",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center gap-5">
                            <CheckPermission subMod={'new_program'} permission={'new_program_edit'}>
                                <span className="cursor-pointer">
                                    <Link href={`/admin/event-management/new-program/create-program/${viewData?.id}/edit`}
                                    >
                                        <Icons.edit
                                            onClick={() =>
                                                editData(viewData)
                                            }
                                        />
                                    </Link>
                                </span>
                            </CheckPermission>
                            <CheckPermission subMod={'new_program'} permission={'new_program_view'}>
                                <span className="cursor-pointer">
                                    <Eye
                                        className="text-[#0E9F6E]"
                                        onClick={() => {
                                            setSelectedRow(row?.original);
                                            setParticipateViewDialog(true);
                                        }}
                                    />
                                </span>
                            </CheckPermission>
                        </div>
                    </>
                )
            },
        }),
    ], [params, listQuery]);

    return (
        <>
            <div className="flex flex-wrap justify-between items-center">
                <div className="col-span-6 xs:col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6">
                    <h1 className="font-bold text-[25px]">
                        Program List
                        {financialYear?.data?.[0] && (
                            <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2'>
                                {financialYear.data[0]}
                            </span>
                        )}
                    </h1>
                </div>
                    <div className="">
                        <CheckPermission1 subMod="new_program" permission="new_program_add">
                            {({ hasPermission }: any) => (
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="">
                                        <Search />
                                    </div>
                                    {hasPermission && (
                                        <div className="">
                                            <Link href="/admin/event-management/new-program/create-program">
                                                <Button className="font-bold border bg-[#0CB04D] rounded-lg p-5">
                                                    Create Program +
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CheckPermission1>
                    </div>

            </div>
            {/* <div className='grid grid-cols-12 gap-2 items-center px-6'>
                <div className="col-span-12 md:col-span-6">
                    <h1 className='flex flex-wrap font-bold text-[25px]'>Program List
                        {financialYear?.data?.[0] && (
                            <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2'>
                                {financialYear.data[0]}
                            </span>
                        )}
                    </h1>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <div className="grid grid-cols-12 gap-2 items-center ">
                        <div className="col-span-10 sm:col-pan-12">
                            <Search name="type_name" />
                        </div>
                        <div className="col-span-2 sm:col-pan-12">
                        <CheckPermission subMod={'new_program'} permission={'new_program_add'}>
                            <Link href="/admin/event-management/new-program/create-program">
                                <Button className="bg-green-600 font-bold  text-white border-primary border">
                                    Create Program +
                                </Button>
                            </Link>
                        </CheckPermission>
                        </div>
                    </div>
                </div>

                <SingleProgramView
                    open={openParticipateViewDialog}
                    onClose={() => setParticipateViewDialog(false)}
                    singleParticipateValues={selectedRow}
                />

            </div> */}
            <CheckPermission subMod={'new_program'} permission={'new_program_view'}>
                <SingleProgramView
                    open={openParticipateViewDialog}
                    onClose={() => setParticipateViewDialog(false)}
                    singleParticipateValues={selectedRow}
                />
            </CheckPermission>
            <CheckPermission subMod={'new_program'} permission={'new_program_list'}>
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </CheckPermission>
        </>
    )
}

export default NewProgramList