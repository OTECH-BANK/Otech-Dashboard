// src/app/dashboard/page.tsx
"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import AddBusiness from "public/add-business"
import DebitFeesTable from "components/Tables/DebitFeesTable"
import { useState } from "react"
import AddDebitFeeModal from "components/ui/Modal/add-debit-fees-modal"
import CalculateDebitFeeModal from "components/ui/Modal/calculate-debit-fee-modal"

export default function Dashboard() {
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false)
  const [isCalculateModalOpen, setIsCalculateModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    setIsAddFeeModalOpen(false)
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium">Debit Fees</p>
              <div className="flex gap-4">
                <ButtonModule
                  variant="primary"
                  size="md"
                  icon={<AddBusiness />}
                  iconPosition="start"
                  onClick={() => setIsAddFeeModalOpen(true)}
                >
                  Add New Fee
                </ButtonModule>
                <ButtonModule
                  variant="black"
                  size="md"
                  iconPosition="start"
                  onClick={() => setIsCalculateModalOpen(true)}
                >
                  Calculate Debit Fees
                </ButtonModule>
              </div>
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <DebitFeesTable refreshKey={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddDebitFeeModal
        isOpen={isAddFeeModalOpen}
        onRequestClose={() => setIsAddFeeModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <CalculateDebitFeeModal isOpen={isCalculateModalOpen} onRequestClose={() => setIsCalculateModalOpen(false)} />
    </section>
  )
}
