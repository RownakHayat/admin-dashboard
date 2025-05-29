import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetEventFairSalesQuery } from "@/store/features/events/fairSales";
import Link from "next/link";
import EventFairSaleView from "../../Events/FairSales/view/fairSaleView";
import moment from "moment";


const FairSalesTableComponent = () => {


  const { data: fairSale, refetch } = useGetEventFairSalesQuery()

  const limitedFairSale = fairSale?.data?.slice(0, 3) || [];


  return (
    <div className="h-full mt-10 mb-0">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="text-[#767676] font-sans text-lg">
              Fair Sales
            </h2>

            <Link href={"/admin/events/fair-sales"}>
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
                    Amount
                  </th>
                  <th className="pl-4 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitedFairSale.length > 0 ? (
                  limitedFairSale.map((item: any) => (
                    <tr className="border-b" key={item?.id || item?.event_name}>
                      <td className="pl-6 py-2 text-sm md:text-base">{item?.event_detail?.event_name}</td>

                      <td className="pl-6 py-2 text-sm md:text-base">{item?.event_detail?.venue}</td>
                      <td className="pl-6 py-2 text-sm md:text-base">{moment(item?.event_detail?.start_date).format('D-MM-YYYY')}</td>
                      <td className="pl-6 py-2 text-sm md:text-base">{moment(item?.event_detail?.end_date).format('D-MM-YYYY')}</td>
                      <td className="pl-6 py-2 text-sm md:text-base">{item?.fair_sale}</td>
                      <td className="py-3">
                        <EventFairSaleView id={item?.event_detail_id} viewData={item} refetch={refetch} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No Fair Sales data available.
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

export default FairSalesTableComponent