"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"

import { notify } from "../Notification/Notification"
import { useChangeEmployeePasswordMutation } from "lib/redux/employeeApi"
import { PasswordInputModule } from "../Input/PasswordInput"

interface ChangePasswordModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
  employeeId: string
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onRequestClose, onSuccess, employeeId }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [changePassword, { isLoading }] = useChangeEmployeePasswordMutation()

  const handleSubmit = async () => {
    // Reset error state
    setError("")

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      notify("error", "Password change failed", {
        description: "Please fill in all fields",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      notify("error", "Password change failed", {
        description: "New passwords do not match",
      })
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      notify("error", "Password change failed", {
        description: "Password must be at least 8 characters",
      })
      return
    }

    try {
      const response = await changePassword({
        userId: employeeId,
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap()

      if (response.succeeded) {
        notify("success", "Password changed", {
          description: "Password has been successfully updated",
        })
        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        // Close modal and call success callback
        if (onSuccess) onSuccess()
        onRequestClose()
      } else {
        setError(response.message || "Failed to change password")
        notify("error", "Password change failed", {
          description: response.message || "Failed to change password",
        })
      }
    } catch (err) {
      setError("An error occurred while changing password")
      notify("error", "Password change failed", {
        description: "An error occurred while changing password",
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[450px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Change Password</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <PasswordInputModule
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value)
            setError("")
          }}
          className="mb-4"
          error={!!error}
        />

        <PasswordInputModule
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            setError("")
          }}
          className="mb-4"
          error={!!error}
        />

        <PasswordInputModule
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setError("")
          }}
          className="mb-4"
          error={!!error}
        />

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <div className="flex justify-end gap-4">
          <ButtonModule className="w-full" variant="outline" size="lg" onClick={onRequestClose}>
            Cancel
          </ButtonModule>
          <ButtonModule
            className="w-full"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
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
              "Update Password"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
