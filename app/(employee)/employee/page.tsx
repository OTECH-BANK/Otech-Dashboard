"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Filtericon from "public/filter-icon"
import { RxDotsVertical } from "react-icons/rx"
import DeleteModal from "components/ui/Modal/delete-modal"
import AddEmployeeModal from "components/ui/Modal/add-employee-modal"
import { useGetEmployeesQuery } from "lib/redux/employeeApi"

// Skeleton Loader Component
const EmployeeCardSkeleton = () => (
  <div className="relative animate-pulse rounded-lg bg-white p-4 shadow-lg">
    <div className="flex gap-4">
      <div className="relative h-[46px] w-[46px]">
        <div className="h-[44px] w-[44px] rounded-md bg-gray-200"></div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="h-3 w-1/2 rounded bg-gray-200"></div>
      </div>
      <div className="h-5 w-5 rounded bg-gray-200"></div>
    </div>
    <div className="my-4 flex items-center justify-between">
      <div className="h-3 w-1/4 rounded bg-gray-200"></div>
      <div className="h-3 w-1/6 rounded bg-gray-200"></div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <div className="h-3 w-1/3 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-3">
      <div className="h-3 w-full rounded bg-gray-200"></div>
      <div className="h-3 w-full rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 h-10 w-full rounded bg-gray-200"></div>
  </div>
)

export default function EmployeePage() {
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    employee: null as {
      id: string
      name: string
      email: string
      role: string
      status: string
    } | null,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch employees data
  const {
    data: employeesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEmployeesQuery({
    pageNumber,
    pageSize,
  })

  const handleEdit = (id: string) => {
    const employee = employeesResponse?.data?.find((e) => e.userID === id)
    if (employee) {
      setEditModalState({
        isOpen: true,
        employee: {
          id: employee.userID,
          name: employee.employeeFullName,
          email: employee.employeeEmail,
          role: employee.userRoleName,
          status: employee.isactive ? "Active" : "Inactive",
        },
      })
    }
    setOpenDropdownId(null)
  }

  const handleSaveEdit = async (data: { name: string; email: string; role: string; status: string }) => {
    setIsEditing(true)
    try {
      console.log(`Saving changes for employee ${editModalState.employee?.id}:`, data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEditModalState({
        isOpen: false,
        employee: null,
      })
    } catch (error) {
      console.error("Error saving employee:", error)
    } finally {
      setIsEditing(false)
    }
  }

  const closeEditModal = () => {
    setEditModalState({
      isOpen: false,
      employee: null,
    })
  }

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    employeeId: null as string | null,
    employeeName: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  const handleDelete = (id: string) => {
    const employee = employeesResponse?.data?.find((e) => e.userID === id)
    if (employee) {
      setDeleteModalState({
        isOpen: true,
        employeeId: id,
        employeeName: employee.employeeFullName,
      })
    }
    setOpenDropdownId(null)
  }

  const handleConfirmDelete = async (reason: string) => {
    setIsDeleting(true)
    try {
      console.log(`Deleting employee ${deleteModalState.employeeId} with reason: ${reason}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error deleting employee:", error)
    } finally {
      setIsDeleting(false)
      setDeleteModalState({
        isOpen: false,
        employeeId: null,
        employeeName: "",
      })
    }
  }

  const closeDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      employeeId: null,
      employeeName: "",
    })
  }

  const handleViewDetails = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedEmployeeId", id)
    }
    router.push(`/employee/employee-detail`)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleAddEmployee = async (employeeData: { name: string; email: string; role: string }) => {
    setIsSubmitting(true)
    try {
      console.log("Adding employee:", employeeData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsAddEmployeeModalOpen(false)
    } catch (error) {
      console.error("Error adding employee:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isError) {
    return (
      <>
        <div className="p-4 text-red-500">
          Error loading employees
          <ButtonModule
            variant="primary"
            size="md"
            icon={<AddBusiness />}
            iconPosition="start"
            onClick={() => setIsAddEmployeeModalOpen(true)}
          >
            Add Employee
          </ButtonModule>
        </div>
        <AddEmployeeModal
          isOpen={isAddEmployeeModalOpen}
          onRequestClose={() => setIsAddEmployeeModalOpen(false)}
          onSuccess={() => {
            refetch()
          }}
        />
      </>
    )
  }

  if (employeesResponse && !employeesResponse.succeeded) {
    return (
      <div className="p-4 text-yellow-600">
        {employeesResponse.message || "No employee data available"}
        <button onClick={() => refetch()} className="ml-2 text-blue-500 underline">
          Retry
        </button>
      </div>
    )
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium max-sm:text-lg">Employee Page</p>
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddEmployeeModalOpen(true)}
              >
                Add Employee
              </ButtonModule>
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="flex h-screen w-full max-sm:flex-col">
                <div className={`w-full flex-1 ${isFilterOpen ? "mr-0" : ""}`}>
                  <div
                    className={`grid w-full gap-4 max-sm:mb-4 max-sm:grid-cols-1 max-sm:px-0 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 ${
                      isFilterOpen ? "lg-grid-cols-2 2xl:grid-cols-3" : ""
                    }`}
                  >
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, index) => <EmployeeCardSkeleton key={`skeleton-${index}`} />)
                    ) : employeesResponse?.data?.length ? (
                      employeesResponse.data.map((employee) => (
                        <div key={employee.userID} className="relative rounded-lg bg-white p-4 shadow-lg">
                          <div className="flex gap-4">
                            <div className="relative h-[46px] w-[46px]">
                              <div className="text-grey-600 flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#F5F8FA] font-medium">
                                {getInitials(employee.employeeFullName)}
                              </div>
                              <div
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                  employee.isactive ? "bg-[#27AE60]" : "bg-[#94A3B8]"
                                }`}
                              ></div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-base font-bold">{employee.employeeFullName}</h3>
                              <p className="text-sm">{employee.employeeEmail}</p>
                            </div>
                            <div className="relative" ref={dropdownRef}>
                              <button
                                onClick={() => toggleDropdown(employee.userID)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <RxDotsVertical />
                              </button>
                              {openDropdownId === employee.userID && (
                                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEdit(employee.userID)}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(employee.userID)}
                                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="my-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-grey-400">Role:</span>
                                <span className="font-medium">{employee.userRoleName}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end text-sm">
                              <span className="flex items-center gap-2">
                                <span className={`text-sm ${employee.isactive ? "text-[#27AE60]" : "text-[#D82E2E]"}`}>
                                  {employee.isactive ? "Active" : "Inactive"}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-grey-400">Branch:</span>
                              <span className="font-medium">{employee.branchName}</span>
                            </div>
                          </div>

                          <div className="text-grey-600 mt-4 rounded-md bg-[#F5F8FA] p-3">
                            <div className="flex justify-between text-sm">
                              <span>Mobile:</span>
                              <span className="text-grey-300">
                                <span className="text-base font-bold text-[#202B3C]">{employee.employeeMobile}</span>
                              </span>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span>Created:</span>
                              <span className="text-grey-300">
                                <span className="text-base font-bold text-[#202B3C]">
                                  {new Date(employee.createdate).toLocaleDateString()}
                                </span>
                              </span>
                            </div>
                          </div>

                          <ButtonModule
                            className="mt-4"
                            variant="black"
                            size="md"
                            iconPosition="end"
                            onClick={() => handleViewDetails(employee.userID)}
                          >
                            View Details
                          </ButtonModule>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-4 text-center text-gray-500">
                        No employees found. {employeesResponse?.message || ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onRequestClose={() => setIsAddEmployeeModalOpen(false)}
        onSuccess={() => {
          refetch()
        }}
      />

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        businessName={deleteModalState.employeeName}
      />
    </section>
  )
}
