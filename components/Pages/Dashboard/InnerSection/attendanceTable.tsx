import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetNewEventQuery } from "@/store/features/dashboard";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";

const AttendanceTableComponent = () => {

  const { data: attendance } = useGetNewEventQuery()

  const [selectedData, setSelectedData] = useState<any>(null)
  const [openAction, setOpenAction] = useState(false)

  const handleActionDialog = (data: any) => {
    setSelectedData(data)
    setOpenAction(true)
  }

  const limitedAttendance = attendance?.data?.slice(0, 3) || [];

  return (
    <div className="h-full mt-10 mb-0">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="text-[#767676] font-sans text-lg">
            Attendance
            </h2>

            <Link href={"/admin/events/attendance"}>
              <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                See more
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full bg-white dark:bg-background rounded-lg">
              <thead className="bg-[#E7F7ED] dark:bg-background rounded-lg">
                <tr>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Event Name
                  </th>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Venue
                  </th>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    End Date
                  </th>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Application Deadline
                  </th>
                  {/* <th className="pl-10 text-nowrap py-2  font-[10px] text-gray-600 dark:text-gray-200">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {limitedAttendance.length > 0 ? (
                  limitedAttendance.map((item: any) => (
                    <tr className="border-b" key={item?.id || item?.event_name}>
                      <td className="pl-4 py-2 text-sm md:text-base text-wrap whitespace-nowrap">
                        {item?.event_name}
                      </td>
                      <td className="pl-6 text-sm md:text-base">{item?.venue}</td>
                      <td className="pl-6 text-sm md:text-base">{moment(item?.start_date).format('D-MM-YYYY')}</td>
                      <td className="pl-6 text-sm md:text-base">{moment(item?.end_date).format('D-MM-YYYY')}</td>
                      <td className="pl-6 text-sm md:text-base">{moment(item?.dead_line).format('D-MM-YYYY')}</td>
                      {/* <td className="pl-6 text-sm md:text-base">
                        <div className="flex justify-center items-center cursor-pointer py-2">
                          <Icons.qrCode onClick={() => handleActionDialog(item)} />
                          <QrAttendance
                            open={openAction}
                            setOpen={setOpenAction}
                            id={selectedData?.id}
                            rowData={selectedData}
                          />
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No attendance data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendanceTableComponent