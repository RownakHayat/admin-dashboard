"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeUpazillaStatusMutation, useGetUpazillaPaginationQuery } from '@/store/features/configuration/upazila';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import UpazilaForm from './form/upazillaForm';

const columnHelper = createColumnHelper<any>()


const UpazilaComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetUpazillaPaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeUpazillaStatusMutation()



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
        columnHelper.accessor(() => "", {
            id: "upazila_name",
            header: "Upazila",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <div className="">
                        {viewData?.name}
                    </div>
                )
            },
        }),
        columnHelper.accessor((tableField) => tableField?.district?.name, {
            id: "district",
            header: "District",
        }),
        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'upazila'} permission={'upazila_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'upazila'} permission={'upazila_edit'}>
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
                <CheckPermission subMod={'upazila'} permission={'upazila_add'}>
                    <UpazilaForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'upazila'} permission={'upazila_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default UpazilaComponent