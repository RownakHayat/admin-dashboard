import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, MoveUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import "./newsFeed.style.css"
import { useGetAllLinkableInformationQuery } from '@/store/features/portalManagement/linkableInfo'
import { siteConfig } from '@/config/site'

const NewsFeed = () => {
  const { data: linkableInfo, error, isLoading } = useGetAllLinkableInformationQuery();


  return (
    <div className='w-full py-10'>
      <div className="grid grid-cols-12 col-span-2 gap-6">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-6">
          <div className="border-b-2 border-[#0C44B0]">
            <Button
              className='bg-[#0C44B0] rounded-t-md rounded-b-none font-sans sm:text-sm lg:text-[18px] font-thin text-opacity-90 ...'>
              ফেসবুক ফিড
            </Button>
          </div>
          <div className="py-6 facebook_feed">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSME.Foundation.bd&tabs=timeline&width=940&height=500&small_header=true&width_cover=true&hide_cover=true&show_facepile=true&appId"
              width="940"
              height="350"
              style={{ border: 'none', }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen={true}
              className="w-full"
            />
          </div>


        </div>
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-6">
          <div className="border-b-2 border-[#0C44B0] flex justify-between">
            <Button
              className='bg-[#0C44B0] rounded-t-md rounded-b-none font-sans sm:text-sm lg:text-[18px] font-thin text-opacity-90 ...'>প্রয়োজনীয়
              তথ্যাবলী</Button>
            {/* <Button
                className='bg-[#0C44B0] rounded-t-md rounded-b-none font-sans text-[18px] font-thin text-opacity-90 ...'>সব
              দেখুন
              <ChevronRight/>
            </Button> */}
          </div>
          {linkableInfo?.data?.length > 0 && (
          <div className="py-6">
            <Card className='bg-[#AAE1FF] p-6'>
              <div className="grid grid-cols-12">
                <div className="col-span-12 grid grid-cols-12 gap-6">


                  {linkableInfo?.data?.map((item: any, index: number) => (
                    index < 10 ? (
                      item.link ? (
                        <div key={item.id} className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6">
                          <Link href={item.link} target="_blank" rel="noopener noreferrer">
                            <Button
                              className='w-full bg-[#FFFFFF] text-[#000000] flex justify-start gap-3 hover:bg-[#EAE8FD] duration-300 transform hover:-translate-2 card_box text-[16px]'>
                              <Image
                                src={
                                  item?.link_icon
                                    ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.link_icon}`
                                    : "/assets/Image/coverImage.png"
                                }
                                alt=''
                                width='25'
                                height={20}
                              />
                              <span>{item.title}</span>
                              <span>
                                <MoveUpRight className="arrow_icon float-right bottom-1 text-xs text-[#2B51B2]" />
                              </span>
                            </Button>
                          </Link>
                        </div>
                      ) : null
                    ) : null
                  ))}
                </div>
              </div>
            </Card>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsFeed