"use client";
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { statusType } from "@/components/common/staticData/staticdata";
import { Button } from "@/components/ui/button";
import { useDivisionWiseDistrictQuery } from "@/store/features/configuration/district";
import { useGetAllDivisionQuery } from "@/store/features/configuration/division";
import {
  useBudgetSpentEditMutation,
  useCreateBudgetSpentMutation,
  useGetSingleBudgetSpanQuery,
} from "@/store/features/eventManagement/budgetSpent/intex";
import { useGetAllProgramListQuery } from "@/store/features/eventManagement/newProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { budgetSpentSchemas } from "../schemas/budgetSpentSchemas";

const BudgetSpentEventForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const { ToastSuccess, ToastError } = useToast();
  const router = useRouter();
  const [createBudgetSpent] = useCreateBudgetSpentMutation();
  const [budgetSpentUpdate] = useBudgetSpentEditMutation();

  const form = useForm<z.infer<typeof budgetSpentSchemas>>({
    resolver: zodResolver(budgetSpentSchemas),
    defaultValues: {
      spent_amount: "",
      event_status: "",
    },
  });

  const params = useParams();
  const id = params.id;

  const { data: programList } = useGetAllProgramListQuery();
  const { data: divisionAllList } = useGetAllDivisionQuery();
  const { data: districtList } = useDivisionWiseDistrictQuery({
    id: form.watch("division_id"),
  });
  const { data: singleBudgetSpent } = useGetSingleBudgetSpanQuery(
      { id: id },
      { skip: !id }
  );

  const isEditMode = id && singleBudgetSpent?.data;

  // Watch the event_status field
  const eventStatusValue = form.watch("event_status");

  const onSubmit: SubmitHandler<z.infer<typeof budgetSpentSchemas>> = async (
      values
  ) => {
    try {
      const mutationFn = editMode ? budgetSpentUpdate : createBudgetSpent;
      const res = await mutationFn({
        ...values,
        id: id,
        spent_amount: Number(values?.spent_amount),
        event_status: values?.event_status,
      }).unwrap();
      if (res.code === 200) {
        form.reset();
        Swal.fire({
          title: "Success!",
          text: editMode ? "Budget Spent updated successfully" : "Budget Spent created successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/event-management/budget-spent");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
              form.setError(field as keyof z.infer<typeof budgetSpentSchemas>, {
                type: "custom",
                message,
              })
      );
      ToastError(`Failed to ${editMode ? "Update" : "Create"}`);
    }
  };

  const onCancelClick = () => {
    router.back();
  };

  useEffect(() => {
    if (isEditMode && singleBudgetSpent?.data) {
      form.reset({
        ...singleBudgetSpent.data,
        id: singleBudgetSpent?.data?.id,
        venue: singleBudgetSpent?.data?.venue || "",
        division_id: singleBudgetSpent?.data?.division_id?.toString() || "",
        district_id: singleBudgetSpent?.data?.district_id?.toString() || "",
        program_detail_id: singleBudgetSpent?.data?.program_detail_id?.toString() || "",
        spent_amount: singleBudgetSpent?.data?.spent_amount?.toString() || "",
        event_status: singleBudgetSpent?.data?.event_status?.toString() || "",
      });
    }
  }, [isEditMode, singleBudgetSpent, showData, form]);

  return (
      <div>
        <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
          <div className=" mb-3 ">
            <p className="text-[25px] font-bold">
              {isEditMode ? "Update" : "Create"} Budget Spent{" "}
            </p>
          </div>
          <div className="mx-2">
            <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4 ">
                <div className="col-span-12  md:col-span-12">
                  <FormInput name="event_name" label="Event name" disabled />
                </div>
                <div className="col-span-12  md:col-span-6">
                  <FormInput name="venue" label="Venue" disabled />
                </div>
                <div className="col-span-12  md:col-span-6">
                  <FormAutoComplete
                      name="program_detail_id"
                      data={listArrayDaynamicModify(
                          programList?.data,
                          "name_en",
                          "name_en"
                      )}
                      singleListName="name_en"
                      label="Program Name"
                      placeholder="Select"
                      control={form.control}
                      isDisabled={true}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormAutoComplete
                      name="division_id"
                      data={listArrayDaynamicModify(
                          divisionAllList?.data,
                          "id",
                          "name"
                      )}
                      placeholder="Division"
                      singleListName="id"
                      label="Division"
                      control={form.control}
                      isDisabled={true}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormAutoComplete
                      name="district_id"
                      data={listArrayDaynamicModify(
                          districtList?.data,
                          "district",
                          "name"
                      )}
                      placeholder="district"
                      singleListName="district"
                      label="District"
                      control={form.control}
                      isDisabled={true}
                  />
                </div>
                <div className="col-span-12  md:col-span-6">
                  <FormInput
                      name="spent_amount"
                      placeholder="Spent Amount"
                      label="Spent Amount"
                      remark={true}
                      // Disable spent_amount if  Not event_status is 3 or 4
                      disabled={eventStatusValue !== "3" && eventStatusValue !== "4"}
                  />
                </div>
                <div className="col-span-12  md:col-span-6">
                  <FormAutoComplete
                      name="event_status"
                      data={listArrayDaynamicModify(statusType, "name", "name")}
                      singleListName="name"
                      label="Status"
                      placeholder="Select"
                      control={form.control}
                      isDisabled={true}
                  />
                </div>
                <div className="col-span-12 md:col-span-12 mt-10">
                  <div className="flex justify-end gap-5">
                    {isEditMode ? (
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
                        className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                    >
                      {isEditMode ? "Update" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
  );
};

export default BudgetSpentEventForm;
