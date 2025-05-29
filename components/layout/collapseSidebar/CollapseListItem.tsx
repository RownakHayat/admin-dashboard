import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuItem } from "react-pro-sidebar"

type Props = {
  dataSource: any
}

const CollapseListItem = (props: Props) => {
  const { icon, name, path, color } = props.dataSource || {}
  const pathName = usePathname()

  return (
    <MenuItem
      active={pathName === path}
      style={{ marginTop: ".5rem" }}
      component={<Link href={path} />}
      className={`text-secondary  ${pathName === path ? `bg-[#2e3092] text-white hover:text-textColor rounded hover:bg-primary` : ''}`}
      icon={
        <span
          style={{ backgroundColor: color }}
          className={`flex h-[35px] w-[35px] items-center justify-center rounded-full`}
        >
          {icon}
        </span>
      }
    >
      {name}
    </MenuItem>
  )
}

export default CollapseListItem
