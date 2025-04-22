import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import { SearchModule } from "components/ui/Search/search-module"
import UserDropdown from "components/ui/UserDropdown/dropdown-popover"
import NotificationDropdown from "components/ui/UserDropdown/notification-popover"

const DashboardNav = () => {
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  // const isDarkMode = theme === "dark"

  // const toggleTheme = () => {
  //   setTheme(isDarkMode ? "light" : "dark")
  // }

  setTimeout(() => setLoading(false), 3000)

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <>
      <nav className="containerbg hidden border-b px-16 py-4 max-sm:px-3 md:block">
        <div className="flexBetween">
          <SearchModule
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onCancel={handleCancelSearch}
          />
          <div className="flex gap-4">
            <div className="flex content-center items-center justify-center gap-5">
              <NotificationDropdown />
            </div>
            <div className="flex content-center items-center justify-center gap-5">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      <nav className="block border-b bg-[#F2F6FD] px-16 py-4 max-md:px-3 md:hidden">
        <div className="flex items-center justify-between">
          <FormatAlignLeftIcon onClick={toggleNav} style={{ cursor: "pointer" }} />
          <Link href="/" className="content-center">
            <Image src="/AuthImages/amd-logo.png" width={150} height={43} alt="dekalo" />
          </Link>
          <div className="flex h-[50px] items-center justify-center gap-1 rounded-full bg-[#EDF2F7] px-1">
            <Image src="/DashboardImages/User.svg" width={40} height={40} alt="avatar" />
            <Image className="mr-4" src="/DashboardImages/dropdown.svg" width={15.68} height={15.68} alt="dropdown" />
          </div>
        </div>
      </nav>
    </>
  )
}

export default DashboardNav
