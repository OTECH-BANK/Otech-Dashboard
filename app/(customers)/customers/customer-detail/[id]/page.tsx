// src/pages/customers/customer-detail/[id].tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  type Account,
  type Business,
  type CustomerResponseItem,
  type Customer as CustomerType,
  useGetCustomerDetailsQuery,
} from "lib/redux/customerApi"

import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"

import { ButtonModule } from "components/ui/Button/Button"
import ActivateCustomerModal from "components/ui/Modal/activate-customer-modal"
import DeactivateCustomerModal from "components/ui/Modal/freeze-account-modal"
import DeleteCustomerModal from "components/ui/Modal/delete-customer-modal"

const CustomerDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const rawId = params?.id ?? ""
  const customerID = Number(rawId)

  // Local fallback if we navigated here directly (e.g. from localStorage)
  const [storedCustomer, setStoredCustomer] = useState<CustomerType | null>(null)
  const [storedBusiness, setStoredBusiness] = useState<Business | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedCustomer")
      if (raw) {
        // Cast the parsed JSON to CustomerType
        const parsed = JSON.parse(raw) as CustomerType
        setStoredCustomer(parsed)

        // If the stored object has a “business” property, keep it
        if ((parsed as any).business) {
          setStoredBusiness((parsed as any).business)
        }
      }
    } catch (e) {
      console.warn("Could not parse selectedCustomer from localStorage:", e)
    }
  }, [])

  // Fire off RTK Query
  const {
    data: customerDetailsResponse,
    isLoading,
    isError,
    error,
  } = useGetCustomerDetailsQuery(customerID, {
    skip: isNaN(customerID),
  })

  // Once RTK Query returns, pull out “live” fields
  const [liveCustomer, setLiveCustomer] = useState<CustomerType | null>(null)
  const [liveAccounts, setLiveAccounts] = useState<Account[]>([])
  const [liveBusiness, setLiveBusiness] = useState<Business | null>(null)

  useEffect(() => {
    if (customerDetailsResponse && customerDetailsResponse.data) {
      const item: CustomerResponseItem = customerDetailsResponse.data
      setLiveCustomer(item.customer)
      setLiveAccounts(item.accounts)
      setLiveBusiness(item.business)
    }
  }, [customerDetailsResponse])

  // If “liveCustomer” exists, use it; otherwise, fallback to storedCustomer
  const isUsingAPIData = Boolean(liveCustomer)
  const customer = isUsingAPIData ? liveCustomer : storedCustomer

  // If we have live data, use its .accounts array. Otherwise, an empty array.
  const accounts = isUsingAPIData ? liveAccounts : []

  // For business, use API’s version if available; otherwise fallback
  const business = isUsingAPIData ? liveBusiness : storedBusiness

  // Modal state
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleActivateSuccess = () => {
    /* optionally re-fetch / invalidate */
  }
  const handleDeactivateSuccess = () => {
    /* optionally re-fetch / invalidate */
  }

  if (isLoading && !customer) {
    return <div className="p-4">Loading customer details...</div>
  }

  if ((isError && !customer) || (!isLoading && !customer)) {
    return (
      <div className="p-4 text-red-600">
        Error loading customer details: {(error as any)?.message ?? "Unknown error"}
      </div>
    )
  }

  if (!customer) {
    // Safety guard; should not happen if the above checks pass
    return <div className="p-4">No customer data available.</div>
  }

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

          {/* Main Content: pass customer, accounts, business into CustomerInfo */}
          <div className="mt-8 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3">
            <div className="w-full">
              <CustomerInfo customer={customer} accounts={accounts} business={business} />
            </div>
          </div>
        </div>
      </div>

      {/* Activate Customer Modal */}
      <ActivateCustomerModal
        isOpen={isActivateModalOpen}
        onRequestClose={() => setIsActivateModalOpen(false)}
        onSuccess={handleActivateSuccess}
        customerId={customer.customerID}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />

      {/* Deactivate (Freeze) Customer Modal */}
      <DeactivateCustomerModal
        isOpen={isDeactivateModalOpen}
        onRequestClose={() => setIsDeactivateModalOpen(false)}
        onSuccess={handleDeactivateSuccess}
        // Note: this “id” prop expects the GUID (`customer.id`), not the numeric customerID
        customerId={customer.id}
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
