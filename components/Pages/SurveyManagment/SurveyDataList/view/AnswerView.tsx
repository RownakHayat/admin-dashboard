import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { useGetSpecificSurveyAnswerListQuery } from "@/store/features/surveyManagement/surveyDataList";
import { useForm } from "react-hook-form";

const AnswerView = ({ id }: any) => {

  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const form = useForm({
    defaultValues: {
    },
  });

  const {
    data: listQuery,
    isLoading,
    isError,
    refetch
  } = useGetSpecificSurveyAnswerListQuery({ ...params, id })

  const obj = '[{"survey_ques_opt_id":1,"survey_ques_ans":"Answering factual questions"},{"survey_ques_opt_id":3,"survey_ques_ans":"Providing creative writing prompts"}]'
  return (
    <>
      <div className='p-1'>
        <h1 className="text-2xl font-medium my-2 text-center">Survey Participate </h1>
        <hr className="mt-5 mb-5" />
        {/* {
          listQuery?.data.map((item: any, index: any) => {

            return (
              <>
                <div key={index}>
                  <h3 className="text-2xl font-medium pb-4">{index + 1}. {item?.question?.survey_ques_title}</h3>
                  <p className="pb-4 pl-5"> <span className="text-lg">Ans :</span>
                    <span>
                      {item?.survey_ques_ans}
                    </span>
                  </p>
                  <p>{item?.question?.question_type_id}</p>



                  <hr className="mt-5 mb-5" />
                </div>

              </>
            )
          }
          )
        } */}

        <div className="">
          <FormContainer
            form={form}
          >
            {listQuery?.data?.map(
              (item: any, index: number) => {

                return (
                  <>
                    <p
                      key={item.id}
                      className="text-xl font-semibold pt-5  "
                    >
                      <span className="capitalize text-[#767676]">
                        {index + 1}. {item?.question?.survey_ques_title}
                      </span>
                    </p>
                    <div className="">
                      <div className="">
                        <div className="">
                          {/* <pre>{JSON.stringify(survey_question.id, null, 2)}</pre> */}
                          {item?.question?.question_type_id == 1 ? (
                            <>
                              <FormInput
                                name=""
                                placeholder={item?.survey_ques_ans}
                                value={item?.survey_ques_ans}
                                className="placeholder-black"
                              />
                            </>
                          ) : item?.question?.question_type_id == 2 ? (
                            <>
                              <FormTextArea
                                name=""
                                placeholder={item?.survey_ques_ans}
                                value={item?.survey_ques_ans}
                                className="w-full px-2 rounded-lg border placeholder-black"
                                style={{ minHeight: '150px' }}
                              />
                            </>
                          ) : item?.question?.question_type_id == 3 && item?.question?.ans_type == 1 ? (
                            <>
                              <div className="flex flex-wrap">
                                {item?.question?.options?.map(
                                  (survey_option: any, index: number) => {
                                    const isChecked = survey_option?.id === item?.survey_ques_opt_id;
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
                                            checked={isChecked}
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
                            </>
                          ) : item?.question?.question_type_id == 3 && item?.question?.ans_type == 2 ? (
                            <>
                              {/* <p>{JSON.parse(item?.survey_ques_ans).map((item: any) => (
                                <li key={item.survey_ques_opt_id}>
                                  {item.survey_ques_ans}
                                </li>
                              ))}</p> */}
                              <div className="flex flex-wrap">
                                {item?.question?.options?.map(
                                  (survey_option: any, index: number) => {
                                    const isChecked = new Set(JSON.parse(item?.survey_ques_ans).map((answer: any) => answer.survey_ques_opt_id)).has(survey_option.id);
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
                                            checked={isChecked}
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
                            </>
                          ) : item?.question?.question_type_id == 4 ? (
                            <>
                              <select
                                name=""
                                className="border border-spacing-2 p-[10px] w-full bg-white rounded-lg"
                              >
                                <option value={item.survey_ques_ans}>
                                  {item.survey_ques_ans}
                                </option>
                                {item?.question?.options?.map(
                                  (survey_option: any, index: any) => (
                                    <option key={index} value={survey_option.id} disabled>
                                      {survey_option.survey_ques_opt_title}
                                    </option>
                                  )
                                )}
                              </select>
                            </>
                          ) : item?.question?.question_type_id == 5 ? (
                            <>
                              <div>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name=""
                                    value="1"
                                    disabled
                                    checked={item?.survey_ques_ans == 1}
                                    className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                  />
                                  <span className="text-gray-700">True</span>
                                  <input
                                    type="radio"
                                    name=""
                                    value="0"
                                    disabled
                                    checked={item?.survey_ques_ans == 0}
                                    className="form-checkbox h-4 w-4 border-2 border-green-500 focus:ring-0 text-green-600 rounded"
                                  />
                                  <span className="text-gray-700">False</span>
                                </label>
                              </div>
                            </>
                          ) : <></>}
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
    </>
  )
}
export default AnswerView
