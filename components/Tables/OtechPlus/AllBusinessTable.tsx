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
import { useGetBusinessesQuery } from "lib/redux/otechplusApi"

type SortOrder = "asc" | "desc" | null

interface Business {
  userId: number
  name: string
  address: string
  logo: string | null
  description: string
  city: string
  province: {
    id: number
    name: string
  } | null
  country: {
    id: number
    name: string
  } | null
  status: {
    label: string
    value: number
  }
  level: {
    label: string
    value: number
  }
  user: {
    id: number
    firstName: string
    lastName: string
    photo: string | null
  }
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
  const [pageSize] = useState(10)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const { data, error, isLoading, refetch } = useGetBusinessesQuery({
    pageNumber: currentPage,
    pageSize: pageSize,
  })

  // Add this effect to refetch data when component mounts
  useEffect(() => {
    refetch()
  }, [refetch])

  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "Inactive":
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
      case "Inactive":
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
        if (typeof value === "object") {
          return Object.values(value).some((nestedValue) => {
            if (nestedValue === null || nestedValue === undefined) return false
            return String(nestedValue).toLowerCase().includes(searchText.toLowerCase())
          })
        }
        return String(value).toLowerCase().includes(searchText.toLowerCase())
      })
    ) || []

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleDisable = async (reason: string) => {
    setIsProcessing(true)
    try {
      // Here you would typically call your API to disable the business
      console.log("Disabling business:", selectedBusiness?.userId, "Reason:", reason)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDisableModalOpen(false)
      refetch()
    } catch (error) {
      console.error("Error disabling business:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (reason: string) => {
    setIsProcessing(true)
    try {
      // Here you would typically call your API to delete the business
      console.log("Deleting business:", selectedBusiness?.userId, "Reason:", reason)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDeleteModalOpen(false)
      refetch()
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
                href={`businesses/${business.userId}`}
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
        {/* Header Skeleton */}
        <div className="items-center justify-between border-b py-2 md:flex md:py-4">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200 max-sm:pb-3"></div>
          <div className="flex gap-4">
            <div className="h-10 w-64 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
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

        {/* Pagination Skeleton */}
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
      {/* Header */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Businesses</p>
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
            <p className="max-sm:hidden">Export</p>
          </ButtonModule>
        </div>
      </div>

      {error ? (
        <div className="flex h-60 flex-col items-center justify-center  bg-[#f9f9f9]">
          <div className="flex flex-col items-center justify-center  text-center">
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
                    onClick={() => toggleSort("userId")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    User ID <RxCaretSort />
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
                    onClick={() => toggleSort("description")}
                  >
                    <div className="flex items-center gap-2">
                      Description <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("address")}
                  >
                    <div className="flex items-center gap-2">
                      Address <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("city")}
                  >
                    <div className="flex items-center gap-2">
                      City <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("user")}
                  >
                    <div className="flex items-center gap-2">
                      Owner <RxCaretSort />
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
                  <tr key={business.userId}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {business.userId}
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
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="max-w-[200px] truncate">{business.description}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="max-w-[150px] truncate">{business.address}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{business.city}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      {business.user.firstName} {business.user.lastName}
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 text-sm">
                      <div className="flex">
                        <div
                          style={getPaymentStyle(business.status.label)}
                          className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                        >
                          <span className="size-2 rounded-full" style={dotStyle(business.status.label)}></span>
                          {business.status.label}
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

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data?.totalCount || 0)} of{" "}
              {data?.totalCount || 0} entries
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
              {Array.from({ length: Math.ceil((data?.totalCount || 0) / pageSize) }).map((_, index) => (
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
                disabled={currentPage === Math.ceil((data?.totalCount || 0) / pageSize)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  currentPage === Math.ceil((data?.totalCount || 0) / pageSize)
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
