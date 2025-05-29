"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Button } from "@/components/ui/button";
import { useCreateUsersRollMutation, useUsersRollUpdateMutation } from "@/store/features/UserManagement/Roll";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { userRollSchema } from "./schemas/userRollSchema";

const CreateRollForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createUserRoll] = useCreateUsersRollMutation();
  const [updateUserType] = useUsersRollUpdateMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof userRollSchema>>({
    resolver: zodResolver(userRollSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof userRollSchema>> = async (values) => {
    try {
      const mutationFn = editMode ? updateUserType : createUserRoll;
      const res = await mutationFn({
        ...values,
        status: editMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();

      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        Swal.fire({
          title: 'Success!',
          text: editMode ? "User Role Updated Successfully" : "Role Created Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        }).then(() => {
          router.push("/admin/user-management/role");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof userRollSchema>, {
          type: "custom",
          message,
        })
      );
    }
  };

  useEffect(() => {
    if (showData) {
      form.reset({
        name: showData.name || "",
      });
    }
  }, [showData, form]);

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className="mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} User Role</p>
      </div>
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="col-span-12 md:col-span-6">
                <FormInput
                  name="name"
                  placeholder="Enter User Role"
                  label="User Role"
                  remark
                />
              </div>
            </div>
            <div className="p-4">
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
                  {editMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default CreateRollForm;
