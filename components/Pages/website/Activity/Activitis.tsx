"use client"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const Activitis = () => {
    return (
        <>
            <div className='bg-white rounded-lg shadow px-4 py-5'>
                <h2 className='py-4 text-[22px] text-primary text-opacity-85 ...'>আসন্ন কার্যক্রমের তথ্য</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 rounded-lg">
                    {[
                        { bgColor: 'bg-[#E5E4F3]', textColor: 'text-[#7367F0]', label: 'প্রশিক্ষণ', imgSrc: '/assets/Image/Frame.png', count: '50' },
                        { bgColor: 'bg-[#F2E7E5]', textColor: 'text-[#F38871]', label: 'কর্মশালা', imgSrc: '/assets/Image/Frame-1.png', count: '60' },
                        { bgColor: 'bg-[#E9EDF2]', textColor: 'text-[#3C97D9]', label: 'ম্যাচমেকিং', imgSrc: '/assets/Image/Frame2.png', count: '70' },
                        { bgColor: 'bg-[#F0F1E9]', textColor: 'text-[#ACB71C]', label: 'মেলা', imgSrc: '/assets/Image/Frame3.png', count: '80' },
                        { bgColor: 'bg-[#E9F3EF]', textColor: 'text-[#0CB04D]', label: 'অন্যান্য', imgSrc: '/assets/Image/onnanno.png', count: '90' }
                    ].map((activity, index) => (
                        <div key={index} className="flex justify-center items-center">
                            <Card className={`${activity.bgColor} flex items-center justify-center w-[225px] h-[150px] border border-spacing-3 border-textColor`}>
                                <CardContent className='text-center gap-2 p-0'>
                                    <Image src={activity.imgSrc} alt='' width={70} height={70} className='object-cover' />
                                    <div>
                                        <h2 className={`${activity.textColor} text-[26px]`}>{activity.count}</h2>
                                        <h6 className='text-textColorSecond font-semibold text-[21px]'>{activity.label}</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className='bg-white rounded-lg shadow px-4 py-5'>
                <h2 className='text-primary py-4 text-[22px]'>আসন্ন কার্যক্রমের তথ্য</h2>
                <div className="grid grid-cols-12 gap-x-10 sm:gap-[20px] md:gap-[20px]  xl:gap-[20px] 2xl:gap-[117px] rounded-lg  ">
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 2xl:col-span-2 ">
                        <Card className='bg-[#E5E4F3] flex items-center justify-center w-[225px] h-[150px]  border border-spacing-3 border-textColor'>
                            <CardContent className='flex gap-2 p-0'>
                                <Image src="/assets/Image/Frame.png" alt='' width={70} height={70} className='object-cover' />
                                <div className="">
                                    <h2 className='text-[#7367F0] text-[26px]'>70</h2>
                                    <h6 className='text-textColorSecond  font-semibold text-[21px] '>প্রশিক্ষণ</h6>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 2xl:col-span-2 2xl:gap-x-32">
                        <Card className='bg-[#F2E7E5] flex items-center justify-center w-[225px] h-[150px] border border-spacing-3 border-textColor'>
                            <CardContent className='flex gap-2 p-0'>
                                <Image src="/assets/Image/Frame-1.png" alt='' width={70} height={70} className='object-cover' />
                                <div className="">
                                    <h2 className='text-[#F38871] text-[26px]'>70</h2>
                                    <h6 className='text-textColorSecond text-[21px] font-semibold'>কর্মশালা</h6>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 2xl:col-span-2 2xl:gap-x-32">
                        <Card className='bg-[#E9EDF2] flex items-center justify-center w-[225px] h-[150px]  border border-spacing-3 border-textColor'>
                            <CardContent className='flex gap-2 p-0'>
                                <Image src="/assets/Image/Frame2.png" alt='' width={70} height={70} className='object-cover' />
                                <div className="">
                                    <h2 className='text-[#3C97D9] text-[26px]'>70</h2>
                                    <h6 className='text-textColorSecond text-[21px] font-semibold'>ম্যাচমেকিং</h6>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 2xl:col-span-2 2xl:gap-x-32">
                        <Card className='bg-[#F0F1E9] flex items-center justify-center w-[225px] h-[150px]  border border-spacing-3 border-textColor'>
                            <CardContent className='flex gap-2 p-0'>
                                <Image src="/assets/Image/Frame3.png" alt='' width={70} height={70} className='object-cover' />
                                <div className="">
                                    <h2 className='text-[#ACB71C] text-[26px]'>70</h2>
                                    <h6 className='text-textColorSecond text-[21px] font-semibold'>মেলা</h6>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 2xl:col-span-2 2xl:gap-x-32">
                        <Card className='bg-[#E9F3EF] flex items-center justify-center w-[225px] h-[150px] border border-spacing-3 border-textColor'>
                            <CardContent className='flex gap-2 p-0'>
                                <Image src="/assets/Image/onnanno.png" alt='' width={70} height={70} className='object-cover' />
                                <div className="">
                                    <h2 className='text-[#0CB04D] text-[26px]'>70</h2>
                                    <h6 className='text-textColorSecond text-[21px] font-semibold'>অন্যান্য</h6>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>  */}
        </>
    )
}

export default Activitis