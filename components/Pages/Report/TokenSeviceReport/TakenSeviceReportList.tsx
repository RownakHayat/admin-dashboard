"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete'
import FormContainer from '@/components/common/Form/FormContainer'
import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction'
import { useGetTakenServicetReportQuery } from '@/store/features/report/tokenServiceReport'
import { useGetEventDetailsListQuery } from '@/store/features/surveyManagement/surveyDataList'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { z } from 'zod'
import TokenReportTable from './Components/TokenReportTable/TokenReportTable'


export const formSchema = z.object({
  event_detail_id: z.string().min(1, { message: "This field is required" }),
});

const TakenSeviceReportList = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_detail_id: "",
    },
  });

  const [id, setId] = useState<string | null>(null);
  const [eventValue, setEventValue] = useState("")


  const {
    data: takenServiceData,
    isLoading,
    isError,
    refetch,
  } = useGetTakenServicetReportQuery({
    ...params,
    event_detail_id: eventValue,

  })

  const { data: eventName } = useGetEventDetailsListQuery();


  useEffect(() => {
    if (form.watch('event_detail_id')) {
      setId(form.watch('event_detail_id'))
    } else {
      setId(null);
    }

  }, [form.watch('event_detail_id')])


  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Selected User List Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Taken Service Report</p>
          </div>
        </div>

        <div className="col-span-12" >
          <FormContainer form={form}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-4">
                <FormAutoComplete
                  name="event_detail_id"
                  data={listArrayDaynamicModify(eventName?.data, "event_name", "event_name")}
                  singleListName="event_name"
                  label="Event List"
                  placeholder="Select"
                  control={form.control}
                />
              </div>

            </div>
          </FormContainer>
        </div>
      </div>

      <div >
      {
          id != null || id != undefined ? <>
        <TokenReportTable takenServiceReportData={takenServiceData} />
        </> : <></>
        }
      </div>
    </div>
  )
}

export default TakenSeviceReportList
