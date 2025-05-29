"use client"

import FormContainer from '@/components/common/Form/FormContainer'
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport'
import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction'
import { Button } from '@/components/ui/button'
import { useGetFeedbackReportQuery } from '@/store/features/report/feedbackReport'
import { useGetEventDetailsListQuery } from '@/store/features/surveyManagement/surveyDataList'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FeedbackreportTable from './components/FeedbackreportTable'

export const formSchema = z.object({
  event_detail_id: z.string().optional().nullable(),
});

const FeedbackReportList = () => {

  const { params } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_detail_id: "",
    },
  });

  // const [eventValue, setEventValue] = useState("")
  const [eventValue, setEventValue] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);

  const {
    data: feedbackData,
    isLoading,
    isError,
    refetch,
  } = useGetFeedbackReportQuery(({ ...params, event_detail_id: eventValue}), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const { data: eventName } = useGetEventDetailsListQuery();

  // useEffect(() => {
  //   const event = form.watch("event_detail_id");
  //   setEventValue(form.watch('event_detail_id'))

  //   if (event) {
  //     setIsInitialRender(false);
  //   }
  // }, [, form.watch('event_detail_id')])

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
      setIsInitialRender(false);
      setEventValue(values?.event_detail_id === "selectAll" ? "" : values.event_detail_id);
    }

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Feedback Report</p>
          </div>
        </div>

        <div className="col-span-12" >
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-4">
                <FormAutoCompleteForReport
                  name="event_detail_id"
                  data={listArrayDaynamicModify(eventName?.data, "event_name", "event_name")}
                  singleListName="event_name"
                  label="Event List"
                  placeholder="Select"
                  control={form.control}
                  staticOptions={[{ value: "selectAll", label: "Select All" }]}
                />
              </div>
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
          </FormContainer>
        </div>
      </div>

      <div >
        {
          !isInitialRender && <FeedbackreportTable feedbackReportData={feedbackData} />
        }
      </div>
    </div>
  )
}

export default FeedbackReportList
