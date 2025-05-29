"use client"
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormInput from "@/components/common/Form/FormInput";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllActivitiesQuery } from "@/store/features/configuration/activities";
import { useGetNewEventQuery } from "@/store/features/eventManagement/newEvent";
import { useGetAllFinancialYearQuery, useGetNewProgramQuery } from "@/store/features/eventManagement/newProgram";
import { useCashPaymentQuery, usePaymentInfoQuery } from "@/store/features/payment";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { PaymentBkashSchema } from "../schemas/paymentSchema";
import BKashForm from "./bKashForm";
import CashForm from "./cashForm"

const PaymentBkashNagadForm = ({ data }: any) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');


  const { data: paymentInfo } = usePaymentInfoQuery(id);


  const { data: getAllFinancialYear } = useGetAllFinancialYearQuery();
  const { data: getAllActivities } = useGetAllActivitiesQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: programName } = useGetNewProgramQuery()
  const { data: eventName, refetch, isLoading } = useGetNewEventQuery();


  const form = useForm<z.infer<typeof PaymentBkashSchema>>({
    resolver: zodResolver(PaymentBkashSchema),
    defaultValues: {
      financial_year_id: "",
      program_detail_id: "",
      event_detail_id: "",
      activity_id: "",
      start_date: "",
      end_date: "",
      total_payable: ""
    },
  });

  useEffect(() => {
    if (paymentInfo) {
      form.reset({
        financial_year_id: paymentInfo?.data?.event_detail?.program_info?.financial_year_id.toString() || "",
        program_detail_id: paymentInfo?.data?.event_detail?.program_detail_id.toString() || "",
        activity_id: paymentInfo?.data?.event_detail?.activity_id.toString() || "",
        event_detail_id: paymentInfo?.data?.event_detail_id.toString() || "",
        total_payable: paymentInfo?.data?.total_payable?.toString() || "",
        start_date: paymentInfo?.data?.event_detail?.start_date || "",
        end_date: paymentInfo?.data?.event_detail?.end_date || "",
      });
    }
  }, [paymentInfo, form]);


  const [activeDiv, setActiveDiv] = useState<'bkash' | 'cash' | 'bank_draft' | 'digital_payment'>('bkash');
  const [buttonText, setButtonText] = useState("Bkash Payment");
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [iscashModalOpen, setIsCashModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");

  const handleDivClick = (paymentType: 'bkash' | 'cash' | 'bank_draft' | 'digital_payment') => {
    setActiveDiv(paymentType);
    if (paymentType === 'bkash') {
      setButtonText("Bkash Payment");
    } else if (paymentType === 'cash') {
      setButtonText("Cash Payment");
    } else if (paymentType === 'bank_draft') {
      setButtonText("Bank Draft");
    } else if (paymentType === 'digital_payment') {
      setButtonText("Digital Payment");
    }
  };



  const [queryParams, setQueryParams] = useState<{ gateway: string, event_application_id: string, amount: string, mobile: string, transaction_id?: string, event_detail_id?: string } | null>(null);
  const { data: cashpaymentData, error } = useCashPaymentQuery(queryParams!, { skip: !queryParams });

  const [cashParams, setCashParams] = useState<{ payment_method: string, event_application_id: string, amount: string,event_detail_id?: string } | null>(null);

  // useEffect(() => {
  //   if (cashpaymentData && !error) {
  //     handleSuccessResponse();
  //   } else if (error) {
  //     // Handle the error case if needed
  //   }
  // }, [cashpaymentData, error]);



  // const handleSuccessResponse = async () => {
  //   await form.reset();
  //   closeFormToggle();
  //   Swal.fire({
  //     title: "Success!",
  //     text: "Payment Successfully Completed",
  //     icon: "success",
  //     confirmButtonText: "OK",
  //     confirmButtonColor: "#0b9e45",
  //   }).then(() => {
  //     router.push("/admin/events/new-event-apply");
  //   });
  // };

  const onSubmit: SubmitHandler<z.infer<typeof PaymentBkashSchema>> = async (values) => {

    if (!activeDiv) {
      return;
    }

    const event_application_id = id || '';
    const amount = values.total_payable?.toString() || '0';
    const event_detail_id = values.event_detail_id?.toString() || '0';
    // Check if the selected payment method is Bkash
    if (activeDiv === 'bkash') {
      setIsBkashModalOpen(true);
    } else {
      setIsCashModalOpen(true);

      // setIsBkashModalOpen(false);
      setCashParams({
        payment_method: activeDiv,
        event_application_id,
        event_detail_id,
        amount,
      });

    }
  };
  const handleMobileSubmit = async (mobile: string) => {
    const event_application_id = id || '';
    const amount = form.getValues("total_payable")?.toString() || '0';
    const event_detail_id = form.getValues("event_detail_id")?.toString() || '0';


    setQueryParams({
      gateway: activeDiv,
      event_application_id,
      amount,
      event_detail_id,
      mobile,
      transaction_id: "cyx56Hjk",
    });
    setIsBkashModalOpen(false);
  };


  return (
    <div>

      <h2 className="text-[22px]">Payment</h2>
      <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 ">
            <FormAutoComplete
              name="financial_year_id"
              data={listArrayDaynamicModify(getAllFinancialYear?.data, "name", "name")}
              singleListName="name"
              label="Financial Year"
              placeholder="Enter Financial Year"
              control={form.control}
              isDisabled={true}
            />
          </div>
          <div className="col-span-6 ">
            <FormAutoComplete
              name="program_detail_id"
              data={listArrayDaynamicModify(
                programName?.data,
                "name_en",
                "name_en"
              )}
              singleListName="name_en"
              label="Program Name"
              placeholder="Select"
              control={form.control}
              isDisabled={true}
            />

          </div>
          <div className="col-span-6">
            <FormAutoComplete
              name="event_detail_id"
              data={listArrayDaynamicModify(
                eventName?.data,
                "name_en",
                "event_name"
              )}
              singleListName="name_en"
              label="Event Name"
              placeholder="Select"
              control={form.control}
              isDisabled={true}
            />

          </div>
          <div className="col-span-6">
            <FormAutoComplete
              name="activity_id"
              data={listArrayDaynamicModify(
                getAllActivities?.data,
                "name",
                "name"
              )}
              singleListName="name"
              label="Activity Type"
              placeholder="Select"
              control={form.control}
              isDisabled={true}
            />
          </div>
          <div className="col-span-6">
            <FormDatePicker name="start_date" label="Event Time Schedule (Start Date)" showIcon={false} disabled />
          </div>
          <div className="col-span-6">
            <FormDatePicker name="end_date" label="Event Time Schedule (End Date)" showIcon={false} disabled />
          </div>
          <div className="col-span-6">
            <FormInput name="total_payable" label="Amount"  disabled />
          </div>
        </div>


        <div className="mt-5 border border-spacing-2 rounded-lg p-4 bg-white">
          <h2>Select Payment Method</h2>
          <div className="flex items-center gap-4 mt-5">
            {/* <DG open={activeDiv === 'dialog'} onOpenChange={(open) => setActiveDiv(open ? 'dialog' : null)}>
              <DialogTrigger className='m-0 p-0'>
                fdg
              </DialogTrigger>
              <DialogContent className="max-w-[50%] w-[100%] p-4 bg-[#e9e9ea]">
                <BKashForm />
              </DialogContent>
            </DG> */}
            <div
              onClick={() => handleDivClick('bkash')}
              className={`border border-spacing-2 rounded-lg p-5 h-[100px] flex items-center cursor-pointer ${activeDiv === 'bkash' ? 'border-2 border-green-600' : ''}`}
            >
              <Image
                priority={true}
                src="/assets/Image/bKash.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="w-[150px]"
                title="bkash"
              />
            </div>
            <div
              onClick={() => handleDivClick('cash')}
              className={`flex justify-center items-center border border-spacing-2 rounded-lg p-5 h-[100px] cursor-pointer ${activeDiv === 'cash' ? 'border-2 border-green-600' : ''}`}
            >
              <Image
                priority={true}
                src="/assets/Image/cash.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="w-[150px]"
                title="Cash Payment"
              />
            </div>
            <div
              onClick={() => handleDivClick('bank_draft')}
              className={`flex justify-center items-center border border-spacing-2 rounded-lg p-5 h-[100px] cursor-pointer ${activeDiv === 'bank_draft' ? 'border-2 border-green-600' : ''}`}
            >
              <Image
                priority={true}
                src="/assets/Image/bankDraft.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="w-[150px]"
                title="Bank Payment"
              />
            </div>
            <div
              onClick={() => handleDivClick('digital_payment')}
              className={`flex justify-center items-center border border-spacing-2 rounded-lg p-5 h-[100px] cursor-pointer ${activeDiv === 'digital_payment' ? 'border-2 border-green-600' : ''}`}
            >
              <Image
                priority={true}
                src="/assets/Image/digitalPay.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="w-[150px]"
                title="Digital Payment/ Other Account Payment"
              />
            </div>
          </div>
        </div>

        <div className=" p-4">
          <div className="flex justify-end gap-5">
            {/* Bug #15007
            <Button
              type="button"
              className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              onClick={() => {
                closeFormToggle();
                form.reset();
              }}
            >
              Clear
            </Button> */}
            <Button
              type="submit"
              className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </FormContainer>

      {/* Modal for BKash Form */}
      {isBkashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5">
            <BKashForm onClose={() => setIsBkashModalOpen(false)} onSubmitMobile={handleMobileSubmit} />
            <Button onClick={() => setIsBkashModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
     {/* Modal for Cash/Bank Draft Form */}
      {iscashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 sm:w-[60%] lg:w-[50%] 2xl:w-[30%]">
            <CashForm
            onClose={() => setIsCashModalOpen(false)} 
            queryParams={cashParams!}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default PaymentBkashNagadForm