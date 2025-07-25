"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import IncomingIcon from "public/incoming-icon"
import OutgoingIcon from "public/outgoing-icon"
import UnresolvedTransactions from "public/unresolved-transactions"
import ArrowIcon from "public/arrow-icon"
import VirtualAccountsTable from "components/Tables/VirtualAccountsTable"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function AllTransactions() {
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4 max-sm:px-3">
              <p className="text-2xl font-medium">Virtual Accounts</p>
              {/* Replacing the previous button group with the real-time exchange rates marquee */}
              <ExchangeRateMarquee />
            </div>

            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <VirtualAccountsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
