import FormContainer from "@/components/common/Form/FormContainer";
import FormFileUploadUpdated from "@/components/common/Form/FormFileUploadUpdated";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { ApplyPaymentSchema } from "@/components/Pages/Payment/schemas/paymentSchema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useChangePayementReceiveStatusMutation } from "@/store/features/paymentManagment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";


interface PaymentValueProps {
  open: boolean;
  onClose: () => void;
  singlePaymentValues?: any;
}


const PaymentConfirmView: React.FC<PaymentValueProps> = ({
  open,
  onClose,
  singlePaymentValues
}) => {

  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastError } = useToast();
  const router = useRouter()
  const [changePaymentReceiveStatus] = useChangePayementReceiveStatusMutation();

  const form = useForm<z.infer<typeof ApplyPaymentSchema>>({
    resolver: zodResolver(ApplyPaymentSchema),
    defaultValues: {
      transaction_id: "",
      remarks: "",
      attachment: "",
    },
  });


  useEffect(() => {
    if (singlePaymentValues) {
      form.reset({
        ...singlePaymentValues,
        transaction_id: singlePaymentValues?.payment?.transaction_id || "",
        attachment: singlePaymentValues?.payment?.attachment,
        remarks: ""
      });
    }
  }, [showData, singlePaymentValues, form]);


  const onSubmit: SubmitHandler<z.infer<typeof ApplyPaymentSchema>> = async (values) => {

    const transactionId = values.transaction_id.trim() || singlePaymentValues?.payment?.transaction_id || "";

    try {
      const mutationFn = changePaymentReceiveStatus;
      const res = await mutationFn({
        id: singlePaymentValues?.id,
        ...values,
        transaction_id: transactionId,
      }).unwrap();
      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        onClose();
        Swal.fire({
          title: 'Success!',
          text: "Payment Confirmed Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'

        }).then(() => {
          router.push("/admin/payment-management/payment-list");
        });

      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof ApplyPaymentSchema>, {
          type: 'custom',
          message,
        })
      );
      ToastError(`Failed to ${editMode ? 'Update' : 'Create'}`);
    }
  };

  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[65%] w-[100%] h-[60%] p-0 bg-[#e9e9ea]">
          <div className="overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg">
            <div className="flex items-center justify-between my-3">
              <p className="text-[18px] font-bold">Payment Entry</p>
            </div>
            <div className="border border-t-1 mb-3"></div>

            <div>
              <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormInput
                      name="event_name"
                      label="Event Name"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.event_detail?.event_name}
                      disabled
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name="activity_type"
                      label="Activity Type"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.event_detail?.activity?.name}
                      disabled
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name="user_name"
                      label="User Name"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.user?.name}
                      disabled
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name="mobile"
                      label="Mobile"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.payment?.mobile_number}
                      disabled
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name="amount"
                      label="Amount"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.payment?.amount}
                      disabled
                    />
                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name="date"
                      label="Date"
                      className="placeholder-black"
                      placeholder={singlePaymentValues?.payment?.payment_date}
                      disabled
                    />
                  </div>
                  {/* <div className="col-span-6">
                    <FormDatePicker
                      name="date"
                      label="Date"
                      className="placeholder-black"
                      placeholder='10-12-2024'
                      disabled
                      showIcon={false}
                    />
                  </div> */}
                  {
                    singlePaymentValues?.payment?.payment_method === "digital_payment" && <div className="col-span-6">
                      <FormInput
                        name="payment_by"
                        label="Payment By"
                        className="placeholder-black"
                        placeholder={singlePaymentValues?.payment?.payment_by}
                        disabled
                      />
                    </div>
                  }
                  <div className="col-span-6">
                    <FormInput
                      name="transaction_id"
                      label="Transaction Id"
                      placeholder={singlePaymentValues?.payment?.transaction_id || "Enter Transaction ID"}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormTextArea
                      name="remarks"
                      label="Remarks"
                    />
                  </div>
                  
                  <div className="col-span-12">
                    <FormFileUploadUpdated
                      name="attachment"
                      label="Attachment"
                    />

                    
                  </div>
                  <div className="col-span-12 md:col-span-12 mt-10">
                    <div className="flex justify-end gap-5">
                      <Button
                        type="submit"
                        className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>

              </FormContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PaymentConfirmView;
