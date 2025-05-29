import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

const HelpdeskActivityLogReport = ({ helpdeskActivityData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (helpdeskActivityData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [helpdeskActivityData, setprint]);

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Helpdesk Activity Log Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Sl.", "Name", "mobile", "email", "message"]);

    helpdeskActivityData?.data?.forEach((helpdeskActivitySingleData: any, index: number) => {
      rows.push([
        index + 1,
        helpdeskActivitySingleData?.user?.name,
        helpdeskActivitySingleData?.user?.mobile,
        helpdeskActivitySingleData?.user?.email,
        helpdeskActivitySingleData?.message,
      ]);
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `HelpdeskActivityLogReport_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Helpdesk Activity Log Report");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="px-5">
      <div className='flex items-center justify-end'>
        <div className='mt-4 mr-3'>
          {
            print && <Image
              src="/assets/Image/print.svg"
              alt="Reload"
              width={20}
              height={20}
              className='cursor-pointer'
              onClick={() => handleClickToPrint()}
            />
          }
        </div>

        <div className=''>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
            onClick={handleDownloadExcel}
          >
            <Icons.download className="text-white" /> <span className="pl-4">Download Excel File</span>
          </Button>
        </div>
      </div>
      <div ref={componentRef}>
        <div className='text-center pb-4'>
          <h2 className='text-2xl pt-5'>SME Foundation</h2>
          <h4 className='text-2xl pt-5'>Helpdesk Activity Log Report </h4>
        </div>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 text-center">
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Message</th>
            </tr>
          </thead>
          <tbody className=''>
            {helpdeskActivityData?.data?.map((helpdeskActivitySingleData: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">{helpdeskActivitySingleData?.user?.name}</td>
                  <td className="border border-gray-400 px-2 py-1">{helpdeskActivitySingleData?.user?.mobile}</td>
                  <td className="border border-gray-400 px-2 py-1">{helpdeskActivitySingleData?.user?.email}</td>
                  <td className="border border-gray-400 px-2 py-1">{helpdeskActivitySingleData?.message}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HelpdeskActivityLogReport