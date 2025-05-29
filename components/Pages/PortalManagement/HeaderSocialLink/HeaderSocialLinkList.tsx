"use client";

import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useGetAllHomePageInfoQuery } from "@/store/features/portalManagement/homePageInfo";
import Link from "next/link";

const HeaderSocialLinkList = () => {
  const { params, filterSearchText } = useFormSetting();

  const paramsValue = { ...params, searchData: `${[[`${filterSearchText && filterSearchText}`]]}` };

  const { data: listQuery, refetch, isLoading } = useGetAllHomePageInfoQuery();


  const headerInfoArray = listQuery?.data?.header_info || [];

  return (
    <div className="w-full">
      <table className="w-full bg-white dark:bg-background rounded-lg">
        <thead className="bg-[rgba(12,176,77,0.1)] text-[rgba(12,176,77,0.1)]">
          <tr>
            <th className="px-3 py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">
              NEW TAB / SAME TAB
            </th>
            <th className="px-3 py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">
              Title OF Header Link
            </th>
            <th className="px-3 py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">
              Icon Class OF Header
            </th>
            <th className="px-3 py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">
              Link OF Header Link
            </th>
            <th className="px-3 py-2 text-left w-fit font-[10px] text-gray-600 dark:text-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="mx-4">
          {headerInfoArray.map((headerInfo: any, index: any) => (
            <tr key={headerInfo.id || index}>
              <td className="text-left w-fit text-md">{headerInfo.same_tab}</td>
              <td className="text-left w-fit text-md">{headerInfo.title}</td>
              <td className="text-left w-fit text-md">
                {headerInfo.icon_class && (
                  <img
                    src={`${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${headerInfo.icon_class}`}
                    alt=""
                    className="w-[150px] h-auto max-h-[150px]"
                  />
                )}
              </td>
              <td className="text-left w-fit text-md">{headerInfo.link}</td>
              <td>
                <Link href={`/admin/portal-management/header-social-link/header-social-link-edit/${headerInfo?.id}/edit`}>
                  <Button className="ml-5 text-[#6B6B88] bg-white flex items-center gap-2 hover:bg-white">
                    <Icons.edit />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeaderSocialLinkList;
