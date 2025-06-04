"use client"

import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"

import { useChangeEmployeeRoleMutation, useGetRolesQuery } from "lib/redux/employeeApi"
import { notify } from "../Notification/Notification"
import { FormSelectModule } from "../Input/FormSelectModule"

interface RoleOption {
  id: number
  title: string
  description: string
}

interface ChangeRoleModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
  employeeId: string
  currentRoleId: number
  currentRoleName: string
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onRequestClose,
  onSuccess,
  employeeId,
  currentRoleId,
  currentRoleName,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number>(currentRoleId)
  const [error, setError] = useState("")
  const [changeRole, { isLoading }] = useChangeEmployeeRoleMutation()

  // Fetch available roles
  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery()

  // Reset selected role when modal opens or current role changes
  useEffect(() => {
    setSelectedRoleId(currentRoleId)
  }, [currentRoleId, isOpen])

  const handleSubmit = async () => {
    if (!selectedRoleId) {
      setError("Please select a role")
      notify("error", "Role change failed", {
        description: "Please select a role",
      })
      return
    }

    if (selectedRoleId === currentRoleId) {
      setError("Please select a different role")
      notify("error", "Role change failed", {
        description: "Please select a different role",
      })
      return
    }

    try {
      const response = await changeRole({
        userId: employeeId,
        newRoleId: selectedRoleId,
      }).unwrap()

      if (response.succeeded) {
        const newRoleName = rolesData?.data.find((r) => r.id === selectedRoleId)?.title || selectedRoleId.toString()
        notify("success", "Role changed", {
          description: `Role has been successfully updated to ${newRoleName}`,
        })
        if (onSuccess) onSuccess()
        onRequestClose()
      } else {
        setError(response.message || "Failed to change role")
        notify("error", "Role change failed", {
          description: response.message || "Failed to change role",
        })
      }
    } catch (err) {
      setError("An error occurred while changing role")
      notify("error", "Role change failed", {
        description: "An error occurred while changing role",
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 h-[320px] w-[400px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Change Role</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <div className="mb-4">
          <p className="mt-3 text-sm text-gray-600">
            Current Role: <span className="font-medium">{currentRoleName}</span>
          </p>
        </div>

        {isRolesLoading ? (
          <div className="mb-4">Loading roles...</div>
        ) : (
          <FormSelectModule
            label="Select New Role"
            options={
              rolesData?.data.map((role) => ({
                value: role.id.toString(),
                label: role.title,
              })) || []
            }
            value={selectedRoleId.toString()}
            onChange={(e) => {
              setSelectedRoleId(Number(e.target.value))
              setError("")
            }}
            className="mb-4"
            name={""}
          />
        )}

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <div className="mt-auto flex justify-end gap-4">
          <ButtonModule className="w-full" variant="outline" size="lg" onClick={onRequestClose}>
            Cancel
          </ButtonModule>
          <ButtonModule
            variant="primary"
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading || isRolesLoading || selectedRoleId === currentRoleId}
          >
            {isLoading ? (
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update Role"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default ChangeRoleModal
