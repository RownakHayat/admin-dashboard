"use client"

import FormContainer from "@/components/common/Form/FormContainer";
import FormFileUploadUpdated from "@/components/common/Form/FormFileUploadUpdated";
import FormInput from "@/components/common/Form/FormInput";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { useCashBankDraftPaymentMutation } from "@/store/features/payment";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

export const cashSchema = z.object({
  transaction_id: z.string().min(1, { message: "Transaction id is required" }),
  // mobile_number: z.string().regex(/^01\d{9}$/, { message: "Mobile number must start with 01 and be 11 digits long" })
  //     .optional().nullable(),
  mobile_number: z.string().regex(/^01\d{9}$/, { message: "Mobile number must start with 01 and be 11 digits long" }),
  attachment: z.string().nullable(),
  payment_by: z.string().optional().nullable(),
});

const paymentByRequiredSchema = cashSchema.extend({
  payment_by: z.string().min(1, { message: "Payment by is required" }),
});


interface CashFormProps {
  onClose: () => void;
  queryParams: {
    payment_method: string;
    event_application_id: string;
    event_detail_id?: string;
    amount: string;
  };
}

const digitalPaymentData = [
  { "id": 1, "name": "Bkash" },
  { "id": 2, "name": "Nagad" },
  { "id": 3, "name": "Rocket" },
  { "id": 4, "name": "Others" },
];

const cashForm = ({ onClose, queryParams }: CashFormProps) => {

  const router = useRouter();
  const { ToastError } = useToast();
  const [cashBankDraftPaymentStatus] = useCashBankDraftPaymentMutation();
  const { payment_method } = queryParams;

  const [paymentByMethod, setPaymentByMethod] = useState(false);
  const [paymentByValue, setPaymentByValue] = useState("")


  const formSchema = queryParams.payment_method === "digital_payment" ? paymentByRequiredSchema : cashSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_id: "",
      mobile_number: "",
      payment_by: "",
      attachment: "",
    },
  });



  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {

      try {

        const res = await cashBankDraftPaymentStatus({
          ...queryParams,
          ...values,
          payment_by: paymentByValue,
        }).unwrap();

        if (res.code === 200) {
          form.reset();
          closeFormToggle();
          onClose();
          Swal.fire({
            title: "Success!",
            text: "Payment Successfully Completed",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#0b9e45",
          }).then(() => {
            router.push("/admin/events/new-event-apply");
          });
        }
      } catch (err: any) {
        err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof cashSchema>, {
            type: 'custom',
            message,
          })
        );
        ToastError(`Failed to payment`);
      }
  };

  useEffect(() => {
    setPaymentByMethod(queryParams.payment_method === "digital_payment");
    if (queryParams.payment_method === "digital_payment") {
      form.setValue("payment_by", paymentByValue);
    }
  }, [queryParams, paymentByValue]);

  return (
    <div className="relative p-5 bg-white shadow-lg rounded-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        aria-label="Close"
      >
        &times;
      </button>

      <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          name="transaction_id"
          placeholder="Enter Transaction Number"
          label="Transaction id"
          remark={true}
        />
        <FormInput
          name="mobile_number"
          placeholder="Enter Mobile Number"
          label="Mobile"
          remark={true}
        />

        {
         paymentByMethod && <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1 pb-2" >Payment By</label>
            <div className="relative">

              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  setPaymentByValue(e.target.value)
                  form.setValue("payment_by", e.target.value);
                }}
                value={paymentByValue}
                name="payment_by"
              >
                <option value="" disabled>
                  Select
                </option>
                {digitalPaymentData.map((data) => (
                  <option key={data.id} value={data.name} className="mt-2">
                    {data.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.5 7L10 11.5 14.5 7h-9z" />
                </svg>
              </div>
            </div>
            {form.formState.errors.payment_by && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.payment_by.message}
              </p>
            )}
          </div>
        }

        <FormFileUploadUpdated
          name="attachment"
          label="Attachment"
        />

        <div className="flex justify-center gap-5 mt-4">
          <Button
            type="button"
            className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
            onClick={() => {
              closeFormToggle();
              form.reset();
              setPaymentByValue("");
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
          >
            {payment_method === 'cash' ? <>Cash Payment</> : payment_method === 'bank_draft' ? <>Bank Draft</> : payment_method === 'digital_payment' ? <>Digital Payment</> : <>{null}</>}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default cashForm;
