"use client"

import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete'
import FormContainer from '@/components/common/Form/FormContainer'
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport'
import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction'
import { Button } from '@/components/ui/button'
import { useGetAllWingSectionQuery } from '@/store/features/configuration/wing'
import { useGetAllFinancialYearQuery } from '@/store/features/dashboard'
import { useGetProgramReportQuery } from '@/store/features/report/programReport'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import ProgramReportTable from './components/ProgramReportTable'

export const formSchema = z.object({
  wing_id: z.string().optional().nullable(),
  financial_year_id: z.string().min(1, { message: "This field is required" }),
});

const PogramListReport = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wing_id: "",
      financial_year_id: "",
    },
  });

  const [yearValue, setYearValue] = useState<string | null | undefined>(undefined)
  const [wingValue, setWingValue] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { params } = useFormSetting()
  const { data: getAllWingSection } = useGetAllWingSectionQuery();
  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();

  const { data: programReportData } = useGetProgramReportQuery(({
    ...params,
    wing_id: wingValue,
    financial_year_id: yearValue
  }), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setWingValue(values?.wing_id === "selectAll" ? "" : values.wing_id)
    setYearValue(values?.financial_year_id === "selectAll" ? "" : values.financial_year_id)
  }

  return (
    <div className='mx-4'>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">Program List Reports</p>
          </div>

        </div>
        <div className="col-span-12"  >
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6"  >
                <FormAutoComplete
                  name="financial_year_id"
                  data={listArrayDaynamicModify(
                    getAllfiscalYear?.data,
                    "name",
                    "name"
                  )}
                  label="Finalcial Year "
                  singleListName="name"
                  placeholder="Select Year"
                  remark={true}
                  control={form.control}
                 />
              </div>
              <div className="col-span-6" >
                <FormAutoCompleteForReport
                  name="wing_id"
                  data={listArrayDaynamicModify(
                    getAllWingSection?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Wing/Section"
                  placeholder="Select Wing"
                  remark={false}
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
        </div>
      </div>

      <div>
        {
          !isInitialRender && <ProgramReportTable programReportData={programReportData} />
        }
      </div>

    </div>
  )
}

export default PogramListReport
