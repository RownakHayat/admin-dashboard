"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormInput from "@/components/common/Form/FormInput";
import FormUserImageUpload from "@/components/common/Form/FormUserImageUpload";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCreateNewsMutation, useNewsUpdateMutation } from "@/store/features/portalManagement/news";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { NewsSchema } from "../schemas/userTypeSchema";

type NewsFormProps = {

};

const NewsForm: React.FC<NewsFormProps> = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createNews] = useCreateNewsMutation();
  const [updateUserNews] = useNewsUpdateMutation();
  const router = useRouter()

  const form = useForm<z.infer<typeof NewsSchema>>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: "",
      description: "",
      reporter: "",
      news_date: "",
      image_path: "",
      hyperlink: "",
      source: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof NewsSchema>> = async (values) => {
    const baseURL = siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || "";

    const newsImagePath = values?.image_path.startsWith(baseURL)
      ? values?.image_path.replace(baseURL, "")
      : values?.image_path;


    try {
      const mutationFn = editMode ? updateUserNews : createNews;
      const res = await mutationFn({
        ...values,
        status: editMode ? showData?.status : 1,
        news_date: values?.news_date
          ? moment(values?.news_date).format("yyyy-MM-DD")
          : "",
        id: showData?.id,
        image_path: newsImagePath,
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
          router.push("/admin/portal-management/news");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof NewsSchema>, {
            type: "custom",
            message,
          })
      );
      ToastError(`Failed to ${editMode ? "Update" : "Create"}`);
    }
  };


  useEffect(() => {
    form.reset({
      ...showData,
      title: showData?.title || '',
      description: showData?.description || '',
      reporter: showData?.reporter || '',
      news_date: showData?.news_date || '',
      hyperlink: showData?.hyperlink || '',
      source: showData?.source || '',
      image_path: showData?.image_path
        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${showData?.image_path
        }`
        : "",
    });


  }, [showData, editMode, form]);


  // useEffect(() => () => closeFormToggle(), [closeFormToggle]);

  // useEffect(() => () => closeFormToggle(), [closeFormToggle]);


  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} News </p>
      </div>
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 ">
              <FormInput
                name="title"
                placeholder="Enter Title"
                label="Title"
                remark={true}
              />
            </div>
            <div className="col-span-4 ">
              <FormInput
                name="description"
                placeholder="Enter Description"
                label="Description"
                remark={true}
              />
            </div>
            <div className="col-span-4 ">
              <FormInput
                name="reporter"
                placeholder="Enter Notice By"
                label="Reporter"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {/* <div className="col-span-4 ">
            <FormImageUpload name="notice_date" />
            </div> */}
            <div className="col-span-4 ">
              <FormDatePicker name="news_date" label="News Date" />
            </div>
            <div className="col-span-4 ">
              <FormInput
                name="hyperlink"
                placeholder="Enter Hyperlink"
                label="Hyperlink"
              />
            </div>
            <div className="col-span-4 ">
              <FormInput
                name="source"
                placeholder="Enter source"
                label="Source"
              />
            </div>
            <div className="col-span-4 ">
              {/* <FormImageUpload name="image_path" remark={true} /> */}
              <FormUserImageUpload name="image_path" />
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

export default NewsForm;
