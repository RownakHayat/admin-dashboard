import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";

const ReportTable = ({ fairSaleReportData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (fairSaleReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [fairSaleReportData, setprint]);

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Fair Sale Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Sl.", "Name", "User Id", "Mobile", "Program Name", "Event Name", "Fair Sale"]);

    fairSaleReportData?.data?.forEach((fairSaleSingleData: any, index: number) => {
      rows.push([
        index + 1,
        fairSaleSingleData?.user?.name,
        fairSaleSingleData?.user_id,
        fairSaleSingleData?.user?.mobile,
        fairSaleSingleData?.event_detail?.program_info?.name_en,
        fairSaleSingleData?.event_detail?.event_name,
        fairSaleSingleData?.fair_sale,
      ]);
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `FairSaleReport_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fair Sale Report");
    XLSX.writeFile(workbook, fileName);
  };

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
      <div>
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
          {fairSaleReportData?.data?.length > 0 ? (<>
            <div className='text-center pb-4'>
              <h4 className='text-2xl'>Fair Sale Report</h4>
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

                {fairSaleReportData?.data?.map((row: any, index: any) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.sme_id}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user?.mobile}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.event_detail?.program_info?.name_en}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.event_detail?.event_name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.fair_sale}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </>) : <>
            <EmptyData />
          </>}
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
    name: 'Name'
  },
  {
    id: 3,
    name: 'User Id'
  },
  {
    id: 4,
    name: 'Mobile'
  },
  {
    id: 5,
    name: 'Program Name'
  },
  {
    id: 6,
    name: 'Event Name'
  },
  {
    id: 7,
    name: 'Fair Sale'
  },

]

export default ReportTable
