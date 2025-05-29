"use client";

import ReactTable from "@/components/common/ReactTable/ReactTable";
import SwitchButton from "@/components/common/ReactTable/switchButton/SwitchButton";
import Search from "@/components/common/Search/Search";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import CheckPermission from "@/components/common/pipe/roleChecker";
import { IndexSerial } from "@/components/common/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  useChangeSliderStatusMutation,
  useGetSliderPaginationQuery,
  useSliderDeleteMutation,
} from "@/store/features/portalManagement/slider";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const columnHelper = createColumnHelper<any>();

const SliderComponent = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const paramsValue = {
    ...params,
    searchData: `${[[`${filterSearchText && filterSearchText}`]]}`,
  };

  const {
    data: listQuery,
    refetch,
    isLoading,
  } = useGetSliderPaginationQuery(paramsValue);

  const [ChangeStatus] = useChangeSliderStatusMutation();
  const [deleteSlider] = useSliderDeleteMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteSlider(id).unwrap();
      refetch();
    } catch (error) {
    }
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

      columnHelper.accessor((tableField) => tableField.image_path, {
        id: "image_path",
        header: "Image",
        cell: ({ row }: any) => {
          const viewImg = row?.original || {};
          return (
            <div className="flex">
              <div className="mr-2">
                {viewImg.image_path ? (
                  <Image
                    src={`${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL
                      }${viewImg?.image_path}`}
                    className="rounded w-[100px] h-[60px] object-contain"
                    width={60}
                    height={60}
                    alt={viewImg?.full_name_eng || "No Image"}
                  />
                ) : (
                  <Image
                    src={`/assets/Image/dummy-image.jpg`}
                    className="rounded w-[60px] h-[60px]"
                    width={60}
                    height={60}
                    alt={viewImg?.image || "No Image"}
                  />
                )}
              </div>
              <div>{row.original.full_name_eng}</div>
            </div>
          );
        },
      }),

      columnHelper.accessor((tableField) => tableField?.title, {
        id: "name",
        header: "Title",
      }),

      // columnHelper.accessor((tableField) => tableField?.hyperlink, {
      //   id: "hyperlink",
      //   header: "HyperLink",
      // }),
      // columnHelper.accessor((tableField) => tableField?.source, {
      //   id: "source",
      //   header: "Source",
      // }),

      columnHelper.accessor(() => "", {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => {
          const viewData = row?.original;
          return (
            <div className=" flex justify-left space-x-3">
              <CheckPermission subMod={'slider'} permission={'slider_edit'}>
                <SwitchButton
                  updateAPI={ChangeStatus}
                  data={{
                    ...row?.original,
                    id: row?.original.id,
                  }}
                />
              </CheckPermission>
              <CheckPermission subMod={'slider'} permission={'slider_edit'}>

                <span className="cursor-pointer">
                  <Link
                    href={`/admin/portal-management/slider/slider-create/${viewData?.id}/edit`}
                  >
                    <Icons.edit onClick={() => editData(viewData)} />
                  </Link>
                </span>
              </CheckPermission>
              <CheckPermission subMod={'slider'} permission={'slider_delete'}>

                <span
                  className="cursor-pointer"
                  onClick={() => handleDelete(row.original.id)}
                >
                  <Icons.delete />
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
    <>
      <div className="">
        <div className="sm:block lg:grid lg:grid-cols-12 ">
          <div className="sm:col-span-12 lg:col-span-6">
            <h1 className="font-bold text-[25px] text-nowrap">Slider List</h1>
          </div>
          <div className="sm:col-span-12 lg:col-span-6">
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-12 md:col-span-10">
                <Search />
              </div>
              <CheckPermission subMod={'slider'} permission={'slider_add'}>
                <div className="col-span-12 md:col-span-2 py-5 ">
                  <Link href="/admin/portal-management/slider/slider-create">
                    <Button className="font-bold border bg-[#0CB04D] rounded-lg text-white  flex items-center gap-2 hover:text-white hover:bg-[#0CB04D]">
                      <Icons.plus size={15} />
                      Create Slider
                    </Button>
                  </Link>
                </div>
              </CheckPermission>
            </div>
          </div>
        </div>
        <CheckPermission subMod={'slider'} permission={'slider_list'}>

          <ReactTable dataSource={listQuery} columns={columns} isLoading={isLoading} />
        </CheckPermission>
      </div>
    </>
  );
};

export default SliderComponent;
