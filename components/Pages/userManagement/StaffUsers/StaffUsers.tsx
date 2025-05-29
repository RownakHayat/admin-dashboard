"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
    useChangeStaffUsersStatusMutation,
    useGetStaffUsersPaginationQuery,
    useStaffUsersDeleteMutation
} from "@/store/features/UserManagement/staffUsers";
import { createColumnHelper } from '@tanstack/react-table';
import { Eye, Shield } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import CreateAssignStaffRoleForm from './form/AssignRoleForm';

const columnHelper = createColumnHelper<any>()

const StaffUsersComponent = () => {
    const {
        params,
        editData,
        filterSearchText
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
    const { data: listQuery, refetch, isLoading, isError } = useGetStaffUsersPaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeStaffUsersStatusMutation()
    const [deleteStaffUsers] = useStaffUsersDeleteMutation()
    const [openuserStaffRollDialog, setuserStaffRollDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const handleDelete = async (id: number) => {
        try {
            await deleteStaffUsers(id).unwrap();
            refetch();
        } catch (error) {
        }
    };

    const setUserStaffRole = (values: any) => {
        setuserStaffRollDialog(false);
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
                )
                return sl
            },
        }),
        columnHelper.accessor((tableField) => tableField?.user_profile?.sme_office_id, {
            id: "id",
            header: "SME Office ID",
        }),
        columnHelper.accessor((tableField) => tableField?.name, {
            id: "name",
            header: "User Name",
        }),
        columnHelper.accessor((tableField) => tableField?.user_profile?.wing?.name, {
            id: "wing_id",
            header: "Wing",
            cell: ({ row }: any) => {
                const viewData = row?.original || {}
                return (
                    <>
                        {viewData?.user_profile?.wings?.map((item: any, index: number) => {
                            const wingName = item?.wing?.name;
                            return (
                                <div key={index} className=' rounded-lg border border-spacing-1 p-1 m-1'>
                                    {wingName}
                                </div>
                            );
                        })}
                    </>
                )
            }
        }),
        columnHelper.accessor((tableField) => tableField?.email, {
            id: "email",
            header: "Email",
        }),
        columnHelper.accessor((tableField) => tableField?.mobile, {
            id: "mobile",
            header: "Mobile",
        }),
        columnHelper.accessor((tableField) => tableField?.role.name, {
            id: "role_id",
            header: "Role",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'staff_users'} permission={'staff_users_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                                title="Change Status"
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'staff_users'} permission={'staff_users_edit'}>

                            <span className="cursor-pointer"  title="Edit">
                                <Link href={`/admin/user-management/staff-users/${viewData?.id}/edit`}>
                                    <Icons.edit
                                        onClick={() =>
                                            editData(viewData)
                                        }
                                    />
                                </Link>
                            </span>
                        </CheckPermission>

                        <CheckPermission subMod={'staff_users'} permission={'staff_users_role'}>
                            <span className="cursor-pointer" title="Assign Role">
                                <Shield className="text-[#0E9F6E]" onClick={() => {
                                    setSelectedRow(row?.original);
                                    setuserStaffRollDialog(true);
                                }} />
                            </span>
                        </CheckPermission>
                        <CheckPermission subMod={'staff_users'} permission={'staff_users_view'}>
                            <Link href={`/admin/user-management/staff-users/staff-users-view/${row?.original.id}`}
                                  title="view">
                                <Eye
                                    className="text-[#0E9F6E]"
                                    onClick={() => {
                                        setSelectedRow(row?.original);
                                    }}
                                />
                            </Link>
                        </CheckPermission>
                    </div>
                )
            },
        }),
    ], [params, listQuery]);

    let content: any = "";
    if (isLoading) {
        content = (
            <div className="flex justify-center items-center h-[calc(100vh-15vh)]">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }
    if (!isLoading && isError) {
        content = (
            <div className="h-[calc(100vh-15vh)]">
                Something Went Wrong
            </div>
        )
    }

    if (!isLoading && !isError) {
        content = (
            <>
                <div className='flex flex-wrap items-center  sm:justify-center md:justify-between'>
                    <h1 className='font-bold text-2xl sm:mb-4 sm:text-center md:mb-0'>SMEF Official</h1>
                    <div className='flex items-center flex-wrap sm:justify-center md:justify-end '>
                        <div className='mr-2'>
                            <Search />
                        </div>
                        <CheckPermission subMod={'staff_users'} permission={'staff_users_add'}>
                            <div>
                                <Link href="/admin/user-management/staff-users/staff-users-create">
                                    <Button className='md:ml-5 sm:ml-0  hover:border-primary bg-success hover:bg-success'>
                                        Create SMEF Official <Icons.plus className='ml-1' size={15} />
                                    </Button>
                                </Link>
                            </div>
                        </CheckPermission>
                    </div>
                </div>

                <CheckPermission subMod={'staff_users'} permission={'staff_users_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
                <CreateAssignStaffRoleForm
                    open={openuserStaffRollDialog}
                    onClose={() => setuserStaffRollDialog(false)}
                    onSave={setUserStaffRole}
                    initialValues={selectedRow}
                />
            </>
        )
    }

    return (
        <>
            {content}
        </>
    )
}

export default StaffUsersComponent