// components/Modals/AddCustomerTypeModal.tsx
"use client"

import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import { useCreateCustomerTypeMutation } from "lib/redux/customerTypeApi"
import { notify } from "../Notification/Notification"

interface AddCustomerTypeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
}

const AddCustomerTypeModal: React.FC<AddCustomerTypeModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const [customerTypeName, setCustomerTypeName] = useState("")
  const [customerTypeCode, setCustomerTypeCode] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createCustomerType, { isLoading }] = useCreateCustomerTypeMutation()

  const resetForm = () => {
    setCustomerTypeName("")
    setCustomerTypeCode("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customerTypeName.trim()) newErrors.customerTypeName = "Customer type name is required"
    if (!customerTypeCode.trim()) newErrors.customerTypeCode = "Customer type code is required"
    if (customerTypeCode.length > 10) newErrors.customerTypeCode = "Code must be 10 characters or less"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const response = await createCustomerType({
        customerTypeName,
        customerTypeCode,
      }).unwrap()

      if (response.succeeded) {
        notify("success", "Customer type created", {
          description: "The customer type has been successfully created",
        })
        resetForm()
        if (onSuccess) onSuccess()
        onRequestClose()
      } else {
        notify("error", "Creation failed", {
          description: response.message || "Failed to create customer type",
        })
      }
    } catch (err) {
      notify("error", "Creation failed", {
        description: "An error occurred while creating the customer type",
      })
    }
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[450px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Add New Customer Type</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="mt-3 grid gap-3 px-4 pb-6">
        <FormInputModule
          label="Customer Type Name"
          type="text"
          placeholder="Enter customer type name"
          value={customerTypeName}
          onChange={(e) => setCustomerTypeName(e.target.value)}
        />

        <FormInputModule
          label="Customer Type Code"
          type="text"
          placeholder="Enter customer type code"
          value={customerTypeCode}
          onChange={(e) => setCustomerTypeCode(e.target.value)}
        />
      </div>
      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <ButtonModule variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={isLoading}>
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
              Creating...
            </div>
          ) : (
            "Create Customer Type"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default AddCustomerTypeModal
