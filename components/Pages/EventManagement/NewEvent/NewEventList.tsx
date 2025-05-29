"use client";

import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify, listArrayModify } from "@/components/common/lib/globalFunction";
import CheckPermission1 from "@/components/common/pipe/permission";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useGetWingSectionPaginationQuery } from "@/store/features/configuration/wing";
import { useGetNewEventQuery } from "@/store/features/eventManagement/newEvent";
import { useGetNewProgramQuery } from "@/store/features/eventManagement/newProgram";
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { IndexSerial } from "@/store/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from 'zod';

const columnHelper = createColumnHelper<any>();

const defaultSchema = z.object({
  wing_id: z.string().nonempty("Fiscal Year is required"),
  program_detail_id: z.string().optional(),
});

type FormData = z.infer<typeof defaultSchema>;

const NewEventList = () => {

  const { data: financialYear } = useGetFinancialYearListQuery()

  const form = useForm<FormData>({
    resolver: zodResolver(defaultSchema),
    defaultValues: {
      wing_id: "",
      program_detail_id: ""
    },
  });

  const { handleSubmit, control, setValue } = form;
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const wing_id = useWatch({
    control,
    name: "wing_id",
  });

  const program_detail_id = useWatch({
    control,
    name: "program_detail_id",
  });

  const { data: wingSectionData, refetch, isLoading: loading } = useGetWingSectionPaginationQuery()
  const { data: programData, refetch: programRefetch, isLoading: programLoadin } = useGetNewProgramQuery()


  const paramsValue = {
    ...params,
    searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
    wing_id: wing_id || "",
    program_detail_id: program_detail_id || "",
  };
  const { data: listQuery, isLoading } = useGetNewEventQuery(paramsValue);


  useEffect(() => {
    refetch();
  }, [wing_id, program_detail_id, filterSearchText, params]);

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
      columnHelper.accessor((tableField) => tableField?.program_info?.name_en, {
        id: "name_en",
        header: "Program Name",
        cell: ({ row }: any) => {
          const viewData = row?.original || {}
          return (
            <div className="w-[120px]">
              {viewData?.program_info?.name_en}
            </div>
          )
        }
      }),
      columnHelper.accessor((tableField) => tableField?.program_info?.wing?.name, {
        id: "name",
        header: "Wings",
        cell: ({ row }: any) => {
          const viewData = row?.original || {}
           return (
            <div className="w-[120px]">
              {viewData?.program_info?.wing?.name}
            </div>
          )
        }
      }),
      columnHelper.accessor((tableField) => tableField?.event_name, {
        id: "event_name",
        header: "Event Name",
      }),
      columnHelper.accessor((tableField) => tableField?.venue, {
        id: "venue",
        header: "Venue",
      }),
      columnHelper.accessor((tableField) => tableField?.district?.name, {
        id: "district",
        header: "District",
      }),
      columnHelper.accessor((tableField) => tableField?.dead_line, {
        id: "dead_line",
        header: "Application Deadline",
        cell: ({ row }: any) => {
          const viewData = row?.original || {}
          return (
            <div className="w-[120px]">
              {moment(viewData?.dead_line || "").format("DD MMM YYYY")}
            </div>
          )
        }
      }),
      columnHelper.accessor((tableField) => tableField?.date_range, {
        id: "date_range",
        header: "Date ",
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
      columnHelper.accessor((tableField) => tableField?.total_applicants, {
        id: "total_applicants",
        header: "Total Applicants",
      }),
      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          const eventStatus = Number(viewData?.event_status);
          return (
            <div className="flex items-center justify-center">
              <CheckPermission subMod={'new_event'} permission={'new_event_view_button'}>
                <span className="mr-3">
                  <Link href={`/admin/event-management/new-event/${viewData?.id}/event-details`}>
                    <Icons.view />
                  </Link>
                </span>
              </CheckPermission>

              <span className="cursor-pointer">
                {eventStatus === 1 ? (
                  <Link href={`/admin/event-management/new-event/${viewData?.id}/apply-event`}>
                    <p
                      onClick={() => editData(viewData)}
                      className="bg-[#0CB04D] rounded-lg p-2 text-white font-bold md:text-sm text-nowrap"
                    >
                      Generate Form
                    </p>
                  </Link>
                ) : eventStatus === 2 ? (
                  <Link href={`/admin/event-management/new-event/${viewData?.id}/event-apply-form-view`}>
                    <p
                      onClick={() => editData(viewData)}
                      className="bg-[#0CB04D] rounded-lg px-12 py-2 text-white font-bold"
                    >
                      View
                    </p>
                  </Link>

                ) : eventStatus === 3 ? (
                  <span className="flex justify-end items-end">
                    <CheckPermission subMod={'new_event'} permission={'new_event_select_button'}>
                      {/* <Link href={`/admin/event-management/new-event/create-event/${viewData?.id}/selection`}>
                        <p className="bg-[#0CB04D] rounded-lg px-10 py-2 text-white font-bold">Select</p>
                      </Link> */}
                      <Link href={`/admin/event-management/new-event/${viewData?.id}/selection`}>
                        <p className="bg-[#0CB04D] rounded-lg px-10 py-2 text-white font-bold">Select</p>
                      </Link>
                    </CheckPermission>
                  </span>
                ) : eventStatus === 4 ? (
                  <p className="bg-[#0CB04D] rounded-lg p-2 text-white font-bold">Completed</p>
                ) : eventStatus === 5 ? (
                  <p className="bg-[#95a5a6] rounded-lg px-10 py-2 text-white font-bold">Closed</p>
                ) : eventStatus === 6 ? (
                  <p className="bg-[#f1c40f] rounded-lg px-10 py-2 text-white font-bold">Postponed</p>
                ) : eventStatus === 7 ? (
                  <p className="bg-[#e74c3c] rounded-lg px-10 py-2 text-white font-bold">Cancelled</p>
                ) : (
                  "Unknown"
                )}
              </span>

            </div>
          );
        },
      }),
    ],
    [params, listQuery]
  );

  const onSubmit: SubmitHandler<z.infer<typeof defaultSchema>> = async (values) => {
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-4">
          <h1 className="font-bold text-[25px]"> Event List
            {financialYear?.data?.[0] && (
              <span className="text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-2">
                {financialYear.data[0]}
              </span>
            )}
          </h1>
        </div>
        <div className="col-span-12 md:col-span-8">
          <CheckPermission1 subMod="new_event" permission="new_event_add">
            {({ hasPermission }: any) => (
              <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                  <FormAutoComplete
                    name="wing_id"
                    data={listArrayModify(wingSectionData?.data, "name")}
                    singleListName="name"
                    placeholder="Wings"
                    className=""
                  />
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <FormAutoComplete
                      name="program_detail_id"
                      data={listArrayDaynamicModify(
                        programData?.data,
                        "name_en",
                        "name_en"
                      )}
                      singleListName="name_en"
                      placeholder="Program"
                      control={form.control}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Search />
                  </div>

                  {hasPermission && (
                    <div className="">
                      <Link href="/admin/event-management/new-event/create-event">
                        <Button className="font-bold border bg-[#0CB04D] rounded-lg p-5">
                          Create Event +
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </FormContainer>
            )}
          </CheckPermission1>
        </div>
      </div>

      <CheckPermission subMod={'new_event'} permission={'new_event_list'}>
        <div className="mt-2">
          <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
        </div>
      </CheckPermission>

    </>
  );
};

export default NewEventList;
