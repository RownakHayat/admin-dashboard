"use client";
import React, { useState, useEffect } from 'react';
import FormContainer from "@/components/common/Form/FormContainer";
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import FormInput from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useGetAllHomePageInfoQuery, useUpdateSliderSittingMutation } from "@/store/features/portalManagement/homePageInfo";
import useToast from "@/components/common/hooks/useToast";
import { sliderSittingSchemas } from '../schemas/sliderSittingSchemas';
import { siteConfig } from '@/config/site';


const fallbackImageUrl = "/assets/Image/SMEF-Logo.png";

const SideSettingForm = () => {
  const { data: slideSetting, refetch: refetchSlideSetting } = useGetAllHomePageInfoQuery();
  const [updateSliderSitting] = useUpdateSliderSittingMutation();
  const { ToastSuccess } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof sliderSittingSchemas>>({
    resolver: zodResolver(sliderSittingSchemas),
    defaultValues: {
      site_title: "",
      address_title: "",
      copy_right: "",
      site_logo: fallbackImageUrl,
      govt_logo: fallbackImageUrl,
      meta_description: "",
      keywords: "",
      address_1: "",
      address_2: "",
      map_source: "",
    },
  });

  const onSubmitHandlerUpdate: SubmitHandler<
    z.infer<typeof sliderSittingSchemas>
  > = async (values) => {
    try {
      const res = await updateSliderSitting({
        ...values,
        site_logo: values.site_logo || fallbackImageUrl,
        govt_logo: values.govt_logo || fallbackImageUrl,
      }).unwrap();

      if (res.code === 200) {
        await form.reset();
        ToastSuccess("Successfully Updated");
        router.push("/admin/portal-management/slide-setting");
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err.data.errors.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof sliderSittingSchemas>, {
              type: "custom",
              message,
            })
        );
      }
    }
  };
  const onCancelClick = () => {
    router.back();
  };


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
        map_source: slideSetting?.data?.site_info?.map_source || "",
      });
    }
  }, [slideSetting, form]);

  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className="mb-3">
        <p className="text-2xl">Update Slide Setting</p>
      </div>
      <div className="mx-4">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmitHandlerUpdate)}>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="site_title" placeholder="Site Title" label="Site Title" remark={true} />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="address_title" placeholder="Address Title" label="Address Title" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="copy_right" placeholder="Copy Right" label="Copy Right" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="meta_description" placeholder="Meta Description" label="Meta Description" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="keywords" placeholder="Keywords" label="Keywords" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="address_1" placeholder="Address 1" label="Address 1" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="address_2" placeholder="Address 2" label="Address 2" />
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <FormInput name="map_source" placeholder="Map Source" label="Map Source" />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-6 w-full">
              <div className="w-[50%] h-10">
              <FormImageUpload name="site_logo" label="Site Logo" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-6 w-full">
              <div className="w-[40%]">
              <FormImageUpload name="govt_logo" label="Government Logo" />
              </div>
            </div>
          </div>
          <div className="pb-4">
            <div className="flex justify-end items-end gap-5">
              <Button type="submit" className="bg-success p-3">Update</Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default SideSettingForm;
