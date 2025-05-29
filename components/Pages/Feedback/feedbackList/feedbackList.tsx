"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { Avatar } from '@/components/ui/avatar';
import { useGetFeedbackListPaginationQuery } from "@/store/features/feedback";
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import UpdateFeedBack from '../UpdateFeedBack/UpdateFeedback';

const columnHelper = createColumnHelper<any>()

const FeedbackList = () => {
  const {
    params,
    filterSearchText,
  } = useFormSetting()

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const { data: listQuery, refetch, isLoading } = useGetFeedbackListPaginationQuery(paramsValue)


  const [openFeedBack, setOpenFeedBack] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleFeedBackDialog = (data: any) => {
    setSelectedData(data)
    setOpenFeedBack(true)
  }

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
    columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor((tableField) => tableField?.event_detail?.activity?.name, {
      id: "name",
      header: "Activity",
    }),
    columnHelper.accessor((tableField) => moment(tableField?.event_detail?.start_date).format('DD MMM YYYY'), {
      id: "start_date",
      header: "Start Date",
    }),
    columnHelper.accessor((tableField) => moment(tableField?.event_detail?.end_date).format('DD MMM YYYY'), {
      id: "end_date",
      header: "End Date",
    }),
    columnHelper.accessor((tableField) => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <div className='flex justify-left items-center text-center'>
              <Avatar
                className={`cursor-pointer rounded-lg bg-green-600 ${viewData?.event_detail?.feedback.length > 0 ? 'w-fit' : 'w-fit'}`}
              >
                <h1
                  className="font-medium text-[#ffffff] text-nowrap py-2 px-6"
                  onClick={() => handleFeedBackDialog(viewData)}
                >
                  {viewData?.event_detail?.feedback.length > 0 ? "Update" : "Add"} +
                </h1>
              </Avatar>
            </div>
          </>
        )
      },
    }),
  ], [params, listQuery]);

  return (
    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-6 sm:col-span-12 md:col-span-4 lg:col-span-6'>
          <h1 className='font-bold text-[25px]'>Feedback
          </h1>
        </div>
        <div className='col-span-4 sm:col-span-12 md:col-span-4 lg:col-span-4'>
          <Search />
        </div>
      </div>
      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
      <UpdateFeedBack open={openFeedBack} setOpen={setOpenFeedBack} id={selectedData?.id} rowData={selectedData} />
    </>
  )
}

export default FeedbackList