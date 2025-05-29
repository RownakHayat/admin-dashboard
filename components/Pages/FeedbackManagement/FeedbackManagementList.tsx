"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { Icons } from '@/components/icons';
import { useGetFbManagementListPaginationQuery } from '@/store/features/feedbackManagement';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import FeedbackUserList from './Component/FeedbackUserList/FeedbackUserList';
import CheckPermission from "@/components/common/pipe/roleChecker";

const columnHelper = createColumnHelper<any>()


const FeedbackManagementList = () => {
  const {
    params,
    filterSearchText,
  } = useFormSetting()

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const { data: listQuery, refetch, isLoading } = useGetFbManagementListPaginationQuery(paramsValue)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [openNewEntry, setOpenNewEntry] = useState(false)

  const handleFeedbackUserDialog = (data: any) => {
    setSelectedData(data)
    setOpenNewEntry(true)
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
    columnHelper.accessor((tableField) => tableField?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor((tableField) => tableField?.program_info?.name_en, {
      id: "name_en",
      header: "Program",
    }),
    columnHelper.accessor((tableField) => tableField?.activity?.name, {
      id: "name",
      header: "Activity",
    }),
    // columnHelper.accessor((tableField) => moment(tableField?.start_date).format('DD MMM YYYY'), {
    //   id: "start_date",
    //   header: "Start Date",
    // }),
    // columnHelper.accessor((tableField) => moment(tableField?.end_date).format('DD MMM YYYY'), {
    //   id: "end_date",
    //   header: "End Date",
      
    // }),
    columnHelper.accessor((tableField) => "" ,{
      id: "end_date",
      header: "Date",
      cell: ({ row }: any) => {
        const viewData = row?.original
        const startDate = moment(viewData?.start_date).format('DD MMM YYYY');
        const endDate = moment(viewData?.end_date).format('DD MMM YYYY');
        return (
          <div className="w-[120px]">
            {startDate} - {endDate}
          </div>
        )
      },
    }),
    columnHelper.accessor((tableField) => tableField?.total_feedbacks, {
      id: "total_feedbacks",
      header: "Total Feedback",
    }),
    columnHelper.accessor((tableField) => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <div className=" flex justify-center space-x-3">
              <CheckPermission subMod={'user_feedbacks'} permission={'user_feedback_view'}>

              <span className="cursor-pointer">
                <Icons.view onClick={() => handleFeedbackUserDialog(viewData)}/>
              </span>
              </CheckPermission>
            </div>
          </>
        )
      },
    }),

  ], [params, listQuery]);

  return (
    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-12 md:col-span-6 '>
          <h1 className='font-bold text-[25px]'> Feedback Management
          </h1>
        </div>
        <div className='col-span-12 md:col-span-6'>
          <Search />
        </div>
      </div>
      <CheckPermission subMod={'user_feedbacks'} permission={'user_feedback_list'}>
        <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
      </CheckPermission>
      <FeedbackUserList open={openNewEntry} setOpen={setOpenNewEntry} id={selectedData?.id} viewData={selectedData} refetch={refetch} />
    </>
  )
}

export default FeedbackManagementList