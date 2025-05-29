"use client";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import {
  useCancelEventMutation,
  useCloseEventMutation,
  useCompleteEventMutation,
  useFairSaleStatusChangeMutation,
  useFeedBackStatusChangeMutation,
  useGetSingleEventDetailsQuery,
  useReOpenEventMutation,
  useSingleEventPostPoneMutation,
} from "@/store/features/eventManagement/newEvent";
import moment from "moment";

import CheckPermission from "@/components/common/pipe/roleChecker";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Action from "../../Attendance/components/Action/Action";

const EventDetails = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const paramss = useParams();
  const id = paramss?.id ? Number(paramss.id) : null;
  const router = useRouter();

  const { data: singleEventViewData, refetch } = useGetSingleEventDetailsQuery(
    { id: id },
    { refetchOnMountOrArgChange: true }
  );

  const [showAttenance, setShowAttenance] = useState(false);

  useEffect(() => {
    refetch();
  }, [id]);

  const [singleEventPostPone] = useSingleEventPostPoneMutation();
  const [singleEventReopen] = useReOpenEventMutation();
  const [cancelEvent] = useCancelEventMutation();
  const [completeEvent] = useCompleteEventMutation();
  const [closeEvent] = useCloseEventMutation();
  const [fairSaleStatusChange] = useFairSaleStatusChangeMutation();
  const [feedbackStatusChange] = useFeedBackStatusChangeMutation();

  const handlePostpone = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await singleEventPostPone(payload).unwrap();
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || "An error occurred while postponing the event.";
      return { success: false, message };
    }
  };

  // const postponeEventFunc = async (id: number | null) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, Postpone it!",
  //   })
  //   .then((result) => {
  //     if (result.isConfirmed) {
  //       handlePostpone(id);
  //       Swal.fire("Postponed!", "Event Postponed Successfully", "success");
  //     }
  //     router.push("/admin/event-management/new-event");
  //   });
  // };

  const postponeEventFunc = async (id: number | null) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Postpone it!",
    });

    if (result.isConfirmed) {
      const response = await handlePostpone(id);

      if (response.success) {
        Swal.fire("Postponed!", "Event Postponed Successfully", "success").then(() => {
          router.push("/admin/event-management/new-event");
        });
      } else {
        Swal.fire("Error!", response.message, "error").then(() => {
          router.push(`/admin/event-management/new-event/${id}/event-details`);
        });
      }
    }
  };

  const handleReopen = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await singleEventReopen(payload).unwrap();
    } catch (error) { }
  };

  const reOpenEventFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reopen it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleReopen(id);
        Swal.fire("Reopened!", "Event Reopened Successfully", "success");
      }
      router.push("/admin/event-management/new-event");
    });
  };
  const handleCancel = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await cancelEvent(payload).unwrap();
    } catch (error) { }
  };
  const cancelEventFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel Event!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancel(id);
        Swal.fire("Canceled!", "Event Canceled Successfully", "success");
      }
      router.push("/admin/event-management/new-event");
    });
  };

  const handleComplete = async (id: number | null) => {
    try {
      const payload = {
        id: id,
      };
      // Call the API to complete the event and wait for the response
      const response = await completeEvent(payload).unwrap();

      // Check if the response status is success
      if (response?.status === "success") {
        Swal.fire("Completed!", "Event Completed Successfully", "success");
      }
    } catch (error: any) {
      const message = error?.data?.message;
      const budgetKeywords = ["budget"];
      const attendanceKeywords = ["attendance"];

      const isBudgetRelated = (msg: any) => {
        return budgetKeywords.some((keyword) =>
          msg.toLowerCase().includes(keyword)
        );
      };
      const isAttendanceRelated = (msg: any) => {
        return attendanceKeywords.some((keyword) =>
          msg.toLowerCase().includes(keyword)
        );
      };
      if (isBudgetRelated(message)) {
        Swal.fire({
          title: "Error!",
          text: "You have to provide Budget Spent to complete this event",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push(
            `/admin/event-management/budget-spent/budget-spent-update/${id}/edit`
          );
        });
      } else if (isAttendanceRelated(message)) {
        Swal.fire({
          title: "Error!",
          text: "You have to provide Attendance to complete this event",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          // router.push(
          //   `/admin//event-management/attendance?attendance-event-id=${id}`
          // );
          setShowAttenance(true)
        });
      } else {
        Swal.fire(
          "Error!",
          error?.data?.message ||
          "An error occurred while completing the event.",
          "error"
        );
      }


    }
  };

  const completeEventFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete Event!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleComplete(id);
      }
    });
  };

  const handleClose = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await closeEvent(payload).unwrap();
    } catch (error) { }
  };

  const closeEventFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close Event!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleClose(id);
        Swal.fire("Close!", "Event Closed Successfully", "success");
      }
    });
  };
  const handleFairSale = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await fairSaleStatusChange(payload).unwrap();
    } catch (error) { }
  };

  const fairSaleStatusChangeFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Status Change!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFairSale(id);
        Swal.fire(
          "Status Changed!",
          "Fair Sale Status Changed Successfully",
          "success"
        );
      }
    });
  };

  const handleFeedback = async (id: any | null) => {
    try {
      const payload = {
        id: id,
      };
      await feedbackStatusChange(payload).unwrap();
    } catch (error) { }
  };

  const feedbackStatusChangeFunc = async (id: number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Status Change!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleFeedback(id);
        Swal.fire(
          "Status Changed!",
          "Feedback Status Changed Successfully",
          "success"
        );
      }
    });
  };

  const [openAction, setOpenAction] = useState(false)
  const [actionPosition, setActionPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleActionDialog = (data: any, event: React.MouseEvent<HTMLDivElement>) => {

    const rect = event.currentTarget.getBoundingClientRect();
    setActionPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedData(data)
    setOpenAction(true)

  }

  return (
    <div className="bg-white p-8 md:p-10 lg:p-12 rounded-lg">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-6">
          <h5 className="text-lg md:text-xl font-bold">
            {singleEventViewData?.data?.event_name}
          </h5>
        </div>
        <CheckPermission subMod={"new_event"} permission={"new_event_edit"}>
          <div className="col-span-12 md:col-span-6 flex justify-end">
            <Link href={`/admin/event-management/new-event/${id}/edit`}>
              <Icons.edit onClick={() => editData(singleEventViewData)} />
            </Link>
          </div>
        </CheckPermission>
      </div>

      <Separator className="h-1 mt-3" />

      <div className="grid grid-cols-12 gap-3 mt-4">
        {[
          {
            label: "Program Name",
            value: singleEventViewData?.data?.program_info?.name_en,
          },
          {
            label: "Business Sector",
            value: singleEventViewData?.data?.industrial_sec_for_events?.map(
              (item: any) => (
                <div
                  key={item.id}
                  className="border border-gray-300 rounded-lg p-1"
                >
                  {item?.business_sector?.name}
                </div>
              )
            ),
          },
          { label: "Venue", value: singleEventViewData?.data?.venue },
          {
            label: "Fee",
            value: singleEventViewData?.data?.event_entry_fee,
          },
          {
            label: "Start Date",
            value: moment(singleEventViewData?.data?.start_date).format(
              "DD MMM YYYY"
            ),
          },
          {
            label: "End Date",
            value: moment(singleEventViewData?.data?.end_date).format(
              "DD MMM YYYY"
            ),
          },
          {
            label: "Application Deadline",
            value: moment(singleEventViewData?.data?.dead_line).format(
              "DD MMM YYYY"
            ),
          },
          {
            label: "Event Activity",
            value: singleEventViewData?.data?.activity?.name,
          },
          {
            label: "Event Feedback Status",
            value:
              Number(singleEventViewData?.data?.feedback_status) === 1
                ? "On"
                : "Off",
          },
          {
            label: "Attendance",
            value: singleEventViewData?.data?.event_attendance_count || 0,
          },
          {
            label: "Budget Spent",
            value: singleEventViewData?.data?.spent_amount || 0,
          },
          // {

          //   label: "Event Fair Sale Status",
          //   value:
          //     Number(singleEventViewData?.data?.fair_sale_status) === 1
          //       ? "On"
          //       : "Off",
          // },
          ...(singleEventViewData?.data?.activity_id == 1 ||
            singleEventViewData?.data?.activity_id == 2 ||
            singleEventViewData?.data?.activity_id == 3
            ? [
              {
                label: "Event Fair Sale Status",
                value:
                  Number(singleEventViewData?.data?.fair_sale_status) === 1
                    ? "On"
                    : "Off",
              },
            ]
            : []),
        ].map(({ label, value }, index) => (
          <div key={index} className="col-span-12 md:col-span-6">
            <div className="flex flex-wrap">
              <p className="font-semibold">{label}:</p>
              <p className="ml-2">{value}</p>
            </div>
          </div>
        ))}

        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p className="font-semibold">Attachment Name:</p>
            <ul className="ml-2 list-inside">
              {singleEventViewData?.data?.event_attachments?.map(
                (item: any, index: number) => (
                  <li key={index}>
                    {index + 1}. {item?.attachment_name}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p className="font-semibold">Attachment:</p>
            <div className="ml-2 flex flex-wrap">
              {singleEventViewData?.data?.event_attachments?.map(
                (item: any) => {
                  const fileExtension = item?.attach_file_path
                    .split(".")
                    .pop()
                    ?.toLowerCase();

                  return (
                    <div key={item.id} className="text-center p-2">
                      {/* Check for PDF file */}
                      {fileExtension === "pdf" ? (
                        <a
                          href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                            }${item?.attach_file_path}}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            priority={true}
                            src="/assets/Image/pdf.png"
                            alt={`PDF Attachment for ${item?.name}`}
                            width={128}
                            height={128}
                            className="pdfIcon"
                          />
                        </a>
                      ) : // Check for DOC/DOCX file (Word documents)
                        fileExtension === "doc" || fileExtension === "docx" ? (
                          <Link
                            href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                              ?.IMAGE_URL
                              }${item?.attach_file_path}`}
                          >
                            <Image
                              priority={true}
                              src="/assets/Image/word.png" // You can replace this with the actual icon for Word documents
                              alt={`Document Attachment for ${item?.name}`}
                              width={128}
                              height={128}
                              className="wordIcon"
                            />
                          </Link>
                        ) : // Handle image files (jpg, png, gif, etc.)
                          fileExtension === "jpg" ||
                            fileExtension === "jpeg" ||
                            fileExtension === "png" ||
                            fileExtension === "gif" ? (
                            item?.attach_file_path && (
                              <Image
                                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                                  ?.IMAGE_URL
                                  }${item?.attach_file_path}`}
                                alt={`Image Attachment for ${item?.name}`}
                                width={200}
                                height={200}
                                className="object-cover h-32 max-h-48"
                              />
                            )
                          ) : null}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p className="font-semibold">Remarks:</p>
            <p className="pl-2 text-justify  overflow-auto h-24">
              {singleEventViewData?.data?.remarks}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-center">
        {showAttenance && (
          <Button className="bg-green-600">
            <h1 className="font-medium text-[#ffffff] text-nowrap py-2 px-6 " onClick={(e) => handleActionDialog(id,e)}>
              Attendance+
            </h1>
          </Button>
        )}

        {singleEventViewData?.data?.event_status === "3" && (
          <>
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_postpone_button"}
            >
              <Button
                className="bg-red-700 m-[5px] text-md"
                onClick={() => postponeEventFunc(id)}
              >
                Postpone Event
              </Button>
            </CheckPermission>
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_complete_button"}
            >
              <Button
                className="bg-green-700 sm:mr-[5px] lg:m-[5px] text-md"
                onClick={() => completeEventFunc(id)}
              >
                Complete Event
              </Button>
            </CheckPermission>
            {/* <CheckPermission subMod={'new_event'} permission={'new_event_cancel_button'}>
              <Button className="bg-yellow-700 m-[5px] text-md" onClick={() => cancelEventFunc(id)}>
                Cancel Event
              </Button>
            </CheckPermission> */}
          </>
        )}
        {singleEventViewData?.data?.event_status === "6" && (
          <>
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_complete_button"}
            >
              <Button
                className="bg-green-700 m-[5px] text-md"
                onClick={() => reOpenEventFunc(id)}
              >
                Re-open Event
              </Button>
            </CheckPermission>
            {/* <CheckPermission subMod={'new_event'} permission={'new_event_cancel_button'}>
              <Button className="bg-yellow-700 m-[5px] text-md" onClick={() => cancelEventFunc(id)}>
                Cancel Event
              </Button>
            </CheckPermission> */}
          </>
        )}
        {["1", "2", "3", "6"].includes(
          singleEventViewData?.data?.event_status
        ) && (
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_cancel_button"}
            >
              <Button
                className="bg-orange-700 lg:m-[5px] hover:bg-orange-700 text-md mt-1"
                onClick={() => cancelEventFunc(id)}
              >
                Cancel Event
              </Button>
            </CheckPermission>
          )}
        {singleEventViewData?.data?.event_status === "4" && (
          <div className="flex items-center">
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_feedback_status_change_button"}
            >
              <Button
                className="bg-blue-600 hover:bg-blue-700 m-[5px] text-md text-white"
                onClick={() => feedbackStatusChangeFunc(id)}
              >
                Feedback Status Change
              </Button>
            </CheckPermission>

            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_fair_sale_status_change_button"}
            >
              {(singleEventViewData?.data?.activity_id == 1 ||
                singleEventViewData?.data?.activity_id == 2 ||
                singleEventViewData?.data?.activity_id == 3) && (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 m-[5px] text-md text-white"
                    onClick={() => fairSaleStatusChangeFunc(id)}
                  >
                    Fair Sale Status Change
                  </Button>
                )}
            </CheckPermission>
          </div>
        )}
        {/* {singleEventViewData?.data?.event_status === "5" && (
          <>
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_feedback_status_change_button"}
            >
              <Button
                className="bg-green-700 m-[5px] text-md"
                onClick={() => feedbackStatusChangeFunc(id)}
              >
                Feedback Status Change
              </Button>
            </CheckPermission>
            <CheckPermission
              subMod={"new_event"}
              permission={"new_event_fair_sale_status_change_button"}
            >
              <Button
                className="bg-green-700 m-[5px] text-md"
                onClick={() => fairSaleStatusChangeFunc(id)}
              >
                Fair Sale Status Change
              </Button>
            </CheckPermission>
          </>
        )} */}
      </div>
      <Action open={openAction} setOpen={setOpenAction} id={selectedData} rowData={selectedData} refetch={refetch} actionPosition={actionPosition} />
    </div>
  );
};

export default EventDetails;
