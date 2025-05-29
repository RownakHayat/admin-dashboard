"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeOrganizationTypeStatusMutation, useGetOrganizationTypePaginationQuery } from '@/store/features/configuration/organizationType';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import OrganizationTypeForm from './form/organizationTypeForm';

const columnHelper = createColumnHelper<any>()


const OrganizationTypeComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetOrganizationTypePaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeOrganizationTypeStatusMutation()

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
            header: "Organization Name",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'organization_type'} permission={'organization_type_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'organization_type'} permission={'organization_type_edit'}>
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
                <CheckPermission subMod={'organization_type'} permission={'organization_type_add'}>
                    <OrganizationTypeForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'organization_type'} permission={'organization_type_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default OrganizationTypeComponent