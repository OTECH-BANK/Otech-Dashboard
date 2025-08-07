"use client"
import Link from "next/link"
import React, { useState } from "react"
import { Links } from "./Links"
import { CollapsedLogoIcon, LogoIcon } from "./Icons"

import clsx from "clsx"
import LogoutIcon from "public/logout-icon"
import LogoutModal from "components/ui/Modal/logout-modal"

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleConfirmLogout = () => {
    // TODO: Implement your logout logic (e.g., clear session or call signOut)
    console.log("User logged out")
    setIsLogoutModalOpen(false)
  }

  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(false)}
      className={clsx("sidebar flex h-full flex-col justify-between border-r border-[#E4E4E4] max-sm:hidden", {
        "w-20": isCollapsed,
        "w-64": !isCollapsed,
      })}
    >
      <div className="h-full justify-between border-0 border-red-700 lg:mt-6 lg:h-auto">
        <div className="border-b border-[#E4E4E4] px-7 transition-opacity lg:block">
          <Link href="/">{isCollapsed ? <CollapsedLogoIcon /> : <LogoIcon />}</Link>
        </div>

        <div className="mb-2 h-full border-b border-[#E4E4E4] lg:h-auto lg:space-y-1">
          <Links isCollapsed={isCollapsed} />
        </div>
      </div>
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="my-4 flex h-auto items-center justify-between border-t px-6 pt-4  hover:text-[#f58634]"
      >
        <div className="flex items-center space-x-2  text-[#747A80] ">
          <img src="/DashboardImages/Profile.png" />
          <p className="bottom-bar hidden text-xs font-semibold hover:text-[#f58634] lg:block 2xl:text-base">Log Out</p>
        </div>
        <LogoutIcon />
      </button>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={loading}
      />
    </div>
  )
}

export default SideBar
