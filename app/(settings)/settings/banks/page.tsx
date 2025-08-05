"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import React, { useRef, useState } from "react"
import Filtericon from "public/filter-icon"
import DeleteModal from "components/ui/Modal/delete-modal"
import AddBankModal from "components/ui/Modal/add-bank-modal"
import { useGetBanksQuery } from "lib/redux/api"
import { notify } from "components/ui/Notification/Notification"
import { BankLogo } from "components/ui/BanksLogo/bank-logo"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md"

interface DisplayBank {
  id: number
  bankCode: string
  bankName: string
  bankAlias: string
  logo: string
}

export default function Banks() {
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    bankId: null as number | null,
    bankName: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(100)
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const { data: banks, error, isLoading } = useGetBanksQuery()

  const banksData: DisplayBank[] = banks
    ? banks.map((b, i) => ({
        id: i + 1,
        bankCode: b.bankCode,
        bankName: b.bankName,
        bankAlias: b.bankAlias,
        logo: getBankLogo(b.bankCode),
      }))
    : []

  function getBankLogo(bankCode: string): string {
    const bankLogos: Record<string, string> = {}
    return bankLogos[bankCode] || "/Banks/default.svg"
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBanks = banksData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(banksData.length / itemsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // Number of pages to show before using ellipsis

    // Always show first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => paginate(1)}
        className={`rounded-full px-3 py-1 ${
          currentPage === 1 ? "bg-primary text-black" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        1
      </button>
    )

    // Show ellipsis after first page if current page is far from start
    if (currentPage > maxVisiblePages) {
      pageNumbers.push(
        <span key="left-ellipsis" className="px-2 py-1">
          ...
        </span>
      )
    }

    // Determine range of pages to show around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Show pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`rounded-full px-3 py-1 ${
              currentPage === i ? "bg-primary text-black" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        )
      }
    }

    // Show ellipsis before last page if current page is far from end
    if (currentPage < totalPages - (maxVisiblePages - 2)) {
      pageNumbers.push(
        <span key="right-ellipsis" className="px-2 py-1">
          ...
        </span>
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`rounded-full px-3 py-1 ${
            currentPage === totalPages ? "bg-primary text-black" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {totalPages}
        </button>
      )
    }

    return pageNumbers
  }

  const handleConfirmDelete = async (reason: string) => {
    setIsDeleting(true)
    try {
      // TODO: call your delete API here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notify("success", "Bank deleted successfully")
    } catch (error) {
      notify("error", "Failed to delete bank")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeleteModalState({ isOpen: false, bankId: null, bankName: "" })
    }
  }

  const handleAddBank = async (bankData: { bank: string; code: string; logo: File | null }) => {
    setIsSubmitting(true)
    try {
      // TODO: post to your add-bank API here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notify("success", "Bank added successfully")
      setIsAddBusinessModalOpen(false)
    } catch (error) {
      notify("error", "Failed to add bank")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeDeleteModal = () => setDeleteModalState({ isOpen: false, bankId: null, bankName: "" })

  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  if (error) {
    console.error("Failed to load banks:", error)
    return (
      <section className="h-full w-full">
        <DashboardNav />
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">Failed to load banks</div>
        </div>
      </section>
    )
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full flex-col">
        <DashboardNav />
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium">Banks</p>
              {isLoading ? (
                <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
              ) : (
                <p>{banksData.length}</p>
              )}
            </div>
            <ButtonModule
              variant="primary"
              size="md"
              icon={<AddBusiness />}
              iconPosition="start"
              onClick={() => setIsAddBusinessModalOpen(true)}
            >
              Add New Bank
            </ButtonModule>
          </div>

          <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
            <div className="flex h-screen w-full max-sm:flex-col">
              <div className="w-full flex-1">
                <div
                  className={`mb-4 grid w-full gap-4 max-sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 ${
                    isFilterOpen ? "lg:grid-cols-2 2xl:grid-cols-3" : ""
                  }`}
                >
                  {isLoading
                    ? // Skeleton loading state
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="rounded-lg bg-white p-4 shadow-lg">
                          <div className="flex gap-4">
                            <div className="relative h-[46px] w-[46px]">
                              <div className="h-full w-full animate-pulse rounded-md bg-gray-200"></div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    : // Actual bank data
                      currentBanks.map((bank) => (
                        <div key={bank.id} className="relative rounded-lg bg-white p-4 shadow-lg">
                          <div className="flex gap-4">
                            <div className="relative h-[46px] w-[46px]">
                              <BankLogo
                                bankCode={bank.bankCode}
                                bankName={bank.bankName}
                                width={60}
                                height={60}
                                className="rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold">{bank.bankName}</h3>
                              <p className="text-sm">Code: {bank.bankCode}</p>
                              <p className="text-sm">Alias: {bank.bankAlias}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                {/* Pagination */}
                {!isLoading && banksData.length > itemsPerPage && (
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, banksData.length)} of{" "}
                      {banksData.length} entries
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`rounded-full px-2 py-1 ${
                          currentPage === 1
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        <MdOutlineArrowBackIosNew />
                      </button>

                      {renderPageNumbers()}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`rounded-full px-2 py-1 ${
                          currentPage === totalPages
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        <MdOutlineArrowForwardIos />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddBankModal
        isOpen={isAddBusinessModalOpen}
        onRequestClose={() => setIsAddBusinessModalOpen(false)}
        loading={isSubmitting}
        onSubmit={handleAddBank}
      />

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        businessName={deleteModalState.bankName}
      />
    </section>
  )
}
