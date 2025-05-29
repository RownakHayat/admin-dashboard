"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { siteConfig } from "@/config/site";
import { useChangeActivityCategoryStatusMutation, useGetActivityCategorysPaginationQuery } from '@/store/features/configuration/activityCategory';
import { createColumnHelper } from '@tanstack/react-table';
import Image from "next/image";
import { useMemo } from 'react';
import ActivitiesCategoryForm from './form/activitiesCategoryForm';

const columnHelper = createColumnHelper<any>()

const ActivitiesCatogoryList = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetActivityCategorysPaginationQuery(paramsValue)
    const [ChangeStatus] = useChangeActivityCategoryStatusMutation()

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
            header: "Activity Category Name ( English )",
        }),
        columnHelper.accessor((tableField) => tableField?.name_bn, {
            id: "name_bn",
            header: "Activity Category Name ( Bangla )",
        }),
        columnHelper.accessor((tableField) => tableField.banner, {
            id: "banner",
            header: "Banner",
            cell: ({ row }: any) => {
                const viewImg = row?.original || {};
                return (
                    <div className="flex">
                        <div className="mr-2">
                            {viewImg.banner ? (
                                <Image
                                    src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                                        }${viewImg?.banner}`}
                                    className="rounded w-[100px] h-[60px] object-contain"
                                    width={60}
                                    height={60}
                                    alt={viewImg?.full_name_eng || "No Image"}
                                />
                            ) : (
                                <Image
                                    src={`/assets/Image/dummy-image.jpg`}
                                    className="rounded w-[60px] h-[60px]"
                                    width={60}
                                    height={60}
                                    alt={viewImg?.image || "No Image"}
                                />
                            )}
                        </div>
                        <div>{row.original.full_name_eng}</div>
                    </div>
                );
            },
        }),

        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                return (
                    <div className=" flex justify-left space-x-3">
                        <CheckPermission subMod={'activity_categories'} permission={'activity_categories_status'}>
                            <SwitchButton
                                updateAPI={ChangeStatus}
                                data={{
                                    ...row?.original,
                                    id: row?.original.id
                                }}
                            />
                        </CheckPermission>
                        <CheckPermission subMod={'activity_categories'} permission={'activity_categories_edit'}>
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
                <CheckPermission subMod={'activity_categories'} permission={'activity_categories_add'}>
                    <ActivitiesCategoryForm refetch={refetch} />
                </CheckPermission>
                <div>
                    <Search name="type_name" />
                </div>
                <CheckPermission subMod={'activity_categories'} permission={'activity_categories_list'}>
                    <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </CheckPermission>
            </div>
        </div>
    )
}

export default ActivitiesCatogoryList