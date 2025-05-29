"use client";

import { siteConfig } from "@/config/site";
import { useGetEventDetailsSingleViewQuery } from "@/store/features/eventManagement/newEvent";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, {Suspense, useEffect, useState} from "react";
import Spinner from "@/components/common/Spinner/Spinner";

// Attachment type
type Attachment = {
    id: number;
    attach_file_path: string;
};

// SliderItem type with event_attachments
type SliderItem = {
    id: number;
    event_attachments: string;
};

// The Slider component
const Slider: React.FC<{ data: SliderItem[], activeSlide: number }> = ({ data, activeSlide: initialSlide }) => {
    const params = useParams();
    const id = params.id;
    const { data: eventDetails } = useGetEventDetailsSingleViewQuery(id)

    const [activeSlide, setActiveSlide] = useState(initialSlide);

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prevSlide) =>
                prevSlide < data.length - 1 ? prevSlide + 1 : 0
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [data.length]);

    const next = () => setActiveSlide((prevSlide) => (prevSlide < data.length - 1 ? prevSlide + 1 : 0));
    const prev = () => setActiveSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : data.length - 1));

    const getStyles = (index: number) => {
        const numSlides = data.length;
        const slidePosition = (index - activeSlide + numSlides) % numSlides;

        switch (slidePosition) {
            case 0:
                return { opacity: 1, transform: "translateX(0)", zIndex: 10 };
            case 1:
                return { opacity: 1, transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)", zIndex: 9 };
            case 2:
                return { opacity: 1, transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)", zIndex: 8 };
            case numSlides - 1:
                return { opacity: 1, transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)", zIndex: 9 };
            case numSlides - 2:
                return { opacity: 1, transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)", zIndex: 8 };
            default:
                return { opacity: 0, transform: slidePosition < numSlides / 2 ? "translateX(-480px) translateZ(-500px) rotateY(35deg)" : "translateX(480px) translateZ(-500px) rotateY(-35deg)", zIndex: 7 };
        }
    };

    return (
        <div className="mt-0">
            {/* Slider content */}
            <div className="secondSliderC !mb-[150px]">
                {data.map((attachment: SliderItem, i: number) => (
                    <div
                        key={attachment.id}
                        className="secondSlider"
                        style={{
                            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.3)",
                            ...getStyles(i),
                        }}
                    >
                        <SliderContent imgSrc={attachment.event_attachments} />
                    </div>
                ))}
            </div>

            {/* Controls and Info */}
            <div className="flex items-center justify-between border-b-2 border-[#0C44B0] mb-[68px]">
                <button onClick={prev} className="p-[10px] bg-[#0C44B0] text-[#fff] border-none cursor-pointer rounded-t-lg">
                    &#10094;
                </button>

                <div className=" m-1 text-[20px]">
                    {activeSlide + 1} / {data.length}
                </div>
                <button onClick={next} className="p-[10px] bg-[#0C44B0] text-[#fff] border-none cursor-pointer rounded-t-lg">
                    &#10095;
                </button>
            </div>
        </div>
    );
};

// Slider content component
const SliderContent: React.FC<{ imgSrc: string }> = ({ imgSrc }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="sliderContent">
            <div className="imageWrapper">
                <Image
                    src={hasError ? "/assets/Image/coverImage.png" : `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${imgSrc}`}
                    alt="Event image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    onError={() => setHasError(true)}
                />
            </div>
        </div>
    );
};

// Main component that fetches the event details and passes data to the Slider
export const ReactSpring3dCarousel = () => {
    const params = useParams();
    const id = params.id;
    const { data: sliderData, isLoading } = useGetEventDetailsSingleViewQuery(id);

    // Transform event_attachments data
    const transformedSliderData = sliderData?.data?.event_attachments
        ? sliderData.data.event_attachments.map((attachment: Attachment) => ({
            id: attachment.id,
            event_attachments: attachment.attach_file_path,
        }))
        : [];

    if (isLoading) return <div> <Suspense fallback={<Spinner/>}> </Suspense></div>;

    return transformedSliderData.length > 0 ? <Slider data={transformedSliderData} activeSlide={0} /> : null;
};
