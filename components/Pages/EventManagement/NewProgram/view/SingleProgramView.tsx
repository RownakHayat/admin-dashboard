import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { useShowSpecificsProgramQuery } from "@/store/features/eventManagement/newProgram";
import { Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface ParticipateValueProps {
  open: boolean;
  onClose: () => void;
  // onSave: (values: z.infer<typeof eventSchema>) => void;
  singleParticipateValues?: any;
}
const SingleProgramView: React.FC<ParticipateValueProps> = ({
  open,
  onClose,
  // onSave,
  singleParticipateValues
}) => {

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Event Program Details",
    onAfterPrint: () => console.log("Print Success"),
  })


  const id = singleParticipateValues?.id as string;

  const { data: eventProgram, refetch: refetchUser } = useShowSpecificsProgramQuery(id, {
    skip: id == null || id == undefined,
  });


  return (
    <div className="cursor-pointer p-2 bg-[#f1f0fb] rounded-lg text-center mr-3">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[90%] md:max-w-[70%] w-full md:w-[70%] h-[90%] md:h-[70%] p-0 bg-[#e9e9ea]">
          <div className="absolute right-0 top-0 w-full rounded-t-lg p-2">
            <p onClick={() => handleClickToPrint()} className="text-right mr-9 mt-1 flex justify-end">
              <span className="ml-2">
                <Printer />
              </span>
            </p>
          </div>

          <div className="overflow-y-auto p-4 md:p-6 mt-12 bg-white rounded-lg" ref={componentRef}>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <p className="text-[18px] font-bold text-right py-5 w-1/2">
                  {eventProgram?.data?.name_en} Details
                </p>
                <Link href={`/admin/event-management/new-event/${eventProgram?.data?.id}/create-event`}>
                  <Button className="font-bold border bg-[#0CB04D] rounded-lg p-5">
                    Create Event +
                  </Button>
                </Link>

              </div>
            </div>

            <div className="border border-t-1 mb-4"></div>

            {/* Budget Item Details */}
            <div className="grid grid-cols-12 gap-y-3 my-5">
              <div className="col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                <div className="font-bold">Name (English) : </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                <div>{eventProgram?.data?.name_en}</div>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                <div className="font-bold">Financial Year : </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                <div>{eventProgram?.data?.financial_year?.name}</div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                <div className="font-bold">Wing : </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                <div>{eventProgram?.data?.wing?.name}</div>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-2 text-sm">
                <div className="font-bold">Total Amount : </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-9 text-sm">
                <div>{eventProgram?.data?.total_amount}</div>
              </div>
              <div className="col-span-12 text-center pt-5 pb-5">
                <p className="text-[18px] font-bold">Budget Item Details</p>
              </div>

              <div className="col-span-12">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-[#D6DDFF]">
                        <th className="py-2 px-4 border text-center">Id</th>
                        <th className="py-2 px-4 border text-center"> Item Name</th>
                        <th className="py-2 px-4 border text-center">Item Unit</th>
                        <th className="py-2 px-4 border text-center">Unit Price</th>
                        <th className="py-2 px-4 border text-center">No of items</th>
                        <th className="py-2 px-4 border text-center">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventProgram?.data?.budget_item_details?.map((item: any, index: number) => (
                        <tr key={item.id} className="text-center">
                          <td className="py-2 px-4 border">{index + 1}</td>
                          <td className="py-2 px-4 border">{item?.budget_item?.name}</td>
                          <td className="py-2 px-4 border">{item?.budget_item?.unit}</td>
                          <td className="py-2 px-4 border">{item?.unit_cost}</td>
                          <td className="py-2 px-4 border">{item?.no_of_unit}</td>
                          <td className="py-2 px-4 border">{item?.total_cost}</td>
                        </tr>
                      ))}
                      <tr className="text-center">
                        <td className="py-2 px-4 border text-right" colSpan={5}>
                          Total Amount
                        </td>
                        <td className="py-2 px-4 border">{eventProgram?.data?.total_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Program Attachment */}
              <div className="col-span-12 text-center pt-5 pb-5">
                <p className="text-[18px] font-bold">Program Attachment</p>
              </div>

              <div className="col-span-12">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-[#D6DDFF]">
                        <th className="py-2 px-4 border text-center">Name</th>
                        <th className="py-2 px-4 border text-center">Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {eventProgram?.data?.program_details_attachments?.map((item: any) => (
                        <tr key={item.id} className="text-center">
                          <td className="py-2 px-4 border">{item?.attachment_name}</td>
                          <td className="py-2 px-4 border flex justify-center items-center">
                            {item?.attach_file_path.split('.').pop()?.toLowerCase() === 'pdf' ? (
                              <Link target="_blank" href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}>
                                <Image
                                  priority={true}
                                  src="/assets/Image/pdf.png"
                                  alt={`Attachment for ${item?.name}`}
                                  width={128}
                                  height={128}
                                  className="pdfIcon"
                                />
                              </Link>
                            ) : (
                              <Image
                                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attach_file_path}`}
                                alt=""
                                width={200}
                                height={200}
                                className="max-w-full object-cover"
                              />
                            )}
                          </td>
                        </tr>
                      ))} */}
                      {eventProgram?.data?.program_details_attachments?.map((item: any) => {
                        const filePath = item?.attach_file_path;
                        const fileExt = filePath.split('.').pop()?.toLowerCase();
                        const fileUrl = `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${filePath}`;

                        return (
                          <tr key={item.id} className="text-center">
                            <td className="py-2 px-4 border">{item?.attachment_name}</td>
                            <td className="py-2 px-4 border flex justify-center items-center">
                              {fileExt === 'pdf' ? (
                                <Link target="_blank" href={fileUrl}>
                                  <Image
                                    src="/assets/Image/pdf.png"
                                    alt="PDF Attachment"
                                    width={50}
                                    height={50}
                                    className="pdfIcon"
                                  />
                                </Link>
                              ) : fileExt === 'doc' || fileExt === 'docx' ? (
                                <Link target="_blank" href={fileUrl}>
                                  <Image
                                    src="/assets/Image/wordd.png"
                                    alt="DOC Attachment"
                                    width={50}
                                    height={50}
                                    className="docIcon"
                                  />
                                </Link>
                              ) : (
                                <Image
                                  src={fileUrl}
                                  alt="Attachment Preview"
                                  width={200}
                                  height={200}
                                  className="max-w-full object-cover"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default SingleProgramView;
