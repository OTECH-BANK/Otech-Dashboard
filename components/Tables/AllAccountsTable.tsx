"use client"

import React, { useEffect, useRef, useState } from "react"
import { RxCaretSort, RxDotsVertical } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import OutgoingIcon from "public/outgoing-icon"
import IncomingIcon from "public/incoming-icon"
import { ButtonModule } from "components/ui/Button/Button"
import ExportIcon from "public/export-icon"
import { SearchModule } from "components/ui/Search/search-module"
import { getBankLogo } from "components/ui/BanksLogo/bank-logo"
import EmptyState from "public/empty-state"
import TransactionDetailModal, { Account, Order } from "components/ui/Modal/transaction-detail-modal"
import { accountsData } from "utils"

type SortOrder = "asc" | "desc" | null

interface ActionDropdownProps {
  account: Account
  onViewDetails: (account: Account) => void
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ account, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="focus::bg-gray-100 flex h-7 w-7 cursor-pointer items-center justify-center gap-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <RxDotsVertical />
      </div>
      {isOpen && (
        <div className="absolute right-0 z-[1000] mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <a
              href="/customers/customer-detail"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onViewDetails(account)
                setIsOpen(false)
              }}
            >
              View Details
            </a>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Edit order:", account.accountId)
                setIsOpen(false)
              }}
            >
              Freeze Account
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Delete order:", account.accountId)
                setIsOpen(false)
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const AllTransactionTable = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<Account[]>(accountsData)

  // State to handle modal for transaction details
  const [selectedOrder, setSelectedOrder] = useState<Account | null>(null)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)

  const getPaymentStyle = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Paid":
      case "Completed":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "Pending":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "Not Paid":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      case "Confirmed":
        return { backgroundColor: "#EDF2FE", color: "#4976F4" }
      case "Reverted":
        return { backgroundColor: "#F4EDF7", color: "#954BAF" }
      case "Cancelled":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      default:
        return {}
    }
  }

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "Outgoing":
        return <OutgoingIcon className="size-2 rounded-full" />
      case "Incoming":
        return <IncomingIcon className="size-2 rounded-full" />
      default:
        return <span className="size-2 rounded-full" />
    }
  }

  const dotStyle = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Paid":
      case "Completed":
        return { backgroundColor: "#589E67" }
      case "Pending":
        return { backgroundColor: "#D28E3D" }
      case "Not Paid":
      case "Cancelled":
        return { backgroundColor: "#AF4B4B" }
      case "Confirmed":
        return { backgroundColor: "#4976F4" }
      case "Reverted":
        return { backgroundColor: "#954BAF" }
      default:
        return {}
    }
  }

  const toggleSort = (column: keyof Account) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)

    const sortedOrders = [...orders].sort((a, b) => {
      if (a[column] < b[column]) return isAscending ? 1 : -1
      if (a[column] > b[column]) return isAscending ? -1 : 1
      return 0
    })

    setOrders(sortedOrders)
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const filteredOrders = orders.filter((account) =>
    Object.values(account).some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchText.toLowerCase())
    })
  )

  const itemsPerPage = 10
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const BankLogo = ({ bankName }: { bankName: string }) => {
    const logo = getBankLogo(bankName)
    if (!logo) {
      return (
        <div className="flex items-center gap-2">
          <img src="/DashboardImages/Package.png" alt="Default bank" className="icon-style h-5 w-5" />
          <img src="/DashboardImages/Package-dark.png" alt="Default bank dark" className="dark-icon-style h-5 w-5" />
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        <img src={logo.light} alt={logo.alt} className="icon-style h-5 w-5" />
        {logo.dark && <img src={logo.dark} alt={logo.alt} className="dark-icon-style h-5 w-5" />}
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b py-4">
        <p className="text-2xl font-medium">All Accounts</p>
        <div className="flex gap-4">
          <SearchModule
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onCancel={handleCancelSearch}
          />
          <ButtonModule
            variant="black"
            size="md"
            icon={<ExportIcon />}
            iconPosition="end"
            onClick={() => alert("Button clicked!")}
          >
            Export
          </ButtonModule>
        </div>
      </div>

      {error ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <div className="text-center">
            <EmptyState />
            <p className="text-xl font-bold text-[#D82E2E]">Failed to load transactions.</p>
            <p>Please refresh or try again later.</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">No transactions found.</p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("accountId")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Account ID <RxCaretSort />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("customer")}
                  >
                    <div className="flex items-center gap-2">
                      Account Name <RxCaretSort />
                    </div>
                  </th>

                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("accountNo")}
                  >
                    <div className="flex items-center gap-2">
                      Account Number <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("accountBalance")}
                  >
                    <div className="flex items-center gap-2">
                      Account Balance <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("points")}
                  >
                    <div className="flex items-center gap-2">
                      Points <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("dateCreated")}
                  >
                    <div className="flex items-center gap-2">
                      Status <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date Created <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {order.accountId}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          <p>RB</p>
                        </div>
                        <div className="flex flex-col gap-0">
                          <p className="m-0 inline-block  leading-none text-[#202B3C]">{order.customer}</p>
                          <small className="text-grey-400 m-0 inline-block text-sm leading-none">{order.gmail}</small>
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center gap-2 whitespace-nowrap border-b px-4 py-2 text-sm">
                      <img src="/card-sm-1.png" alt="" className=" w-12" />
                      <div className="flex flex-col  gap-0">
                        <p className="m-0 inline-block font-bold leading-none text-[#202B3C]">{order.accountNo}</p>
                        <small className="text-grey-400 m-0 inline-block text-sm leading-none">
                          {order.accountType}
                        </small>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-grey-400">NGN</span>
                        {order.accountBalance}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div className="flex items-center justify-center gap-1 rounded-full px-2 py-1">
                          {order.points}
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div
                          style={getPaymentStyle(order.accountStatus)}
                          className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                        >
                          <span className="size-2 rounded-full" style={dotStyle(order.accountStatus)}></span>
                          {order.accountStatus}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <img src="/DashboardImages/Calendar.png" alt="dekalo" />
                        {order.date}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-1 text-sm">
                      <ActionDropdown
                        account={order}
                        onViewDetails={(account) => {
                          setSelectedOrder(account)
                          setIsOrderDetailModalOpen(true)
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  currentPage === 1 ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <MdOutlineArrowBackIosNew />
              </button>
              {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    currentPage === index + 1 ? "bg-primary text-black" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <MdOutlineArrowForwardIos />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Transaction Detail Modal
      <TransactionDetailModal
        isOpen={isOrderDetailModalOpen}
        order={selectedOrder} 
        onRequestClose={() => {
          setIsOrderDetailModalOpen(false)
          setSelectedOrder(null)
        }}
      /> */}
    </div>
  )
}

export default AllTransactionTable
