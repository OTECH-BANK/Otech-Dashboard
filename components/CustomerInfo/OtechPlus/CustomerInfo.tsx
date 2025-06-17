import { CustomerDetails, Kyc, OtechVA, Wallet } from "lib/redux/otechplusApi"

interface CustomerInfoProps {
  customer: CustomerDetails
  virtualAccount: OtechVA | null
  wallets: Wallet[]
  kycInfo: Kyc
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer, virtualAccount, wallets, kycInfo }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Personal Info Section */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
        <div className="space-y-4">
          <InfoRow label="Full Name" value={`${customer.firstName || ""} ${customer.lastName || ""}`} />
          <InfoRow label="Email" value={customer.email || "N/A"} />
          <InfoRow label="Phone" value={customer.phoneNumber} />
          <InfoRow label="Status" value={customer.status?.label || "N/A"} />
          <InfoRow label="Level" value={customer.level?.label || "N/A"} />
          <InfoRow label="BVN Verified" value={customer.isBvnVerified ? "Yes" : "No"} />
        </div>
      </div>

      {/* Virtual Account Section */}
      {virtualAccount && (
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Virtual Account</h3>
          <div className="space-y-4">
            <InfoRow label="Account Number" value={virtualAccount.accountNumber} />
            <InfoRow label="Account Name" value={virtualAccount.accountName} />
            <InfoRow label="Bank" value={virtualAccount.bank} />
          </div>
        </div>
      )}

      {/* Wallets Section */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Wallets</h3>
        {wallets.map((wallet) => (
          <div key={wallet.id} className="mb-4 space-y-2 border-b pb-4 last:border-b-0">
            <InfoRow label="Wallet Name" value={wallet.title} />
            <InfoRow label="Balance" value={`₦${wallet.balance.toLocaleString()}`} />
            <InfoRow label="Ledger Balance" value={`₦${wallet.ledgerBalance.toLocaleString()}`} />
          </div>
        ))}
      </div>

      {/* KYC Section */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">KYC Information</h3>
        <div className="space-y-4">
          <InfoRow label="KYC Status" value={kycInfo.kycStatus?.label || "N/A"} />
          <InfoRow label="KYC Type" value={kycInfo.kycType?.label || "N/A"} />
          {kycInfo.documentNumber && <InfoRow label="Document Number" value={kycInfo.documentNumber} />}
        </div>
      </div>
    </div>
  )
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default CustomerInfo
