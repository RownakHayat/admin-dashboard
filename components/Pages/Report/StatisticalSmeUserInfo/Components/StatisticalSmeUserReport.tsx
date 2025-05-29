import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import * as XLSX from "xlsx"

const StatisticalSMEUserReport = ({ statisticalSMEUserData }: any) => {
  const [print, setPrint] = useState(false);

  useEffect(() => {
    const hasData = [
      statisticalSMEUserData?.data?.cottage,
      statisticalSMEUserData?.data?.large_manufacturing,
      statisticalSMEUserData?.data?.large_service,
      statisticalSMEUserData?.data?.medium_manufacturing,
      statisticalSMEUserData?.data?.medium_service,
      statisticalSMEUserData?.data?.micro_manufacturing,
      statisticalSMEUserData?.data?.micro_service,
      statisticalSMEUserData?.data?.small_manufacturing,
      statisticalSMEUserData?.data?.small_service,
    ].some(array => array?.length > 0);

    setPrint(hasData);
  }, [statisticalSMEUserData]);

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Statistical SME User Info",
    onAfterPrint: () => console.log("Print Success"),
  });

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Category", "Sl.", "Name", "Mobile", "Email", "Cluster", "District"]);

    const processArrayData = (title: any, arrayData: any) => {
      arrayData?.forEach((userData: any, index: number) => {
        rows.push([
          title,
          index + 1,
          userData?.name || "-",
          userData?.mobile || "-",
          userData?.email || "-",
          userData?.user_profile?.cluster?.name || "-",
          userData?.user_profile?.district?.name || "-",
        ]);
      });
    };

    processArrayData("Cottage", statisticalSMEUserData?.data?.cottage);
    processArrayData("Large Manufacturing", statisticalSMEUserData?.data?.large_manufacturing);
    processArrayData("Large Service", statisticalSMEUserData?.data?.large_service);
    processArrayData("Medium Manufacturing", statisticalSMEUserData?.data?.medium_manufacturing);
    processArrayData("Medium Service", statisticalSMEUserData?.data?.medium_service);
    processArrayData("Micro Manufacturing", statisticalSMEUserData?.data?.micro_manufacturing);
    processArrayData("Micro Service", statisticalSMEUserData?.data?.micro_service);
    processArrayData("Small Manufacturing", statisticalSMEUserData?.data?.small_manufacturing);
    processArrayData("Small Service", statisticalSMEUserData?.data?.small_service);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `StatisticalSMEUserInfo_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistical SME User Info");
    XLSX.writeFile(workbook, fileName);

  };

  return (
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
      <div className="" ref={componentRef}>
        <div className='text-center pb-4'>
          <h2 className='text-2xl pt-5'>SME Foundation</h2>
        </div>

        {statisticalSMEUserData?.data?.cottage?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl '>Cottage </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.cottage?.map((cottageData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{cottageData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{cottageData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{cottageData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{cottageData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{cottageData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${cottageData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}


        {statisticalSMEUserData?.data?.large_manufacturing?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Large Manufacturing </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.large_manufacturing?.map((largeManufacturingData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeManufacturingData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeManufacturingData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeManufacturingData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeManufacturingData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeManufacturingData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${largeManufacturingData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.large_service?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Large Service </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.large_service?.map((largeServiceData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeServiceData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeServiceData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeServiceData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeServiceData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{largeServiceData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${largeServiceData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.medium_manufacturing?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Medium Manufacturing </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.medium_manufacturing?.map((mediumManufacturingData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumManufacturingData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumManufacturingData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumManufacturingData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumManufacturingData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumManufacturingData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${mediumManufacturingData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.medium_service?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Medium Service </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.medium_service?.map((mediumServiceData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumServiceData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumServiceData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumServiceData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumServiceData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{mediumServiceData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${mediumServiceData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.micro_manufacturing?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Micro Manufacturing </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.micro_manufacturing?.map((microManufacturingData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{microManufacturingData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{microManufacturingData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{microManufacturingData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{microManufacturingData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{microManufacturingData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${microManufacturingData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.micro_service?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl mt-8'>Micro Service </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.micro_service?.map((microServiceData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{microServiceData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{microServiceData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{microServiceData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{microServiceData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{microServiceData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${microServiceData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.small_manufacturing?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl '>Small Manufacturing </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.small_manufacturing?.map((smallManufacturingData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallManufacturingData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallManufacturingData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallManufacturingData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallManufacturingData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallManufacturingData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${smallManufacturingData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

        {statisticalSMEUserData?.data?.small_service?.length > 0 ? (
          <div>
            <div className='text-center pb-4'>
              <h4 className='text-2xl '>Small Service </h4>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Cluster</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
                  <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {statisticalSMEUserData?.data?.small_service?.map((smallServiceData: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallServiceData?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallServiceData?.mobile}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallServiceData?.email}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallServiceData?.user_profile?.cluster?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">{smallServiceData?.user_profile?.district?.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Link href={`/admin/user-management/users/user-view/${smallServiceData.id}`}>
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (<div></div>)}

      </div>
    </div>
  )
}

export default StatisticalSMEUserReport