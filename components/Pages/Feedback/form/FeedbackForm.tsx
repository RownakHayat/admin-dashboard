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
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { FeedbackSchema } from "../schemas/feedbackSchema";
import {useCreateFeedbackMutation} from "@/store/features/feedback";
import {useGetAllEventListQuery} from "@/store/features/eventManagement/newEvent";
import FormDatePicker from "@/components/common/Form/FormDatePicker";

const FeedbackForm = () => {

  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createFeedback] = useCreateFeedbackMutation();
  const [updateFeedback] = useUpdateProgramMutation();
  const router = useRouter()
  const { data: getAllFinancialYear } = useGetAllFinancialYearQuery();
  const { data: getAllEvent } = useGetAllEventListQuery();
  const { data: getAllActivityType } = useGetAllEventListQuery();

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      event_id: "",
      activity_type_id: "",
      start_date: "",
      end_date: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FeedbackSchema>> = async (values) => {
    try {
      const mutationFn = editMode ? updateFeedback : createFeedback;
      const res = await mutationFn({
        ...values,
        id: showData?.id,
        event_id: values?.event_id,
        activity_type_id: values?.activity_type_id,
        start_date: values?.start_date,
        end_date: values?.end_date,
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
          router.push("/admin/feedback");
        });

      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof FeedbackSchema>, {
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
        event_id: showData.event_id?.id?.toString() || "",
        activity_type_id: showData.activity_type_id?.id?.toString() || "",
        start_date: showData.start_date || "",
        end_date: showData.end_date || "",
        subject: showData.subject || "",
        description: showData.description || "",
      });
    }
  }, [showData, form]);


  return (
    <div>
      <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
        <div className=" mb-3 ">
          <p className="text-[25px] font-bold">{editMode ? "Update" : "Create"} FeedBack </p>
        </div>

        <div className="mx-2">
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 ">
                <FormAutoComplete
                    name="event_id"
                    data={listArrayDaynamicModify(getAllEvent?.data, "name", "name")}
                    singleListName="name"
                    label="Event"
                    placeholder="Enter Event"
                    control={form.control}
                />
              </div>
              <div className="col-span-6">
                <FormInput
                    name="name"
                    placeholder="Enter Program Name"
                    label="Activity Type"
                    remark={true}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormDatePicker
                    name="start_date"
                    label="Event Time Schedule (Start Date)"
                    remark={true}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormDatePicker
                    name="end_date"
                    label="Event Time Schedule (End Date)"
                    remark={true}
                />
              </div>

              <div className="col-span-12">
                <FormInput
                    name="subject"
                    placeholder="Enter Subject"
                    label="Subject"
                    remark={true}
                />
              </div>

              <div className="col-span-12 ">
                <FormInput
                    name="description"
                    placeholder="Enter Description"
                    label="Description"
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
    </div>
  )
}

export default FeedbackForm