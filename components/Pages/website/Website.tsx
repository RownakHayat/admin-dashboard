"use client";

import FormContainer from '@/components/common/Form/FormContainer';
import { FormAutoCompleteForReportHome } from '@/components/common/FormForReport/FormAutoCompleteForHome';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import NewsFeed from '@/components/home/newsFeeds/newsFeed';
import { Icons } from '@/components/icons';
import { useGetAllFinancialYearHomeQuery, useGetHomeDataQuery, useGetSingleServicesCardQuery } from '@/store/features/home';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SignInForm from '../Auth/SignIn/signInForm';
import SignUpForm from '../Auth/SignUp/signupForm';
import CatagoryEvent from './catagoryWiseEvent/catagoryEvent';
import CoverSlide from './sliderTwo/coverSlide';
import { ReactSpring3dCarousel } from './sliderTwo/slider';

export const formSchema = z.object({
  id: z.string().min(1, { message: "This field is required" }),
});

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  className?: any;
}

const Website = () => {
  const [errorMessages, setErrorMessages] = useState("");
  const [language, setLanguage] = useState("Eng");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const { data: listData } = useGetSingleServicesCardQuery(id, { skip: id === null || id === undefined });
  const { data: allFinancialYearHome } = useGetAllFinancialYearHomeQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: ""
    },
  });

  const defaultFinancialYearStatus =
    allFinancialYearHome?.data
      ?.find((item: any) => item?.status === 1)
      ?.id?.toString() || "0";

  useEffect(() => {
    const storedId = localStorage.getItem('selectedId');
    if (storedId) {
      setId(storedId);
    } else {
      setId(defaultFinancialYearStatus);
    }
  }, [defaultFinancialYearStatus]);

  useEffect(() => {
    if (id) {
      form.setValue('id', id);  // Set form value when ID changes
    } else {
      form.setValue('id', defaultFinancialYearStatus);
    }
  }, [id, form]);

  // Function to handle language toggle
  const handleLanguageToggle = (checked: boolean) => {
    setLanguage(checked ? "বাংলা" : "Eng");
  };

  const { data: listQuery, refetch, isLoading } = useGetHomeDataQuery()
  // const { data: serviceCard } = useGetServicesCardQuery()

  const Icon = ({ name, size = 24, color = "currentColor" }: IconProps) => {
    const LucideIcon = Icons[name];
    return <LucideIcon size={size} color={color} />;
  };
  const bgColors = ["#7367F0", "#FF9F43", "#F38067", "#51B6FF", "#0CB04D"];


  useEffect(() => {
    if (defaultFinancialYearStatus !== "0") {
      setId(defaultFinancialYearStatus);
    }
  }, [defaultFinancialYearStatus]);

  const handleUserChange = (selectedValue: any) => {
    if (selectedValue) {
      setId(selectedValue);
      localStorage.setItem('selectedId', selectedValue);  // Save to localStorage
    } else {
      setId(null);
      localStorage.removeItem('selectedId');  // Clear from localStorage
    }
  };

  useEffect(() => {
    if (form.watch('id')) {
      setId(form.watch('id'))
    } else {
      setId(null);
    }
  }, [form.watch('id')])

  return (
    <div className="bg-gradient-to-r from-headerbg to-[#FFFF]">
      {/* Cover and Login Form */}
      <div className="bg-[#ccedff]">
        <div className="custom_container">
          <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-6 2xl:gap-6 py-6">
            <div className="col-span-12 md:col-span-8 lg:col-span-8 xl:col-span-8">
              <div className="w-[100%] h-[100%]">
                <CoverSlide />
              </div>
            </div>
            <div className='col-span-12 md:col-span-4 lg:col-span-4 xl:col-span-4 h-full'>
              <div className="border border-[#aaa9a9] bg-white  h-full rounded-lg p-6">
                {/* issue No : 14830 */}
                {/* <div className="text-center">
                  <span className='flex justify-center items-center'>
                    <Image src="/assets/Image/SMEF-Logo.png" alt="" width={90} height={90} />
                  </span>
                </div> */}
                <div className=" bg-white h-full">
                  {/* <h5 className='text-primary font-bold text-[20px]'>{isRegistering ? 'SME Register' : 'Sign in'}</h5> */}
                  {errorMessages && (
                    <div className="text-red-500 text-center">
                      {errorMessages}
                    </div>
                  )}
                  <div className="rounded">
                    {!isRegistering ? (
                      <SignInForm setIsRegistering={setIsRegistering} eventId={null} />
                    ) : (
                      <SignUpForm setIsRegistering={setIsRegistering} eventId={null} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='custom_container'>
          <ReactSpring3dCarousel />
        </div>

        <div className="custom_container ">
          <div className="flex items-center justify-between border-b-2 border-[#0C44B0] mt-5">
            <div className="bg-[#0C44B0] text-white px-3 py-[7px] rounded-t-lg sm:text-sm lg:text-[20px] w-fit font-thin text-opacity-90 ...">
              শ্রেণীভিত্তিক কার্যক্রম
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6">
            {/* {serviceCard?.data?.map((item: any, index: number) =>
              item ? (
                <CatagoryEvent item={item} index={index} />
              ) : null
            )} */}
            {listData?.data?.map((item: any, index: number) =>
              item ? (
                <CatagoryEvent item={item} index={index} />
              ) : null
            )}
          </div>
        </div>

        <div className="custom_container">
          <div className="grid grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 mt-5">
              <div className=" border-b-2 border-[#0C44B0]">
                <div className="bg-[#0C44B0] text-white px-3 py-[15px] rounded-t-lg sm:text-sm lg:text-[18px] font-sans w-fit font-thin text-opacity-90 ...">
                  <strong>SME</strong> ফাউন্ডেশনের প্লাটফর্ম সংক্রান্ত তথ্য
                </div>
              </div>
              <p className="text-justify mt-5 leading-7 pr-3 h-[330px] overflow-auto font-bangla  ">
                {listQuery?.data?.site_info?.description ??
                  " ক্ষুদ্র ও মাঝারি এন্টারপ্রাইজ ফাউন্ডেশন,\n" +
                  " ব্যাপকভাবে এসএমই ফাউন্ডেশন নামে পরিচিত, একটি কোম্পানি যা গ্যারান্টি দ্বারা সীমিত এবং বাণিজ্য মন্ত্রণালয় কর্তৃক লাইসেন্সপ্রাপ্ত একটি অলাভজনক সংস্থা হিসাবে এবং 1994\n" +
                  " সালের কোম্পানি আইন (অ্যাক্ট XXVIII) এর অধীনে নিবন্ধিত। এটি পরিচালিত হচ্ছে মেমোরেন্ডাম এবং আর্টিকেল অফ অ্যাসোসিয়েশনে বর্ণিত নির্দেশিকা। এসএমই ফাউন্ডেশন\n" +
                  " বাংলাদেশ সরকার শিল্প মন্ত্রণালয়ের মাধ্যমে দেশে এসএমই উন্নয়নের শীর্ষ প্রতিষ্ঠান হিসেবে প্রতিষ্ঠিত এসএমই ফাউন্ডেশনের প্রধান কার্যক্রম হল বাংলাদেশ সরকার কর্তৃক গৃহীত\n" +
                  " এসএমই নীতি কৌশল বাস্তবায়ন, এসএমই-এর বৃদ্ধির জন্য নীতি সমর্থন এবং হস্তক্ষেপ, এসএমই-এর জন্য আর্থিক সহায়তা প্রদান, দক্ষতা উন্নয়ন ও সক্ষমতা বৃদ্ধির প্রশিক্ষণ প্রদান,\n" +
                  " উপযুক্ত প্রযুক্তির সাথে অভিযোজন সহজতর করা এবং প্রবেশাধিকার...।।"}
                <br />
              </p>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="grid grid-cols-12 gap-4  border-b-2 border-[#0C44B0] mt-5">
                <div className="col-span-6 ">
                  <div className="bg-[#0C44B0] h-full flex items-center text-white px-3 py-[7px] rounded-t-lg sm:text-xs lg:text-[18px] font-bangla w-fit font-thin text-opacity-90 ...">
                    কাজের তালিকা
                  </div>
                </div>
                <div className="col-span-6 flex justify-end">
                  <div className="bg-[#0C44B0] flex items-center justify-end text-white px-3 py-[7px] text-nowrap rounded-t-lg sm:text-sm lg:text-[18px] font-sans w-fit ">
                    <FormContainer form={form} autoComplete="off">
                      <div className="w-full relative">
                        <FormAutoCompleteForReportHome
                          name="id"
                          data={listArrayDaynamicModify(
                            allFinancialYearHome?.data,
                            "name",
                            "name"
                          )}
                          singleListName="name"
                          placeholder="Select User"
                          onChange={handleUserChange}
                          control={form.control}
                          staticOptions={[
                            { value: "0", label: "Select All" },
                          ]}
                          defaultValue={id || defaultFinancialYearStatus}
                        />
                      </div>
                    </FormContainer>

                  </div>
                </div>
              </div>
              <div className="">
                {listData?.data?.map((item: any, index: number) => (
                  <Link href={`/website/catagory-wise-single-event/${item?.id}?listIds=${id}`}>
                    <div
                      key={index}
                      className="flex justify-between items-center mt-2 rounded-lg p-3"
                      style={{
                        backgroundColor: bgColors[index % bgColors.length],
                      }}
                    >
                      <div className="flex items-center">
                        <Image
                          priority={true}
                          src={`${"/assets/Image/catagory-image/"}${index + 1}${".png"}`}
                          alt="Logo"
                          width={40}
                          height={40}
                          className="flex items-center justify-center"
                        />
                        <p className="ml-3 text-white text-[17px] font-bangla font-bold">
                          {item?.name_bn ?? "N/A"}
                        </p>
                      </div>
                      <div className="text-white text-[22px] font-sans">
                        {item?.count ?? 0}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="custom_container">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};

export default Website;
