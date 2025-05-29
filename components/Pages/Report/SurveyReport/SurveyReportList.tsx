"use client"

import { useFormSetting } from "@/components/common/hooks/useFormSetting"
import ReactTable from "@/components/common/ReactTable/ReactTable"
import Search from "@/components/common/Search/Search"
import { useGetSurveyListQuery } from "@/store/features/surveyManagement/surveyDataList"
import { IndexSerial } from "@/store/utils"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import moment from "moment"
import { useMemo, useRef } from "react"
import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import SurveyReportView from "./Components/SurveyReportView"
import Image from "next/image"
import { useReactToPrint } from "react-to-print"

const columnHelper = createColumnHelper<any>()

const SurveyReportList = () => {
  const {
    params,
    filterSearchText,
  } = useFormSetting()


  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` }
  const { data: listQuery, refetch, isLoading } = useGetSurveyListQuery(paramsValue, {
    refetchOnMountOrArgChange: true
  })

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Survey Report",
    onAfterPrint: () => console.log("Print Success"),
  })

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
    columnHelper.accessor((tableField) => tableField?.survey_title, {
      id: "survey_title",
      header: "Title",
    }),
    columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor(() => "", {
      id: "survey_type",
      header: "Survey Type",
      cell: ({ row }: any) => {
        const survey_type = row?.original?.survey_type
        return (
          <>
            <div className="flex justify-left items-center">
              <span>
                {survey_type === '1' && "Open Survey"}
                {survey_type === '2' && "Gender Based Survey"}
                {survey_type === '3' && "District Based Survey"}
                {survey_type === '4' && "Cluster Based Survey"}
                {survey_type === '5' && "Industry Based Survey"}
                {survey_type === '6' && "Direct Beneficiaries Survey"}
              </span>
            </div>
          </>
        )
      },
    }),
    columnHelper.accessor(() => "", {
      id: "start_date",
      header: "Start Date",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <div className="flex justify-left items-center">
              <span>
                {viewData.end_date ? moment(viewData.start_date || "").format("DD MMM YYYY") : ""}
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
                {viewData.end_date ? moment(viewData.end_date || "").format("DD MMM YYYY") : ""}
              </span>
            </div>
          </>
        )
      },
    }),

    columnHelper.accessor((tableField) => tableField?.survey_participant_count, {
      id: "survey_participant_count",
      header: "Participants",
    }),
    columnHelper.accessor(() => "", {
      id: "action",
      header: "Report",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <DG>
              <DialogTrigger>
                <div className=" text-center cursor-pointer">
                  <div className="text-blue-600 font-bold">
                    <Eye
                      className="text-[#0E9F6E]"
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90%] w-[100%] max-h-[95vh] overflow-hidden">
                <div className='flex justify-end mr-6'>
                  <Image
                    src="/assets/Image/print.svg"
                    alt="Reload"
                    width={20}
                    height={20}
                    className='cursor-pointer absolute top-4'
                    onClick={() => handleClickToPrint()}
                  />

                </div>
                <div ref={componentRef} className="max-h-[85vh] overflow-y-auto">
                  <SurveyReportView id={viewData.id} />
                </div>
              </DialogContent>
            </DG>
          </>
        )
      },
    }),
  ], [params, listQuery]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between items-center">
            <p className="text-2xl">Survey  Report</p>
            <Search />
          </div>
        </div>
      </div>
      <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />




    </div>
  )
}

export default SurveyReportList
