"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  type Account,
  type CustomerResponseItem,
  type Customer as CustomerType,
  useGetCustomerDetailsQuery,
} from "lib/redux/customerApi"
import ActivateCustomerModal from "components/ui/Modal/activate-customer-modal"

import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"
import DeactivateCustomerModal from "components/ui/Modal/freeze-account-modal"
import DeleteCustomerModal from "components/ui/Modal/delete-customer-modal"
import { ButtonModule } from "components/ui/Button/Button"

const CustomerDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const rawId = params?.id ?? ""
  const customerID = Number(rawId)

  // All hooks called unconditionally at the top
  const { data: response, isLoading, isError, error } = useGetCustomerDetailsQuery(customerID)
  const [isActivateModalOpen, setIsActivateModalOpen] = React.useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  // Early returns after hooks
  if (isNaN(customerID)) {
    return (
      <div className="p-4 text-red-600">
        Invalid customer ID:&nbsp;
        <strong>{rawId}</strong>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-4">Loading customer details...</div>
  }

  if (isError || !response?.data) {
    return (
      <div className="p-4 text-red-600">
        Error loading customer details: {(error as any)?.message ?? "Unknown error"}
      </div>
    )
  }

  const customerItem: CustomerResponseItem = response.data
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
              <CustomerInfo customer={customer} accounts={accounts} business={business} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ActivateCustomerModal
        isOpen={isActivateModalOpen}
        onRequestClose={() => setIsActivateModalOpen(false)}
        onSuccess={() => {}}
        customerId={customer.customerID}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />

      <DeactivateCustomerModal
        isOpen={isDeactivateModalOpen}
        onRequestClose={() => setIsDeactivateModalOpen(false)}
        onSuccess={() => {}}
        customerId={customer.id}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />

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
