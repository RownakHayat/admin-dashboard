"use client";

import { siteConfig } from '@/config/site';
import { useGetAllSliderQuery } from '@/store/features/portalManagement/slider';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
const Slider = () => {
    const { data: sliderList, error, isLoading } = useGetAllSliderQuery();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading sliders</div>;

    const defaultSliderImages = [
        "/assets/Image/smeSlider1.jpg",
        "/assets/Image/smeSlider2.jpg",
        "/assets/Image/smeSlider3.jpg",
    ];
    const imagesToShow = sliderList?.data && Array.isArray(sliderList?.data) ? sliderList?.data : defaultSliderImages.map(src => ({ image: src }));

    return (
        <div className="grid grid-cols-12">
            <div className="col-span-12">
                <Carousel
                    autoPlay
                    interval={5000}
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    showArrows={false}
                >
                    {imagesToShow.map((slide: any, index: any) => (
                        <div key={index}>
                            <Image
                                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${slide?.image_path}`}
                                alt={slide.alt || 'Slider Image'}
                                width={1760}
                                height={400}
                                style={{ objectFit: 'cover', height: '100%', maxHeight: '400px' }}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default Slider;