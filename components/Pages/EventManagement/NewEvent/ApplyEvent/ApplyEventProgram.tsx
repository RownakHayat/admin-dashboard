"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { siteConfig } from "@/config/site";
import {
  useApplyEventMutation,
  useGetCategoryWiseAllFieldQuery,
  useGetSingleEventDetailsQuery,
} from "@/store/features/eventManagement/newEvent";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EventImage {
  attachment_name: any;
  event_details?: {
    event_attachments?: {
      attach_file_path?: string;
    };
  };

  // name_bn?: string;
  id: string;
  attach_file_path: string;
}

const ApplyEventProgram = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [selectedFields, setSelectedFields] = useState<
    { id: number; is_required: number }[]
  >([]);

  const [selectAllState, setSelectAllState] = useState<{
    [categoryId: number]: boolean;
  }>({});

  const { data: listQuery } = useGetCategoryWiseAllFieldQuery();

  const { data: eventDetails } = useGetSingleEventDetailsQuery(
    { id: id },
    { skip: !id }
  );

  const [applyEvent, { isLoading, isSuccess, isError }] =
    useApplyEventMutation();

  useEffect(() => {
    if (eventDetails?.data?.event_wise_fields) {
      try {
        const parsedFields = JSON.parse(eventDetails.data.event_wise_fields);
        setSelectedFields(parsedFields);
      } catch (error) { }
    }
  }, [eventDetails]);

  const handleCheckboxChange = (fieldId: number) => {
    setSelectedFields((prevSelectedFields) => {
      const existingField = prevSelectedFields.find(
        (field) => field.id === fieldId
      );
      if (existingField) {
        return prevSelectedFields.filter((field) => field.id !== fieldId);
      } else {
        return [...prevSelectedFields, { id: fieldId, is_required: 1 }];
      }
    });
  };

  const handleSwitchChange = (fieldId: number, checked: boolean) => {
    setSelectedFields((prevSelectedFields) =>
      prevSelectedFields.map((field) =>
        field.id === fieldId
          ? { ...field, is_required: checked ? 1 : 0 }
          : field
      )
    );
  };

  // Check if all fields in a category are selected
  const areAllFieldsSelected = (fields: any[]) => {
    return fields.every((field) =>
      selectedFields.some((selected) => selected.id === field.id)
    );
  };

  // Check if no fields in a category are selected
  const areNoFieldsSelected = (fields: any[]) => {
    return fields.every(
      (field) => !selectedFields.some((selected) => selected.id === field.id)
    );
  };

  // Handle select all checkbox
  const handleSelectAllChange = (categoryId: number, fields: any[]) => {
    const allSelected = selectAllState[categoryId];
    const newSelectedFields = allSelected
      ? selectedFields.filter((field) => !fields.some((f) => f.id === field.id))
      : [
        ...selectedFields,
        ...fields.map((field) => ({ id: field.id, is_required: 1 })),
      ];

    setSelectedFields(newSelectedFields);
    setSelectAllState((prevState) => ({
      ...prevState,
      [categoryId]: !allSelected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id,
      event_wise_fields: selectedFields,
    };

    try {
      const result = await applyEvent(data).unwrap();
      if (result.code === 200) {
        Swal.fire({
          title: "Success!",
          text: "Form Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/event-management/new-event");
        });
      }
    } catch (error) { }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg">
        <div className="p-4">
          <h2 className="text-[#545454] text-[20px]">Event Information</h2>
        </div>
        <div className="p-4 overflow-y-scroll">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Program Name :</p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.program_info?.name_en}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Event name :</p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div>
                    <p className="text-[#545454] font-bold">
                      Industrial Sector :{" "}
                    </p>
                    <div className="text-[#545454] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {eventDetails?.data?.industrial_sec_for_events?.map(
                        (item: any) => (
                          <div className="border border-spacing-1 rounded-lg p-1">
                            <p className="text-wrap">
                              {item?.business_sector?.name}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Schedule : </p>
                    <p className="text-[#545454]  ml-2 ">
                      {moment(eventDetails?.data?.start_date).format('D-MMM-YYYY')} to {moment(eventDetails?.data?.end_date).format('D-MMM-YYYY')}
                    </p>
                  </div>
                </div>
                {/* <div className="col-span-12 md:col-span-4">
                  <div className="">
                    <p className="text-[#545454]">Deadline</p>
                    <p className="text-[#545454]">{`${moment(
                      eventDetails?.data?.dead_line || ""
                    ).format("DD MMM YYYY")}`}</p>
                  </div>
                </div> */}
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">District : </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.district?.name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Venue : </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.venue}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Application Deadline : </p>
                    <p className="text-[#545454] ml-2">
                      {moment(eventDetails?.data?.dead_line).format('D-MM-YYYY')}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">Activity Type : </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.activity?.name}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="flex">
                    <p className="text-[#545454] font-bold">
                      Total Event Fee :{" "}
                    </p>
                    <p className="text-[#545454] ml-2">
                      {eventDetails?.data?.event_entry_fee}
                    </p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="text-[#545454] grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {/* {eventDetails?.data?.event_attachments?.length > 0 &&
                      eventDetails.data.event_attachments.map(
                        (events: EventImage, index: number) => (
                          <div
                            key={events?.id || index}
                            className="flex flex-col border p-4"
                          >
                            <p className="text-[#545454] font-bold">
                              {events?.attachment_name}
                            </p>
                            {events?.attach_file_path
                              .split(".")
                              .pop()
                              ?.toLowerCase() === "pdf" ? (
                              <Link
                                href={`${
                                  siteConfig?.envConfig[
                                    `${process.env.APP_ENV}`
                                  ]?.IMAGE_URL
                                }${events?.attach_file_path}`}
                              >
                                <Image
                                  priority={true}
                                  src="/assets/Image/pdf.png"
                                  alt={`Attachment for ${events?.attach_file_path}`}
                                  width="128"
                                  height="128"
                                  className="pdfIcon"
                                />
                              </Link>
                            ) : (
                              events?.attach_file_path && (
                                <Image
                                  src={`${
                                    siteConfig?.envConfig[
                                      `${process.env.APP_ENV}`
                                    ]?.IMAGE_URL
                                  }${events?.attach_file_path}`}
                                  alt=""
                                  width="258"
                                  height={80}
                                  className="rounded-t-lg w-full h-36"
                                />
                              )
                            )}
                          </div>
                        )
                      )} */}

                    {eventDetails?.data?.event_attachments?.map(
                      (item: any, index: number) => {
                        const fileExtension = item?.attach_file_path
                          .split(".")
                          .pop()
                          ?.toLowerCase();

                        return (
                          <div
                            key={item.id || index}
                            className="text-center p-2"
                          >
                            {/* Check for PDF file */}
                            <p className="text-[#545454] font-bold">
                              {item?.attachment_name}
                            </p>
                            {fileExtension === "pdf" ? (
                              <a
                                href={`${siteConfig?.envConfig[
                                  `${process.env.APP_ENV}`
                                ]?.IMAGE_URL
                                  }${item?.attach_file_path}}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  priority={true}
                                  src="/assets/Image/pdf.png"
                                  alt={`Attachment for ${item?.attach_file_path}`}
                                  width={128}
                                  height={128}
                                  className="pdfIcon"
                                />
                              </a>
                            ) : // Check for DOC/DOCX file (Word documents)
                              fileExtension === "doc" ||
                                fileExtension === "docx" ? (
                                <Link
                                  href={`${siteConfig?.envConfig[
                                    `${process.env.APP_ENV}`
                                  ]?.IMAGE_URL
                                    }${item?.attach_file_path}`}
                                >
                                  <Image
                                    priority={true}
                                    src="/assets/Image/word.png" // You can replace this with the actual icon for Word documents
                                    alt={`Attachment for ${item?.attach_file_path}`}
                                    width={128}
                                    height={128}
                                    className="wordIcon"
                                  />
                                </Link>
                              ) : // Handle image files (jpg, png, gif, etc.)
                                fileExtension === "jpg" ||
                                  fileExtension === "jpeg" ||
                                  fileExtension === "png" ||
                                  fileExtension === "gif" ? (
                                  item?.attach_file_path && (
                                    <Image
                                      src={`${siteConfig?.envConfig[
                                        `${process.env.APP_ENV}`
                                      ]?.IMAGE_URL
                                        }${item?.attach_file_path}`}
                                      alt={`Attachment for ${item?.attach_file_path}`}
                                      width={200}
                                      height={200}
                                      className="object-cover h-32 max-h-48"
                                    />
                                  )
                                ) : null}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="my-4">
            <h2 className="text-[#545454] text-[20px]">
              Select Field to Generate Form
            </h2>
          </div>

          <Card className="bg-[#F8F9F9]">
            <CardContent className="px-4 space-y-4">
              <form
                onSubmit={handleSubmit}
                className="p-6 bg-gray-50 rounded-lg"
              >
                {listQuery?.data.map((category: any) => (
                  <div key={category.id} className="mb-6">
                    <div className="flex items-center mb-2 pb-2 border-b">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4  border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                        ref={(el) => {
                          if (el) {
                            el.indeterminate =
                              !areAllFieldsSelected(category.fields) &&
                              !areNoFieldsSelected(category.fields);
                          }
                        }}
                        checked={areAllFieldsSelected(category.fields)}
                        onChange={() =>
                          handleSelectAllChange(category.id, category.fields)
                        }
                      />
                      <h3 className="text-lg font-semibold ml-2 w-full text-gray-700">
                        {category.field_category_name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {category.fields.map((field: any) => (
                        <label
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            className=""
                            checked={selectedFields.some(
                              (selected) => selected.id === field.id
                            )}
                            onChange={() => handleCheckboxChange(field.id)}
                          />
                          <span className="text-gray-700">
                            {field.field_name}
                          </span>

                          {selectedFields.some(
                            (selected) => selected.id === field.id
                          ) && (
                              <Switch
                                id="airplane-mode"
                                name="is_required"
                                className="mt-2 h-6 data-[state=checked]:bg-[#0cb04d]"
                                checked={
                                  selectedFields.find(
                                    (selected) => selected.id === field.id
                                  )?.is_required === 1
                                }
                                onCheckedChange={(checked) =>
                                  handleSwitchChange(field.id, checked)
                                }
                              />
                            )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="py-5 p-4 relative bg-white w-full">
                  <div className="flex justify-end gap-4 mr-16">
                    <Button className="bg-[#2B7D74] px-4" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ApplyEventProgram;
