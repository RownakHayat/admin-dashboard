import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  useCreateUserTypeMutation,
  useUserTypeUpdateMutation,
} from "@/store/features/configuration/UserType";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { userCreateSchema } from "../schemas/userCreateSchema";

type UserCreateFormProps = {
  refetch: () => void;
};

const UserCreateForm: React.FC<UserCreateFormProps> = ({ refetch }) => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createUserType] = useCreateUserTypeMutation();
  const [updateUserType] = useUserTypeUpdateMutation();

  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      user_role_id: "",
      user_name: "",
      user_type_id: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof userCreateSchema>> = async (
    values
  ) => {
    // try {
    //   const mutationFn = editMode ? updateUserType : createUserType;
    //   const res = await mutationFn({
    //     ...values,
    //     status: editMode ? showData?.status : 1,
    //     id: showData?.id,
    //   }).unwrap();
    //   if (res.code === 200) {
    //     await form.reset();
    //     closeFormToggle();
    //     refetch();
    //     ToastSuccess(
    //       editMode ? "Updated Successfully" : "Created Successfully"
    //     );
    //     if (!editMode) closeFormToggle();
    //   }
    // } catch (err: any) {
    //   err?.data?.errors?.forEach(
    //     ({ field, message }: { field: string; message: string }) =>
    //       form.setError(field as keyof z.infer<typeof userCreateSchema>, {
    //         type: "custom",
    //         message,
    //       })
    //   );
    //   ToastError(`Failed to ${editMode ? "Update" : "Create"}`);
    // }
  };


  useEffect(() => {
    form.reset({
      ...showData,
      email: showData?.email || '',
      mobile: showData?.mobile || '',
      password: showData?.password || '',
      confirm_password: showData?.confirm_password || '',
      user_role_id: showData?.user_role_id || '',
      user_name: showData?.user_name || '',
      user_type_id: showData?.user_type_id || '',
      // gender_id: user?.data?.user_profile?.gender_id.toString() || "",
    });
    return () => closeFormToggle();
  }, [showData, editMode, form, closeFormToggle]);





  useEffect(() => () => closeFormToggle(), [closeFormToggle]);

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} User Type </p>
      </div>
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div className="">
              <div className="col-span-12 md:col-span-6">
                <FormInput
                  name="name"
                  placeholder="Enter User Type"
                  label="User Type"
                  remark={true}
                />
              </div>
            </div>
            <div className=" p-4">
              <div className="flex justify-end gap-5">
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
                <Button
                  type="submit"
                  className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                >
                  {editMode ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default UserCreateForm;
