"use client";
import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { useChangeUsersStatusMutation, useGetUsersPaginationQuery } from '@/store/features/UserManagement/Users';
import { createColumnHelper } from '@tanstack/react-table';
import {Eye, Shield, Star} from 'lucide-react';
import Link from "next/link";
import { useMemo, useState } from 'react';
import CreateAssignUserRoleForm from './form/AssignRoleUserForm';
import UserRatingModal from "@/components/Pages/userManagement/users/form/RattingUserForm";

const columnHelper = createColumnHelper<any>();

interface UserType {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role?: { name: string };
    user_profile?: {
        sme_id: string;
        rating?: number;
    };
}


const UsersComponent = () => {
    const { params, filterSearchText } = useFormSetting();
    const paramsValue = { ...params, searchData: `${filterSearchText || ''}` };
    const [openUserViewDialog, setUserViewDialog] = useState(false);

    const { data: listQuery, refetch, isLoading } = useGetUsersPaginationQuery(paramsValue);
    const [ChangeStatus] = useChangeUsersStatusMutation();
    const [openuserStaffRollDialog, setuserStaffRollDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState<UserType | null>(null);
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const setUserStaffRole = (values: any) => setuserStaffRollDialog(false);
    const setUserView = (values: any) => setUserViewDialog(false);

    const handleOpenRatingModal = (user: UserType) => {
        setSelectedUser(user); // Make sure to set the user data
        setOpenRatingModal(true);
    };


    const handleSaveRating = ({ rating }: { rating: number }) => {
        setOpenRatingModal(false);
        setSelectedUser(null);
    };

    const columns: any = useMemo(() => [
        columnHelper.accessor((tableField) => tableField.id, {
            id: "id",
            header: "SL",
            cell: (props: any) => {
                const sl = IndexSerial(
                    params?.page,
                    params.limit,
                    props.row.index,
                    listQuery?.pagination?.total
                );
                return sl;
            },
        }),
        columnHelper.accessor((tableField) => tableField?.name, {
            id: "name",
            header: "Name",
        }),
        columnHelper.accessor((tableField) => tableField?.email, {
            id: "email",
            header: "Email",
        }),
        columnHelper.accessor((tableField) => tableField?.mobile, {
            id: "mobile",
            header: "Mobile",
        }),
        columnHelper.accessor((tableField) => tableField?.role?.name, {
            id: "role",
            header: "Role",
        }),
        columnHelper.accessor((tableField) => tableField?.user_profile?.sme_id, {
            id: "user_id",
            header: "User Id",
        }),
        // columnHelper.accessor((tableField) => tableField?.user_profile?.rating ?? "N/A", {
        //     id: "rating",
        //     header: "Rating",
        // }),
        columnHelper.accessor(
            (tableField) => tableField?.user_profile?.rating ?? "0",
            {
                id: "rating",
                header: "Rating",
                cell: ({ getValue }) => {
                    const rating = getValue();

                    // Render stars based on the rating value
                    return (
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`${
                                        star <= rating ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                    fill={star <= rating ? "yellow" : "none"}
                                    size={16} // Adjust size as needed
                                />
                            ))}
                        </div>
                    );
                },
            }
        ),


        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const user = row?.original as UserType;
                return (
                    <div className="flex justify-left space-x-3">
                        <CheckPermission subMod={'users'} permission={'users_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...user,
                                    id: user.id
                                }}
                                title="Change Status" // Native HTML Tooltip
                            />
                        </CheckPermission>

                        <CheckPermission subMod={'users'} permission={'users_role'}>
                            <span
                                className="cursor-pointer"
                                title="Set User Role" // Native HTML Tooltip
                                onClick={() => {
                                    setSelectedRow(user);
                                    setuserStaffRollDialog(true);
                                }}
                            >
                                <Shield className="text-[#0E9F6E]"/>
                            </span>
                        </CheckPermission>

                        <CheckPermission subMod={'users'} permission={'users_view'}>
                            <Link href={`/admin/user-management/users/user-view/${user.id}`} title="View User">
                                <Eye className="text-[#0E9F6E]"/>
                            </Link>
                        </CheckPermission>

                        <button
                            className="cursor-pointer text-blue-500"
                            onClick={() => handleOpenRatingModal(user)}
                            title="Rate User"
                        >
                            Rate
                        </button>

                    </div>
                );
            },
        }),
    ], [params, listQuery]);

    return (
        <>
            <div>
                <div className="w-full">
                    <Search name="type_name"/>
                    <CheckPermission subMod={'users'} permission={'users_list'}>
                        <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading}/>
                    </CheckPermission>
                </div>
            </div>
            <CreateAssignUserRoleForm
                open={openuserStaffRollDialog}
                onClose={() => setuserStaffRollDialog(false)}
                onSave={setUserStaffRole}
                initialValues={selectedRow}
            />

            <UserRatingModal
                open={openRatingModal}
                onClose={() => setOpenRatingModal(false)}
                onSave={(values) => handleSaveRating(values)}
                initialValues={{
                    id: selectedUser?.id,
                    name: selectedUser?.name,
                    rating: selectedUser?.user_profile?.rating,
                }}
                selectedUser={selectedUser}
            />

        </>
    );
};

export default UsersComponent;
