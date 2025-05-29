
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

const tableHead = [
  {
    id: 1,
    name: "Id"
  },
  {
    id: 2,
    name: "Budget Item Name"
  },
  {
    id: 3,
    name: "Budget Item Unit"
  },
  {
    id: 4,
    name: "Unit Price"
  },
  {
    id: 5,
    name: "No of items"
  },
  {
    id: 6,
    name: "Total Cost"
  }
]

const ProgramView = ({ singleParticipateValues }: any) => {


  return (
    <>
      <div className="absolute right-0 top-0  w-[100%] rounded-t-lg p-2">
        <p className="text-right mr-9 mt-1 flex justify-end">
        </p>
      </div>
      <div className="overflow-y-scroll p-6 m-6 mt-12 bg-[#fff] rounded-lg">
        <div className="xs:col-span-12 sm:col-span-12 md:col-span-12 text-sm">
          <div>
            <p className="text-[18px] font-bold text-center pt-5 pb-5 text-wrap break-words">
              {singleParticipateValues?.data?.program_detail?.name_en} Details (Program)
            </p>
          </div>
        </div>
        <div className="border border-t-1"></div>
        <div>
          <div className="grid grid-cols-12 gap-y-3 my-5 text-wrap break-words">
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Program Name (English)</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9  text-sm">
              <div>{singleParticipateValues?.data?.program_detail?.name_en}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Financial Year</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9  text-sm">
              <div>{singleParticipateValues?.data?.program_detail?.financial_year?.name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Total Amount</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9  text-sm">
              <div>{singleParticipateValues?.data?.program_detail?.total_amount}</div>
            </div>
            <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
              <div>
                <p className="text-[18px] font-bold text-center pt-5 pb-5"> Budget Item Details</p>
              </div>
            </div>
            <div className="col-span-12 overflow-x-scroll">
              {
                singleParticipateValues?.data?.program_detail?.budget_item_details.length > 0 &&
                <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-[#D6DDFF]">
                        {
                          tableHead.map((thead, index) => {
                            return (
                              < >
                                <th className="py-2 px-4 border border-b text-center" key={index}>{thead?.name}</th>
                              </>
                            )
                          })
                        }
                      </tr>
                    </thead>

                    <tbody>
                      {singleParticipateValues?.data?.program_detail?.budget_item_details?.map((item: any, index: number) => (
                        <tr key={item.id} className='text-center'>
                          <td className="py-2 px-4 border border-b">{index + 1}</td>
                          <td className="py-2 px-4 border border-b">{item?.budget_item?.name}</td>
                          <td className="py-2 px-4 border border-b">{item?.budget_item?.unit}</td>
                          <td className="py-2 px-4 border border-b">{item?.unit_cost}</td>
                          <td className="py-2 px-4 border border-b">{item?.no_of_unit}</td>
                          <td className="py-2 px-4 border border-b">{item?.total_cost}</td>
                        </tr>
                      ))}
                      <tr className='text-center'>
                        <td className="py-2 px-4 border border-b text-right" colSpan={5}>Total Amount</td>
                        <td className="py-2 px-4 border border-b">{singleParticipateValues?.data?.program_detail?.total_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            </div>


            {
              singleParticipateValues?.data?.program_detail?.program_details_attachments.length > 0 &&
              <>
                <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
                  <div>
                    <p className="text-[18px] font-bold text-center pt-5 pb-5"> Program Attachment</p>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-[#D6DDFF]">
                        <th className="py-2 px-4 border border-b text-center">Name</th>
                        <th className="py-2 px-4 border border-b text-center">Attachmenmt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleParticipateValues?.data?.program_detail?.program_details_attachments?.map((item: any, index: number) => (
                        <tr key={item.id} className='text-center'>
                          <td className="py-2 px-4 border border-b">{item?.attachment_name}</td>
                          <td className="py-2 px-4 border border-b flex justify-center items-center">
                            {
                              item?.attach_file_path.split('.').pop()?.toLowerCase() === 'pdf' ? <>
                                <Link href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}>
                                  <Image
                                    priority={true}
                                    src="/assets/Image/pdf.png"
                                    alt={`Attachment for ${item?.name}`}
                                    width={128}
                                    height={128}
                                    className="pdfIcon"
                                  />
                                </Link>
                              </> : <>
                                <Image
                                  src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}
                                  alt=""
                                  width={200}
                                  height={200}
                                  style={{ objectFit: 'cover', height: '100%', maxHeight: '400px' }}
                                />
                              </>
                            }
                            {/* <Image
                              src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}
                              alt=""
                              width={200}
                              height={200}
                              style={{ objectFit: 'cover', height: '100%', maxHeight: '400px' }}
                            /> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            }


          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramView;
