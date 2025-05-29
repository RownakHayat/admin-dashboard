import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";

const ReportTable = ({ reportData }: any) => {

  const [print, setPrint] = useState(false)

  useEffect(() => {
    if (reportData?.data?.length > 0) {
      setPrint(true)
    } else {
      setPrint(false)
    }
  }, [reportData, setPrint]);

  const handleDownloadExcel = () => {
    const rows = [];

    rows.push(["Sl.", "Picture", "User Id", "Name(English)", "Name(Bangla)", "Gender", "Phone", "Email", "Organization Name", "Office address", "District", "Year Of Establishment", "Total Manpower"]);

    reportData?.data?.forEach((smeUserListByYearSingleData: any, index: number) => {
      rows.push([
        index + 1,
        <Image
          className='rounded-3xl'
          priority={true}
          src={smeUserListByYearSingleData?.user_profile?.profile_image_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${smeUserListByYearSingleData?.user_profile?.profile_image_path}` : "/assets/Image/no-photo.jpg"}
          alt="Logo"
          width={120}
          height={120}
        />,
        smeUserListByYearSingleData?.user_profile?.sme_id || "",
        smeUserListByYearSingleData?.name || "",
        smeUserListByYearSingleData?.name_bn || "",
        smeUserListByYearSingleData?.gender?.name || "",
        smeUserListByYearSingleData?.mobile,
        smeUserListByYearSingleData?.email,
        smeUserListByYearSingleData?.user_profile?.organization_name,
        smeUserListByYearSingleData?.user_profile?.office_address,
        smeUserListByYearSingleData?.user_profile?.district?.name,
        smeUserListByYearSingleData?.user_profile?.year_of_establishment,
        Number(smeUserListByYearSingleData?.user_profile?.permanent_male_workers) +
        Number(smeUserListByYearSingleData?.user_profile?.permanent_female_workers) +
        Number(smeUserListByYearSingleData?.user_profile?.permanent_third_gender_workers) +
        Number(smeUserListByYearSingleData?.user_profile?.temporary_male_workers) +
        Number(smeUserListByYearSingleData?.user_profile?.temporary_female_workers) +
        Number(smeUserListByYearSingleData?.user_profile?.temporary_third_gender_workers)
      ]);
    });
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `SMEUserListByYear_${formattedDate}_${formattedTime}.xlsx`;
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SME User List By Year");
    XLSX.writeFile(workbook, fileName);
  };


  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "SME User List By Year",
    onAfterPrint: () => console.log("Print Success"),
  })

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
      <div className="">

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
          {reportData?.data?.length > 0 ? (<>
            <div className='text-center pb-4'>
              <div className='text-center pb-4'>
                <h4 className='text-2xl '>SME User List by Year Report</h4>
                <h2 className='text-xl '>SME Foundation</h2>
              </div>
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

                {reportData?.data?.map((row: any, index: any) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-1">
                      <Image
                        className='rounded-3xl'
                        priority={true}
                        src={row?.user_profile?.profile_image_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${row?.user_profile?.profile_image_path}` : "/assets/Image/no-photo.jpg"}
                        alt="Logo"
                        width={120}
                        height={120}
                      />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.sme_id}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.name_bn}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.gender?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.mobile}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.email}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.organization_name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.office_address}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.district?.name}</td>
                    <td className="border border-gray-400 px-2 py-1">{row?.user_profile?.year_of_establishment}</td>
                    <td className="border border-gray-400 px-2 py-1">
                      {
                        Number(row?.user_profile?.permanent_male_workers) +
                        Number(row?.user_profile?.permanent_female_workers) +
                        Number(row?.user_profile?.permanent_third_gender_workers) +
                        Number(row?.user_profile?.temporary_male_workers) +
                        Number(row?.user_profile?.temporary_female_workers) +
                        Number(row?.user_profile?.temporary_third_gender_workers)
                      }
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
    name: 'Picture'
  },
  {
    id: 3,
    name: 'User Id'
  },
  {
    id: 4,
    name: 'Name(English)'
  },
  {
    id: 5,
    name: 'Name(Bangla)'
  },
  {
    id: 6,
    name: 'Gender'
  },
  {
    id: 7,
    name: 'Phone'
  },
  {
    id: 8,
    name: 'Email'
  },
  {
    id: 9,
    name: 'Organization Name'
  },
  {
    id: 10,
    name: 'Office address'
  },
  {
    id: 11,
    name: 'District'
  },
  {
    id: 12,
    name: 'Year Of Establishment'
  },
  {
    id: 13,
    name: 'Total Manpower'
  },

]

export default ReportTable
