// components/Modals/CalculateDebitFeeModal.tsx
"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import { useLazyCalculateFeeQuery } from "lib/redux/feesApi"
import { notify } from "../Notification/Notification"

interface CalculateDebitFeeModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

const CalculateDebitFeeModal: React.FC<CalculateDebitFeeModalProps> = ({ isOpen, onRequestClose }) => {
  const [amount, setAmount] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [calculateDebitFee, { data, isFetching }] = useLazyCalculateFeeQuery()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (amount <= 0) newErrors.amount = "Amount must be greater than 0"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = async () => {
    if (!validateForm()) return

    try {
      await calculateDebitFee(amount)
    } catch (err) {
      notify("error", "Calculation failed", {
        description: "An error occurred while calculating debit fee",
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[450px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Calculate Debit Fees</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="mt-3 grid gap-3 px-4 pb-6">
        <FormInputModule
          label="Transaction Amount (₦)"
          type="number"
          placeholder="Enter transaction amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {data?.data && (
          <div className="mt-4 space-y-3 rounded-md border p-4">
            <h3 className="text-md font-semibold">Debit Fee Breakdown</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Fee:</span>
              <span className="font-medium">₦{data.data.bankFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Switch Fee:</span>
              <span className="font-medium">₦{data.data.switchFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (7.5%):</span>
              <span className="font-medium">₦{data.data.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Fee:</span>
              <span className="font-medium">₦{data.data.totalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span className="text-gray-700">Total Amount with Fee:</span>
              <span className="text-primary">₦{(amount + data.data.feeWithVAT).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <ButtonModule variant="primary" size="lg" className="w-full" onClick={handleCalculate} disabled={isFetching}>
          {isFetching ? (
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
              Calculating...
            </div>
          ) : (
            "Calculate Debit Fee"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default CalculateDebitFeeModal
