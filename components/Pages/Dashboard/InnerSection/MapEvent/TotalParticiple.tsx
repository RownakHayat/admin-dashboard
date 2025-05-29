import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

// Define the type for the districtData prop
interface TotalParticipleProps {
  districtData: {
    districtDetails: DistrictDetails;
    "0": Event[];
  }[] | null;
}

const TotalParticiple: React.FC<TotalParticipleProps> = ({ districtData }) => {

  const totalEventApplications = districtData?.reduce((acc, district) => {
    const districtEventApplications = district["0"]?.reduce((eventAcc, event) => {
      return eventAcc + (event.event_application_count || 0);
    }, 0);

    return acc + (districtEventApplications || 0);
  }, 0) || 0;


  const totalEvents = districtData?.reduce((acc, district) => {
    return acc + (district["0"]?.length || 0);
  }, 0) || 0;



  const percentage = totalEventApplications;
  return (
    <div className="">
      {districtData?.map((district, index) => (
        <div key={index} className="my-2">
          <h6 className="text-lg font-bold">{district.districtDetails.name}</h6>
          <h6 className="text-lg font-bold w-[170px]">Event Count: {totalEvents}</h6>
        </div>
      ))}

      <div className="text-md text-wrap my-1 w-[170px]">Total Participation: {totalEventApplications}</div>
      <div style={{ width: "100%" }}>
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          styles={buildStyles({
            textColor: "white",
            pathColor: "white",
            trailColor: "#F79323",
          })}
        />
      </div>
    </div>
  );
};

export default TotalParticiple;