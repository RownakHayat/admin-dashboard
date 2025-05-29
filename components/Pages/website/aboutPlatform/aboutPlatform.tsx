"use client"
import { useGetHomeDataQuery } from "@/store/features/home";

const AboutPlatform = () => {
  const { data: listQuery, refetch, isLoading } = useGetHomeDataQuery()

  return (
    <div className="custom_container py-[50px]">
      <p className='text-justify mt-5 leading-7 pr-3   h-[284px] overflow-scroll font-bangla bg-white rounded-lg p-4 border border-spacing-1'>
        {listQuery?.data?.site_info?.description ?? " ক্ষুদ্র ও মাঝারি এন্টারপ্রাইজ ফাউন্ডেশন,\n" +
          "ব্যাপকভাবে এসএমই ফাউন্ডেশন নামে পরিচিত, একটি কোম্পানি যা গ্যারান্টি দ্বারা সীমিত এবং বাণিজ্য মন্ত্রণালয় কর্তৃক লাইসেন্সপ্রাপ্ত একটি অলাভজনক সংস্থা হিসাবে এবং 1994\n" +
          "সালের কোম্পানি আইন (অ্যাক্ট XXVIII) এর অধীনে নিবন্ধিত। এটি পরিচালিত হচ্ছে মেমোরেন্ডাম এবং আর্টিকেল অফ অ্যাসোসিয়েশনে বর্ণিত নির্দেশিকা। এসএমই ফাউন্ডেশন\n" +
          "বাংলাদেশ সরকার শিল্প মন্ত্রণালয়ের মাধ্যমে দেশে এসএমই উন্নয়নের শীর্ষ প্রতিষ্ঠান হিসেবে প্রতিষ্ঠিত এসএমই ফাউন্ডেশনের প্রধান কার্যক্রম হল বাংলাদেশ সরকার কর্তৃক গৃহীত\n" +
          "এসএমই নীতি কৌশল বাস্তবায়ন, এসএমই-এর বৃদ্ধির জন্য নীতি সমর্থন এবং হস্তক্ষেপ, এসএমই-এর জন্য আর্থিক সহায়তা প্রদান, দক্ষতা উন্নয়ন ও সক্ষমতা বৃদ্ধির প্রশিক্ষণ প্রদান,\n" +
          "উপযুক্ত প্রযুক্তির সাথে অভিযোজন সহজতর করা এবং প্রবেশাধিকার...।।"}
        <br />

      </p>

    </div>
  );
};

export default AboutPlatform;
