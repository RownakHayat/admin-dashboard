
"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import FormInput from '@/components/common/Form/FormInput';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetAllDivisionQuery } from '@/store/features/configuration/division';
import { useGetUserProfileReportQuery } from '@/store/features/report/smeUserProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import UserProfileReportComponent from './Components/UserProfileReport';

export const formSchema = z.object({
  sme_id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  division_id: z.string().optional().nullable(),
});

const SMEUserProfileComponent = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sme_id: "",
      name: "",
      mobile: "",
      email: "",
      division_id: "",
    },
  });

  const [smeId, setSmeId] = useState<string | null | undefined>(undefined)
  const [name, setName] = useState<string | null | undefined>(undefined)
  const [mobile, setMobile] = useState<string | null | undefined>(undefined)
  const [email, setEmail] = useState<string | null | undefined>(undefined)
  const [division_id, setDivision_id] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { data: divisionList } = useGetAllDivisionQuery();

  const {
    data: userProfileReport,
    isLoading,
    isError,
    refetch,
  } = useGetUserProfileReportQuery(({
    ...params,
    sme_id: smeId,
    name: name,
    mobile: mobile,
    email: email,
    division_id: division_id,

  }), {
    skip: isInitialRender, // Skip the query on the first render
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setSmeId(values?.sme_id);
    setName(values?.name);
    setMobile(values?.mobile);
    setEmail(values?.email);
    setDivision_id(values?.division_id === "selectAll" ? "" : values?.division_id);
  }

  return (
    <>
      <div className='mx-4'>

        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">SME User Profile Report</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3" >
              <FormInput name='sme_id' label='SME Id' />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3" >
              <FormInput name='name' label='Name' />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3" >
              <FormInput name='mobile' label='Mobile' />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3" >
              <FormInput name='email' label='Email' />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3" >
              <FormAutoCompleteForReport
                name="division_id"
                data={listArrayDaynamicModify(
                  divisionList?.data,
                  "name",
                  "name"
                )}
                label="Division"
                singleListName="name"
                placeholder="Select division"
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
            !isInitialRender && <UserProfileReportComponent userProfileReport={userProfileReport} />
          }
        </div>
      </div>
    </>
  )
}

export default SMEUserProfileComponent