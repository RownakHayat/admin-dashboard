import useLayoutStore from "@/store/zustand/layout"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { MenuItem } from "react-pro-sidebar"

type Props = {
  dataSource: any
}

const ListItem = (props: Props) => {
  const { collapse } = useLayoutStore((state: any) => state)
  const { icon, name, path, color } = props.dataSource || {}
  const pathName = usePathname()

  useEffect(() => {
    const handleClick = () => {
      window.location.reload(); // Reload the page when route changes
    }
  });

  return (
    <MenuItem
      active={pathName === path}
      style={{ marginTop: ".5rem" }}
      component={<Link href={path} />}
      className={`text-[#206C6B]  ${pathName === path ? `bg-[#206C6B] text-white hover:text-textColor rounded hover:bg-[#206C6B]` : ''}`}
      icon={
        <span
          style={{ backgroundColor: color }}
          className={`flex h-[35px] w-[35px] items-center justify-center rounded `}
        >
          {icon}
        </span>
      }
    >
      {collapse === true && name}
    </MenuItem>
  )
}

export default ListItem
