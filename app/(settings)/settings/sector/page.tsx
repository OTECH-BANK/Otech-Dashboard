"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import React, { useState } from "react"
import Filtericon from "public/filter-icon"

import { notify } from "components/ui/Notification/Notification"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md"
import { useGetChannelListQuery } from "lib/redux/feesApi"

interface DisplayChannel {
  id: number
  value: string
  text: string
  disabled: boolean
}

export default function ChannelList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { data, error, isLoading } = useGetChannelListQuery()

  const channels: DisplayChannel[] = data?.data
    ? data.data.map((channel, i) => ({
        id: i + 1,
        value: channel.value,
        text: channel.text,
        disabled: channel.disabled,
      }))
    : []

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = channels.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(channels.length / itemsPerPage)

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

  const handleAddChannel = async (formData: { text: string; value: string }) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to add channel
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notify("success", "Channel added successfully")
      setIsAddModalOpen(false)
    } catch (error) {
      notify("error", "Failed to add channel")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccess = () => {
    setIsAddModalOpen(false)
  }

  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  if (error) {
    console.error("Failed to load channels:", error)
    return (
      <section className="h-full w-full">
        <DashboardNav />
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">Failed to load channels</div>
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
            <p className="text-2xl font-medium">Channels</p>
            <div className="flex gap-4">
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Channel
              </ButtonModule>
            </div>
          </div>

          <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
            <div className="w-full">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm max-sm:text-xs">
                  <p className="text-grey-300">Channels:</p>
                  {isLoading ? (
                    <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p>{channels.length}</p>
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
                  : // Actual channel data
                    currentItems.map((channel) => (
                      <div key={channel.id} className="rounded-lg bg-white p-4 shadow-lg">
                        <div className="flex gap-4">
                          <div className="bg-primary/10 relative flex h-12 w-12 items-center justify-center rounded-full">
                            <span className="text-primary text-lg font-semibold">{channel.value}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-bold">{channel.text}</h3>
                            <p className="text-sm text-gray-500">ID: {channel.value}</p>
                            <p className="text-sm text-gray-500">Status: {channel.disabled ? "Disabled" : "Active"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              {/* Pagination */}
              {!isLoading && channels.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, channels.length)} of {channels.length}{" "}
                    entries
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
    </section>
  )
}
