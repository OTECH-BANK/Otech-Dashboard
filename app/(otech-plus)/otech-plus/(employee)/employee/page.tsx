"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { RxDotsVertical } from "react-icons/rx"
import DeleteModal from "components/ui/Modal/delete-modal"
import AddEmployeeModal from "components/ui/Modal/add-employee-modal"
import { useDeleteAdminMutation, useGetAdminsQuery } from "lib/redux/otechplusApi"
import EditAdminPermissionsModal from "components/Modals/EditAdminPermissionModal"
import Filtericon from "public/filter-icon"
import OtechPlusDashboardNav from "components/Navbar/OtechPlusDashboardNav"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"

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

interface DeleteAdminModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onConfirm: () => Promise<void>
  adminName: string
  loading: boolean
}

const DeleteAdminModal: React.FC<DeleteAdminModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  adminName,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[350px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Delete Admin</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <p className="my-4">Are you sure you want to delete {adminName}?</p>
        <div className="flex justify-end gap-4">
          <ButtonModule
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onRequestClose}
            disabled={loading}
          >
            Cancel
          </ButtonModule>
          <ButtonModule
            type="button"
            variant="danger"
            size="lg"
            className="w-full"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

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
    adminId: null as number | null,
    adminName: "",
  })

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation()
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
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
      })
    }
    setOpenDropdownId(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModalState.adminId) return

    try {
      await deleteAdmin(deleteModalState.adminId).unwrap()
      refetch()
      setDeleteModalState({
        isOpen: false,
        adminId: null,
        adminName: "",
      })
    } catch (error) {
      console.error("Error deleting admin:", error)
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

                            <div className="text-grey-600 my-4 rounded-md bg-[#F5F8FA] p-3">
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Permissions:</span>
                                {admin.permissions.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {admin.permissions.map((permission) => (
                                      <span
                                        key={permission.id}
                                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                                      >
                                        {permission.type.label}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">No permissions assigned</span>
                                )}
                              </div>
                              <div className="mt-2 flex justify-between text-sm">
                                <span>Photo:</span>
                                <span className="text-base font-bold text-[#202B3C]">
                                  {admin.photo ? "Available" : "Not available"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <ButtonModule
                                type="submit"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleEditPermissions(admin.id.toString())}
                              >
                                Edit Permissions
                              </ButtonModule>
                              <ButtonModule
                                type="submit"
                                variant="danger"
                                size="sm"
                                className="w-full"
                                onClick={() => handleDelete(admin.id.toString())}
                              >
                                Delete Admin
                              </ButtonModule>
                            </div>
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

      <DeleteAdminModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={() =>
          setDeleteModalState({
            isOpen: false,
            adminId: null,
            adminName: "",
          })
        }
        onConfirm={handleConfirmDelete}
        adminName={deleteModalState.adminName}
        loading={isDeleting}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onRequestClose={() => setIsAddEmployeeModalOpen(false)}
        onSuccess={refetch}
      />
    </section>
  )
}
