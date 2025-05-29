
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { useCreateFeedbackMutation } from "@/store/features/feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

export const updateFeedBack = z.object({
  subject: z.string().min(1, { message: "This field is required" }),
  description: z.string().min(1, { message: "This field is required" }),
});

const UpdateFeedBack = ({ id, open, setOpen, rowData }: any) => {

  const form = useForm<z.infer<typeof updateFeedBack>>({
    resolver: zodResolver(updateFeedBack),
    defaultValues: {
      subject: "",
      description: ""
    },
  });


  const { ToastSuccess, ToastError } = useToast()

  const [updateFeedback] = useCreateFeedbackMutation();

  const onSubmit: SubmitHandler<z.infer<typeof updateFeedBack>> = async (values) => {
    try {
      updateFeedback({
        ...values,
        event_id: rowData?.event_detail_id

      }).unwrap()
        .then((res: any) => {
          if (res.code === 200) {
            form.reset();
            setOpen(!open)
            Swal.fire({
              title: "Success!",
              text: rowData?.event_detail?.feedback.length > 0 ? "Feedback Updated Successfully" : "Feedback Added Successfully",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#0b9e45",
            }).then(() => {
              setOpen(!open)
            });
          }
        })
        .catch((err: any) => {
          ToastError("something error")
        })
    } catch (err: any) { }

  };

  useEffect(() => {
    form.reset({
      ...rowData,
      subject: rowData?.event_detail?.feedback[0]?.subject || '',
      description: rowData?.event_detail?.feedback[0]?.description || '',
    });
  }, [rowData, form]);


  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal >
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 " />
        <Dialog.Content className="bg-white rounded data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%] max-h-[85vh] w-1/2 translate-x-[-50%] translate-y-[-50%] rounded-[6px p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">

          <h1 className="text-center font-medium text-4xl border-b-2 pb-3">
            {rowData?.event_detail?.feedback?.length > 0 ? "Update" : "Add"} Feedback
          </h1>
          <div className="grid">
            <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 p-3 bg-[#FCFCFC]  rounded-lg mb-5 space-y-4'>
                {/*<div className="grid grid-cols-4 gap-4">*/}
                {/*  <div className='flex justify-between'>*/}
                {/*    <p>User Name</p>*/}
                {/*    <p>:</p>*/}
                {/*  </div>*/}
                {/*  <div>*/}
                {/*    <p className=' text-[#545454]'>{rowData?.user?.name}</p>*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div className="grid grid-cols-4 gap-4">
                  <div className='flex justify-between'>
                    <p>Event Name</p>
                    <p>:</p>
                  </div>
                  <div>
                    <p className=' text-[#545454]'>{rowData?.event_detail?.event_name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className='flex justify-between'>
                    <p>Program Name</p>
                    <p>:</p>
                  </div>
                  <div>
                    <p className=' text-[#545454]'>{rowData?.event_detail?.program_info?.name_en}</p>
                  </div>
                </div>


                <div className="grid grid-cols-1 border-t-2 p-3 pl-0">
                  <div className="text-[#545454] font-semibold flex gap-2">
                    <FormInput
                      name="subject"
                      label="Subject"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 ">
                  <FormTextArea
                    name="description"
                    label="Description"
                    className={`bg-white border-[1px] rounded-md border-[#cccccc] p-2 text-black`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className=" bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
                >
                  Submit
                </Button>
              </div>
            </FormContainer>
          </div>


          <Dialog.Close asChild>
            <button
              onClick={() => setOpen(!open)}
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default UpdateFeedBack