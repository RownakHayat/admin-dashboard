import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { useDeleteAttendanceReportMutation } from '@/store/features/report/attendanceReport';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';

const ReportTable = ({ attendanceReportData }: any) => {



  const [deleteAttendanceReport] = useDeleteAttendanceReportMutation()

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

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (attendanceReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
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

    const canvas = await html2canvas(input, { scale: 2 });
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
  })

  const [productTexts, setProductTexts] = useState<string[]>();


  return (
    <>
      <style>{`
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    `}</style>
      <div className="grid grid-cols-12 gap-4 mt-5" >
        <div className="col-span-12">
          <div className='flex items-center justify-end'>
            <div className=''>
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

          <div className="w-[100%] overflow-x-auto" ref={componentRef}>
            {attendanceReportData?.data?.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>Attendance Report</h4>
                <p className='text-lg'>SME Foundation</p>
              </div>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-center">
                    {
                      tableHeaderData?.map((headline) => (
                        <th
                          className={`border border-gray-400 px-2 py-1 ${headline.name === "Action" ? "action-column" : ""}`}
                          key={headline?.name}
                        >
                          {headline?.name}
                        </th>
                      ))
                    }
                  </tr>
                </thead>

                <tbody className=''>

                  {attendanceReportData?.data?.map((row: any, index: any) => (
                    <tr key={index} className="text-center">

                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.user_id}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.organization_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.email}</td>
                      <td className="border border-gray-400 px-2 py-3 flex items-center justify-center">
                        {row?.user?.user_profile?.signature_image_path ? (
                          <Image
                            src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${row.user.user_profile.signature_image_path}`}
                            alt={row?.user?.name || 'Signature Image'}
                            width={120}
                            height={100}
                            style={{ objectFit: 'cover', height: '100%', maxHeight: '120px' }}
                          />
                        ) : (
                          "No Signature"
                        )}

                      </td>
                      {/* <td className="border border-gray-400 px-2 py-1">{row?.event_detail?.event_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{moment(row?.created_at).format('D-MM-YYYY')} </td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.district?.name}</td> */}

                      <td className="border border-gray-400 px-2 py-1 action-column">
                        <Button
                          type="button"
                          className="bg-red-500 text-white px-3 py-1 rounded-md"
                          onClick={() => handleDeleteAttendance(row?.id)}
                        >
                          Delete
                        </Button>
                      </td>


                    </tr>

                  ))}

                </tbody>
              </table>
            </>) : <>
              <EmptyData />
            </>}
          </div>
        </div>
      </div>
    </>
  )
}

const tableHeaderData = [
  {
    id: 1,
    name: 'Sl.'
  },
  {
    id: 2,
    name: 'User Id'
  },
  {
    id: 3,
    name: 'Name'
  },
  {
    id: 4,
    name: 'Institution/Desgination'
  },
  {
    id: 5,
    name: 'Phone'
  },
  {
    id: 6,
    name: 'Email'
  },
  {
    id: 7,
    name: 'Signature'
  },
  // {
  //   id: 8,
  //   name: 'District'
  // },
  {
    id: 9,
    name: "Action"
  }


]

export default ReportTable
