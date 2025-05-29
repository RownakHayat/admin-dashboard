import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";

const TokenReportTable = ({ takenServiceReportData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (takenServiceReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [takenServiceReportData, setprint]);

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Taken Service Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Sl.", "User Id", "Name","Organization Name", "Gender","Phone", "Email", "Office Address", "District"]);

    takenServiceReportData?.data?.forEach((takenServiceSingleData: any, index: number) => {
      rows.push([
        index + 1,
        takenServiceSingleData?.user_profile?.sme_id,
        takenServiceSingleData?.name,
        takenServiceSingleData?.user_profile?.organization_name,
        takenServiceSingleData?.gender?.name,
        takenServiceSingleData?.mobile,
        takenServiceSingleData?.email,
        takenServiceSingleData?.user_profile?.office_address,
        takenServiceSingleData?.user_profile?.district?.name,
      ]);
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `TakenServiceReport_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Taken Service Report");
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
      <div className="" >
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
          {takenServiceReportData?.data?.length > 0 ? (<>
            <div className='text-center pb-4'>
              <h4 className='text-2xl'>Taken Service Report</h4>
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

                {takenServiceReportData?.data?.map((row: any, index: any) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.sme_id}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.organization_name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.gender?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.mobile}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.email}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.office_address}</td>
                    {/* <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.division?.name}</td> */}
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.district?.name}</td>
                    {/* <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.upzila}</td> */}
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
    name: 'User Id'
  },
  {
    id: 3,
    name: 'Name'
  },
  {
    id: 4,
    name: 'Organization Name'
  },
  {
    id: 5,
    name: 'Gender'
  },
  {
    id: 6,
    name: 'Phone'
  },
  {
    id: 7,
    name: 'Email'
  },
  {
    id: 8,
    name: 'Office Address'
  },
  // {
  //   id: 9,
  //   name: 'Division'
  // },
  {
    id: 9,
    name: 'District'
  },
  // {
  //   id: 9,
  //   name: 'Upzila'
  // },

]

export default TokenReportTable
