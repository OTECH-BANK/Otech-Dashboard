// components/Modals/AddDebitFeeModal.tsx
"use client"

import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import { useCreateDebitFeeMutation } from "lib/redux/feesApi"
import { notify } from "../Notification/Notification"

interface AddDebitFeeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
}

const AddDebitFeeModal: React.FC<AddDebitFeeModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [bankFee, setBankFee] = useState(0)
  const [switchFee, setSwitchFee] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createDebitFee, { isLoading }] = useCreateDebitFeeMutation()

  const resetForm = () => {
    setMin(0)
    setMax(0)
    setBankFee(0)
    setSwitchFee(0)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (min < 0) newErrors.min = "Minimum must be positive"
    if (max <= min) newErrors.max = "Maximum must be greater than minimum"
    if (bankFee < 0) newErrors.bankFee = "Bank fee must be positive"
    if (switchFee < 0) newErrors.switchFee = "Switch fee must be positive"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const response = await createDebitFee({
        min,
        max,
        bankFee,
        switchFee,
      }).unwrap()

      if (response.succeeded) {
        notify("success", "Fee created", {
          description: "The debit fee has been successfully created",
        })
        resetForm()
        if (onSuccess) onSuccess()
        onRequestClose()
      } else {
        notify("error", "Creation failed", {
          description: response.message || "Failed to create debit fee",
        })
      }
    } catch (err) {
      notify("error", "Creation failed", {
        description: "An error occurred while creating the fee",
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
        <h2 className="text-lg font-bold">Add New Debit Fee</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 px-4 pb-6">
        <FormInputModule
          label="Minimum Amount (₦)"
          type="number"
          placeholder="Enter minimum amount"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
        />

        <FormInputModule
          label="Maximum Amount (₦)"
          type="number"
          placeholder="Enter maximum amount"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
        />

        <FormInputModule
          label="Bank Fee (₦)"
          type="number"
          placeholder="Enter bank fee"
          value={bankFee}
          onChange={(e) => setBankFee(Number(e.target.value))}
        />

        <FormInputModule
          label="Switch Fee (₦)"
          type="number"
          placeholder="Enter switch fee"
          value={switchFee}
          onChange={(e) => setSwitchFee(Number(e.target.value))}
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
            "Create Fee"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default AddDebitFeeModal
