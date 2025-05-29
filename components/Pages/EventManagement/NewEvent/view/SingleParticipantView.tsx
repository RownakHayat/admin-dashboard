import ProgressBar from "@/components/common/Skeleton/progressBar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { Printer } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";
import { eventSchema } from "../schemas/eventSchema";

interface ParticipateValueProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof eventSchema>) => void;
  singleParticipateValues?: any;
}
const SingleParticipantView: React.FC<ParticipateValueProps> = ({
  open,
  onClose,
  onSave,
  singleParticipateValues
}) => {

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "QR Attendance",
    onAfterPrint: () => console.log("Print Success"),
  })


  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[65%] w-[100%] h-[95%] p-0 bg-[#e9e9ea]">
          <div className="absolute right-0 top-0 bg-[#e1ffec] w-[100%] rounded-t-lg p-2">
            <p className="text-right mr-9 mt-1 flex justify-end cursor-pointer" onClick={() => handleClickToPrint()}>
              Print
              <span className="ml-2">
                <Printer />
              </span>
            </p>
          </div>
          <div className="overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg" ref={componentRef}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[18px] font-bold">Participant's Details</p>
              {/* <Button className='bg-green-600'>Submit <ChevronRight /></Button> */}
            </div>
            <div className="border border-t-1"></div>

            <div className="grid grid-cols-12 w-[100%] items-center">
              <div className="col-span-3 xs:col-span-12 sm:col-span-12 md:col-span-3">
                <Image
                  src={
                    singleParticipateValues?.user?.user_profile?.profile_image_path
                      ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                        ?.IMAGE_URL
                      }${singleParticipateValues?.user?.user_profile?.profile_image_path
                      }`
                      : ""
                  }
                  alt="Reload"
                  width={200}
                  height={200}
                />
              </div>
              <div className="col-span-9 xs:col-span-12 sm:col-span-12 md:col-span-5">
                <h1 className="text-[30px] font-bold">{singleParticipateValues?.user?.name}</h1>
                <p>{singleParticipateValues?.user?.user_profile?.occupation_type}</p>
                <p>
                  Created Date: 12 Jun 2018
                  <span>Activate Date: 12 jun 2018</span>
                </p>
                <div className="progressMainDiv">
                  <ProgressBar value={76} />
                  {/* <span>{success ? "Complete!" : "Profile not complete"}</span> */}
                </div>
              </div>
            </div>
            <div>
              <h1 className="my-4">
                General Information <div className="border border-t-1"></div>
              </h1>
              <div className="grid grid-cols-12 gap-y-[5px] text-nowrap my-5">
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>User ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.sme_id}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>User Profile ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>43534345</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Office ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>214537</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Email</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.email}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Phone No</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.mobile}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>NID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.nid}</div>
                </div>
              </div>

              <h1 className="my-4">
                Personal Information <div className="border border-t-1"></div>
              </h1>
              <div className="grid grid-cols-12 gap-y-[5px] text-nowrap my-5">
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Name (Bangla)</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.name_bn}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Name (English)</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.name}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Father's Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.father_name}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Mother's Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.mother_name}</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Spouse Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>
                    <div>{singleParticipateValues?.user?.user_profile?.spouse_name}</div>
                  </div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Occupation</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Hazi Abdus Salam Mondol</div>
                </div>
                {/* Business Sector */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Business Sector</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>IT Firm</div>
                </div>
                {/* Trade License No */}
                <div className="sm:col-span-6 md:col-span-2 text-sm">
                  <div>Trade License No.</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.trade_license_no}</div>
                </div>
                {/* District */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>District</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Dhaka</div>
                </div>
                {/* Upazila */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Upazila</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Dhaka</div>
                </div>
                {/* Cluster */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Cluster</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Dhaka</div>
                </div>
                {/* Date Of Birth */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Date Of Birth</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>{singleParticipateValues?.user?.user_profile?.date_of_birth}</div>
                </div>
                {/* Gender */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Gender</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Dhaka</div>
                </div>
              </div>
              <h1 className="my-4">
                Documents <div className="border border-t-1"></div>
              </h1>
              <div className="w-[35%]">
                <div className="">
                  <p className="w-[150px]">Signature</p>
                  <Image
                    src={
                      singleParticipateValues?.user?.user_profile?.signature_image_path
                        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                          ?.IMAGE_URL
                        }${singleParticipateValues?.user?.user_profile?.signature_image_path
                        }`
                        : ""
                    }
                    alt="Reload"
                    width={120}
                    height={120}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleParticipantView;
