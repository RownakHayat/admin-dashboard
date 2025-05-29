"use client";

import PaymentConfirmView from "@/components/Pages/Payment/view/PaymentConfirmView";
import SinglePaymentView from "@/components/Pages/Payment/view/SinglePaymentView";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { Button } from "@/components/ui/button";
import { useGetNewPaymentAppliedPaginationQuery } from "@/store/features/paymentManagment";
import { IndexSerial } from "@/store/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import PaymentRejectView from "../../Payment/view/PaymentRejectView";
import SinglePaymentRejectView from "../../Payment/view/SinglePaymentRejectView";
import { Icons } from "@/components/icons";
import SingleHistoryView from "../../Payment/view/SingleHistoryView";

const columnHelper = createColumnHelper<any>();
const PaymentListApplyUser = () => {
  const { params, filterSearchText } = useFormSetting();

  const paramsValue = {
    ...params,
    searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
  };

  const { data: listQuery, isLoading } =
    useGetNewPaymentAppliedPaginationQuery(paramsValue);

  const [openPaymentViewDialog, setPaymentViewDialog] = useState(false);
  const [openHistoryViewDialog, setHistoryViewDialog] = useState(false);
  const [openPaymentRejectViewDialog, setPaymentRejectViewDialog] =
    useState(false);
  const [openPaymentConfirmDialog, setPaymentConfirmDialog] = useState(false);
  const [openPaymentRejectDialog, setPaymentRejectDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

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
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.event_name,
        {
          id: "event_name",
          header: "Event Name",
        }
      ),

      columnHelper.accessor((tableField) => tableField?.user?.name, {
        id: "user",
        header: "User Name",
      }),
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.activity?.name,
        {
          id: "activity",
          header: "Activity Type",
        }
      ),
      columnHelper.accessor(
        (tableField) =>
          moment(tableField?.payment?.payment_date || "").format("DD MMM YYYY"),
        {
          id: "payment_date",
          header: "Payment Date",
        }
      ),
      columnHelper.accessor(
        (tableField) => tableField?.payment?.mobile_number,
        {
          id: "mobile_number",
          header: "Mobile No",
        }
      ),
      columnHelper.accessor(
        (tableField) =>
          tableField?.payment?.payment_method
            .replace(/_/g, " ")
            .charAt(0)
            .toUpperCase() +
          tableField?.payment?.payment_method.replace(/_/g, " ").slice(1),
        {
          id: "payment_method",
          header: "Payment Type",
        }
      ),
      columnHelper.accessor(
        (tableField) => tableField?.payment?.transaction_id,
        {
          id: "transaction_id",
          header: "Transaction Id",
        }
      ),
      columnHelper.accessor((tableField) => tableField?.payment?.amount, {
        id: "amount",
        header: "Amount",
      }),
      // columnHelper.accessor((tableField) => tableField?.payment_status === 1 ? "Paid" :
      //     tableField?.payment_status === 0 ? "Pending" : "Unknown", {
      //     id: "payment_status",
      //     header: "Payment Status",
      // }),
      columnHelper.accessor((tableField) => tableField?.payment?.amount, {
        id: "payment_status",
        header: "Payment Status",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <>
              {viewData?.payment_status === 0 && "Not Paid"}
              {viewData?.payment_status === 1 && "Paid"}
              {viewData?.payment_status === 2 && "Processing"}
              {viewData?.payment_status === 3 && "Rejected"}
            </>
          );
        },
      }),
      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <>
              {row?.original.payment_status === 1 ? (
                <div className="flex justify-left items-center gap-3">
                  <CheckPermission
                    subMod={"applied_user"}
                    permission={"applied_user_view"}
                  >
                    <span className="cursor-pointer">
                      <Eye
                        className="text-[#0E9F6E]"
                        onClick={() => {
                          setSelectedRow(row?.original);
                          setPaymentViewDialog(true);
                        }}
                      />
                    </span>
                    <span className="cursor-pointer">
                      <div className="relative group inline-block">
                        <Icons.history 
                        className="text-white" 
                        onClick={() => {
                          setSelectedRow(row?.original);
                          setHistoryViewDialog(true);
                        }}
                        />
                        <span
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs
                         rounded py-1 px-2 z-10"
                        >
                         History
                        </span>
                      </div>
                    </span>
                  </CheckPermission>
                </div>
              ) : row?.original.payment_status == 3 ? (
                <div className="flex justify-left items-center gap-3">
                  <CheckPermission
                    subMod={"applied_user"}
                    permission={"applied_user_view"}
                  >
                    <span className="cursor-pointer">
                      <Eye
                        className="text-[#0E9F6E]"
                        onClick={() => {
                          setSelectedRow(row?.original);
                          setPaymentRejectViewDialog(true);
                        }}
                      />
                    </span>
                    <span className="cursor-pointer">
                      <div className="relative group inline-block">
                        <Icons.history 
                        className="text-white" 
                        onClick={() => {
                          setSelectedRow(row?.original);
                          setHistoryViewDialog(true);
                        }}
                        />
                        <span
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs
                         rounded py-1 px-2 z-10"
                        >
                          History
                        </span>
                      </div>
                    </span>
                  </CheckPermission>
                </div>
              ) : (
                <div className="flex justify-left items-center">
                  {/*{viewData.payment_status === 0 && (*/}
                  <div className="flex justify-left items-center">
                    <CheckPermission
                      subMod={"applied_user"}
                      permission={"applied_user_confirm"}
                    >
                      <span className="cursor-pointer flex gap-5">
                        <Button
                          className="font-bold text-primary border-primary border"
                          onClick={() => {
                            setSelectedRow(row?.original);
                            setPaymentConfirmDialog(true);
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          className="font-bold text-white p-4 bg-red-600"
                          onClick={() => {
                            setSelectedRow(row?.original);
                            setPaymentRejectDialog(true);
                          }}
                        >
                          Reject
                        </Button>
                      </span>
                    </CheckPermission>
                  </div>
                  {/*)}*/}
                </div>
              )}
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
          <h1 className="font-bold text-[25px]">Payment List</h1>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Search />
        </div>
      </div>
      <ReactTable
        dataSource={listQuery}
        columns={columns}
        isLoading={isLoading}
      />
      <CheckPermission subMod={"applied_user"} permission={"applied_user_view"}>
        {/* Single Payment View  */}
        <SinglePaymentView
          open={openPaymentViewDialog}
          onClose={() => setPaymentViewDialog(false)}
          singlePaymentValues={selectedRow}
        />

        {/* History View */}
        <SingleHistoryView
          open={openHistoryViewDialog}
          onClose={() => setHistoryViewDialog(false)}
          singlePaymentValues={selectedRow}
        />

        {/* Reject View */}
        <SinglePaymentRejectView
          open={openPaymentRejectViewDialog}
          onClose={() => setPaymentRejectViewDialog(false)}
          singlePaymentValues={selectedRow}
        />
      </CheckPermission>
      <CheckPermission
        subMod={"applied_user"}
        permission={"applied_user_confirm"}
      >
        {/* payment Confirm View */}
        <PaymentConfirmView
          open={openPaymentConfirmDialog}
          onClose={() => setPaymentConfirmDialog(false)}
          singlePaymentValues={selectedRow}
        />
        {/* Payment Reject View */}
        <PaymentRejectView
          open={openPaymentRejectDialog}
          onClose={() => setPaymentRejectDialog(false)}
          singlePaymentValues={selectedRow}
        />
      </CheckPermission>
    </>
  );
};

export default PaymentListApplyUser;
