"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import { FormAutoCompleteForReport } from "@/components/common/FormForReport/FormAutoCompleteForReport";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllFinancialYearQuery } from "@/store/features/dashboard";
import { useGetAttendanceReportQuery } from "@/store/features/report/attendanceReport";
import {
  useGetEventDetailsListQuery,
  useGetProgramListQuery,
} from "@/store/features/surveyManagement/surveyDataList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ReportTable from "./Components/ReportTable.tsx/ReportTable";
import ReportTableUpdate from "./Components/ReportTable.tsx/ReportTableUpdate";

export const formSchema = z.object({
  financial_year_id: z.string().optional().nullable(),
  event_detail_id: z.string().optional().nullable(),
  program_detail_id: z.string().optional().nullable(),
});

const AttendanceReportList = () => {
  const { params } = useFormSetting();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financial_year_id: "",
      event_detail_id: "",
      program_detail_id: "",
    },
  });

  const [yearValue, setYearValue] = useState<string | null | undefined>(
    undefined
  );
  const [eventValue, setEventValue] = useState<string | null | undefined>(
    undefined
  );
  const [programValue, setProgramValue] = useState<string | null | undefined>(
    undefined
  );
  const [isInitialRender, setIsInitialRender] = useState(true);

  const {
    data: attendanceReportData,
    isLoading,
    isError,
    refetch,
  } = useGetAttendanceReportQuery(
    {
      ...params,
      financial_year_id: yearValue,
      event_detail_id: eventValue,
      program_detail_id: programValue,
    },
    {
      skip: isInitialRender, // Skip the query on the first render
    }
  );

  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();
  const { data: programName } = useGetProgramListQuery();
  const { data: eventName } = useGetEventDetailsListQuery();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    setIsInitialRender(false);
    setYearValue(
      values?.financial_year_id === "selectAll" ? "" : values.financial_year_id
    );
    setEventValue(
      values?.event_detail_id === "selectAll" ? "" : values.event_detail_id
    );
    setProgramValue(
      values?.program_detail_id === "selectAll" ? "" : values.program_detail_id
    );
  };

  const handleReset = () => {
    form.reset();
    setIsInitialRender(true)
  };

  return (
    <div className="mx-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Attendance Report</p>
          </div>
        </div>

        <div className="col-span-12">
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-4">
                <FormAutoCompleteForReport
                  name="financial_year_id"
                  label="Financial Year"
                  singleListName="name"
                  placeholder="Select Year"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    getAllfiscalYear?.data,
                    "name",
                    "name"
                  )}
                  staticOptions={[{ value: "selectAll", label: "Select All" }]}
                  isDisabled={false}
                />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <FormAutoCompleteForReport
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
                  staticOptions={[{ value: "selectAll", label: "Select All" }]}
                />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <FormAutoCompleteForReport
                  name="event_detail_id"
                  label="Event Name"
                  singleListName="event_name"
                  placeholder="Select Event"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    eventName?.data,
                    "event_name",
                    "event_name"
                  )}
                  staticOptions={[{ value: "selectAll", label: "Select All" }]}
                  isDisabled={false}
                />
              </div>

              <div className="col-span-12 mt-4">
                <div className="flex justify-end gap-5">
                  <Button
                    type="button"
                    className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                    onClick={() => {
                      handleReset();
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
        </div>
      </div>

      <div>
        {
          // !isInitialRender && <ReportTable attendanceReportData={attendanceReportData} />
          !isInitialRender && (
            <ReportTableUpdate attendanceReportData={attendanceReportData} />
          )
        }
      </div>
    </div>
  );
};

export default AttendanceReportList;
