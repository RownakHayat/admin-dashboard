"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeUserTypeStatusMutation, useGetUserTypePaginationQuery, useUserTypeUpdateMutation } from '@/store/features/configuration/UserType';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import UserTypeForm from './form/UserTypeForm';

const columnHelper = createColumnHelper<any>()


const UserTypeComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    // const paramsValue = { ...params, whereClause: `${[[`%22${searchField}%22,%22=%22,${filterSearchText ? filterSearchText : null}`]]}` }

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetUserTypePaginationQuery(paramsValue)
    const [UpdateUserType] = useUserTypeUpdateMutation()
    const [ChangeStatus] = useChangeUserTypeStatusMutation()



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
        columnHelper.accessor((tableField) => tableField?.name, {
            id: "name",
            header: "User Type",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'user_type'} permission={'user_type_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'user_type'} permission={'user_type_edit'}>
                            <span className="cursor-pointer">
                                <Icons.edit
                                    onClick={() =>
                                        editData({
                                            ...row.original
                                        })
                                    }
                                />
                            </span>
                        </CheckPermission>
                    </div>
                )
            },
        }),
    ], [params, listQuery]);


    return (
        <div>
            <div className='w-full'>
                <CheckPermission subMod={'user_type'} permission={'user_type_add'}>
                    <UserTypeForm refetch={refetch} />
                </CheckPermission>
                <div className='bg-white p-5'>
                    <Search name="type_name" />
                    <CheckPermission subMod={'user_type'} permission={'user_type_list'}>
                        <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                    </CheckPermission>
                </div>


            </div>
        </div>
    )
}

export default UserTypeComponent