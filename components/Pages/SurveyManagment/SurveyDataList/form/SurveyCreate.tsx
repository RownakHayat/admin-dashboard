"use client";
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormInput from "@/components/common/Form/FormInput";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import useToast from "@/components/common/hooks/useToast";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetActivitiesPaginationQuery } from "@/store/features/configuration/activities";
import { useGetAllActivityCategoryQuery } from "@/store/features/configuration/activityCategory";
import { useGetAllClusterQuery } from "@/store/features/configuration/cluster";
import { useGetAllDistrictQuery } from "@/store/features/configuration/district";
import { useGetAllGnderListQuery } from "@/store/features/configuration/gender";
import { useBusinessIndustrialListQuery } from "@/store/features/configuration/industrialSector";
import { useGetSpecificSurveyQuestinDataQuery } from "@/store/features/survey";
import { useCreateSurveyMutation, useGetEventDetailsListQuery, useGetProgramListQuery, useUpdateSpecificSurveyMutation } from "@/store/features/surveyManagement/surveyDataList";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { beneficiarySchema, clusterSchema, createSchema, districtSchema, genderSchema, industrySchema } from "../schemas/surveySchema";
import AnswerComponent from "./AnswerComponent";

const questionType = [
  { id: 1, name: "TEXT" },
  { id: 2, name: "Long TEXT" },
  { id: 3, name: "Multiple Choice" },
  { id: 4, name: "Dropdown" },
  { id: 5, name: "Boolean(True/False)" },
];
const answerType = [
  { id: 1, name: "Single " },
  { id: 2, name: "Multiple " },
];
const surveyType = [
  { id: 1, name: "Open Survey" },
  { id: 2, name: "Gender Based Survey" },
  { id: 3, name: "District Based Survey" },
  { id: 4, name: "Cluster Based Survey" },
  { id: 5, name: "Industry Based Survey" },
  { id: 6, name: "Direct Beneficiaries Survey" },
];

const beneficiariesData = [
  { "id": 1, "name": "Yes" },
  { "id": 2, "name": "No" },
];

const SurveyCreate = () => {

  const { showData, editMode, closeFormToggle } = useFormSetting();
  const router = useRouter();
  const paramss = useParams();
  const id = paramss.id as string;


  const { data: specificSurveyData, error, refetch: SpecificDataRefetch } = useGetSpecificSurveyQuestinDataQuery(id, {
    skip: id == null || id == undefined,
  });



  const isEditMode = id && specificSurveyData?.data;

  useEffect(() => {
    if (isEditMode) {
      SpecificDataRefetch()
    }
  }, [isEditMode])



  const [createSurvey] = useCreateSurveyMutation();
  const [updateSurvey] = useUpdateSpecificSurveyMutation();
  const { data: programName } = useGetProgramListQuery();
  const { data: eventName } = useGetEventDetailsListQuery();
  const { data: districtList } = useGetAllDistrictQuery();
  const { data: genderList } = useGetAllGnderListQuery();
  const { data: clusterList } = useGetAllClusterQuery();
  const { data: industryList } = useBusinessIndustrialListQuery();
  const { data: allActivityCategory } = useGetAllActivityCategoryQuery();


  const { data: ActivityName } = useGetActivitiesPaginationQuery();
  const { ToastSuccess, ToastError } = useToast();

  const onCancelClick = () => {
    router.back();
  };


  const question_type = {
    question_sl_no: null,
    question_type_id: null,
    survey_ques_title: null,
    ans_type: null,
    is_ques_required: false,
    question_type_option: [{ survey_ques_opt_seq: "", survey_ques_opt_title: "" }]
  };

  const [district, setDistrict] = useState(false)
  const [gender, setGender] = useState(false)
  const [cluster, setCluster] = useState(false)
  const [industry, setIndustry] = useState(false)
  const [beneficiary, setBeneficiary] = useState(false)
  const [benefiValue, setBenefiValue] = useState("")

  const formSchema = district ? districtSchema : gender ? genderSchema : cluster ? clusterSchema : industry ? industrySchema : beneficiary ? beneficiarySchema : createSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      survey_title: "",
      survey_type: "",
      district_id: "",
      gender_id: "",
      cluster_id: "",
      industry_id: "",
      direct_beneficiaries: benefiValue,
      program_id: null,
      event_detail_id: null,
      activity_id: null,
      question_field: [question_type],
      start_date: "",
      end_date: "",
    },
  });



  useEffect(() => {
    if (form.watch('survey_type') === '2') {
      setGender(true)
      setDistrict(false)
      setCluster(false)
      setIndustry(false)
      setBeneficiary(false)
      form.setValue('district_id', "")
      form.setValue('cluster_id', "")
      form.setValue('industry_id', "")
      setBenefiValue("")
      form.setValue('activity_id', "")
    } else if (form.watch('survey_type') === '3') {
      setDistrict(true)
      setGender(false)
      setCluster(false)
      setIndustry(false)
      setBeneficiary(false)
      form.setValue('gender_id', "")
      form.setValue('cluster_id', "")
      form.setValue('industry_id', "")
      setBenefiValue("")
      form.setValue('activity_id', "")
    } else if (form.watch('survey_type') === '4') {
      setCluster(true)
      setDistrict(false)
      setGender(false)
      setIndustry(false)
      setBeneficiary(false)
      form.setValue('gender_id', "")
      form.setValue('district_id', "")
      form.setValue('industry_id', "")
      setBenefiValue("")
      form.setValue('activity_id', "")
    } else if (form.watch('survey_type') === '5') {
      setIndustry(true)
      setDistrict(false)
      setGender(false)
      setCluster(false)
      setBeneficiary(false)
      form.setValue('gender_id', "")
      form.setValue('district_id', "")
      form.setValue('cluster_id', "")
      setBenefiValue("")
      form.setValue('activity_id', "")
    } else if (form.watch('survey_type') === '6') {
      setDistrict(false)
      setGender(false)
      setCluster(false)
      setIndustry(false)
      form.setValue('district_id', "")
      form.setValue('gender_id', "")
      form.setValue('cluster_id', "")
      form.setValue('industry_id', "")
    }
    else {
      setDistrict(false)
      setGender(false)
      setCluster(false)
      setIndustry(false)
      setBeneficiary(false)
      form.setValue('district_id', "")
      form.setValue('gender_id', "")
      form.setValue('cluster_id', "")
      form.setValue('industry_id', "")
      setBenefiValue("")
      form.setValue('activity_id', "")
    }
  }, [form.watch('survey_type')])


  useEffect(() => {
    if (benefiValue === "Yes") {
      setBeneficiary(true)
    }
    else {
      setBeneficiary(false)
    }
  }, [benefiValue])


  const { control, setValue, watch } = form;
  const questionTypeIds = useWatch({
    control,
    name: "question_field",
    defaultValue: [],
  });


  const handleSwitchChange = (index: number, checked: boolean) => {
    form.setValue(`question_field.${index}.is_ques_required`, checked);
  };




  useEffect(() => {
    if (specificSurveyData) {

      const mappedQuestion = specificSurveyData?.data?.survey_questions?.map(
        (item: any, index: any) => ({
          question_sl_no: item?.question_sl_no || "",
          question_type_id: item?.question_type_id?.toString() || "",
          survey_ques_title: item?.survey_ques_title || "",
          ans_type: item?.ans_type?.toString() || "",
          is_ques_required: item?.is_ques_required === "1",
          question_type_option: (item?.options?.map(
            (items: any) => ({
              survey_ques_opt_seq: items?.survey_ques_opt_seq?.toString() || "",
              survey_ques_opt_title: items?.survey_ques_opt_title || ""
            })
          ))
        })
      );

      form.reset({
        survey_title: specificSurveyData?.data?.survey_title || '',
        survey_type: specificSurveyData?.data?.survey_type || '',
        start_date: specificSurveyData?.data?.start_date || "",
        end_date: specificSurveyData?.data?.end_date || "",
        district_id: specificSurveyData?.data?.district?.id?.toString() || '',
        gender_id: specificSurveyData?.data?.gender?.id?.toString() || '',
        cluster_id: specificSurveyData?.data?.cluster?.id?.toString() || '',
        industry_id: specificSurveyData?.data?.industry?.id?.toString() || '',
        program_id: specificSurveyData?.data?.program?.id?.toString() || '',
        event_detail_id: specificSurveyData?.data?.event_detail?.id?.toString() || '',
        activity_id: specificSurveyData?.data?.activity?.id?.toString() || '',
        direct_beneficiaries: specificSurveyData?.data?.direct_beneficiaries || '',
        question_field: mappedQuestion || [],
      });

      if (specificSurveyData?.data?.direct_beneficiaries === "Yes") {
        setBenefiValue("Yes")
      } else if (specificSurveyData?.data?.direct_beneficiaries === "No") {
        setBenefiValue("No")
      } else {
        setBenefiValue("")
      }
    }
  }, [specificSurveyData, form]);


  const [removedQuestionIds, setRemovedQuestionIds] = useState<string[]>([]);
  const [removedOptionIds, setRemovedOptionIds] = useState<string[]>([]);


  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {

    const question_sl_no = values.question_field?.map(
      (question) => question?.question_sl_no
    ) || [];

    const question_type_id = values.question_field?.map(
      (question) => question?.question_type_id
    ) || [];

    const survey_ques_title = values.question_field?.map(
      (question) => question?.survey_ques_title
    ) || [];


    const ans_type = values.question_field?.map(
      (question) => question.ans_type
    ) || [];

    const is_ques_required = values.question_field?.map(
      (question) => question.is_ques_required ? 1 : 0
    ) || [];


    // const survey_ques_opt_seq = values.question_field?.map((question) => {
    //   const options = question.question_type_option?.map(
    //     (option) => option.survey_ques_opt_seq
    //   );

    //   const optionsObject = options?.reduce((acc, curr, index) => {
    //     if (curr !== null && curr !== undefined) {
    //       acc[index] = curr;
    //     }
    //     return acc;
    //   }, {} as { [key: number]: string }) || {};

    //   return optionsObject;
    // }) || [];

    const survey_ques_opt_seq = values.question_field?.map((question) => {
      const options = question.question_type_option?.map((option) =>
        option.survey_ques_opt_seq || null // Replace empty sequences with null
      );

      // Create an object with non-null values
      const optionsObject = options?.reduce((acc, curr, index) => {
        if (curr !== null) {
          acc[index] = curr;
        }
        return acc;
      }, {} as { [key: number]: string | null }) || [];

      // Replace empty objects with null
      return Object.keys(optionsObject).length === 0 ? null : optionsObject;
    }) || [];

    // const ans_option_no = values.question_field?.map(
    //   (question) => question.question_type_option?.length || 0
    // ) || [];

    const ans_option_no = values.question_field?.map((question) => {
      const questionTypeId = question.question_type_id;
      const numericQuestionTypeId = typeof questionTypeId === 'string' ? parseInt(questionTypeId, 10) : questionTypeId;
      const isSpecialType = [3, 4].includes(numericQuestionTypeId || 0);
      return isSpecialType
        ? (question.question_type_option?.length || 0)
        : 0;
    }) || [];

    // const survey_ques_opt_title = values.question_field?.map((question) => {
    //   const options = question.question_type_option?.map(
    //     (option) => option.survey_ques_opt_title
    //   );



    //   const optionsObject = options?.reduce((acc, curr, index) => {
    //     if (curr !== null && curr !== undefined) {
    //       acc[index] = curr;
    //     }
    //     return acc;
    //   }, {} as { [key: number]: string }) || {};

    //   return optionsObject;
    // }) || [];

    const survey_ques_opt_title = values.question_field?.map((question) => {
      const options = question.question_type_option?.map((option) =>
        option.survey_ques_opt_title || null // Replace empty strings with null
      );

      // Create an object with non-null values
      const optionsObject = options?.reduce((acc, curr, index) => {
        if (curr !== null) {
          acc[index] = curr;
        }
        return acc;
      }, {} as { [key: number]: string | null }) || [];

      // Replace empty objects with null
      return Object.keys(optionsObject).length === 0 ? null : optionsObject;
    }) || [];


    //update value
    const question_id = specificSurveyData?.data.survey_questions?.map(
      (question: any) => question?.id
    ) || [];

    const filteredQuestionIds = question_id.filter(
      (id: any) => !removedQuestionIds.includes(id)
    );


    const survey_ques_opt_id = specificSurveyData?.data?.survey_questions?.map((question: any) => {
      const options = question.options?.map((option: any) =>
        option.id || null // Replace empty strings with null
      );

      // Create an object with non-null values
      const optionsObject = options?.reduce((acc: any, curr: any, index: any) => {
        if (curr !== null) {
          acc[index] = curr;
        }
        return acc;
      }, {} as { [key: number]: string | null }) || [];

      // Replace empty objects with null
      return Object.keys(optionsObject).length === 0 ? null : optionsObject;
    }) || [];




    try {
      const mutationFn = isEditMode ? updateSurvey : createSurvey;

      const common = {
        survey_title: values.survey_title,
        survey_type: values.survey_type,
        district_id: values.district_id,
        gender_id: values.gender_id,
        cluster_id: values.cluster_id,
        industry_id: values.industry_id,
        program_id: values.program_id,
        direct_beneficiaries: benefiValue,
        event_detail_id: values.event_detail_id,
        activity_id: values.activity_id,
        question_type_id: question_type_id,
        survey_ques_title: survey_ques_title,
        ans_option_no: ans_option_no,
        ans_type: ans_type,
        question_sl_no: question_sl_no,
        survey_ques_opt_seq: survey_ques_opt_seq,
        survey_ques_opt_title: survey_ques_opt_title,
        is_ques_required: is_ques_required,
        start_date: moment(values.start_date).format("YYYY-MM-DD"),
        end_date: moment(values.end_date).format("YYYY-MM-DD"),
      }

      const value = isEditMode ? {
        id: id,
        question_id: filteredQuestionIds,
        survey_ques_opt_id: survey_ques_opt_id,
        ...common

      } : {
        ...common
      }

      const res = await mutationFn(value).unwrap();
      if (res.code === 201) {
        form.reset();
        closeFormToggle();

        Swal.fire({
          title: "Success!",
          text: isEditMode ? "Survey Updated Successfully" : "Survey Created Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/survey-management/survey-list");
        });
        if (!isEditMode) closeFormToggle();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach((value: any) =>
        form.setError(value?.field, {
          type: "custom",
          message: value?.message,
        })
      );
      ToastError(`Failed to ${isEditMode ? "Update" : "Create"}`);
    }
  };

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "question_field",
  });

  const handleAddQuestion = () => {
    appendQuestion(question_type);
  };



  const handleRemoveQuestion = (index: number) => {
    if (editMode) {
      // Get the specific question_id and option_ids for the question being removed
      const questionIdToRemove = specificSurveyData?.data?.survey_questions?.[index]?.id;
      const optionIdsToRemove = specificSurveyData?.data?.survey_questions?.[index]?.options?.map(
        (option: any) => option.id
      ) || [];

      // Add the question_id and survey_ques_opt_id to the respective removed state
      if (questionIdToRemove) {
        setRemovedQuestionIds((prev) => [...prev, questionIdToRemove]);
      }
      if (optionIdsToRemove.length > 0) {
        setRemovedOptionIds((prev) => [...prev, ...optionIdsToRemove]);
      }
    }
    removeQuestion(index);
  };


  return (
    <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <div className=" mb-3 ">
        <p className="text-[25px] font-bold">
          {isEditMode ? "Update" : "Create"} Survey{" "}
        </p>
      </div>

      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormInput
                name="survey_title"
                placeholder="Enter Survey Title"
                label="Add Survey Title"
                remark={true}
              />
            </div>
            <div className="col-span-6">
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
                control={form.control}
              />
            </div>
            <div className="col-span-6">
              <FormAutoComplete
                name="event_detail_id"
                data={listArrayDaynamicModify(eventName?.data, "event_name", "event_name")}
                singleListName="event_name"
                label="Event Name"
                placeholder="Select"
                control={form.control}
              />
            </div>
            {/* <div className="col-span-6">
              <FormAutoComplete
                name="activity_id"
                data={listArrayDaynamicModify(
                  ActivityName?.data,
                  "name",
                  "name"
                )}
                singleListName="name"
                label="Activity Type"
                placeholder="Select"
                control={form.control}
              />
            </div> */}
            <div className="col-span-6">
              <FormDatePicker
                name="start_date"
                label="Survey Start Date"
                remark={true}
              />
            </div>
            <div className="col-span-6">
              <FormDatePicker
                name="end_date"
                label="Survey End Date"
                remark={true}
              />
            </div>
            <div className="col-span-6">
              <FormAutoComplete
                name="survey_type"
                data={listArrayDaynamicModify(surveyType, "name", "name")}
                singleListName="name"
                label="Survey Type"
                placeholder="Select"
                remark={true}
                control={form.control}
              />
            </div>
            <div className="col-span-6">
              {
                form.watch('survey_type') === '2' && <FormAutoComplete
                  name="gender_id"
                  data={listArrayDaynamicModify(
                    genderList?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Gender"
                  placeholder="Select Gender"
                  control={form.control}
                  remark={true}
                />
              }
              {
                form.watch('survey_type') === '3' && <FormAutoComplete
                  name="district_id"
                  data={listArrayDaynamicModify(
                    districtList?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="District"
                  placeholder="Select District"
                  control={form.control}
                  remark={true}
                />
              }
              {
                form.watch('survey_type') === '4' && <FormAutoComplete
                  name="cluster_id"
                  data={listArrayDaynamicModify(
                    clusterList?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Cluster"
                  placeholder="Select Cluster"
                  control={form.control}
                  remark={true}
                />
              }
              {
                form.watch('survey_type') === '5' && <FormAutoComplete
                  name="industry_id"
                  data={listArrayDaynamicModify(
                    industryList?.data,
                    "name",
                    "name"
                  )}
                  singleListName="name"
                  label="Industry"
                  placeholder="Select Industry"
                  control={form.control}
                  remark={true}
                />
              }
              {
                form.watch('survey_type') === '6' && <>
                  <p
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#4B5563] pb-4">
                    Beneficiaries
                  </p>
                  <select
                    className="border border-spacing-2 p-[10px] w-full bg-white rounded-lg"
                    onChange={(e) => setBenefiValue(e.target.value)}
                    value={benefiValue}
                  >
                    <option value="" disabled>
                      Select Beneficiaries
                    </option>
                    {beneficiariesData.map((data) => (
                      <option key={data.id} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </select>

                </>
              }
            </div>
            {benefiValue === "Yes" && (
              <div className="col-span-6">
                <FormAutoComplete
                  name="activity_id"
                  data={listArrayDaynamicModify(allActivityCategory?.data, "activity_category", "name")}
                  singleListName="activity_category"
                  label="Activity Category"
                  placeholder="Select Activity Category"
                  remark={true}
                />
              </div>
            )}


          </div>
          {/* =========Question ========= */}


          {questionFields.map((question, questionIndex) => {
            const currentQuestionTypeId = questionTypeIds?.[questionIndex]?.question_type_id
            const shouldShowAnswerComponent = [3, 4].includes(parseInt(currentQuestionTypeId || '', 10));


            return (
              <div
                key={question.id}
                className="bg-[#F4F4F4] p-3 rounded-lg border mt-4"
              >
                <div className="grid grid-cols-12 gap-4">
                  {/* <div className="col-span-6">
                    <FormInput
                      name={`question_field[${questionIndex}].question_sl_no`}
                      placeholder="Enter Question No."
                      label="Question No."
                    />
                  </div> */}
                  <div className="col-span-6">
                    <FormAutoComplete
                      name={`question_field[${questionIndex}].question_type_id`}
                      data={listArrayDaynamicModify(questionType, "name", "name")}
                      singleListName="name"
                      label="Question Type"
                      placeholder="Select"
                      control={form.control}
                    />

                  </div>
                  <div className="col-span-6">
                    <FormInput
                      name={`question_field[${questionIndex}].survey_ques_title`}
                      placeholder="Enter Question Title"
                      label="Question Title"
                    />
                  </div>
                  <div className="col-span-6">
                    {
                      currentQuestionTypeId == '3' && <FormAutoComplete
                        name={`question_field[${questionIndex}].ans_type`}
                        data={listArrayDaynamicModify(answerType, "name", "name")}
                        singleListName="name"
                        label="Answer Type"
                        placeholder="Select"
                        control={form.control}
                      />
                    }

                  </div>
                </div>
                {shouldShowAnswerComponent && (
                  <AnswerComponent control={form.control} setValue={setValue} Index={questionIndex} />
                )}
                <div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  {/* <Switch
                    id={`question-${questionIndex}-required`}
                    name={`question_field[${questionIndex}].is_ques_required`}
                    className="mt-3 data-[state=checked]:bg-[#0cb04d]"
                    onCheckedChange={(checked) => handleSwitchChange(questionIndex, checked)}
                    checked={form.watch(`question_field.${questionIndex}.is_ques_required`)}
                  /> */}
                  {questionFields.length > 1 && (
                    <Button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    >
                      Delete Question
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="bg-green-700 text-white rounded-lg p-1 w-[120px] text-center cursor-pointer"
                    onClick={handleAddQuestion}
                  >
                    Add More
                  </Button>
                </div>
              </div>
            )
          }


          )}


          <div className="p-4">
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
  );
};


export default SurveyCreate;
