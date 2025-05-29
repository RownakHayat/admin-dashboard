import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import ReactTable from "@/components/common/ReactTable/ReactTable";
import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGetSpecificSurveyParticipateListQuery } from "@/store/features/surveyManagement/surveyDataList";
import { IndexSerial } from "@/store/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useMemo } from "react";
import AnswerView from "./AnswerView";


const columnHelper = createColumnHelper<any>()

const ParticipateView = ({ id }: any) => {

    const {
        params,
        editData,
        filterSearchText,
        searchField
    } = useFormSetting()

    const {
        data: listQuery,
        isLoading,
        isError,
        refetch
    } = useGetSpecificSurveyParticipateListQuery({ ...params, id })


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
        columnHelper.accessor((tableField) => "", {
            id: "name",
            header: "Name",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        {viewData?.user?.name}
                    </>
                )
            },
        }),
        columnHelper.accessor((tableField) => "", {
            id: "mobile",
            header: "Mobile",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        {viewData?.user?.mobile}
                    </>
                )
            },
        }),
        columnHelper.accessor((tableField) => "", {
            id: "email",
            header: "Email",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        {viewData?.user?.email}
                    </>
                )
            },
        }),
        columnHelper.accessor((tableField) => "", {
            id: "action",
            header: "Action",
            cell: ({ row }: any) => {
                const viewData = row?.original
                return (
                    <>
                        <div className="flex justify-left items-center">
                            <DG>
                                <DialogTrigger>
                                    <div className="text-center cursor-pointer">
                                        <div className="text-blue-600 font-bold">
                                            <Eye
                                                className="text-[#0E9F6E]"
                                            />
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-[65%] w-[100%] overflow-y-scroll  h-[80%] ">
                                    <div className=''>
                                        {/* <Dialog.Close asChild>
                                            <button
                                                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                                                aria-label="Close"
                                            >
                                                <Cross2Icon />
                                            </button>
                                        </Dialog.Close> */}
                                        <AnswerView id={viewData.id} />
                                    </div>
                                </DialogContent>
                            </DG>
                        </div>
                    </>
                )
            },
        }),
    ], [params, listQuery]);


    return (
        <>
            <div className='p-1'>
                <h1 className="text-2xl font-medium my-2">Survey Participant List</h1>
                <ReactTable dataSource={listQuery} columns={columns} paginationOff={false} />


            </div>
        </>
    )
}
export default ParticipateView
