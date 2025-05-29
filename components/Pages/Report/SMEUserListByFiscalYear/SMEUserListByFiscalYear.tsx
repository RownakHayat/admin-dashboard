"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import { FormAutoCompleteForReport } from "@/components/common/FormForReport/FormAutoCompleteForReport";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllFinancialYearQuery } from "@/store/features/dashboard";
import { useGetAllProgramListQuery } from "@/store/features/eventManagement/newProgram";
import { useGetUserListByFiscalYearQuery } from "@/store/features/report/smeUserListFiscalReport";
import {
  useFinancialYearWiseProgramUpdateQuery,
  useGetEventDetailsListQuery,
  useProgramWiseEventListUpdateQuery,
} from "@/store/features/surveyManagement/surveyDataList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import SMEUserListByFiscalYearReport from "./Components/SMEUserListByFiscalYearReport";

export const formSchema = z.object({
  financial_year_id: z.string().optional().nullable(),
  program_detail_id: z.string().optional().nullable(),
  event_detail_id: z.string().optional().nullable(),
});

const SMEUserListyByFiscalYear = () => {
  const { params } = useFormSetting();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financial_year_id: "",
      program_detail_id: "",
      event_detail_id: "",
    },
  });

  const [financialYear, setFinancialYear] = useState<string | null | undefined>(
    undefined
  );
  const [programDetailId, setProgramDetailId] = useState<
    string | null | undefined
  >(undefined);
  const [eventDetailId, setEventDetailId] = useState<string | null | undefined>(
    undefined
  );
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();
  const { data: getAllProgramList } = useGetAllProgramListQuery();
  const { data: getAllEventDetailsList } = useGetEventDetailsListQuery();

  const { data: financialYearWiseProgramList } =
    useFinancialYearWiseProgramUpdateQuery(
      {
        id: form.watch("financial_year_id"),
      }
    );

  const { data: eventListProgramWise } = useProgramWiseEventListUpdateQuery({
    id: form.watch("program_detail_id"),
  });


  const {
    data: uselistByFiscalYearData,
    isLoading,
    isError,
    refetch,
  } = useGetUserListByFiscalYearQuery(
    {
      ...params,
      financial_year_id: financialYear,
      program_detail_id: programDetailId,
      event_detail_id: eventDetailId,
    },
    {
      skip: isInitialRender,
    }
  );

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    setIsInitialRender(false);
    setFinancialYear(
      values.financial_year_id === "selectAll" ? "" : values.financial_year_id
    );
    setProgramDetailId(
      values.program_detail_id === "selectAll" ? "" : values.program_detail_id
    );
    setEventDetailId(
      values.event_detail_id === "selectAll" ? "" : values.event_detail_id
    );
  };

  const [programName, setProgramName] = useState<string | null | undefined>("");

  useEffect(() => {
  const subscription = form.watch((values, { name, type }) => {
    if (name === "financial_year_id" && values.financial_year_id === "") {
      form.setValue("program_detail_id", "");
      form.setValue("event_detail_id", "");
    }

    if (name === "program_detail_id" && values.program_detail_id === "") {
      form.setValue("event_detail_id", "");
    }
  });

  return () => subscription.unsubscribe();
}, [form]);


  return (
    <>
      <div className="mx-4">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">
                  SME User List By Financial Year Report
                </p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
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
            {/* <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="program_detail_id"
                label="Program Name"
                singleListName="name"
                placeholder="Select Program"
                remark={false}
                control={form.control}
                data={listArrayDaynamicModify(
                  getAllProgramList?.data.map(
                    (item: { id: number; name_en: string }) => ({
                      id: item.id,
                      name: item.name_en,
                    })
                  ),
                  "name",
                  "name"
                )}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
                isDisabled={false}
              />
            </div> */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormAutoCompleteForReport
                name="program_detail_id"
                label="Program Name"
                singleListName="name"
                placeholder="Select Program"
                remark={false}
                control={form.control}
                data={listArrayDaynamicModify(
                  financialYearWiseProgramList?.data.map(
                    (item: { id: number; name_en: string }) => ({
                      id: item.id,
                      name: item.name_en,
                    })
                  ),
                  "name",
                  "name"
                )}
                isDisabled={false}
              />
            </div>
            {/* <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="event_detail_id"
                label="Event Name"
                singleListName="name"
                placeholder="Select Event"
                remark={false}
                control={form.control}
                data={listArrayDaynamicModify(
                  getAllEventDetailsList?.data.map(
                    (item: { id: number; event_name: string }) => ({
                      id: item.id,
                      name: item.event_name,
                    })
                  ),
                  "name",
                  "name"
                )}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
                isDisabled={false}
              />
            </div> */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormAutoCompleteForReport
                name="event_detail_id"
                label="Event Name"
                singleListName="name"
                placeholder="Select Event"
                remark={false}
                control={form.control}
                data={listArrayDaynamicModify(
                  eventListProgramWise?.data.map(
                    (item: { id: number; event_name: string }) => ({
                      id: item.id,
                      name: item.event_name,
                    })
                  ),
                  "name",
                  "name"
                )}
                isDisabled={false}
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
          {
              !isInitialRender && <SMEUserListByFiscalYearReport
                  uselistByFiscalYearData={uselistByFiscalYearData}
              />
          }

        </div>
      </div>
    </>
  );
};

export default SMEUserListyByFiscalYear;
