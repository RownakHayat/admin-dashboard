"use client"

import { useFormSetting } from "@/components/common/hooks/useFormSetting"
import ReactTable from "@/components/common/ReactTable/ReactTable"
import { IndexSerial } from "@/components/common/utils"
import { Button } from "@/components/ui/button"
import { useAllRunningEventQuery } from "@/store/features/home"
import { createColumnHelper } from "@tanstack/react-table"
import moment from "moment/moment"
import { useMemo, useState } from "react"
import SignInForm from '../../Auth/SignIn/signInForm';
import SignUpForm from "../../Auth/SignUp/signupForm"



const columnHelper = createColumnHelper<any>()

const EventList = () => {
  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const { data: allEventsData } = useAllRunningEventQuery({})


  const [showSignIn, setShowSignIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [id, setId] = useState(null)

  const handleClick = (data: any) => {
    setShowSignIn(true)
    setId(data?.id)

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
          allEventsData?.pagination?.total
        );
        return <div className="custom-sl">{sl}</div>;
      },
    }),
    columnHelper.accessor((tableField) => tableField?.activity?.viewData, {
      id: "name",
      header: "Activity Name",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.activity?.name}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => tableField?.event_name, {
      id: "event_name",
      header: "Event Name",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.event_name}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => tableField?.program_info?.name_en, {
      id: "name_en",
      header: "Program Name",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.program_info?.name_en}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => tableField?.venue, {
      id: "venue",
      header: "Venue",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.venue}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => moment(tableField.dead_line || "").format("DD MMM YYYY"), {
      id: "dead_line",
      header: "Deadline",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {moment(viewData?.dead_line).format("DD MMM YYYY")}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => moment(tableField?.start_date || "").format("DD MMM YYYY"), {
      id: "start_date",
      header: "Start Date",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.start_date}
          </div>
        );
      },
    }),
    columnHelper.accessor((tableField) => moment(tableField?.end_date || "").format("DD MMM YYYY"), {
      id: "end_date",
      header: "End Date",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.end_date}
          </div>
        );
      },
    }),
    // columnHelper.accessor((tableField) => tableField?.remarks, {
    //   id: "remarks",
    //   header: "Remarks",
    //   cell: ({ row }: any) => {
    //     const viewData = row?.original || {};
    //     return (
    //       <div className="sm:text-sm">
    //         {viewData?.remarks}
    //       </div>
    //     );
    //   },
    // }),
    columnHelper.accessor((tableField) => tableField?.action, {
      id: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original || {};
        return (
          <div className="sm:text-sm">
            {viewData?.action}
            <span className="cursor-pointer">
              <Button className="bg-[#00CFE8] rounded-lg px-4 py-3 text-white"
                onClick={() => handleClick(viewData)}>
                Apply
              </Button>
            </span>
          </div>
        );
      },
    }),


  ], [params, allEventsData]);


  return (
    <div className="custom_container py-[50px]">
    <div className="grid grid-cols-12 gap-6">
      <div className={showSignIn ? "col-span-8" : "col-span-12"}>
        <ReactTable dataSource={allEventsData} columns={columns} />
      </div>
  
      {showSignIn && (
        <div className="col-span-4 h-full">
          <div className="border border-[#aaa9a9] bg-white h-full rounded-lg p-6">
            {!isRegistering && <SignInForm setIsRegistering={setIsRegistering} eventId={id} />}
            {isRegistering && <SignUpForm setIsRegistering={setIsRegistering} eventId={id} />}
          </div>
        </div>
      )}
    </div>
  </div>
  
  )
}

export default EventList