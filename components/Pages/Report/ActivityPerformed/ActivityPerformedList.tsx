"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete';
import FormContainer from '@/components/common/Form/FormContainer';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { useGetAllFinancialYearQuery } from '@/store/features/dashboard';
import { useGetActivityPerformedReportByIdQuery } from '@/store/features/report/activityPerformed';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { z } from 'zod';
import ReportTable from './Components/ReportTable.tsx/ReportTable';

export const formSchema = z.object({
  finalcial_id: z.string().min(1, { message: "This field is required" }),
});


const ActivityPerformedList = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      finalcial_id: ""
    },
  });

  const [id, setId] = useState<string | null>(null);
  const [print, setprint] = useState(false)

  useEffect(() => {
    if (form.watch('finalcial_id')) {
      setId(form.watch('finalcial_id'))
    } else {
      setId(null);
    }

  }, [form.watch('finalcial_id')])

  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();

  const {
    data: activityReportData,
  } = useGetActivityPerformedReportByIdQuery(id, {
    skip: id === null || id === undefined
  });

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Activity Performed Other than AWP",
    onAfterPrint: () => console.log("Print Success"),
  })


  return (
    <div>
      <div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="bg-headerbg p-5 mb-3 flex justify-between">
              <p className="text-2xl">Activity Performed Other than AWP</p>
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
          <div className="col-span-6"  >
            <FormContainer form={form}>
              <FormAutoComplete
                name="finalcial_id"
                data={listArrayDaynamicModify(
                  getAllfiscalYear?.data,
                  "name",
                  "name"
                )}
                label="Finalcial Year List"
                singleListName="name"
                placeholder="Select Year"
                control={form.control}
              />
            </FormContainer>
          </div>
        </div>
        <div ref={componentRef}>
          {
            id != null || id != undefined ? <>
              <ReportTable activityReportData={activityReportData} setprint={setprint} />
            </> : <></>
          }
        </div>
      </div>
    </div>
  )
}

export default ActivityPerformedList
