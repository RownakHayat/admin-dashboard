import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import UserListByIndustrySectorCluster from "./UserListByInfo";

const UserListByReportComponent = ({ userListByIndustryClusterSectorData }: any) => {

  const [print, setprint] = useState(false)

  useEffect(() => {
    if (userListByIndustryClusterSectorData?.data?.length > 0) {
      setprint(true)
    } else {
      setprint(false)
    }
  }, [userListByIndustryClusterSectorData, setprint]);


  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "SME User List by Industry, Sector, Cluster",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleDownloadExcel = () => {
    const rows = [];
    rows.push(["Sl.", "SME Id", "Name", "Mobile", "Email", "District",]);

    userListByIndustryClusterSectorData?.data?.forEach((userLogData: any, index: number) => {
      rows.push([
        index + 1,
        userLogData?.user_profile?.sme_id,
        userLogData?.name,
        userLogData?.mobile,
        userLogData?.email,
        userLogData?.user_profile?.district?.name,
      ]);
    });
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `SMEUserListByIndustrySectorCluster_${formattedDate}_${formattedTime}.xlsx`;
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SME User List");
    XLSX.writeFile(workbook, fileName);
  };


  return (
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

      <div ref={componentRef}>
        <div className='text-center pb-4'>
          <h2 className='text-2xl pt-5'>SME Foundation</h2>
          <h4 className='text-2xl pt-5'>SME User List by Industry, Sector, Cluster </h4>
        </div>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 text-center">
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Sl.</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">SME Id</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Name</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Mobile</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Email</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">District</th>
              <th rowSpan={3} className="border border-gray-400 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody className=''>
            {userListByIndustryClusterSectorData?.data?.map((userListByData: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">{userListByData?.user_profile?.sme_id}</td>
                  <td className="border border-gray-400 px-2 py-1">{userListByData?.name}</td>
                  <td className="border border-gray-400 px-2 py-1">{userListByData?.mobile}</td>
                  <td className="border border-gray-400 px-2 py-1">{userListByData?.email}</td>
                  <td className="border border-gray-400 px-2 py-1">{userListByData?.user_profile?.district?.name}</td>
                  <td className="border border-gray-400 px-2 py-1">
                    <div className="flex flex-wrap items-center justify-center">
                      <div className="my-2 ml-2" >
                        <Link href={`/admin/user-management/users/user-view/${userListByData.id}`} target="_blank">
                          <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                            Profile
                          </Button>
                        </Link>
                      </div>
                      <div className="my-2 ml-2">
                        <Dialog>
                          <DialogTrigger >
                            <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                              Event Information
                            </Button>
                          </DialogTrigger>
                          <DialogContent >
                            <h1 className="text-center font-bold text-[20px]">Participate Event Names</h1>
                            <UserListByIndustrySectorCluster userListByData={userListByData} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default UserListByReportComponent