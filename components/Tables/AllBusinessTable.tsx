"use client"
import React, { useEffect, useRef, useState } from "react"
import { RxCaretSort, RxDotsVertical } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { ButtonModule } from "components/ui/Button/Button"
import ExportIcon from "public/export-icon"
import { SearchModule } from "components/ui/Search/search-module"
import EmptyState from "public/empty-state"
import DisableBusinessModal from "components/ui/Modal/disable-business-modal"
import DeleteModal from "components/ui/Modal/delete-modal"
import { useGetBusinessesQuery } from "lib/redux/api"

type SortOrder = "asc" | "desc" | null

interface Business {
  createBy: string
  businessID: number
  name: string
  brandName: string
  appId: string
  logo: string
  website: string
  callbackUrl: string
  email: string
  hmacKey: string
  apiKeyMask: string
  accountNumber: string | null
  depositFeePercent: number
  depositFeeFlat: number
  depositFeeCap: number
  status?: "Active" | "Disabled" | "Deleted"
  dateCreated: string
}

interface ActionDropdownProps {
  business: Business
  onViewDetails: (business: Business) => void
}

const AllBusinessTable = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const { data, error, isLoading, refetch } = useGetBusinessesQuery({
    pageNumber: currentPage,
    pageSize: pageSize,
  })

  useEffect(() => {
    refetch()
  }, [refetch, pageSize])

  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "Disabled":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "Deleted":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      default:
        return {}
    }
  }

  const dotStyle = (status: string) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#589E67" }
      case "Disabled":
        return { backgroundColor: "#D28E3D" }
      case "Deleted":
        return { backgroundColor: "#AF4B4B" }
      default:
        return {}
    }
  }

  const toggleSort = (column: keyof Business) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const filteredBusinesses =
    data?.data.filter((business) =>
      Object.values(business).some((value) => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchText.toLowerCase())
      })
    ) || []

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const exportToCSV = () => {
    const headers = [
      "Business ID",
      "Name",
      "Brand Name",
      "Website",
      "Callback URL",
      "Email",
      "Status",
      "Account Number",
      "Date Created",
    ]

    const dataRows = filteredBusinesses.map((business) => [
      business.businessID,
      `"${business.name.replace(/"/g, '""')}"`,
      `"${business.brandName.replace(/"/g, '""')}"`,
      business.website,
      business.callbackUrl || "N/A",
      business.email,
      business.status || "Active",
      business.accountNumber || "N/A",
      new Date(business.dateCreated).toLocaleDateString(),
    ])

    const csvContent = [headers.join(","), ...dataRows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `businesses_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDisable = async (reason: string) => {
    setIsProcessing(true)
    try {
      console.log("Disabling business:", selectedBusiness?.businessID, "Reason:", reason)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDisableModalOpen(false)
    } catch (error) {
      console.error("Error disabling business:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (reason: string) => {
    setIsProcessing(true)
    try {
      console.log("Deleting business:", selectedBusiness?.businessID, "Reason:", reason)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting business:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const ActionDropdown: React.FC<ActionDropdownProps> = ({ business, onViewDetails }) => {
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
                href={`businesses/${business.businessID}`}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onViewDetails(business)
                  setIsOpen(false)
                }}
              >
                View Details
              </a>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setSelectedBusiness(business)
                  setIsDisableModalOpen(true)
                  setIsOpen(false)
                }}
              >
                Disable
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setSelectedBusiness(business)
                  setIsDeleteModalOpen(true)
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

  if (isLoading) {
    return (
      <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
        <div className="items-center justify-between border-b py-2 md:flex md:py-4">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200 max-sm:pb-3"></div>
          <div className="flex gap-4">
            <div className="h-10 w-64 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>

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
                      <div
                        className="h-4 animate-pulse rounded bg-gray-200"
                        style={{ width: cellIndex === 1 ? "180px" : "120px" }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-7 animate-pulse rounded-full bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Businesses</p>
        <div className="flex gap-4">
          <SearchModule
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onCancel={handleCancelSearch}
          />
          <ButtonModule variant="black" size="md" icon={<ExportIcon />} iconPosition="end" onClick={exportToCSV}>
            <p className="max-sm:hidden">Export</p>
          </ButtonModule>
        </div>
      </div>

      {error ? (
        <div className="flex h-60 flex-col items-center justify-center bg-[#f9f9f9]">
          <div className="flex flex-col items-center justify-center text-center">
            <EmptyState />
            <p className="mt-2 text-xl font-bold text-[#D82E2E]">Failed to load businesses.</p>
            <p>Please refresh or try again later.</p>
          </div>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">No businesses found.</p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("businessID")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Business ID <RxCaretSort />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Business Name <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("brandName")}
                  >
                    <div className="flex items-center gap-2">
                      Brand Name <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("website")}
                  >
                    <div className="flex items-center gap-2">
                      Website <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("callbackUrl")}
                  >
                    <div className="flex items-center gap-2">
                      Webhook <RxCaretSort />
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
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((business) => (
                  <tr key={business.businessID}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {business.businessID}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {business.logo ? (
                          <img src={business.logo} alt={business.name} className="h-8 w-8 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                            {business.name.charAt(0)}
                          </div>
                        )}
                        <p className="m-0 inline-block leading-none text-[#202B3C]">{business.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{business.brandName}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {business.website}
                      </a>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="max-w-[200px] truncate">{business.callbackUrl || "N/A"}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{business.email}</td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div
                          style={getPaymentStyle(business.status || "Active")}
                          className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                        >
                          <span className="size-2 rounded-full" style={dotStyle(business.status || "Active")}></span>
                          {business.status || "Active"}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-1 text-sm">
                      <ActionDropdown
                        business={business}
                        onViewDetails={(business) => {
                          setSelectedBusiness(business)
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, data?.totalRecords || 0)} of {data?.totalRecords || 0} entries
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
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
              {Array.from({ length: Math.ceil((data?.totalRecords || 0) / pageSize) }).map((_, index) => (
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
                disabled={currentPage === Math.ceil((data?.totalRecords || 0) / pageSize)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  currentPage === Math.ceil((data?.totalRecords || 0) / pageSize)
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

      <DisableBusinessModal
        isOpen={isDisableModalOpen}
        onRequestClose={() => setIsDisableModalOpen(false)}
        onConfirm={handleDisable}
        loading={isProcessing}
        businessName={selectedBusiness?.name || ""}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isProcessing}
        businessName={selectedBusiness?.name || ""}
      />
    </div>
  )
}

export default AllBusinessTable
