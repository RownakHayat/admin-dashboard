import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetAllParticipateSurveyPaginationQuery } from "@/store/features/survey";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";


const SurveyDashboard = () => {
  const { data: surveyList, refetch, isLoading } = useGetAllParticipateSurveyPaginationQuery()
 

  const limitedSurveyList = surveyList?.data?.slice(0, 3) || [];


  const [openFeedBack, setOpenFeedBack] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleFeedBackDialog = (data: any) => {
    setSelectedData(data)
    setOpenFeedBack(true)
  }
  const handleActionDialog = (data: any) => {
    setSelectedData(data);
  };


  return (
    <div className="h-full mt-10 mb-0">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="text-[#767676] font-sans text-lg">
              Survey
            </h2>

            <Link href={"/admin/survey"}>
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
                    Survey Name
                  </th>
                  <th className="pl-10 text-nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                  Event Name
                  </th>
                  <th className="pl-10 text-nowrap py-2 text-left font-[10px] text-gray-600 dark:text-gray-200">
                  Survey Creation Date
                  </th>
                  
                  <th className="pl-10 text-start text-nowrap py-2 font-[10px] text-gray-600 dark:text-gray-200 pr-[1.5rem]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitedSurveyList.length > 0 ? (
                  limitedSurveyList.map((item: any) => (
                    <tr className="border-b" key={item?.id || item?.event_name}>
                      <td className="pl-6 py-2 text-wrap">{item?.survey_title}</td>
                      <td className="pl-10">{item.event_detail?.event_name}</td>
                      <td className="pl-10">{moment(item?.created_at).format('DD MMM YYYY')}</td>
                      <td className={`pl-4 pr-3 font-semibold text-sm md:text-base`}>

                      <span className="cursor-pointer">
                        <Link href={`/admin/survey/${item?.id}/participate`}>
                          <Button className="bg-[#0CB04D] rounded-lg p-2 text-white font-bold text-center">
                            Participate
                          </Button>
                        </Link>
                      </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No data available.
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

export default SurveyDashboard

