"use client"
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useGetCategoryWiseRunningEventQuery, useGetCategoryWiseRunningEventUpdateQuery } from "@/store/features/home";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const columnHelper = createColumnHelper<any>()


const CatagoryWiseSingleEvent = () => {
  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  // const params = useParams();
  // const id = params?.id ? Number(params.id) : null;
  const paramss = useParams();
  const id = paramss.id as string
  const paramsValue = { ...params, id, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

  // const { data: CatagoryWiseSingleEventData, isLoading } = useGetCategoryWiseRunningEventQuery(id);
  const { data: CatagoryWiseSingleEventData, isLoading } = useGetCategoryWiseRunningEventUpdateQuery(id);
  // const { data: CatagoryWiseSingleEventData, isLoading } = useGetCategoryWiseRunningEventQuery(paramsValue);

  const CatagoryWiseSingleEventDatas = CatagoryWiseSingleEventData?.data


  const columns: any = useMemo(() => [

    columnHelper.accessor((tableField) => "", {
      id: "sl",
      header: "SL",
      cell: ({ row }: any) => row?.index + 1
    }),
    columnHelper.accessor((tableField) => tableField?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor((tableField) => tableField?.program_info?.name_en, {
      id: "name_en",
      header: "Program Name",
    }),
    columnHelper.accessor((tableField) => tableField?.activity?.name, {
      id: "name",
      header: "Activity",
    }),
    columnHelper.accessor((tableField) => tableField?.venue, {
      id: "venue",
      header: "Venue",
    }),
    columnHelper.accessor((tableField) => tableField?.start_date, {
      id: "start_date",
      header: "Start Date",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="w-[100px]">
            {moment(viewData?.start_date).format('DD MMM YYYY')}
          </div>
        )
      }
    }),
    columnHelper.accessor((tableField) => tableField?.end_date, {
      id: "end_date",
      header: "End Date",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="w-[100px]">
            {moment(viewData?.end_date).format('DD MMM YYYY')}
          </div>
        )
      }
    }),
    columnHelper.accessor((tableField) => tableField?.dead_line, {
      id: "dead_line",
      header: "Application Deadline",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="w-[100px]">
            {moment(viewData?.dead_line).format('DD MMM YYYY')}
          </div>
        )
      }
    }),
    columnHelper.accessor((tableField) => tableField?.remarks, {
      id: "remarks",
      header: "Remarks",
    }),
    columnHelper.accessor((tableField) => tableField?.event_entry_fee, {
      id: "event_entry_fee",
      header: "Fee",
    }),
  ], [params, CatagoryWiseSingleEventData]);



  return (
    <div className="">
      <div className="grid grid-cols-12 items-center px-4">
        <div className="col-span-4">
          <h3 className="text-lg text-gray-500"> Running Event</h3>
        </div>
        <div className='col-span-8 pr-4'>
          <Search name="type_name" />
        </div>
      </div>
      <ReactTable dataSource={CatagoryWiseSingleEventData} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default CatagoryWiseSingleEvent