"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete';
import FormContainer from '@/components/common/Form/FormContainer';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetAllWingSectionQuery } from '@/store/features/configuration/wing';
import { useGetAllFinancialYearQuery } from '@/store/features/dashboard';
import { useGenerateStatusReportMutation } from '@/store/features/report/statusReport';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import ReportTable from './Components/ReportTable/ReportTable';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';

export const formSchema = z.object({
  wing_id: z.string().min(1, { message: "This field is required" }),
  fiscal_year_id: z.string().min(1, { message: "This field is required" }),
});


const StatusReportList = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wing_id: "",
      fiscal_year_id: "",
    },
  });

  const [tableData, setTableData] = useState(null)
  const [print, setPrint] = useState(false)

  const { data: getAllWingSection } = useGetAllWingSectionQuery();
  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();

  const [createProgram] = useGenerateStatusReportMutation();


  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    
    try {
      const mutationFn = createProgram;
      const res = await mutationFn({
        ...values,

      }).unwrap();
      if (res.code === 200) {
        await form.reset();
        setTableData(res)
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof formSchema>, {
              type: "custom",
              message,
            })
        );
      } else {
      }
    }

  }


  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Finalcial Year Report",
    onAfterPrint: () => console.log("Print Success"),
  })

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Status Report (MPR)</p>
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
        <div className="col-span-12"  >
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">

              <div className="col-span-6" >
                <FormAutoComplete
                  name="wing_id"
                  data={listArrayDaynamicModify(
                    getAllWingSection?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Wing/Section"
                  placeholder="Select Wing"
                  remark={true}
                  control={form.control}
                />
              </div>
              <div className="col-span-6"  >
                <FormAutoComplete
                  name="fiscal_year_id"
                  data={listArrayDaynamicModify(
                    getAllfiscalYear?.data,
                    "name",
                    "name"
                  )}
                  label="Finalcial Year List"
                  singleListName="name"
                  placeholder="Select Year"
                  remark={true}
                  control={form.control}
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
        </div>
      </div>
      <div>

        <div ref={componentRef}>
          {
            tableData != null || tableData != undefined ? <>
              <ReportTable tableData={tableData} setPrint={setPrint} />
            </> : <></>
          }
        </div>
      </div>
    </div>
  )
}

export default StatusReportList
