"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    useViewUserProfileQuery
} from "@/store/features/UserManagement/User";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const SingleStaffViewComponent = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data: userInfo, refetch: refetchUserInfo } = useViewUserProfileQuery(id);
    const [value, setValue] = useState(0);
    const [success, setSuccess] = useState(false);
    return (
        <div>
            <Card>
                <CardHeader>
                    <h2 className="text-[#6B6B88] font-normal text-[20px] md:text-[24px]">
                        Profile Information
                    </h2>
                </CardHeader>
                <div className="border border-spacing-1"></div>
                <CardContent>
                    <div className="my-8">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex flex-col md:flex-row basis-full md:basis-[600px]">
                                <div className="flex gap-8 items-center w-full">
                                    <div className="flex items-center basis-full md:basis-[300px]">
                                        <div className="w-full">
                                            <h1 className="text-2xl md:text-3xl text-[#5D586C] font-semibold">
                                                {userInfo?.data?.name}
                                            </h1>
                                            <h5 className="text-[#6B6B88] font-normal py-2">
                                                {userInfo?.data?.role?.name}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <div className="text-[#6B6B88]">
                                <div className="flex items-center gap-6">
                                    <h5 className="text-lg whitespace-nowrap  font-bold">
                                        General Information
                                    </h5>
                                    <div className="w-full">
                                        <Separator className="h-1" />
                                    </div>
                                </div>

                                <div className="my-5">
                                    {/* Will change the logic of wing when it ready from backend need to implement */}
                                    {userInfo?.data.user_role_id === 3 && (
                                        <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
                                            <p className="mb-2 md:mb-0 w-[100px] font-bold">Wing</p>
                                            <p className="mr-5 ">:</p> {/* Only show colon on medium screens and above */}
                                            <p>{userInfo?.data?.user_profile?.wind?.name ?? "Default Wing"}</p>
                                        </div>
                                    )}


                                    <div className="flex ">
                                        <p className="mb-2 md:mb-0 w-[100px] font-bold">User ID</p>
                                        <p className="mr-5 ">:</p>
                                        <p>{userInfo?.data?.user_profile?.user_id}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="mb-2 md:mb-0 w-[100px] font-bold">Email</p>
                                        <p className="mr-5 ">:</p>
                                        <p className="break-words w-[160px] md:w-[100vh]">{userInfo?.data?.email}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="mb-2 md:mb-0 w-[100px] font-bold">Phone No</p>
                                        <p className="mr-5 ">:</p>
                                        <p>{userInfo?.data?.mobile}</p>
                                    </div>
                                    <div className="flex ">
                                        <p className="mb-2 md:mb-0 w-[100px] font-bold">NID</p>
                                        <p className="mr-5 ">:</p>
                                        <p>{userInfo?.data?.user_profile?.nid}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default SingleStaffViewComponent;
