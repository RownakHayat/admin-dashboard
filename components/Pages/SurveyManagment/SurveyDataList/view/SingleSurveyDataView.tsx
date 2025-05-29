import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { z } from "zod";
import { eventSchema } from "@/components/Pages/EventManagement/NewEvent/schemas/eventSchema";
import { useGetSpecificSurveyQuestinDataQuery } from "@/store/features/survey";
import FormInput from "@/components/common/Form/FormInput";
import { useForm } from "react-hook-form";
import FormTextArea from "@/components/common/Form/FormTextArea";
import FormContainer from "@/components/common/Form/FormContainer";

interface SurveyValueProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof eventSchema>) => void;
  singleSurveyDataValues?: any;
  id?: any;
}


const SingleSurveyDataView: React.FC<SurveyValueProps> = ({
  open,
  onClose,
  onSave,
  singleSurveyDataValues,
  id
}) => {

  const { data, error } = useGetSpecificSurveyQuestinDataQuery(id, {
    skip: id == null || id == undefined, refetchOnMountOrArgChange: true
  });

  const form = useForm({
    defaultValues: {
    },
  });


  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[65%] w-[100%] h-[95%] p-0 bg-[#e9e9ea]">
          <div className="overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg">
            <div className="grid grid-cols-12 gap-y-3 text-wrap my-5">
              <div className="xs:col-span-12 sm:col-span-12 md:col-span-12 text-sm">
                <h1 className="mt-8 text-4xl font-semibold uppercase text-center">
                  {data?.data?.survey_title}
                </h1>
                <p className="text-center text-xl font-light pt-5 pb-2">Program: {data?.data?.program?.name_en}</p>
                <p className="text-center text-xl font-light pb-2">Event: {data?.data?.event_detail?.event_name}</p>
                <p className="text-center text-xl font-light pb-2">
                  Survey Type: {data?.data?.survey_type == 1 ? "Open Survey" : data?.data?.survey_type == 2 ? "Gender Based Survey" :
                    data?.data?.survey_type == 3 ? "District Based Survey" :  data?.data?.survey_type == 4 ? "Cluster Based Survey" : data?.data?.survey_type == 5 ? "Industry Based Survey" : data?.data?.survey_type == 6 ?  "Direct Beneficiaries Survey" : "" }
                </p>
                {
                  data?.data?.survey_type == 2 && <p className="text-center text-xl font-light">Gender: {data?.data?.gender?.name}</p>
                }
                {
                  data?.data?.survey_type == 3 && <p className="text-center text-xl font-light">District: {data?.data?.district?.name}</p>
                }
                {
                  data?.data?.survey_type == 4 && <p className="text-center text-xl font-light">Cluster: {data?.data?.cluster?.name}</p>
                }
                {
                  data?.data?.survey_type == 5 && <p className="text-center text-xl font-light">Industry: {data?.data?.industry?.name}</p>
                }
                {
                  data?.data?.survey_type == 6 && data?.data?.direct_beneficiaries === "Yes" && <p className="text-center text-xl font-light">Activity Category: {data?.data?.activity_category?.name}</p>
                }
                <hr className="mt-5 mb-5" />
                <hr className="mt-3 mb-5" />
                {/* <h1 className="text-2xl uppercase text-left font-normal">Survey Question List</h1>
                <hr className="mt-3 mb-5" /> */}

                <div className="">
                  <FormContainer
                    form={form}

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
                                  {survey_question?.question_type_id == 1 ? (
                                    <>
                                      <FormInput
                                        name=""
                                        placeholder="Short-answer text"
                                        disabled
                                      />
                                    </>
                                  ) : survey_question?.question_type_id == 2 ? (
                                    <>
                                      <FormTextArea
                                        name=""
                                        className="w-full h-[50px] px-2 rounded-lg border"
                                        disabled
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
                                                  name=""
                                                  value={survey_option.id}
                                                  className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                                  disabled
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
                                                  name=""
                                                  value={survey_option.id}
                                                  className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                                  disabled
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
                                      <select
                                        name=""
                                        className="border border-spacing-2 p-[10px] w-full bg-white rounded-lg"
                                      >
                                        <option value="" disabled>
                                          Select an option
                                        </option>
                                        {survey_question?.options.map(
                                          (survey_option: any, index: any) => (
                                            <option key={index} value={survey_option.id} disabled>
                                              {survey_option.survey_ques_opt_title}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </>
                                  ) : survey_question?.question_type_id == 5 ? (
                                    <>
                                      <div>
                                        <label className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            name=""
                                            value="1"
                                            disabled
                                            className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                          />
                                          <span className="text-gray-700">True</span>
                                          <input
                                            type="radio"
                                            name=""
                                            value="0"
                                            disabled
                                            className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
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

                  </FormContainer>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleSurveyDataView;
