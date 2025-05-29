"use client";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { Button } from "@/components/ui/button";
import {
  useUpdateHeaderSocialLinkMutation
} from "@/store/features/portalManagement/homePageInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { HeaderLinkSchemas } from "../schemas/HeaderLinkSchemas";

const fallbackImageUrl = "/assets/Image/SMEF-Logo.png";

const HeaderSocialLink = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();

  // const [socialLinkStatusChange] = useChangeHeaderSocialLinkStatusMutation();
  const [updateHeaderSocialLink] = useUpdateHeaderSocialLinkMutation();


  const { ToastSuccess } = useToast();
  const router = useRouter();

  const socialLink = {
    same_tab: "",
    title: null,
    icon_class: null,
    link: null,
  };

  const form = useForm<z.infer<typeof HeaderLinkSchemas>>({
    resolver: zodResolver(HeaderLinkSchemas),
    defaultValues: {
      social_link: [socialLink],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "social_link",
  });

  const onSubmitHandlerUpdate: SubmitHandler<
    z.infer<typeof HeaderLinkSchemas>
  > = async (values) => {
    try {
      const res = await updateHeaderSocialLink({
        ...values,
        // id: showData?.id,
      }).unwrap();

      if (res.code === 200) {
        await form.reset();
        ToastSuccess("Successfully Updated");
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err.data.errors.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof HeaderLinkSchemas>, {
              type: "custom",
              message,
            })
        );
      }
    }
  };

  useEffect(() => {
    if (showData) {
      form.reset({
        social_link: [socialLink],
      });
    }
  }, [showData, form]);


  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className="mb-3">
        <p className="text-2xl">Update Header Social Link</p>
      </div>
      <div className="mx-4">
        <FormContainer
          form={form}
          onSubmit={form.handleSubmit(onSubmitHandlerUpdate)}
        >
          {fields.map((field, index) => (
            <>
              <div className="grid grid-cols-12 gap-3">
                <div key={field.id} className="col-span-12 md:col-span-6">
                  <FormInput
                    name={`social_link.${index}.same_tab`}
                    placeholder="Same Tab"
                    label="Same Tab"
                    remark={true}
                  />
                </div>
                <div key={field.id} className="col-span-12 md:col-span-6">
                  <FormInput
                    name={`social_link.${index}.title`}
                    placeholder="Enter Title"
                    label="Title OF Header Link"
                  />
                </div>
                <div key={field.id} className="col-span-12 md:col-span-6">
                  <FormInput
                    name={`social_link.${index}.icon_class`}
                    placeholder="Enter Icon Class"
                    label="Icon Class"
                  />
                </div>
                <div key={field.id} className="col-span-12 md:col-span-6">
                  <FormInput
                    name={`social_link.${index}.link`}
                    placeholder="Enter Link"
                    label="Link OF Header Link"
                  />
                </div>
                <div className="col-span-12 md:col-span-12 flex justify-end items-center gap-2">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded-md mt-2"
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="bg-green-700 text-white rounded-lg p-1 w-[120px] text-center cursor-pointer mt-3"
                    onClick={() => append(socialLink)}
                  >
                    Add More
                  </Button>
                </div>
              </div>
            </>
          ))}

          <div className="pb-4">
            <CheckPermission subMod={'header_social_link'} permission={'header_social_link_edit'}>

            <div className="flex justify-end items-end gap-5">
              <Button type="submit" className="bg-success p-3">
                Update
              </Button>
            </div>
            </CheckPermission>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default HeaderSocialLink;
