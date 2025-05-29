import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";
const FeedbackreportTable = ({ feedbackReportData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(()=>{
    if(feedbackReportData?.data?.length > 0){
      setprint( true )
    }else{
      setprint( false )
  }
  },[feedbackReportData, setprint])

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Feedback Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Sl.", "User Name", "Mobile", "Email", "Description", "Subject"]);
    let serialNumber = 1;
    feedbackReportData?.data?.forEach((feedbackSingleData: any, index: number) => {
      feedbackSingleData?.feedback?.map((item: any) => {
        rows.push([
          serialNumber++,
          item?.user?.name,
          item?.user?.mobile,
          item?.user?.email,
          item?.description,
          item?.subject,
        ]);
      })
    });
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `FeedBackReport_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Report");
    XLSX.writeFile(workbook, fileName);
  };

  let serialNumber = 1;
  return(
    <div>
      <style>
        {` @media print {
        @page { margin: 20mm}
        body { margin: 0; padding: 0; }
      } `}
    </style>
      <div className="mt-5" >
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
        <div className="w-[100%] overflow-x-auto" ref={componentRef}>
          {feedbackReportData?.data?.length > 0 ? (<>
            <div className='text-center pb-4'>
              <h4 className='text-2xl'>Feedback Report</h4>
              <p className='text-lg'>SME Foundation</p>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  {
                    tableHeaderData?.map((headline) => (
                      <th className="border border-gray-400 px-2 py-1" key={headline?.name}>{headline?.name}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody className=''>
                {feedbackReportData?.data?.map((singleFeedbackData: any, index: number) => (
                  singleFeedbackData?.feedback?.map((singleFeedbackValue: any, indexs: number) => {
                    return (
                      <>
                        <tr key={index} className="text-center">
                          <td className="border border-gray-400 px-2 py-1">{serialNumber++}</td>
                          <td className="border border-gray-400 px-2 py-1">{singleFeedbackValue?.user?.name}</td>
                          <td className="border border-gray-400 px-2 py-1">{singleFeedbackValue?.user?.mobile}</td>
                          <td className="border border-gray-400 px-2 py-1">{singleFeedbackValue?.user?.email}</td>
                          <td className="border border-gray-400 px-2 py-1">{singleFeedbackValue?.description}</td>
                          <td className="border border-gray-400 px-2 py-1">{singleFeedbackValue?.subject}</td>
                        </tr>
                      </>
                    )
                  })
                ))}
              </tbody>
            </table>
          </>) : <>
            <EmptyData />
          </>}
         </div>
       </div>
     </div>
)
 }

 const tableHeaderData = [
  { id: 1, name: 'Sl.' },
  { id: 2, name: 'User Name'},
  { id: 3, name: 'Mobile'},
  { id: 4, name: 'Email'},
  { id: 5, name: 'Description'},
  { id: 6, name: 'Subject' },
 ]
export default  FeedbackreportTable
