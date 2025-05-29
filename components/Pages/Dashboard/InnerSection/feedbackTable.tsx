import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetFeedbackListPaginationQuery } from "@/store/features/feedback";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import UpdateFeedBack from "../../Feedback/UpdateFeedBack/UpdateFeedback";



const FeedbackTableComponent = () => {
  const { data: feedback, refetch, isLoading } = useGetFeedbackListPaginationQuery()

  const limitedFeedback = feedback?.data?.slice(0, 3) || [];


  const [openFeedBack, setOpenFeedBack] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleFeedBackDialog = (data: any) => {
    setSelectedData(data)
    setOpenFeedBack(true)
  }


  return (
    <div className="h-full mt-10 mb-0">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="text-[#767676] font-sans text-lg">
              Feedback
            </h2>

            <Link href={"/admin/feedback"}>
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
                  <th className=" pl-[1.5rem] nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                    Event Name
                  </th>
                  <th className="pl-2 text-nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                    Activity
                  </th>
                  <th className="pl-6 text-nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                    Start Date
                  </th>
                  <th className="pl-6 text-nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                    End Date
                  </th>
                  <th className="text-nowrap py-2 text-ecnter font-[10px] text-gray-600 dark:text-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitedFeedback.length > 0 ? (
                  limitedFeedback.map((item: any) => (
                    <tr className="border-b" key={item?.id || item?.event_name}>
                      <td className="pl-6 py-2 text-wrap">{item?.event_detail?.event_name}</td>
                      <td className="pl-6">{item?.event_detail?.activity?.name}</td>
                      <td className="pl-6">{moment(item?.event_detail?.start_date).format('D-MM-YYYY')}</td>
                      <td className="pl-6">{moment(item?.event_detail?.end_date).format('D-MM-YYYY')}</td>
                      <td className="text-end py-3">
                        <div className='flex justify-center items-center'>
                          <Avatar className="cursor-pointer w-24 rounded-lg bg-green-600">
                            <h1 className="font-medium text-[#ffffff] text-nowrap w-24 py-2 px-4 " onClick={() => handleFeedBackDialog(item)}>
                              {item?.event_detail?.feedback.length > 0 ? "Update" : "Add"} +
                            </h1>
                          </Avatar>
                          <UpdateFeedBack open={openFeedBack} setOpen={setOpenFeedBack} id={selectedData?.id} rowData={selectedData} />
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No Feedback data available.
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

export default FeedbackTableComponent