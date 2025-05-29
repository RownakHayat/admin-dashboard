"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActivitiesInImplementation from "./InnerSection/ActivitiesImplementation";
import BudgetSummary from "./InnerSection/BudgetSummary";
import "./style.dashboard.css";

import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetAllDivisionQuery } from "@/store/features/configuration/division";
import { useGetDivisionEventListViewQuery, useGetServicesSMEUserQuery } from "@/store/features/dashboard";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProgramProgress from "./InnerSection/ProgramProgres";

import FormContainer from "@/components/common/Form/FormContainer";
import { FormAutoCompleteForReport } from "@/components/common/FormForReport/FormAutoCompleteForReport";
import { siteConfig } from "@/config/site";
import { useAllRunningEventQuery, useGetSingleServicesCardQuery } from "@/store/features/home";
import { useUserRolePermissionListQuery } from "@/store/features/SecurityManagement/CreateRole";
import moment from "moment";
import CategoryEvent from "./InnerSection/categoryEvent/categoryEvent";
import MapSelect from "./InnerSection/MapEvent/MapSelect";
import RunningEventComponent from "./InnerSection/runningEvent";
import SurveyDashboard from "./InnerSection/survey";

export const signInSchema = z.object({
  division_id: z.string().min(1, { message: "This field is required" }),
});
interface Service {
  event_details?: {
    event_feature_attachment?: {
      attach_file_path?: string;
    };
  };
  activity_types: Array<{
    id: number;
    name: string;
    category_wise_total_event_count?: number;
  }>;
  name_bn?: string;
  id: string;
  banner: string;
  category_wise_total_event_count?: number;
}

interface DistrictDetails {
  name: string;
  lat: number;
  lon: number;
  GEO_CODE: string;
}

interface Event {
  event_name: string;
  venue: string;
  activity_id: string;
  event_application_count: number;
}

interface DivisionEventList {
  districtDetails: {
    [districtId: string]: {
      districtDetails: DistrictDetails;
      "0": Event[];
    };
  };
}
interface DashboardPageProps {
  onChange?: (value: string | null) => void;
  value?: string;
  data?: any;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onChange, value, data, ...props }) => {

  const [districtMapValue, setDistrictMapValue] = useState<DistrictDetails | null>(null);
  const [hoverState, setHoverState] = useState<DistrictDetails | null>(null);
  // const { data: servises } = useGetServicesCardQuery();
  const [id, setId] = useState<string | null>(null);
  const { data: servises } = useGetSingleServicesCardQuery(id, { skip: id === null || id === undefined });
  const { data: allFinancialYearHome } = useGetSingleServicesCardQuery(id);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      division_id: "",
    },
  });

  const defaultFinancialYearStatus = allFinancialYearHome?.data?.find((item: any) => item?.status === 1)?.id?.toString() || "0";

  useEffect(() => {
    const storedId = localStorage.getItem('selectedId');
    if (storedId) {
      setId(storedId);
    } else {
      setId(defaultFinancialYearStatus);
    }
  }, [defaultFinancialYearStatus]);

  const { handleSubmit, control } = form;
  const { data: userInfo, refetch: refetchUserInfo } = useAuthUserQuery();
  const { data: divisionList } = useGetAllDivisionQuery();

  const [districtData, setDistrictData] = useState<{ districtDetails: DistrictDetails; "0": Event[] }[] | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);
  const [divisionEventList, setDivisionEventList] = useState<DivisionEventList | null>(null);
  const { data: allEventsData } = useAllRunningEventQuery({})
  const { data: seMoreConditionData } = useUserRolePermissionListQuery();

  const { data: fetchedDivisionEventList } = useGetDivisionEventListViewQuery(
    selectedDivision ? { id: selectedDivision } : undefined,
    // {
    //   skip: selectedDivision === null,
    // }
  );

  const { data: servicesSMEUserList } = useGetServicesSMEUserQuery()



  const handleDivisionChange = (value: string | null) => {

    if (value) {
      setSelectedDivision(Number(value));
    } else {
      setSelectedDivision(null);
      setDistrictData(null);
      setEvents([]);
    }
  };

  useEffect(() => {
    if (form.watch('division_id') != 'selectAll') {
      setSelectedDivision(Number(form.watch('division_id')));
    } else {
      setSelectedDivision(null);
      setDistrictData(null);
      setEvents([]);
    }

  }, [form.watch('division_id')])


  useEffect(() => {
    setSelectedDivision(null);
  }, []);

  useEffect(() => {
    if (fetchedDivisionEventList) {
      setDivisionEventList(fetchedDivisionEventList.data || null);
    }
  }, [fetchedDivisionEventList]);

  useEffect(() => {
    if (divisionEventList && divisionEventList.districtDetails) {
      const allDistrictData = Object.values(
        divisionEventList.districtDetails
      ).map((district) => ({
        districtDetails: district.districtDetails,
        "0": district["0"],
      }));

      setDistrictData(allDistrictData);
    }
  }, [divisionEventList]);

  useEffect(() => {
    if (districtMapValue) {
      setHoverState(districtMapValue);
      setDistrictMapValue(districtMapValue);
    }
  }, []);

  const seeMoreFunc = (seeMoreData: any) => {
    return seeMoreData?.data
      ?.reduce((acc: any, role: any) => {
        return acc.concat(role?.module ?? []);
      }, [])
      .reduce((acc: any, module: any) => {
        return acc.concat(module?.sub_module ?? []);
      }, [])
      .reduce((acc: any, subModule: any) => {
        return acc.concat(subModule?.permission ?? []);
      }, [])
      .find((perm: any) => perm?.name === "new_event_list");
  };
  const seeMoreResult = seeMoreFunc(seMoreConditionData);


  return (
    <main className="p-6 bg-[#F9FAF9] rounded-lg">
      {userInfo?.data?.role?.id === 1 && (
        <div className="">
          <h2 className="text-[24px]  font-normal text-[#545454] text-opacity-85 ">
            Services
          </h2>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {servises?.data.map((service: any, index: number) => {

              return (
                <div key={service?.id || index} className="p-2">
                  <Card className="bg-[#FFFF] w-full h-[200px] border border-spacing-1 border-[#EEEFEF]">
                    <CardContent className="w-full h-full p-0">
                      <div className="h-[75%] w-full flex justify-center">
                        {/* <Image
                          src={
                            service?.banner
                              ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${service.banner}`
                              : "/assets/Image/coverImage.png"
                          }
                          alt={service?.name_bn || "No image available"}
                          width={100}
                          height={100}
                          className="rounded-t-lg sm:w-full h-full max-w-[150px] pt-2"
                        /> */}
                        <Image
                          src={
                            service?.banner
                              ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${service?.banner}`
                              : ""
                          }
                          alt={service?.name_bn || "No image available"}
                          width={120}
                          height={120}
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-1 lg:py-3">
                        <p className="text-textColorSecond font-semibold text-[18px]">
                          {service?.name_bn}
                        </p>
                        <h6 className="text-[#0C44B0] font-semibold text-[23px]">
                          {service?.count}
                        </h6>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 grid-rows-1 gap-4">
            <div className="col-span-1 md:col-span-12 lg:col-span-6">
              {/* <ProgramProgressChart /> */}
              <ProgramProgress />
            </div>
            <div className="col-span-1 md:col-span-12 lg:col-span-6 bg-white rounded-lg shadow-md overflow-hidden p-4 pb-2">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-xl font-normal text-[#767676] mb-4">
                  Active Events
                </div>
                <div className="text-sm font-bold text-gray-800 mb-4">
                  <div className="gap-0">
                    {/* <FormAutoCompleteOnChange
                      name="division_id"
                      singleListName="division"
                      data={listArrayDaynamicModify(
                        divisionList?.data,
                        "division",
                        "name"
                      )}
                      label=""
                      placeholder="Select division"
                      control={control}
                      onChange={handleDivisionChange}
                    /> */}
                    <FormContainer form={form}>
                      <FormAutoCompleteForReport
                        name="division_id"
                        singleListName="division"
                        placeholder="Select division"
                        control={form.control}
                        data={listArrayDaynamicModify(
                          divisionList?.data,
                          "division",
                          "name"
                        )}
                        staticOptions={[
                          { value: "selectAll", label: "Select All" },
                        ]}
                        isDisabled={false}

                      />
                    </FormContainer>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 md:col-span-8">
                  <MapSelect districtData={districtData} />
                </div>

                <div className="col-span-12 md:col-span-4 ">
                  <div className="overflow-y-scroll h-[30vh] sm:h-[30vh] md:h-[55vh] lg:h-[40vh] xl:h-[40vh] 2xl:h-[40vh]">
                    {divisionEventList?.districtDetails &&
                      Object.keys(divisionEventList.districtDetails).map((districtId) => {
                        const districtData = divisionEventList.districtDetails[districtId];
                        const districtDetails = districtData?.districtDetails;
                        const events = districtData?.["0"];

                        if (districtDetails) {
                          return (
                            <div key={districtId}>
                              <h4 className="text-[16px]">
                                District Name: <br />
                                <span className="font-bold">{districtDetails.name}</span>
                              </h4>
                              {events?.map((event, index) => (
                                <div key={index}>
                                  <h4 className="mt-2">
                                    Event Name: <br />
                                    <span className="font-bold">{event.event_name}</span>
                                  </h4>
                                  <p className="mt-2">Venue: <br />
                                    <span className="font-bold">{event.venue}</span>
                                  </p>
                                  <p className="mt-2">
                                    Event Application Count: <br />{event.event_application_count}
                                  </p>
                                  <hr className="my-3" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12  gap-4">
            <div className="col-span-12 xl:col-span-6">
              <BudgetSummary />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <ActivitiesInImplementation />
            </div>
          </div>
        </div>
      )}

      {userInfo?.data?.role?.id === 2 && (
        <div className="space-y-4">
          <div className=" services">
            <h2 className="text-primary py-4 text-opacity-85 ...">Services</h2>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {servises?.data.map((service: any, index: number) => {
                return (
                  <div key={service?.id || index} className="p-2">
                    <Card className="bg-[#FFFF] w-full h-[200px] border border-spacing-1 border-[#EEEFEF]">
                      <CardContent className="w-full h-full p-0">
                        <div className="h-[75%] w-full flex justify-center">
                          <Image
                            src={
                              service?.banner
                                ? `${siteConfig?.envConfig[
                                  `${process.env.APP_ENV}`
                                ]?.IMAGE_URL
                                }${service.banner}`
                                : "/assets/Image/coverImage.png"
                            }
                            alt={service?.name_bn || "No image available"}
                            width={100}
                            height={100}
                            className="rounded-t-lg sm:w-full h-full max-w-[150px] pt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between px-4 py-1 lg:py-3">
                          <p className="text-textColorSecond font-semibold text-[18px]">
                            {service?.name_bn}
                          </p>
                          <h6 className="text-[#0C44B0] font-semibold text-[23px]">
                            {service?.count}
                          </h6>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-full mt-10 mb-0">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <h2 className="text-[#767676] font-sans text-lg">
                    Running Activities
                  </h2>

                  {seeMoreResult ? (
                    <Link
                      href={"/admin/event-management/new-event"}
                      className="text-purple-700 font-bold text-lg hover:underline hover:text-purple-900"
                      target="_blank"
                    >
                      <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                        <p>See more</p>
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={"/website/eventList"}
                      className="text-purple-700 font-bold text-lg hover:underline hover:text-purple-900"
                      target="_blank"
                    >
                      <Button className="bg-[#0CB04D] text-white px-4 text-sm">
                        <p>See more</p>
                      </Button>
                    </Link>
                  )}

                </div>
              </CardHeader>
              <CardContent className="sm:w-full lg:w-full overflow-auto md:overflow-visible z-1">
                <div className="w-full overflow-x-auto">

                  <table className="w-full bg-white dark:bg-background rounded-lg">
                    <thead className="bg-[#E7F7ED] w-full dark:bg-background rounded-lg">
                      <tr>
                        <th className="text-nowrap py-2 text-left w-[26%] font-[10px] text-gray-600 dark:text-gray-200">Event Name</th>
                        <th className="pr-24 pl-18 text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Event Type</th>
                        <th className="pr-24 pl-18 text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Date</th>
                        <th className="pr-[4rem] pl-[1.5rem] text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Deadline</th>
                        <th className=" pl-18 text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Venue</th>
                        <th className="pr-[4rem] text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Fee</th>
                        <th className="pr-[4rem] text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Program Name</th>
                        <th className="pr-[4rem] text-nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Wing Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEventsData?.data?.slice(0, 5).map((item: any) => {
                        return (
                          <tr className="border-b" key={item?.id}>
                            {/*<td className="text-wrap pr-10 hover:text-green-600"><Link href={`/admin/events/new-event/${item?.id}/events-details`}>{item?.event_name}</Link></td>*/}
                            <td className="text-wrap pr-10 hover:text-green-600"><Link href={`/admin/event-management/new-event/${item?.id}/event-details`}>{item?.event_name}</Link></td>
                            <td className="pl-18 pr-5">{item?.activity?.name}</td>
                            <td className="pl-0 text-left text-wrap ">
                              <p className="">{item?.start_date ? moment(item?.start_date).format('DD-MM-YYYY') : ""}</p>
                              <p className="pl-[40px]">-</p>
                              <p>{item?.end_date ? moment(item?.start_date).format('DD-MM-YYYY') : ""}</p>
                            </td>
                            <td className="pl-[20px] ">{item?.start_date ? moment(item?.dead_line).format('DD-MM-YYYY') : ""}</td>
                            <td className="pl-18 pr-24">{item?.venue}</td>
                            <td className="text-wrap">{item?.event_entry_fee}</td>
                            <td className="text-wrap">{item?.program_info?.name_en}</td>
                            <td className="pl-18 text-wrap">{item?.program_info?.wing?.name}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden p-4">
              <BudgetSummary />
            </div>
            <div className="col-span-1 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden p-4">
              <ActivitiesInImplementation />
            </div>
          </div>
        </div>
      )}

      {userInfo?.data?.role?.id === 3 && (
        <div className="space-y-4">
          <div className="sme-user">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-md">
              <div
                className="bg-gradient-to-r from-green-200 via-purple-100 to-red-200 border-2 border-purple-300 rounded-lg p-4">
                <p className="text-gray-700 font-bold text-xl">
                  Your User ID:
                  <span
                    className="ml-2 bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-md border border-red-300 shadow-sm">
                    {userInfo?.data?.user_profile?.sme_id ?? 'N/A'}
                  </span>
                </p>
              </div>
              <div className="flex items-center p-4 border-2 border-purple-300 bg-purple-50 rounded-lg">
                <Link
                  href={"/admin/user-dashboard/profile"}
                  className="text-purple-700 font-bold text-lg hover:underline hover:text-purple-900"
                >
                  <p>Please Complete Your Profile Information</p>
                </Link>
                <span
                  className={`font-bold px-2 py-1 rounded-md ${userInfo?.data?.profile_percentage < 50
                    ? "bg-red-100 text-red-600 border border-red-300"
                    : userInfo?.data?.profile_percentage < 75
                      ? "bg-yellow-100 text-yellow-600 border border-yellow-300"
                      : "bg-green-100 text-green-600 border border-green-300"
                    }`}
                >
                  ({userInfo?.data?.profile_percentage ?? 0}%)
                </span>
              </div>
            </div>


            <h2 className="text-primary py-4 text-opacity-85 ...">
              {/* চলমান কার্যক্রমের তথ্য */}
              Information on ongoing activities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {servicesSMEUserList?.data?.map((serviceSMEUser: any, index: number) =>
                serviceSMEUser ? (
                  <CategoryEvent
                    serviceSMEUser={serviceSMEUser}
                    index={index}
                    className="col-span-1"
                  />
                ) : null
              )}
            </div>

            <RunningEventComponent />
            {/* <AttendanceTableComponent />
            <FairSalesTableComponent />
            <FeedbackTableComponent />
            <AppliedEventDashboard /> */}
            <SurveyDashboard />
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
