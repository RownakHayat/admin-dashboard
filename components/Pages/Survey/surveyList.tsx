"use client";

import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { useGetAllParticipateSurveyPaginationQuery } from "@/store/features/survey";
import { IndexSerial } from "@/store/utils";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ServeyForm from "./ServeyForm/ServeyForm";

const columnHelper = createColumnHelper<any>();

const SurveyList = () => {
  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }

  const [openAction, setOpenAction] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const { data: listQuery, refetch, isLoading } = useGetAllParticipateSurveyPaginationQuery(paramsValue,{refetchOnMountOrArgChange:true});

  useEffect(() => {
    refetch()
  }, [listQuery])
  

  const handleActionDialog = (data: any) => {
    setSelectedData(data);
  };

  const columns: any = useMemo(
    () => [
      columnHelper.accessor((tableField) => tableField.id, {
        id: "id",
        header: "SL",
        cell: (props: any) => {
          const sl = IndexSerial(
            params?.page,
            params.limit,
            props.row.index,
            listQuery?.pagination?.total
          );
          return sl;
        },
      }),

      columnHelper.accessor((tableField) => tableField?.survey_title, {
        id: "survey_title",
        header: "Survey Name",
      }),
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.event_name,
        {
          id: "event_name",
          header: "Event Name",
        }
      ),
      // columnHelper.accessor((tableField) => moment(tableField.created_at || "").format("DD MMM YYYY"), {
      //   id: "created_at",
      //   header: "Survey Creation Date",
      // }),
      columnHelper.accessor(() => "", {
        id: "start_date",
        header: "Start Date",
        cell: ({ row }: any) => {
          const viewData = row?.original
          return (
            <>
              <div className="flex justify-left items-center">
                <span>
                  {viewData.end_date ? moment(viewData.start_date || "").format('DD MMM YYYY') : ""}
                </span>
              </div>
            </>
          )
        },
      }),
      columnHelper.accessor(() => "", {
        id: "end_date",
        header: "End Date",
        cell: ({ row }: any) => {
          const viewData = row?.original
          return (
            <>
              <div className="flex justify-left items-center">
                <span>
                  {viewData.end_date ? moment(viewData.end_date || "").format('DD MMM YYYY') : ""}
                </span>
              </div>
            </>
          )
        },
      }),

      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <>
              <div className="flex justify-left items-center">
                <span className="cursor-pointer">
                  <Link href={`/admin/survey/${viewData?.id}/participate`}>
                    <p
                      onClick={() => handleActionDialog(viewData)}
                      className="bg-[#0CB04D] rounded-lg p-2 text-white font-bold"
                    >
                      Participate
                    </p>
                  </Link>
                </span>
              </div>
            </>
          );
        },
      }),
    ],
    [params, listQuery]
  );

  return (
    <>
      <div className="grid grid-cols-12 gap-3 items-center ">
        <div className="col-span-12 md:col-span-6">
          <h1 className="font-bold text-[25px]">Survey</h1>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Search name="type_name" />
        </div>
      </div>

      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />

      {selectedData && (
        <ServeyForm rowData={selectedData} />
      )}
    </>
  );
};

export default SurveyList;
