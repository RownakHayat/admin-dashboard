"use client"
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useGetSingleEventDetailsQuery } from "@/store/features/eventManagement/newEvent";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const SingleEventViewComponent = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const paramss = useParams();
  const id = paramss?.id ? Number(paramss.id) : null;


  const { data: singleEventViewData } = useGetSingleEventDetailsQuery({ id: id });

  return (
    <div className="bg-white p-[100px] rounded-lg h-[83vh]">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-6">
          <div className="text-end">
            <h5 className="text-lg text-nowrap font-bold ">{singleEventViewData?.data?.event_name}</h5>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex justify-end">
            <Link href={`/admin/event-management/new-event/${id}/edit`} >
              <Icons.edit onClick={() => editData(singleEventViewData)} />
            </Link>
          </div>
        </div>
      </div>
      
      <Separator className="h-1 mt-3" />

      <div className="grid grid-cols-12 gap-3 mt-4">
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Venue :</p>
            <p className="ml-2">{singleEventViewData?.data?.venue}</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Start Date :</p>
            <p className="ml-2">
              {moment(singleEventViewData?.data?.start_date).format('DD MMM YYYY')}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>End Date :</p>
            <p className="ml-2">
              {moment(singleEventViewData?.data?.end_date).format('DD MMM YYYY')}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Application Deadline :</p>
            <p className="ml-2">
              {moment(singleEventViewData?.data?.dead_line).format('D-MM-YYYY')}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Fee :</p>
            <p className="ml-2">
              {singleEventViewData?.data?.event_entry_fee}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Event Activity :</p>
            <p className="ml-2">
              {singleEventViewData?.data?.activity?.name}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Business Sector :</p>
            <p className="ml-2">
              {singleEventViewData?.data?.industrial_sec_for_events?.map((item: any, index: number) => {
                const businessSectorName = item?.business_sector?.name
                return (
                  <div className="grid grid-cols-2 space-y-2">
                    <div key={index} className="col-span-1border border-spacing-1  rounded-lg p-1">{businessSectorName}</div>
                  </div>
                )
              })}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Program Info Name :</p>
            <p className="ml-2">
              {singleEventViewData?.data?.program_info?.name_en}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Attachment Name :</p>
            <p className="ml-2">
              {singleEventViewData?.data?.event_attachments?.map((item: any) => item?.attachment_name)}
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Attachment :</p>
            <p className="ml-2">
              <Image
                src={
                  singleEventViewData?.data?.event_attachments?.length > 0 && singleEventViewData.data.event_attachments[0].attach_file_path
                    ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${singleEventViewData.data.event_attachments[0].attach_file_path}`
                    : "/assets/Image/defaultImage.png" // fallback image in case no attachment exists
                }
                alt="Event Attachment"
                width={120}
                height={120}
              />

            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-wrap">
            <p>Remarks :</p>
            <p className="ml-2 text-justify my-3 overflow-auto h-[200px]">
              <br />
              {singleEventViewData?.data?.remarks}
            </p>
          </div>
        </div>
      </div>
     
      {/* <pre>{JSON.stringify(singleEventViewData, null, 2)}</pre> */}
    </div>
  )
}

export default SingleEventViewComponent