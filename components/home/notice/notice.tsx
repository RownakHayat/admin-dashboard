import { Button } from '@/components/ui/button';
import { useGetAllNoticeQuery } from '@/store/features/portalManagement/notices';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {Suspense} from "react";
import Spinner from "@/components/common/Spinner/Spinner";

const Notice = () => {
  const { data: noticeList, error, isLoading } = useGetAllNoticeQuery();
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  if (isLoading) return <div><Suspense fallback={<Spinner/>}></Suspense></div>;

  if (error) {
    return <div>Error loading notices</div>;
  }
  return (
    <div>
      <div className="mb-1"
      // style={{ height: "10rem" }}
      >
        <div className="flex justify-between py-4 items-center">
          <h3 className='text-primary text-[22px]'>ফেসবুক পোস্ট</h3>
          <Button className=' text-gray-500 border border-gray-500'>View All</Button>
        </div>
        <div className=' space-y-3'>
          <Link href="https://www.facebook.com/photo?fbid=876688654500863&set=pcb.876688887834173" target="_blank" className='hover:text-green-600'>*** বরিশাল জেলায় SMART Product Photography কর্মশালা ***</Link>
          {noticeList?.data?.map((notice: any) => (
            <Link key={notice.id} href={`/notice/${notice.id}`} className="flex justify-between">
              <span>{notice.title}</span>
              <ArrowUpRight className="text-gray-500" />
            </Link>
          ))}
          {/* <Link href="" className='flex justify-between'>
            <span>এসএমই ফাউন্ডেশনের ত্রৈমাসিক (বর্ষ ১৪, সংখ্যা ৪৫, জানুয়ারি-মার্চ ২০২৪) নিউজ লেটার ছাপা...</span>
            <ArrowUpRight className='text-gray-500' />
          </Link>
          <Link href="" className='flex justify-between'>
            <span>এসএমই ফাউন্ডেশনের ত্রৈমাসিক (বর্ষ ১৪, সংখ্যা ৪৫, জানুয়ারি-মার্চ ২০২৪) নিউজ লেটার ছাপা...</span>
            <ArrowUpRight className='text-gray-500' />
          </Link>
          <Link href="" className='flex justify-between'>
            <span>এসএমই ফাউন্ডেশনের ত্রৈমাসিক (বর্ষ ১৪, সংখ্যা ৪৫, জানুয়ারি-মার্চ ২০২৪) নিউজ লেটার ছাপা...</span>
            <ArrowUpRight className='text-gray-500' />
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default Notice