'use client';

import FormContainer from '@/components/common/Form/FormContainer';
import FormCsvUpload from '@/components/common/Form/FormCsvUpload';
import useToast from '@/components/common/hooks/useToast';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useCreateSmeIdMutation } from '@/store/features/eventManagement/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { z } from 'zod';


const formSchema = z.object({
  event_id: z.string().nullable(),
  sme_id: z.string().nullable(),
  type: z.string().nullable(),
  file: z.string().nullable(),
});


interface ExcelFileUploadProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: any
}

const ExcelFileUpload: React.FC<ExcelFileUploadProps> = ({ id, open, setOpen, refetch }) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_id: '',
      sme_id: '',
      type: 'xlsx',
      file: '',
    },
  });

  const { ToastError } = useToast();
  const [uploadSMEFile] = useCreateSmeIdMutation();

  const handleDownload = () => {
    const filePath = '/assets/File/attendance.xlsx'; // Correct path relative to the public directory
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'attendance.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {


    try {
      if (!id || !values.file) return ToastError("No file To Upload")

      const mutationFn = uploadSMEFile;
      const res = await mutationFn({
        ...values,
        event_id: id,
        sme_id: id,
        type: 'xlsx'
      }).unwrap();
      if (res.code === 200) {
        form.reset();
        setOpen(false)
        refetch()
        Swal.fire({
          title: 'Success!',
          text: "File Uploaded Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        })
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof formSchema>, {
          type: 'custom',
          message,
        })
      );
      ToastError(`Failed to upload`);
    }

  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="bg-white data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none w-[80%] sm:w-[60%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
          <h1 className="text-4xl text-center font-medium">Upload Files</h1>

          <div className="text-end">
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
              onClick={handleDownload}
            >
              <Icons.download className="text-white " /> <span className='pl-4'> Download Excel File</span>
            </Button>
          </div>

          <div className="mt-10">
            <h2>Import Excel File!</h2>
            <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <FormCsvUpload
                    name="file"
                  />
                </div>

                <div className="col-span-12 md:col-span-12 ">
                  <div className="flex justify-end gap-5">
                    <Button
                      type="submit"
                      className="bg-green-600 text-white font-bold hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                    >
                      Import
                    </Button>
                  </div>
                </div>
              </div>

            </FormContainer>

          </div>

          <Dialog.Close asChild>
            <button
              onClick={() => setOpen(false)}
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExcelFileUpload;
