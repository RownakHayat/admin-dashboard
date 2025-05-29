import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

const EventWiseAppliedUserReport = ({ eventWiseAppliedUserList }: any) => {

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Event Wise Applied User Report",
    onAfterPrint: () => console.log("Print Success"),
  })


  const handleDownloadExcel = () => {
    const rows = [];

     rows.push(["Event Name", "Sl.", "User Name", "Mobile", "Email", "Application Status"]);

     eventWiseAppliedUserList?.data?.forEach((item: any) => {
      if (item?.event_application?.length > 0) {
        item?.event_application?.forEach((eventAppliedData: any, index: number) => {
          rows.push([
            item?.event_name,
            index + 1,
            eventAppliedData?.user?.name || "",
            eventAppliedData?.user?.mobile || "",
            eventAppliedData?.user?.email || "",
            eventAppliedData?.application_status || "",
          ]);
        });
      }
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `EventWiseAppliedUsers_${formattedDate}_${formattedTime}.xlsx`;
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Wise Applied User Report");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div>

      <div className="flex justify-end">
        <div className="flex justify-end mt-8 mr-9 ">
          <Image
            src="/assets/Image/print.svg"
            alt="Reload"
            width={20}
            height={20}
            className='cursor-pointer flex justify-end'
            onClick={() => handleClickToPrint()}
          />
        </div>
        <div>
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
        <div className="text-center pb-4">
          <h2 className="text-2xl pt-5">SME Foundation</h2>
          <h4 className="text-2xl pt-5">Event Wise Applied User</h4>
        </div>
        {eventWiseAppliedUserList?.data?.map((item: any, index: number) => {
          return (
            <div key={index} className="mx-[30px]">
              {item?.event_application?.length > 0 && (
                <>
                  <div className="text-center my-5 font-bold">
                    Event Name: {item?.event_name}
                  </div>
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-300 text-center">
                        <th className="border border-gray-400 px-2 py-1">Sl.</th>
                        <th className="border border-gray-400 px-2 py-1">User Name</th>
                        <th className="border border-gray-400 px-2 py-1">Mobile</th>
                        <th className="border border-gray-400 px-2 py-1">Email</th>
                        <th className="border border-gray-400 px-2 py-1">Application Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.event_application?.map((eventAppliedData: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border border-gray-400 px-2 py-1">{idx + 1}</td>
                          <td className="border border-gray-400 px-2 py-1">{eventAppliedData?.user?.name}</td>
                          <td className="border border-gray-400 px-2 py-1">{eventAppliedData?.user?.mobile}</td>
                          <td className="border border-gray-400 px-2 py-1">{eventAppliedData?.user?.email}</td>
                          <td className="border border-gray-400 px-2 py-1">{eventAppliedData?.application_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EventWiseAppliedUserReport