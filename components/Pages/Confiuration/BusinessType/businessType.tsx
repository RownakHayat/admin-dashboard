"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeBusinessTypeStatusMutation, useGetBusinessTypePaginationQuery } from '@/store/features/configuration/businessType';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import BusinessTypeForm from './form/businessTypeForm';

const columnHelper = createColumnHelper<any>()
const BusinessTypeComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetBusinessTypePaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeBusinessTypeStatusMutation()

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
            header: "Business Name",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'business_type'} permission={'business_type_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'business_type'} permission={'business_type_edit'}>
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
                <CheckPermission subMod={'business_type'} permission={'business_type_add'}>
                    <BusinessTypeForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'business_type'} permission={'business_type_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default BusinessTypeComponent