import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  useCreateWingSectionMutation,
  useWingSectionUpdateMutation,
} from "@/store/features/configuration/wing";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { WingSectionSchema } from "../schemas/wingSectionSchema";
import { useRouter } from "next/navigation";

type UserTypeFormProps = {
  refetch: () => void;
};

const WingSectionForm: React.FC<UserTypeFormProps> = ({ refetch }) => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createWingSection] = useCreateWingSectionMutation();
  const [updateUserType] = useWingSectionUpdateMutation();
  const router = useRouter();


  const form = useForm<z.infer<typeof WingSectionSchema>>({
    resolver: zodResolver(WingSectionSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof WingSectionSchema>> = async (values) => {
    try {
      const mutationFn = editMode ? updateUserType : createWingSection;
      const res = await mutationFn({
        ...values,
        status: editMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();
      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        refetch();
        ToastSuccess(editMode ? 'Updated Successfully' : 'Created Successfully');
        if (!editMode) closeFormToggle();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof WingSectionSchema>, {
          type: 'custom',
          message,
        })
      );
      ToastError(`Failed to ${editMode ? 'Update' : 'Create'}`);
    }
  };
 const onCancelClick = () => {
    router.back();
  };

  useEffect(() => {
    form.reset({
      ...showData,
      name: showData?.name || '',
    });
  }, [showData, editMode, form]);

  useEffect(() => () => closeFormToggle(), [closeFormToggle]);

  return (
    <div className="w-full bg-[#f5f3fa] rounded my-3">
      <div className="bg-headerbg p-5 mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} Wing/Section</p>
      </div>
      <div className="py-5 mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="2xl:col-span-12 2xl:mt-0 xl:col-span-12 lg:col-span-12  md:col-span-12 md:mt-0 col-span-12">
              <FormInput
                  name="name"
                  placeholder="Enter Wing/Section"
                  label="Name of Wing/Section"
                  remark={true}
              />
            </div>
          </div>

          <div className=" p-4">
            <div className="flex justify-end gap-5">
              {editMode ? (
                  <Button
                      type="button"
                      className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                      // onClick={onCancelClick}
                       onClick={() => {
                        closeFormToggle();
                        form.reset();
                      }}
                  >
                    Cancel
                  </Button>
              ) : (
                  <Button
                      type="button"
                      className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                      onClick={() => {
                        closeFormToggle();
                        form.reset();
                      }}
                  >
                    Clear
                  </Button>
              )}
              <Button
                  type="submit"
                  className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              >
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default WingSectionForm;
