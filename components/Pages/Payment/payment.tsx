"use client";

import SinglePaymentView from "@/components/Pages/Payment/view/SinglePaymentView";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { useGetFinancialYearListQuery } from "@/store/features/financialYear";
import { useGetNewPaymentPaginationQuery } from "@/store/features/payment";
import { IndexSerial } from "@/store/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import moment from "moment";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import SingleHistoryView from "./view/SingleHistoryView";

const columnHelper = createColumnHelper<any>();
const PaymentList = () => {
  const { params, filterSearchText } = useFormSetting();

  const paramss = useParams();
  const id = paramss.id as string;
  const { data: listQuery, isLoading } = useGetNewPaymentPaginationQuery();
  const [userId, setUserId] = useState<any>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [openPaymentViewDialog, setPaymentViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { data: financialYear } = useGetFinancialYearListQuery();
  const [activeTab, setActiveTab] = useState("selection");
  const [openHistoryViewDialog, setHistoryViewDialog] = useState(false);

  const handleTabChange = (tabValue: any) => {
    setActiveTab(tabValue); // Function to update activeTab state
  };

  const handleAllChecked = () => {
    setUserId([]);
    setIsCheckedAll(!isCheckedAll);

    if (isCheckedAll) {
      const checkedAll = listQuery?.data?.map((item: any) => {
        return {
          employee_id: item?.id,
          status: 0,
        };
      });
      setUserId(checkedAll);
    } else {
      const checkedAll = listQuery?.data?.map((item: any) => {
        return {
          employee_id: item?.id,
          status: 1,
        };
      });
      setUserId(checkedAll);
    }
  };

  const changeCheckValue = (id: number) => {
    const updatedValue = userId?.map((item: any) => {
      if (item.employee_id === id) {
        return {
          ...item,
          status: item?.status === 1 ? 0 : 1,
        };
      } else {
        return item;
      }
    });
    setUserId(updatedValue);

    const checkvalue = userId?.filter((e: any) => e.status === 1);
    setIsCheckedAll(
      checkvalue?.length === listQuery?.data?.length ? true : false
    );
  };

  const setPaymentView = (values: any) => {
    setPaymentViewDialog(false);
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
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.program_info?.name_en,
        {
          id: "name_en",
          header: "Program Name",
        }
      ),
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.event_name,
        {
          id: "event_name",
          header: "Event Name",
        }
      ),
      columnHelper.accessor(
        (tableField) => tableField?.event_detail?.activity?.name,
        {
          id: "activity_name",
          header: "Activity Type",
        }
      ),
      columnHelper.accessor((tableField) => tableField, {
        id: "payment_date",
        header: "Payment Date",
        cell: ({ row }: any) => {
          const viewData = row?.original || {};
          return <>{moment(viewData?.payment_date).format("DD MMM YYYY")}</>;
        },
      }),
      // columnHelper.accessor((tableField) => tableField?.payment_status === 1 ? "Paid" :
      //   tableField?.payment_status === 0 ? "Pending" : "Unknown", {
      //   id: "payment_status",
      //   header: "Payment Status",
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
              <div className="flex justify-left items-center gap-5">
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
          <h1 className="font-bold text-[25px]">
            Payment
            <span className="text-[15px] bg-[#c2edf1] rounded-lg p-2 ml-3">
              {financialYear?.data[0]}
            </span>
          </h1>
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

      <SinglePaymentView
        open={openPaymentViewDialog}
        onClose={() => setPaymentViewDialog(false)}
        singlePaymentValues={selectedRow}
      />
      <SingleHistoryView
        open={openHistoryViewDialog}
        onClose={() => setHistoryViewDialog(false)}
        singlePaymentValues={selectedRow}
      />
    </>
  );
};

export default PaymentList;
