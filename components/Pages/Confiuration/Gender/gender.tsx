"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeGenderStatusMutation, useGetGenderPaginationQuery } from '@/store/features/configuration/gender';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import GenderForm from './form/genderForm';

const columnHelper = createColumnHelper<any>()
const GenderComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetGenderPaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeGenderStatusMutation()

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
            header: "Name",
        }),

        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'gender'} permission={'gender_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>

                        <CheckPermission subMod={'gender'} permission={'gender_edit'}>
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
                <CheckPermission subMod={'gender'} permission={'gender_add'}>
                    <GenderForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'gender'} permission={'gender_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default GenderComponent