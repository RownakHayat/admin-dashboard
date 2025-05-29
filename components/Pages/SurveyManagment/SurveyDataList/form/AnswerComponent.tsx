import FormInput from '@/components/common/Form/FormInput';
import FormTextArea from '@/components/common/Form/FormTextArea';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';


interface AnswerComponentProps {
  control: Control<any>; 
  setValue: UseFormSetValue<any>;
  Index: number;
}

const AnswerComponent: React.FC<AnswerComponentProps> = ({ control,setValue, Index }) => {
  const { fields: answerFields, append: appendAnswer, remove: removeAnswer } = useFieldArray({
    control,
    name: `question_field[${Index}].question_type_option`,
  });
  // const handleAddOption = () => {
  //   appendAnswer({ survey_ques_opt_seq: '', survey_ques_opt_title: '' });
  // };

  useEffect(() => {
    answerFields.forEach((field:any, i) => {
      if (!field.survey_ques_opt_seq) {
        setValue(`question_field[${Index}].question_type_option[${i}].survey_ques_opt_seq`, (i + 1).toString());
      }
    });
  }, [answerFields, Index, setValue]);


  const handleAddOption = () => {
    appendAnswer({ survey_ques_opt_seq: (answerFields.length + 1).toString(), survey_ques_opt_title: "" });
  };

  return (<>
             {answerFields?.map((item, index) => (
                <div key={item?.id} className="grid grid-cols-12 gap-2 my-2">
                  <div className="col-span-11">
                    <div className="bg-[#F4F4F4] border rounded-lg p-3">
                      <div className="flex justify-between">
                        <div>
                          <p>Sequence</p>
                          <FormInput
                            name={`question_field[${Index}].question_type_option[${index}].survey_ques_opt_seq`}
                            className="text-center h-[55px]"
                            defaultValue={index + 1}
                            disabled 
                          />
                        </div>
                        <div className="ml-3 w-full">
                          <p>Option Title</p>
                          <FormTextArea
                            name={`question_field[${Index}].question_type_option[${index}].survey_ques_opt_title`}
                            className="w-full h-[50px] px-2 rounded-lg border"
                          />
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="grid gap-3">
                      {answerFields.length > 1 && (
                        <div
                          className="bg-[#fceded] rounded-lg border border-[#E34849] p-2 cursor-pointer"
                        >
                          <Trash2 className="text-red-500 w-[20px]"
                          onClick={() => removeAnswer(index)}
                          />
                        </div>
                      )}
                      <div
                        className="bg-[#0CB04D] rounded-lg border p-2 cursor-pointer"

                      >
                        <Plus className="text-white w-[20px]"
                         onClick={handleAddOption}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))} 
  </>)
}

export default AnswerComponent