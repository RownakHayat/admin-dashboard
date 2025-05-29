/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/classnames-order */
"use client"

import { useAppDispatch } from "@/store/useReduxStore"
import useAuthStore from "@/store/zustand/auth"
import useLayoutStore from "@/store/zustand/layout"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Sidebar as Sidebars } from "react-pro-sidebar"

import { Icons } from "@/components/icons"
import { useUserRolePermissionListQuery } from "@/store/features/SecurityManagement/CreateRole"
import { addUserPermissions } from "@/store/features/auth"
import { useGetEventSurveyCountQuery } from "@/store/features/dashboard"
import { useEffect, useMemo, useState } from "react"
import ListItem from "../sidebar/ListItem"
import SubListItem from "../sidebar/SubListItem"

type Props = {}

const CollapseSidebar = (props: Props) => {
  const { collapse } = useLayoutStore((state: any) => state)

  const { setUser, user } = useAuthStore((state: any) => state)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: rolePermissionList } = useUserRolePermissionListQuery();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { data: eventSurveyCountData } = useGetEventSurveyCountQuery();
  const eventCount = eventSurveyCountData?.data?.runningEventCount != undefined ? eventSurveyCountData?.data?.runningEventCount : 0
  const surveyCount = eventSurveyCountData?.data?.runningSurveyCount != undefined ? eventSurveyCountData?.data?.runningSurveyCount : 0

  const handleSubMenuClick = (path: string) => {
    setOpenSubMenu(path === openSubMenu ? null : path);
  };

  const permissionList = useMemo(() => {
    const allRoles = rolePermissionList?.data;
    const permissions: any = [];
    allRoles?.map((role: any) => {
      role?.module?.map((module: any) => {
        if (!permissions?.includes(module.name)) {
          permissions.push(module.name);
        }
        if (module.sub_module) {
          module?.sub_module?.map((subModule: any) => {
            if (!permissions.includes(subModule.name)) {
              permissions.push(subModule.name);
            }
            if (subModule.permission) {
              subModule?.permission?.map((subModulePermission: any) => {
                if (!permissions.includes(subModulePermission.name)) {
                  permissions.push(subModulePermission.name);
                }
              });
            }
          });
        }
      });
    });
    return permissions;
  }, [rolePermissionList]);

  useEffect(() => {
    dispatch(addUserPermissions(permissionList));
  }, [permissionList]);

  return (
    <>
      <div className="flex h-[80px] items-center justify-center border-b gap-4">
        <Link href={"/admin"}>
          <Image
            priority={true}
            src="/assets/Image/gov_logo.png"
            alt="Logo"
            width={collapse ? 60 : 50}
            height={collapse ? 80 : 67}
            className="mb-5"
          />
        </Link>
        <Link href={"/admin"}>
          <Image
            priority={true}
            src="/assets/Image/SMEF-Logo.png"
            alt="SMEF Logo"
            width={collapse ? 80 : 50}
            height={collapse ? 80 : 50}
            className="mb-5"
          />
        </Link>
      </div>
      <div className="mt-6 relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Sidebars
          width={`${collapse ? "300" : "20"}`}
          style={{ height: "calc(100vh - 250px)" }}
        >
          <Menu
            style={{
              marginLeft: ".5rem",
              marginRight: ".5rem",
            }}
          >
            {permissionList?.includes("dashboard") && (
              <ListItem
                dataSource={{
                  name: "Dashboard",
                  path: "/admin",
                  // color: "#7367F0",
                  icon: <Icons.dashboardIcon className="text-white " />,

                }}
              />
            )}
            {permissionList?.includes("configuration") && (
                <SubListItem
                    dataSource={{
                      name: "Configuration",
                      icon: <Icons.configurationIcon className="text-white " />,
                      // color: "#fff",
                      path: "/admin/configuration",
                      child: [
                        {
                          name: "User Type",
                          path: "/admin/configuration/user-type",
                          key: "user_type",
                        },
                        {
                          name: "Wing/Section",
                          path: "/admin/configuration/wing",
                          key: "wing_section",
                        },
                        /*       {
                          name: "Designation",
                          path: "/admin/configuration/designation",
                          key: "designation",
                        },*/
                        {
                          name: "Document",
                          path: "/admin/configuration/document",
                          key: "document",
                        },
                        {
                          name: "Educational Qualification",
                          path: "/admin/configuration/educational-qualification",
                          key: "educational_qualification",
                        },
                        {
                          name: "Business Type",
                          path: "/admin/configuration/business-type",
                          key: "business_type",
                        },
                        {
                          name: "Organization Type",
                          path: "/admin/configuration/organization-type",
                          key: "organization_type",
                        },
                        {
                          name: "Division",
                          path: "/admin/configuration/division",
                          key: "division",
                        },
                        {
                          name: "District",
                          path: "/admin/configuration/district",
                          key: "district",
                        },
                        {
                          name: "Upazila",
                          path: "/admin/configuration/upazila",
                          key: "upazila",
                        },
                        {
                          name: "Cluster",
                          path: "/admin/configuration/cluster",
                          key: "cluster",
                        },
                        {
                          name: "Industrial Sector",
                          path: "/admin/configuration/industrial-sector",
                          key: "industrial_sector",
                        },
                        {
                          name: "Occupation Type",
                          path: "/admin/configuration/occupation-type",
                          key: "occupation_type",
                        },
                        {
                          name: "Gender",
                          path: "/admin/configuration/gender",
                          key: "gender",
                        },
                        {
                          name: "Budget Item",
                          path: "/admin/configuration/budget-item",
                          key: "budget_item",
                        },
                        {
                          name: "Financial Year",
                          path: "/admin/configuration/financial-year",
                          key: "financial_year",
                        },
                        /*        {
                          name: "Payment Type",
                          path: "/admin/configuration/payment-type",
                          key: "payment_type",
                        },*/
                        {
                          name: "Organizer",
                          path: "/admin/configuration/organizer",
                          key: "organizer",
                        },
                        {
                          name: "Stall Type",
                          path: "/admin/configuration/stall-type",
                          key: "stall_type",
                        },
                        {
                          name: "SME Category",
                          path: "/admin/configuration/SME-category",
                          key: "sme_category",
                        },
                        // {
                        //   name: "Activity Category",
                        //   path: "/admin/configuration/activity-category",
                        //   key: "activity_categories",
                        // },
                        {
                          name: "Helpdesk Category",
                          path: "/admin/configuration/helpdesk-category",
                          key: "activity_categories",
                        },
                        {
                          name: "Activity Types",
                          path: "/admin/configuration/activities",
                          key: "activities",
                        },
                        {
                          name: "Configure Helpdesk",
                          path: "/admin/configuration/chatbot",
                          key: "chat_topics_list",
                        },
                        {
                          name: "Report Header & Footer",
                          path: "/admin/configuration/report-header-footer",
                          key: "chat_topics_list",
                        },
                      ]?.filter((module: any) =>
                          permissionList?.includes(module.key)
                      ),
                    }}
                />
            )}
            {permissionList?.includes("user_management") && (
              <SubListItem
                dataSource={{
                  name: "User Management",
                  icon: <Icons.securityUser className="text-black " />,
                  // color: "#fff",
                  path: "/admin/user-management",
                  child: [
                    {
                      name: "Role",
                      path: "/admin/user-management/role",
                      key: "role",
                    },
                    {
                      name: "Users",
                      path: "/admin/user-management/users",
                      key: "users",
                    },
                    {
                      name: "SMEF Official",
                      path: "/admin/user-management/staff-users",
                      key: "staff_users",
                    },
                  ]?.filter((module: any) =>
                    permissionList?.includes(module.key)
                  ),
                }}
              />
            )}

            {permissionList?.includes("event_management") && (
                <SubListItem
                    dataSource={{
                      name: "Event Management",
                      icon: <Icons.logIcon className="text-white " />,
                      // color: "#fff",
                      path: "/admin/event-management",
                      child: [
                        {
                          name: "Program List",
                          path: "/admin/event-management/new-program",
                          key: "new_program",
                        },
                        {
                          name: `Event List`,
                          path: "/admin/event-management/new-event",
                          key: "new_event",
                        },
                        {
                          name: "Budget Spent",
                          path: "/admin/event-management/budget-spent",
                          key: "budget_spent",
                        },
                        {
                          name: "Attendance",
                          path: "/admin/event-management/attendance",
                          key: "attendance",
                        },
                        {
                          name: "Fair Sales",
                          path: "/admin/event-management/fair-sales",
                          key: "fair_sales",
                        },
                      ]?.filter((module: any) =>
                          permissionList?.includes(module.key)
                      ),
                    }}
                />
            )}
            {/*{permissionList?.includes("events") && (*/}
            {/*  <SubListItem*/}
            {/*    dataSource={{*/}
            {/*      name: "Events",*/}
            {/*      icon: <Icons.logIcon className="text-white " />,*/}
            {/*      // color: "#fff",*/}
            {/*      path: "/admin/events",*/}
            {/*      child: [*/}
            {/*        {*/}
            {/*          name: "New Event Apply",*/}
            {/*          path: "/admin/events/new-event-apply",*/}
            {/*          key: "",*/}
            {/*        },*/}
            {/*        // {*/}
            {/*        //   name: "Attendance",*/}
            {/*        //   path: "/admin/events/attendance",*/}
            {/*        //   key: "",*/}
            {/*        // },*/}
            {/*        // {*/}
            {/*        //   name: "Fair Sales",*/}
            {/*        //   path: "/admin/events/fair-sales",*/}
            {/*        //   key: "",*/}
            {/*        // },*/}
            {/*      ],*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}

            {permissionList?.includes("events") && (
                <ListItem
                    dataSource={{
                      name: `Events (${eventCount})`,
                      path: "/admin/events",
                      // color: "#7367F0",,
                      icon: <Icons.logIcon className="text-white " />,
                    }}
                />
            )}
            {permissionList?.includes("payment_management") && (
              <SubListItem
                dataSource={{
                  name: "Payment Management",
                  icon: <Icons.paymentIcon className="text-black " />,
                  // color: "",
                  path: "/admin/payment-management",
                  child: [
                    {
                      name: "Payment List",
                      path: "/admin/payment-management/payment-list",
                      key: "applied_user",
                    },
                  ]?.filter((module: any) =>
                    permissionList?.includes(module.key)
                  ),
                }}
              />
            )}
            {permissionList?.includes("payment") && (
              <ListItem
                dataSource={{
                  name: "Payment",
                  path: "/admin/payment",
                  // color: "#7367F0",,
                  icon: <Icons.paymentIcon className="text-white " />,
                }}
              />
            )}
            {permissionList?.includes("survey_management") && (
              <SubListItem
                dataSource={{
                  name: "Survey Management",
                  icon: <Icons.survey className="text-white " />,
                  // color: "#fff",
                  path: "/admin/survey-management",
                  child: [
                    {
                      name:`Survey List`,
                      path: "/admin/survey-management/survey-list",
                      key: "",
                    },
                  ],
                }}
              />
            )}
            {permissionList?.includes("portal_management") && (
              <SubListItem
                dataSource={{
                  name: "Portal Management",
                  icon: <Icons.logIcon className="text-black " />,
                  // color: "",
                  path: "/admin/portal-management",
                  child: [
                    // {
                    //   name: "Header Social Link",
                    //   path: "/admin/portal-management/header-social-link",
                    //   key: "slider",
                    // },
                    {
                      name: "Slider",
                      path: "/admin/portal-management/slider",
                      key: "slider",
                    },
                    {
                      name: "Slide Setting",
                      path: "/admin/portal-management/slide-setting",
                      key: "slider",
                    },
                    {
                      name: "Notice",
                      path: "/admin/portal-management/notice",
                      key: "notice",
                    },
                    {
                      name: "News",
                      path: "/admin/portal-management/news",
                      key: "news",
                    },
                  ]?.filter((module: any) =>
                    permissionList?.includes(module.key)
                  ),
                }}
              />
            )}
            {/* {permissionList?.includes("user_log_management") && (
              <ListItem
                dataSource={{
                  name: "User Log managment",
                  path: "/admin/user-log-management",
                  // color: "#7367F0",,
                  icon: <Icons.paymentIcon className="text-white " />,
                }}
              />
            )} */}
            {permissionList?.includes("survey") && (
              <ListItem
                dataSource={{
                  name: `Survey (${surveyCount})`,
                  path: "/admin/survey",
                  // color: "#7367F0",
                  icon: <Icons.survey className="text-white " />,
                }}
              />
            )}
            {/* {permissionList?.includes("feedback") && (
              <ListItem
                dataSource={{
                  name: "Feedback",
                  path: "/admin/feedback",
                  // color: "#7367F0",
                  icon: <Icons.feedbackIcon className="text-white " />,
                }}
              />
            )} */}
            {permissionList?.includes("feedback_management") && (
              <ListItem
                dataSource={{
                  name: "Feedback Management",
                  path: "/admin/feedback-management",
                  // color: "#7367F0",
                  icon: <Icons.feedbackIcon className="text-white " />,
                }}
              />
            )}
            {/* {permissionList?.includes("feedback") && (
              <ListItem
                dataSource={{
                  name: "Help Desk",
                  path: "/admin/help-desk",
                  // color: "#7367F0",
                  icon: <Icons.message className="text-white " />,
                }}
              />
            )} */}
            {permissionList?.includes("help_desk_management") && (
              <ListItem
                dataSource={{
                  name: (
                    <span className=" flex justify-between gap-2">
                      Help Desk
                    </span>
                  ),
                  path: "/admin/help-desk",
                  // color: "#7367F0",
                  icon: <Icons.sidebarMessage className="text-white " />,
                }}
              />
            )}
             {permissionList?.includes("report_management") && (
                <SubListItem
                    dataSource={{
                      name: "Reports",
                      icon: <Icons.logIcon className="text-black " />,
                      path: "/admin/report",
                      child: [
                        {
                          name: "Progress Report",
                          path: "/admin/report/progress-report",
                          key: "status_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "Implementation Status",
                          path: "/admin/report/isr-status-report",
                          key: "status_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "Payment Report",
                          path: "/admin/report/payment-report",
                          key: "financial_year_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "SME User List",
                          path: "/admin/report/sme-user-list-by-fiscal-year",
                          key: "status_report",//  Note : change this permission key accoding to backend devs
                        },
                        // {
                        //   name: "Summary Report",
                        //   path: "/admin/report/summary-report",
                        //   key: "status_report",//  Note : change this permission key accoding to backend devs
                        // },
                        {
                          name: "Token Service Report",
                          path: "/admin/report/taken-service-report",
                          key: "financial_year_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "Program List Report",
                          path: "/admin/report/program-list-report",
                          key: "status_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "Feedback Report",
                          path: "/admin/report/feedback-report",
                          key: "status_report",//  Note : change this permission key accoding to backend devs
                        },
                        {
                          name: "Fair Sale Report",
                          path: "/admin/report/fair-sale-report",
                          key: "financial_year_report",//  Note : change this permission key accoding to backend devs
                        },



                        // {
                        //   name: "Financial Year Report",
                        //   path: "/admin/report/fiscalyear-report",
                        //   key: "financial_year_report",
                        // },
                        // {
                        //   name: "Status Report",
                        //   path: "/admin/report/status-report",
                        //   key: "status_report",
                        // },
                        // {
                        //   name: "Event Organized",
                        //   path: "/admin/report/event-organized",
                        //   key: "event_organized_report",
                        // },
                        // {
                        //   name: "Activity Performed",
                        //   path: "/admin/report/activity-performed",
                        //   key: "activity_performed_report",
                        // },

                      ].filter((module) => permissionList?.includes(module.key)),
                    }}
                />
            )}

            {permissionList?.includes("setting_management") && (
              <ListItem
                dataSource={{
                  name: "Setting",
                  path: "/admin/setting",
                  // color: "#7367F0",
                  icon: <Icons.menuSettingIcon />,
                }}
              />
            )}
          </Menu>
        </Sidebars>

      </div>
    </>
  )
}

export default CollapseSidebar
