"use client"
import React, { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"
import { useMakeAdminMutation } from "lib/redux/otechplusApi"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"

interface EditAdminPermissionsModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess: () => void
  adminId: number
  adminName: string
  currentPermissions: number[]
}

const permissionOptions = [
  { id: 1, label: "User Management", name: "UserMgt" },
  { id: 2, label: "Business Management", name: "BusinessMgt" },
  { id: 3, label: "Report Management", name: "ReportMgt" },
  { id: 4, label: "Admin Management", name: "AdminMgt" },
  { id: 5, label: "System Management", name: "SystemMgt" },
]

export default function EditAdminPermissionsModal({
  isOpen,
  onRequestClose,
  onSuccess,
  adminId,
  adminName,
  currentPermissions,
}: EditAdminPermissionsModalProps) {
  const [makeAdmin, { isLoading }] = useMakeAdminMutation()
  const [permissions, setPermissions] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setPermissions(currentPermissions)
      setError(null)
    }
  }, [isOpen, currentPermissions])

  const handlePermissionChange = (permissionId: number) => {
    setPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSubmit = async () => {
    if (permissions.length === 0) {
      setError("Please select at least one permission")
      notify("error", "Please select at least one permission")
      return
    }

    try {
      await makeAdmin({
        userId: adminId,
        permissions,
      }).unwrap()

      notify("success", "Permissions updated successfully", {
        description: `${adminName}'s permissions have been updated`,
        duration: 5000,
      })

      onSuccess()
      onRequestClose()
    } catch (err) {
      const errorMessage = "Failed to update permissions. Please try again."
      setError(errorMessage)
      notify("error", errorMessage, {
        description: "An error occurred while updating permissions",
        duration: 5000,
      })
      console.error("Permission update error:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded-md bg-white p-6 max-sm:w-full sm:min-w-[500px]">
        <button
          onClick={onRequestClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 hover:bg-gray-200"
        >
          <IoClose size={20} />
        </button>

        <h2 className="mb-4 text-xl font-semibold">Edit Admin Permissions</h2>
        <p className="mb-6">
          Updating permissions for: <span className="font-medium">{adminName}</span>
        </p>

        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium">Select Permissions</h3>
          {permissionOptions.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={`perm-${option.id}`}
                checked={permissions.includes(option.id)}
                onChange={() => handlePermissionChange(option.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <label htmlFor={`perm-${option.id}`} className="ml-2">
                {option.label}
              </label>
            </div>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <ButtonModule variant="outline" onClick={onRequestClose} disabled={isLoading}>
            Cancel
          </ButtonModule>
          <ButtonModule variant="black" onClick={handleSubmit}>
            Save Changes
          </ButtonModule>
        </div>
      </div>
    </div>
  )
}
