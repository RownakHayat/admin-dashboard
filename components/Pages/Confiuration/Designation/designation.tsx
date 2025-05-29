"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeDesignationStatusMutation, useDesignationUpdateMutation, useGetDesignationPaginationQuery } from '@/store/features/configuration/designation';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import DesignationForm from './form/designationForm';

const columnHelper = createColumnHelper<any>()

const DesignationComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetDesignationPaginationQuery(paramsValue)
    const [UpdateUserType] = useDesignationUpdateMutation()
    const [ChangeStatus] = useChangeDesignationStatusMutation()



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
            header: "Designation",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <SwitchButton
                            updateAPI={ChangeStatus}
                            data={{
                                ...row?.original,
                                id: row?.original.id
                            }}
                        />

                        <span className="cursor-pointer">
                            <Icons.edit
                                onClick={() =>
                                    editData({
                                        ...row.original
                                    })
                                }
                            />
                        </span>

                    </div>
                )
            },
        }),
    ], [params, listQuery]);
    return (
        <div>
            <div className='w-full'>
                <DesignationForm refetch={refetch} />
                <div>
                    <Search name="type_name" />
                </div>
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default DesignationComponent