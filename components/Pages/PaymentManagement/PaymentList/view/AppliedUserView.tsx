import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import Image from "next/image";
import React from "react";

interface PaymentValueProps {
  open: boolean;
  onClose: () => void;
  singlePaymentValues?: any;
}
const AppliedUserView: React.FC<PaymentValueProps> = ({
  open,
  onClose, singlePaymentValues
}) => {
  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[65%] w-[100%] h-[95%] p-0 bg-[#e9e9ea]">
          <div className="absolute right-0 top-0 bg-[#e1ffec] w-[100%] rounded-t-lg p-2">
            <p className="text-right mr-9 mt-1 flex justify-end">
              Print{" "}
              <span className="ml-2">
                <Printer />
              </span>
            </p>
          </div>
          <div className="overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg">
            <div className="flex items-center justify-between my-3">
              <p className="text-[18px] font-bold">Payment Details</p>
            </div>
            <div className="border border-t-1"></div>

            <div>
              <h1 className="my-4">
                General Information <div className="border border-t-1"></div>
              </h1>
              <div className="grid grid-cols-12 gap-y-3 text-nowrap my-5">
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>User ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>327868</div>
                </div>
                {/* user id */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>User Profile ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>43534345</div>
                </div>
                {/* user id */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Office ID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>214537</div>
                </div>
                {/* user id */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Email</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>abc@gmail.com</div>
                </div>
                {/* user id */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Phone No</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>125478965325</div>
                </div>
                {/* user id */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>NID</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>1254789653258956</div>
                </div>
              </div>

              <h1 className="my-4">
                Personal Information <div className="border border-t-1"></div>
              </h1>
              <div className="grid grid-cols-12 gap-y-3 text-nowrap my-5">
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Name ( Bnagla )</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>হাজী আব্দুুুুস সালাাম মন্ডল</div>
                </div>
                {/* Name (EN) */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Name ( English )</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Hazi Abdus Salam Mondol</div>
                </div>
                {/* Father's Name */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Father's Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Hazi Abdus Salam Mondol</div>
                </div>
                {/* Mother's Name */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Mother's Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Hazi Abdus Salam Mondol</div>
                </div>
                {/* Spouse Name */}
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                  <div>Spouse Name</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-1">
                  <div>:</div>
                </div>
                <div className="xs:col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                  <div>Hazi Abdus Salam Mondol</div>
                </div>
                {/* Occupation */}
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
                  <div>8299 9928 1021 9823 12</div>
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
                  <div>Dhaka</div>
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
                    src="/assets/Image/Bangladesh.png"
                    width={100}
                    height={100}
                    alt=""
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

export default AppliedUserView;
