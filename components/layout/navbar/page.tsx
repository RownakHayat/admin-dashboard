import Breadcrumb from "@/components/common/Breadcrumb"
import PopOver from "@/components/common/PopOver"
import useDeviceSize from "@/components/common/hooks/useDeviceSize"
import { Icons } from "@/components/icons"
import NotificationBell from "@/components/ui/Notification"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { useAuthUserQuery } from "@/store/features/UserManagement/User"
import { addAuthInformation } from "@/store/features/auth"
import { useAppDispatch } from "@/store/useReduxStore"
import useAuthStore from "@/store/zustand/auth"
import useLayoutStore from "@/store/zustand/layout"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import CollapseSidebar from "../collapseSidebar/page"

type Props = {}

const formSchema = z.object({
  search: z.string().min(6, { message: "This field is required" }),
})

const NavBar = (props: Props) => {
  const { collapse, collapseToggle } = useLayoutStore((state: any) => state);
  const [screenSize] = useDeviceSize()
  const { setUser, user } = useAuthStore((state: any) => state)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: userInfo, refetch } = useAuthUserQuery()

  const menuItem = [
    {
      title: "Home",
      link: "/admin/home"
    },
    {
      title: "Manage Profile",
      link: userInfo?.data?.user_role_id !== 3 ? "/admin/user-dashboard/admin-profile" : "/admin/user-dashboard/profile"
    },

    {
      title: "Change Password",
      link: "/admin/user-dashboard/change-password"
    },
  ]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {

  }

  const pathName = usePathname()
  const modifiedUrl = pathName.replace(/\/\d+(?=(\/|$))/, "");

  const generateBreadcrumbs = () => {
    const pathSegments = modifiedUrl.split("/").filter((segment) => segment !== "")
    const crumbs = pathSegments.map((segment, index) => {
      const title = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      const slug = `/${pathSegments.slice(0, index + 1).join("/")}`
      return { title, slug }
    })
    return crumbs
  }

  const handleMenuClick = (link: string) => {
    router.push(link);
  };

  const handleLogout = () => {
    Cookies.remove("token")
    Cookies.remove("email")
    setUser({})
    dispatch(addAuthInformation({ user: {} }))
    router.push("/")
    window.location.reload();
  }

  useEffect(() => {
    if (user?.id) {
      refetch()
    }
  }, [user])

  useEffect(() => {
    if (userInfo && userInfo?.data?.status !== 1) {
      handleLogout();
    }
  }, [userInfo])

  const popupcontent = (
    <div>
      <div className="my-1 w-full">
        {menuItem?.map((menu, idx: number) => (
          <Link href={menu?.link} className="w-full" key={idx}>
            <p className="border-b-[1px] hover:border-b-[1px] hover:bg-[#206c6b] hover:text-[#ffffff] py-2  p-2 transition"
              key={idx}
              onClick={() => handleMenuClick(menu?.link)}
            >{menu?.title}
            </p>
          </Link>
        ))}

        <Link href="#" className="w-full" onClick={handleLogout}>
          <p className="hover:border-b-[1px] hover:bg-[#206c6b] hover:text-[#ffffff] py-2  p-2 transition">Logout</p>
        </Link>
      </div>
    </div>
  )

  const crumbs = generateBreadcrumbs()?.splice(1, 5)

  const fallbackImageUrl = "/assets/Image/SMEF-Logo.png";

  const imageUrl = userInfo?.data?.user_profile?.profile_image_path
    ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userInfo?.data?.user_profile?.profile_image_path}`
    : fallbackImageUrl;

  return (
    <>
      <div>
        {screenSize?.width >= 766 ? (
          <div className="flex items-center gap-10">
            <span onClick={collapseToggle}>
              {!collapse ? <Icons.menubarRight className="cursor-pointer" /> : <Icons.menubar className="cursor-pointer" />}
            </span>
            <span>
               <Breadcrumb slug={crumbs} hideBreadcrumb={pathName === '/admin'} />
            </span>
          </div>
        ) : (
          <Sheet>
            <SheetTrigger>
              <Icons.menubar className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left">
              <CollapseSidebar />

            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="flex  items-center justify-center ">
        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="relative">
                <FormInput name="search" placeholder="Search here" />
                <span className="absolute top-2 right-3">
                  <Search />
                </span>
              </div>
            </div>
          </form>
        </Form> */}
        <div className="pr-4 mr-2">
          <NotificationBell />
        </div>
        <PopOver
          trigger={
            <Avatar className="cursor-pointer h-[60px] w-full rounded-lg bg-[#E7F7ED] py-1 pr-2 border-b-none border-t border-x border-[#BAE8CD]">

              <div className="flex items-center justify-center">

                <div className="text-right w-full m-0 auto ">
                  <h1 className="font-[400] text-nowrap text-[#565656]">{userInfo?.data?.name}</h1>

                  {userInfo?.data?.user_role_id === 3 && (
                      <h1 className="font-bold text-[#565656]">
                        User ID: <span className="text-red-500">{userInfo?.data?.user_profile?.sme_id ?? ''}</span>
                      </h1>
                  )}

                  {userInfo?.data?.user_role_id !== 3 && (
                      <p className="text-[12px] font-[400] text-[#7b7b7b]">{userInfo?.data?.role?.name}</p>
                  )}
                </div>

                <AvatarFallback
                    className="bg-white rounded-[50%] p-1 w-[75px] h-[45px] flex items-center justify-center overflow-hidden">
                {userInfo?.data?.user_profile?.profile_image_path ? (
                    <img
                      src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userInfo?.data?.user_profile?.profile_image_path}`}
                      alt=""
                      width={30}
                      height={30}
                      className="w-[200px] h-[48px] object-cover max-w-[200px]"
                    />
                  ) : (

                    <Image
                      src="/assets/Image/imag-demo-user.png"
                      alt="Reload"
                      width={30}
                      height={30}
                      className="w-[200px] h-[48px] object-cover"
                    />
                  )}
                </AvatarFallback>
                <ChevronDown />
              </div>
            </Avatar>
          }
          content={popupcontent}
        />
        <div className="text-left ">
          <p>{userInfo?.data?.first_name}</p>
          <p className="">{userInfo?.data?.office?.office_name}</p>
        </div>
      </div>
    </>
  )
}

export default NavBar
