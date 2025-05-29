"use client";
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
import { headerFooterFormSchema } from "./headerFooterSchema/headerFooterFormSchema";
import {
  useGetReportDetailQuery,
  useUpdateReportDetailMutation,
} from "@/store/features/configuration/reportHeaderFooter";
import FormEditor from "@/components/common/Form/FormEditor";


const HeaderFooter = () => {
  const { showData, closeFormToggle } = useFormSetting();
  const [updateSetting] = useUpdateReportDetailMutation();
  const router = useRouter();

    const { data: reportDetail, refetch: refetchSlideSetting, isLoading } = useGetReportDetailQuery();
   

  const form = useForm<z.infer<typeof headerFooterFormSchema>>({
    resolver: zodResolver(headerFooterFormSchema),
    defaultValues: {
      header: "",
      footer: "",
    },
  });

  const onUpdateHandler = async (values: any, event: any) => {

    
    try {
      const mutationFn = updateSetting;
      const res = await mutationFn({
        ...values,
        status:1
      }).unwrap();

      if (res.code === 200) {
        form.reset({
          header: res.data.header?.toString() || "",
          footer: res.data.footer?.toString() || "",
        });

        Swal.fire({
          title: "Success!",
          text: "Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/configuration/report-header-footer");
        });
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(
              field as keyof z.infer<typeof headerFooterFormSchema>,
              {
                type: "custom",
                message,
              }
            )
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
  };

    useEffect(() => {
      if (reportDetail) {
        form.reset({
          header: reportDetail?.data?.report_detail?.header || "",
          footer: reportDetail?.data?.report_detail?.footer || "",
        });
        
      }
    }, [reportDetail, form]);

    // Show a loading spinner or message while data is being fetched
    if (isLoading) {
      return <div>Loading...</div>;
    }

  return (
    <div className="w-full bg-[#f5f3fa] rounded my-3">
      <div className="bg-headerbg p-5 mb-3">
        <p className="text-2xl"> Report Details</p>
      </div>
      <div className="mx-4">
        <FormContainer
          form={form}
          onSubmit={form.handleSubmit(onUpdateHandler)}
        >
          <div className="grid grid-cols-12 space-y-10">
            <div className="col-span-12 space-y-3">
              {/* <FormInput
                name="site_title"
                placeholder="Enter Title"
                label="Site Title"
                remark={true}
              /> */}
              <div className="w-full bg-[rgba(12,176,77,0.1)]  text-[rgba(12,176,77,0.1)] rounded-lg">
                <p className="text-gray-600 p-3 text-[18px] font-semibold">
                  Report Header
                </p>
              </div>

              <FormEditor name="header" />
            </div>
            {/* <div className="col-span-12 ">
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
            </div> */}
            <div className="col-span-12 space-y-3">
              {/* <FormInput
                name="address_title"
                placeholder="Enter Address"
                label="Address"
              /> */}
              <div className="w-full bg-[rgba(12,176,77,0.1)]  text-[rgba(12,176,77,0.1)] rounded-lg">
                <p className="text-gray-600 p-3 text-[18px] font-semibold">
                  Report Footer
                </p>
              </div>
              <FormEditor name="footer" />
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

export default HeaderFooter;
