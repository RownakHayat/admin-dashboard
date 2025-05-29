"use client";

import ReactTable from "@/components/common/ReactTable/ReactTable";
import SwitchButtonActive from "@/components/common/ReactTable/switchButton/SwitchButtonActive";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { IndexSerial } from "@/components/common/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  useChangeUsersRollStatusMutation,
  useGetUsersRollPaginationQuery
} from "@/store/features/UserManagement/Roll";
import { createColumnHelper } from "@tanstack/react-table";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const columnHelper = createColumnHelper<any>();

const RollComponent = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();
  const [editId, setEditId] = useState(null);
  // const [checkedValues, setCheckedValues] = useState([]);
  // const [updateClicked, setUpdateClicked] = useState(false);

  const paramsValue = {
    ...params,
    searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
  };

  const {
    data: listQuery,
    refetch,
    isLoading,
  } = useGetUsersRollPaginationQuery(paramsValue);
  const [ChangeStatus] = useChangeUsersRollStatusMutation();
  // const [deleteUserRoll] = useChangeUsersRollStatusMutation();



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
        header: "Name",
      }),

      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <div className=" flex justify-left space-x-3">
              <CheckPermission subMod={'role'} permission={'role_status'}>
                <SwitchButtonActive
                  updateAPI={ChangeStatus}
                  data={{
                    ...row?.original,
                    id: row?.original.id,
                  }}
                  title="Change Status"
                />
              </CheckPermission>
              <CheckPermission subMod={'role'} permission={'role_edit'}>
                <span className="cursor-pointer" title="Edit Role">
                  <Link
                    href={`/admin/user-management/role/${viewData?.id}/edit`}
                  >
                    <Icons.edit onClick={() => editData(viewData)} />
                  </Link>
                </span>
              </CheckPermission>
                <CheckPermission subMod={'role'} permission={'role_permission'}>

                  <span className="cursor-pointer" title="Manage Permission">
                    <Link
                      href={`/admin/user-management/role/role-create/${viewData?.id}/permission`}
                    >
                      <Shield className="text-[#0E9F6E]" onClick={() => {
                        setEditId(row?.original?.id);
                      }} />
                    </Link>
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
    <div>
      <div className='flex items-center justify-between flex-wrap '>
        <h1 className='font-bold text-2xl'>Role</h1>
        <div className='flex items-center flex-wrap'>
          <div className=''>
            <Search />
          </div>
          <CheckPermission subMod={'role'} permission={'role_add'}>
            <div>
              <Link href="/admin/user-management/role/role-create">
                <Button className='ml-5  hover:border-primary bg-success hover:bg-success'>
                  Create Role <Icons.plus className='ml-1' size={15} />
                </Button>
              </Link>
            </div>
          </CheckPermission>
        </div>
      </div>
      <CheckPermission subMod={'role'} permission={'role_list'}>
        <ReactTable
          dataSource={listQuery}
          columns={columns}
          isLoading={isLoading}
        />
      </CheckPermission>
    </div>
  );
};

export default RollComponent;
