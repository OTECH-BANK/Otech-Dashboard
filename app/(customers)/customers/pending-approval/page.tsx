"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import InsightIcon from "public/insight-icon"
import IncomingIcon from "public/incoming-icon"
import OutgoingIcon from "public/outgoing-icon"
import UnresolvedTransactions from "public/unresolved-transactions"
import ArrowIcon from "public/arrow-icon"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import { useState } from "react"
import AddCustomerModal from "components/ui/Modal/add-customer-modal"
import PendingApproval from "components/Tables/PendingApproval"

export default function AllTransactions() {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-3 py-4 md:px-16">
              <p className="text-2xl font-medium">All Customers</p>
              {/* Replacing the previous button group with the real-time exchange rates marquee */}
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                onClick={() => setIsAddCustomerModalOpen(true)}
              >
                Add Customer
              </ButtonModule>
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <PendingApproval />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onRequestClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={() => {
          // You might want to refresh the customer list here
          console.log("Customer added successfully")
        }}
      />
    </section>
  )
}
