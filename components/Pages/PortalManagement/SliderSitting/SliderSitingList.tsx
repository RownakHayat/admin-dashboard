"use client";

import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useGetAllHomePageInfoQuery } from "@/store/features/portalManagement/homePageInfo";
import Link from "next/link";
import CheckPermission from "@/components/common/pipe/roleChecker";

const SliderSitingList = () => {
  const { params, editData, filterSearchText, searchField } = useFormSetting();

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` };

  const { data: listQuery, refetch, isLoading } = useGetAllHomePageInfoQuery();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full bg-white dark:bg-background rounded-lg table-auto min-w-[800px]">
        <thead className="bg-[rgba(12,176,77,0.1)] text-[rgba(12,176,77,0.1)]">
          <tr>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Company Name</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Address Title</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Copy Right</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Logo in Base</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Govt. Logo</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Meta Description</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Meta Keywords</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">First Address</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Second Address</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Google Map</th>
            <th className="sm:px-4 lg:px-3 py-2 text-left sm:font-[5%] lg:font-[10px] text-gray-600 dark:text-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.site_title}</td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.address_title}</td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.copy_right}</td>
            <td className="sm:px-4 lg:px-3 ">
              <img
                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${listQuery?.data?.site_info?.site_logo}`}
                alt="Site Logo"
                className="w-[100px] h-auto max-h-[100px]"
              />
            </td>
            <td className="sm:px-4 lg:px-3 ">
              <img
                src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${listQuery?.data?.site_info?.govt_logo}`}
                alt="Government Logo"
                className="w-[100px] h-auto max-h-[100px]"
              />
            </td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.meta_description}</td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.keywords}</td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.address_1}</td>
            <td className="text-left sm:px-4 lg:px-3 sm:text-sm lg:text-md">{listQuery?.data?.site_info?.address_2}</td>
            <td className="text-left sm:px-4 lg:px-3 w-[50px] max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-md">
              {listQuery?.data?.site_info?.map_source}
            </td>
            <td>
              <CheckPermission subMod={'slide_setting'} permission={'slide_setting_edit'}>
                <Link href="/admin/portal-management/slide-setting/slide-setting-edit">
                  <Button className="ml-5 text-[#6B6B88] bg-white flex items-center gap-2 hover:bg-white">
                    <Icons.edit />
                  </Button>
                </Link>
              </CheckPermission>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SliderSitingList;
