"use client";

import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import SignFormUpload from "@/components/common/Form/signFormUpload";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  useAuthUserQuery,
  useUpdateAdminProfileMutation,
} from "@/store/features/UserManagement/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./schemas/formSchema";
import ImageCropper from "@/components/common/ImageCopper/ImageCropper";

type RegistrationFormProps = {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminProfileEdit = ({ setIsRegistering }: any) => {
  const { showData, editMode, closeFormToggle } = useFormSetting();

  const { data: user, refetch: refetchUser } = useAuthUserQuery();

  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const oldPhoneNumber = user?.data?.mobile || "";
  const { ToastSuccess } = useToast();
  const router = useRouter();
  const [userProfileUpdate] = useUpdateAdminProfileMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_image_path: "",
      name: "",
      nid: "",
      email: "",
      mobile: "",
      sme_office_id: "",
    },
  });
  const onSubmitHandlerUpdate: SubmitHandler<
    z.infer<typeof formSchema>
  > = async (values) => {
    const baseURL =
      siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || "";

    const ProfileImagePath = values?.profile_image_path?.startsWith(baseURL)
      ? values?.profile_image_path.replace(baseURL, "")
      : values?.profile_image_path ?? "";

    const signatureImagePath = values?.signature_image_path?.startsWith(baseURL)
      ? values?.signature_image_path.replace(baseURL, "")
      : values?.signature_image_path ?? "";

    try {
      const mutationFn = userProfileUpdate;
      const res = await mutationFn({
        ...values,
        id: showData?.id,
        profile_image_path: ProfileImagePath,
        signature_image_path: signatureImagePath,
        mobile: user?.data?.mobile || "",
      }).unwrap();
      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        ToastSuccess(
          editMode ? "Updated Successfully" : "Updated Successfully"
        );
        if (!editMode) closeFormToggle();
        router.push("/admin/user-dashboard/admin-profile");
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof formSchema>, {
            type: "custom",
            message,
          })
      );
    }
  };

  useEffect(() => {
    if (user) {
      const constructedProfileImageUrl = user?.data?.user_profile
        ?.profile_image_path
        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.profile_image_path
        }`
        : "";

      form.reset({
        profile_image_path: constructedProfileImageUrl,

        name: user?.data?.name?.toString() || "",
        nid: user?.data?.user_profile?.nid?.toString() || "",
        email: user?.data?.email || "",
        mobile: user?.data?.mobile || "",
        sme_office_id:
          user?.data?.user_profile?.sme_office_id?.toString() || "",
        signature_image_path: user?.data?.user_profile?.signature_image_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.signature_image_path
          }`
          : "",
      });
    }
  }, [user, form]);

  const handleClearAll = () => {
    form.setValue("name", "");
    form.setValue("nid", "");
    form.setValue("sme_office_id", "");
  };

  return (
    <div className="bg-[#ffffff] w-full">
      <h2 className="text-[#5D586C] p-5">Edit Profile</h2>
      <div className="border border-spacing-1"></div>
      <div className="my-4 lg:p-5">
        <FormContainer
          form={form}
          onSubmit={form.handleSubmit(onSubmitHandlerUpdate)}
        >
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-12 md:col-span-2 mt-0 w-full p-5">
              {/* <ImageFormUpload
                name="profile_image_path"
                label="Profile Image"
                remark={false}
                cropWidth={500}
                cropHeight={300}
                initialImage={
                  user?.data?.user_profile?.profile_image_path
                    ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                      ?.IMAGE_URL
                    }${user?.data?.user_profile?.profile_image_path}`
                    : undefined
                }
                userId={user?.data?.id}
              /> */}
              <ImageCropper
                 name="profile_image_path"
                 label="Profile Image"
                 remark={false}
                 cropWidth={500}
                 cropHeight={300}
                 initialImage={
                   user?.data?.user_profile?.profile_image_path
                     ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                       ?.IMAGE_URL
                     }${user?.data?.user_profile?.profile_image_path}`
                     : undefined
                 }
                 userId={user?.data?.id}
              />
            </div>
            <div className="col-span-12 md:col-span-9 p-5">
              <ol className="list-decimal">
                {/*<li className="text-red-600 text-[12px]">*/}
                {/*  The size of the photograph is 300 X 300 pixels.*/}
                {/*</li>*/}
                <li className="text-red-600 text-[12px]">
                  File size is less than 2 MB
                </li>
                <li className="text-red-600 text-[12px]">
                  Supported file formats are JPEG, JPG and PNG
                </li>
              </ol>
            </div>
            <div className="col-span-12 md:col-span-12 mt-0">
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            </div>
            <div className="col-span-12 md:col-span-12 mt-0 p-5">
              <div className="flex items-center">
                <p className="text-[20px] text-[#767676]">
                  Personal Information
                </p>
                <div className="flex-grow border-t border-gray-300 ml-4"></div>
              </div>
            </div>
            {/* Personal Information start */}
            <div className="col-span-12 md:col-span-12 mt-0 bg-[#f9f9f9] mx-3">
              <div className="grid grid-cols-12 items-center gap-4 p-5">
                <div className="col-span-12 md:col-span-6 ">
                  <FormInput name="name" label="User Name" remark={true} />
                </div>
                <div className="col-span-12 md:col-span-6 ">
                  <p className="text-[#504f4f]">User ID</p>
                  <p className="border border-spacing-2 rounded-lg p-[8px] mt-[5px]">
                    {user?.data?.user_profile?.user_id}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                  <FormInput name="sme_office_id" label="SME Office ID" />
                </div>
                <div className="col-span-12 md:col-span-6 ">
                  <FormInput
                    name="email"
                    value={user?.data?.email}
                    label="Email"
                    disabled
                  />
                </div>
                <div className="col-span-12 md:col-span-6 ">
                  <FormInput
                    name="mobile"
                    value={user?.data?.mobile}
                    label="Mobile"
                    disabled
                  />
                </div>
                <div className="col-span-12 md:col-span-6 ">
                  <FormInput name="nid" label="NID No.:" />
                </div>
                <div className="col-span-12 md:col-span-12 ">
                  {/* <SignFormUpload
                    name="signature_image_path"
                    label="Signature"
                    remark={false}
                    cropWidth={80}
                    cropHeight={80}
                    initialImage={
                      user?.data?.user_profile?.signature_image_path
                        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                          ?.IMAGE_URL
                        }${user?.data?.user_profile?.signature_image_path}`
                        : undefined
                    }
                    userId={user?.data?.id}
                  /> */}
                  <SignFormUpload
                    name="signature_image_path"
                    label="Signature"
                    remark={false}
                    cropWidth={80}
                    cropHeight={80}
                    initialImage={
                      user?.data?.user_profile?.signature_image_path
                        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                          ?.IMAGE_URL
                        }${user?.data?.user_profile?.signature_image_path}`
                        : undefined
                    }
                    userId={user?.data?.id}
                  />
                  <p className="text-red-600 text-[12px] text-center">
                    The size of signature is 80 X 80 pixels
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 sm:items-center lg:items-end w-full p-5">
            <div className="col-span-12 md:col-span-12 mt-8 flex justify-center lg:justify-end">
              <div className=" gap-3 flex justify-center">
                <Button
                  type="button"
                  className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                  onClick={() => handleClearAll()}
                >
                  Clear all
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2b7d74] hover:bg-[#2b7d74] p-5   "
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default AdminProfileEdit;
