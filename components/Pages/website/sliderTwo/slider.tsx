"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useGetEventSlidersQuery } from "@/store/features/portalManagement/slider";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, {Suspense, useEffect, useState} from "react";
import Spinner from "@/components/common/Spinner/Spinner";

// Define types for the props
type SliderItem = {
  id: number;
  imgSrc: string;
  event_name: string;
  venue: string;
  deadLine: string;
  date: string;
  end_date: string;
  district: string;
  duration: string;
  readMoreLink: string;
};

type SliderProps = {
  data: SliderItem[];
  activeSlide: number;
};

// The main Slider component
const Slider: React.FC<SliderProps> = ({ data, activeSlide: initialSlide }) => {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const [isPaused, setIsPaused] = useState(false); // State to manage auto-slide pause

  // Auto-slide functionality using useEffect
  useEffect(() => {
    if (isPaused) return; // Do nothing if paused

    const interval = setInterval(() => {
      setActiveSlide((prevSlide) =>
        prevSlide < data.length - 1 ? prevSlide + 1 : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length, isPaused]); // Dependency array includes isPaused

  const next = () =>
    setActiveSlide((prevSlide) => (prevSlide < data.length - 1 ? prevSlide + 1 : 0));

  const prev = () =>
    setActiveSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : data.length - 1));

  const getStyles = (index: number) => {
    const numSlides = data.length;
    const slidePosition = (index - activeSlide + numSlides) % numSlides;

    switch (slidePosition) {
      case 0:
        return {
          opacity: 1,
          transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
          zIndex: 10,
        };
      case 1:
        return {
          opacity: 1,
          transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
          zIndex: 9,
        };
      case 2:
        return {
          opacity: 1,
          transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
          zIndex: 8,
        };
      case numSlides - 1:
        return {
          opacity: 1,
          transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
          zIndex: 9,
        };
      case numSlides - 2:
        return {
          opacity: 1,
          transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
          zIndex: 8,
        };
      default:
        return {
          opacity: 0,
          transform:
            slidePosition < numSlides / 2
              ? "translateX(-480px) translateZ(-500px) rotateY(35deg)"
              : "translateX(480px) translateZ(-500px) rotateY(-35deg)",
          zIndex: 7,
        };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-[#0C44B0] mb-[68px] sm:gap-2">
        <div className="bg-[#0C44B0] text-white px-3 py-[7px] rounded-t-lg sm:text-[6%] lg:text-[20px] text-opacity-85 ...">
          আসন্ন কার্যক্রমের তথ্য
        </div>
        <div
          className="bg-[#0C44B0] rounded-t-lg"
          style={{ display: "flex", alignItems: "center" }}
        >
          <button
            onClick={prev}
            className="sm:p-2 lg:p-[10px] bg-[#0C44B0] text-[#fff] border-none cursor-pointer rounded-t-lg"
          >
            &#10094;
          </button>
          <div className="text-white m-1 sm:text-[6%] lg:text-[20px]">
            {activeSlide + 1} / {data.length}
          </div>
          <button
            onClick={next}
            className="sm:p-2 lg:p-[10px] bg-[#0C44B0] text-[#fff] border-none cursor-pointer rounded-t-lg"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* carousel */}
      {/* <div className="secondSliderC !mb-[150px]">
        {data.map((item, i) => (
          <React.Fragment key={item.id}>
            <div
              className="secondSlider"
              style={{
                boxShadow: `0 5px 20px rgba(0, 0, 0, 0.3)`,
                ...getStyles(i),
              }}
              onMouseEnter={() => setIsPaused(true)} // Pause on hover
              onMouseLeave={() => setIsPaused(false)} // Resume on mouse leave
            >
              <SliderContent {...item} />
            </div>
          </React.Fragment>
        ))}
      </div> */}

      {/* carousel */}

         {/* carousel */}
         <div className="secondSliderC !mb-[150px]">
        {data.length === 0 ? (
          <div className="text-center text-2xl text-black-500 py-10">
           এখন কোনও ইভেন্ট চলমান নেই , অনুগ্রহ করে পরবর্তী ইভেন্টের জন্য অপেক্ষা করুন।
          </div>
        ) : (
          data.map((item, i) => (
            <React.Fragment key={item.id}>
              <div
                className="secondSlider"
                style={{
                  boxShadow: `0 5px 20px rgba(0, 0, 0, 0.3)`,
                  ...getStyles(i),
                }}
                onMouseEnter={() => setIsPaused(true)} // Pause on hover
                onMouseLeave={() => setIsPaused(false)} // Resume on mouse leave
              >
                <SliderContent {...item} />
              </div>
            </React.Fragment>
          ))
        )}
      </div>
      {/* carousel */}
    </>
  );
};

const SliderContent: React.FC<SliderItem> = ({
  imgSrc,
  event_name,
  venue,
  deadLine,
  date,
  end_date,
  district,
  duration,
  readMoreLink,
}) => {
  const [hasError, setHasError] = useState(false);
  const handleError = () => {
    setHasError(true);
  };


  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


  return (
    <div className="sliderContent">
      <div className="imageWrapper">
       <Link href={readMoreLink}>
       <Image
          src={
            hasError
              ? "/assets/Image/defaultEvent.png"
              : `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || ""}${imgSrc || "/assets/Image/defaultEvent.png"}`
          }
          alt={event_name}
          layout="fill"
          objectFit="cover"
          quality={100}
          onError={handleError}
        />
       </Link>
      </div>
      <div className="overlay">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 text-start">
            <h2 className="sm:text-xs lg:text-md text-nowrap sm:block lg:flex gap-1"
            // style={{
            //   // wordBreak: 'break-word',
            //   whiteSpace: 'normal'

            // }}
            ><span className="sm:text-xs lg:text-md">Title: </span> <span> {event_name}</span> </h2>
            <h3 className="text-nowrap sm:text-xs lg:text-md">Venue: {venue}</h3>
            {/* <h3 className="text-nowrap sm:text-sm lg:text-md lg:text-md">Date: {moment(date).format('DD MMM YYYY')}&nbsp;-&nbsp;{moment(end_date).format('DD MMM YYYY')}</h3> */}
            {/* <h3 className="text-nowrap sm:text-xs lg:text-md">Duration: {moment(currentDate).diff(moment(deadLine), 'days')}Day</h3> */}
            {/* <h3 className="sm:text-xs lg:text-md">Deadline: {moment(deadLine).format("DD MMM YYYY")} ({moment(end_date).diff(moment(date), 'days')+1} Day) </h3> */}
            <h3 className="sm:text-xs lg:text-md">Deadline: {moment(deadLine).format("DD MMM YYYY")} (
              {Math.abs(moment(currentDate).diff(moment(deadLine), 'days'))} Day) </h3>
            {/* <h3 className="text-nowrap sm:text-sm">Location: {district}</h3> */}
          </div>
          <div className="col-span-6 flex lg:items-center justify-end sm:text-xs lg:text-md"
           style={{
            display: 'flex',
             alignItems: 'flex-end',
          }}
          >
            <Link href={readMoreLink} className="readMoreBtn">
              <Button className="bg-green-600 font-bold sm:text-xs">বিস্তারিত পড়ুন</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReactSpring3dCarousel = () => {
  const { data: sliderData, refetch, isLoading } = useGetEventSlidersQuery();


  const transformedSliderData = Array.isArray(sliderData?.data)
    ? sliderData.data.map((item: any) => ({
      id: item?.id,
      imgSrc: item?.event_feature_attachment?.attach_file_path,
      event_name: item?.event_name,
      venue: item?.venue || "Unknown Venue",
      date: item?.start_date,
      end_date: item?.end_date,
      duration: item?.duration,
      deadLine: item?.dead_line,
      district: item?.district?.name,
      readMoreLink: `/events/${item.id}`,
    }))
    : [];

  if (isLoading) return <div> <Suspense fallback={<Spinner/>}> </Suspense></div>;

  return transformedSliderData ? <Slider data={transformedSliderData} activeSlide={0} /> : null;
};
