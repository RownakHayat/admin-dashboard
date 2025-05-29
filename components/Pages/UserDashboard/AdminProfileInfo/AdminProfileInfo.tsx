"use client";

import ProgressBar from "@/components/common/Skeleton/progressBar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import Image from "next/image";
import Link from "next/link";

const AdminProfileInfo = () => {
  const { data: userInfo, refetch: refetchUserInfo } = useAuthUserQuery();
  return (
    <div>
      <Card>
        <CardHeader className="">
          <h2 className=" text-[#6B6B88] font-normal text-[20px] ">
            {/* Profile Information */}
          </h2>
        </CardHeader>
        <div className="border border-spacing-1"></div>
        <CardContent>
          <div className="my-8">
            <div className="flex justify-between">
              <div className="flex  basis-[600px]">
                <div className="flex gap-8 items-center w-full">
                  {userInfo?.data?.user_profile?.profile_image_path ? (
                    <Image
                      src={
                        userInfo?.data?.user_profile?.profile_image_path
                          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                          }${userInfo?.data?.user_profile?.profile_image_path}`
                          : ""
                      }
                      alt="Profile Image"
                      width={300}
                      height={300}
                    />
                  ) : (

                    <Image
                      src="/assets/Image/imag-demo-user.png"
                      alt="Reload"
                      width={300}
                      height={300}
                    />
                  )}
                  <div className="flex items-center basis-[300px]">
                    <div className="w-full">
                      <h1 className="sm:text-md lg:text-2xl text-[#5D586C] font-semibold">
                        {userInfo?.data?.name}
                      </h1>
                      <h5 className="text-[#6B6B88] font-normal py-2">
                        {userInfo?.data?.role?.name}
                      </h5>
                      <ProgressBar value={userInfo?.data?.profile_percentage} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pr-6">
                <Link href="/admin/user-dashboard/profile/profile-update">
                  <Button className="ml-5 text-[#6B6B88] bg-white  flex items-center gap-2 hover:bg-white">
                    <Icons.edit />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-10">
              <div className="text-[#6B6B88]">
                <div className="flex items-center gap-6">
                  <h5 className="text-lg text-nowrap">General Information</h5>
                  <div className="w-full">
                    <Separator className="h-1" />
                  </div>
                </div>

                <div className="my-5">
                  {/*Will change the logic of wing when it ready from backend need to implement*/}
                  {userInfo?.data.user_role_id === 2 && (
                    <div className="flex">
                      <p className="mb-2 w-[100px]">Wing</p>
                      <p className="mr-5">:</p>
                      {userInfo?.data?.user_profile?.wings?.map((item: any, index: number) => {
                        const wingName = item?.wing?.name;
                        return (
                            <div key={index} className=' rounded-lg border border-spacing-1 p-1 m-1'>
                              {wingName}
                            </div>
                        );
                      })}
                      {/*<p>{userInfo?.data?.user_profile?.wind?.name ?? "Default Wing"}</p>*/}
                    </div>
                  )}

                  <div className="flex">
                    <p className="mb-2 w-[100px]">User ID</p>
                    <p className="mr-5">:</p>
                    <p>{userInfo?.data?.user_profile?.user_id}</p>
                  </div>
                  <div className="flex">
                    <p className="mb-2 w-[100px]">Email</p>
                    <p className="mr-5">:</p>
                    <p>{userInfo?.data?.email}</p>
                  </div>
                  <div className="flex">
                    <p className="mb-2 w-[100px]">Phone No</p>
                    <p className="mr-5">:</p>
                    <p>{userInfo?.data?.mobile}</p>
                  </div>
                  <div className="flex">
                    <p className="mb-2 w-[100px]">NID</p>
                    <p className="mr-5">:</p>
                    <p>{userInfo?.data?.user_profile?.nid}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-5">
                  <h5 className="text-lg">Signature</h5>
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
              </div >
            </div >
          </div >
        </CardContent >
      </Card >
    </div >
  );
};

export default AdminProfileInfo;
