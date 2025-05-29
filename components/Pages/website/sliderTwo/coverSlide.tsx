"use client";
import { siteConfig } from "@/config/site";
import { useGetAllSliderQuery } from "@/store/features/portalManagement/slider";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { config } from "react-spring";
import { v4 as uuidv4 } from "uuid";

const Carousel = dynamic(
    () =>
        import("react-spring-3d-carousel") as unknown as Promise<{
            default: React.ComponentType<any>;
        }>,
    {
        ssr: false,
    }
);

interface Slide {
    key: string;
    content: JSX.Element;
}

const CoverSlide: React.FC = () => {
    const [goToSlide, setGoToSlide] = useState(0);
    const [offsetRadius] = useState(0);
    const [showNavigation] = useState(false);
    const [carouselConfig] = useState(config.gentle);
    const { data: sliderList, error, isLoading } = useGetAllSliderQuery();

    useEffect(() => {
        if (sliderList?.data?.length) {
            const intervalId = setInterval(() => {
                setGoToSlide((prevSlide) => (prevSlide + 1) % sliderList?.data?.length);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [sliderList]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading slides</div>;

    const slidesArray =
        sliderList?.data?.length > 0
            ? sliderList?.data
            : [
                {
                    title: "Default Image",
                },
            ];

    const slides: Slide[] = slidesArray?.map((slide: any) => ({
        key: uuidv4(),
        content: (
            <div className="relative w-[100%] h-full overflow-hidden rounded-lg">
                <Image
                    src={
                        slide?.image_path
                            ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${slide?.image_path}`
                            : "/assets/Image/defaultEvent.png"
                    }
                    alt={slide.title || "Slider Image"}
                    width={1071}
                    height={507}
                    style={{ objectFit: "cover", height: "100%" }}
                />
                <div className="absolute bottom-0 w-[100%] p-3 bg-black bg-opacity-75 text-white">
                    <h2 className="text-xl">{slide.title}</h2>
                </div>
            </div>
        ),
    }));

    const handlePrevSlide = () => {
        setGoToSlide(
            (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
        );
    };

    const handleNextSlide = () => {
        setGoToSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const currentSlideNumber = goToSlide + 1;

    return (
        <div
            className="sliderContainer"
            style={{
                width: "100%",
                height: "507px",
                margin: "0 auto",
                position: "relative",
            }}
        >
            <div
                className="w-[100%] sm:h-0 lg:h-[100%]"
                style={{ width: "100%", height: "100%", position: "relative" }}
                id="homeSlider"
            >
                <Carousel
                    slides={slides}
                    goToSlide={goToSlide}
                    offsetRadius={offsetRadius}
                    animationConfig={carouselConfig}
                    showNavigation={showNavigation}
                />
            </div>
            <div>
                <div className="bg-white flex px-2 py-1 rounded-lg absolute right-0 bottom-2">
                    <button onClick={handlePrevSlide} className="text-black">
                        &#10094;
                    </button>
                    <div className="text-black text-[20px] text-center top-0 mx-3">
                        {currentSlideNumber}
                    </div>
                    <button onClick={handleNextSlide} className="text-black">
                        &#10095;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoverSlide;
