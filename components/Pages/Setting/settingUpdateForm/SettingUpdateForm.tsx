"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useGetAllHomePageInfoQuery } from "@/store/features/portalManagement/homePageInfo";
import { useSettingUpdateMutation } from "@/store/features/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { SettingSchema } from "../schemas/settingSchema";

const fallbackImageUrl = "/assets/Image/SMEF-Logo.png";

const SettingUpdateForm = () => {
  const { showData, closeFormToggle } = useFormSetting();
  const [updateSetting] = useSettingUpdateMutation();
  const router = useRouter()

  const { data: slideSetting, refetch, isLoading } = useGetAllHomePageInfoQuery();

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      site_title: "",
      address_title: "",
      copy_right: "",
      site_logo: fallbackImageUrl,
      govt_logo: fallbackImageUrl,
      meta_description: "",
      description: "",
      keywords: "",
      address_1: "",
      address_2: "",
      phone_other_details: "",
      map_source: "",
    },
  });

  const onUpdateHandler = async (values: any, event: any) => {
    try {
      const mutationFn = updateSetting;
      const res = await mutationFn({
        ...values,
      }).unwrap();

      if (res.code === 200) {
        form.reset({
          site_title: res.data.site_title?.toString() || "",
          address_title: res.data.address_title || "",
          copy_right: res.data.copy_right || "",
          site_logo: res.data.site_logo || "",
          govt_logo: res.data.govt_logo || "",
          meta_description: res.data.meta_description || "",
          description: res.data.description || "",
          keywords: res.data.keywords || "",
          address_1: res.data.address_1 || "",
          address_2: res.data.address_2 || "",
          map_source: res.data.map_source || "",
          phone_other_details: res.data.phone_other_details || "",
        });

        Swal.fire({
          title: 'Success!',
          text: "Updated Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        }).then(() => {
          router.push("/admin/setting");
        });
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof SettingSchema>, {
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
      }
    }
  }


  useEffect(() => {
    if (slideSetting) {
      form.reset({
        site_title: slideSetting?.data?.site_info?.site_title || "",
        address_title: slideSetting?.data?.site_info?.address_title || "",
        copy_right: slideSetting?.data?.site_info?.copy_right || "",
        site_logo: slideSetting?.data?.site_info?.site_logo
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${slideSetting?.data?.site_info?.site_logo}`
          : fallbackImageUrl,
        govt_logo: slideSetting?.data?.site_info?.govt_logo
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${slideSetting?.data?.site_info?.govt_logo}`
          : fallbackImageUrl,
        meta_description: slideSetting?.data?.site_info?.meta_description || "",
        keywords: slideSetting?.data?.site_info?.keywords || "",
        address_1: slideSetting?.data?.site_info?.address_1 || "",
        address_2: slideSetting?.data?.site_info?.address_2 || "",
        phone_other_details: slideSetting?.data?.site_info?.phone_other_details || "",
        map_source: slideSetting?.data?.site_info?.map_source || "",
      });

    }
  }, [slideSetting, form]);

  // Show a loading spinner or message while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">Update Setting </p>
      </div>
      <div className="mx-4">
        <FormContainer
          form={form}
          onSubmit={form.handleSubmit(onUpdateHandler)}
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 ">
              <FormInput
                name="site_title"
                placeholder="Enter Title"
                label="Site Title"
                remark={true}
              />
            </div>
            <div className="col-span-12">
              <FormInput
                name="address_title"
                placeholder="Enter Address"
                label="Address"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormInput
                name="copy_right"
                placeholder="Enter Copy Right"
                label="Copy Right"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormInput
                name="meta_description"
                placeholder="Enter Meta Description"
                label="Meta Description"
              />
            </div>
            <div className="col-span-12">
              <FormTextArea
                name="description"
                className="w-full h-[70px] px-2 rounded-lg border"
                label="Description"
              />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="keywords"
                placeholder="Enter Keywords"
                label="Keywords"
              />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="address_1"
                placeholder="Enter Address One"
                label="Address One"
              />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput
                name="address_2"
                placeholder="Enter Address Two"
                label="Address Two"
              />
            </div>
            <div className="col-span-12">
              <FormTextArea
                name="map_source"
                className="w-full h-[70px] px-2 rounded-lg border"
                placeholder="Enter Map Source"
                label="Map Source"
              />

            </div>
            <div className="col-span-12">
              <FormTextArea
                name="phone_other_details"
                placeholder="Enter Other Details"
                label="Other Details"
                className="w-full h-[70px] px-2 rounded-lg border"
              />


            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormImageUpload name="site_logo" label="Site Logo" remark={true}/>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormImageUpload name="govt_logo" label="Govt. Logo" remark={true}/>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex justify-end items-end gap-5 ">
              {
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
              }
              <Button
                type="submit"
                className="bg-success hover:bg-success sm:px-7 sm:py-5 md:px-6 md:py-4 lg:px-8 lg:py-4 xl:px-8 xl:py-5 "
              >
                Save
              </Button>

            </div>
          </div>

        </FormContainer>
      </div>
    </div>
  );
};

export default SettingUpdateForm;
