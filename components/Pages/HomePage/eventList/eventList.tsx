"use client";

import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import { IndexSerial } from "@/components/common/utils";
import {
  useAllRunningEventAuthQuery,
  useAllRunningEventQuery,
} from "@/store/features/home";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import moment from "moment/moment";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

const EventList = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  // const { data: allEventsData } = useAllRunningEventQuery({})
  const { data: allEventsData } = useAllRunningEventAuthQuery({});

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
          return <div className="sm:text-sm">{viewData?.activity?.name}</div>;
        },
      }),
      columnHelper.accessor((tableField) => tableField?.event_name, {
        id: "event_name",
        header: "Event Name",
        cell: ({ row }: any) => {
          const viewData = row?.original || {};
          return <div className="sm:text-sm">{viewData?.event_name}</div>;
        },
      }),
      columnHelper.accessor((tableField) => tableField?.program_info?.name_en, {
        id: "name_en",
        header: "Program Name",
        cell: ({ row }: any) => {
          const viewData = row?.original || {};
          return (
            <div className="sm:text-sm">{viewData?.program_info?.name_en}</div>
          );
        },
      }),
      columnHelper.accessor((tableField) => tableField?.venue, {
        id: "venue",
        header: "Venue",
        cell: ({ row }: any) => {
          const viewData = row?.original || {};
          return <div className="sm:text-sm">{viewData?.venue}</div>;
        },
      }),
      columnHelper.accessor(
        (tableField) =>
          moment(tableField.dead_line || "").format("DD MMM YYYY"),
        {
          id: "dead_line",
          header: "Deadline",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="sm:text-sm">
                {viewData?.program_info?.name_en}
              </div>
            );
          },
        }
      ),
      columnHelper.accessor(
        (tableField) =>
          moment(tableField?.start_date || "").format("DD MMM YYYY"),
        {
          id: "start_date",
          header: "Start Date",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return (
              <div className="sm:text-sm">
                {viewData?.program_info?.name_en}
              </div>
            );
          },
        }
      ),
      columnHelper.accessor(
        (tableField) =>
          moment(tableField?.end_date || "").format("DD MMM YYYY"),
        {
          id: "end_date",
          header: "End Date",
          cell: ({ row }: any) => {
            const viewData = row?.original || {};
            return <div className="sm:text-sm">{viewData?.end_date}</div>;
          },
        }
      ),
      // columnHelper.accessor((tableField) => tableField?.remarks, {
      //   id: "remarks",
      //   header: "Remarks",
      //   cell: ({ row }: any) => {
      //     const viewData = row?.original || {};
      //     return <div className="sm:text-sm">{viewData?.remarks}</div>;
      //   },
      // }),
      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <div className="flex justify-left items-center">
              <span className="cursor-pointer">
                {viewData?.custom_application_status === "applied" ? (
                  "Applied"
                ) : (
                  <Link
                    href={`/admin/events/new-event-apply/${viewData?.id}/apply-event`}
                  >
                    <p
                      onClick={() => editData(viewData)}
                      className="bg-[#00CFE8] rounded-lg px-3 py-2 text-white"
                    >
                      Apply
                    </p>
                  </Link>
                )}
              </span>
            </div>
          );
        },
      }),
    ],
    [params, allEventsData]
  );

  return (
    <div className="custom_container py-[50px]">
      <ReactTable dataSource={allEventsData} columns={columns} />
    </div>
  );
};

export default EventList;
