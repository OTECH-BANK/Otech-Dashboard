"use client"
import React, { useEffect, useRef, useState } from "react"
import { RxCaretSort, RxDotsVertical } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { useRouter } from "next/navigation"
import ExportIcon from "public/export-icon"
import EmptyState from "public/empty-state"
import { ButtonModule } from "components/ui/Button/Button"
import { SearchModule } from "components/ui/Search/search-module"
import { Customer, useGetCustomersQuery } from "lib/redux/otechplusApi"

type SortOrder = "asc" | "desc" | null

interface ActionDropdownProps {
  customer: Customer
  onViewDetails: (customer: Customer) => void
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ customer, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.setItem("selectedCustomer", JSON.stringify(customer))
    onViewDetails(customer)
    setIsOpen(false)
    router.push(`/otech-plus/customers/${customer.id}`)
  }

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
              href={`/otech-plus/customers/${customer.id}`}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleViewDetails}
            >
              View Details
            </a>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Freeze customer:", customer.id)
                setIsOpen(false)
              }}
            >
              Freeze Account
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Delete customer:", customer.id)
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

const LoadingSkeleton = () => {
  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      {/* Header Skeleton */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-3 flex gap-4 md:mt-0">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
        <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {[...Array(8)].map((_, i) => (
                <th key={i} className="whitespace-nowrap border-b p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(8)].map((_, cellIndex) => (
                  <td key={cellIndex} className="whitespace-nowrap border-b px-4 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AllCustomersTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Fetch customers using RTK Query from otectplusApi
  const {
    data: customersResponse,
    isLoading,
    isError,
  } = useGetCustomersQuery({
    pageNumber: currentPage,
    pageSize: pageSize,
  })

  const customers = customersResponse?.data || []
  const totalCount = customersResponse?.totalCount || 0

  // State & Handlers for modals
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCustomerDetailModalOpen, setIsCustomerDetailModalOpen] = useState(false)

  const getStatusStyle = (statusValue: number) => {
    return statusValue === 1
      ? { backgroundColor: "#EEF5F0", color: "#589E67" }
      : { backgroundColor: "#F7EDED", color: "#AF4B4B" }
  }

  const toggleSort = (column: string) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) => {
      if (value === null || value === undefined) return false
      if (typeof value === "object") return false // Skip nested objects
      return String(value).toLowerCase().includes(searchText.toLowerCase())
    })
  )

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
        <div className="text-center">
          <EmptyState />
          <p className="text-xl font-bold text-[#D82E2E]">Failed to load customers.</p>
          <p>Please refresh or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      {/* Header */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Customers</p>
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
            onClick={() => alert("Export clicked!")}
          >
            <p className="max-sm:hidden">Export</p>
          </ButtonModule>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">No customers found.</p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("id")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Customer ID <RxCaretSort />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("firstName")}
                  >
                    <div className="flex items-center gap-2">
                      Customer Name <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("phoneNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Phone <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Level</div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Points</div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {customer.id}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          {customer.firstName?.charAt(0)}
                          {customer.lastName?.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-0">
                          <p className="m-0 inline-block leading-none text-[#202B3C]">
                            {customer.firstName || customer.lastName
                              ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.email || "N/A"}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.phoneNumber || "N/A"}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.level?.label || "N/A"}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div
                        style={getStatusStyle(customer.status?.value || 0)}
                        className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: customer.status?.value === 1 ? "#589E67" : "#AF4B4B" }}
                        ></span>
                        {customer.status?.label || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.point || 0}</td>
                    <td className="whitespace-nowrap border-b px-4 py-1 text-sm">
                      <ActionDropdown
                        customer={customer}
                        onViewDetails={(cust) => {
                          setSelectedCustomer(cust)
                          setIsCustomerDetailModalOpen(true)
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of{" "}
              {totalCount} entries
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
              {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, index) => (
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
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  currentPage === Math.ceil(totalCount / pageSize)
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
    </div>
  )
}

export default AllCustomersTable
