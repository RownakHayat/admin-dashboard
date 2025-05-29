"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { useChangeActivitiesStatusMutation, useGetActivitiesPaginationQuery } from '@/store/features/configuration/activities';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import ActivitiesForm from './form/activitiesForm';

const columnHelper = createColumnHelper<any>()
const ActivitiesComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetActivitiesPaginationQuery(paramsValue)

    const [ChangeStatus] = useChangeActivitiesStatusMutation()

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
            header: "Activity Name (English)",
        }),
        columnHelper.accessor((tableField) => tableField?.name_bn, {
            id: "name_bn",
            header: "Activity Name (Bangla)",
        }),
        columnHelper.accessor((tableField) => tableField?.activity_category?.name, {
            id: "activity_category_id",
            header: "Activity Category",
        }),

        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'activities'} permission={'activities_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'activities'} permission={'activities_edit'}>
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
                <CheckPermission subMod={'activities'} permission={'activities_add'}>
                    <ActivitiesForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'activities'} permission={'activities_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default ActivitiesComponent