"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { useChangeNewsStatusMutation, useGetNewsPaginationQuery, useNewsDeleteMutation, useNewsUpdateMutation } from '@/store/features/portalManagement/news';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()


const NewsComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetNewsPaginationQuery(paramsValue)
    const [UpdateNews] = useNewsUpdateMutation()
    const [ChangeStatus] = useChangeNewsStatusMutation()
    const [deleteNews] = useNewsDeleteMutation()

    const handleDelete = async (id: number) => {
        try {
            await deleteNews(id).unwrap();
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
            id: "name",
            header: "Title",
        }),
        columnHelper.accessor((tableField) => tableField?.description, {
            id: "description",
            header: "Description",
        }),
        columnHelper.accessor((tableField) => tableField?.reporter, {
            id: "reporter",
            header: "Reporter",
        }),
        columnHelper.accessor((tableField) => tableField?.news_date, {
            id: "news_date",
            header: "News Date",
        }),
        columnHelper.accessor((tableField) => tableField.image_path, {
            id: "image_path",
            header: "Image",
            cell: ({ row }: any) => {
                const viewImg = row?.original || {};
                return (
                    <div className="flex">
                        <div className="mr-2">
                            {viewImg.image_path ? (
                                <Image
                                    src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                                        }${viewImg?.image_path}`}
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
        columnHelper.accessor((tableField) => tableField?.hyperlink, {
            id: "hyperlink",
            header: "HyperLink",
        }),
        columnHelper.accessor((tableField) => tableField?.source, {
            id: "source",
            header: "Source",
        }),

        columnHelper.accessor(() => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original || {}
                return (
                    <div className=" flex justify-left space-x-3">
                        <SwitchButton
                            updateAPI={ChangeStatus}
                            data={{
                                ...row?.original,
                                id: row?.original.id
                            }}
                        />

                        {/* <span className="cursor-pointer">
                            <Icons.edit
                                onClick={() =>
                                    editData({
                                        ...row.original
                                    })
                                }
                            />
                        </span> */}
                        <span className="cursor-pointer">
                            <Link
                                href={`/admin/portal-management/news/news-create/${viewData?.id}/edit`}
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
            {/* <div className='w-full'>
                <NewsForm refetch={refetch} />
                <div className='bg-white p-5'>
                    <Search name="type_name" />
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </div>
            </div> */}


            <div>
                <div className="grid grid-cols-12 items-center ">
                    <div className="col-span-12 md:col-span-10">
                        <Search />
                    </div>
                    <div className="col-span-12 md:col-span-2 flex justify-end bg-[#F5F3Fa] py-5">
                        <Link href="/admin/portal-management/news/news-create">
                            <Button className="ml-5 bg-headerbg text-primary border-primary border flex items-center gap-2 hover:text-primary hover:border-primary hover:bg-headerbg">
                                <Icons.plus size={15} />
                                Create News
                            </Button>
                        </Link>
                    </div>
                </div>
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </div>


        </div>
    )
}

export default NewsComponent