
"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetClusterPaginationQuery } from '@/store/features/configuration/cluster';
import { useGetStatisticalSmeUserInfoDataQuery } from '@/store/features/report/statisticalSmeUserInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import StatisticalSMEUserReport from './Components/StatisticalSmeUserReport';

export const formSchema = z.object({
  cluster_id: z.string().optional().nullable(),
});

const StatisticalSmeUserInfo = () => {

  const { params } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cluster_id: "",
    },
  });

  const [clusterId, setClusterId] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);
  const { data: cluster } = useGetClusterPaginationQuery()

  const {
    data: statisticalSMEUserData,
    isLoading,
    isError,
    refetch,
  } = useGetStatisticalSmeUserInfoDataQuery(({
    ...params,
    cluster_id: clusterId,
  }), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setClusterId(values?.cluster_id === "selectAll" ? "" : values.cluster_id);
  }

  return (
    <>
      <div className='mx-4'>
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">Statistical SME User Report</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="cluster_id"
                data={listArrayDaynamicModify(
                  cluster?.data,
                  "name",
                  "name"
                )}
                label="Cluster"
                singleListName="name"
                placeholder="Select Cluster"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>

            <div className="col-span-12 mt-4">
              <div className="flex justify-end gap-5">
                <Button
                  type="button"
                  className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                  onClick={() => { form.reset() }}
                >
                  Clear
                </Button>

                <Button type="submit"
                  className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>

        <div >
          {
            !isInitialRender && <StatisticalSMEUserReport statisticalSMEUserData={statisticalSMEUserData} />
          }
        </div>
      </div>
    </>
  )
}

export default StatisticalSmeUserInfo