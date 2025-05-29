"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { useCreateNoticeMutation, useNoticeUpdateMutation } from "@/store/features/portalManagement/notices";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { NoticeSchema } from "../schemas/noticeSchema";

type NoticeFormProps = {
};

const NoticeForm: React.FC<NoticeFormProps> = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createNotice] = useCreateNoticeMutation();
  const [updateNotice] = useNoticeUpdateMutation();
  const router = useRouter()

  const form = useForm<z.infer<typeof NoticeSchema>>({
    resolver: zodResolver(NoticeSchema),
    defaultValues: {
      title: "",
      description: "",
      notice_by: "",
      notice_date: "",
      hyperlink: "",
      source: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof NoticeSchema>> = async (
    values
  ) => {
    try {
      const mutationFn = editMode ? updateNotice : createNotice;
      const res = await mutationFn({
        ...values,
        notice_date: values?.notice_date
          ? moment(values?.notice_date).format("yyyy-MM-DD")
          : "",
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
          router.push("/admin/portal-management/notice");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof NoticeSchema>, {
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
        description: showData.description || "",
        notice_by: showData?.notice_by || '',
        notice_date: showData?.notice_date || '',
        hyperlink: showData.hyperlink || "",
        source: showData.source || "",
      });
    }
  }, [showData, form]);

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} Notice </p>
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
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="description"
                placeholder="Enter Description"
                label="Description"
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="notice_by"
                placeholder="Enter Notice By"
                label="Notice By"
              />
            </div>

            {/* <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <FormImageUpload name="notice_date" />
            </div> */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormDatePicker name="notice_date" label="Notice Date" />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="hyperlink"
                placeholder="Enter Hyperlink"
                label="Hyperlink"
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <FormInput
                name="source"
                placeholder="Enter source"
                label="Source"
              />
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

export default NoticeForm;
