"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import Image from 'next/image';
import Link from 'next/link';

const services = [
    { icon: '📚', count: '৭০', label: 'প্রশিক্ষণ', bgColor: 'bg-blue-100', textColor: 'text-blue-500' },
    { icon: '🛠', count: '৯৭', label: 'কর্মশালা', bgColor: 'bg-red-100', textColor: 'text-red-500' },
    { icon: '❤️', count: '৪৫০', label: 'ম্যাচমেকিং', bgColor: 'bg-blue-50', textColor: 'text-blue-400' },
    { icon: '🏢', count: '৬২', label: 'মেলা', bgColor: 'bg-green-50', textColor: 'text-green-400' },
    { icon: '➕', count: '৮৪', label: 'অন্যান্য', bgColor: 'bg-green-100', textColor: 'text-green-500' },
];
const ServiceCard = () => {

    const { data: userInfo, refetch: refetchUserInfo } = useAuthUserQuery();
    return (
        // <div className=" px-4">
        //     <h2 className="text-2xl font-bold mb-6">Services</h2>
        //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        //       {services.map((service, index) => (
        //         <div
        //           key={inde x}
        //           className={`p-4 rounded-lg shadow-md ${service.bgColor} flex  items-center `}
        //         >
        //           <div className={`text-5xl mb-4 ${service.textColor}`}>{service.icon}</div>
        //           <div className={`text-4xl font-bold ${service.textColor}`}>{service.count}</div>
        //           <div className="text-lg mt-2">{service.label}</div>
        //         </div>
        //       ))}
        //     </div>

        // </div>

        <div className='bg-white rounded-lg shadow px-4 py-5'>
            {userInfo?.data?.role?.id == 3 && (
                <div className="sme-user">
                    <Link href={"/admin/user-dashboard/profile"} className='text-primary py-4 font-bold  hover:!underline hover:text-green-600'>
                        Your User ID {userInfo?.data?.user_profile?.sme_id}. Please Complete
                        Your Profile Information
                    </Link>


                    <h2 className='text-primary py-4 text-opacity-85 ...'>আসন্ন কার্যক্রমের তথ্য</h2>
                    <div className="flex flex-wrap gap-8 justify-start">
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card
                                className='bg-[#E5E4F3] flex items-center justify-center w-[250px] h-[150px]  border border-spacing-3 border-textColor'>
                                <CardContent className='flex gap-2 p-0'>
                                    <Image src="/assets/Image/Frame.png" alt='' width={60} height={60} />
                                    <div className="">
                                        <h2 className='text-[#7367F0] text-[30px]'>70</h2>
                                        <h6 className='text-textColorSecond  font-semibold text-[25px] '>প্রশিক্ষণ</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card
                                className='bg-[#F2E7E5] flex items-center justify-center w-[250px] h-[150px] border border-spacing-3 border-textColor'>
                                <CardContent className='flex gap-2 p-0'>
                                    <Image src="/assets/Image/Frame-1.png" alt='' width={60} height={60} />
                                    <div className="">
                                        <h2 className='text-[#F38871] text-[30px]'>70</h2>
                                        <h6 className='text-textColorSecond text-[25px] font-semibold'>কর্মশালা</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card
                                className='bg-[#E9EDF2] flex items-center justify-center w-[250px] h-[150px]  border border-spacing-3 border-textColor'>
                                <CardContent className='flex gap-2 p-0'>
                                    <Image src="/assets/Image/Frame2.png" alt='' width={60} height={60} />
                                    <div className="">
                                        <h2 className='text-[#3C97D9] text-[30px]'>70</h2>
                                        <h6 className='text-textColorSecond text-[25px] font-semibold'>ম্যাচমেকিং</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card
                                className='bg-[#F0F1E9] flex items-center justify-center w-[250px] h-[150px]  border border-spacing-3 border-textColor'>
                                <CardContent className='flex gap-2 p-0'>
                                    <Image src="/assets/Image/Frame3.png" alt='' width={60} height={60} />
                                    <div className="">
                                        <h2 className='text-[#ACB71C] text-[30px]'>70</h2>
                                        <h6 className='text-textColorSecond text-[25px] font-semibold'>মেলা</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card
                                className='bg-[#E9F3EF] flex items-center justify-center w-[250px] h-[150px] border border-spacing-3 border-textColor'>
                                <CardContent className='flex gap-2 p-0'>
                                    <Image src="/assets/Image/Frame4.png" alt='' width={60} height={60} />
                                    <div className="">
                                        <h2 className='text-[#0CB04D] text-[30px]'>70</h2>
                                        <h6 className='text-textColorSecond text-[25px] font-semibold'>অন্যান্য</h6>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="h-full mt-10 mb-0">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <h2 className='text-[#767676] font-sans text-lg'>Running Event</h2>
                                    <Button className='bg-[#0CB04D] text-white px-4 text-sm'>See more</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full">
                                    <table className='w-full bg-white dark:bg-background rounded-lg'>
                                        <thead className="bg-[#E7F7ED] w-full dark:bg-background rounded-lg">
                                            <tr>
                                                <th className="px-[4rem] nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Event Name</th>
                                                <th className="px-[4rem] nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Event Type</th>
                                                <th className="px-[4rem] nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Date</th>
                                                <th className="px-[4rem] nowrap py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='border-b-2'>
                                                <td>Communicationg with Association & Information Collection</td>
                                                <td>Training</td>
                                                <td>01/11/2024</td>
                                                <td>Dhaka</td>
                                            </tr>
                                            <tr className='border-b-2'>
                                                <td>Communicationg with Association & Information Collection</td>
                                                <td>Training</td>
                                                <td>01/11/2024</td>
                                                <td>Dhaka</td>
                                            </tr>
                                            <tr >
                                                <td>Communicationg with Association & Information Collection</td>
                                                <td>Training</td>
                                                <td>01/11/2024</td>
                                                <td>Dhaka</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {userInfo?.data?.role?.id != 3 && (
                <div className="services">
                    <h2 className='text-primary py-4 text-opacity-85 ...'>Services</h2>
                    <div className="grid grid-cols-12">
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="col-span-2">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width={258} height={20} className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                    </div>
                    {/* <div className="flex flex-wrap gap-8 justify-start">
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width="258" height="20" className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>প্রশিক্ষণ</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width="258" height="20" className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>কর্মশালা</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৯৭</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width="258" height="20" className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>ম্যাচমেকিং</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width="258" height="20" className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>মেলা</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                        <div className="flex-1 lg:max-w-[260px] xl:max-w-[260px] 2xl:max-w-full ">
                            <Card className='bg-[#FFFF] border border-spacing-1 border-textColor'>
                                <CardContent className='w-full px-0'>
                                    <Image src="/assets/Image/coverimage.jpg" alt='' width="258" height="20" className='rounded-t-lg' />
                                </CardContent>
                                <div className='flex justify-between px-4'>
                                    <p className='text-textColorSecond  font-semibold text-[14px] '>অন্যান্য</p>
                                    <h6 className='text-[#0C44B0] font-semibold text-[23px]' >৭০</h6>
                                </div>
                            </Card>
                        </div>
                    </div> */}
                </div>

            )}

        </div>
    )
}

export default ServiceCard