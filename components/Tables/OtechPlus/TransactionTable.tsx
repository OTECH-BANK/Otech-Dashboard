"use client"

import React, { useState } from "react"
import { RxCaretSort } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import OutgoingIcon from "public/outgoing-icon"
import IncomingIcon from "public/incoming-icon"
import { ButtonModule } from "components/ui/Button/Button"
import ExportIcon from "public/export-icon"
import { SearchModule } from "components/ui/Search/search-module"
import EmptyState from "public/empty-state"
import DeleteModal from "components/ui/Modal/delete-modal"
import { useRouter } from "next/navigation"
import { useGetTransactionsQuery } from "lib/redux/otechplusApi"
import TransactionDetailModal from "components/ui/Modal/OtechPlus/transaction-detail-modal"

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

const RecentTransactionTable = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  // Modal states
  const [selectedTransactionID, setSelectedTransactionID] = useState<number | null>(null)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch transactions using the API
  const { data, error, isLoading } = useGetTransactionsQuery({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
  })

  // Convert API transaction data to our Order type
  const getStatusText = (status: { value: number }): string => {
    switch (status.value) {
      case 1:
        return "Success"
      case 2:
        return "Pending"
      case 3:
        return "Failed"
      default:
        return "Unknown"
    }
  }

  const getTypeText = (type: { value: number }): string => {
    switch (type.value) {
      case 1:
        return "Deposit"
      case 3:
        return "Payment"
      case 9:
        return "ElectronicLevy"
      default:
        return "Other"
    }
  }

  const transformTransactionToOrder = (transaction: any): Order => {
    const senderName = transaction.senderUser
      ? `${transaction.senderUser.firstName} ${transaction.senderUser.lastName}`
      : "System"

    const receiverName = transaction.recieverUser
      ? `${transaction.recieverUser.firstName} ${transaction.recieverUser.lastName}`
      : "System"

    return {
      transactionID: transaction.id,
      orderId: transaction.reference,
      customer: senderName,
      beneficiary: receiverName,
      bank: transaction.paymentOption || "N/A",
      type: getTypeText(transaction.type),
      payment70: transaction.amount.toLocaleString(),
      orderStatus: getStatusText(transaction.status),
      date: new Date(transaction.createdAT).toLocaleDateString(),
    }
  }

  const orders: Order[] = data?.data ? data.data.map(transformTransactionToOrder) : []

  const getPaymentStyle = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Success":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "Pending":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "Failed":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      default:
        return {}
    }
  }

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "Payment":
        return <OutgoingIcon className="size-2 rounded-full" />
      case "Deposit":
        return <IncomingIcon className="size-2 rounded-full" />
      default:
        return <span className="size-2 rounded-full" />
    }
  }

  const dotStyle = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "Success":
        return { backgroundColor: "#589E67" }
      case "Pending":
        return { backgroundColor: "#D28E3D" }
      case "Failed":
        return { backgroundColor: "#AF4B4B" }
      default:
        return {}
    }
  }

  const toggleSort = (column: keyof Order) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)

    const sortedOrders = [...orders].sort((a, b) => {
      if (a[column] < b[column]) return isAscending ? 1 : -1
      if (a[column] > b[column]) return isAscending ? -1 : 1
      return 0
    })
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsDeleteModalOpen(false)
      setOrderToDelete(null)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedTransactionID(order.transactionID)
    setIsOrderDetailModalOpen(true)
  }

  const handleViewAllTransactions = () => {
    router.push(`/transactions`)
  }

  const exportToCSV = () => {
    if (!orders.length) return

    // Prepare headers
    const headers = ["Reference ID", "Sender", "Recipient", "Receiving Bank", "Type", "Amount", "Status", "Date"]

    // Prepare data rows
    const dataRows = orders.map((order) => [
      order.orderId,
      order.customer,
      order.beneficiary,
      order.bank,
      order.type,
      `NGN ${order.payment70}`,
      order.orderStatus,
      order.date,
    ])

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...dataRows.map((row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchText.toLowerCase())
    })
  )

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
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
                <tr key={index}>
                  {[...Array(9)].map((_, i) => (
                    <td key={i} className="whitespace-nowrap border-b p-4">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                    </td>
                  ))}
                </tr>
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
          <div className="flex w-full flex-col items-center justify-center text-center">
            <EmptyState />
            <p className="text-xl font-bold text-[#D82E2E]">Failed to load transactions.</p>
            <p>Please refresh or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-3 md:p-5">
      {/* Header */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">Recent Transactions</p>
        <div className="flex gap-4">
          <SearchModule
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onCancel={handleCancelSearch}
          />
          <ButtonModule variant="black" size="md" icon={<ExportIcon />} iconPosition="end" onClick={exportToCSV}>
            <p className="max-sm:hidden">Export CSV</p>
          </ButtonModule>
        </div>
      </div>

      {orders.length === 0 ? (
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
                {filteredOrders.map((order, index) => (
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
                          <p>{order.customer.charAt(0)}</p>
                        </div>
                        {order.customer}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          <p>{order.beneficiary.charAt(0)}</p>
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
                      <div className="flex gap-2">
                        <ButtonModule variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                          View
                        </ButtonModule>
                      </div>
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
                {Math.min(currentPage * itemsPerPage, data.totalCount)} of {data.totalCount} entries
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

                {Array.from({ length: Math.ceil(data.totalCount / itemsPerPage) }).map((_, index) => (
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
                  disabled={currentPage === Math.ceil(data.totalCount / itemsPerPage)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    currentPage === Math.ceil(data.totalCount / itemsPerPage)
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

      <TransactionDetailModal
        isOpen={isOrderDetailModalOpen}
        transactionID={selectedTransactionID}
        onRequestClose={() => {
          setIsOrderDetailModalOpen(false)
          setSelectedTransactionID(null)
        }}
      />

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

export default RecentTransactionTable
