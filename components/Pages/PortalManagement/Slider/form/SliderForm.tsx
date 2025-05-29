"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCreateSliderMutation, useSliderUpdateMutation } from "@/store/features/portalManagement/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { SliderSchema } from "../schemas/sliderSchema";


const SliderForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createSlider] = useCreateSliderMutation();
  const [updateSlider] = useSliderUpdateMutation();
  const router = useRouter()

  const form = useForm<z.infer<typeof SliderSchema>>({
    resolver: zodResolver(SliderSchema),
    defaultValues: {
      title: "",
      description: "",
      image_path: "",
      // hyperlink: "",
      // source: "",
    },
  });

  const onCancelClick = () => {
    router.back();
  };
  const onSubmit: SubmitHandler<z.infer<typeof SliderSchema>> = async (
    values
  ) => {
    try {
      const mutationFn = editMode ? updateSlider : createSlider;
      const image_path = editMode && (!values.image_path || !values.image_path.startsWith('data:'))
        ? showData?.image_path
        : values.image_path;
      const res = await mutationFn({
        ...values,
        image_path,
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
          router.push("/admin/portal-management/slider");
        });

      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof SliderSchema>, {
              type: "custom",
              message,
            })
        );
        Swal.fire({
          title: "Error!",
          text: "Failed to submit the form. Please check the details.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#e53e3e",
        });
      } else { }
    }
  };
  useEffect(() => {
    if (showData) {
      form.reset({
        title: showData.title || "",
        description: showData.description || "",
        // hyperlink: showData.hyperlink || "",
        // source: showData.source || "",
        image_path: showData?.image_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${showData?.image_path}` : "",
      });
    }
  }, [showData, form]);



  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} Slider </p>
      </div>
      <div className="mx-4">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="title"
                placeholder="Enter Title"
                label="Title"
                remark={true}
              />
            </div>
            {/* <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="hyperlink"
                placeholder="Enter hyperlink"
                label="Hyperlink"
              />
            </div> */}
            {/* <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="source"
                placeholder="Enter source"
                label="Source"
              /> */}
            {/* </div> */}
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 ">
              <FormImageUpload name="image_path" />
            </div>
          </div>
          <div className="pb-4">
            <div className="flex justify-end items-end gap-5 ">
              {editMode ? (
                <Button
                  type="button"
                  className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                  onClick={onCancelClick}
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
                className="bg-success hover:bg-success sm:px-7 sm:py-5 md:px-6 md:py-4 lg:px-8 lg:py-4 xl:px-8 xl:py-5 "
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

export default SliderForm;
