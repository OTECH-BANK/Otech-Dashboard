"use client"

import React, { useState } from "react"
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
  MdOutlineCheckBoxOutlineBlank,
  MdRefresh,
} from "react-icons/md"
import { RxCaretSort } from "react-icons/rx"
import OutgoingIcon from "public/outgoing-icon"
import IncomingIcon from "public/incoming-icon"
import { ButtonModule } from "components/ui/Button/Button"
import ExportIcon from "public/export-icon"
import { SearchModule } from "components/ui/Search/search-module"
import EmptyState from "public/empty-state"
import TransactionDetailModal from "components/ui/Modal/transaction-detail-modal"
import DeleteModal from "components/ui/Modal/delete-modal"
import { useGetTransactionsByDateRangeQuery } from "lib/redux/transactionApi"

type SortOrder = "asc" | "desc" | null

export type Order = {
  transactionID: number
  orderId: string
  customer: string
  beneficiary: string
  bank: string
  type: string
  payment70: string
  orderStatus: string
  date: string
}

const SkeletonRow = () => {
  return (
    <tr>
      {[...Array(9)].map((_, index) => (
        <td key={index} className="whitespace-nowrap border-b p-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
        </td>
      ))}
    </tr>
  )
}

const AllTransactionTable: React.FC = () => {
  // Default values for reset
  const DEFAULT_ITEMS_PER_PAGE = 10
  const DEFAULT_SORT_COLUMN = null
  const DEFAULT_SORT_ORDER = null
  const DEFAULT_CURRENT_PAGE = 1
  const DEFAULT_SEARCH_TEXT = ""

  const [sortColumn, setSortColumn] = useState<string | null>(DEFAULT_SORT_COLUMN)
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER)
  const [searchText, setSearchText] = useState(DEFAULT_SEARCH_TEXT)
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)
  const itemsPerPageOptions = [10, 25, 50, 100, 200, 500, 1000]
  const [refreshKey, setRefreshKey] = useState(0)

  // Date range state - fixed initialization
  const getDefaultStartDate = (): string => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    const isoDate = date.toISOString().split("T")[0]
    return isoDate ? isoDate : new Date().toISOString().split("T")[0]!
  }

  const [startDate, setStartDate] = useState<string>(getDefaultStartDate())
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0] || "")

  // Track which transactionID we clicked "View Details" on
  const [selectedTransactionID, setSelectedTransactionID] = useState<number | null>(null)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Format date for API (MM/DD/YYYY)
  const formatDateForAPI = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()
      return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`
    } catch {
      // Fallback to current date if parsing fails
      const date = new Date()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()
      return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`
    }
  }

  // Fetch transactions by date range
  const { data, error, isLoading, refetch } = useGetTransactionsByDateRangeQuery(
    {
      startDate: formatDateForAPI(startDate),
      endDate: formatDateForAPI(endDate),
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
    {
      // Force refetch when refreshKey changes
      refetchOnMountOrArgChange: true,
    }
  )

  // Function to handle full refresh and reset to default state
  const handleFullRefresh = () => {
    setIsRefreshing(true)
    // Reset all filters and pagination to default
    setCurrentPage(DEFAULT_CURRENT_PAGE)
    setItemsPerPage(DEFAULT_ITEMS_PER_PAGE)
    setSortColumn(DEFAULT_SORT_COLUMN)
    setSortOrder(DEFAULT_SORT_ORDER)
    setSearchText(DEFAULT_SEARCH_TEXT)
    setStartDate(getDefaultStartDate())
    setEndDate(new Date().toISOString().split("T")[0] || "")

    // Force complete reload by changing the refresh key
    setRefreshKey((prev) => prev + 1)
    // Also trigger a manual refetch
    refetch().finally(() => setIsRefreshing(false))
  }

  // Convert API's Transaction shape into our "Order" for listing
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "Pending"
      case 2:
        return "Processing"
      case 3:
        return "Completed"
      case 4:
        return "Failed"
      case 5:
        return "Reversed"
      default:
        return "Unknown"
    }
  }

  const transformTransactionToOrder = (transaction: any): Order => {
    return {
      transactionID: transaction.transactionID,
      orderId: transaction.transactionReference,
      customer: transaction.initiatorAccountName,
      beneficiary: transaction.beneficiaryAccountName,
      bank: transaction.beneficiaryIssuerCode,
      type: transaction.transactionType === "DR" ? "Outgoing" : "Incoming",
      payment70: String(transaction.transactionAmount),
      orderStatus: getStatusText(transaction.transactionStatus),
      date: new Date(transaction.transactionDate).toLocaleDateString(),
    }
  }

  // Helper function to get first letter of name
  const getInitial = (name: string): string => {
    if (!name || name.length === 0) return ""
    return name.charAt(0).toUpperCase()
  }

  const getPaymentStyle = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Completed":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "Pending":
      case "Processing":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "Failed":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      case "Reversed":
        return { backgroundColor: "#F4EDF7", color: "#954BAF" }
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
      case "Completed":
        return { backgroundColor: "#589E67" }
      case "Pending":
      case "Processing":
        return { backgroundColor: "#D28E3D" }
      case "Failed":
        return { backgroundColor: "#AF4B4B" }
      case "Reversed":
        return { backgroundColor: "#954BAF" }
      default:
        return {}
    }
  }

  const toggleSort = (column: keyof Order) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (reason: string) => {
    setIsDeleting(true)
    try {
      console.log("Deleting transaction:", orderToDelete?.orderId, "Reason:", reason)
      setIsDeleteModalOpen(false)
      setOrderToDelete(null)
      // Refresh after delete
      handleFullRefresh()
    } catch (error) {
      console.error("Error deleting transaction:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    if (newStartDate > endDate) {
      setEndDate(newStartDate)
    }
    setCurrentPage(1)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    if (newEndDate < startDate) {
      setStartDate(newEndDate)
    }
    setCurrentPage(1)
  }

  const handleApplyDateRange = () => {
    refetch()
  }

  const handleResetDateRange = () => {
    setStartDate(getDefaultStartDate())
    setEndDate(new Date().toISOString().split("T")[0] || "")
    setCurrentPage(1)
    refetch()
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
    refetch()
  }

  // Function to export data to CSV
  const exportToCSV = () => {
    if (!data?.data) return

    // Transform the data to CSV format
    const headers = ["Reference ID", "Sender", "Recipient", "Receiving Bank", "Type", "Amount", "Status", "Date"]

    const rows = data.data.map((transaction: any) => {
      const order = transformTransactionToOrder(transaction)
      return [
        `"${order.orderId}"`,
        `"${order.customer}"`,
        `"${order.beneficiary}"`,
        `"${order.bank}"`,
        `"${order.type}"`,
        `"NGN ${order.payment70}"`,
        `"${order.orderStatus}"`,
        `"${order.date}"`,
      ].join(",")
    })

    const csvContent = [headers.join(","), ...rows].join("\n")

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `transactions_${startDate}_to_${endDate}.csv`)
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Filter, sort, and paginate
  const orders: Order[] = data?.data
    ? data.data.map(transformTransactionToOrder).filter((order: Order) => {
        return Object.values(order).some((value) => {
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchText.toLowerCase())
        })
      })
    : []

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading || isRefreshing) {
    return (
      <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-3 md:p-5">
        {/* Header Skeleton */}
        <div className="items-center justify-between border-b py-2 md:flex md:py-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="mt-3 flex gap-4 md:mt-0">
            <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
          <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                {[...Array(9)].map((_, index) => (
                  <th key={index} className="whitespace-nowrap border-b p-4">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex animate-pulse items-center justify-between border-t px-4 py-3">
          <div className="h-4 w-48 rounded bg-gray-200"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-7 w-7 rounded-full bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-3 md:p-5">
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <div className="flex flex-col items-center justify-center text-center">
            <EmptyState />
            <p className="text-xl font-bold text-[#D82E2E]">Failed to load transactions.</p>
            <p className="mb-4">Please refresh or try again later.</p>
            <button
              onClick={handleFullRefresh}
              className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-md px-4 py-2 text-white"
            >
              <MdRefresh className={`${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Transactions"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-3 md:p-5">
      {/* Header */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Transactions</p>
        <div className="flex gap-4">
          <SearchModule
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onCancel={handleCancelSearch}
          />
          <ButtonModule variant="black" size="md" icon={<ExportIcon />} iconPosition="end" onClick={exportToCSV}>
            <p className="max-sm:hidden">Export CSV</p>
          </ButtonModule>
          <ButtonModule
            variant="outline"
            size="md"
            icon={<MdRefresh className={`${isRefreshing ? "animate-spin" : ""}`} />}
            onClick={handleFullRefresh}
            disabled={isRefreshing}
          >
            <p className="max-sm:hidden">{isRefreshing ? "Refreshing..." : "Refresh"}</p>
          </ButtonModule>
        </div>
      </div>

      <div className="my-4 flex flex-wrap items-center justify-between gap-4">
        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Date Range:</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                max={endDate}
                className="rounded border p-2 text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                max={new Date().toISOString().split("T")[0]}
                className="rounded border p-2 text-sm"
              />
            </div>
          </div>
          <ButtonModule variant="primary" size="sm" onClick={handleApplyDateRange}>
            Apply
          </ButtonModule>
          <ButtonModule variant="outline" size="sm" onClick={handleResetDateRange}>
            Reset
          </ButtonModule>
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Items per page:</label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="rounded border p-2 text-sm">
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">No transactions found for the selected date range.</p>
          <button
            onClick={handleFullRefresh}
            className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-md px-4 py-2 text-white"
          >
            <MdRefresh className={`${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("orderId")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Reference ID <RxCaretSort />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("customer")}
                  >
                    <div className="flex items-center gap-2">
                      Sender <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("beneficiary")}
                  >
                    <div className="flex items-center gap-2">
                      Recipient <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("bank")}
                  >
                    <div className="flex items-center gap-2">
                      Receiving Bank <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Type <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("payment70")}
                  >
                    <div className="flex items-center gap-2">
                      Amount <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("orderStatus")}
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
                      Date <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {order.orderId}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          <p>{getInitial(order.customer)}</p>
                        </div>
                        {order.customer}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          <p>{getInitial(order.beneficiary)}</p>
                        </div>
                        {order.beneficiary}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">{order.bank}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex items-center gap-2 rounded-full py-1">
                        <TypeIcon type={order.type} />
                        {order.type}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div
                          style={getPaymentStyle(order.orderStatus)}
                          className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                        >
                          <span className="text-grey-400">NGN</span>
                          {order.payment70}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div
                          style={getPaymentStyle(order.orderStatus)}
                          className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                        >
                          <span className="size-2 rounded-full" style={dotStyle(order.orderStatus)}></span>
                          {order.orderStatus}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <img src="/DashboardImages/Calendar.png" alt="calendar" />
                        {order.date}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-1 text-sm">
                      <ButtonModule
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTransactionID(order.transactionID)
                          setIsOrderDetailModalOpen(true)
                        }}
                      >
                        View Detail
                      </ButtonModule>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, data.totalRecords)} of {data.totalRecords} entries
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
                {Array.from({ length: Math.ceil((data?.totalRecords || 0) / itemsPerPage) }).map((_, index) => (
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
                  disabled={currentPage === Math.ceil((data?.totalRecords || 0) / itemsPerPage)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    currentPage === Math.ceil((data?.totalRecords || 0) / itemsPerPage)
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <MdOutlineArrowForwardIos />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={isOrderDetailModalOpen}
        transactionID={selectedTransactionID}
        onRequestClose={() => {
          setIsOrderDetailModalOpen(false)
          setSelectedTransactionID(null)
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false)
          setOrderToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        businessName={orderToDelete?.orderId || "this transaction"}
      />
    </div>
  )
}

export default AllTransactionTable
