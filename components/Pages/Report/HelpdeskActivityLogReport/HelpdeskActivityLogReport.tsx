"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePickerToDateBigerThenFromDate from "@/components/common/Form/FormDatePickerIsUpToTheCurrentDate";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Button } from "@/components/ui/button";
import { useGetHelpdeskActivityLogReportQuery } from "@/store/features/report/helpdeskActivityLogReport";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import HelpdeskActivityLogReport from "./Components/HelpdeskActivityLogReport";

// Zod schema for validation
export const formSchema = z.object({
  from_date: z.string().min(1, { message: "This field is required" }),
  to_date: z.string().min(1, { message: "This field is required" }),
});

const HelpdeskActivityLog = () => {
  const { params } = useFormSetting();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_date: "",
      to_date: "",
    },
  });

  const [isInitialRender, setIsInitialRender] = useState(true);

  const {
    data: helpdeskActivityData,
    isLoading,
    isError,
    refetch,
  } = useGetHelpdeskActivityLogReportQuery(
    {
      ...params,
      from_date: form.watch("from_date"), // Watch for `from_date`
      to_date: form.watch("to_date"), // Watch for `to_date`
    },
    {
      skip: isInitialRender,
    }
  );

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
  };

  return (
    <div>
      <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4 px-3">
          <div className="col-span-12">
            <div className="bg-headerbg p-5 mb-3 flex justify-between">
              <p className="text-2xl">Helpdesk Activity Log Report</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <FormDatePickerToDateBigerThenFromDate
              name="from_date"
              label="From Date"
              remark={true}
              maxDate={form.watch("to_date") || undefined}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <FormDatePickerToDateBigerThenFromDate
              name="to_date"
              label="To Date"
              remark={true}
              minDate={form.watch("from_date") || undefined}
              maxDate={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-span-12 mt-4">
            <div className="flex justify-end gap-5">
              <Button
                type="button"
                className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                onClick={() => {
                  form.reset();
                }}
              >
                Clear
              </Button>

              <Button
                type="submit"
                className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      </FormContainer>

      <div>
        {!isInitialRender && (
          <HelpdeskActivityLogReport helpdeskActivityData={helpdeskActivityData} />
        )}
      </div>
    </div>
  );
};

export default HelpdeskActivityLog;
