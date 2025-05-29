"use client";

import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEventCountQuery, useGetRunningEventQuery } from "@/store/features/eventManagement/newEvent";
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { IndexSerial } from "@/store/utils";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { useMemo, useState } from "react";
import AppliedEventList from "./AppliedEventList";

const columnHelper = createColumnHelper<any>();

const NewEventsApplyList = () => {
    const [activeTab, setActiveTab] = useState("selection");
    const handleTabChange = (tabValue: string) => {
        setActiveTab(tabValue);
    };
    const handleSubmit = () => {
    };

    const { data: financialYear } = useGetFinancialYearListQuery()

    const { params, editData, filterSearchText, searchField } = useFormSetting();

    const paramsValue = {
        ...params,
        searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
    };

    const {
        data: listQuery,
        refetch,
        isLoading,
    } = useGetRunningEventQuery(paramsValue);


    const { data: eventSurveyCountData } = useGetEventCountQuery();

    const eventCount = eventSurveyCountData?.data?.user_applied_event != undefined ? eventSurveyCountData?.data?.user_applied_event : 0;
    const apllyEventCount = eventSurveyCountData?.data?.user_running_event != undefined ? eventSurveyCountData?.data?.user_running_event : 0;


    const columns: any = useMemo(
        () => [
            columnHelper.accessor((tableField) => tableField.id, {
                id: "id",
                header: "SL",
                cell: (props: any) => {
                    const sl = IndexSerial(
                        params?.page,
                        params.limit,
                        props.row.index,
                        listQuery?.pagination?.total
                    );
                    return sl;
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
            columnHelper.accessor((tableField) => tableField.district?.name, {
                id: "name",
                header: "District",
            }),
            columnHelper.accessor((tableField) => tableField?.dead_line, {
                id: "dead_line",
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
            columnHelper.accessor((tableField) => tableField?.start_date, {
                id: "start_date",
                header: "Start Date",
                cell: ({ row }: any) => {
                    const viewData = row?.original || {};
                    return (
                        <div className="w-[100px]">
                            {moment(viewData?.start_date).format('DD MMM YYYY')}
                        </div>
                    )
                }
            }),
            columnHelper.accessor((tableField) => tableField?.end_date, {
                id: "end_date",
                header: "End Date",
                cell: ({ row }: any) => {
                    const viewData = row?.original || {};
                    return (
                        <div className="w-[100px]">
                            {moment(viewData?.end_date).format('DD MMM YYYY')}
                        </div>
                    )
                }
            }),
            columnHelper.accessor((tableField) => tableField?.event_entry_fee, {
                id: "event_entry_fee",
                header: "Fee",
            }),
            columnHelper.accessor(() => "", {
                id: "date",
                header: "Date",
                cell: ({ row }: any) => {
                    const viewData = row?.original;
                    return (
                        <div className="flex justify-left items-center">
                            <span className="w-[120px]">
                                {moment(viewData?.start_date || "").format('DD MMM YYYY')}&nbsp;-&nbsp; {moment(viewData?.end_date || "").format('DD MMM YYYY')}
                            </span>
                        </div>
                    );
                },
            }),
            columnHelper.accessor(() => "", {
                id: "action",
                header: "Action",
                cell: ({ row }: any) => {
                    const viewData = row?.original;
                    return (
                        <div className="flex justify-left items-center">
                            <span className="mr-3 text-black">
                                <Link href={`/admin/events/new-event/${viewData?.id}/events-details`}>
                                    <Icons.view />
                                </Link>
                            </span>
                            <span className="cursor-pointer">
                                <Link href={`/admin/events/new-event-apply/${viewData?.id}/apply-event`}>
                                    <p onClick={() => editData(viewData)} className="bg-[#00CFE8] rounded-lg px-3 py-2 text-white">
                                        Apply
                                    </p>
                                </Link>
                            </span>
                        </div>
                    );
                },
            }),
        ],
        [params, listQuery]
    );

    return (
        <>
            <Tabs defaultValue="selection" className="">
                <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <h1 className="font-bold text-[16px]">
                            <TabsList className="">
                                <TabsTrigger value="selection" onClick={() => handleTabChange("selection")}>
                                    Running Event ({apllyEventCount})
                                </TabsTrigger>
                                <TabsTrigger value="selected" onClick={() => handleTabChange("selected")}>
                                    Applied Event ({eventCount})
                                </TabsTrigger>
                            </TabsList>
                            <span className="text-[15px] bg-[#c2edf1] rounded-lg p-2">
                                {financialYear?.data[0]}
                            </span>
                        </h1>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 sm:mt-3">
                        <Search />
                    </div>
                    {/* {activeTab === "selection" && (
                    <Link href="/admin/event-management/new-event/create-event">
                        <Button className=' font-bold  text-primary border-primary border'>
                            Create Event +
                        </Button>
                    </Link>
                    )} */}
                </div>
                <TabsContent value="selection">
                    <ReactTable dataSource={listQuery || []} columns={columns} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="selected">
                    <AppliedEventList />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default NewEventsApplyList;
