"use client";
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllBudgetItemQuery, useGetAllBudgetItemWiseUnitQuery } from "@/store/features/configuration/budgetItem";

import MultipleFileUploadNew from "@/components/common/Form/FormMultipleFileUploadNew";
import { siteConfig } from "@/config/site";
import { useGetAllWingSectionQuery } from "@/store/features/configuration/wing";
import {
  useCreateProgramMutation,
  useGetAllFinancialYearQuery,
  useShowSpecificsProgramQuery,
  useUpdateProgramMutation,
} from "@/store/features/eventManagement/newProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { NewProgramSchema } from "../schemas/newProgramSchema";

interface Image {
  id?: string | number;
  url: string;
  file: File;
  name: string;
  base64: string;
  attachment_name?: string;
  attachment?: string;
}

interface ProfitLoss {
  budget_item: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
  };
  no_of_unit: number;
  total_cost: number;
}

const NewProgramForm = () => {
  const paramss = useParams();
  const router = useRouter();
  const id = paramss.id as string;
  const [isManualTotal, setIsManualTotal] = useState(false);
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createProgram] = useCreateProgramMutation();
  const [updateProgram] = useUpdateProgramMutation();

  const { data: getAllFinancialYear } = useGetAllFinancialYearQuery();
  const { data: getAllWingSection } = useGetAllWingSectionQuery();
  const { data: budgetItemData } = useGetAllBudgetItemQuery();


  const { data: eventProgram, refetch: refetchUser } = useShowSpecificsProgramQuery(id, {
    skip: id == null || id == undefined,
  });


  const isEditMode = id && eventProgram?.data;

  useEffect(() => {
    if (isEditMode) refetchUser()
  }, [id, isEditMode])


  const onCancelClick = () => {
    router.back();
  };

  const [currentItemTypeId, setCurrentItemTypeId] = useState<string | null>(null);
  const { data: unitItemData } = useGetAllBudgetItemWiseUnitQuery(
    currentItemTypeId ? { id: currentItemTypeId } : skipToken
  );


  const budgetEvent = {
    item_id: null,
    unit_id: null,
    no_of_unit: null,
    unit_cost: null,
    total_cost: null,
  };
  const defaultAttachments = {
    attachment_name: "",
    attachment: "",
  };

  const form = useForm<z.infer<typeof NewProgramSchema>>({
    resolver: zodResolver(NewProgramSchema),
    defaultValues: {
      name_en: "",
      wing_id: "",
      target_of_event: "",
      financial_year_id: "",
      total_amount: "",
      budget_items: [budgetEvent],
      program_attachments: [defaultAttachments],
    },
  });
  const {
    fields: budgetFields,
    append: appendBudgetItem,
    remove: removeBudgetItem,
  } = useFieldArray({
    control: form.control,
    name: "budget_items",
  });

  const { control, setValue, watch } = form;
  const itemsTypeIds = useWatch({
    control,
    name: "budget_items",
    defaultValue: [],
  });

  useEffect(() => {
    const lastItem = itemsTypeIds?.[itemsTypeIds.length - 1];
    if (lastItem?.item_id) {
      setCurrentItemTypeId(lastItem.item_id);
    }
  }, [itemsTypeIds]);


  // Watch the total_cost field in budget_items
  const budgetItems = useWatch({
    control: form.control,
    name: "budget_items",
    defaultValue: [],  // Provide a default value
  });

  useEffect(() => {
    // Calculate the sum of all total_cost fields when not manually overridden
    if (!isManualTotal && Array.isArray(budgetItems)) {
      const sumTotalCost = budgetItems.reduce((acc, item) => {
        return acc + (item?.total_cost || 0);
      }, 0);
      form.setValue("total_amount", sumTotalCost.toFixed(2), {
        shouldValidate: true,
      });
    }
  }, [budgetItems, isManualTotal, form]);

  // Function to handle manual input of total_amount
  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("total_amount", e.target.value, { shouldValidate: true });
    setIsManualTotal(true); // Switch to manual mode
  };

  const handleValueChange = (index: number) => {
    const { getValues, setValue } = form;
    const noOfUnits =
      Number(getValues(`budget_items.${index}.no_of_unit`)) || 0;
    const unitCost = Number(getValues(`budget_items.${index}.unit_cost`)) || 0;
    const totalCost = noOfUnits * unitCost;
    const formattedTotalCost = parseFloat(totalCost.toFixed(2));
    setValue(`budget_items.${index}.total_cost`, formattedTotalCost, {
      shouldValidate: true,
    });
    setIsManualTotal(false);
  };



  const [attachment, setAttachment] = useState<Image[]>([]);

  const handleAttachmentChange = (newImages: Image[]) => {
    const sanitizedImages = newImages.map(({ id, ...rest }) => rest);
    setAttachment(newImages);
    form.setValue("program_attachments", newImages);
  };

  useEffect(() => {
    if (eventProgram) {
      const mappedProfitLosses = eventProgram.data.budget_item_details?.map(
        (item: any) => ({
          item_id: item?.budget_item?.id?.toString() || "",
          unit_id: item?.unit_id?.toString() || "",
          no_of_unit: item?.no_of_unit || 0,
          unit_cost: item?.total_cost / (item?.no_of_unit || 1),
          total_cost: item?.total_cost || 0,
        })
      );

      const appEnv = process.env.APP_ENV || "default";
      // Map the attachments
      const mappedAttachments = eventProgram.data.program_details_attachments.map(
        (attachment: any) => ({
          id: attachment.id,
          attachment_name: attachment.attachment_name,
          url: `${siteConfig?.envConfig[appEnv]?.IMAGE_URL}${attachment.attach_file_path}`,
          file: null,
          name: attachment.attachment_name,
          base64: attachment.attach_file_path,
        })
      );
      form.reset({
        name_en: eventProgram.data.name_en || "",
        wing_id: eventProgram.data.wing?.id?.toString() || "",
        target_of_event: eventProgram.data.target_of_event?.toString() || "",
        financial_year_id:
          eventProgram.data.financial_year?.id?.toString() || "",
        total_amount: eventProgram.data.total_amount?.toString() || "",
        budget_items: mappedProfitLosses || [],

      });
      setAttachment(mappedAttachments || []);
      setIsManualTotal(true);
    }
  }, [eventProgram, form]);

  const onSubmit: SubmitHandler<z.infer<typeof NewProgramSchema>> = async (values) => {
    try {
      const program_attachments = attachment.map((att) => ({
        attachment_name: att.attachment_name || att.name,
        attachment: att.base64,
      }));

      const mutationFn = isEditMode ? updateProgram : createProgram;
      const res = await mutationFn({
        ...values,
        id: id,
        program_attachments: program_attachments
      }).unwrap();

      if (res.code === 200) {
        await form.reset();
        closeFormToggle();
        Swal.fire({
          title: "Success!",
          text: isEditMode ? "Program Updated Successfully" : "Program Created Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/event-management/new-program");
        });
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        const errorMessages = err?.data?.errors?.map(
          ({ message }: { message: string }) => ` ${message}`
        ).join('\n');

        Swal.fire({
          title: "Error!",
          text: `${errorMessages}`,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });

        // Set form errors for individual fields
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof NewProgramSchema>, {
              type: "custom",
              message,
            })
        );
      }
    }
  };

  return (
    <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <div className=" mb-3 ">
        <p className="text-[25px] font-bold">
          {isEditMode ? "Update" : "Create"} Program
        </p>
      </div>

      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 ">
              <FormAutoComplete
                name="financial_year_id"
                data={listArrayDaynamicModify(
                  getAllFinancialYear?.data,
                  "name",
                  "name"
                )}
                singleListName="name"
                label="Financial Year"
                placeholder="Enter Financial Year"
                control={form.control}
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormInput
                name="name_en"
                placeholder="Enter Program Name"
                label="Program Name"
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6 ">
              <FormAutoComplete
                name="wing_id"
                data={listArrayDaynamicModify(
                  getAllWingSection?.data,
                  "name",
                  "name"
                )}
                singleListName="name"
                label="Wing/Section"
                placeholder="Select Wing"
                control={form.control}
                remark={true}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormInput
                name="target_of_event"
                placeholder="Target of Event"
                label="Target of Event"
                type="number"
                min="0"
                remark={true}
              />
            </div>
          </div>
          <h1 className="text-[24px] font-medium">Estimated Budget</h1>
          {budgetFields.map((item, index) => {
            const currentItemTypeId = itemsTypeIds?.[index]?.item_id
            return (
              <>
                <div
                  key={item.id}
                  className="grid grid-cols-12 bg-[#f2f2f3] gap-4 p-4 rounded-md border border-gray-300"
                >
                  <div className="col-span-12  md:col-span-6">
                    <FormAutoComplete
                      name={`budget_items.[${index}].item_id`}
                      data={listArrayDaynamicModify(
                        budgetItemData?.data,
                        "name",
                        "name"
                      )}
                      singleListName="name"
                      label="Items"
                      placeholder="Select"
                      control={form.control}
                    />
                  </div>
                  <div className="col-span-12  md:col-span-6">
                    <FormAutoComplete
                      name={`budget_items.${index}.unit_id`}
                      data={listArrayDaynamicModify(
                        unitItemData?.data,
                        "unit",
                        "unit"
                      )}
                      singleListName="unit"
                      label="Unit"
                      placeholder="Select"
                      control={form.control}
                    />
                  </div>

                  <div className="col-span-12  md:col-span-6">
                    <FormInput
                      name={`budget_items.${index}.no_of_unit`}
                      placeholder="Enter no. of unit"
                      label="No. Of Unit"
                      type="number"
                      min="0"
                      onChange={() => {
                        handleValueChange(index);
                      }}
                    />
                  </div>
                  <div className="col-span-12  md:col-span-6">
                    <FormInput
                      name={`budget_items.${index}.unit_cost`}
                      placeholder="Enter Unit Cost"
                      label="Unit Cost"
                      type="number"
                      min="0"
                      onChange={() => {
                        handleValueChange(index);
                      }}
                    />
                  </div>

                  <div className="col-span-12  md:col-span-12">
                    <FormInput
                      name={`budget_items.${index}.total_cost`}
                      placeholder="Total Cost"
                      label="Total Cost"
                      type="number"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-12 flex justify-end items-center gap-2">
                  {budgetFields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                      onClick={() => removeBudgetItem(index)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="bg-green-700 text-white rounded-lg p-1 w-[120px] text-center cursor-pointer"
                    onClick={() => appendBudgetItem(budgetEvent)}
                  >
                    Add More
                  </Button>
                </div>
              </>
            )
          })}

          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-12  md:col-span-12">
              <FormInput
                name="total_amount"
                placeholder="Enter Total Amount"
                label="Total Amount"
                remark={true}
                onChange={handleTotalAmountChange}
              />
            </div>
            <div className="col-span-12  md:col-span-12">
               <MultipleFileUploadNew
                onImagesChange={handleAttachmentChange}
                existingImages={attachment.map((img:any) => ({
                  ...img,
                  id: img.id ?? '',
                }))}
              />
            </div>

          </div>
          <div className=" p-4">
            <div className="flex justify-end gap-5">
              {isEditMode ? (
                <Button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
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
        </FormContainer>
      </div>
    </div>
  );
};

export default NewProgramForm;
