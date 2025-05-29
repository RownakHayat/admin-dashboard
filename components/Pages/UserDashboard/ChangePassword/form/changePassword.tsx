"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import FormChangePassword from "@/components/common/Form/FormChangePassword";
import { Button } from "@/components/ui/button";
import { usePasswordChangeMutation } from "@/store/features/UserManagement/changePassowrd";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordFormSchema } from "../schema/formSchema";
import Swal from "sweetalert2";
import Cookies from "js-cookie"

const ChangePassword = ({}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordChange] = usePasswordChangeMutation();
  const { data: user } = useAuthUserQuery();

  const router = useRouter();

  const form = useForm<z.infer<typeof ChangePasswordFormSchema>>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      mobile: "",
      old_password: "",
      new_password: "",
    },
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof ChangePasswordFormSchema>
  > = async (values) => {
    try {
      const mutationFn = passwordChange;
      const res = await mutationFn({
        ...values,
      }).unwrap();

      if (res.code === 200) {
        Swal.fire({
          title: "Success!",
          text: "Password Changed Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          form.reset();
          router.push("/");
          Cookies.remove("token")
            Cookies.remove("email")
              
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(
            field as keyof z.infer<typeof ChangePasswordFormSchema>,
            {
              type: "custom",
              message,
            }
          )
      );
    }
  };

  useEffect(() => {
    if (user?.data?.mobile) {
      form.reset({
        mobile: user?.data?.mobile || "",
      });
    }
  }, [user?.data?.mobile, form]);

  return (
    <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <div className=" mb-3 ">
        <p className="sm:text-md lg:text-[25px] font-bold">Change Password</p>
      </div>
      <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <FormInput
              name="mobile"
              placeholder="Enter Mobile Number"
              label="Mobile Number"
              remark={true}
              disabled
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            {/* <FormInput
                            name="password"
                            placeholder="Enter New Password"
                            label="New Password"
                            type="password"
                            remark={true}
                        /> */}
            <FormChangePassword
              name="old_password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter Old Password"
              label="Old Password"
              remark={true}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            {/* <FormInput
                            name="confirm_password"
                            placeholder="Enter Confirm New password"
                            type="password"
                            label="Confirm New password"
                            remark={true}
                        /> */}
            <FormChangePassword
              name="new_password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter New Password"
              label=" New password"
              remark={true}
            />
          </div>
          <div className="col-span-12">
            <div className="flex justify-end">
              <Button type="submit" className="bg-success px-4">
                Save
              </Button>
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default ChangePassword;
