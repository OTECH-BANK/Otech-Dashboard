// components/Modals/ActivateEmployeeModal.tsx
"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import { useActivateEmployeeMutation } from "lib/redux/employeeApi"
import { notify } from "../Notification/Notification"

interface ActivateEmployeeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void // Optional success callback
  employeeEmail?: string // Add this line
}
const ActivateEmployeeModal: React.FC<ActivateEmployeeModalProps> = ({
  isOpen,
  onRequestClose,
  onSuccess,
  employeeEmail = "", // Add this with default value
}) => {
  const [email, setEmail] = useState(employeeEmail) // Use the prop as initial state
  const [activateEmployee, { isLoading }] = useActivateEmployeeMutation()
  const [error, setError] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError("")
  }

  const handleActivate = async () => {
    if (!email.trim()) {
      setError("Please enter an email address")
      notify("error", "Activation failed", {
        description: "Please enter an email address",
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      notify("error", "Activation failed", {
        description: "Please enter a valid email address",
      })
      return
    }

    try {
      const response = await activateEmployee({
        userEmail: email,
        isActive: true,
      }).unwrap()

      if (response.succeeded) {
        notify("success", "Employee activated", {
          description: "The employee has been successfully activated",
        })
        setEmail("")
        if (onSuccess) onSuccess()
        onRequestClose() // Close the modal after successful activation
      } else {
        setError(response.message || "Failed to activate employee")
        notify("error", "Activation failed", {
          description: response.message || "Failed to activate employee",
        })
      }
    } catch (err) {
      setError("An error occurred while activating the employee")
      notify("error", "Activation failed", {
        description: "An error occurred while activating the employee",
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[350px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Activate Employee</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <FormInputModule
          label="Employee Email"
          type="email"
          placeholder="Enter employee's email to activate"
          value={email}
          onChange={handleEmailChange}
          className="mb-4"
        />

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <div className="flex justify-end gap-4">
          <ButtonModule
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleActivate}
            disabled={!email.trim() || isLoading}
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
                Activating...
              </div>
            ) : (
              "Activate Employee"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default ActivateEmployeeModal
