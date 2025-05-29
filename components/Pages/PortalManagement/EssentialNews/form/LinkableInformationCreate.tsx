"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { EssentialInfoSchema } from "../schema/EssentialInfoSchema";
import { siteConfig } from "@/config/site";
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import { useCreateLinkableInformationMutation, useLinkableInformationUpdateMutation } from "@/store/features/portalManagement/linkableInfo";

type LinkableInfoFormProps = {
};

const LinkableInfoCreateForm: React.FC<LinkableInfoFormProps> = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createEssentilalInfo] = useCreateLinkableInformationMutation();
  const [updateEssentilalInfo] = useLinkableInformationUpdateMutation();
  const router = useRouter()

  const form = useForm<z.infer<typeof EssentialInfoSchema>>({
    resolver: zodResolver(EssentialInfoSchema),
    defaultValues: {
      title: "",
      link: "",
      link_icon: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof EssentialInfoSchema>> = async (
    values
  ) => {
    try {
      const mutationFn = editMode ? updateEssentilalInfo : createEssentilalInfo;
      const link_icon = editMode && (!values.link_icon || !values.link_icon.startsWith('data:'))
        ? showData?.image_path
        : values.link_icon;
      const res = await mutationFn({
        ...values,
        link_icon,
        status: editMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();
      if (res.code === 200) {
        await form.reset();
        closeFormToggle();
        Swal.fire({
          title: 'Success!',
          text: editMode ? "Updated Successfully" : "Created Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        }).then(() => {
          router.push("/admin/portal-management/linkable-information");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof EssentialInfoSchema>, {
            type: "custom",
            message,
          })
      );
      ToastError(`Failed to ${editMode ? "Update" : "Create"}`);
    }
  };


  useEffect(() => {
    if (showData) {
      form.reset({
        ...showData,
        title: showData.title || "",
        link: showData.link || "",
        link_icon: showData?.link_icon ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${showData?.link_icon}` : "",
      });
    }
    
  }, [showData, form]);

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} Essential Information</p>
      </div>
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="title"
                placeholder="Enter Title"
                label="Title"
                remark={true}
                bengaliAllow
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="link"
                placeholder="Enter link"
                label="link"
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormImageUpload name="link_icon" />
            </div>
          </div>
          <div className=" p-4">
            <div className="flex justify-end gap-5">
              {!editMode && (
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

export default LinkableInfoCreateForm;
