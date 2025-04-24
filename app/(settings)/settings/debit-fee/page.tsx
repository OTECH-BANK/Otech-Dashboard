"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import FinanceChart from "components/Chart/FinanceChart"

import TotalAssets from "public/total-assets"
import TransactionIcon from "public/transaction-icon"
import AccountIcon from "public/accounts-icon"
import WarningIcon from "public/warning-icon"
import CustomerIcon from "public/customer-icon"
import { ButtonModule } from "components/ui/Button/Button"
import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import TransactionTable from "components/Tables/TransactionTable"
import DebitFeesTable from "components/Tables/DebitFeesTable"
import AddBusiness from "public/add-business"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function Dashboard() {
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium">Debit Feees</p>
              {/* Replacing the previous button group with the real-time exchange rates marquee */}
              <ButtonModule
                variant="primary"
                size="md"
                icon={<AddBusiness />}
                iconPosition="start"
                // onClick={() => setIsAddBusinessModalOpen(true)}
              >
                Add New Fee
              </ButtonModule>
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <DebitFeesTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
