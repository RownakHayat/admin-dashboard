import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";

const ReportTable = ({ paymentReportData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (paymentReportData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [paymentReportData, setprint]);

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Payment Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];

    rows.push(["Sl.", "User Id", "Name", "Gender", "Phone", "Email", "Organization Name", "District", "Amount", "Payment Method"]);

    paymentReportData?.data?.forEach((paymentSingleData: any, index:number) => {
      rows.push([
        index + 1,
        paymentSingleData?.user?.user_profile?.user_id,
        paymentSingleData?.user?.name,
        paymentSingleData?.user?.gender?.name,
        paymentSingleData?.user?.mobile,
        paymentSingleData?.user?.email,
        paymentSingleData?.user?.user_profile?.organization_name,
        paymentSingleData?.user?.user_profile?.district?.name,
        paymentSingleData?.amount,
        paymentSingleData?.payment_by,
      ]);
    });
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `PaymentReport_${formattedDate}_${formattedTime}.xlsx`;
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Report");
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
      <div className="grid grid-cols-12 gap-4 mt-5" >
        <div className="col-span-12">
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
            {paymentReportData?.data?.length > 0 ? (<>
              <div className='text-center pb-4'>
                <h4 className='text-2xl'>Payment Report</h4>
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

                  {paymentReportData?.data?.map((row: any, index: any) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.user_id}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.gender?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.organization_name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.user?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.amount}</td>
                      <td className="border border-gray-400 px-2 py-1">{row?.payment_by}</td>
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
    name: 'Gender'
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
    name: 'Organization Name'
  },
  {
    id: 8,
    name: 'District'
  },
  {
    id: 9,
    name: 'Amount'
  },
  {
    id: 10,
    name: 'Payment Method'
  },

]

export default ReportTable
