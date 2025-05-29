"use client"

import NavBar from "@/components/layout/navbar/page"
import SideBar from "@/components/layout/sidebar/page"
import { addAuthInformation } from "@/store/features/auth"
import { useGetDashboardFooterDataQuery } from "@/store/features/dashboard"
import { useAppDispatch } from "@/store/useReduxStore"
import useAuthStore from "@/store/zustand/auth"
import useLayoutStore from "@/store/zustand/layout"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import AboutPlatformPage from "./aboutPlatform/page"
import CatagoryWiseSingleEventPage from "./catagory-wise-single-event/[id]/page"
import ContactPage from "./contact/page"
import EventListPage from "./eventList/page"
import HomePage from "./home/page"
import SingleEventPage from "./single-event/[id]/page"
import PrivacyPage from "./privacyPolicy/page"


type Props = {
  children: React.ReactNode
}

const DashBoardLayout = ({ children }: Props) => {
  const { user } = useAuthStore((state: any) => state)
  const { data: dashboardFooterData, isFetching } = useGetDashboardFooterDataQuery();



   const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addAuthInformation(user))
  }, [user])


  const { collapse } = useLayoutStore((state: any) => state)

  const pathname = usePathname()

  if (pathname.includes("/admin/home")) {
    return <HomePage />
  }
  if (pathname.includes("/admin/aboutPlatform")) {
    return <AboutPlatformPage />
  }
  if (pathname.includes("/admin/contact")) {
    return <ContactPage />
  }
  if (pathname.includes("/admin/eventList")) {
    return <EventListPage />
  }
  if (pathname.includes("/admin/catagory-wise-single-event")) {
    return <CatagoryWiseSingleEventPage />
  }
  if (pathname.includes("/admin/single-event")) {
    return <SingleEventPage />
  }
  if (pathname.includes("/admin/privacyPolicy")) {
    return <PrivacyPage />
  }


  return (
    <>
      <div
        className={`transition-body fixed hidden h-screen md:block ${collapse ? "md:w-[300px]" : "md:w-[100px]"
          }`}
      >
        <SideBar />
      </div>
      <div
        className={`transition-body fixed w-full ${collapse ? "md:left-[300px]" : "md:left-[100px]"
          } ${collapse
            ? "md:h-screen md:w-[calc(100%-300px)]"
            : "md:h-screen md:w-[calc(100%-100px)]"
          }`}
      >
        <nav className="flex h-[70px] w-full items-center justify-between pl-2 pr-3">
          <NavBar />
        </nav>
        <div className="h-[calc(100vh-100px)] bg-[#ECEFF3] shadow-inner dark:bg-black md:rounded-tl-xl overflow-y-auto p-[14px] md:p-[10px] ">
          {children}
        </div>
        <footer className="z-10 shadow-2xl ">
          <div className="flex h-[35px] w-full items-center justify-end gap-3 bg-[#F3F4F6] dark:bg-background px-6 py-1 text-secondary">
            <p className="text-xs uppercase">
               {dashboardFooterData?.data?.site_info?.copy_right}
            </p>

            {/*<p className="text-xs">*/}
            {/*  Designed & Developed by*/}
            {/*  <Link*/}
            {/*    href={"https://simecsystem.com/"}*/}
            {/*    target="_blank"*/}
            {/*    className="text-blue-400 underline ml-2"*/}
            {/*  >*/}
            {/*    SIMEC System Ltd*/}
            {/*  </Link>*/}
            {/*</p>*/}
          </div>
        </footer>
      </div>
    </>
  )
}

export default DashBoardLayout
