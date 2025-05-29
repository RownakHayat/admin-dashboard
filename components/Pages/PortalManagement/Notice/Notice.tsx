"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import SwitchButton from '@/components/common/ReactTable/switchButton/SwitchButton';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { IndexSerial } from '@/components/common/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useChangeNoticeStatusMutation, useGetNoticePaginationQuery, useNoticeDeleteMutation, useNoticeUpdateMutation } from '@/store/features/portalManagement/notices';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()


const NoticeComponent = () => {
    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

    const { data: listQuery, refetch, isLoading } = useGetNoticePaginationQuery(paramsValue)
    const [UpdateNotice] = useNoticeUpdateMutation()
    const [ChangeStatus] = useChangeNoticeStatusMutation()
    const [deleteNotice] = useNoticeDeleteMutation()

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
            id: "name",
            header: "Title",
        }),
        // columnHelper.accessor((tableField) => tableField?.description, {
        //     id: "description",
        //     header: "Description",
        // }),
        columnHelper.accessor((tableField) => tableField?.notice_date, {
            id: "notice_date",
            header: "Notice Date",
        }),
        columnHelper.accessor((tableField) => tableField?.notice_by, {
            id: "notice_by",
            header: "Notice By",
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
                        <span className="cursor-pointer">
                            <Link
                                href={`/admin/portal-management/notice/notice-create/${viewData?.id}/edit`}
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
                <UserTypeForm refetch={refetch} />
                <div className='bg-white p-5'>
                    <Search name="type_name" />
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
                </div>


            </div> */}



            <div>
                <div className="grid grid-cols-12 items-center ">
                    <div className="col-span-12 md:col-span-6 lg:col-span-10">
                        <Search />
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-2 flex justify-end">
                        <Link href="/admin/portal-management/notice/notice-create">
                            <Button className="ml-5 bg-headerbg text-primary border-primary border flex items-center gap-2 hover:text-primary hover:border-primary hover:bg-headerbg">
                                <Icons.plus size={15} />
                                Create Notice
                            </Button>
                        </Link>
                    </div>
                </div>
                <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </div>


        </div>
    )
}

export default NoticeComponent