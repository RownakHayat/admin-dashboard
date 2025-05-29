

"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import FormDatePicker from '@/components/common/Form/FormDatePicker';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetSMEUserListQuery, useGetUserLogReportQuery } from '@/store/features/report/userLog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import UserLogReport from './Components/UserLogReport';

export const formSchema = z.object({
  user_id: z.string().optional().nullable(),
  from_date: z.string().min(1, { message: "This field is required" }),
  to_date: z.string().min(1, { message: "This field is required" }),
});

const UserLogComponent = () => {

  const { params } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      from_date: "",
      to_date: "",
    },
  });

  const [userId, setUserId] = useState<string | null | undefined>(undefined)
  const [fromDate, setFromDate] = useState<string | null | undefined>(undefined)
  const [toDate, setToDate] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);
   const { data: smeUserList } = useGetSMEUserListQuery();

  const { data: userLogReport } = useGetUserLogReportQuery(({
    ...params,
    user_id: userId,
    from_date: fromDate,
    to_date: toDate,
  }), {
    skip: isInitialRender,
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);
    setUserId(values?.user_id === "selectAll" ? "" : values.user_id);
    setFromDate(values?.from_date);
    setToDate(values?.to_date);
  }

  return (
    <>
      <div className='mx-4'>
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="bg-headerbg p-5 mb-3 flex justify-between">
                <p className="text-2xl">User Log Report</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormAutoCompleteForReport
                name="user_id"
                data={listArrayDaynamicModify(
                  smeUserList?.data,
                  "name",
                  "name"
                )}
                label="User"
                singleListName="name"
                placeholder="Select User"
                control={form.control}
                staticOptions={[{ value: "selectAll", label: "Select All" }]}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormDatePicker
                name="from_date"
                label="From Date"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4" >
              <FormDatePicker
                name="to_date"
                label="To Date"
                remark={true}
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

        <div >
          {
            !isInitialRender && <UserLogReport userLogReport={userLogReport} />
          }
        </div>
      </div>
    </>
  )
}

export default UserLogComponent