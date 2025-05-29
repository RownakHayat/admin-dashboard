"use client"

import SinglePaymentView from "@/components/Pages/Payment/view/SinglePaymentView";
import ReactTable from '@/components/common/ReactTable/ReactTable';
import Search from '@/components/common/Search/Search';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { useGetNewPaymentPaginationQuery } from "@/store/features/payment";
import { IndexSerial } from '@/store/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const columnHelper = createColumnHelper<any>()

const UserLogMamagementList = () => {
  const {
    params,
    filterSearchText,
  } = useFormSetting()
  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const paramss = useParams();
  const id = paramss.id as string;

  const { data: listQuery,isLoading } = useGetNewPaymentPaginationQuery()
  const { data: financialYear } = useGetFinancialYearListQuery()

  const [userId, setUserId] = useState<any>([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  const [activeTab, setActiveTab] = useState('selection');
  const handleTabChange = (tabValue: any) => {
    setActiveTab(tabValue); // Function to update activeTab state
  };

  const [success, setSuccess] = useState(false);

  const handleAllChecked = () => {
    setUserId([])
    setIsCheckedAll(!isCheckedAll)

    if (isCheckedAll) {
      const checkedAll = listQuery?.data?.map((item: any) => {
        return {
          employee_id: item?.id,
          status: 0
        }
      })
      setUserId(checkedAll)
    } else {
      const checkedAll = listQuery?.data?.map((item: any) => {
        return {
          employee_id: item?.id,
          status: 1
        }
      })
      setUserId(checkedAll)
    }

  }

  const changeCheckValue = (id: number) => {

    const updatedValue = userId?.map((item: any) => {
      if (item.employee_id === id) {
        return {
          ...item,
          status: item?.status === 1 ? 0 : 1
        }
      } else {
        return item
      }
    })
    setUserId(updatedValue)

    const checkvalue = userId?.filter((e: any) => e.status === 1)
    setIsCheckedAll(checkvalue?.length === listQuery?.data?.length ? true : false)
  }


  const [openPaymentViewDialog, setPaymentViewDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const setPaymentView = (values: any) => {
    setPaymentViewDialog(false);
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

    columnHelper.accessor((tableField) => tableField?.name, {
      id: "program_name",
      header: "User Name",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "User name",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Ip Address",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Date",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Time",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Activity",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Module name",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Sub Module name",
    }),
    columnHelper.accessor((tableField) => tableField?.financial_year?.name, {
      id: "financial_year",
      header: "Log Detils",
    }),
    columnHelper.accessor(() => "", {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            {/* <div className="flex justify-left items-center">


              <span className="cursor-pointer">

                <Eye className="text-[#0E9F6E]" onClick={() => {
                  setSelectedRow(row?.original);
                  setPaymentViewDialog(true);
                }} />
              </span>


            </div> */}
          </>
        )
      },
    }),
  ], [params, listQuery]);



  return (

    <>
      <div className='grid grid-cols-12 gap-3 items-center '>
        <div className='col-span-12 md:col-span-6 '>
          <h1 className='font-bold text-[25px]'>User Log Management
            <span
              className='text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-3'>{financialYear?.data[0]}</span>
          </h1>
        </div>
        <div className='col-span-12 md:col-span-6 '>
          <Search />
        </div>
        {/*<div className='col-span-2  sm:col-span-12 md:col-span-2 lg:col-span-2  py-5'>*/}
        {/*    <Link href="/admin/event-management/new-program/create-program">*/}
        {/*        <Button className=' font-bold  text-primary border-primary border'>*/}
        {/*            Create Program +*/}
        {/*        </Button>*/}
        {/*    </Link>*/}
        {/*</div>*/}
      </div>
      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading}/>

      <SinglePaymentView
        open={openPaymentViewDialog}
        onClose={() => setPaymentViewDialog(false)}
        singlePaymentValues={selectedRow}
      />

    </>
  )
}

export default UserLogMamagementList