"use client"
import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"
import { useEffect, useRef, useState } from "react"
import { ButtonModule } from "components/ui/Button/Button"
import FreezeAccountModal from "components/ui/Modal/freeze-account-modal"
import GenerateReceiptmodal from "components/ui/Modal/generate-receipt-modal"
import { useRouter } from "next/navigation"
import Link from "next/link"
import EditUserIcon from "public/edit-info-icon"
import LinkedInIcon from "public/linkedIn-icon"
import TwitterIcon from "public/twitter-icon"
import FacebookIcon from "public/facebook-icon"
import { useGetEmployeeDetailsQuery } from "lib/redux/employeeApi"
import ActivateEmployee from "components/ui/Modal/activate-employee-modal"
import ActivateEmployeeModal from "components/ui/Modal/activate-employee-modal"
import { RxDotsVertical } from "react-icons/rx"
import ChangePasswordModal from "components/ui/Modal/change-password-modal"
import ChangeRoleModal from "components/ui/Modal/change-role-modal"

// Skeleton Loader Components
const EmployeeProfileSkeleton = () => (
  <div className="w-1/3 animate-pulse rounded-md bg-white p-4 shadow-md max-sm:w-full">
    <div className="flex gap-4">
      <div className="relative h-[46px] w-[46px]">
        <div className="h-[44px] w-[44px] rounded-md bg-gray-200"></div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
      </div>
    </div>
    <div className="my-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
    <div className="mt-2 flex justify-between">
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 space-y-2 rounded-md bg-gray-100 p-3">
      <div className="flex justify-between">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
)

const EmployeeDetailsSkeleton = () => (
  <div className="flex w-2/3 animate-pulse flex-col items-start rounded-md bg-[#EBEFF3] p-4 max-sm:w-full">
    <div className="h-8 w-1/2 rounded bg-gray-200"></div>
    <div className="mt-2 h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="my-4 flex gap-2">
      <div className="h-6 w-20 rounded bg-gray-200"></div>
      <div className="h-6 w-20 rounded bg-gray-200"></div>
      <div className="h-6 w-20 rounded bg-gray-200"></div>
    </div>
    <div className="h-8 w-full rounded bg-gray-200"></div>
    <div className="mt-4 flex w-full justify-between border-b pb-2">
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 flex w-full justify-between border-b pb-2">
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 flex w-full justify-between border-b pb-2">
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="flex gap-2">
        <div className="h-10 w-10 rounded bg-gray-200"></div>
        <div className="h-10 w-10 rounded bg-gray-200"></div>
        <div className="h-10 w-10 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
)

export default function EmployeeDetails() {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false)
  const [isFreezing, setIsFreezing] = useState(false)
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Added for dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null) // Added for dropdown ref
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  // Update your handleChangeRole function
  const handleChangeRole = () => {
    setIsDropdownOpen(false)
    setIsRoleModalOpen(true)
  }

  // Get employee ID from local storage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("selectedEmployeeId")
      setEmployeeId(id)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true)
    setIsDropdownOpen(false)
  }

  // Fetch employee details
  const {
    data: employeeDetails,
    isLoading,
    isError,
  } = useGetEmployeeDetailsQuery(employeeId || "", {
    skip: !employeeId, // Skip if no employeeId
  })

  const employee = employeeDetails?.data

  const handleActivateEmployee = () => {
    setIsActivateModalOpen(true) // Changed to open activate modal instead of freeze modal
  }

  const handleGenerateReceipt = () => {
    setIsReceiptModalOpen(true)
  }

  const confirmFreezeAccount = () => {
    setIsFreezing(true)
    setTimeout(() => {
      console.log("Account frozen")
      setIsFreezing(false)
      setIsFreezeModalOpen(false)
    }, 1500)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <section className="h-full w-full">
        <div className="flex min-h-screen w-full">
          <div className="flex w-full flex-col">
            <DashboardNav />
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
                <div className="flex cursor-pointer items-center gap-2" onClick={() => router.back()}>
                  <img src="/DashboardImages/ArrowLeft.png" alt="dekalo" className="icon-style" />
                  <img src="/DashboardImages/ArrowLeft-dark.png" alt="dekalo" className="dark-icon-style" />
                  <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>

              <div className="max-sm-my-4 mt-8 flex w-full items-start gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3">
                <EmployeeProfileSkeleton />
                <EmployeeDetailsSkeleton />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isError) return <div className="p-4 text-red-500">Error loading employee details</div>
  if (!employee) return <div className="p-4">Employee not found</div>

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <div className="flex cursor-pointer items-center gap-2" onClick={() => router.back()}>
                <img src="/DashboardImages/ArrowLeft.png" alt="dekalo" className="icon-style" />
                <img src="/DashboardImages/ArrowLeft-dark.png" alt="dekalo" className="dark-icon-style" />
                <p className="text-2xl font-medium max-sm:text-lg">{employee.employeeFullName}</p>
              </div>
              <div className="flex gap-4">
                <ButtonModule variant="primary" size="md" iconPosition="end" onClick={handleActivateEmployee}>
                  Activate Employee
                </ButtonModule>
                {/* <ButtonModule variant="black" size="md" iconPosition="end" onClick={handleGenerateReceipt}>
                  Edit Employee
                </ButtonModule> */}
              </div>
            </div>

            <div className="max-sm-my-4 mt-8 flex w-full items-start gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3">
              <div className="w-1/3 rounded-md bg-white p-4 shadow-md max-sm:w-full">
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
                </div>
                <div className="my-4 flex w-full flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex w-full justify-between gap-1">
                      <span className="text-grey-400">Department:</span>
                      <span className="font-medium">{employee.userRoleName}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col text-sm">
                    <div className="flex w-full justify-between gap-1">
                      <span className="text-grey-400 text-base">Position</span>
                      <span className="text-sm font-medium">{employee.approvedUserApprRole}</span>
                    </div>
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
              </div>

              <div className="flex w-2/3 flex-col items-start rounded-md bg-[#EBEFF3] p-4 max-sm:w-full">
                <div className="flex w-full justify-between">
                  <p className="text-2xl font-bold">{employee.employeeFullName}</p>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <RxDotsVertical />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleChangeRole}
                        >
                          Change Role
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-grey-400 mt-2 space-y-0 md:w-1/2">{employee.branchAddress}</span>

                <div className="my-4 flex flex-wrap gap-2">
                  <div className="rounded bg-[#CBD5E1] px-2 py-1">
                    <p className="text-sm text-[#384860]">{employee.userRoleName}</p>
                  </div>
                  <div className="rounded bg-[#CBD5E1] px-2 py-1">
                    <p className="text-sm text-[#384860]">{employee.approvedUserApprRole}</p>
                  </div>
                  <div className="rounded bg-[#CBD5E1] px-2 py-1">
                    <p className="text-sm text-[#384860]">Branch: {employee.branchCode}</p>
                  </div>
                </div>
                <div className="flex w-full bg-[#DDE2E9] p-4">
                  <p className="text-[#384860]">BASIC INFO</p>
                </div>
                <div className="mt-4 flex w-full justify-between border-b pb-2">
                  <p className="text-[#384860]">Email</p>
                  <div className="flex items-center gap-2">
                    <Link href={`mailto:${employee.employeeEmail}`} className="text-[#202B3C]">
                      {employee.employeeEmail}
                    </Link>
                    <EditUserIcon />
                  </div>
                </div>
                <div className="mt-4 flex w-full justify-between border-b pb-2">
                  <p className="text-[#384860]">Employee ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[#202B3C]">{employee.userID}</p>
                  </div>
                </div>
                <div className="mt-4 flex w-full justify-between border-b pb-2">
                  <p className="text-[#384860]">Status</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${employee.isactive ? "text-[#27AE60]" : "text-[#D82E2E]"}`}>
                      {employee.isactive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-col justify-between gap-4">
                  <p className="text-[#384860]">Socials</p>
                  <div className="flex items-center gap-2">
                    <Link
                      href="#"
                      className="group flex h-11 w-11 items-center justify-center rounded-md bg-[#E6E9EE] transition-all duration-200 ease-in-out hover:bg-[#ffe8d1]"
                    >
                      <LinkedInIcon className="group-hover:fill-[#f58634]" />
                    </Link>
                    <Link
                      href="#"
                      className="group flex h-11 w-11 items-center justify-center rounded-md bg-[#E6E9EE] transition-all duration-200 ease-in-out hover:bg-[#ffe8d1]"
                    >
                      <TwitterIcon className="group-hover:fill-[#f58634]" />
                    </Link>
                    <Link
                      href="#"
                      className="group flex h-11 w-11 items-center justify-center rounded-md bg-[#E6E9EE] transition-all duration-200 ease-in-out hover:bg-[#ffe8d1]"
                    >
                      <FacebookIcon className="group-hover:fill-[#f58634]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActivateEmployeeModal
        isOpen={isActivateModalOpen}
        onRequestClose={() => setIsActivateModalOpen(false)}
        onSuccess={() => {
          // Optional: refresh employee list or show toast
          setIsActivateModalOpen(false)
        }}
        employeeEmail={employee.employeeEmail} // Add this line
      />

      <GenerateReceiptmodal
        isOpen={isReceiptModalOpen}
        onRequestClose={() => setIsReceiptModalOpen(false)}
        onConfirm={confirmFreezeAccount}
        loading={isFreezing}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onRequestClose={() => setIsChangePasswordModalOpen(false)}
        employeeId={employee.userID}
        onSuccess={() => {
          // Optional: refresh employee data or show success message
        }}
      />

      <ChangeRoleModal
        isOpen={isRoleModalOpen}
        onRequestClose={() => setIsRoleModalOpen(false)}
        onSuccess={() => {
          // Optional: You might want to refetch employee details here
          // Or trigger a refresh of the employee list
        }}
        employeeId={employee.userID}
        currentRoleId={employee.employeeRoleID}
        currentRoleName={employee.userRoleName}
      />
    </section>
  )
}
