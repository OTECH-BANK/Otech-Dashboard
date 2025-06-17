"use client"
import { useUpdateAdminPermissionsMutation } from "lib/redux/otechplusApi"
import React, { useState } from "react"
import { IoClose } from "react-icons/io5"
import { notify } from "components/ui/Notification/Notification"
import { ButtonModule } from "components/ui/Button/Button"

interface MakeAdminModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess: () => void
  userId: number
  customerName: string
}

const permissionOptions = [
  { id: 1, label: "User Management", name: "UserMgt" },
  { id: 2, label: "Business Management", name: "BusinessMgt" },
  { id: 3, label: "Report Management", name: "ReportMgt" },
  { id: 4, label: "Admin Management", name: "AdminMgt" },
  { id: 5, label: "System Management", name: "SystemMgt" },
]

const MakeAdminModal: React.FC<MakeAdminModalProps> = ({ isOpen, onRequestClose, onSuccess, userId, customerName }) => {
  const [makeAdmin, { isLoading }] = useUpdateAdminPermissionsMutation()
  const [permissions, setPermissions] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const handlePermissionChange = (permissionId: number) => {
    setPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSubmit = async () => {
    if (permissions.length === 0) {
      setError("Please select at least one permission")
      notify("error", "Permission selection required", {
        description: "Please select at least one permission to continue",
        duration: 5000,
      })
      return
    }

    setError(null)
    try {
      await makeAdmin({
        userId,
        permissions,
      }).unwrap()

      notify("success", "Admin permissions updated", {
        description: `${customerName} has been granted admin privileges`,
        duration: 5000,
      })

      onSuccess()
      onRequestClose()
    } catch (err) {
      setError("Failed to make user admin. Please try again.")
      notify("error", "Update failed", {
        description: "Failed to update admin permissions. Please try again.",
        duration: 5000,
      })
      console.error("Make admin error:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded-md bg-white p-6 max-sm:mx-4 max-sm:w-full sm:min-w-[500px]">
        <button
          onClick={onRequestClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 hover:bg-gray-200"
        >
          <IoClose size={20} />
        </button>

        <h2 className="mb-4 text-xl font-semibold">Make Admin</h2>
        <p className="mb-6 text-gray-600">
          Assign admin permissions to <span className="font-medium">{customerName}</span>
        </p>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Select Permissions</h3>
          <div className="space-y-2">
            {permissionOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`permission-${option.id}`}
                  checked={permissions.includes(option.id)}
                  onChange={() => handlePermissionChange(option.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`permission-${option.id}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <ButtonModule variant="outline" size="md" onClick={onRequestClose} disabled={isLoading}>
            Cancel
          </ButtonModule>
          <ButtonModule variant="black" size="md" onClick={handleSubmit}>
            Confirm
          </ButtonModule>
        </div>
      </div>
    </div>
  )
}

export default MakeAdminModal
