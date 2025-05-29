"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetFinancialYearPaginationQuery } from '@/store/features/configuration/financialYear';
import { useGetWingSectionPaginationQuery } from '@/store/features/configuration/wing';
import { useGetNewEventQuery } from '@/store/features/dashboard';
import { useGetNewProgramQuery } from '@/store/features/eventManagement/newProgram';
import { useGetEventWiseSelectedUserQuery } from '@/store/features/report/eventWiseSelectedUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import EventWiseSelectedUserReport from './Components/EventWiseSelectedUserReport';

export const formSchema = z.object({
  wing_id: z.string().optional().nullable(),
  financial_year_id: z.string().optional().nullable(),
  program_detail_id: z.string().optional().nullable(),
  event_detail_id: z.string().optional().nullable(),
});

const EventWiseSelectedUserComponent = () => {

  const { params } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wing_id: "",
      financial_year_id: "",
      program_detail_id: "",
      event_detail_id: "",
    },
  });

  const [wingId, setWingId] = useState<string | null | undefined>(undefined)
  const [financialYearId, setFinancialYearId] = useState<string | null | undefined>(undefined)
  const [programDetailId, setProgramDetailId] = useState<string | null | undefined>(undefined)
  const [eventIetailId, setEventIetailId] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [print, setprint] = useState(false)

  const { data: wingsData } = useGetWingSectionPaginationQuery()
  const { data: financialYearData } = useGetFinancialYearPaginationQuery()
  const { data: programData } = useGetNewProgramQuery()
  const { data: eventData } = useGetNewEventQuery();

  const {
    data: eventWiseSelectedUserList,
    isLoading,
    isError,
    refetch,
  } = useGetEventWiseSelectedUserQuery(({
    ...params,
    wing_id: wingId,
    financial_year_id: financialYearId,
    program_detail_id: programDetailId,
    event_detail_id: eventIetailId,

  }), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setWingId(values?.wing_id === "selectAll" ? "" : values.wing_id);
    setFinancialYearId(values?.financial_year_id === "selectAll" ? "" : values.financial_year_id);
    setProgramDetailId(values?.program_detail_id === "selectAll" ? "" : values.program_detail_id);
    setEventIetailId(values?.event_detail_id === "selectAll" ? "" : values.event_detail_id);
  }

  return (
    <>
      <div className='mx-4'>
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">Event Wise Selected User Report</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="wing_id"
                data={listArrayDaynamicModify(
                  wingsData?.data,
                  "name",
                  "name"
                )}
                label="Wings"
                singleListName="name"
                placeholder="Select Wings"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="financial_year_id"
                data={listArrayDaynamicModify(
                  financialYearData?.data,
                  "name",
                  "name"
                )}
                label="Financial Year"
                singleListName="name"
                placeholder="Select Financial Year"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="program_detail_id"
                data={listArrayDaynamicModify(
                  programData?.data,
                  "name_en",
                  "name_en"
                )}
                label="Program"
                singleListName="name_en"
                placeholder="Select Program"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="event_detail_id"
                data={listArrayDaynamicModify(
                  eventData?.data,
                  "event_name",
                  "event_name"
                )}
                label="Event"
                singleListName="event_name"
                placeholder="Select Event"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
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
            !isInitialRender && <EventWiseSelectedUserReport eventWiseSelectedUserList={eventWiseSelectedUserList} setprint={setprint} />
          }
        </div>
      </div>
    </>
  )
}

export default EventWiseSelectedUserComponent