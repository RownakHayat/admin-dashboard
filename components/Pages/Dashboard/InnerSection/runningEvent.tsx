import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetRunningEventQuery } from "@/store/features/dashboard";
import moment from 'moment';
import Link from "next/link";
import { useState } from "react";
import {Icons} from "@/components/icons";

const RunningEventComponent = () => {

  const { data: runningEvent } = useGetRunningEventQuery()
  const [selectedData, setSelectedData] = useState<any>(null)
  const [openAction, setOpenAction] = useState(false)

  const handleActionDialog = (data: any) => {
    setSelectedData(data)
    setOpenAction(true)
  }

  const limitedEvent = runningEvent?.data?.slice(0, 3) || [];


  return (
    <div className="h-full mt-10 mb-0">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-[#767676] font-sans text-lg">Upcoming Event</h2>
            <Link href={"/admin/events/new-event-apply"}>
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
                  <th className="pl-6 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Event Type
                  </th>
                  <th className="pl-6 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="pl-6 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap">
                    Location
                  </th>
                  <th className="pl-6 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap pr-[1.5rem]">
                    Status
                  </th>
                  <th className="pl-6 py-2 text-left !text-[16px] md:text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap pr-[1.5rem]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitedEvent.length > 0 ? (
                  limitedEvent.map((item: any) => (
                    <tr className="border-b" key={item?.id ?? item?.event_name}>
                      <td className="pl-4 py-2 text-sm md:text-base text-wrap whitespace-nowrap hover:text-green-600">
                       <Link href={`/admin/events/new-event/${item?.id}/events-details`}> {item?.event_name ?? ""}</Link>
                      </td>
                      <td className="pl-6 text-sm md:text-base">{item?.activity?.name ?? ""}</td>
                      <td className="pl-6 text-sm md:text-base">
                        {item?.start_date ? moment(item?.start_date).format('DD MMM YYYY') : ""}
                      </td>
                      <td className="pl-6 text-sm md:text-base">{item?.venue ?? ""}</td>
                      <td className={`pl-4 pr-2 font-semibold text-sm md:text-base
                          ${item?.event_status == 3 ? "text-green-500" : ""}
                          ${item?.event_status == 4 ? "text-green-500" : ""}
                          ${item?.event_status == 5 ? "text-red-500" : ""}`}>
                        {item?.event_status == 1
                          ? "Pending"
                          : item?.event_status == 2
                            ? "Form Generated "
                            : item?.event_status == 3
                            ? "Published "
                            : item?.event_status == 4
                            ? "Completed "
                            : item?.event_status == 5
                            ? "Closed "
                            : item?.event_status == 6
                            ? "Postponed "
                            : item?.event_status == 7
                            ? "Cancelled"
                              : ""}
                      </td>

                      <td>
                        <div className="flex justify-left items-center">
                            <span className="mr-3 text-black">
                                <Link href={`/admin/events/new-event/${item?.id}/events-details`}>
                                    <Icons.view />
                                </Link>
                            </span>
                          <span className="cursor-pointer">
                                <Link href={`/admin/events/new-event-apply/${item?.id}/apply-event`}>
                                    <p  className="bg-[#00CFE8] rounded-lg px-3 py-2 text-white">
                                        Apply
                                    </p>
                                </Link>
                            </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No Running Event Available.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunningEventComponent;
