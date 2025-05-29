"use client"

import { eventSchema } from "@/components/Pages/EventManagement/NewEvent/schemas/eventSchema";
import SingleSurveyDataView from "@/components/Pages/SurveyManagment/SurveyDataList/view/SingleSurveyDataView";
import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { Button } from '@/components/ui/button';
import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGetSurveyListQuery } from "@/store/features/surveyManagement/surveyDataList";
import { IndexSerial } from '@/store/utils';
import * as Dialog from "@radix-ui/react-dialog";
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from "lucide-react";
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { z } from "zod";

import { Icons } from '@/components/icons';
import { Cross2Icon } from '@radix-ui/react-icons';
import ParticipateView from './view/ParticipateView';
import CheckPermission from "@/components/common/pipe/roleChecker";
import moment from "moment";
import CheckPermission1 from "@/components/common/pipe/permission";

const columnHelper = createColumnHelper<any>()
interface SurveyDataValueProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: z.infer<typeof eventSchema>) => void;
    singleSurveyDataValues?: any;
}

const SurveyDataList = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const { data: listQuery, refetch, isLoading } = useGetSurveyListQuery(paramsValue, {
        refetchOnMountOrArgChange: true
    })
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [openSurveyDataViewDialog, setSurveyDataViewDialog] = useState(false);

    useEffect(() => {
        refetch()
    }, [listQuery])


    const setSurveyView = (values: any) => {
        setSurveyDataViewDialog(false);
    };
    const setSurveyDataView = (values: any) => {
        setSurveyDataViewDialog(false);
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
        columnHelper.accessor((tableField) => tableField?.survey_title, {
            id: "survey_title",
            header: "Title",
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
            id: "event_name",
            header: "Event Name",
        }),
        columnHelper.accessor(() => "", {
            id: "survey_type",
            header: "Survey Type",
            cell: ({ row }: any) => {
                const survey_type = row?.original?.survey_type
                return (
                    <>
                        <div className="flex justify-left items-center">
                            <span>
                                {survey_type === '1' && "Open Survey"}
                                {survey_type === '2' && "Gender Based Survey"}
                                {survey_type === '3' && "District Based Survey"}
                                {survey_type === '4' && "Cluster Based Survey"}
                                {survey_type === '5' && "Industry Based Survey"}
                                {survey_type === '6' && "Direct Beneficiaries Survey"}
                            </span>
                        </div>
                    </>
                )
            },
        }),
        columnHelper.accessor(() => "", {
            id: "start_date",
            header: "Start Date",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center">
                            <span>
                                {viewData.end_date ? moment(viewData.start_date || "").format("DD MMM YYYY") : ""}
                            </span>
                        </div>
                    </>
                )
            },
        }),
        columnHelper.accessor(() => "", {
            id: "end_date",
            header: "End Date",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center">
                            <span>
                                {viewData.end_date ? moment(viewData.end_date || "").format("DD MMM YYYY") : ""}
                            </span>
                        </div>
                    </>
                )
            },
        }),
        // columnHelper.accessor((tableField) => tableField?.activity?.name, {
        //     id: "name",
        //     header: "Activity Category",
        // }),
        columnHelper.accessor((tableField) => tableField?.survey_participant_count, {
            id: "survey_participant_count",
            header: "Participants",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center">
                            <span>
                                {
                                    viewData?.survey_participant_count == null || viewData?.survey_participant_count == 0 ? <>
                                        0

                                    </> : <>
                                        <DG>
                                            <DialogTrigger>
                                                <div className=" text-center cursor-pointer">
                                                    <div className="text-blue-600 font-bold">
                                                        
                                                        <Button className='font-bold border bg-[#0CB04D] rounded-lg p-5'>
                                                        {viewData?.survey_participant_count}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[65%] w-[100%] ">
                                                <div className=''>
                                                    {/* <Dialog.Close asChild>
                                                        <button
                                                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                                                            aria-label="Close"
                                                        >
                                                            <Cross2Icon />
                                                        </button>
                                                    </Dialog.Close> */}
                                                    <ParticipateView id={viewData.id} />
                                                </div>
                                            </DialogContent>
                                        </DG>
                                    </>
                                }
                            </span>
                        </div>
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
                        <div className="flex justify-left items-center gap-5">
                            <CheckPermission subMod={'survey_ques'} permission={'survey_ques_edit'}>

                                <span className="cursor-pointer">
                                    <Link href={`/admin/survey-management/survey-list/${viewData?.id}/edit`}
                                    >
                                        <Icons.edit
                                            onClick={() =>
                                                editData(viewData)
                                            }
                                        />
                                    </Link>
                                </span>
                            </CheckPermission>
                            <CheckPermission subMod={'survey_ques'} permission={'survey_ques_view'}>

                                <span className="cursor-pointer">
                                    <Eye
                                        className="text-[#0E9F6E]"
                                        onClick={() => {
                                            setSelectedRow(row?.original);
                                            setSurveyDataViewDialog(true);
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
            {/*<div className='grid grid-cols-12 gap-3 items-center'>*/}
            {/*    <div className='col-span-12 md:col-span-4'>*/}
            {/*        <h1 className='font-bold text-[25px]'>Survey List</h1>*/}
            {/*    </div>*/}
            {/*    <div className='col-span-12 md:col-span-8'>*/}
            {/*        <div className='grid grid-cols-12 gap-3 items-center'>*/}
            {/*            <div className='col-span-12 md:col-span-10'>*/}
            {/*                <div><Search /></div>*/}
            {/*            </div>*/}
            {/*            <div className='col-span-12 md:col-span-2'>*/}
            {/*                <CheckPermission subMod={'survey_ques'} permission={'survey_ques_add'}>*/}

            {/*                    <div className='ml-3 text-end'>*/}
            {/*                        <Link href="/admin/survey-management/survey-list/create-survey">*/}
            {/*                            <Button className='font-bold border bg-[#0CB04D] rounded-lg p-5'>*/}
            {/*                                Create Survey +*/}
            {/*                            </Button>*/}
            {/*                        </Link>*/}
            {/*                    </div>*/}
            {/*                </CheckPermission>*/}
            {/*            </div>*/}
            {/*        </div>*/}


            {/*    </div>*/}
            {/*</div>*/}

            <div className="flex flex-wrap justify-between items-center">
                <div className="col-span-12 xs:col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6">
                    <h1 className="font-bold text-[25px]">
                        Survey List
                    </h1>
                </div>
                <div className="">
                    <CheckPermission1 subMod="survey_ques" permission="survey_ques_add">
                        {({ hasPermission }: any) => (
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="">
                                    <Search />
                                </div>
                                {hasPermission && (
                                    <div className="">
                                        <Link href="/admin/survey-management/survey-list/create-survey">                                            <Button className="font-bold border bg-[#0CB04D] rounded-lg p-5">
                                            Create Survey +
                                        </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </CheckPermission1>
                </div>

            </div>

            <CheckPermission subMod={'survey_ques'} permission={'survey_ques_view'}>

                <SingleSurveyDataView
                    open={openSurveyDataViewDialog}
                    onClose={() => setSurveyDataViewDialog(false)}
                    onSave={setSurveyDataView}
                    singleSurveyDataValues={selectedRow}
                    id={selectedRow?.id}
                />
            </CheckPermission>
            <CheckPermission subMod={'survey_ques'} permission={'survey_ques_list'}>

                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </CheckPermission>
        </>
    )
}

export default SurveyDataList