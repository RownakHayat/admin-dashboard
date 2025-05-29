"use client"

import useLayoutStore from "@/store/zustand/layout"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { MenuItem, SubMenu } from "react-pro-sidebar"

type Props = {
  dataSource: any;
}

const SubListItem = (props: Props) => {
  const { collapse } = useLayoutStore((state: any) => state)
  const { icon, name, child, color, path } = props.dataSource || {}
  const pathName = usePathname()
  const router = useRouter();

  const submenuPath = pathName.split("/").filter(Boolean)
  const activeSubMenu = "/" + submenuPath[0] + "/" + submenuPath[1]

  // const handleClick = (path: any) => {
  //   window.location.pathname = path;
  //   // If you also want to reload the page
  //   window.location.reload();
  // };

  useEffect(() => {
    const handleClick = () => {
      window.location.reload(); // Reload the page when route changes
    }
  });


  return (
    <SubMenu
      defaultOpen={activeSubMenu === path}
      active={activeSubMenu === path}
      label={collapse === true && name}
      className={`text-[#206C6B]  ${activeSubMenu === path ? `bg-[#206C6B] text-white hover:text-white rounded hover:bg-[#206C6B]` : ''}`}
      style={{ marginTop: ".5rem" }}
      icon={
        <span
          style={{ backgroundColor: color }}
          className={`flex h-[35px] w-[35px] items-center justify-center rounded `}
        >
          {icon}
        </span>
      }
    >
      {collapse ? (
        <>
          {child?.map((childItem: any, index: any) => {
            return (
              <MenuItem
                className={`inline-block text-secondary rounded-md mt-2  ${pathName == childItem?.path && " bg-[#206C6B] text-white hover:bg-[#206C6B]"} `}
                active={false}
                key={`${childItem.name}-${index}`}
                component={
                  <Link href={childItem.path} className={`child-menu-button hover:rounded transition ${activeSubMenu == path && 'text-white'}`} />
                }
                icon={""}
              >
                {collapse === true && <p className="pl-3 hover:text-white">{childItem.name}</p>}
              </MenuItem>
            )
          })}
        </>
      ) : (
        <></>
      )}
    </SubMenu>
  )
}

export default SubListItem
