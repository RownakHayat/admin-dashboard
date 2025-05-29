"use client"

import { useFormSetting } from '@/components/common/hooks/useFormSetting'
import ReactTable from '@/components/common/ReactTable/ReactTable'
import { useGetUserBasedNotificationListQuery } from '@/store/features/notification'
import { createColumnHelper } from '@tanstack/react-table'
import moment from 'moment'
import Link from 'next/link'
import React, { useMemo } from 'react'

const columnHelper = createColumnHelper<any>();

const NotificationList = () => {

  const { params } = useFormSetting();

  const { data: listQuery, isLoading } = useGetUserBasedNotificationListQuery(params)

  const columns: any = useMemo(
    () => [

      columnHelper.accessor((tableField) => tableField?.body, {
        id: "body",
        header: "Notification",
        cell: ({ row }: any) => {
          const viewData = row?.original
          const createdAt = moment(viewData?.created_at);
          const currentDate = moment(new Date());
          const differenceInDays = currentDate.diff(createdAt, 'days');
          return (
            <Link href={`/admin/notification/${viewData?.id}/view`} >
              <li
                className="px-4 py-2 bg-gray-200 hover:bg-[#20302f] list-none  mb-2 cursor-pointer rounded-lg hover:text-white group"
              >
                <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis"> {viewData?.body}</p>
                <p className='text-xs pt-3 text-[#9b9090] font-semibold hover:text-white group-hover:text-white'>
                  {differenceInDays > 10
                    ? moment(viewData?.created_at).format('Do MMMM YYYY, h:mm:ss a')
                    : moment(viewData?.created_at).startOf('hour').fromNow()}
                </p>
                <p className='text-xs text-[#9b9090] font-semibold hover:text-white group-hover:text-white'>{viewData?.sender?.name}</p>
              </li>
            </Link>
          )
        },
      }),
    ],
    [params, listQuery]
  );

  return (
    <div>
      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default NotificationList
