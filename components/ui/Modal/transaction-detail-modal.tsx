// src/components/ui/Modal/transaction-detail-modal.tsx
"use client"

import React, { useRef } from "react"
import Modal from "react-modal"
import { MdClose } from "react-icons/md"
import { ButtonModule } from "components/ui/Button/Button"
import PdfFile from "public/pdf-file"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { useGetTransactionDetailsQuery } from "lib/redux/transactionApi"

interface TransactionDetailModalProps {
  isOpen: boolean
  transactionID: number | null
  onRequestClose: () => void
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, transactionID, onRequestClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Only fetch if modal is open and we have a valid ID
  const {
    data: detailsResponse,
    error,
    isLoading,
  } = useGetTransactionDetailsQuery(transactionID ?? 0, {
    skip: !isOpen || transactionID === null,
  })

  // Helper: map the numeric status code to a human-readable string
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "Pending"
      case 2:
        return "Processing"
      case 3:
        return "Completed"
      case 4:
        return "Failed"
      case 5:
        return "Reversed"
      default:
        return "Unknown"
    }
  }

  // Helper: return a style object (background, color, etc.) based on status text
  const getStatusStyle = (statusText: string) => {
    switch (statusText) {
      case "Completed":
        return {
          backgroundColor: "#EEF5F0",
          color: "#589E67",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      case "Pending":
      case "Processing":
        return {
          backgroundColor: "#FBF4EC",
          color: "#D28E3D",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      case "Failed":
        return {
          backgroundColor: "#F7EDED",
          color: "#AF4B4B",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      case "Reversed":
        return {
          backgroundColor: "#F4EDF7",
          color: "#954BAF",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      default:
        return {
          backgroundColor: "#EDF2FE",
          color: "#4976F4",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
    }
  }

  // Download a PDF of the modal's contents
  const handleDownloadPDF = async () => {
    if (!modalRef.current) return

    try {
      const canvas = await html2canvas(modalRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Otech_Transaction_${transactionID}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  // Trigger window.print() to print the current modal view
  const handlePrint = () => {
    window.print()
  }

  // If modal is closed, don't render anything
  if (!isOpen) return null

  // Show a skeleton loading state
  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="flex h-auto w-[481px] overflow-hidden rounded-md bg-white shadow-lg outline-none max-sm:w-full max-sm:max-w-[380px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="w-full">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between bg-[#ffe8d1] p-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-6 w-32 animate-pulse rounded bg-gray-300"></div>
            </div>
            <div className="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
          </div>

          {/* Top summary Skeleton */}
          <div className="flex w-full flex-col items-center justify-center bg-gray-50 p-4">
            <div className="h-5 w-64 animate-pulse rounded bg-gray-300"></div>
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-300"></div>
            <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-300"></div>
          </div>

          {/* Detailed fields Skeleton */}
          <div className="space-y-4 p-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex w-full justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
              </div>
            ))}

            {/* Actions Skeleton */}
            <div className="mt-8 flex justify-between">
              <div className="h-10 w-36 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 w-24 animate-pulse rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  // Show an error if something went wrong
  if (error || !detailsResponse?.data) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="flex h-auto w-[481px] overflow-hidden rounded-md bg-white shadow-lg outline-none max-sm:w-full max-sm:max-w-[380px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="p-6 text-center">
          <p className="text-lg font-medium text-red-600">Failed to load transaction details.</p>
          <button
            onClick={onRequestClose}
            className="bg-primary hover:bg-primary-dark mt-4 inline-block rounded-md px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      </Modal>
    )
  }

  // At this point, we have data
  const txn = detailsResponse.data
  const statusText = getStatusText(txn.transactionStatus)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex h-auto w-[481px] overflow-hidden rounded-md bg-white shadow-lg outline-none max-sm:w-full max-sm:max-w-[380px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div ref={modalRef} className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#ffe8d1] p-4">
          <div className="flex items-center justify-center gap-2">
            <img src="/otech logo.svg" alt="logo" className="h-7 w-7" />
            <p className="text-xl font-semibold text-[#2a2f4b]">Otech MFB</p>
          </div>
          <button onClick={onRequestClose} className="cursor-pointer text-gray-600 hover:text-gray-800">
            <MdClose size={24} />
          </button>
        </div>

        {/* Top summary */}
        <div className="flex w-full flex-col items-center justify-center bg-gray-50 p-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold">
              {txn.currency} {txn.transactionAmount}
            </span>{" "}
            to {txn.beneficiaryAccountName} from {txn.initiatorAccountName}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Initiated on{" "}
            {new Date(txn.transactionDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div style={getStatusStyle(statusText)} className="mt-2 inline-block text-sm font-medium">
            {statusText}
          </div>
        </div>

        {/* Detailed fields */}
        <div className="space-y-4 p-6">
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Transaction ID:</p>
            <p className="text-gray-800">{txn.transactionReference}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Initiator Name:</p>
            <p className="text-gray-800">{txn.initiatorAccountName}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Initiator Account No.:</p>
            <p className="text-gray-800">{txn.initiatorAccountNumber}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Beneficiary Name:</p>
            <p className="text-gray-800">{txn.beneficiaryAccountName}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Beneficiary Account No.:</p>
            <p className="text-gray-800">{txn.beneficiaryAccountNumber}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Beneficiary Bank Code:</p>
            <p className="text-gray-800">{txn.beneficiaryIssuerCode}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Narration:</p>
            <p className="text-gray-800">{txn.narration || "-"}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Channel:</p>
            <p className="text-gray-800">{txn.channel}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Fee:</p>
            <p className="text-gray-800">{txn.fee}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">VAT:</p>
            <p className="text-gray-800">{txn.vat}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Electronic Levy:</p>
            <p className="text-gray-800">{txn.electronicLevy}</p>
          </div>

          {/* Actions: Download PDF + Print */}
          <div className="mt-8 flex justify-between">
            <ButtonModule
              variant="outline"
              size="md"
              icon={<PdfFile />}
              iconPosition="start"
              onClick={handleDownloadPDF}
              className="border-gray-300 hover:bg-gray-50"
            >
              Download Pdf
            </ButtonModule>
            <ButtonModule
              variant="outline"
              size="md"
              icon={<PdfFile />}
              iconPosition="start"
              onClick={handlePrint}
              className="border-gray-300 hover:bg-gray-50"
            >
              Print
            </ButtonModule>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TransactionDetailModal
