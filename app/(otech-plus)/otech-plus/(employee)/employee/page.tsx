"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { RxDotsVertical } from "react-icons/rx"
import DeleteModal from "components/ui/Modal/delete-modal"
import AddEmployeeModal from "components/ui/Modal/add-employee-modal"
import { useGetAdminsQuery } from "lib/redux/otechplusApi"
import EditAdminPermissionsModal from "components/Modals/EditAdminPermissionModal"
import Filtericon from "public/filter-icon"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"

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
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Create a ref object to store refs for all dropdowns
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Modal states
  const [permissionsModalState, setPermissionsModalState] = useState({
    isOpen: false,
    adminId: 0,
    adminName: "",
    currentPermissions: [] as number[],
  })

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    employeeId: null as string | null,
    employeeName: "",
  })

  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: adminsData,
    isLoading,
    isError,
    refetch,
  } = useGetAdminsQuery({
    pageNumber,
    pageSize,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check all dropdown refs
      Object.entries(dropdownRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node) && openDropdownId === id) {
          setOpenDropdownId(null)
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdownId])

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  const handleEditPermissions = (id: string) => {
    const admin = adminsData?.data.find((a) => a.id.toString() === id)
    if (admin) {
      setPermissionsModalState({
        isOpen: true,
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        currentPermissions: admin.permissions.map((p) => p.type.value),
      })
    }
    setOpenDropdownId(null)
  }

  const handleDelete = (id: string) => {
    const admin = adminsData?.data.find((a) => a.id.toString() === id)
    if (admin) {
      setDeleteModalState({
        isOpen: true,
        employeeId: id,
        employeeName: `${admin.firstName} ${admin.lastName}`,
      })
    }
    setOpenDropdownId(null)
  }

  const handleConfirmDelete = async (reason: string) => {
    setIsDeleting(true)
    try {
      console.log(`Deleting admin ${deleteModalState.employeeId} with reason: ${reason}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error deleting admin:", error)
    } finally {
      setIsDeleting(false)
      setDeleteModalState({
        isOpen: false,
        employeeId: null,
        employeeName: "",
      })
    }
  }

  const handleViewDetails = (id: string) => {
    localStorage.setItem("selectedAdminId", id)
    router.push(`/employee/employee-detail`)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  if (isError) return <div className="p-4 text-red-500">Error loading admins</div>

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <OtechPlusDashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium max-sm:text-lg">Admin Page</p>
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="flex h-screen w-full max-sm:flex-col">
                <div className={`w-full flex-1 ${isFilterOpen ? "mr-0" : ""}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm max-sm:text-xs">
                      <p className="text-grey-300">Admins Count:</p>
                      {isLoading ? (
                        <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                      ) : (
                        <p>{adminsData?.totalCount || 0}</p>
                      )}
                    </div>
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
                  <div className={`grid w-full gap-4 max-sm:grid-cols-1 lg:grid-cols-3`}>
                    {isLoading
                      ? Array.from({ length: 8 }).map((_, index) => <EmployeeCardSkeleton key={`skeleton-${index}`} />)
                      : adminsData?.data.map((admin) => (
                          <div key={admin.id} className="relative rounded-lg bg-white p-4 shadow-lg">
                            <div className="flex gap-4">
                              <div className="relative h-[46px] w-[46px]">
                                <div className="text-grey-600 flex h-[44px] w-[44px] items-center justify-center rounded-md bg-[#F5F8FA] font-medium">
                                  {getInitials(admin.firstName, admin.lastName)}
                                </div>
                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#27AE60]"></div>
                              </div>

                              <div className="flex-1">
                                <h3 className="text-base font-bold">{`${admin.firstName} ${admin.lastName}`}</h3>
                                <p className="text-sm">Admin User</p>
                              </div>

                              <div
                                className="relative"
                                ref={(el) => {
                                  if (el) {
                                    dropdownRefs.current[admin.id.toString()] = el
                                  }
                                }}
                              >
                                <button
                                  onClick={() => toggleDropdown(admin.id.toString())}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <RxDotsVertical />
                                </button>

                                {openDropdownId === admin.id.toString() && (
                                  <div className="absolute right-0 z-50 mt-2 w-32 rounded-md bg-white shadow-lg">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleEditPermissions(admin.id.toString())}
                                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                      >
                                        Edit Permissions
                                      </button>
                                      <button
                                        onClick={() => handleDelete(admin.id.toString())}
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
                                  <span className="font-medium">Admin</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end text-sm">
                                <span className="text-sm text-[#27AE60]">Active</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-grey-400">Permissions:</span>
                                <span className="font-medium">{admin.permissions.length}</span>
                              </div>
                            </div>

                            <div className="text-grey-600 mt-4 rounded-md bg-[#F5F8FA] p-3">
                              <div className="flex justify-between text-sm">
                                <span>ID:</span>
                                <span className="text-base font-bold text-[#202B3C]">{admin.id}</span>
                              </div>
                              <div className="mt-2 flex justify-between text-sm">
                                <span>Photo:</span>
                                <span className="text-base font-bold text-[#202B3C]">
                                  {admin.photo ? "Available" : "Not available"}
                                </span>
                              </div>
                            </div>

                            <ButtonModule
                              className="mt-4"
                              variant="black"
                              size="md"
                              iconPosition="end"
                              onClick={() => handleViewDetails(admin.id.toString())}
                            >
                              View Details
                            </ButtonModule>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAdminPermissionsModal
        isOpen={permissionsModalState.isOpen}
        onRequestClose={() =>
          setPermissionsModalState({
            isOpen: false,
            adminId: 0,
            adminName: "",
            currentPermissions: [],
          })
        }
        onSuccess={refetch}
        adminId={permissionsModalState.adminId}
        adminName={permissionsModalState.adminName}
        currentPermissions={permissionsModalState.currentPermissions}
      />

      {/* <DeleteModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={() =>
          setDeleteModalState({
            isOpen: false,
            employeeId: null,
            employeeName: "",
          })
        }
        onConfirm={handleConfirmDelete}
        businessName={deleteModalState.employeeName}
      /> */}

      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onRequestClose={() => setIsAddEmployeeModalOpen(false)}
        onSuccess={refetch}
      />
    </section>
  )
}
