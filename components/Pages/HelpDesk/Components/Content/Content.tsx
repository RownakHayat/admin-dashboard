import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SmsBox from "../SmsBox/SmsBox";
import Messages from "../Messages/Messages";
const Content = () => {
  return (
    <div className="bg-white shadow rounded p-0.5">
      <div className=" bg-[#F5F3F4]">
        <div className="grid lg:grid-cols-12 sm:grid-cols-1 md:grid-cols-2 gap-8">
          <div className="lg:col-span-12 md:col-span-12 sm:col-span-12">
            <Card className="bg-[#EBECF0] w-full relative h-[80vh]">
              <CardContent>
                <Messages/>
                <div className="absolute w-full bottom-0 left-0">
                <SmsBox/>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;