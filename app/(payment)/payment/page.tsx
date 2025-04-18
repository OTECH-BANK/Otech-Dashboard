"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import { PaymentInfo } from "utils"
import PaymentTable from "components/Tables/PaymentTable"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function PreOrder() {
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex  w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b px-16 py-4">
              <p className="text-2xl font-medium">Payments</p>
              <div className="flex gap-4">
                <button className="button-oulined" type="button">
                  <img src="/DashboardImages/Export.png" alt="dekalo" className="icon-style" />
                  <img src="/DashboardImages/Export-dark.png" alt="dekalo" className="dark-icon-style " />
                  <p>Export Data</p>
                </button>
                <button className="button-oulined" type="button">
                  <img src="/DashboardImages/BellSimple.png" alt="dekalo" className="icon-style" />
                  <img src="/DashboardImages/BellSimple-dark.png" alt="dekalo" className="dark-icon-style" />
                  <p>Send Payment Reminder </p>
                </button>
                <button className="button-oulined" type="button">
                  <img src="/DashboardImages/MailStar.png" alt="dekalo" className="icon-style" />
                  <img src="/DashboardImages/MailStar-dark.png" alt="dekalo" className="dark-icon-style" />
                  <p>Start Email Campaign</p>
                </button>
              </div>
            </div>

            <div className="max-sm-my-4 flex w-full gap-6 px-16  max-md:flex-col max-md:px-0 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-6 max-lg:grid max-lg:grid-cols-2">
                  {PaymentInfo.map((account: PaymentAccount, index: number) => (
                    <div key={account.id} className="flex w-full cursor-pointer gap-2">
                      <div
                        // onClick={() => handlePaymentClick(account.id)}
                        className="small-card  rounded-md p-2 transition duration-500 md:border"
                      >
                        <div className=" flex items-center justify-between max-sm:mb-2">
                          <img src={account.src} width={32} height={32} alt="" />
                          <img src="/DashboardImages/CaretRight.png" alt="" className="icon-style" />
                          <img src="/DashboardImages/CaretRight-dark.png" alt="" className="dark-icon-style" />
                        </div>

                        <h5 className="my-2 font-medium text-[#727272]">{account.name}</h5>
                        <div className="flex items-end justify-between">
                          <div>
                            <h5 className="text-3xl font-medium max-sm:text-lg  ">{account.balance}</h5>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center justify-center gap-3 rounded-full bg-[#EEF5F0] px-4 py-2 text-[#589E67]">
                            <img src="/DashboardImages/TrendUp.png" />
                            <p className="text-xs font-medium">2.4%</p>
                            <p className="text-xs font-medium">From Last Month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <PaymentTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
