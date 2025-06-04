"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import React, { useState } from "react"
import Filtericon from "public/filter-icon"
import { useGetCustomerTypesQuery } from "lib/redux/customerTypeApi"
import { notify } from "components/ui/Notification/Notification"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md"
import AddCustomerTypeModal from "components/ui/Modal/customer-type-modal"

interface DisplayCustomerType {
  id: number
  customerTypeID: number
  customerTypeName: string
  customerTypeCode: string
}

export default function CustomerType() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { data, error, isLoading } = useGetCustomerTypesQuery()

  const customerTypes: DisplayCustomerType[] = data?.data
    ? data.data.map((type, i) => ({
        id: i + 1,
        customerTypeID: type.customerTypeID,
        customerTypeName: type.customerTypeName,
        customerTypeCode: type.customerTypeCode,
      }))
    : []

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = customerTypes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(customerTypes.length / itemsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

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

  const handleAddCustomerType = async (formData: { name: string; code: string }) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to add customer type
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notify("success", "Customer type added successfully")
      setIsAddModalOpen(false)
    } catch (error) {
      notify("error", "Failed to add customer type")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccess = () => {
    // This will trigger a refresh of the customer types list
    setIsAddModalOpen(false)
  }

  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  if (error) {
    console.error("Failed to load customer types:", error)
    return (
      <section className="h-full w-full">
        <DashboardNav />
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">Failed to load customer types</div>
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
            <p className="text-2xl font-medium">Customer Types</p>
            <div className="flex gap-4">
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Customer Type
              </ButtonModule>
              <ButtonModule
                variant="secondary"
                size="md"
                icon={<Filtericon />}
                iconPosition="end"
                onClick={toggleFilter}
              >
                Filter
              </ButtonModule>
            </div>
          </div>

          <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
            <div className="w-full">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm max-sm:text-xs">
                  <p className="text-grey-300">Customer Types:</p>
                  {isLoading ? (
                    <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p>{customerTypes.length}</p>
                  )}
                </div>
              </div>

              <div
                className={`mb-4 grid w-full gap-4 max-sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 ${
                  isFilterOpen ? "lg:grid-cols-2 2xl:grid-cols-3" : ""
                }`}
              >
                {isLoading
                  ? // Skeleton loading state
                    Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="rounded-lg bg-white p-4 shadow-lg">
                        <div className="flex gap-4">
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  : // Actual customer type data
                    currentItems.map((type) => (
                      <div key={type.id} className="rounded-lg bg-white p-4 shadow-lg">
                        <div className="flex gap-4">
                          <div className="bg-primary/10 relative flex h-12 w-12 items-center justify-center rounded-full">
                            <span className="text-primary text-lg font-semibold">{type.customerTypeCode}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-bold">{type.customerTypeName}</h3>
                            <p className="text-sm text-gray-500">ID: {type.customerTypeID}</p>
                            <p className="text-sm text-gray-500">Code: {type.customerTypeCode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              {/* Pagination */}
              {!isLoading && customerTypes.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, customerTypes.length)} of{" "}
                    {customerTypes.length} entries
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
      <AddCustomerTypeModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  )
}
