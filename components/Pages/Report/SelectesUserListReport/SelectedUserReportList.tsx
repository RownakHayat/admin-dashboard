"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete'
import { FormAutoCompleteByName } from '@/components/common/Form/FormAutoCompleteByName'
import FormContainer from '@/components/common/Form/FormContainer'
import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction'
import { useGetPaymentReportQuery } from '@/store/features/report/paymentReport'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { z } from 'zod'
import { useGetEventDetailsListQuery } from '@/store/features/surveyManagement/surveyDataList'
import SelecteduserListReportTable from './components/SelectedUserListReportTable/SelecteduserListReportTable'
import { useGetSelectedUserListReportQuery } from '@/store/features/report/selectedUserLisetReport'


export const formSchema = z.object({
  event_detail_id: z.string().min(1, { message: "This field is required" }),
});

const SelectedUserReportList = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_detail_id: "",
    },
  });


  const [eventValue, setEventValue] = useState("")
  const [print, setprint] = useState(false)

  const {
    data: selectedUserData,
    isLoading,
    isError,
    refetch,
  } = useGetSelectedUserListReportQuery(({
    ...params,
    event_detail_id: eventValue,

  }))

  const { data: eventName } = useGetEventDetailsListQuery();




  useEffect(() => {
    setEventValue(form.watch('event_detail_id'))
  }, [, form.watch('event_detail_id')])

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
            <p className="text-2xl">Selected User List Report</p>
            {
              print && <Image
                src="/assets/Image/print.svg"
                alt="Reload"
                width={20}
                height={20}
                className='cursor-pointer'
                onClick={() => handleClickToPrint()}
              />
            }

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

      <div ref={componentRef}>
        <SelecteduserListReportTable selecteduserReportData={selectedUserData} setprint={setprint} />
      </div>
    </div>
  )
}

export default SelectedUserReportList
