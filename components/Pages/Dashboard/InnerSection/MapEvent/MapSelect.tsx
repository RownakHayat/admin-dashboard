"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import bangladeshUrl from "./bangladeshMap.json";
import TotalParticiple from "./TotalParticiple";

const vectorMapStyleCustom = {
  default: {
    fill: "#D6D6DA",
    stroke: "#fff",
    strokeWidth: 0.4,
    outline: "none",
  },
  hover: {
    fill: "#0CB04D",
    outline: "none",
    textColor: "#454545",
    stroke: "#00FF00",
    strokeWidth: 1,
  },
  pressed: {
    fill: "#E42",
    outline: "none",
    stroke: "#FF0000",
    strokeWidth: 1.5,
  },
};

interface HoverData {
  name: string | null;
  GEO_CODE: string | null;
  eventTo?: string | null;
}

interface DistrictDetails {
  name: string;
  lat: number;
  lon: number;
  GEO_CODE: string;
}

interface Event {
  event_name: string;
  venue: string;
  activity_id: string;
  event_application_count: number;
}

interface MapSelectProps {
  districtData: {
    districtDetails: DistrictDetails;
    "0": Event[];
  }[] | null;
}
const MapSelect: React.FC<MapSelectProps> = ({ districtData }) => {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // const [viewBox, setViewBox] = useState<string>("280 -15 600 600");
  const [viewBox, setViewBox] = useState<string>("200 0 800 800");
  const [hoveredRegion, setHoveredRegion] = useState<HoverData | null>(null);

  const [hoveredDistrictData, setHoveredDistrictData] = useState<
    { districtDetails: DistrictDetails; "0": Event[] } | null>(null);


  const handleMouseEnter = (geo: any) => {

    const matchingDistrict = districtData?.find(
      (district) => district.districtDetails.GEO_CODE === geo?.properties?.GEO_CODE
    );
    if (matchingDistrict) {
      setHoveredRegion({
        name: geo?.properties?.name_en ?? null,
        GEO_CODE: geo?.properties?.GEO_CODE ?? null,
        eventTo: "CustomComponent",
      });
      setHoveredDistrictData(matchingDistrict);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setHoveredDistrictData(null);
  };

  useEffect(() => {
    const updateViewBox = () => {
      if (mapContainerRef.current) {
        const width = mapContainerRef.current.clientWidth;
        const height = mapContainerRef.current.clientHeight;

        if (width > 1200) {
          setViewBox("200 -50 900 900");
        } else if (width > 768) {
          setViewBox("100 -30 700 700");
        } else {
           setViewBox("330 200 200 200");
        }
      }
    };

    updateViewBox();
    window.addEventListener("resize", updateViewBox);

    return () => {
      window.removeEventListener("resize", updateViewBox);
    };
  }, []);

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      const rect = mapContainerRef?.current?.getBoundingClientRect(); // Get div position

      if (rect) {
        setMousePosition({
          x: ev.clientX - rect.left, // Adjust relative to the div's left
          y: ev.clientY - rect.top, // Adjust relative to the div's top
        });
      }
    };

    const div = mapContainerRef.current;
    if (div) {
      div.addEventListener("mousemove", updateMousePosition);
    }

    return () => {
      if (div) {
        div.removeEventListener("mousemove", updateMousePosition);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="event_map_container"
      style={{ position: "relative" }}
    >
      <div style={{  height: "315px" }}>
        <ComposableMap
          projection="geoMercator"
          viewBox={viewBox}
          projectionConfig={{
            scale: 1580,
            center: [89.5, 23.3],
          }}
        >
          <ZoomableGroup>
            <Geographies geography={bangladeshUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const isHighlighted = districtData?.some(
                    (district) =>
                      district.districtDetails?.GEO_CODE === geo?.properties?.GEO_CODE
                  );

                  const geographyStyle = {
                    ...vectorMapStyleCustom,
                    default: {
                      ...vectorMapStyleCustom.default,
                      fill: isHighlighted
                        ? "#0CB04D"
                        : vectorMapStyleCustom.default.fill,
                    },
                  };

                  return (
                    <Geography
                      className="event_map"
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                      style={geographyStyle}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {hoveredRegion?.eventTo === "CustomComponent" && hoveredDistrictData && (
        <div
          style={{
            position: "absolute",
            background: "#064B22",
            width: "200px",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 10,
            top: `${mousePosition.y - 86}px`,
            left: `${mousePosition.x - 5}px`,
          }}
        >
          <div className="w-28">
            <TotalParticiple districtData={[hoveredDistrictData]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MapSelect);