import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import * as Dialog from "@radix-ui/react-dialog";
import { Icons } from "@/components/icons";
import FeedbackView from "@/components/Pages/Feedback/FeedbackView/FeedbackView";
import { useGetFeedbackUserListQuery } from "@/store/features/feedbackManagement";
import { IndexSerial } from "@/store/utils";
import { Cross2Icon } from "@radix-ui/react-icons"
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import FeedbackDescription from "../FeedbackDescription/FeedbackDescription";

const columnHelper = createColumnHelper<any>()

const FeedbackUserList = ({ open, viewData, setOpen }: any) => {

  const {
    params,
    filterSearchText,
  } = useFormSetting()

  const { data: listQuery, refetch, isLoading } = useGetFeedbackUserListQuery({ id: viewData?.id }, {
    skip:
      viewData?.id == "" ||
      viewData?.id == undefined,
  })

  const [selectedData, setSelectedData] = useState<any>(null)
  const [openNewEntry, setOpenNewEntry] = useState(false)

  const handleFeedbackDescriptionDialog = (data: any) => {
    setSelectedData(data)
    setOpenNewEntry(true)
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
          listQuery?.pagination?.total
        )
        return sl
      },
    }),
    columnHelper.accessor((tableField) => tableField?.user?.user_profile?.sme_id, {
      id: "sme_id",
      header: "SME ID",
    }),
    columnHelper.accessor((tableField) => tableField?.user?.name, {
      id: "user",
      header: "User Name",
    }),
    columnHelper.accessor((tableField) => tableField?.subject, {
      id: "subject",
      header: "Subject",
    }),
    columnHelper.accessor((tableField) => "", {
      id: "name",
      header: "Action",
      cell: ({ row }: any) => {
        const viewData = row?.original
        return (
          <>
            <div className="">
              <span className="flex cursor-pointer">
                <Icons.view onClick={() => handleFeedbackDescriptionDialog(viewData)} />
              </span>
            </div>
          </>
        )
      },
    }),

  ], [params, listQuery]);


  return (
    <>
      <Dialog.Root open={open && viewData} onOpenChange={setOpen}>
        <Dialog.Portal >
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="bg-white data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%] max-h-[85vh] w-[94vw] lg:w-[70vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title>
              <p className='text-[#4B5563] text-[18px] font-[500] my-3'></p>
            </Dialog.Title>
            <div className=''>
              <ReactTable dataSource={listQuery} columns={columns} />
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
      <FeedbackDescription open={openNewEntry} setOpen={setOpenNewEntry} id={selectedData?.id} data={selectedData} refetch={refetch} />
    </>
  )
}

export default FeedbackUserList
