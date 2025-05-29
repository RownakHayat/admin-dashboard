"use client";

import ReactTable from "@/components/common/ReactTable/ReactTable";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { IndexSerial } from "@/components/common/utils";
import { Icons } from "@/components/icons";
import { useGetChatbotPaginationQuery } from "@/store/features/configuration/chatbot";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import ChatbotForm from "./form/chatbotForm";
import CheckPermission from "@/components/common/pipe/roleChecker";

const columnHelper = createColumnHelper<any>();
const ChatbotComponent = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const paramsValue = {
    ...params,
    searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
  };

  const {
    data: listQuery,
    refetch,
    isLoading,
  } = useGetChatbotPaginationQuery(paramsValue);

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

      columnHelper.accessor((tableField) => tableField?.name, {
        id: "name",
        header: "Activity Name ( English )",
      }),
      columnHelper.accessor((tableField) => tableField?.assigned_staffs, {
        id: "name_bn",
        header: "Assigned Officials",
          cell: (info) => (
              <div>
                  {info.getValue()?.map((staff:any) => (
                      <span key={staff.user.id} style={{ marginRight: "10px" }}>
                        [ {staff.user.name} ]
                    </span>
                  ))}
              </div>
          ),
      }),

      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          return (
            <div className=" flex justify-left space-x-3">
                <CheckPermission subMod={'configure_helpdesk'} permission={'configure_helpdesk_edit'}>
                  <span className="cursor-pointer">
                    <Icons.edit
                      onClick={() =>
                        editData({
                          ...row.original,
                        })
                      }
                    />
                  </span>
                </CheckPermission>
            </div>
          );
        },
      }),
    ],
    [params, listQuery]
  );

  return (
    <div className="w-full">
      <ChatbotForm refetch={refetch} />
      <div>
        <Search name="type_name" />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
          <CheckPermission subMod={'configure_helpdesk'} permission={'configure_helpdesk_list'}>

          <ReactTable dataSource={listQuery || []} columns={columns} />
          </CheckPermission>
      )}
    </div>
  );
};

export default ChatbotComponent;
