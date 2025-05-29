"use client"
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useCreateProgramMutation, useGetAllFinancialYearQuery, useUpdateProgramMutation } from "@/store/features/eventManagement/newProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { PaymentSchema } from "../schemas/paymentSchema";

const PaymentForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createProgram] = useCreateProgramMutation();
  const [updateProgram] = useUpdateProgramMutation();
  const router = useRouter()
  const { data: getAllFinancialYear } = useGetAllFinancialYearQuery();

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      event_name: "",
      created_at: "",
      activity: "",
      program: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PaymentSchema>> = async (values) => {
    try {
      const mutationFn = editMode ? updateProgram : createProgram;
      const res = await mutationFn({
        ...values,
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
          router.push("/admin/event-management/new-program");
        });

      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof PaymentSchema>, {
              type: "custom",
              message,
            })
        );
        // Swal.fire({
        //   title: "Error!",
        //   text: "Failed to submit the form. Please check the details.",
        //   icon: "error",
        //   confirmButtonText: "OK",
        //   confirmButtonColor: "#e53e3e",
        // });
      } else { }
    }
  };

  useEffect(() => {
    if (showData) {
      form.reset({
        event_name: showData.event_name || "",
        created_at: showData.financial_year?.id?.toString() || "",
      });
    }
  }, [showData, form]);


  return (
    <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <div className=" mb-3 ">
        <p className="text-[25px] font-bold">{editMode ? "Update" : "Create"} Program </p>
      </div>

      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 ">
              <FormAutoComplete
                name="financial_year_id"
                data={listArrayDaynamicModify(getAllFinancialYear?.data, "name", "name")}
                singleListName="name"
                label="Financial Year"
                placeholder="Enter Financial Year"
                control={form.control}
              />
            </div>
            <div className="col-span-6">
              <FormInput
                name="name"
                placeholder="Enter Program Name"
                label="Program Name"
                remark={true}
              />
            </div>
          </div>
          <div className=" p-4">
            <div className="flex justify-end gap-5">
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

export default PaymentForm;
