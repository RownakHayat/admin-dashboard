"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { useGetLinkableInformationPaginationQuery, useLinkableInformationDeleteMutation } from '@/store/features/portalManagement/linkableInfo';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()


const LinkableInformation = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` };

    const { data: listQuery, refetch, isLoading } = useGetLinkableInformationPaginationQuery(paramsValue);
    // const [UpdateEssentInfo] = useEssentInfoUpdateMutation()
    const [deleteNotice] = useLinkableInformationDeleteMutation()

    const handleDelete = async (id: number) => {
        try {
            await deleteNotice(id).unwrap();
            refetch();
        } catch (error) {
        }
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
        columnHelper.accessor((tableField) => tableField?.title, {
            id: "title",
            header: "Title",
        }),
        columnHelper.accessor((tableField) => tableField?.link, {
            id: "link",
            header: "Link",
        }),
        columnHelper.accessor((tableField) => tableField.link_icon, {
            id: "link_icon",
            header: "Image",
            cell: ({ row }: any) => {
                const viewImg = row?.original || {};
                return (
                    <div className="flex">
                        <div className="mr-2">
                            {viewImg.link_icon ? (
                                <Image
                                    src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                                        }${viewImg?.link_icon}`}
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
                const viewData = row?.original || {}
                return (
                    <div className=" flex justify-left space-x-3">
                        {/* <SwitchButton
                            updateAPI={UpdateEssentInfo}
                            data={{
                                ...row?.original,
                                id: row?.original.id
                            }}
                        /> */}
                        <span className="cursor-pointer">
                            <Link
                                href={`/admin/portal-management/linkable-information/linkable-information-create/${viewData?.id}/edit`}
                            >
                                <Icons.edit onClick={() => editData(viewData)} />
                            </Link>
                        </span>


                        <span className="cursor-pointer" onClick={() => handleDelete(row.original.id)}>
                            <Icons.delete />
                        </span>

                    </div>
                )
            },
        }),
    ], [params, listQuery]);


    return (
        <div>
            <div className="grid grid-cols-12 px-6">
                <div className="col-span-6">
                    <h1 className='text-xl font-bold'>Linkable Information List</h1>
                </div>
                <div className="col-span-6">
                    <div className="grid grid-cols-12 items-center">
                        <div className="col-span-12 md:col-span-6 lg:col-span-8">
                            <Search />
                        </div>
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-end">
                            <Link href="/admin/portal-management/linkable-information/linkable-information-create">
                                <Button className="ml-5 bg-headerbg text-primary border-primary border flex items-center gap-2 hover:text-primary hover:border-primary hover:bg-headerbg">
                                    <Icons.plus size={15} />
                                    CreateLinkable Information
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
        </div>
    )
}

export default LinkableInformation