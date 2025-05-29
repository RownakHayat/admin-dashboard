"use client";

import { PaymentSchema } from "@/components/Pages/Payment/schemas/paymentSchema";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSingleEventDetailsQuery } from "@/store/features/eventManagement/newEvent";
import {
  useGetPerticipantQuery,
  useGetWaitingParticipantListQuery,
  useReSelectParticipantMutation,
  useSelectedParticipantQuery,
  useSelectParticipantMutation,
  useUnSelectedParticipantQuery,
  useUnSelectParticipantMutation,
  useWatingParticipantMutation,
} from "@/store/features/eventManagement/newEvent/selection";
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { ChevronRight, Eye, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import SingleParticipantView from "../view/SingleParticipantView";
import ParticipateModal from "./ParticipantModal";
import moment from "moment";

const columnHelper = createColumnHelper<any>();

const SelectionList = () => {
  const { params, filterSearchText, searchField } = useFormSetting();
  const paramsValue = { ...params, searchData: `${filterSearchText || ""}` };
  const paramss = useParams();
  const id = paramss.id;
  const event_detail_id = paramss.id;
  const { data: listQuery, refetch, isLoading } = useGetPerticipantQuery(id);
  const { data: selectedListQuery } = useSelectedParticipantQuery(id);
  const { data: unSelectedListQuery } = useUnSelectedParticipantQuery(id);
  const { data: watingListQuery } = useGetWaitingParticipantListQuery(id);
  const [selectParticipant] = useSelectParticipantMutation();
  const [reSelectParticipant] = useReSelectParticipantMutation();
  const [unSelectParticipant] = useUnSelectParticipantMutation();
  const [watingParticipant] = useWatingParticipantMutation();

  const router = useRouter();
  const { ToastSuccess, ToastError } = useToast();
  const { data: financialYear } = useGetFinancialYearListQuery();
  const [openParticipateViewDialog, setParticipateViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("selection");
  const [userId, setUserId] = useState<any[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      event_name: "",
    },
  });

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setUserId([]);
    setIsCheckedAll(false);
  };

  const [openParticipateModal, setOpenParticipateModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const { data: eventDetails } = useGetSingleEventDetailsQuery(
    { id: id },
    { skip: !id }
  );


  const handlePerticipateModal = (
    data: any,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setSelectedData(data);
    setOpenParticipateModal(true);
  };

  const changeCheckValue = (id: number, isChecked: boolean) => {
    let updatedValue;
    if (isChecked) {
      updatedValue = [...userId, { employee_id: id, status: 1 }];
    } else {
      updatedValue = userId.filter((item: any) => item.employee_id !== id);
    }

    setUserId(updatedValue);

    const checkvalue = updatedValue.filter((e: any) => e.status === 1);
    setIsCheckedAll(checkvalue.length === (listQuery?.data?.length || 0));
  };

  const handleAllChecked = (isChecked: boolean) => {
    if (isChecked) {
      // Select all users
      const checkedAll = listQuery?.data?.map((item: any) => ({
        employee_id: item.user.id,
        status: 1,
      }));
      setUserId(checkedAll || []);
    } else {
      // Deselect all users
      setUserId([]);
    }
    setIsCheckedAll(isChecked);
  };

  const handleSubmit = async (actionType: "select" | "waiting" | "unselect" | "reselect") => {
    if (userId.length > 0) {
      const selectedUserIds = userId.map((user) => user.employee_id);
      const user_ids = selectedUserIds;

      try {
        let mutationFn:
          | ((args: {
            event_detail_id: number;
            user_ids: string[];
          }) => Promise<any>)
          | undefined;
        let successMessage = "";

        switch (activeTab) {
          case "selection":
            if (actionType === "select") {
              mutationFn = selectParticipant;
              successMessage = "Participant Selected Successfully";
            } else if (actionType === "waiting") {
              mutationFn = watingParticipant;
              successMessage = "Participant Moved to Waiting List Successfully";
            }
            break;
          case "selected":
            mutationFn = unSelectParticipant;
            successMessage = "Participant Unselected Successfully";
            break;
          case "unselect":
            if (actionType === "reselect") {
              mutationFn = reSelectParticipant;
              successMessage = "Participant Reselected Successfully";
            } else if (actionType === "waiting") {
              mutationFn = watingParticipant;
              successMessage = "Participant Moved to Waiting List Successfully";
            }
            break;
          case "waiting":
            if (actionType === "select") {
              mutationFn = selectParticipant;
              successMessage = "Participant Selected Successfully";
            }
            break;
          default:
            throw new Error("Invalid tab selection");
        }

        // Ensure mutationFn is defined before invoking
        if (mutationFn) {
          const res = await mutationFn({
            event_detail_id: Number(id),
            user_ids: user_ids,
          });

          if (res?.data?.code === 200) {
            form.reset();
            closeFormToggle();
            Swal.fire({
              title: "Success!",
              text: successMessage,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#0b9e45",
            }).then(() => {
              router.push(
                `/admin/event-management/new-event/create-event/${id}/selection`
              );
            });
          } else {
            throw new Error("Unexpected response code");
          }
        } else {
          // Handle the case where mutationFn is not defined
          throw new Error("Mutation function is not defined");
        }
      } catch (err: any) {
        // Handle API error, display errors if applicable
        if (err?.data?.errors) {
          err.data.errors.forEach(
            ({ field, message }: { field: string; message: string }) =>
              form.setError(field as keyof z.infer<typeof PaymentSchema>, {
                type: "custom",
                message,
              })
          );
        }
        ToastError("Failed to Update.");
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "No users selected",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      }).then(() => {
        router.push(
          `/admin/event-management/new-event/create-event/${id}/selection`
        );
      });
    }
  };




  const setParticipateView = (values: any) => {
    setParticipateViewDialog(false);
  };

  const formatApplicationStatus = (status: string) => {
    // Remove underscores and capitalize each word
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const columns: any = useMemo(() => {
    const commonColumns = [
      columnHelper.accessor(
        (tableField) => tableField?.user?.user_profile?.sme_id,
        {
          id: "sme_id",
          header: "User Id",
        }),
      columnHelper.accessor((tableField) => tableField?.user?.mobile, {
        id: "mobile",
        header: "Phone Number",
      }),
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.event_name,
        {
          id: "event_name",
          header: "Event Name",
        }),
      columnHelper.accessor(
        (tableField) => tableField?.user?.user_profile?.occupation_type?.name,
        {
          id: "occupation_type",
          header: "Occupation",
        }),
      // columnHelper.accessor((tableField) => tableField?.application_status, {
      //   id: "application_status",
      //   header: "Application Status",
      //   cell: ({ row }: any) => {
      //     const viewData = row?.original || {}
      //     const formattedStatus = formatApplicationStatus(viewData?.application_status || "");
      //     return (
      //       <>{formattedStatus}</>
      //     )
      //   }
      // }),
      // columnHelper.accessor((tableField) => tableField?.remarks, {
      //   id: "remarks",
      //   header: "Interest",
      // }),
      // columnHelper.accessor(() => "", {
      //   id: "action",
      //   header: "Action",
      //   cell: ({ row }: any) => {
      //     return (
      //       <div className="flex justify-left items-center">
      //         <span className="cursor-pointer">
      //           <Eye
      //             className="text-[#0E9F6E]"
      //             onClick={() => {
      //               setSelectedRow(row?.original);
      //               setParticipateViewDialog(true);
      //             }}
      //           />

      //           <Link href={`/admin/user-management/users/user-view/${row?.original?.user?.id}`}>
      //             <Eye
      //               className="text-[#0E9F6E]"
      //               onClick={() => {
      //                 setSelectedRow(row?.original);
      //               }}
      //             />
      //           </Link>
      //         </span>
      //       </div>
      //     );
      //   },
      // }),
    ];
    const commonColumnsTwo = [
      columnHelper.accessor((tableField) => tableField?.application_status, {
        id: "application_status",
        header: "Application Status",
        cell: ({ row }: any) => {
          const viewData = row?.original || {};
          const formattedStatus = formatApplicationStatus(
            viewData?.application_status || ""
          );
          return <>{formattedStatus}</>;
        },
      }),
      columnHelper.accessor((tableField) => tableField?.remarks, {
        id: "remarks",
        header: "Remarks",
      }),
    ];

    if (activeTab === "selection") {
      return [
        columnHelper.accessor((tableField) => tableField?.name, {
          id: "user_selection",
          header: () => (
            <div className="flex items-center">
              {listQuery?.data?.length > 0 && (
                <Checkbox
                  onCheckedChange={(isChecked: boolean) =>
                    handleAllChecked(isChecked)
                  }
                  checked={isCheckedAll}
                />
              )}
              <p className="ml-2">User Name</p>
            </div>
          ),
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="flex items-center">
                <Checkbox
                  checked={
                    !!userId.find(
                      (e: any) => e.employee_id === viewData.user.id
                    )?.status
                  }
                  onCheckedChange={(isChecked: boolean) =>
                    changeCheckValue(viewData.user.id, isChecked)
                  }
                />
                <span className="ml-2">{viewData?.user?.name}</span>
              </div>
            );
          },
        }),
        ...commonColumns,
        columnHelper.accessor(
          (tableField) => tableField?.user?.user_profile?.rating ?? "0",

          {
            id: "rating",
            header: "Rating",
            cell: ({ getValue }) => {
              const rating = getValue();

              // Render stars based on the rating value
              return (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`${star <= rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      fill={star <= rating ? "yellow" : "none"}
                      size={16} // Adjust size as needed
                    />
                  ))}
                </div>
              );
            },
          }
        ),

        // columnHelper.accessor(
        //     (tableField) => tableField?.user_profile?.rating ?? "0",
        //     {
        //       id: "rating",
        //       header: "Rating",
        //       cell: ({ getValue }) => {
        //         const rating = getValue();
        //
        //         // Render stars based on the rating value
        //         return (
        //             <div className="flex gap-1">
        //               {[1, 2, 3, 4, 5].map((star) => (
        //                   <Star
        //                       key={star}
        //                       className={`${
        //                           star <= rating ? "text-yellow-400" : "text-gray-300"
        //                       }`}
        //                       fill={star <= rating ? "yellow" : "none"}
        //                       size={16} // Adjust size as needed
        //                   />
        //               ))}
        //             </div>
        //         );
        //       },
        //     }
        // ),
        columnHelper.accessor((tableField) => tableField?.count_user_event, {
          id: "count_user_event",
          header: "Participants",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <p
                onClick={(e) => handlePerticipateModal(viewData, e)}
                className="text-center"
              >
                <Button className="bg-green-500 cursor-pointer w-[70px]">
                  {viewData?.count_user_event}
                </Button>
              </p>
            );
          },
        }),
        ...commonColumnsTwo,
        columnHelper.accessor(() => "", {
          id: "action",
          header: "Action",
          cell: ({ row }: any) => {
            const userId = row?.original?.user?.id;
            return (
              <div className="flex justify-left items-center">
                <span className="cursor-pointer">
                  {/* <Eye
                    className="text-[#0E9F6E]"
                    onClick={() => {
                      setSelectedRow(row?.original);
                      setParticipateViewDialog(true);
                    }}
                  /> */}

                  {/* <Link
                    href={`/admin/user-management/users/user-view/${row?.original?.user?.id}`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link> */}
                  <Link
                    href={`/admin/event-management/new-event/users/user-view/${userId}?event_detail_id=${event_detail_id}&selected=select`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link>
                </span>
              </div>
            );
          },
        }),
      ];
    }

    if (activeTab === "selected") {
      return [
        columnHelper.accessor((tableField) => tableField?.user?.name, {
          id: "name",
          header: "User Name",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="flex items-center">
                <Checkbox
                  checked={
                    !!userId.find(
                      (e: any) => e.employee_id === viewData.user.id
                    )?.status
                  }
                  onCheckedChange={(isChecked: boolean) =>
                    changeCheckValue(viewData.user.id, isChecked)
                  }
                />
                <span className="ml-2">{viewData?.user?.name}</span>
              </div>
            );
          },
        }),
        ...commonColumns,
        ...commonColumnsTwo,
        columnHelper.accessor(() => "", {
          id: "action",
          header: "Action",
          cell: ({ row }: any) => {
            const userId = row?.original?.user?.id;
            return (
              <div className="flex justify-left items-center">
                <span className="cursor-pointer">
                  {/* <Link
                    href={`/admin/user-management/users/user-view/${row?.original?.user?.id}`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link> */}
                  <Link
                    href={`/admin/event-management/new-event/users/user-view/${userId}?event_detail_id=${event_detail_id}&selected=unselect`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link>
                </span>
              </div>
            );
          },
        }),
      ];
    }
    if (activeTab === "unselect") {
      return [
        columnHelper.accessor((tableField) => tableField?.user?.name, {
          id: "name",
          header: "User Name",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="flex items-center">
                <Checkbox
                  checked={
                    !!userId.find(
                      (e: any) => e.employee_id === viewData.user.id
                    )?.status
                  }
                  onCheckedChange={(isChecked: boolean) =>
                    changeCheckValue(viewData.user.id, isChecked)
                  }
                />
                <span className="ml-2">{viewData?.user?.name}</span>
              </div>
            );
          },
        }),
        ...commonColumns,
        ...commonColumnsTwo,
        columnHelper.accessor(() => "", {
          id: "action",
          header: "Action",
          cell: ({ row }: any) => {
            const userId = row?.original?.user?.id;
            return (
              <div className="flex justify-left items-center">
                <span className="cursor-pointer">
                  <Link
                    href={`/admin/event-management/new-event/users/user-view/${userId}?event_detail_id=${event_detail_id}&selected=reselect`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link>
                </span>
              </div>
            );
          },
        }),
      ];
    }

    if (activeTab === "waiting") {
      return [
        columnHelper.accessor((tableField) => tableField?.user?.name, {
          id: "name",
          header: "User Name",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="flex items-center">
                <Checkbox
                  checked={
                    !!userId.find(
                      (e: any) => e.employee_id === viewData.user.id
                    )?.status
                  }
                  onCheckedChange={(isChecked: boolean) =>
                    changeCheckValue(viewData.user.id, isChecked)
                  }
                />
                <span className="ml-2">{viewData?.user?.name}</span>
              </div>
            );
          },
        }),
        ...commonColumns,
        ...commonColumnsTwo,
        columnHelper.accessor(() => "", {
          id: "action",
          header: "Action",
          cell: ({ row }: any) => {
            const userId = row?.original?.user?.id;
            const eventDetailsId = row?.original?.event_detail?.event_detail_id;
            return (
              <div className="flex justify-left items-center">
                <span className="cursor-pointer">
                  <Link
                    href={`/admin/event-management/new-event/users/user-view/${userId}?event_detail_id=${eventDetailsId}&selected=selection`}
                  >
                    <Eye
                      className="text-[#0E9F6E]"
                      onClick={() => {
                        setSelectedRow(row?.original);
                      }}
                    />
                  </Link>
                </span>
              </div>
            );
          },
        }),
      ];
    }
    return commonColumns;
  }, [userId, isCheckedAll, params, listQuery, selectedListQuery, activeTab]);

  return (
    <>
      <Tabs defaultValue="selection">
        <div className="sm:block lg:flex lg:justify-between gap-2 items-center">
          <div className=" sm:items-center lg:flex">
            <div className="font-bold text-lg md:text-xl sm:block lg:flex items-center ">
              <div className="flex justify-center lg:justify-start items-center">
                {/* issue 15225 className="flex flex-col md:flex-row md:space-x-4" */}
                <TabsList className="flex flex-wrap justify-start h-auto md:h-fit">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-3">
                      <TabsTrigger
                        value="selection"
                        onClick={() => handleTabChange("selection")}
                        className="text-base p-2 md:p-3"
                      >
                        Participants Selection
                      </TabsTrigger>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-3">
                      <TabsTrigger
                        value="selected"
                        onClick={() => handleTabChange("selected")}
                        className="text-base p-2 md:p-3"
                      >
                        Selected Participants
                      </TabsTrigger>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-3">
                      <TabsTrigger
                        value="unselected"
                        onClick={() => handleTabChange("unselect")}
                        className="text-base p-2 md:p-3"
                      >
                        Unselected Participants
                      </TabsTrigger>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-3">
                      <TabsTrigger
                        value="waiting"
                        onClick={() => handleTabChange("waiting")}
                        className="text-base p-2 md:p-3"
                      >
                        Waiting Participants
                      </TabsTrigger>
                    </div>
                  </div>
                </TabsList>
              </div>
              <div className="flex justify-center lg:justify-start items-center">
                <span className="text-[15px] flex items-center bg-[#c2edf1] rounded-lg ml-3 p-1 md:p-2 ">
                  {financialYear?.data[0]}
                </span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="">
                <Search />
              </div>
              <div className="">
                {activeTab === "selection" && (
                  <div className="flex">
                    <div
                      className="bg-[#0CB04D] w-[100px] rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("select")}
                    >
                      Select <ChevronRight />
                    </div>
                    <div
                      className="bg-[#0CB04D] w-[100px] ml-2 rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("waiting")}
                    >
                      Waiting <ChevronRight />
                    </div>
                  </div>
                )}
                {activeTab === "selected" && (
                  <>
                    <div
                      className="bg-[#0CB04D] w-[100px] rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("unselect")}
                    >
                      Unselect <ChevronRight />
                    </div>
                  </>
                )}
                {activeTab === "unselect" && (
                  <div className="flex">
                    <div
                      className="bg-[#0CB04D] w-[100px] rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("reselect")}
                    >
                      Reselect <ChevronRight />
                    </div>
                    <div
                      className="bg-[#0CB04D] w-[100px] ml-2 rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("waiting")}
                    >
                      Waiting <ChevronRight />
                    </div>
                  </div>
                )}
                {activeTab === "waiting" && (
                  <>
                    <div
                      className="bg-[#0CB04D] w-[100px] rounded-lg p-2 flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleSubmit("select")}
                    >
                      Select <ChevronRight />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <TabsContent value="selection" className=" space-y-5">
          <Card className="w-full bg-white rounded-lg">
            <div className="p-4">
              <h2 className="text-[#545454] text-[20px]">Event Information</h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Program Name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.program_info?.name_en}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event Name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Venue :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.venue}
                      {/* {moment(eventDetails?.data?).format('D-MM-YYYY')} */}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Start Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      End Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event Entry Fee : </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_entry_fee}
                    </p>
                  </div>
                </div>
                {/* <div className="col-span-12 md:col-span-4">
                      <div className="flex">
                        <p className="text-[#545454] font-bold">
                        Total participants:
                        </p>
                        <p className="text-[#545454] ml-2">
                          {eventDetails?.data?.count_user_event}
                        </p>
                      </div>
                    </div> */}
              </div>
            </CardContent>
          </Card>
          <ReactTable
            dataSource={listQuery}
            columns={columns}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="selected" className=" space-y-5">
          <Card className="w-full bg-white rounded-lg">
            <div className="p-4">
              <h2 className="text-[#545454] text-[20px]">Event Information</h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Program Name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.program_info?.name_en}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Venue :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.venue}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Start Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      End Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event Entry Fee :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_entry_fee}
                    </p>
                  </div>
                </div>
                {/* <div className="col-span-12 md:col-span-4">
                      <div className="flex">
                        <p className="text-[#545454] font-bold">
                        Total participants:
                        </p>
                        <p className="text-[#545454] ml-2">
                          {eventDetails?.data?.count_user_event}
                        </p>
                      </div>
                    </div> */}
              </div>
            </CardContent>
          </Card>
          <ReactTable dataSource={selectedListQuery} columns={columns} />
        </TabsContent>
        <TabsContent value="unselected" className=" space-y-5">
          <Card className="w-full bg-white rounded-lg">
            <div className="p-4">
              <h2 className="text-[#545454] text-[20px]">Event Information</h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Program Name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.program_info?.name_en}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Venue :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.venue}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Start Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      End Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event Entry Fee : </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_entry_fee}
                    </p>
                  </div>
                </div>
                {/* <div className="col-span-12 md:col-span-4">
                      <div className="flex">
                        <p className="text-[#545454] font-bold"> <div className="flex justify-center items-center gap-10"></div>
                        Total participants:
                        </p>
                        <p className="text-[#545454] ml-2">
                          {eventDetails?.data?.count_user_event}
                        </p> 
                      </div> <div className=""></div>
                    </div> */} 
              </div>
            </CardContent>
          </Card>
          <ReactTable dataSource={unSelectedListQuery} columns={columns} />
        </TabsContent>
        <TabsContent value="waiting" className=" space-y-5">
          <Card className="w-full bg-white rounded-lg">
            <div className="p-4">
              <h2 className="text-[#545454] text-[20px]">Event Information</h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Program Name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.program_info?.name_en}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event name :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Venue :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.venue}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Start Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.start_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      End Date :
                    </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.end_date).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Event Entry Fee :
                    </p>
                    <p className="text-[#545454] ml-2"> 
                      {eventDetails?.data?.event_entry_fee}
                    </p>
                  </div>
                </div> 
                {/* <div className="col-span-12 md:col-span-4">
                      <div className="flex">
                        <p className="text-[#545454] font-bold">
                        Total participants:
                        </p>
                        <p className="text-[#545454] ml-2">
                          {eventDetails?.data?.count_user_event}
                        </p>
                      </div>
                    </div> */}
              </div>
            </CardContent>
          </Card>
          <ReactTable dataSource={watingListQuery} columns={columns} />
        </TabsContent>
      </Tabs>

      <SingleParticipantView
        open={openParticipateViewDialog}
        onClose={() => setParticipateViewDialog(false)}
        onSave={setParticipateView}
        singleParticipateValues={selectedRow}
      />

      <ParticipateModal
        open={openParticipateModal}
        setOpen={setOpenParticipateModal}
        id={selectedData?.user_id}
        rowData={selectedData}
        refetch={refetch}
      />
    </>
  );
};

export default SelectionList;