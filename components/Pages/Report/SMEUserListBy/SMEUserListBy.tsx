
"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetBusinessTypePaginationQuery } from '@/store/features/configuration/businessType';
import { useGetClusterPaginationQuery } from '@/store/features/configuration/cluster';
import { useGetIndustrialSectorPaginationQuery } from '@/store/features/configuration/industrialSector';
import { useGetOrganizationTypePaginationQuery } from '@/store/features/configuration/organizationType';
import { useGetUserListByReportQuery } from '@/store/features/report/smeUserListBy';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import UserListByReportComponent from './Components/UserListByReport';

export const formSchema = z.object({
  cluster_id: z.string().optional().nullable(),
   business_sector_id: z.string().optional().nullable(),
  service_type_id: z.string().optional().nullable(),
});

const SMEUserListByComponent = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cluster_id: "",
       business_sector_id:"",
      service_type_id: "",
    },
  });

  const [clusterId, setClusterId] = useState<string | null | undefined>(undefined)
   const [businessSectorId, setBusinessSectorId] = useState<string | null | undefined>(undefined)
  const [serviceTypeId, setServiceTypeId] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);
const { data: industrialSector} = useGetIndustrialSectorPaginationQuery()

  const { data: cluster } = useGetClusterPaginationQuery()
  const { data: businessType } = useGetBusinessTypePaginationQuery()
  const { data: organizationType } = useGetOrganizationTypePaginationQuery()


  const {
    data: userListByIndustryClusterSectorData,
    isLoading,
    isError,
    refetch,
  } = useGetUserListByReportQuery(({
    ...params,
    cluster_id: clusterId,
     business_sector_id: businessSectorId,
    service_type_id: serviceTypeId,
  }), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setClusterId(values?.cluster_id === "selectAll" ? "" : values.cluster_id);
     setBusinessSectorId(values?.business_sector_id === "selectAll" ? "" : values.business_sector_id);
    setServiceTypeId(values?.service_type_id === "selectAll" ? "" : values.service_type_id);
  }

  return (
    <>
      <div className='mx-4'>
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">SME User List by Industry, Sector, Cluster Report</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                 name="business_sector_id"
                data={listArrayDaynamicModify(
                   industrialSector?.data,
                  "name",
                  "name"
                )}
                label="Industrial Sector"
                singleListName="name"
                placeholder="Select Industrial Sector"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
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
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="service_type_id"
                data={listArrayDaynamicModify(
                  businessType?.data,
                  "name",
                  "name"
                )}
                label="Business Type"
                singleListName="name"
                placeholder="Select Business Type"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>
            <div className="col-span-12 mt-4">
              <div className="flex justify-end gap-5">
                <Button
                  type="button"
                  className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                  onClick={() => { form.reset(); }}
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

        <div>
          {
            !isInitialRender && <UserListByReportComponent userListByIndustryClusterSectorData={userListByIndustryClusterSectorData} />
          }
        </div>
      </div>
    </>
  )
}

export default SMEUserListByComponent