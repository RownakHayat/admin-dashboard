"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete'
import { FormAutoCompleteByName } from '@/components/common/Form/FormAutoCompleteByName'
import FormContainer from '@/components/common/Form/FormContainer'
import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction'
import { useGetAllWingSectionQuery } from '@/store/features/configuration/wing'
import { useGetAllFinancialYearQuery } from '@/store/features/dashboard'
import { useGetSummaryReportQuery } from '@/store/features/report/summary-report'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { z } from 'zod'
import SummaryReportTable from './compenents/SummaryReportTable'


export const formSchema = z.object({
    district_id: z.string().min(1, { message: "This field is required" }),
  financial_year_id: z.string().min(1, { message: "This field is required" }),
});

const SummaryReportList = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      district_id: "",
      financial_year_id: "",
    },
  });

  const [id, setId] = useState<string | null>(null);
  const [yearValue, setYearValue] = useState("")
  const [districtValue, setWingValue] = useState("")
  const [print, setprint] = useState(false)

  const {
    data: summarytData,
  } = useGetSummaryReportQuery(({
    ...params,
    financial_year_id: yearValue,
    district_id: districtValue,
  }))

  const { data: wingName } = useGetAllWingSectionQuery();
  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();

  useEffect(() => {
    if (form.watch('financial_year_id')) {
      setYearValue(form.watch('financial_year_id'))
    setWingValue(form.watch('district_id'))
    } else {
      setId(null);
    }

  }, [form.watch('financial_year_id'),form.watch('district_id')])



  // useEffect(() => {
  //   setYearValue(form.watch('financial_year_id'))
  //   setWingValue(form.watch('district_id'))
  // }, [form.watch('financial_year_id'),form.watch('district_id')])

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Summary List Report",
    onAfterPrint: () => console.log("Print Success"),
  })


  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Summary List Report</p>
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
                  name="district_id"
                  data={listArrayDaynamicModify(
                    wingName?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="District List"
                  placeholder="Select"
                  control={form.control}
                  remark={true}
                />
              </div>
              <div className="col-span-12 lg:col-span-4" >
                <FormAutoCompleteByName
                  name="financial_year_id"
                  data={listArrayDaynamicModify(
                    getAllfiscalYear?.data,
                    "name",
                    "name"
                  )}
                  label="Year List"
                  singleListName="name"
                  placeholder="Select Year"
                  control={form.control}
                  remark={true}
                />
              </div>
            </div>
          </FormContainer>
        </div>
      </div>

      <div ref={componentRef}>
      {
          id != null || id != undefined ? <>
        <SummaryReportTable summaryReportData={summarytData} setprint={setprint} />
        </> : <></>
      }
      </div>
    </div>
  )
}

export default SummaryReportList
