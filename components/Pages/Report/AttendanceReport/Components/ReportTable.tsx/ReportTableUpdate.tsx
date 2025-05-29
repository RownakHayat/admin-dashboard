import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useDeleteAttendanceReportMutation } from "@/store/features/report/attendanceReport";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const ReportTableUpdate = ({ attendanceReportData }: any) => {
  const [deleteAttendanceReport] = useDeleteAttendanceReportMutation();

  const handleDeleteAttendance = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAttendanceReport(id);
        // Swal.fire("Attendance Report Delete Successfully", "success");
        Swal.fire("Attendance Report Delete Successfully");
      }
    });
  };

  const [print, setprint] = useState(false);

  useEffect(() => {
    if (attendanceReportData?.data?.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [attendanceReportData, setprint]);

  const componentRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = async () => {
    const input = componentRef.current;
    if (!input) return;

    // Hide action column (both header and cells)
    const actionColumns = input.querySelectorAll(".action-column");

    // Cast each element to HTMLElement and set the style
    actionColumns.forEach((cell) => {
      const element = cell as HTMLElement;
      element.style.display = "none";
    });

    // ❗ Hide delete icons
    const deleteIcons = input.querySelectorAll(".delete-icon");
    deleteIcons.forEach((icon) => {
      (icon as HTMLElement).style.display = "none";
    });

    // Wait a bit to ensure images (especially next/image) are fully loaded
    await new Promise((resolve) => setTimeout(resolve, 500)); // adjust if needed

    // const canvas = await html2canvas(input, { scale: 2 });
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, // helps with external images
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("AttendanceReport.pdf");

    // Restore visibility after saving
    actionColumns.forEach((cell) => {
      const element = cell as HTMLElement;
      element.style.display = "table-cell";
    });
  };

  // const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance Report",
    onAfterPrint: () => console.log("Print Success"),
  });

  const [productTexts, setProductTexts] = useState<string[]>();

  function formatDateRange(start_date: any, end_date: any) {
    const start = new Date(start_date);
    const end = new Date(end_date);

    const startDay = start.getDate();
    const endDay = end.getDate();

    const startMonth = start.toLocaleString("default", { month: "long" });
    const endMonth = end.toLocaleString("default", { month: "long" });

    const year = start.getFullYear(); // assuming both dates are in the same year

    if (startMonth === endMonth) {
      // Same month
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      // Different months
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  }

  return (
    <>
      <style>{`
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          margin: 20mm;
          padding: 20mm;
        }
       .print-container {
      padding-left: 20mm;
      padding-right: 20mm;
    }
      }
    `}</style>
      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12">
          <div className="flex items-center justify-end  mb-5">
            <div className="">
              <Button
                type="button"
                className="bg-blue-600 hover:bg-yellow-700 text-white font-bold py-2 mt-5 px-4 rounded"
                onClick={handleDownloadPDF}
              >
                <Icons.download className="text-white" />
                <span className="pl-4">Download PDF</span>
              </Button>
            </div>
          </div>

          <div
            className="w-[100%] overflow-x-auto print-container"
            ref={componentRef}
            style={{
              paddingLeft: "40px",
              paddingRight: "40px",
              
            }}
          >
            {attendanceReportData?.data?.map((event: any) => {
              const eventAttendance = event?.eventWiseAttendance || [];
              const attendanceDates = Object.keys(
                eventAttendance[0]?.attendance || {}
              );
              const date = formatDateRange(event?.start_date, event?.end_date);

              return (
                event?.eventWiseAttendance?.length >= 1 && (
                  <div key={event.id} className="mb-10">
                    <div className="flex items-center justify-between border-b pb-5">
                      <div className="w-1/4 flex items-center">
                        <Image
                          priority={true}
                          src="/assets/Image/SMEF-Logo.png"
                          alt="SMEF Logo"
                          width={120}
                          height={150}
                          className="mb-5"
                        />
                      </div>
                      <div className="w-2/4 text-center">
                        <h1 className="font-semibold  underline pb-2 underline-offset-4 text-2xl">
                          কর্মশালা
                        </h1>
                        <h1 className="font-semibold text-3xl">
                          {event?.event_name}
                        </h1>
                        <p>{date}</p>
                      </div>
                      <div className="w-1/4 text-center text-sm font-semibold">
                        <p className="text-lg pb-2">উপস্থিতির তালিকা </p>
                        <p>স্থান : {event?.venue}</p>
                      </div>
                    </div>
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-300 text-center">
                          <th
                            className={`border border-gray-400 px-2 py-1`}
                            key={event?.name}
                          >
                            ক্র.
                          </th>
                          <th className="border border-gray-400 px-2 py-1">
                            নাম
                          </th>
                          <th className="border border-gray-400 px-2 py-1">
                            পদবী ও প্রতিষ্ঠানের নাম
                          </th>
                          <th className="border border-gray-400 px-2 py-1">
                            ফোন
                          </th>
                          <th className="border border-gray-400 px-2 py-1">
                            ইমেইল
                          </th>
                          {attendanceDates.map((date) => (
                            <th
                              key={date}
                              className="border border-gray-400 px-2 py-1 pb-1"
                            >
                              স্বাক্ষর <br /> ({date})
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {eventAttendance.map(
                          (participant: any, index: number) => (
                            <tr
                              key={participant.user_id}
                              className="text-center"
                            >
                              <td className="border border-gray-400 px-2 py-1">
                                {index + 1}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                {participant.name}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                {participant.organization_name}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                {participant.phone}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                {participant.email}
                              </td>
                              {attendanceDates.map((date) => {
                                const signature =
                                  participant.attendance?.[date]?.signature;

                                return (
                                  <td
                                    key={date}
                                    className="border border-gray-400  px-2 py-3"
                                  >
                                    {signature?.includes("/images/") ? (
                                      <div className="flex gap-5 items-center">
                                        <span>
                                          {/* <Image
                                            src={`${
                                              siteConfig?.envConfig[
                                                `${process.env.APP_ENV}`
                                              ]?.IMAGE_URL
                                            }${signature}`}
                                            alt={signature || "Signature Image"}
                                            width={120}
                                            height={100}
                                            style={{
                                              objectFit: "cover",
                                              height: "100%",
                                              maxHeight: "120px",
                                            }}
                                          /> */}
                                          <img
                                            src={`${
                                              siteConfig?.envConfig[
                                                `${process.env.APP_ENV}`
                                              ]?.IMAGE_URL
                                            }${signature}`}
                                            alt={signature || "Signature Image"}
                                            width={120}
                                            height={100}
                                            style={{
                                              objectFit: "cover",
                                              maxHeight: "120px",
                                            }}
                                          />
                                        </span>

                                        <span
                                          className="cursor-pointer  delete-icon"
                                          onClick={() =>
                                            handleDeleteAttendance(
                                              participant.attendance?.[date]
                                                ?.attendance_id || null
                                            )
                                          }
                                        >
                                          <Icons.delete />
                                        </span>
                                      </div>
                                    ) : signature == "Not Upload" ? (
                                      <>{`${signature} (Present)`}</>
                                    ) : (
                                      <>{signature}</>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportTableUpdate;
