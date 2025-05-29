import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { Printer } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface PaymentValueProps {
  open: boolean;
  onClose: () => void;
  singlePaymentValues?: any;
}

const SinglePaymentView: React.FC<PaymentValueProps> = ({
  open,
  onClose,
  singlePaymentValues,
}) => {
  const attachment = singlePaymentValues?.payment?.attachment;
  const isPDF = attachment?.split(".").pop()?.toLowerCase() === "pdf";

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Event Program Details",
    onAfterPrint: () => console.log("Print Success"),
  });

  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl w-full h-auto p-0 bg-[#e9e9ea] rounded-lg">
          <div className="absolute right-0 top-0 bg-[#e1ffec] w-full rounded-t-lg p-2 flex justify-between items-center">
            <p
              onClick={handleClickToPrint}
              className="cursor-pointer text-right mr-9 mt-1 flex justify-end"
            >
            </p>
          </div>
          <div
            ref={componentRef}
            className="overflow-y-auto max-h-[80vh] p-4 sm:p-6 m-2 sm:m-6 bg-white rounded-lg"
          >
            <div className="flex items-center justify-center my-3 px-4">
              <p className="text-[16px] sm:text-[18px] font-bold whitespace-nowrap overflow-hidden text-center">
                Payment Details
              </p>
            </div>
            <div className="border-t my-4"></div>

            <div className="grid grid-cols-12 gap-4 md:gap-6 my-5">
              {/* Program Name */}
              <div className="col-span-6 items-start sm:items-center gap-2">
                <span className="text-sm font-semibold">Program Name:</span>
                <span className="text-sm">
                  {singlePaymentValues?.event_detail?.program_info?.name_en}
                </span>
              </div>

              {/* Event Name */}
              <div className="col-span-6 items-start sm:items-center gap-1">
                <span className="text-sm font-semibold">Event Name:</span>
                <span className="text-sm">
                  {singlePaymentValues?.event_detail?.event_name}
                </span>
              </div>

              {/* Activity Type */}
              <div className="col-span-6 items-start sm:items-center gap-2">
                <span className="text-sm font-semibold">Activity Type:</span>
                <span className="text-sm">
                  {singlePaymentValues?.event_detail?.activity?.name}
                </span>
              </div>

              {/* User Name */}
              <div className="col-span-6 items-start sm:items-center gap-2">
                <span className="text-sm font-semibold">User Name:</span>
                <span className="text-sm">
                  {singlePaymentValues?.user?.name}
                </span>
              </div>

              {/* Mobile No */}
              <div className="col-span-6 items-start sm:items-center gap-2">
                <span className="text-sm font-semibold">Mobile No:</span>
                <span className="text-sm">
                  {singlePaymentValues?.user?.mobile}
                </span>
              </div>

              {/* Payment Method */}
              <div className="col-span-6 items-start sm:items-center gap-2">
                <span className="text-sm font-semibold">Payment Method:</span>
                <span className="text-sm">
                  {singlePaymentValues?.payment
                    ? singlePaymentValues.payment.payment_method
                      .replace(/_/g, " ")
                      .charAt(0)
                      .toUpperCase() +
                    singlePaymentValues.payment.payment_method
                      .replace(/_/g, " ")
                      .slice(1)
                    : "Not paid yet"}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="col-span-6 items-start sm:items-center gap-1">
                <span className="text-sm font-semibold">
                  Transaction ID (TRX No.):
                </span>
                <span className="text-sm">
                  {singlePaymentValues?.payment?.transaction_id}
                </span>
              </div>

              {/* Payment Date */}
              <div className="col-span-6 items-start sm:items-center gap-1">
                <span className="text-sm font-semibold">Payment Date:</span>
                <span className="text-sm">
                  {moment(singlePaymentValues?.payment?.payment_date || "").format(
                    "DD MMM YYYY"
                  )}
                </span>
              </div>

              <div className="col-span-12">
                {/* Attachment */}
                {attachment &&
                  singlePaymentValues?.payment?.payment_method !== "bkash" && (
                    <div className="grid grid-cols-12">
                      <div className="col-span-3">
                        <span className="text-sm font-semibold">Attachment:</span>
                      </div>
                      <div className="col-span-9">
                        <div className=" space-y-2">
                          {isPDF ? (
                            <iframe
                              src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${attachment}`}
                              className="w-full h-[300px] border-none"
                            />
                          ) : (
                            <Image
                              src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${attachment}`}
                              alt="attachment"
                              className="w-full h-auto"
                              width={300}
                              height={500}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SinglePaymentView;
