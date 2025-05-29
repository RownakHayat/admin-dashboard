
import { useGetSurveyReportQuery } from "@/store/features/report/surveyReport";
import Image from "next/image";
import Binary from "./Binary";
import Dropdown from "./Dropdown";
import InputQuestion from "./InputQuestion";
import Multiple from "./Multiple";
import MultipleSingle from "./MultipleSingle";

const SurveyReportView = ({ id }: any) => {

  const { data, error } = useGetSurveyReportQuery(id, {
    skip: id == null || id == undefined, refetchOnMountOrArgChange: true
  });

  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();


  return (
    <>
      <style>{`
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
        .first-page {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        text-align: center;
        }
        .second-page {
        height: 100vh;

        }
        .intro_div{
        margin-top: 30mm
        }
        .first-page a {
        white-space: warp; /* Prevent the link from wrapping */
        }
        .survey-item {
        break-inside: avoid; /* Prevents splitting across pages */
        page-break-inside: avoid;
        }
  th, td {
    width: 25%; /* Adjust based on the number of columns */
    word-wrap: break-word;
  }
      tr {
    break-inside: avoid;
  }
      }
    `}</style>
      <div >
        <div className="grid grid-cols-12 gap-4 mt-4" >
          <div className="col-span-12 text-center first-page" >
            <div>
              <h4 className='text-4xl pb-3'>Survey Report</h4>
            </div>
            <div className="flex justify-center">
              <Image
                src="/assets/Image/SMEF-Logo.png"
                alt="Reload"
                width={130}
                height={80}
                className='cursor-pointer'
              />
            </div>
            <div>
              <h4 className='text-2xl font-bold pt-3 '>Planning Monitoring and Evaluation Section </h4>
              <p className='text-xl font-bold'>The Small and Medium Enterprise Foundation (SME Foundation) </p>
              <p className='text-xl '>This report was compiled by the SME Foundation {monthName}, {year} </p>
              <p className='text-lg font-bold'>
                {/* Parjatan Bhaban (Level-6&7), E-5/C-1, Agargaon Administrative Area, Dhaka - 1207, Bangladesh */}



                <br />
                <span>
                  <a href="https://www.smef.gov.bd" target="_blank">www.smef.gov.bd</a>
                </span>
              </p>
              <p className='text-base font-bold'>
                <a href="" target="_blank" rel="noopener noreferrer">
                </a>
              </p>
            </div>
          </div>
          {/* <div className="col-span-12 text-center second-page" >
            <div>
              <h4 className='text-4xl pb-3 text-center'>Table of Contents</h4>
            </div>
            <div>
              <ul className="list-disc text-left font-medium">
                <li className="pb-2">Introduction</li>
                <li className="pb-2">Analysis</li>
              </ul>
            </div>
          </div> */}
          <div className="col-span-12 text-left second-page p-4" >
            <div>
              <h4 className='text-4xl pb-3 text-center'>Introduction </h4>
            </div>

            <div className="intro_div">
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">Survey Title</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.survey_title}</div>
              </div>
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">Program Name</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.program?.name_en}</div>
              </div>
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">Venue</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.program?.name_en}</div>
              </div>
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">Event Name</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.event_detail?.event_name}</div>
              </div>
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">Start Date</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.start_date}</div>
              </div>
              <div className="flex w-full pb-5">
                <div className="w-[20%] flex justify-between text-lg font-medium">
                  <span className="text-lg font-medium">End Date</span>
                  <span>:</span>
                </div>
                <div className="break-words w-[80%] pl-3 text-wrap font-normal"
                >{data?.data?.details?.end_date}</div>
              </div>


            </div>
          </div>

          <div className="col-span-12" >
            <div>
              <h4 className='text-4xl pb-3 text-center'>Analysis</h4>
            </div>
            <div>

              {
                data?.data?.data?.map((survey_item: any, index: number) => {
                  return (
                    <div key={index} className="survey-item-container">
                      <div className=" p-4 bg-gray-50 survey-item">
                        <div className="border border-yellow-300  rounded">
                          <div className="flex w-full">
                            <div className="w-[5%] bg-yellow-400 rounded flex justify-center items-center p-3">
                              <p className="font-bold">{index + 1}</p>
                            </div>
                            <div className="w-[95%] bg-yellow-200 p-3 flex items-center">
                              <p className="font-bold">{survey_item?.question}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-200">
                            {survey_item?.question_type == 1 || survey_item?.question_type == 2 ? <InputQuestion survey_item={survey_item} /> : null}
                            {survey_item?.question_type == 3 && survey_item?.ans_type == 1 ? <MultipleSingle survey_item={survey_item} /> : null}
                            {survey_item?.question_type == 3 && survey_item?.ans_type == 2 ? <Multiple survey_item={survey_item} /> : null}
                            {survey_item?.question_type == 4 ? <Dropdown survey_item={survey_item} /> : null}
                            {survey_item?.question_type == 5 ? <Binary survey_item={survey_item} /> : null}
                          </div>


                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
export default SurveyReportView