// src/pages/CustomerDetailPage.tsx (or wherever this file lives)
"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"
import {
  useGetCustomerDetailsQuery,
  type CustomerResponseItem,
  type Account,
  type Customer as CustomerType,
} from "lib/redux/customerApi"
import { ButtonModule } from "components/ui/Button/Button"
import ActivateCustomerModal from "components/ui/Modal/activate-customer-modal"
import DeactivateCustomerModal from "components/ui/Modal/freeze-account-modal"
import DeleteCustomerModal from "components/ui/Modal/delete-customer-modal"

const CustomerDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const customerID = params?.id ? Number(params.id) : NaN

  // Use RTK Query to fetch the customer *with* its accounts
  const {
    data: customerDetailsResponse,
    isLoading,
    isError,
    error,
  } = useGetCustomerDetailsQuery(customerID, {
    // If you want to refetch on focus or polling, add additional options here
  })

  // Local state for modals
  const [isActivateModalOpen, setIsActivateModalOpen] = React.useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  // These handlers will update the UI only; if you want to re-query, just rely on RTK Query's cache invalidation
  const handleActivateSuccess = () => {
    // Optionally invalidate the query or rely on RTK Query’s invalidation
  }
  const handleDeactivateSuccess = () => {
    // Optionally invalidate the query or rely on RTK Query’s invalidation
  }

  if (isLoading) {
    return <div className="p-4">Loading customer details...</div>
  }

  if (isError || !customerDetailsResponse) {
    return (
      <div className="p-4 text-red-600">
        Error loading customer details: {/* `error` could be a FetchBaseQueryError or SerializedError */}
        {(error as any)?.message ?? "Unknown error"}
      </div>
    )
  }

  // The API shape is: CustomerDetailsResponse → { data: CustomerResponseItem, ... }
  const { data: customerItem } = customerDetailsResponse as {
    data: CustomerResponseItem
  }

  // Extract the nested pieces
  const customer: CustomerType = customerItem.customer
  const accounts: Account[] = customerItem.accounts ?? []
  const business = customerItem.business ?? null

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />

          {/* Header Bar */}
          <div className="flex justify-between border-b px-16 py-4 max-sm:flex-col max-sm:px-3">
            <div className="flex cursor-pointer items-center gap-2 whitespace-nowrap" onClick={() => router.back()}>
              <img src="/DashboardImages/ArrowLeft.png" alt="Back" className="icon-style" />
              <p className="font-medium md:text-2xl">
                {customer.firstName} {customer.lastName}
              </p>
            </div>

            <div className="flex gap-4 max-sm:pt-4">
              <ButtonModule variant="outline" size="md" iconPosition="end">
                Generate Statement
              </ButtonModule>

              {customer.customerStatus ? (
                <ButtonModule
                  variant="black"
                  size="md"
                  iconPosition="end"
                  onClick={() => setIsDeactivateModalOpen(true)}
                >
                  Freeze Account
                </ButtonModule>
              ) : (
                <ButtonModule variant="black" size="md" iconPosition="end" onClick={() => setIsActivateModalOpen(true)}>
                  Activate Customer
                </ButtonModule>
              )}

              <ButtonModule variant="danger" size="md" iconPosition="end" onClick={() => setIsDeleteModalOpen(true)}>
                Delete Customer
              </ButtonModule>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3">
            <div className="w-full">
              {/**
               * Pass BOTH `customer` and `accounts` (and optionally `business`)
               * to CustomerInfo so that it can display the Account Number.
               */}
              <CustomerInfo customer={customer} />
            </div>
          </div>
        </div>
      </div>
      z{/* Activate Customer Modal */}
      <ActivateCustomerModal
        isOpen={isActivateModalOpen}
        onRequestClose={() => setIsActivateModalOpen(false)}
        onSuccess={handleActivateSuccess}
        customerId={customer.customerID}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />
      {/* Deactivate Customer Modal */}
      <DeactivateCustomerModal
        isOpen={isDeactivateModalOpen}
        onRequestClose={() => setIsDeactivateModalOpen(false)}
        onSuccess={handleDeactivateSuccess}
        customerId={customer.id} // note: this is the GUID/id field
        customerName={`${customer.firstName} ${customer.lastName}`}
      />
      {/* Delete Customer Modal */}
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        customerId={customer.customerID}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />
    </section>
  )
}

export default CustomerDetailPage
