"use client"

import ReactTable from '@/components/common/ReactTable/ReactTable';
import { useGetFairsUserListQuery } from '@/store/features/eventManagement/fairSales';
import { createColumnHelper } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>()

const FairSaleView = () => {

  const params = useParams();
  const id = params?.id ? Number(params.id) : null; // Extract id from the URL

  const { data: listQuery, isLoading } = useGetFairsUserListQuery(id);

  const columns: any = useMemo(() => [
    columnHelper.accessor((tableField) => "", {
      id: "sl",
      header: "SL",
      cell: ({ row }: any) => row?.index + 1
    }),
    columnHelper.accessor((tableField) => tableField?.user?.user_profile?.sme_id, {
      id: "sme_id",
      header: "SME ID",
    }),
    columnHelper.accessor((tableField) => tableField?.user?.name, {
      id: "user",
      header: "User Name",
    }),
    columnHelper.accessor((tableField) => tableField?.user?.mobile, {
      id: "mobile",
      header: "Mobile No",
    }),
    columnHelper.accessor((tableField) => tableField?.fair_sale, {
      id: "fair_sale",
      header: "Fair Sale",
    }),

  ], [params, listQuery]);


  return (
    <>
      <div className='w-full bg-white rounded-lg p-4'>
        <p className='text-[18px] font-bold text-black text-center'>Fair Sales Details</p>
        <ReactTable dataSource={listQuery} columns={columns} />
      </div>
    </>
  )
}

export default FairSaleView