"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { useGetEventFairSalesQuery } from '@/store/features/events/fairSales';
import { useGetFinancialYearListQuery } from '@/store/features/financialYear';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import EventFairSaleView from './view/fairSaleView';
import moment from 'moment';

const columnHelper = createColumnHelper<any>()
const EventFairSalesList = () => {

  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const { data: financialYear } = useGetFinancialYearListQuery()

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const { data: listQuery, refetch, isLoading } = useGetEventFairSalesQuery(paramsValue)

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
    columnHelper.accessor((tableField) => tableField?.event_detail?.venue, {
      id: "venue",
      header: "Venue",
    }),
    columnHelper.accessor((tableField) => moment(tableField?.event_detail?.start_date || "").format('DD MMM YYYY'), {
      id: "start_date",
      header: "Start Date",
    }),
    columnHelper.accessor((tableField) => moment(tableField?.event_detail?.end_date || "").format('DD MMM YYYY'), {
      id: "end_date",
      header: "End Date",
    }),
    columnHelper.accessor((tableField) => tableField?.fair_sale, {
      id: "amount",
      header: "Amount",
    }),
    columnHelper.accessor(() => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <div className="flex justify-center">
            <EventFairSaleView id={viewData?.event_detail_id} viewData={viewData} refetch={refetch} />
          </div>
        )
      },
    }),
  ], [params, listQuery]);

  return (
    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-6 sm:col-span-12 md:col-span-4 lg:col-span-6'>
          <h1 className='font-bold text-[25px]'>Fair Sales
            {financialYear?.data?.[0] && (
                <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2'>
                  {financialYear.data[0]}
                </span>
            )}
          </h1>
        </div>
        <div className='col-span-6 sm:col-span-12 md:col-span-6 lg:col-span-6'>
          <Search />
        </div>
      </div>
      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
    </>
  )
}

export default EventFairSalesList