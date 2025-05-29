"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuItem, SubMenu } from "react-pro-sidebar"

type Props = {
  dataSource: any
}

const CollapseSubListItem = (props: Props) => {
  const { icon, name, child, color, path } = props.dataSource || {}
  const pathName = usePathname()

  const submenuPath = pathName.split("/").filter(Boolean)
  const activeSubMenu = "/" + submenuPath[0] + "/" + submenuPath[1]

  return (
    <SubMenu
      defaultOpen={activeSubMenu === path}
      active={activeSubMenu === path}
      label={name}
      style={{ marginTop: ".5rem" }}
      className={`text-textColor  ${activeSubMenu === path ? `bg-[#2e3092] hover:bg-primary hover:text-textColor text-white  rounded ` : ''}`}
      icon={
        <span
          style={{ backgroundColor: color }}
          className={`flex h-[35px] w-[35px] items-center justify-center rounded-full`}
        >
          {icon}
        </span>
      }
    >
      {child?.map((childItem: any, index: any) => {
        return (
          <MenuItem
            className={`pl-2 inline-block text-secondary rounded-md mt-2  ${pathName == childItem?.path && "ps-active-child bg-primary text-white hover:text-textColor"
              }`}
            active={false}
            key={`${childItem.name}-${index}`}
            component={
              <Link href={childItem.path} className={`child-menu-button hover:rounded transition ${activeSubMenu == path && 'text-white'}`} />
            }
            icon={""}
          >
            <p className=" pl-3">{childItem.name}</p>
          </MenuItem>
        )
      })}
    </SubMenu>
  )
}

export default CollapseSubListItem
