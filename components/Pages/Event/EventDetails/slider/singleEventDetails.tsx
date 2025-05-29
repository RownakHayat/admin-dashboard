"use client";

import { siteConfig } from "@/config/site";
import { useGetEventDetailsSingleViewQuery } from "@/store/features/eventManagement/newEvent";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
const SingleEventSlider: React.FC<{ data: SliderItem[], activeSlide: number }> = ({ data, activeSlide: initialSlide }) => {
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

  return (
    <div className="slider-container">
      {/* Slider content */}
      <div className="slider-wrapper">
        {data.map((attachment: SliderItem, i: number) => (
          <div
            key={attachment.id}
            className={`slider-item ${i === activeSlide ? "active" : ""}`}
          >
            <SliderContent imgSrc={attachment.event_attachments} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="slider-controls">
        <button onClick={prev} className="slider-button">
          &#10094;
        </button>

        <div className="slider-indicator">
          {activeSlide + 1} / {data.length}
        </div>

        <button onClick={next} className="slider-button">
          &#10095;
        </button>
      </div>

      <style jsx>{`
        .slider-container {
          position: relative;
          width: 100%;
          max-width: 650px;
          margin: auto;
          overflow: hidden;
        }
        .slider-wrapper {
          display: flex;
          transition: transform 0.5s ease-in-out;
          transform: translateX(${-(activeSlide * 100)}%);
        }
        .slider-item {
          min-width: 100%;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        .slider-item.active {
          opacity: 1;
        }
        .slider-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .slider-button {
          background-color: #0c44b0;
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
        }
        .slider-indicator {
          font-size: 20px;
        }


  /* Media Queries */
  @media (max-width: 768px) {
    .slider-controls {
      width: 100%; /* More width for smaller screens */
    }
    .slider-button {
      padding: 8px; /* Reduce padding for smaller buttons */
      font-size: 14px;
    }
    .slider-indicator {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    .slider-controls {
      width: 100%; /* Full width on mobile devices */
    }
    .slider-button {
      padding: 6px; /* Even smaller padding */
      font-size: 12px;
    }
    .slider-indicator {
      font-size: 16px;
    }
  }
  @media (max-width: 390px) {
    .slider-controls {
      width: 100%; /* Full width on mobile devices */
    }
    .slider-button {
      padding: 6px; /* Even smaller padding */
      font-size: 12px;
    }
    .slider-indicator {
      font-size: 16px;
    }
  }
      `}</style>
    </div>
  );
};

// Slider content component
const SliderContent: React.FC<{ imgSrc: string }> = ({ imgSrc }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="slider-content" style={{ position: "relative", width: "100%", height: "300px", }}>
      <Image
        src={hasError ? "/assets/Image/coverImage.png" : `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${imgSrc}`}
        alt="Event image"
        // layout="responsive" 
        objectFit="contain"
        quality={100}
        width={180}           
        height={20}        
        onError={() => setHasError(true)}
        className="w-full h-full"    
      />
    </div>
  );
};

// Main component that fetches the event details and passes data to the Slider
export const SingleEventDetails = () => {
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

  if (isLoading) return <Spinner/> ;

  return (
    <div>
      {transformedSliderData.length > 0 ? <SingleEventSlider data={transformedSliderData} activeSlide={0} /> : null}
    </div>
  );
};
