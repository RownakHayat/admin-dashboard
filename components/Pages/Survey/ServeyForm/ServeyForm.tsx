"use client";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import {
  useCreateParticipateSurveyMutation,
  useGetSpecificSurveyQuestinDataQuery,
} from "@/store/features/survey";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

export const serveyForm = z.object({
  survey_participate: z.array(
    z.object({
      survey_ques_id: z.number().optional(),
      survey_ques_opt: z
        .array(
          z.object({
            survey_ques_opt_id: z.number().nullable(),
            survey_ques_ans: z.union([z.string(), z.boolean()]).optional(),
            // survey_ques_ans: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
});

const ServeyForm = ({ rowData }: any) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // const form = useForm<z.infer<typeof serveyForm>>({
  //   resolver: zodResolver(serveyForm),
  //   defaultValues: {
  //     survey_participate: [],
  //   },
  // });


  const { data, error } = useGetSpecificSurveyQuestinDataQuery(id, {
    skip: id == null || id == undefined,
  });



  const { data: userInfo, refetch } = useAuthUserQuery();

  const [createParticipateSurvey] = useCreateParticipateSurveyMutation();


  const form = useForm({
    defaultValues: {
      survey_participate: data?.data?.survey_questions?.map(() => ({
        survey_ques_id: null,
        survey_ques_opt: [],
      })) || [],
    },
    mode: "onChange", // No validation mode
  });

  const handleCheckboxChange = (
    survey_ques_id: number,
    survey_ques_opt_id: number,
    survey_ques_ans: string,
    isChecked: boolean
  ) => {
    const currentValues = form.getValues("survey_participate");
    const questionIndex = currentValues.findIndex(
      (item: any) => item?.survey_ques_id === survey_ques_id
    );

    if (questionIndex >= 0) {
      const existingOptions =
        currentValues[questionIndex].survey_ques_opt || [];
      const updatedOptions = isChecked
        ? [...existingOptions, { survey_ques_opt_id, survey_ques_ans }]
        : existingOptions.filter(
          (opt: any) => opt.survey_ques_opt_id !== survey_ques_opt_id
        );

      form.setValue(
        `survey_participate.${questionIndex}.survey_ques_opt`,
        updatedOptions
      );
    } else {
      form.setValue("survey_participate", [
        ...currentValues,
        {
          survey_ques_id,
          survey_ques_opt: [{ survey_ques_opt_id, survey_ques_ans }],
        },
      ]);
    }
  };

  const handleRadioChange = (
    survey_ques_id: number,
    survey_ques_opt_id: number | null,
    survey_ques_ans: string | boolean
  ) => {
    const currentValues = form.getValues("survey_participate");
    const questionIndex = currentValues.findIndex(
      (item: any) => item?.survey_ques_id === survey_ques_id
    );

    if (questionIndex >= 0) {
      form.setValue(`survey_participate.${questionIndex}.survey_ques_opt`, [
        { survey_ques_opt_id, survey_ques_ans },
      ]);
    } else {
      form.setValue("survey_participate", [
        ...currentValues,
        {
          survey_ques_id,
          survey_ques_opt: [{ survey_ques_opt_id, survey_ques_ans }],
        },
      ]);
    }
  };


  const handleTextInputChange = (
    survey_ques_id: number,
    survey_ques_ans: string
  ) => {
    const currentValues = form.getValues("survey_participate");
    const questionIndex = currentValues.findIndex(
      (item: any) => item?.survey_ques_id === survey_ques_id
    );

    if (questionIndex >= 0) {
      form.setValue(`survey_participate.${questionIndex}.survey_ques_opt`, [
        { survey_ques_opt_id: null, survey_ques_ans },
      ]);
    } else {
      form.setValue("survey_participate", [
        ...currentValues,
        {
          survey_ques_id,
          survey_ques_opt: [{ survey_ques_opt_id: null, survey_ques_ans }],
        },
      ]);
    }
  };

  const handleSelectChange = (
    survey_ques_id: number,
    survey_ques_opt_id: number,
    survey_ques_ans: string
  ) => {
    const currentValues = form.getValues("survey_participate");
    const questionIndex = currentValues.findIndex(
      (item: any) => item?.survey_ques_id === survey_ques_id
    );

    if (questionIndex >= 0) {
      form.setValue(`survey_participate.${questionIndex}.survey_ques_opt`, [
        { survey_ques_opt_id, survey_ques_ans },
      ]);
    } else {
      form.setValue("survey_participate", [
        ...currentValues,
        {
          survey_ques_id,
          survey_ques_opt: [{ survey_ques_opt_id, survey_ques_ans }],
        },
      ]);
    }
  };

  const onSubmitHandler = async (values: any) => {
    const surveyId = data?.data?.id;

    const filteredParticipate = values.survey_participate.filter(
      (participate: any) =>
        participate?.survey_ques_id && participate.survey_ques_opt.length > 0
    );

    const formattedData = {
      survey_id: surveyId,
      survey_participate: filteredParticipate.map((participate: any) => ({
        survey_ques_id: participate.survey_ques_id,
        survey_ques_opt: participate.survey_ques_opt.map((opt: any) => ({
          survey_ques_opt_id: opt.survey_ques_opt_id ?? null,
          // survey_ques_ans: opt.survey_ques_ans,
          survey_ques_ans:
            opt.survey_ques_ans === "1"
              ? true
              : opt.survey_ques_ans === "0"
                ? false
                : opt.survey_ques_ans,
        })),
      })),
    };


    try {
      const res = await createParticipateSurvey(formattedData).unwrap();

      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        Swal.fire({
          title: 'Success!',
          text: "Survey Participated Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        }).then(() => {
          router.push("/admin/survey");
        });
      }
    } catch (err: any) {
      // Handle errors, setting them to the form where necessary
      err?.data?.errors?.forEach((value: any) =>
        form.setError(value?.field, {
          type: "custom",
          message: value?.message,
        })
      );
    }
  };


  return (
    <>
      <div className="bg-white p-5 rounded">

        <h1 className="mt-8 text-4xl font-semibold uppercase text-center">
          {data?.data?.survey_title}
        </h1>
        <p className="text-center text-xl font-light pt-5 pb-5">Program: {data?.data?.program?.name_en}</p>
        <p className="text-center text-xl font-light">Event: {data?.data?.event_detail?.event_name}</p>
        <hr className="mt-5 mb-5" />
        {/* <div className="mt-5">
        <h1 className="text-4xl pb-3 font-bold">
          {userInfo?.data?.name && userInfo?.data?.name}
        </h1>
        <h4 className="text-2xl font-light pb-3">
          {userInfo?.data?.role?.name && userInfo?.data?.role?.name}
        </h4>
        <p className="pb-2  tracking-wide">
          Email: {userInfo?.data?.email && userInfo?.data?.email}
        </p>
        <p className="pb-2 tracking-wide">
          Phone No: {userInfo?.data?.mobile && userInfo?.data?.mobile}
        </p>
        <p className="tracking-wide">
          Location:
          {userInfo?.data?.user_profile?.district?.name &&
            userInfo?.data?.user_profile?.district?.name}
          {userInfo?.data?.user_profile?.division?.name &&
            userInfo?.data?.user_profile?.division?.name}{" "}
        </p>
      </div> */}
        <div className="">
          <FormContainer
            form={form}
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            {data?.data?.survey_questions?.map(
              (survey_question: any, index: number) => {

                return (
                  <>
                    <p
                      key={survey_question.id}
                      className="text-xl font-semibold pt-5  "
                    >
                      <span className="capitalize text-[#767676]">
                        {index + 1}. {survey_question?.survey_ques_title}
                      </span>
                    </p>
                    <div className="">
                      <div className="">
                        <div className="">
                          {/* <pre>{JSON.stringify(survey_question.id, null, 2)}</pre> */}
                          {survey_question?.question_type_id == 1 ? (
                            <>
                              <FormInput
                                name={`survey_participate.${index}.survey_ques_ans`}
                                placeholder="Short-answer text"
                                onChange={(e: any) =>
                                  handleTextInputChange(
                                    survey_question.id,
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          ) : survey_question?.question_type_id == 2 ? (
                            <>
                              <FormTextArea
                                name={`survey_participate.${index}.survey_ques_ans`}
                                className="w-full h-[50px] px-2 rounded-lg border"
                                onChange={(e: any) =>
                                  handleTextInputChange(
                                    survey_question.id,
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          ) : survey_question?.question_type_id == 3 &&
                            survey_question?.ans_type == 1 ? (
                            <div className="flex flex-wrap">
                              {survey_question?.options.map(
                                (survey_option: any, index: number) => {
                                  return (
                                    <>
                                      <label
                                        key={survey_option.index}
                                        className="flex items-center space-x-2 w-1/2 pb-5"
                                      >
                                        <input
                                          type="radio"
                                          name={`question_${survey_question.id}`}
                                          value={survey_option.id}
                                          onChange={() =>
                                            handleRadioChange(
                                              survey_question.id,
                                              survey_option.id,
                                              survey_option.survey_ques_opt_title
                                            )
                                          }
                                          className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                        />
                                        <span className="text-gray-700">
                                          {survey_option?.survey_ques_opt_title}
                                        </span>
                                      </label>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          ) : survey_question?.question_type_id == 3 &&
                            survey_question?.ans_type == 2 ? (
                            <div className="flex flex-wrap">
                              {survey_question?.options.map(
                                (survey_option: any, index: number) => {
                                  return (
                                    <>
                                      <label
                                        key={survey_option.index}
                                        className="flex items-center space-x-2 w-1/2 pb-5"
                                      >
                                        <input
                                          type="checkbox"
                                          name={`question_${survey_question.id}_${survey_option.id}`}
                                          value={survey_option.id}
                                          className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              survey_question.id,
                                              survey_option.id,
                                              survey_option.survey_ques_opt_title,
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="text-gray-700">
                                          {survey_option.survey_ques_opt_title}
                                        </span>
                                      </label>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          ) : survey_question?.question_type_id == 4 ? (
                            <>
                              <div className="relative inline-block w-full">
                                <select
                                  name={`question_${survey_question.id}`}
                                  className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                  onChange={(e) =>
                                    handleSelectChange(
                                      survey_question.id,
                                      parseInt(e.target.value, 10), // Ensure value is a number
                                      e.target.options[e.target.selectedIndex].text // Option text as the answer
                                    )
                                  }
                                >
                                  <option value="" disabled selected>
                                    Select an option
                                  </option>
                                  {survey_question?.options.map(
                                    (survey_option: any, index: any) => (
                                      <option key={index} value={survey_option.id}>
                                        {survey_option.survey_ques_opt_title}
                                      </option>
                                    )
                                  )}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10l5 5 5-5H7z"></path>
                                  </svg>
                                </div>
                              </div>
                            </>
                          ) : survey_question?.question_type_id == 5 ? (
                            <>
                              <div>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`question_${survey_question.id}`}
                                    value="1"
                                    className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                    onChange={() =>
                                      handleRadioChange(
                                        survey_question.id,
                                        null,
                                        true // Pass true for the "True" option
                                      )
                                    }
                                  />
                                  <span className="text-gray-700">True</span>
                                  <input
                                    type="radio"
                                    name={`question_${survey_question.id}`}
                                    value="0"
                                    className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                    onChange={() =>
                                      handleRadioChange(
                                        survey_question.id,
                                        null,
                                        false // Pass false for the "False" option
                                      )
                                    }
                                  />
                                  <span className="text-gray-700">False</span>
                                </label>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              }
            )}

            <div className="flex gap-5 justify-end mt-5">
              <Button type="button" className="bg-[#e34849] hover:bg-[#e34849] p-5"
                onClick={() => router.push("/admin/survey")}
              >
                Close
              </Button>
              {/* <Button type="button" className="bg-[#f0953e] hover:bg-[#f0953e] p-5"
                      onClick={() => {
                        // Reset all input fields to their initial state
                        // form.reset({
                        //   survey_participate: data?.data?.survey_questions?.map(() => ({
                        //     survey_ques_id: null,
                        //     survey_ques_opt: [],
                        //   })) || [],
                        // });
                       
                      }}
              >
                Clear all
              </Button> */}

              <Button
                type="submit"
                className="bg-[#2b7d74] hover:bg-[#2b7d74] p-5"
              >
                Submit
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default ServeyForm;
