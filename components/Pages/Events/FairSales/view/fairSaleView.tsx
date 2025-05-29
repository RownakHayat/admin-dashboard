
"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import useToast from '@/components/common/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetFairSalesViewQuery, useUpdateFairSaleMutation } from '@/store/features/events/fairSales';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { z } from 'zod';


export const formSchema = z.object({
  fair_sale: z.string().optional().nullable().refine((value) => value === null || value === '' || !isNaN(Number(value)) && Number(value) >= 0, {
    message: "Fair sale must be a non-negative number",
  }),
  order_from_fair: z.string().optional().nullable().refine((value) => value === null || value === '' || !isNaN(Number(value)) && Number(value) >= 0, {
    message: "Fair sale must be a non-negative number",
  }),
});

const EventFairSaleView = ({ id, viewData, refetch }: any) => {

  const { data: listQuery, isLoading } = useGetFairSalesViewQuery(id);
  const [updateFairSale] = useUpdateFairSaleMutation(viewData?.id);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fair_sale: "",
      order_from_fair: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(false)

  useEffect(() => {
    form.reset({
      fair_sale: viewData?.fair_sale || "",
      order_from_fair: viewData?.order_from_fair || "",
    });
  }, [listQuery, form, id]);

  const { ToastSuccess, ToastError } = useToast();

  const onUpdateHandler: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {

    if (values.fair_sale == '') return setAmount(true)

    try {
      const res = await updateFairSale({
        ...values,
        id: viewData?.id,
      }).unwrap();
      if (res.code === 200) {
        if (viewData?.fair_sale > 0) {
          Swal.fire({
            title: 'Success!',
            text: "Fair Sales Amount Updated Successfully",
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#0b9e45'
          })
          // ToastSuccess('Fair Sales Amount Updated Successfully');
        } else {
          Swal.fire({
            title: 'Success!',
            text: "Fair Sales Amount Added Successfuly",
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#0b9e45'
          })
          // ToastSuccess('Fair Sales Amount Added Successfuly');
        }

        setIsModalOpen(false);
        refetch()
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) => {
            if (field && message) {
              form.setError(field as keyof z.infer<typeof formSchema>, {
                type: "custom",
                message,
              });
            } else {
            }
          }
        );
      } else {
        ToastError("An error occurred");
      }
    }
  };


  return (
    <div>
      <span className="cursor-pointer">
        <DG open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className='m-0 p-0'>
            <div className="text-center cursor-pointer">
              <div className="text-blue-600 font-bold">
                <p className='text-[#1C64F2] cursor-pointer'>
                  <Button type='button' className="cursor-pointer w-24 rounded-lg bg-blue-500 py-2 px-4" >
                    {/* {viewData?.fair_sale > 0 ? "Update" : "Add"} + */}
                    Fair Sales
                  </Button>
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[65%] w-[100%] h-[95%] p-0 bg-[#e9e9ea]">
            <div className='absolute right-0 top-0  w-[100%] rounded-t-lg p-2'>
              {/* <p className='text-right mr-9 mt-1 flex justify-end'>Print <span className='ml-2'><Printer /></span></p> */}
            </div>

            <div className='overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg'>
              <div className='flex items-center justify-between my-3'>
                <p className='text-[18px] font-bold'> {viewData?.fair_sale > 0 ? "Update" : "Add"} Fair Sales</p>
              </div>
              <div className='border border-t-1'></div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Event Name</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>{viewData?.event_detail?.event_name}</div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Activity Type</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>{viewData?.event_detail?.activity?.name}</div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Info Type</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>
                  {
                    viewData?.event_detail?.info_type === 1 ? <span>None</span> :
                      viewData?.event_detail?.info_type === 2 ? <span>Public</span> :
                        viewData?.event_detail?.info_type === 3 ? <span>Association</span> : <span>No condition met</span>
                  }
                </div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Start Date</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>
                  {`${moment(viewData?.event_detail?.start_date || "").format("DD MMM YYYY")}`}
                </div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>End Date</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>
                  {/* {`${moment(listQuery?.data?.end_date || "").format("DD MMM YYYY")}`} */}
                  {`${moment(viewData?.event_detail?.end_date || "").format("DD MMM YYYY")}`}
                </div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Sales Amount</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>{viewData?.fair_sale}</div>
              </div>
              <div className='grid grid-cols-12 gap-2  my-2'>
                <div className='col-span-2'>Venue</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>{viewData?.event_detail?.venue}</div>
              </div>

              <div className='border border-t-1'></div>
              <div className='grid grid-cols-12 gap-2  my-2 mt-3 mb-3'>
                <div className='col-span-2'>Details</div>
                <div className='col-span-1'>:</div>
                <div className='col-span-3'>{viewData?.event_detail?.remarks}</div>
              </div>
              <hr />
              <FormContainer
                form={form}
                onSubmit={form.handleSubmit(onUpdateHandler)}
              >

                <div className=' my-2'>
                  <p className=''>Total Sales Amount</p>
                  {/* <Input name='fair_sale' placeholder='' className='p-3 my-3' /> */}
                  <Input
                    {...form.register('fair_sale')}
                    placeholder=''
                    className='p-3 my-3'
                  />
                  {form.formState.errors.fair_sale?.message && typeof form.formState.errors.fair_sale.message === 'string' && (
                    <p className="text-red-600 text-left">{form.formState.errors.fair_sale.message}</p>
                  )}
                  {/* {amount && <p className="text-red-600 text-left">Can not add Empty Value</p>} */}
                  {/* bug no: 15580 */}
                  {amount && <p className="text-red-600 text-left">Amount is required</p>}
                </div>
                <div className=' my-2'>
                  <p className=''>Order from Fair</p>
                  <Input
                    {...form.register('order_from_fair')}
                    placeholder=''
                    className='p-3 my-3'
                  />
                  {form.formState.errors.order_from_fair?.message && typeof form.formState.errors.order_from_fair.message === 'string' && (
                    <p className="text-red-600 text-left">{form.formState.errors.order_from_fair.message}</p>
                  )}
                </div>
                <div className=' flex justify-end'>
                  <Button type='submit' className="cursor-pointer  rounded-lg bg-green-600 py-2 px-4">Save</Button>
                </div>
              </FormContainer>

            </div>
          </DialogContent>
        </DG>
      </span>
    </div>
  )
}

export default EventFairSaleView