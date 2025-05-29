
import { useChatBotSetting } from '@/components/common/hooks/chatBotSetting';
import { ScrollArea } from '@/components/ui/scroll-area';
import { siteConfig } from '@/config/site';
import { useGetAllActivityCategoryQuery } from '@/store/features/configuration/activityCategory';
import { useGetAllStaffConversationUserQuery } from '@/store/features/helpDesk';
import { useAuthUserQuery } from '@/store/features/UserManagement/User';
import Image from 'next/image';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const Sidebar = () => {

  const { data: allActivityCategory, refetch } = useGetAllActivityCategoryQuery();
  const { data: allStaffConvUser } = useGetAllStaffConversationUserQuery();
  const { data: userInfo } = useAuthUserQuery();

  const [activeItem, setActiveItem] = useState<number | null>(null);

  const { changeUserId } = useChatBotSetting()

  const selectStaff = (data: any) => {

    changeUserId(data?.activity_category?.id, data?.user_id);
    setActiveItem(data?.id);
    refetch();

  }

  const selectCategory = (data: any) => {

    changeUserId(data?.id, null);
    setActiveItem(data?.id);
    refetch();

  }


  return (
    <div className="bg-white rounded shadow p-0.5 mb-0 overflow-y-scroll max-h-[90vh] custom-scrollbar chat_user_scroll">
      <InfiniteScroll
        pageStart={0}
        loadMore={() => { }}
      >
        <div className="bg-[#F5F3Fa]">
          <div className="px-1 py-1 rounded">
            {/* <SearchChange /> */}
          </div>
          <ScrollArea className="w-full rounded">
            <div className="py-2 px-2 divide-y-2 divide-blue-200">
              {
                userInfo?.data?.role?.id == 3 ? <>
                  {
                    allActivityCategory?.data?.map((category: any, index: any) => {

                      return (
                        <>
                          <div key={category?.id} className={`p-4 rounded cursor-pointer ${activeItem === category?.id ? 'bg-[#a7a8aa] text-white' : 'hover:bg-[#EBE8F9]'
                            }`} onClick={() => selectCategory(category)} >
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex gap-2 items-center">
                                <div className="">
                                  <Image
                                    className='rounded-3xl'
                                    priority={true}
                                    src={category?.banner ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${category?.banner}` : "/assets/images/big-screenlogo.png"}
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <div className="">
                                    <h1 className={`text-sm text-wrap break-words font-bold hidden sm:contents`}>{category?.name}</h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })
                  }
                </> : <>
                  {
                    allStaffConvUser?.data?.data?.map((convUser: any, index: any) => {

                      return (
                        <>
                          <div key={convUser?.id} className={`p-4 rounded cursor-pointer ${activeItem === convUser?.id ? 'bg-[#a7a8aa] text-white' : 'hover:bg-[#EBE8F9]'
                            }`}
                            onClick={() => selectStaff(convUser)}
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex gap-2 items-center">
                                <div className="">
                                  <Image
                                    className='rounded-3xl'
                                    priority={true}
                                    src={convUser?.user?.user_profile?.profile_image_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${convUser?.user?.user_profile?.profile_image_path}` : "/assets/Image/no-photo.jpg"}
                                    alt="Logo"
                                    width="50"
                                    height="50"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <div className="">
                                    <h1 className={`text-sm text-nowrap font-bold`}>{convUser?.user?.name}</h1>
                                    <p className='text-xs'>{convUser?.activity_category?.name}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })
                  }
                </>
              }
            </div>
          </ScrollArea>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Sidebar;
