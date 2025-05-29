import { siteConfig } from "@/config/site";
import moment from 'moment';
import Image from 'next/image';
import Link from "next/link";

const NotificationApplyEvent = ({ singleParticipateValues }: any) => {


  return (
    <>
      <div className="absolute right-0 top-0  w-[100%] rounded-t-lg p-2">
        <p className="text-right mr-9 mt-1 flex justify-end">
        </p>
      </div>
      <div className=" p-6 m-6 mt-12 bg-[#fff] rounded-lg">
        <div className="xs:col-span-12 sm:col-span-12 md:col-span-12 text-sm">
          <div>
            <p className="text-[18px] font-bold text-center pt-5 pb-5 text-wrap break-words">
              {singleParticipateValues?.data?.event_detail?.event_name} Details (Applied Event)
            </p>
          </div>
        </div>
        <div className="border border-t-1"></div>
        <div>
          <div className="grid grid-cols-12 gap-y-3 text-nowrap my-5">
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Event Name (English)</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.event_detail?.event_name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Division</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.event_detail?.division?.name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>District</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.event_detail?.district?.name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Upazila</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.event_detail?.upazila?.name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Venue</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.event_detail?.venue}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Application Deadline</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{moment(singleParticipateValues?.data?.event_detail?.dead_line).format('DD MMM YYYY')}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Start Date</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{moment(singleParticipateValues?.data?.event_detail?.start_date).format('DD MMM YYYY')}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>End Date</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{moment(singleParticipateValues?.data?.event_detail?.end_date).format('DD MMM YYYY')}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Remarks</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div className="text-wrap">{singleParticipateValues?.data?.event_detail?.remarks} </div>
            </div>

            <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
              <div>
                <p className="text-[18px] font-bold text-center pt-5 pb-5"> Event Attachment</p>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-12 md:col-span-12 text-sm">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-[#D6DDFF]">
                    <th className="py-2 px-4 border border-b text-center">Name</th>
                    <th className="py-2 px-4 border border-b text-center">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {singleParticipateValues?.data?.event_detail?.event_attachments?.map((item: any, index: number) => (
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


          </div>
        </div>
        <div className="xs:col-span-12 sm:col-span-12 md:col-span-12 text-sm">
          <div>
            <p className="text-[18px] font-bold text-center pt-5 pb-5">
              Applied User Info
            </p>
          </div>
        </div>
        <div className="border border-t-1"></div>
        <div>
          <div className="grid grid-cols-12 gap-y-3 my-5 text-wrap break-words">
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>User Name (English)</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.sender?.name}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Email</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.sender?.email}</div>
            </div>
            <div className="col-span-5 xl:col-span-3 2xl:col-span-2  text-sm">
              <div>Mobile</div>
            </div>
            <div className="col-span-2 2xl:col-span-1">
              <div>:</div>
            </div>
            <div className="col-span-5 xl:col-span-7 2xl:col-span-9 text-sm">
              <div>{singleParticipateValues?.data?.sender?.mobile}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationApplyEvent
