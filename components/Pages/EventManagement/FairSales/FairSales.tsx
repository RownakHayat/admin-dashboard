
"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import CheckPermission from '@/components/common/pipe/roleChecker';
import { Icons } from '@/components/icons';
import { useGetFairSalesQuery } from '@/store/features/eventManagement/fairSales';
import { useGetFinancialYearListQuery } from '@/store/features/financialYear';
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import Link from 'next/link';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()

const FairSalesList = ({ viewData }: any) => {

  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const { data: financialYear } = useGetFinancialYearListQuery()
  const { data: listQuery, refetch, isLoading } = useGetFairSalesQuery(viewData?.id)

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
    columnHelper.accessor((tableField) => tableField?.activity?.name, {
      id: "name",
      header: "Activity Type",
    }),
    columnHelper.accessor((tableField) => tableField?.selected_participants, {
      id: "selected_participants",
      header: "Selected Participants",
    }),
    columnHelper.accessor((tableField) => tableField?.attended_participants, {
      id: "attended_participants",
      header: "Attended Participants",
    }),
    columnHelper.accessor((tableField) => tableField?.date_range, {
      id: "date_range",
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
    columnHelper.accessor((tableField) => tableField?.count_fair_sale, {
      id: "count_fair_sale",
      header: "Fair Sales Participants",
    }),
    columnHelper.accessor((tableField) => tableField?.sales_amount, {
      id: "sales_amount",
      header: "Sales Amount",
    }),

    columnHelper.accessor(() => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <div className="flex  justify-left space-x-3">
            <CheckPermission subMod={'fair_sales'} permission={'fair_sales_view'}>

              <span className=" cursor-pointer">
                <Link href={`/admin/event-management/fair-sales/${viewData?.id}/view`}>
                  <Icons.view />
                </Link>
              </span>
            </CheckPermission>
          </div>
        )
      },
    }),
  ], [params, listQuery]);

  return (
    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-12 md:col-span-6'>
          <div className='flex flex-wrap'>
            <h1 className='font-bold text-[25px]'>Fair Sales</h1>
            {financialYear?.data?.[0] && (
              <span className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2 '>
                {financialYear.data[0]}
              </span>
            )}
          </div>

        </div>
        <div className='col-span-12 md:col-span-6'>
          <Search />
        </div>
      </div>
      <CheckPermission subMod={'fair_sales'} permission={'fair_sales_list'}>
        <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
      </CheckPermission>
    </>
  )
}

export default FairSalesList