"use client";

import ProgressBar from "@/components/common/Skeleton/progressBar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useGetAllDocumentQuery } from "@/store/features/configuration/document";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Document {
  id: number;
  name: string;
  attachment?: string | File | null;
  isCheckedYes?: boolean;
  isCheckedNo?: boolean;
}

const ProfileInformation = () => {
  const { data: userInfo, refetch: refetchUserInfo } = useAuthUserQuery();
  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const monthlyTotalSales = userInfo?.data?.user_profile?.monthly_total_sales || 0;
  const monthlyTotalCost = userInfo?.data?.user_profile?.monthly_total_cost || 0;

  // Calculate the total
  const totalSalesCost = monthlyTotalSales + monthlyTotalCost;


  // fair Displayed Products

  let productsArray = [];

  try {
    productsArray = JSON.parse(userInfo?.data?.user_profile?.fair_displayed_products);
  } catch (error) {
  }

  // Business Documents
  const [documentStates, setDocumentStates] = useState<Document[]>([]);
  const { data: configDocumentData } = useGetAllDocumentQuery();
  const { data: user, refetch: refetchUser } = useAuthUserQuery();



  useEffect(() => {
    if (configDocumentData?.data) {
      const initialStates = configDocumentData.data.map((document: Document) => {
        const userDocument = user?.data?.document_user?.find(
          (doc: any) => doc.document_id === document.id
        );
        const attachmentUrl = userDocument?.attachment
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userDocument.attachment}`
          : null;

        return {
          ...document,
          isCheckedYes: !!userDocument?.attachment, // Select Yes if attachment is present
          isCheckedNo: !userDocument?.attachment, // Select No if attachment is null
          attachment: attachmentUrl,
        };
      });

      setDocumentStates(initialStates);
    }
  }, [configDocumentData?.data, user?.data?.document_user]);


  const handleCheckboxChange = (documentId: number, checkedYes: boolean) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) =>
        doc.id === documentId
          ? {
            ...doc,
            isCheckedYes: checkedYes,
            isCheckedNo: !checkedYes,
            attachment: !checkedYes ? null : doc.attachment,
          }
          : doc
      )
    );
  };

  const handleRemoveAttachment = (documentId: number) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) =>
        doc.id === documentId
          ? {
            ...doc,
            attachment: null, // Remove the attachment
          }
          : doc
      )
    );
  };

  const handleProfileEdit = (data: any) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) => {
        return doc.id.toString() === data.documentId
          ? {
            ...doc,
            attachment: data.base64String ? data.base64String : doc.attachment,
          }
          : doc;
      })
    );
  };


  //temp workers

  const temporaryMaleWorkers = userInfo?.data?.user_profile?.temporary_male_workers || 0;
  const temporaryFemaleWorkers = userInfo?.data?.user_profile?.temporary_female_workers || 0;
  const temporaryThirdGenderWorkers = userInfo?.data?.user_profile?.temporary_third_gender_workers || 0;
  const totalTemporaryWorkers = temporaryMaleWorkers + temporaryFemaleWorkers + temporaryThirdGenderWorkers;

  //permanent workers

  const permanentMaleWorkers = userInfo?.data?.user_profile?.permanent_male_workers || 0;
  const permanentFemaleWorkers = userInfo?.data?.user_profile?.permanent_female_workers || 0;
  const permanentThirdGenderWorkers = userInfo?.data?.user_profile?.permanent_third_gender_workers || 0;
  const totalPermanentWorkers = permanentMaleWorkers + permanentFemaleWorkers + permanentThirdGenderWorkers;



  const getImageUrl = (baseUrl: string, attachment: string): string => {
    const formattedBaseUrl = baseUrl?.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const formattedAttachment = attachment?.startsWith("/")
      ? attachment.slice(1)
      : attachment;

    return `${formattedBaseUrl}${formattedAttachment}`;
  };


  const essentialRawMaterials =
    userInfo?.data?.user_profile?.raw_material_source === "1"
      ? "Native"
      : userInfo?.data?.user_profile?.raw_material_source === "2"
        ? "Imported"
        : "Both";


  const downloadFile = async (id: number, attachment_name: string, type: string) => {
    try {

      // Fetch the document blob
      const response = await fetch(`${siteConfig?.envConfig[
        `${process.env.APP_ENV}`
      ]?.IMAGE_URL}/api/auth/archive-document-attachment-download/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to download document ${id}`);
      }
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const filename = `${attachment_name}.${type}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
    }
  };

  const handleDownload = (id: any, attachment_name: any, type: string) => {
    downloadFile(id, attachment_name, type)
  };

  return (
    <div>
      <Card>
        <CardHeader className="">
          <h2 className=" text-[#6B6B88] text-[20px] ">
            Profile Information
          </h2>
        </CardHeader>
        <div className="border border-spacing-1"></div>
        <CardContent>
          <div className="my-8">
            <div className="flex justify-between">
              <div className="flex gap-6 basis-[600px]">
                {/* <div className="">
                                    <Avatar className="cursor-pointer w-[150px] h-[150px] rounded-md">
                                        <AvatarImage src={employeeInfo?.data?.profile_image_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${employeeInfo?.data?.profile_image_path}` : "https://github.com/shadcn.png"} />
                                    </Avatar>
                                </div> */}
                <div className="flex gap-4 items-center ">
                  {userInfo?.data?.user_profile?.profile_image_path ? (
                    <Image
                      src={
                        userInfo?.data?.user_profile?.profile_image_path
                          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                          }${userInfo?.data?.user_profile?.profile_image_path}`
                          : ""
                      }
                      alt="Reload"
                      width={300}
                      height={300}
                    />
                  ) : (

                    <Image
                      src="/assets/Image/User_icon.png"
                      alt="Profile Image"
                      width={300}
                      height={300}
                    />
                  )}
                </div>
                <div className="flex items-center basis-[300px]">
                  <div className="w-full">
                    <h1 className="text-3xl text-[#5D586C] font-semibold">
                      {userInfo?.data?.name}
                    </h1>
                    <h5 className="text-[#6B6B88] font-normal py-2">
                      {userInfo?.data?.role?.name}
                    </h5>
                    <ProgressBar value={userInfo?.data?.profile_percentage} />
                  </div>
                </div>
              </div>
              <div className="mr-6">
                {userInfo?.data?.user_role_id === 3 && (
                  <Link href="/admin/user-dashboard/user-profile/user-profile-update">
                    <Button className="ml-5 text-[#6B6B88] bg-[#f9f9f9]  flex items-center gap-2 hover:bg-[#f9f9f9]">
                      <Icons.edit className="text-white" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-10">
              <div className="text-[#6B6B88]">

                {/* ====Personal information start===== */}
                <div className="flex items-center gap-6 mb-6">
                  <h5 className="text-lg text-nowrap font-bold">Personal Information</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Name (English)</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.name}</p>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Name (Bangla)</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.name_bn}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Father's Name</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.father_name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Mother's Name</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.mother_name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Gender</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.gender?.name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Spouse Name</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.spouse_name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Mobile</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.mobile}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Telephone</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.telephone}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">NID</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.nid}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Date Of Birth</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="">{userInfo?.data?.user_profile?.date_of_birth ? moment(userInfo?.data?.user_profile?.date_of_birth).format('D-MM-YYYY') : ""}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Occupation</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.occupation_type?.name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Educational Qualification</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.educational_qualification_id}</p>
                  </div>
                  {/* issue no :14869 */}
                  {/* <div className="col-span-12 md:col-span-3">
                    <div className="flex justify-between">
                      <p>Email</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <p className="">{userInfo?.data?.email}</p>
                  </div> */}




                </div>
                {/* ====Personal information end===== */}

                {/* ===== Address Start ==== */}
                <div className="flex items-center gap-6 mb-5 mt-7">
                  <h5 className="text-lg font-bold">Address</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6  md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Office Address</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6  md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.office_address}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Cluster</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.cluster?.name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Factory Address</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 ">
                    <p className="text-wrap break-words">{userInfo?.data?.user_profile?.factory_address}</p>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Organization Type</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.organization_type?.name}</p>
                  </div>

                  {/* <div className="col-span-12 md:col-span-12 lg:col-span-3">
                    <div className="flex justify-between">
                      <p>Business Type</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12 lg:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.service_type?.name}</p>
                  </div> */}
                  {/* <div className="col-span-12 md:col-span-12 lg:col-span-3">
                    <div className="flex justify-between">
                      <p>Manufactured Goods</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12 lg:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_manufactured_goods?.length > 0 ? (
                      <ul className="flex">
                        {userInfo?.data?.user_manufactured_goods?.map((good: any, index: number) => (
                          <li className="inline-flex items-center border-2 border-[#2b7d74] text-xs px-2 py-1 m-1 rounded-full uppercase font-bold"
                            key={index}>{good.manufactured_goods}</li>
                        ))}
                      </ul>
                    ) : (
                      <span> No manufactured goods listed</span>
                    )}</p>
                  </div> */}
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Division</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.division?.name}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Website</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap break-words">{userInfo?.data?.user_profile?.website}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">District</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.district?.name}</p>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Upazila</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.upazila?.name}</p>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Permanent Address</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap break-words">{userInfo?.data?.user_profile?.permanent_address}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="flex justify-between">
                      <p className="font-bold">Present Address</p>
                      <p>:</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="text-wrap">{userInfo?.data?.user_profile?.present_address}</p>
                  </div>


                </div>
                {/* ===== Address end ==== */}

                {/* ===== Additional Information start ==== */}
                <div className="flex items-center gap-6 mt-7">
                  <h5 className="text-lg text-nowrap font-bold">Additional Information</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 basis-[100px] text-start font-bold">Year Of Establishment</div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start text-wrap">
                    <p>{userInfo?.data?.user_profile?.year_of_establishment ? moment(userInfo?.data?.user_profile?.year_of_establishment).format('D-MM-YYYY') : ""}</p>
                  </div>
                </div>
                {/* <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 basis-[100px] text-start">Amount Of Total Assets</div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.amount_of_total_assets === 0 ? <></> : <>{userInfo?.data?.user_profile?.amount_of_total_assets}</>}</p>
                  </div>
                </div> */}
                {/* <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 basis-[100px] text-start">
                    Amount Of Goods If Exported (In BDT)
                  </div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.amount_of_goods}</p>
                  </div>
                </div> */}
                {/* <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 basis-[100px] text-start">
                    Name of Chamber (If You Are A Member)
                  </div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.name_of_chamber}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 basis-[100px] text-start">
                    Fixed Assets (Taka)
                  </div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.fixed_assets}</p>
                  </div>
                </div> */}
                {/* <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 basis-[100px] text-start">
                    Current Assets
                  </div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.current_assets === 0 ? <></> : <>{userInfo?.data?.user_profile?.current_assets}</>}</p>
                  </div>
                </div> */}
                {/* ===== Additional Information end ==== */}

                {/* ===== Monthly Income-Expenditure Information start ==== */}
                <div className="flex items-center gap-6 mt-4">
                  <h5 className="text-lg text-wrap font-bold">Monthly Income-Expenditure Information</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>


                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 basis-[100px] text-start font-bold">Total Cost</div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.monthly_total_cost === 0 ? <></> : <>{userInfo?.data?.user_profile?.monthly_total_cost}</>}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 basis-[100px] text-start font-bold">Total Sales</div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.monthly_total_sales === 0 ? <></> : <>{userInfo?.data?.user_profile?.monthly_total_sales}</>}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 basis-[100px] text-start font-bold">Net Profit</div>
                  <div className="flex-1/5 basis-[100px] text-center">:</div>
                  <div className="flex-[4] basis-[100px] text-start">
                    <p>{userInfo?.data?.user_profile?.monthly_total_sales - userInfo?.data?.user_profile?.monthly_total_cost === 0 ? <></> : <>{userInfo?.data?.user_profile?.monthly_total_sales - userInfo?.data?.user_profile?.monthly_total_cost}</>}</p>
                  </div>
                </div>
                {/* ===== Monthly Income-Expenditure Information End ==== */}

                <div className="border border-spacing-2 rounded-lg p-4 my-5">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <h5 className=" text-wrap text-[18px] font-bold mb-4">No. of Permanent Labours/ Workers</h5>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Male</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_male_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_male_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Female</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_female_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_female_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Third Gender</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_third_gender_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_third_gender_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Total</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {[
                            userInfo?.data?.user_profile?.permanent_male_workers,
                            userInfo?.data?.user_profile?.permanent_female_workers,
                            userInfo?.data?.user_profile?.permanent_third_gender_workers,
                          ].reduce((acc, curr) => acc + (parseInt(curr, 10) || 0), 0) === 0 ? <></> : <>{[
                            userInfo?.data?.user_profile?.permanent_male_workers,
                            userInfo?.data?.user_profile?.permanent_female_workers,
                            userInfo?.data?.user_profile?.permanent_third_gender_workers,
                          ].reduce((acc, curr) => acc + (parseInt(curr, 10) || 0), 0)}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <h5 className="text-wrap text-[18px] font-bold mb-4">No. of Temporary Labours/ Workers</h5>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Male</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_male_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_male_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Female</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_female_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_female_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Third Gender</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_third_gender_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_third_gender_workers}</>}
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Total</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {[
                            userInfo?.data?.user_profile?.temporary_male_workers,
                            userInfo?.data?.user_profile?.temporary_female_workers,
                            userInfo?.data?.user_profile?.temporary_third_gender_workers,
                          ].reduce((acc, curr) => acc + (parseInt(curr, 10) || 0), 0) === 0 ? <></> : <>{[
                            userInfo?.data?.user_profile?.temporary_male_workers,
                            userInfo?.data?.user_profile?.temporary_female_workers,
                            userInfo?.data?.user_profile?.temporary_third_gender_workers,
                          ].reduce((acc, curr) => acc + (parseInt(curr, 10) || 0), 0)}</>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-6 mt-4 mb-6">
                    <h5 className="text-lg text-wrap font-bold">Business Information Of Entrepreneur</h5>
                    <div className="w-full">
                      <Separator className="h-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Type of Ownership</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">
                        {userInfo?.data?.user_profile?.ownership_type === 1 ? (
                          <>Other Ownership</>
                        ) : userInfo?.data?.user_profile?.ownership_type === 2 ? (
                          <>Join Ownership</>
                        ) : (
                          <>Single Ownership</>
                        )}

                      </p>
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Business Type</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.service_type?.name}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Manufactured Goods</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">
                        {userInfo?.data?.user_manufactured_goods?.map((item: any) => {
                          return (
                            <>
                              <p className="inline-flex items-center border-2 border-[#2b7d74] text-xs px-2 py-1 my-1 rounded-full font-bold">{item?.manufactured_goods}</p>
                            </>
                          )
                        })}
                      </p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Ownership of Space</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">
                        {userInfo?.data?.user_profile?.ownership_place === "3" ? (
                          <>Rental</>
                        ) : userInfo?.data?.user_profile?.ownership_place === "2" ? (
                          <>Position</>
                        ) : (
                          <>Self</>
                        )}
                        {/* {userInfo?.data?.user_profile?.ownership_place} */}
                      </p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Organization Name (English)</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.organization_name}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Organization Name (Bangla)</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.organization_name_bn}</p>
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Trade License No</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="text-wrap"> {userInfo?.data?.user_profile?.trade_license_no}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Trade License Issue Date</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="text-wrap">{userInfo?.data?.user_profile?.issue_date ? moment(userInfo?.data?.user_profile?.issue_date).format('D-MM-YYYY') : ""}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Affiliated With Associations/ Tradebodies?</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.trade_association_status === 1 ? <>Yes</> : <>No</>}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Name Of Association/Tradebody</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.trade_association_name}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Name Of Association/Tradebody (Bangla)</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="">{userInfo?.data?.user_profile?.trade_association_name_bn}</p>
                    </div>




                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Fair Displayed Products</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      {productsArray?.map((product: any, index: number) => (
                        <p key={index} className="inline-flex items-center border-2 border-[#2b7d74] text-xs px-2 py-1 m-1 rounded-full uppercase font-bold">{product}</p>
                      ))}
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Source Of Essential Raw Materials</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div>
                        {userInfo?.data?.user_profile?.raw_material_source === "1" ? (
                          <p>Native</p>
                        ) : userInfo?.data?.user_profile?.raw_material_source === "2" ? (
                          <p>Imported</p>
                        ) : (
                          <p>Both</p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Have You Ever Received An Award As An Entrepreneur?</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="w-full text-wrap">{userInfo?.data?.user_profile?.previous_award_status === 1 ? <>{userInfo?.data?.user_profile?.previous_award_name}</> : <>No</>}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">SME Category</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="w-full text-wrap">{user?.data?.user_profile?.sme_category?.name}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Interested Division Fair</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="w-full text-wrap">{user?.data?.user_profile?.interested_division_fair?.name}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Industrial Sector</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <p className="text-wrap">{userInfo?.data?.user_profile?.business_sector?.name}</p>
                    </div>
                  </div>
                </div>



                <div className="flex items-center gap-6 mt-4 mb-6">
                  <h5 className="text-lg text-nowrap font-bold">Business Documents</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div className="border border-spacing-2 rounded-lg p-4 ">
                  <p className="mb-4 text-[19px]">Statement of all legal and supporting documents in favor of running the business</p>
                  <div className="grid grid-cols-12 gap-4">
                    {userInfo?.data?.document_user?.map((downloadFile: any, index: any) => {

                      const fileExtension = downloadFile?.attachment?.split('.').pop()?.toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension || '');
                      const isPdf = fileExtension === 'pdf';
                      const isDoc = fileExtension === 'docx';

                      return (
                        <div className="col-span-6">
                          <div key={index} className="bg-white rounded-lg border border-spacing-2 p-3" >
                            {/* {downloadFile?.id}         */}
                            <p className="mb-2">{downloadFile?.document?.name}</p>
                            {isImage && (
                              < Image
                                src={
                                  downloadFile.attachment
                                    ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${downloadFile.attachment}`
                                    : ""
                                }
                                alt="Image"
                                height={100}
                                width={100} />
                            )}
                            {isPdf && (
                              <a href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${downloadFile.attachment}`} target="_blank">
                                <Image
                                  priority={true}
                                  src="/assets/Image/pdf.png"
                                  alt="pdf"
                                  width={100}
                                  height={100}
                                />
                              </a>
                            )}
                            {isDoc && (
                              // <FileText  />
                              <Image
                                priority={true}
                                src="/assets/Image/word.png"
                                alt="word"
                                width={100}
                                height={100}
                              />
                            )}

                          </div>
                        </div>
                      );


                      // return (
                      //   <div className="col-span-6">
                      //     <div key={downloadFile?.id} className="bg-white rounded-lg border border-spacing-2 p-3 h-48">
                      //       <div className="">
                      //         <div className="flex justify-between">
                      //           <p>{downloadFile?.document?.name}</p>
                      //           <div>
                      //             {downloadFile.attachment}
                      //             <Image
                      //               src={
                      //                 downloadFile.attachment
                      //                   ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${downloadFile.attachment}`
                      //                   : ""
                      //               }
                      //               alt=""
                      //               width={120}
                      //               height={120}
                      //             />
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </div>
                      //   </div>
                      // )
                    })}
                  </div>
                </div>

                <div className="my-5 border border-spacing-2 rounded-lg p-4">
                  <h2>Income-Expenditure Information (BDT)</h2>
                  {userInfo?.data?.user_profit_loss?.map((item: any) => {
                    return (
                      <div key={item?.id}>
                        <div className="grid grid-cols-12 gap-3 mt-8">
                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Financial Year</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">{item?.financial_year?.name}</div>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6"></div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Annual Gross Sales</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">
                                <p>{item?.yearly_total_sales}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Total Annual Expenditure</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">
                                <p>{item?.yearly_total_cost}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Annual Net Profit</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">
                                <p> {item?.yearly_net_profit}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Annually Paid VAT</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">
                                <p>{item?.vat_paid}</p>
                              </div>

                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 md:col-span-6">
                                <div className="flex justify-between">
                                  <p className="font-bold">Annual Income Tax Paid</p>
                                  <p>:</p>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-6">
                                <p>{item?.income_tax_paid}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>


                <div>
                  <div className="grid grid-cols-12 gap-3 mt-8">
                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-bold">Fixed Assets (BDT)</p>
                              <p className="text-[12px] font-bold">(Land, Brokers, Machinery, Furniture, Transport)</p>
                            </div>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.fixed_assets_with_infrastructure === 0 ? <></> : <>{userInfo?.data?.user_profile?.fixed_assets_with_infrastructure}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-bold">Current Assets</p>
                              <p className="text-[12px] font-bold">(Raw materials, Stocks, Goods in process of production)</p>
                            </div>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.current_assets === 0 ? <></> : <>{userInfo?.data?.user_profile?.current_assets}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-bold">Total Investment</p>
                              <p className="text-[12px] font-bold">(From the start till now)</p>
                            </div>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.total_investment === 0 ? <></> : <>{userInfo?.data?.user_profile?.total_investment}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-bold">Fixed Assets</p>
                              <p className="text-[12px] font-bold">(Except land and factory buildings)</p>
                            </div>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.fixed_assets_without_infrastructure === 0 ? <></> : <>{userInfo?.data?.user_profile?.fixed_assets_without_infrastructure}</>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-spacing-2 rounded-lg p-3 mt-8">
                  <h2>Statement of investments and other assets of business applicant/partners</h2>

                  <div className="grid grid-cols-12 gap-3 mt-8">
                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Land Value</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.land_price === 0 ? <></> : <>{userInfo?.data?.user_profile?.land_price}</>}
                          {/* {userInfo?.data?.user_profile?.land_price} */}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Stock Products</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.stock_product_price === 0 ? <></> : <>{userInfo?.data?.user_profile?.stock_product_price}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Value of The building</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.building_price === 0 ? <></> : <>{userInfo?.data?.user_profile?.building_price}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Current Capital</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.current_capital === 0 ? <></> : <>{userInfo?.data?.user_profile?.current_capital}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Factories and Machineries</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.factory_mechineries_price === 0 ? <></> : <>{userInfo?.data?.user_profile?.factory_mechineries_price}</>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-spacing-2 rounded-lg p-3 mt-8">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6 md:col-span-6">
                      <h2>Number of Permanent Labours / Workers</h2>
                      <div className="grid grid-cols-12 gap-3 mt-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Male</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_male_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_male_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <h2>Number of Temporary Labours / Workers</h2>
                      <div className="grid grid-cols-12 gap-3 mt-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Male</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_male_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_male_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Female</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_female_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_female_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Female</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_female_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_female_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Others</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.permanent_third_gender_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.permanent_third_gender_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Others</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {userInfo?.data?.user_profile?.temporary_third_gender_workers === 0 ? <></> : <>{userInfo?.data?.user_profile?.temporary_third_gender_workers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Total</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {totalPermanentWorkers === 0 ? <></> : <>{totalPermanentWorkers}</>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-6">
                          <div className="flex justify-between">
                            <p className="font-bold">Total</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-6">
                          {totalTemporaryWorkers === 0 ? <></> : <>{totalTemporaryWorkers}</>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border border-spacing-2 p-4 rounded-lg">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3 ">
                        <div className="col-span-6 md:col-span-9">
                          <div className="flex justify-between">
                            <p className="font-bold">Have Taken Any Loan For Business Purpose?</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          {userInfo?.data?.user_profile?.loan_status === 1 ? <>Yes</> : <>No</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3  ">
                        <div className="col-span-6 md:col-span-9">
                          <div className="flex justify-between">
                            <p className="font-bold">Monthly Installment Amount</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          {userInfo?.data?.user_profile?.monthly_installment === 0 ? <></> : <>{userInfo?.data?.user_profile?.monthly_installment}</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3 ">
                        <div className="col-span-6 md:col-span-9">
                          <div className="flex justify-between">
                            <p className="font-bold">Name of Bank / Branch</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          {userInfo?.data?.user_profile?.loan_bank_name}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3 ">
                        <div className="col-span-6 md:col-span-9">
                          <div className="flex justify-between">
                            <p className="font-bold">Have You Ever Defaulted On a Loan?</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          {userInfo?.data?.user_profile?.defaulter_status === 1 ? <>Yes</> : <>No</>}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6 md:col-span-9">
                          <div className="flex justify-between">
                            <p className="font-bold">Amount of Loan</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          {userInfo?.data?.user_profile?.loan_amount === 0 ? <></> : <>{userInfo?.data?.user_profile?.loan_amount}</>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 mb-6">
                  <h5 className="text-lg text-wrap font-bold">Other Business Information of Entrepreneur</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div>
                  <h2>Who Are The Main Customers of The Product Or Service?</h2>
                  <p className="mt-3">{userInfo?.data?.user_profile?.product_consumers}</p>
                </div>

                <div className="mt-8 border border-spacing-2 rounded-lg p-4 ">
                  <p><span className="font-bold"> </span><span className="font-bold">Goods Exported Abroad</span></p>



                  <div className="grid grid-cols-12 gap-3">
                    {userInfo?.data?.user_exported_products?.map((item: any) => {
                      return (
                        <div key={item?.id} className="col-span-12 md:col-span-4">
                          <h2 className="mt-3">{item?.year}</h2>
                          <div className="grid grid-cols-12 gap-3 mt-3">
                            <div className="col-span-12 md:col-span-6">
                              <div className="flex justify-between">
                                <p className="font-bold">Price</p>
                                <p>:</p>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                              {item?.export_amount}
                            </div>
                            <div className="col-span-12 md:col-span-6">
                              <div className="flex justify-between">
                                <p className="font-bold">Attached File</p>
                                <p>:</p>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                              {/* {item?.attachment} */}

                              <Image
                                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attachment}`}
                                width={60}
                                height={60}
                                alt=""
                              />


                              {/* {headerData?.site_info?.govt_logo ? (
                                <Image
                                  src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerData?.site_info?.govt_logo}`}
                                  width={60}
                                  height={60}
                                  alt=""
                                />
                              ) : (
                                <Image
                                  src={`/assets/Image/gov_logo.png`}
                                  width={60}
                                  height={60}
                                  alt=""
                                />
                              )} */}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-7">
                  <h2>Is The Product/Service Directly or Indirectly Harmful to The Environment? :
                    <span className="text-green-600">{userInfo?.data?.user_profile?.business_harmful_status === 1 ? <> Yes</> : <> No</>}</span>
                  </h2>

                  <div className="grid grid-cols-12 gap-3 mt-3">
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Argument In Favor</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-9">
                      <p>{userInfo?.data?.user_profile?.business_harmful_description}</p>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex justify-between">
                        <p className="font-bold">Attached File</p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-9">
                      <p>
                        {/* {userInfo?.data?.user_profile?.business_harmful_document_path} */}
                        {/* <Image
                          src={
                            userInfo?.data?.user_profile?.business_harmful_document_path
                              ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userInfo?.data?.user_profile?.business_harmful_document_path}`
                              : ""
                          }
                          alt=""
                          width={120}
                          height={120}
                        /> */}
                        {/* {userInfo?.data?.user_profile?.business_harmful_document_path ? (
                          <>
                            <a
                              href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userInfo?.data?.user_profile?.business_harmful_document_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Image
                                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userInfo?.data?.user_profile?.business_harmful_document_path}`}
                                alt=""
                                width={120}
                                height={120}
                              />
                            </a>
                          </>
                        ) : (
                          (() => {
                            const filePath = userInfo?.data?.user_profile?.business_harmful_document_path;
                            const fileExtension = filePath ? filePath.split('.').pop().toLowerCase() : '';
                            if (fileExtension === 'pdf') {
                              return (
                                <Image
                                  src="/assets/Image/pdf.png"
                                  alt=""
                                  width={60}
                                  height={60}
                                  className="object-contain"
                                />
                              );
                            } else if (fileExtension === 'doc' || fileExtension === 'docx') {
                              return (
                                <Image
                                  src="/assets/Image/word.png"
                                  alt=""
                                  width={120}
                                  height={120}
                                />
                              );
                            } else {
                              return (
                                <Image
                                  src="/assets/Image/noImageUploaded.png"
                                  alt=""
                                  width={120}
                                  height={120}
                                />
                              );
                            }
                          })()
                        )} */}

                        {userInfo?.data?.user_profile?.business_harmful_document_path ? (
                          (() => {
                            const filePath = userInfo?.data?.user_profile?.business_harmful_document_path;
                            const fileExtension = filePath ? filePath.split('.').pop().toLowerCase() : '';

                            // Determine the appropriate image source based on the file extension
                            const imageSrc =
                              fileExtension === 'pdf'
                                ? '/assets/Image/pdf.png'
                                : fileExtension === 'doc' || fileExtension === 'docx'
                                  ? '/assets/Image/word.png'
                                  : `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${filePath}`;

                            return (
                              <a
                                href={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                              >
                                <Image
                                  src={imageSrc}
                                  alt="Business Harmful Document"
                                  width={120}
                                  height={120}
                                />
                              </a>
                            );
                          })()
                        ) : (
                          <Image
                            src="/assets/Image/noImageUploaded.png"
                            alt="No Image Found"
                            width={120}
                            height={120}
                          />
                        )}

                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border border-spacing-2 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Mention The Policies Of The Organization</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.organization_policy}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Mention What Initiatives Have Been Taken To Improve The Skills Of Workers And Protect Their Rights</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.taken_initiatives}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Mention What Are The Security And Other Facilities Of The Institution?</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.organization_facilities}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Describe The Organization's Accounting System</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.account_management_system}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Why Consider Yourself As A Successful Entrepreneur?</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.why_successful_sme}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Describe The Product/Service Marketing Strategy</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.marketing_srategy}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>What Kind Of Obstacles Have You Faced In Developing Yourself As An Entrepreneur In The Prevailing Socio-Economic Context And How Did You Overcome Them?</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.faced_obstacles}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Describe The Product/Service Production Or Innovation Technology</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.innovation_technology}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>How Are You Contributing To The Development Of Small And Medium Industries And Poverty Alleviation?</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.your_contribution}</p>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="bg-[#f9f9f9] p-2 rounded-lg border border-spacing-2">
                        <h2>Describe The Production/Service Center Environment</h2>
                        <p className="bg-white p-1 rounded-lg border border-spacing-2">{userInfo?.data?.user_profile?.service_center_environment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 mb-6">
                  <h5 className="text-lg text-nowrap font-bold">Attachment</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">

                  {userInfo?.data?.attachments?.map((item: any) => {
                    return (
                      <>
                        <div className="col-span-12 md:col-span-2">
                          <div className="flex justify-between">
                            <p className="font-bold">File Name</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-10">
                          {item?.attachment_name}
                        </div>
                        <div className="col-span-12 md:col-span-2">
                          <div className="flex justify-between">
                            <p className="font-bold">Attached File</p>
                            <p>:</p>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-10">
                          <Image
                            src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item?.attachment}`}
                            width={60}
                            height={60}
                            alt=""
                          />
                        </div>
                      </>
                    )
                  })}
                </div>

                <div className="flex items-center gap-6 mb-5">
                  <h5 className="text-lg font-bold">Signature</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>
                <div>
                  {userInfo?.data?.user_profile?.signature_image_path && (
                    <Image
                      src={
                        userInfo?.data?.user_profile?.signature_image_path
                          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                          }${userInfo?.data?.user_profile?.signature_image_path
                          }`
                          : ""
                      }
                      alt="Signature"
                      width={300}
                      height={80}
                    />
                  )}
                </div>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInformation;
