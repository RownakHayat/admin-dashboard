"use client";
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import { FormAutoCompleteMultiSelect } from "@/components/common/Form/FormAutoCompleteMultiSelect";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormInput from "@/components/common/Form/FormInput";
import MultipleFileUploadNewEvent from "@/components/common/Form/FormMultipleFileUploadNewEvent";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import {
  infoTypeList,
  notificationTypes,
} from "@/components/common/staticData/staticdata";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { siteConfig } from "@/config/site";
import { useGetActivitiesPaginationQuery } from "@/store/features/configuration/activities";
import { useGetClusterPaginationQuery } from "@/store/features/configuration/cluster";
import { useDivisionWiseDistrictQuery } from "@/store/features/configuration/district";
import { useGetDivisionPaginationQuery } from "@/store/features/configuration/division";
import { useGetFinancialYearPaginationQuery } from "@/store/features/configuration/financialYear";
import { useGetIndustrialSectorPaginationQuery } from "@/store/features/configuration/industrialSector";
import { useGetOrganizerPaginationQuery } from "@/store/features/configuration/organizer";
import { useDistrictWiseUpazilaQuery } from "@/store/features/configuration/upazila";
import {
  useCreateEventMutation,
  useGetEventUpdateSingleViewQuery,
  useUpdateSpecificEventMutation,
} from "@/store/features/eventManagement/newEvent";
import {
  useGetAllFinancialYearQuery,
  useGetNewProgramQuery,
} from "@/store/features/eventManagement/newProgram";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { eventSchema } from "../schemas/eventSchema";

interface Image {
  id?: string | number;
  url: string;
  file: File;
  name: string;
  base64: string;
  attachment_name?: string;
  attachment?: string;
  priority?: number;
}
const defaultAttachments = {
  attachment_name: "",
  attachment: "",
  priority: 0,
};

const NewEventForm = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();


  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      program_id: "",
      industrial_sector_ids: [],
      cluster_id: "",
      division_id: "",
      district_id: "",
      venue: "",
      notification: "",
      payment_status: 1,
      start_date: "",
      end_date: "",
      dead_line: "",
      event_attachments: [defaultAttachments],
      is_featured: "",
    },
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [paymentStatus, setPaymentStatus] = useState(1);
  const [attachment, setAttachment] = useState<Image[]>([]);
  const [isFeatured, setIsFeatured] = useState("0"); // State for `is_featured`

  const onCancelClick = () => {
    router.back();
  };


  const [createEvent] = useCreateEventMutation();
  const [UpdateFormData] = useUpdateSpecificEventMutation();

  const { data: getAllFinancialYear } = useGetAllFinancialYearQuery();
  const { data: programName } = useGetNewProgramQuery();
  const { data: industrialSector } = useGetIndustrialSectorPaginationQuery();

  const { data: divisionData } = useGetDivisionPaginationQuery();
  const { data: districtData } = useDivisionWiseDistrictQuery(
    { id: form.watch("division_id") },
    {
      skip:
        form.watch("division_id") == "" ||
        form.watch("division_id") == undefined,
    }
  );
  const { data: upazileData } = useDistrictWiseUpazilaQuery(
    { id: form.watch("district_id") },
    {
      skip:
        form.watch("district_id") == "" ||
        form.watch("district_id") == undefined,
    }
  );

  const { data: clusterData } = useGetClusterPaginationQuery();
  const { data: activitiesData } = useGetActivitiesPaginationQuery();
  const { data: organizerData } = useGetOrganizerPaginationQuery();
  const { data: financialYearData } = useGetFinancialYearPaginationQuery();
  // const { data: listQuery, refetch, isLoading } = useGetEventUpdateSingleViewQuery({ id })
  const { data: listQuery } = useGetEventUpdateSingleViewQuery(
    id ? { id } : skipToken
  );
  // const { data: listQuery, refetch: isLoading } = useGetEventUpdateSingleViewQuery(id ? id : skipToken);

  const isEditMode = id && listQuery?.data;

  const handleSwitchChange = (checked: boolean) => {
    setPaymentStatus(checked ? 2 : 1);
    if (!checked) {
      form.setValue("event_entry_fee", 0); // Reset the event_entry_fee to 0 when paymentStatus is not 2
    }
  };
  const handleFeaturedSwitchChange = (checked: boolean) => {
    const featuredValue = checked ? "1" : "0";
    setIsFeatured(featuredValue);
    form.setValue("is_featured", featuredValue);
  };


  const handleAttachmentChange = (newImages: Image[]) => {
    const sanitizedImages = newImages.map((image) => ({
      id: image.id,                         // Keep the ID if it exists
      url: image.url || "",                 // Fallback to empty string if missing
      file: image.file || null,             // Fallback to null if missing
      name: image.name || "Unnamed Image",  // Fallback to default name
      base64: image.base64 || "",           // Fallback to empty string
      attachment_name: image.name,          // Ensure name is mapped to attachment_name
      attachment: image.base64,             // Ensure base64 data is passed as the attachment
      priority: image.priority ?? 1,        // Fallback to priority 1 if missing
    }))
    setAttachment(sanitizedImages);
    form.setValue("event_attachments", sanitizedImages);
  }

  const onSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (
    values
  ) => {
    values.payment_status = paymentStatus;
    if (values.notification === "") {
      values.notification = null;
    }

    if (paymentStatus !== 2) {
      values.event_entry_fee = 0;
      values.payment_status = 1;
    }
    if (
      paymentStatus === 2 &&
      (!values.event_entry_fee || values.event_entry_fee <= 0)
    ) {
      form.setError("event_entry_fee", {
        type: "manual",
        message:
          "Event entry fee is required and must be a positive number when payment is enabled",
      });
      return;
    }

    const multipuleAttachment = attachment.map((image) => ({
      attachment_name: image.name, // Ensure name is mapped to attachment_name
      attachment: image.base64, // Ensure base64 data is passed
      priority: image.priority ?? 0, // Ensure priority is set
    }));

    try {
      const payload = {
        ...values,
        // payment_status: paymentStatus,
        start_date: moment(values.start_date).format("YYYY-MM-DD"),
        end_date: moment(values.end_date).format("YYYY-MM-DD"),
        dead_line: moment(values.dead_line).format("YYYY-MM-DD"),
        event_attachments: multipuleAttachment,
        is_featured: isFeatured, // Include `is_featured` in payload

      };

      if (isEditMode) {
        await UpdateFormData({
          ...payload,
          id: listQuery?.data?.id,
        }).unwrap();
      } else {
        await createEvent(payload).unwrap();
      }

      form.reset();
      closeFormToggle();

      closeFormToggle();
      Swal.fire({
        title: "Success!",
        text: isEditMode ? "Event Updated Successfully" : "Event Created Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0b9e45",
      }).then(() => {
        router.push("/admin/event-management/new-event");
      });
    } catch (err: any) {
      err?.data?.errors?.forEach((value: any) =>
        form.setError(value?.field, {
          type: "custom",
          message: value?.message,
        })
      );
    }
  };

  useEffect(() => {
    if (showData || listQuery?.data) {
      const industrialSectorIds =
        listQuery?.data?.industrial_sec_for_events?.map((sector: any) =>
          sector.industrial_sector_id.toString()
        ) || [];

      const appEnv = process.env.APP_ENV || "default";
      // Map the attachments
      const mappedAttachments = listQuery?.data?.event_attachments?.map(
        (attachment: any) => ({
          id: attachment.id,
          attachment_name: attachment?.attachment_name,
          url: `${siteConfig?.envConfig[appEnv]?.IMAGE_URL}${attachment.attach_file_path}`,
          file: null,
          name: attachment.attachment_name,
          base64: attachment.attach_file_path,
          priority: attachment?.priority,
        })
      );


      form.reset({
        program_id: listQuery?.data?.program_detail_id.toString() || "",
        industrial_sector_ids: industrialSectorIds,
        event_name: listQuery?.data?.event_name || "",
        activity_id: listQuery?.data?.activity_id?.toString() || "",
        start_date: listQuery?.data?.start_date || "",
        end_date: listQuery?.data?.end_date || "",
        dead_line: listQuery?.data?.dead_line || "",
        organizer_id: listQuery?.data?.organizer_id?.toString() || "",
        info_type: listQuery?.data?.info_type?.toString() || "",
        event_carry_forward_id:
          listQuery?.data?.event_carry_forward_id?.toString() || "",
        event_entry_fee: listQuery?.data?.event_entry_fee || "",
        // event_status: listQuery?.data?.event_status?.toString() || "",
        division_id: listQuery?.data?.division_id?.toString() || "",
        district_id: listQuery?.data?.district_id?.toString() || "",
        upazila_id: listQuery?.data?.upazila_id?.toString() || "",
        cluster_id: listQuery?.data?.cluster_id?.toString() || "",
        notification: listQuery?.data?.notification?.toString() || "",
        venue: listQuery?.data?.venue || "",
        remarks: listQuery?.data?.remarks || "",
        // is_featured: listQuery?.data?.is_featured || false, // Set `is_featured` based on fetched data
        is_featured: listQuery?.data?.is_featured?.toString() || "0",
      });
      setAttachment(mappedAttachments || []);
      setPaymentStatus(listQuery?.data?.payment_status);
      setIsFeatured(listQuery?.data?.is_featured || false);

    }
  }, [showData, form, listQuery?.data]);

  return (
    <div>
      <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
        <div className=" mb-3 ">
          <p className="text-[25px] font-bold">
            {isEditMode ? "Update" : "Create"} Event
          </p>
        </div>

        <div className="mx-2">
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4 ">
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="program_id"
                  data={listArrayDaynamicModify(
                    programName?.data,
                    "name_en",
                    "name_en"
                  )}
                  singleListName="name_en"
                  label="Program Name"
                  placeholder="Select"
                  remark={true}
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoCompleteMultiSelect
                  name="industrial_sector_ids"
                  data={listArrayDaynamicModify(
                    industrialSector?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Industrial Sector"
                  placeholder="Select"
                />
              </div>

              <div className="col-span-12  md:col-span-6">
                <FormInput
                  name="event_name"
                  placeholder="Select"
                  label="Event Name"
                  remark={true}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="activity_id"
                  data={listArrayDaynamicModify(
                    activitiesData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Activity Type"
                  placeholder="Select"
                  control={form.control}
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
              <div className="col-span-12  md:col-span-6">
                <FormDatePicker
                  name="dead_line"
                  label="Application Deadline"
                  remark={true}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="organizer_id"
                  data={listArrayDaynamicModify(
                    organizerData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Organizer/Partner"
                  placeholder="Select"
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="info_type"
                  data={listArrayDaynamicModify(infoTypeList, "name", "name")}
                  singleListName="name"
                  label="Info Type"
                  placeholder="Select"
                  control={form.control}
                />
              </div>

              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="event_carry_forward_id"
                  data={listArrayDaynamicModify(
                    financialYearData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Event Carry Forward (FY)"
                  placeholder="Select"
                  control={form.control}
                />
              </div>

              {/* <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="event_status"
                  data={listArrayDaynamicModify(
                    eventStatus,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Event Status"
                  placeholder="Select"
                  control={form.control}
                />

              </div> */}
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="division_id"
                  data={listArrayDaynamicModify(
                    divisionData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Division"
                  placeholder="Select"
                  remark={true}
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="district_id"
                  data={listArrayDaynamicModify(
                    districtData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="District"
                  placeholder="Select"
                  remark={true}
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="upazila_id"
                  data={listArrayDaynamicModify(
                    upazileData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Upazila"
                  placeholder="Select"
                  remark={true}
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="cluster_id"
                  data={listArrayDaynamicModify(
                    clusterData?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Cluster"
                  placeholder="Select"
                  control={form.control}
                />
              </div>

              <div className="col-span-12  md:col-span-6">
                <div className="">
                  <p>
                    <Label htmlFor="airplane-mode">Payment Required</Label>
                  </p>
                  <Switch
                    id="airplane-mode"
                    name="payment_status"
                    className="mt-3 data-[state=checked]:bg-[#0cb04d]"
                    checked={paymentStatus === 2}
                    onCheckedChange={handleSwitchChange}
                    disabled={editMode === true}
                  />
                </div>
              </div>
              {paymentStatus === 2 && (
                <div className="col-span-12  md:col-span-6">
                  <FormInput
                    name="event_entry_fee"
                    placeholder="Enter Amount"
                    label="Entry Fee"
                    remark={true}
                    disabled={editMode === true}
                  />
                </div>
              )}
              <div className="col-span-12  md:col-span-6">
                <FormAutoComplete
                  name="notification"
                  data={listArrayDaynamicModify(
                    notificationTypes,
                    "notification",
                    "name"
                  )}
                  singleListName="notification"
                  label="Notification Type"
                  placeholder="Select"
                  control={form.control}
                />
              </div>
              <div className="col-span-12  md:col-span-6">
                <FormInput
                  name="venue"
                  placeholder="Select"
                  label="Venue"
                  remark={true}
                />
              </div>
              <div className="col-span-12  md:col-span-12">
                <FormInput name="remarks" placeholder="Text" label="Remarks" />
              </div>
            </div>
            <div className="flex items-center">
              <Label htmlFor="isFeatured" className="pr-5">Is Featured Event? </Label>
              <Switch
                id="isFeatured"
                className="data-[state=checked]:bg-[#0cb04d]"
                checked={isFeatured == "1"} // Convert string to boolean
                onCheckedChange={(checked) => handleFeaturedSwitchChange(checked)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 ">
              <div className="col-span-12  md:col-span-12">
                <>
                  {/* <MultipleFileUpload onImagesChange={handleAttachmentChange} /> */}
                  {/* <pre>{JSON.stringify(attachment, null, 2)}</pre> */}
                  <MultipleFileUploadNewEvent onImagesChange={handleAttachmentChange}
                    existingImages={attachment.map(image => ({
                      ...image,
                      priority: image.priority ?? 0
                    }))}
                  // existingImages={attachment}
                  />
                </>
              </div>
            </div>

            <div className=" p-4">
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
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default NewEventForm;
