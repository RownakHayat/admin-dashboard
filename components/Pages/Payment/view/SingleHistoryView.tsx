import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetPaymentHistoryStatusQuery } from "@/store/features/paymentManagment";
import React from "react";

interface PaymentValueProps {
  open: boolean;
  onClose: () => void;
  singlePaymentValues?: any;
}

const SingleHistoryView: React.FC<PaymentValueProps> = ({
  open,
  onClose,
  singlePaymentValues,
}) => {
  const { data: TransactionData } = useGetPaymentHistoryStatusQuery({
    event_application_id: singlePaymentValues?.payment?.event_application_id,
    user_id: singlePaymentValues?.user_id,
  });


  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-lg w-full h-auto p-0 bg-[#e9e9ea] rounded-lg">
          <div className="overflow-y-auto max-h-[80vh] p-4 sm:p-6 m-2 sm:m-6 bg-white rounded-lg">
            <div className="flex items-center justify-center my-3 px-4">
              <p className="text-[16px] sm:text-[18px] font-bold whitespace-nowrap overflow-hidden text-center">
                Payment Transaction History Details
              </p>
            </div>
            <div className="border-t my-4"></div>
            {!TransactionData?.data || TransactionData?.data.length === 0 ? (
              <>
                <p className="text-center text-sm text-gray-500 my-4">No Transaction History Found</p>
              </>
            ) : (
              <>
                {TransactionData?.data?.map((data: any) => {
                  return (
                    <>
                      <div className="grid grid-cols-12 gap-4 md:gap-6 my-5">
                        {/* Program Name */}
                        <div className="col-span-6 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">
                            Mobile No: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">{data?.mobile_number}</span>
                        </div>

                        {/* Event Name */}
                        <div className="col-span-6 items-start sm:items-center gap-1">
                          <span className="text-sm font-semibold">
                            Transaction Id: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">
                            {data?.transaction_id}
                          </span>
                        </div>

                        {/* Activity Type */}
                        <div className="col-span-6 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">
                            Payment Type: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">
                            {data?.payment_method
                              .replace(/_/g, " ")
                              .charAt(0)
                              .toUpperCase() +
                              data?.payment_method.replace(/_/g, " ").slice(1)}
                          </span>
                        </div>

                        {/* User Name */}
                        <div className="col-span-6 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">Amount: <span className="pb-1"></span></span>
                          <span className="text-sm transform">
                            {data?.amount}
                          </span>
                        </div>

                        {/* Mobile No */}
                        <div className="col-span-6 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">
                            Payment Status: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">
                            { }
                            {data?.payment_status === 0 && "Not Paid"}
                            {data?.payment_status === 1 && "Paid"}
                            {data?.payment_status === 2 && "Processing"}
                            {data?.payment_status === 3 && "Rejected"}
                          </span>
                        </div>
                        <div className="col-span-6 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">
                            Payment Date: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">{data?.payment_date}</span>
                        </div>
                        <div className="col-span-12 items-start sm:items-center gap-2">
                          <span className="text-sm font-semibold">
                            Remarks: <span className="pb-1"></span>
                          </span>
                          <span className="text-sm">{data?.remarks}</span>
                        </div>
                      </div>
                      <hr />
                    </>
                  );
                })}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleHistoryView;
