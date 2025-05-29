import AttendanceList from "@/components/Pages/EventManagement/Attendance/Attendance";
import React, { Suspense } from "react";
import Spinner from "@/components/common/Spinner/Spinner";

const AttendancePage = () => {
  return (
    <div>
      <Suspense fallback={<Spinner/>}>

          <AttendanceList />
      </Suspense>
    </div>
  );
};

export default AttendancePage;
