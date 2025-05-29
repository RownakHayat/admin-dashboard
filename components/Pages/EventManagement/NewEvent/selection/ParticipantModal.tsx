
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import { IndexSerial } from "@/components/common/utils";
import { useGetEventParticipantListQuery } from "@/store/features/eventManagement/newEvent/selection";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { createColumnHelper } from "@tanstack/react-table";

import { useEffect, useMemo } from "react";


const columnHelper = createColumnHelper<any>()

const ParticipateModal = ({ id, rowData, open, setOpen }: any) => {

  const {
    params,
    editData,
    filterSearchText,
    searchField
  } = useFormSetting()

  const {
    data: listQuery,
    refetch: refetchData,
    isLoading
  } = useGetEventParticipantListQuery(id, {
    skip: id === undefined || id === null,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (listQuery) {
      refetchData();
    }
  }, [listQuery]);


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
    columnHelper.accessor((tableField) => tableField?.event_detail?.program_info?.name_en, {
      id: "name_en",
      header: "Program Name",
    }),
    columnHelper.accessor((tableField) => tableField?.event_detail?.event_name, {
      id: "event_name",
      header: "Event Name",
    }),
    columnHelper.accessor((tableField) => tableField?.application_status, {
      id: "application_status",
      header: "Status",
    }),
  ], [params, listQuery]);


  return (
    <>
      <Dialog.Root open={open && rowData} onOpenChange={setOpen}>
        <Dialog.Portal >
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="bg-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] max-h-min focus:outline-none w-[80%] sm:w-[60%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] overflow-y-scroll">

            <p className="text-center font-medium pb-5">Participant Event list</p>
            <div className="overflow-y-scroll max-h-[60vh]">
              <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
            </div>
            <Dialog.Close asChild>
              <button
                onClick={() => setOpen(!open)}
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

export default ParticipateModal