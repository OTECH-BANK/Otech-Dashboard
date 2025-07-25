import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { VirtualAccount, useGetVirtualAccountByIdQuery } from "lib/redux/virtualAccountApi"
import { notify } from "../Notification/Notification"

interface VirtualAccountDetailModalProps {
  isOpen: boolean
  onRequestClose: () => void
  accountId: number | null
}

const VirtualAccountDetailModal: React.FC<VirtualAccountDetailModalProps> = ({ isOpen, onRequestClose, accountId }) => {
  const { data, isLoading, isError } = useGetVirtualAccountByIdQuery(accountId || 0, {
    skip: !accountId,
  })
  const [account, setAccount] = useState<VirtualAccount | null>(null)

  useEffect(() => {
    if (!data) return

    // The response should always be a VirtualAccount directly based on your API definition
    setAccount(data)
  }, [data])

  if (isError) {
    notify("error", "Failed to load", {
      description: "Could not load virtual account details",
    })
    onRequestClose()
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[400px] max-w-2xl overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Virtual Account Details</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 p-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex w-full flex-col gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex w-full justify-between">
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      ) : account ? (
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white">
              {account.firstName?.charAt(0)}
              {account.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {account.firstName} {account.lastName}
              </h3>
              <p className="text-gray-500">{account.accountNumber}</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Account ID</p>
              <p className="text-sm">{account.virtualAccountID}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Business</p>
              <p className="text-sm">{account.business}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm">{account.email}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-sm">{account.phoneNumber}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Account Number</p>
              <p className="text-sm">{account.accountNumber}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Bank</p>
              <p className="text-sm">{account.bank}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-sm">{account.amount.toLocaleString()}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm">{account.allowOverPay && account.allowUnderPay ? "Active" : "Restricted"}</p>
            </div>

            <div className="flex w-full justify-between">
              <p className="text-sm font-medium text-gray-500">Account Name</p>
              <p className="text-sm">{account.accountName}</p>
            </div>

            {account.expiryDate && (
              <div className="flex w-full justify-between">
                <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                <p className="text-sm">{new Date(account.expiryDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">No account data available</p>
        </div>
      )}

      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <ButtonModule variant="black" size="lg" className="w-full" onClick={onRequestClose}>
          Close
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default VirtualAccountDetailModal
