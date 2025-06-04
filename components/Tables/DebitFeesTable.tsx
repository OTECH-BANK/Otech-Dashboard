// components/Tables/DebitFeesTable.tsx
import React, { useEffect, useState } from "react"
import { RxCaretSort, RxDotsVertical } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { ButtonModule } from "components/ui/Button/Button"
import ExportIcon from "public/export-icon"
import { SearchModule } from "components/ui/Search/search-module"
import EmptyState from "public/empty-state"
import { useGetDebitFeesQuery } from "lib/redux/feesApi"
import EditDebitFeeModal from "components/ui/Modal/edit-fees-modal"

type SortOrder = "asc" | "desc" | null
type DebitFee = {
  debitFeeID: number
  min: number
  max: number
  bankFee: number
  switchFee: number
  vat: number
  totalFee: number
  feeWithVAT: number
}

const SkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, index) => (
      <td key={index} className="whitespace-nowrap border-b px-4 py-3">
        <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
      </td>
    ))}
  </tr>
)

const DebitFeesTable = ({ refreshKey }: { refreshKey?: number }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<DebitFee | null>(null)

  // Use the feesApi hook to fetch data
  const { data: feesResponse, isLoading, isError, refetch } = useGetDebitFeesQuery()

  const [fees, setFees] = useState<DebitFee[]>([])

  useEffect(() => {
    if (feesResponse && feesResponse.succeeded) {
      setFees(feesResponse.data)
    }
  }, [feesResponse, refreshKey])

  const toggleSort = (column: keyof DebitFee) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)

    const sortedFees = [...fees].sort((a, b) => {
      if (a[column] < b[column]) return isAscending ? 1 : -1
      if (a[column] > b[column]) return isAscending ? -1 : 1
      return 0
    })

    setFees(sortedFees)
  }

  const toggleMenu = (debitFeeID: number) => {
    setOpenMenuId(openMenuId === debitFeeID ? null : debitFeeID)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as Element).closest(".menu-container")) {
      setOpenMenuId(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update handleEdit function
  const handleEdit = (debitFeeID: number) => {
    const feeToEdit = fees.find((fee) => fee.debitFeeID === debitFeeID)
    if (feeToEdit) {
      setSelectedFee(feeToEdit)
      setIsEditModalOpen(true)
    }
    setOpenMenuId(null)
  }

  // Update handleSuccess for edit
  const handleEditSuccess = () => {
    refetch() // Refresh the data
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  const filteredFees = fees.filter((fee) =>
    Object.values(fee).some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchText.toLowerCase())
    })
  )

  // Get current fees for pagination
  const indexOfLastFee = currentPage * itemsPerPage
  const indexOfFirstFee = indexOfLastFee - itemsPerPage
  const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Format currency with 2 decimal places
  const formatCurrency = (num: number) => {
    return num.toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
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
                {[...Array(8)].map((_, index) => (
                  <th key={index} className="whitespace-nowrap border-b p-4">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-300"></div>
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
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <div className="flex w-full flex-col items-center justify-center">
            <EmptyState />
            <p className="text-xl font-bold text-[#D82E2E]">Error loading fees</p>
            <p>Please refresh or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      {/* Header */}
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Debit Fees</p>
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
            <p className="max-sm:hidden">Export CSV</p>
          </ButtonModule>
        </div>
      </div>

      {filteredFees.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#f9f9f9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">No Fees Added Yet.</p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 "
                    onClick={() => toggleSort("debitFeeID")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Debit Fee ID <RxCaretSort />
                  </th>
                  <th className="cursor-pointer whitespace-nowrap border-b p-4 " onClick={() => toggleSort("min")}>
                    <div className="flex items-center gap-2">
                      Minimum <RxCaretSort />
                    </div>
                  </th>
                  <th className="cursor-pointer whitespace-nowrap border-b p-4 " onClick={() => toggleSort("max")}>
                    <div className="flex items-center gap-2">
                      Maximum <RxCaretSort />
                    </div>
                  </th>
                  <th className="cursor-pointer whitespace-nowrap border-b p-4 " onClick={() => toggleSort("bankFee")}>
                    <div className="flex items-center gap-2">
                      Bank Fee
                      <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 "
                    onClick={() => toggleSort("switchFee")}
                  >
                    <div className="flex items-center gap-2">
                      Switch Fee <RxCaretSort />
                    </div>
                  </th>
                  <th className="cursor-pointer whitespace-nowrap border-b p-4 " onClick={() => toggleSort("totalFee")}>
                    <div className="flex items-center gap-2">
                      Total Fee <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 "
                    onClick={() => toggleSort("feeWithVAT")}
                  >
                    <div className="flex items-center gap-2">
                      Fee with VAT <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 ">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentFees.map((fee) => (
                  <tr key={fee.debitFeeID}>
                    <td className="whitespace-nowrap border-b px-4 py-2 ">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {fee.debitFeeID}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 ">
                      <div className="flex items-center gap-2">₦{formatNumber(fee.min)}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 ">
                      <div className="flex items-center gap-2">₦{formatNumber(fee.max)}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 ">
                      <div className="flex items-center gap-2">₦{formatCurrency(fee.bankFee)}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 ">
                      <div className="flex items-center gap-2 rounded-full py-1">₦{formatCurrency(fee.switchFee)}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 ">
                      <div className="flex items-center gap-2">₦{formatCurrency(fee.totalFee)}</div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 ">
                      <div className="flex items-center gap-2">₦{formatCurrency(fee.feeWithVAT)}</div>
                    </td>
                    <td className="relative whitespace-nowrap border-b px-4 py-1 ">
                      <div className="menu-container flex items-center gap-2">
                        <button onClick={() => toggleMenu(fee.debitFeeID)} className="rounded p-1 hover:bg-gray-100">
                          <RxDotsVertical />
                        </button>

                        {openMenuId === fee.debitFeeID && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-white shadow-lg">
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(fee.debitFeeID)}
                                className="block w-full px-4 py-2 text-left  text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className=" text-gray-700">
              Showing {indexOfFirstFee + 1} to {Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length}{" "}
              entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-full px-2 py-1 ${
                  currentPage === 1 ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <MdOutlineArrowBackIosNew />
              </button>

              {Array.from({ length: Math.ceil(filteredFees.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`rounded-full px-3 py-1 ${
                    currentPage === index + 1 ? "bg-primary text-black" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredFees.length / itemsPerPage)}
                className={`rounded-full px-2 py-1 ${
                  currentPage === Math.ceil(filteredFees.length / itemsPerPage)
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

      {selectedFee && (
        <EditDebitFeeModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          feeData={{
            debitFeeID: selectedFee.debitFeeID,
            min: selectedFee.min,
            max: selectedFee.max,
            bankFee: selectedFee.bankFee,
            switchFee: selectedFee.switchFee,
          }}
        />
      )}
    </div>
  )
}

export default DebitFeesTable
