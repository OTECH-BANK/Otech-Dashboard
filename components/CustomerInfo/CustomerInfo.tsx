// src/components/CustomerInfo/CustomerInfo.tsx
import React from "react"
import { Customer, Account } from "lib/redux/customerApi"

interface CustomerInfoProps {
  customer: Customer
  accounts?: Account[]
  business?: any
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer, accounts = [], business = null }) => {
  // Log out everything we received from props
  console.log("CustomerInfo props →", {
    customer,
    accounts,
    business,
  })

  return (
    <div className="flex flex-col rounded-md border bg-white">
      <div className="flex justify-between gap-3 p-4 max-sm:flex-col">
        {/* Personal Information */}
        <div className="max-sm:border-b max-sm:pb-2 md:w-1/2 md:border-r">
          <div className="flex items-center gap-2">
            <p className="font-medium">Personal Information</p>
          </div>
          <div className="pr-3">
            <ul className="mt-5">
              <li className="li__style mt-3">
                Name: {customer.firstName} {customer.lastName}
              </li>
              <li className="li__style mt-3">Title: {customer.title || "N/A"}</li>
              <li className="li__style mt-3">Email: {customer.customerEmailAdd || "N/A"}</li>
              <li className="li__style mt-3">Mobile: {customer.mobile || "N/A"}</li>
              <li className="li__style mt-3">Phone: {customer.phoneNumber || "N/A"}</li>
              <li className="li__style mt-3">
                Date of Birth: {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : "N/A"}
              </li>
              <li className="li__style mt-3">Gender: {customer.gender || "N/A"}</li>
              <li className="li__style mt-3">Marital Status: {customer.maritalStatus || "N/A"}</li>
              <li className="li__style mt-3">Occupation: {customer.occupation || "N/A"}</li>
            </ul>
          </div>
        </div>

        {/* Address Information */}
        <div className="max-sm:border-b max-sm:pb-2 md:w-1/2 md:border-r">
          <div className="flex items-center gap-2">
            <p className="font-medium">Address Information</p>
          </div>
          <div className="pr-3">
            <ul className="mt-5">
              <li className="li__style mt-3">Address: {customer.customerAddress || "N/A"}</li>
              <li className="li__style mt-3">Building No: {customer.buildingNo || "N/A"}</li>
              <li className="li__style mt-3">Bus Stop: {customer.busStop || "N/A"}</li>
              <li className="li__style mt-3">Town: {customer.town || "N/A"}</li>
              <li className="li__style mt-3">Postal Code: {customer.postalCode || "N/A"}</li>
              <li className="li__style mt-3">LGA: {customer.lga?.stateLGAName || "N/A"}</li>
              <li className="li__style mt-3">State: {customer.state?.stateName || "N/A"}</li>
              <li className="li__style mt-3">Country: {customer.country?.countryName || "N/A"}</li>
              <li className="li__style mt-3">State of Origin: {customer.stateOfOrigin || "N/A"}</li>
            </ul>
          </div>
        </div>

        {/* Account & Identification */}
        <div className="max-sm:border-b max-sm:pb-2 md:w-1/2">
          <div className="flex items-center gap-2">
            <p className="font-medium">Account & Identification</p>
          </div>
          <div className="pr-3">
            <ul className="mt-5">
              <li className="li__style mt-3">Customer ID: {customer.customerID}</li>
              <li className="li__style mt-3">Bank: {customer.bankName || "N/A"}</li>
              <li className="li__style mt-3">Branch Code: {customer.branchCode || "N/A"}</li>
              <li className="li__style mt-3">Account Type: {customer.accountType || "N/A"}</li>
              <li className="li__style mt-3">BVN: {customer.bvnData || "N/A"}</li>
              <li className="li__style mt-3">NIN: {customer.ninData || "N/A"}</li>
              <li className="li__style mt-3">TIN: {customer.customerTIN || "N/A"}</li>
              <li className="li__style mt-3">ID Type: {customer.customerIDType?.identityTypeName || "N/A"}</li>
              <li className="li__style mt-3">ID Number: {customer.customerIDNo || "N/A"}</li>
              <li className="li__style mt-3">Registration Number: {customer.registrationNumber || "N/A"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      {accounts.length > 0 && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <p className="font-medium">Accounts ({accounts.length})</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Account Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Account Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Available Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {accounts.map((account) => (
                  <tr key={account.casaAccountID}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{account.accountNumber}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{account.accountTitle}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{account.productCode}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{account.currencyCode}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {account.availableBalance?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          account.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(account.dateOpened).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {account.lastTransDate ? new Date(account.lastTransDate).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Business Information (for corporate customers) */}
      {customer.customerTypeID === 3 && business && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <p className="font-medium">Business Information</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="font-medium">Company Details</p>
              <ul className="mt-2">
                <li className="li__style mt-2">Name: {business.name || "N/A"}</li>
                <li className="li__style mt-2">Brand Name: {business.brandName || "N/A"}</li>
                <li className="li__style mt-2">Registration Number: {business.registrationNumber || "N/A"}</li>
                <li className="li__style mt-2">App ID: {business.appId || "N/A"}</li>
                <li className="li__style mt-2">Website: {business.website || "N/A"}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">API & Integration</p>
              <ul className="mt-2">
                <li className="li__style mt-2">Callback URL: {business.callbackUrl || "N/A"}</li>
                <li className="li__style mt-2">HMAC Key: {business.hmacKey || "N/A"}</li>
                <li className="li__style mt-2">API Key Mask: {business.apiKeyMask || "N/A"}</li>
                <li className="li__style mt-2">
                  API Key Created:{" "}
                  {business.apiKeyCreationDate ? new Date(business.apiKeyCreationDate).toLocaleString() : "N/A"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Communication Preferences and Admin Details */}
      <div className="flex justify-between gap-3 border-t p-4 max-sm:flex-col">
        <div className="max-sm:border-b max-sm:pb-2 md:w-1/2 md:border-r">
          <p className="font-medium">Communication Preferences</p>
          <p className="li__style mt-2">Email alerts: {customer.emailAlert ? "Yes" : "No"}</p>
          <p className="li__style mt-2">SMS alerts: {customer.smsAlert ? "Yes" : "No"}</p>
        </div>

        <div className="md:w-1/2">
          <p className="font-medium">Admin Details</p>
          <ul className="mt-2">
            <li className="li__style mt-2">Created by: {customer.createBy || "N/A"}</li>
            <li className="li__style mt-2">
              Created on: {customer.createdate ? new Date(customer.createdate).toLocaleString() : "N/A"}
            </li>
            <li className="li__style mt-2">Last modified by: {customer.modifyBy || "N/A"}</li>
            <li className="li__style mt-2">
              Last modified on: {customer.modifydate ? new Date(customer.modifydate).toLocaleString() : "N/A"}
            </li>
            <li className="li__style mt-2">Approved by: {customer.approvedBy || "N/A"}</li>
            <li className="li__style mt-2">
              Approved on: {customer.approvedDate ? new Date(customer.approvedDate).toLocaleDateString() : "N/A"}
            </li>
            <li className="li__style mt-2">
              Status:{" "}
              <span className={`ml-1 ${customer.customerStatus ? "text-green-500" : "text-red-500"}`}>
                {customer.customerStatus ? "Active" : "Inactive"}
              </span>
            </li>
            <li className="li__style mt-2">
              Customer Type: {customer.customerTypeID === 1 ? "Individual" : "Corporate"}
            </li>
            <li className="li__style mt-2">Politically Exposed: {customer.isPoliticallyExposed ? "Yes" : "No"}</li>
            <li className="li__style mt-2">Foreigner: {customer.isForeigner ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomerInfo
