import PopOver from '@/components/common/PopOver';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { siteConfig } from '@/config/site';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie"
import useAuthStore from '@/store/zustand/auth';
import { useAppDispatch } from '@/store/useReduxStore';
import { addAuthInformation } from '@/store/features/auth';
import { useAuthUserQuery } from '@/store/features/UserManagement/User';


const Header = ({ headerData }: any) => {

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { setUser, user } = useAuthStore((state: any) => state)

  const { data: userInfo, refetch } = useAuthUserQuery()
  const menuItem = [
    {
      title: "Dashboard",
      link: "/admin"
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

  return (
    <>
      <div className="logo-content my-2 mx-2 flex items-center gap-2">
        <Link href="/admin/home" className='flex'>
          {headerData?.site_info?.site_logo ? (
            <Image
              src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerData?.site_info?.site_logo}`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-8 sm:min-h-8'
            />
          ) : (
            <Image
              src={`/assets/Image/SMEF-Logo.png`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-10 sm:min-h-10'
            />
          )}
          <p className='text-primary font-semibold sm:text-md lg:text-[28px] ml-3'>{headerData?.site_info?.site_title}</p>
        </Link>
      </div>

      <div className="logo-content my-2 mx-2 flex items-center gap-2">
        <Link href="/admin/home" className='flex'>
          {headerData?.site_info?.govt_logo ? (
            <Image
              src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerData?.site_info?.govt_logo}`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-10 sm:min-h-10'
            />
          ) : (
            <Image
              src={`/assets/Image/gov_logo.png`}
              width={60}
              height={60}
              alt=""
              className='sm:min-w-10 sm:min-h-10'
            />
          )}
        </Link>

        <div className="flex  items-center justify-center ">
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
                        src="/assets/Image/user.jpg"
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

      </div>
    </>
  )
}
export default Header