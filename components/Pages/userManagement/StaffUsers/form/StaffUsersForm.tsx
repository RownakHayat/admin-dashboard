"use client"
import { FormAutoCompleteMultiSelect } from "@/components/common/Form/FormAutoCompleteMultiSelect";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllWingSectionQuery } from "@/store/features/configuration/wing";
import { useCreateStaffUsersMutation, useGetSpecificStaffUserQuery, useStaffUsersUpdateMutation } from "@/store/features/UserManagement/staffUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { StaffUsersSchema } from "../schemas/staffUsersSchema";


const StaffUsersForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createStaffUsers] = useCreateStaffUsersMutation();
  const [updateStaffUsers] = useStaffUsersUpdateMutation();
  const router = useRouter()
  const { data: allWing } = useGetAllWingSectionQuery();

  const paramss = useParams();
  const id = paramss.id as string;


  const { data: listQuery } = useGetSpecificStaffUserQuery({ id: id }, {
    skip: id == null || id == undefined,
  });


  const isEditMode = id && listQuery?.data;

  const form = useForm<z.infer<typeof StaffUsersSchema>>({
    resolver: zodResolver(StaffUsersSchema),
    defaultValues: {
      name: "",
      wing_ids: [],
      sme_office_id: "",
      mobile: "",
      email: ""
    },
  });


  const onSubmit: SubmitHandler<z.infer<typeof StaffUsersSchema>> = async (values) => {
    try {
      const mutationFn = isEditMode ? updateStaffUsers : createStaffUsers;
      const res = await mutationFn({
        ...values,
        status: isEditMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();
      if (res.code === 200) {
        await form.reset();
        closeFormToggle();
        Swal.fire({
          title: 'Success!',
          text: isEditMode ? "SMEF Official Updated Successfully" : "SMEF Official Created Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'

        }).then(() => {
          router.push("/admin/user-management/staff-users");
        });

      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof StaffUsersSchema>, {
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
    if (listQuery) {
      form.reset({
        name: listQuery?.data?.name || "",
        wing_ids: listQuery?.data?.user_profile?.wings?.map((wings: any) => wings.wing.id.toString()) || [],
        sme_office_id: listQuery?.data?.user_profile?.sme_office_id || "",
        mobile: listQuery?.data?.mobile || "",
        email: listQuery?.data?.email || "",
      });
      // form.setValue("sme_office_id", showData?.user_profile?.sme_office_id);
    }
  }, [listQuery, form]);


  return (
    <div className="w-full bg-[#ffffff] rounded my-3 p-2">
      <div className=" mb-3">
        <p className="text-2xl">{isEditMode ? "Update" : "Create"} SMEF Official </p>
      </div>
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 ">
              <FormInput
                name="name"
                placeholder="Enter User Name"
                label="User Name"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormAutoCompleteMultiSelect
                name="wing_ids"
                data={listArrayDaynamicModify(
                  allWing?.data,
                  "wingSection",
                  "name"
                )}
                singleListName="wingSection"
                label="Wing"
                remark={true}
                placeholder="Select Wing"
                control={form.control}
                error={form.formState.errors.wing_ids?.message}
              />
            </div>
            <div className="col-span-12 md:col-span-6 mt-2">
              <FormInput
                name="mobile"
                placeholder="Enter Mobile"
                label="Mobile"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6 mt-1">
              <FormInput
                name="sme_office_id"
                placeholder="Enter SME Office ID"
                label="SME Office ID"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormInput
                name="email"
                placeholder="Enter Email"
                label="Email"
                remark={true}
              />
            </div>
          </div>

          <div className=" p-4">
            <div className="flex justify-end gap-5">
              {!isEditMode && (
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
                {isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default StaffUsersForm;
