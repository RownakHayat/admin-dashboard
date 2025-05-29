"use client"

import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import ReactTable from '@/components/common/ReactTable/ReactTable';
import { Icons } from '@/components/icons';
import UpdateFeedBack from "@/components/Pages/Feedback/UpdateFeedBack/UpdateFeedback";
import { Button } from '@/components/ui/button';
import { useGetAppliedEventQuery } from '@/store/features/eventManagement/newEvent';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import EventFairSaleView from '../FairSales/view/fairSaleView';
const columnHelper = createColumnHelper<any>()

const toTitleCase = (str: any) => {
    return str
        .split('_')
        .map((word: any) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

const AppliedEventList = () => {

    const [openFeedBack, setOpenFeedBack] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [selectedData, setSelectedData] = useState<any>(null)
    const handleFeedBackDialog = (data: any) => {
        setSelectedData(data)
        setOpenFeedBack(true)
    }

    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const { data: listQuery, refetch, isLoading } = useGetAppliedEventQuery(paramsValue)

    const router = useRouter();

    //for refetch
    useEffect(() => {
        refetch()
    }, [listQuery, openFeedBack, selectedData])

    // const handleButtonClick = (rowData: any) => {
    //     setSelectedRow(rowData);  // Store the entire row data
    //     setIsModalOpen(true);
    // };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedRow(null);  // Clear the selected row data
    // };

    const handleClick = (viewData: any) => {
        router.push(`/admin/payment/payment-form?id=${viewData?.id}`);
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
        columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
            id: "event_name",
            header: "Event Name",
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.venue, {
            id: "venue",
            header: "Venue",
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.event_entry_fee, {
            id: "event_entry_fee",
            header: "Fee",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        {viewData?.event_detail?.event_entry_fee == 0 ? "N/A" : viewData?.event_detail?.event_entry_fee}
                    </>
                )
            },
        }), columnHelper.accessor((tableField) => "", {
            id: "event_status",
            header: "Event Status",
            cell: ({ row }: any) => {
                const viewData = row?.original;
                const status = viewData?.event_detail?.event_status;

                const getStatusStyle = (status: string | null) => {
                    switch (status) {
                        case "3": return { color: "green" }; // Running
                        case "4": return { color: "blue" }; // Completed
                        case "5": return { color: "grey" }; // Closed
                        case "6": return { color: "orange" }; // Postponed
                        case "7": return { color: "red" }; // Cancelled
                        default: return { color: "black" }; // Unknown or default
                    }
                };

                return (
                    <>
                        <span style={getStatusStyle(status)}>
                            {
                                status === "3" ? "Running" :
                                    status === "4" ? "Completed" :
                                        status === "5" ? "Closed" :
                                            status === "6" ? "Postponed" :
                                                status === "7" ? "Cancelled" :
                                                    status == null ? "" : "Unknown Status"
                            }
                        </span>
                    </>
                );
            },
        }),

        columnHelper.accessor((tableField) => "", {
            id: "payment_status",
            header: "Payment Status",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        {viewData?.payment_status === 0 && "Not Paid"}
                        {viewData?.payment_status === 1 && "Paid"}
                        {viewData?.payment_status === 2 && "Processing"}
                        {viewData?.payment_status === 3 && "Rejected"}
                    </>
                )
            },
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.start_date, {
            id: "start_date",
            header: "Start Date",
            cell: ({ row }: any) => {
                const viewData = row?.original || {};
                return (
                    <div className="w-[100px]">
                        {moment(viewData?.event_detail?.start_date).format('DD MMM YYYY')}
                    </div>
                )
            }
        }),
        columnHelper.accessor((tableField) => tableField?.event_detail?.end_date, {
            id: "end_date",
            header: "End Date",
            cell: ({ row }: any) => {
                const viewData = row?.original || {};
                return (
                    <div className="w-[100px]">
                        {moment(viewData?.event_detail?.end_date).format('DD MMM YYYY')}
                    </div>
                )
            }
        }),
        // columnHelper.accessor(() => "", {
        //     id: "action",
        //     header: "Application Status",
        //     cell: ({ row }: any) => {
        //         const viewData = row?.original || {};
        //         const isPaymentPending = viewData?.application_status === "payment_pending" && viewData?.event_detail?.event_status === "3";
        //         const formattedStatus = toTitleCase(viewData?.application_status || "");
        //         const isFeedbackAvailable = viewData?.application_status === "selected" && viewData?.event_detail?.event_status === "4" && viewData?.event_detail?.feedback_status === 1; // Check if feedback_status is 1
        //         const isFairSaleAvailable = viewData?.application_status === "selected" && viewData?.event_detail?.event_status === "4" && viewData?.event_detail?.fair_sale_status === 1 && viewData?.event_detail?.activity_id < 4;

        //         const handleFeedbackClick = () => {
        //             // Handle feedback button click here
        //             console.log("Feedback button clicked for:", viewData?.id);
        //         };

        //         return (
        //             <div className="flex justify-left items-center gap-3">
        //                 <span className="cursor-pointer">
        //                     {isPaymentPending ? (
        //                         <Button
        //                             className={`font-bold bg-green-600 capitalize text-white mt-2 cursor-pointer`}
        //                             onClick={() => handleButtonClick(viewData)}
        //                         >
        //                             {'Pay Now'}
        //                         </Button>
        //                     ) : (
        //                         <span className="capitalize text-lg font-medium">{formattedStatus}</span>
        //                         // <span className="capitalize text-lg font-medium"></span>
        //                     )}
        //                 </span>
        //             </div>
        //         );
        //     },
        // }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original || {};
                // const isPaymentPending = viewData?.application_status === "payment_pending" && viewData?.event_detail?.event_status === "3";e
                // const isPaymentPending = viewData?.application_status === "selected" && viewData?.payment_status != 1;
                const isPaymentPending = (viewData?.application_status === "payment_pending" || viewData?.application_status === "rejected") && viewData?.event_detail?.event_status === "3";
 
                const formattedStatus = toTitleCase(viewData?.application_status || "");
                const isFeedbackAvailable = viewData?.application_status === "selected" && viewData?.event_detail?.event_status === "4" && viewData?.event_detail?.feedback_status === 1; // Check if feedback_status is 1
                const isFairSaleAvailable = viewData?.application_status === "selected" && viewData?.event_detail?.event_status === "4" && viewData?.event_detail?.fair_sale_status === 1 && viewData?.event_detail?.activity_id < 4;

                const handleFeedbackClick = () => {
                    // Handle feedback button click here
                };

                return (
                    <div className="flex justify-left items-center gap-3">
                        <span className="mr-3 text-black">
                            <Link href={`/admin/events/new-event/${viewData?.event_detail_id}/events-details`}>
                                <Icons.view />
                            </Link>
                        </span>

                        <span className="">
                            {isPaymentPending ? (
                                <Button
                                    className={`font-bold bg-green-600 capitalize text-white mt-2`}
                                    onClick={() => handleClick(viewData)}
                                >
                                    {'Pay Now'}
                                </Button>
                            ) : (
                                <span className="capitalize text-lg font-medium"></span>
                            )}
                        </span>

                        {/* Add Feedback Button when feedback_status is 1 */}
                        <span>

                            {isFeedbackAvailable && (
                                <Button
                                    className=" font-bold bg-green-600 capitalize text-white  cursor-pointer"
                                    onClick={() => handleFeedBackDialog(viewData)}
                                >
                                    Feedback
                                </Button>
                            )}
                        </span>
                        <span>
                            {
                                isFairSaleAvailable && <EventFairSaleView id={viewData?.event_detail_id} viewData={viewData} refetch={refetch} />
                            }
                        </span>
                    </div>
                );
            },
        }),

    ], [params, listQuery]);
    return (
        <div>
            <ReactTable dataSource={listQuery} columns={columns} />
            {/* <PaymentApplication
                isOpen={isModalOpen}
                onClose={closeModal}
                status={selectedRow?.application_status}
                data={selectedRow}
            /> */}

            <UpdateFeedBack open={openFeedBack} setOpen={setOpenFeedBack} id={selectedData?.id} rowData={selectedData} />
        </div>
    )
}

export default AppliedEventList
