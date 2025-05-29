import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllDistrictQuery } from "@/store/features/configuration/district";
import {
  useCreateUpazillaMutation,
  useUpazillaUpdateMutation,
} from "@/store/features/configuration/upazila";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { upazilaSchema } from "../schemas/upazilaSchema";
import { useRouter } from "next/navigation";

type UserTypeFormProps = {
  refetch: () => void;
};

const UpazilaForm: React.FC<UserTypeFormProps> = ({ refetch }) => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const [createUpazila] = useCreateUpazillaMutation();
  const [updateUpazila] = useUpazillaUpdateMutation();
  const router = useRouter();
  const { data: districtList } = useGetAllDistrictQuery();

  const form = useForm<z.infer<typeof upazilaSchema>>({
    resolver: zodResolver(upazilaSchema),
    defaultValues: {
      name: "",
      district_id: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof upazilaSchema>> = async (
    values
  ) => {
    try {
      const mutationFn = editMode ? updateUpazila : createUpazila;
      const res = await mutationFn({
        ...values,
        status: editMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();
      if (res.code === 200) {
        closeFormToggle();
        form.reset();
        refetch();
        ToastSuccess(
          editMode ? "Updated Successfully" : "Created Successfully"
        );
        if (!editMode) closeFormToggle();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          form.setError(field as keyof z.infer<typeof upazilaSchema>, {
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
      name: showData?.name || "",
      district_id: showData?.district_id?.toString() || "",
    });
  }, [showData, editMode, form]);

  useEffect(() => () => closeFormToggle(), [closeFormToggle]);

  return (
    <div className="w-full bg-[#f5f3fa] rounded my-3">
      <div className="bg-headerbg p-5 mb-3">
        <p className="text-2xl">{editMode ? "Update" : "Create"} Upazila</p>
      </div>
      <div className="py-5 mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-2 mt-0 items-center">
            <div className="col-span-12 md:col-span-4">
              <FormInput
                name="name"
                placeholder="Enter Upazila"
                label="Upazila"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <FormAutoComplete
                name="district_id"
                data={listArrayDaynamicModify(
                  districtList?.data,
                  "district",
                  "name"
                )}
                singleListName="district"
                label="Select District"
                placeholder="Select District"
                control={form.control}
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-4 mt-10">
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
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default UpazilaForm;
