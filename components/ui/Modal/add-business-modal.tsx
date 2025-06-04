"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import {
  CreateBusinessPayload,
  useGetCustomerTypesQuery,
  useGetIdentityTypesQuery,
  useGetProductTypesQuery,
} from "lib/redux/api"
import { useGetStatesQuery, useGetLGAsByStateQuery } from "lib/redux/api"
import { FormSelectModule } from "../Input/FormSelectModule"
import { useCreateBusinessMutation } from "lib/redux/api"
import { notify } from "../Notification/Notification"

interface AddBusinessModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void // Callback for successful creation
}

const AddBusinessModal: React.FC<AddBusinessModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const { data: productTypesData } = useGetProductTypesQuery()
  const { data: customerTypesData } = useGetCustomerTypesQuery()
  const { data: identityTypesData } = useGetIdentityTypesQuery()
  const [createBusiness, { isLoading }] = useCreateBusinessMutation()
  const [businessData, setBusinessData] = useState<CreateBusinessPayload>({
    corporateName: "",
    headOfficeAddress: "",
    headOfficeLgaName: "",
    headOfficeStateName: "",
    countryName: "Nigeria",
    officialEmailAddress: "",
    officialPhoneNO: "",
    dateIncorporated: new Date().toISOString(),
    officialSignatures: "",
    taxIdentificationNumber: "",
    registrationNumber: "",
    openingAmount: 0,
    accountProductTypeID: 0,
    referral: "",
    accountGroup: "",
    accountType: "",
    accountCurrency: "Naira",
    customerTypeID: 0,
    identityTypeID: 0,
    business: {
      brandName: "",
      logo: "",
      website: "",
      callbackUrl: "",
      depositFeePercent: 0,
      depositFeeFlat: 0,
      depositFeeCap: 0,
    },
  })

  // Fetch states
  const { data: statesData } = useGetStatesQuery()
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null)
  const [selectedStateName, setSelectedStateName] = useState<string>("")

  // Fetch LGAs based on selected state
  const { data: lgasData, isFetching: isFetchingLGAs } = useGetLGAsByStateQuery(selectedStateId as number, {
    skip: !selectedStateId,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    // Type guard to check if it's a React change event
    const isReactEvent = (event: any): event is React.ChangeEvent<HTMLInputElement | HTMLSelectElement> => {
      return event.target && "name" in event.target && "value" in event.target
    }

    // Extract name and value safely
    const name = isReactEvent(e) ? e.target.name : e.target.name
    const value = isReactEvent(e) ? e.target.value : e.target.value

    if (name === "headOfficeStateName") {
      const selectedState = statesData?.data.find((state) => state.stateName === value)
      if (selectedState) {
        setSelectedStateId(selectedState.stateID)
        setSelectedStateName(selectedState.stateName)
        setBusinessData((prev) => ({
          ...prev,
          headOfficeStateName: selectedState.stateName,
          headOfficeLgaName: "",
        }))
      }
      return
    }

    if (name in businessData.business) {
      setBusinessData((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          [name]: value,
        },
      }))
    } else {
      setBusinessData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseFloat(value) || 0

    if (name in businessData.business) {
      setBusinessData((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          [name]: numValue,
        },
      }))
    } else {
      setBusinessData((prev) => ({
        ...prev,
        [name]: numValue,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1] || ""
        setBusinessData((prev) => ({
          ...prev,
          officialSignatures: base64String,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await createBusiness(businessData).unwrap()
      if (response.succeeded) {
        notify("success", "Business created successfully!", {
          title: "Success",
          description: "The business has been successfully created.",
        })
        onRequestClose()
        if (onSuccess) onSuccess()
      } else {
        notify("error", "Failed to create business", {
          title: "Error",
          description: response.message || "Please check your input and try again.",
        })
      }
    } catch (error: any) {
      console.error("Failed to create business:", error)
      notify("error", "Failed to create business", {
        title: "Error",
        description: error.data?.message || "An unexpected error occurred. Please try again.",
      })
    }
  }

  const requiredFieldsFilled = () => {
    return (
      businessData.corporateName.trim() &&
      businessData.headOfficeAddress.trim() &&
      businessData.headOfficeStateName.trim() &&
      businessData.headOfficeLgaName.trim() &&
      businessData.officialEmailAddress.trim() &&
      businessData.officialPhoneNO.trim() &&
      businessData.officialSignatures.trim() &&
      businessData.business.brandName.trim()
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="min-w-[1000px] max-w-4xl overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto flex items-center justify-center p-4"
    >
      <div className="flex h-[90vh] flex-col">
        <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-[#F5F8FA] p-4">
          <h2 className="text-lg font-bold">Add New Business</h2>
          <div onClick={onRequestClose} className="cursor-pointer">
            <CloseIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-6">
            <h3 className="col-span-2 mt-5 border-b text-lg font-semibold">Corporate Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormInputModule
                label="Corporate Name"
                type="text"
                name="corporateName"
                placeholder="Enter corporate name"
                value={businessData.corporateName}
                onChange={handleChange}
                required
              />

              {/* Rest of your form fields remain the same */}
              <FormInputModule
                label="Head Office Address"
                type="text"
                name="headOfficeAddress"
                placeholder="Enter head office address"
                value={businessData.headOfficeAddress}
                onChange={handleChange}
                required
              />

              {statesData && (
                <FormSelectModule
                  label="State"
                  name="headOfficeStateName"
                  value={businessData.headOfficeStateName}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "", label: "Select State" },
                    ...statesData.data.map((state) => ({
                      value: state.stateName,
                      label: state.stateName,
                    })),
                  ]}
                />
              )}

              <FormSelectModule
                label="LGA"
                name="headOfficeLgaName"
                value={businessData.headOfficeLgaName}
                onChange={handleChange}
                required
                disabled={!selectedStateId || isFetchingLGAs}
                options={[
                  { value: "", label: isFetchingLGAs ? "Loading LGAs..." : "Select LGA" },
                  ...(lgasData?.data?.map((lga) => ({
                    value: lga.stateLGAName,
                    label: lga.stateLGAName,
                  })) || []),
                ]}
              />

              <FormInputModule
                label="Country Name"
                type="text"
                name="countryName"
                placeholder="Enter country name"
                value={businessData.countryName}
                onChange={handleChange}
                disabled
              />

              <FormInputModule
                label="Official Email"
                type="email"
                name="officialEmailAddress"
                placeholder="Enter official email"
                value={businessData.officialEmailAddress}
                onChange={handleChange}
                required
              />

              <FormInputModule
                label="Official Phone Number"
                type="tel"
                name="officialPhoneNO"
                placeholder="Enter official phone number"
                value={businessData.officialPhoneNO}
                onChange={handleChange}
                required
              />

              <FormInputModule
                label="Date Incorporated"
                type="datetime-local"
                name="dateIncorporated"
                placeholder="Select date"
                value={businessData.dateIncorporated.split(".")[0] || ""}
                onChange={(e) =>
                  setBusinessData((prev) => ({
                    ...prev,
                    dateIncorporated: new Date(e.target.value).toISOString(),
                  }))
                }
              />

              <FormInputModule
                label="Tax Identification Number"
                type="text"
                name="taxIdentificationNumber"
                placeholder="Enter TIN"
                value={businessData.taxIdentificationNumber}
                onChange={handleChange}
              />

              <FormInputModule
                label="Registration Number"
                type="text"
                name="registrationNumber"
                placeholder="Enter registration number"
                value={businessData.registrationNumber}
                onChange={handleChange}
              />

              <FormInputModule
                label="Signature"
                type="text"
                name="officialSignatures"
                placeholder="Enter user Signature"
                value={businessData.officialSignatures}
                onChange={handleChange}
              />
            </div>
            <h3 className="col-span-2 border-b text-lg font-semibold">Account Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormInputModule
                label="Opening Amount"
                type="number"
                name="openingAmount"
                placeholder="Enter opening amount"
                value={businessData.openingAmount}
                onChange={handleNumberChange}
              />

              {productTypesData && (
                <FormSelectModule
                  label="Account Product Type"
                  name="accountProductTypeID"
                  value={businessData.accountProductTypeID.toString()}
                  onChange={(e) => {
                    setBusinessData((prev) => ({
                      ...prev,
                      accountProductTypeID: parseInt(e.target.value) || 0,
                    }))
                  }}
                  options={[
                    { value: "0", label: "Select Product Type" },
                    ...productTypesData.data.map((product) => ({
                      value: product.productTypeID.toString(),
                      label: product.productTypeName,
                    })),
                  ]}
                />
              )}

              <FormInputModule
                label="Referral"
                type="text"
                name="referral"
                placeholder="Enter referral"
                value={businessData.referral}
                onChange={handleChange}
              />

              <FormInputModule
                label="Account Group"
                type="text"
                name="accountGroup"
                placeholder="Enter account group"
                value={businessData.accountGroup}
                onChange={handleChange}
              />

              <FormInputModule
                label="Account Type"
                type="text"
                name="accountType"
                placeholder="Enter account type"
                value={businessData.accountType}
                onChange={handleChange}
              />

              <FormInputModule
                label="Account Currency"
                type="text"
                name="accountCurrency"
                placeholder="Enter account currency"
                value={businessData.accountCurrency}
                onChange={handleChange}
                disabled
              />

              {customerTypesData && (
                <FormSelectModule
                  label="Customer Type"
                  name="customerTypeID"
                  value={businessData.customerTypeID.toString()}
                  onChange={(e) => {
                    setBusinessData((prev) => ({
                      ...prev,
                      customerTypeID: parseInt(e.target.value) || 0,
                    }))
                  }}
                  options={[
                    { value: "0", label: "Select Customer Type" },
                    ...customerTypesData.data.map((customerType) => ({
                      value: customerType.customerTypeID.toString(),
                      label: customerType.customerTypeName,
                    })),
                  ]}
                />
              )}

              {identityTypesData && (
                <FormSelectModule
                  label="Identity Type"
                  name="identityTypeID"
                  value={businessData.identityTypeID.toString()}
                  onChange={(e) => {
                    setBusinessData((prev) => ({
                      ...prev,
                      identityTypeID: parseInt(e.target.value) || 0,
                    }))
                  }}
                  options={[
                    { value: "0", label: "Select Identity Type" },
                    ...identityTypesData.data.map((identityType) => ({
                      value: identityType.identityTypeID.toString(),
                      label: identityType.identityTypeName,
                    })),
                  ]}
                />
              )}
            </div>
            <h3 className="col-span-2 border-b  text-lg font-semibold">Business Details</h3>

            <div className="grid grid-cols-3 gap-4">
              <FormInputModule
                label="Brand Name"
                type="text"
                name="brandName"
                placeholder="Enter brand name"
                value={businessData.business.brandName}
                onChange={handleChange}
                required
              />

              <FormInputModule
                label="Logo URL"
                type="text"
                name="logo"
                placeholder="Enter logo URL"
                value={businessData.business.logo}
                onChange={handleChange}
              />

              <FormInputModule
                label="Website"
                type="text"
                name="website"
                placeholder="Enter website URL"
                value={businessData.business.website}
                onChange={handleChange}
              />

              <FormInputModule
                label="Callback URL"
                type="text"
                name="callbackUrl"
                placeholder="Enter callback URL"
                value={businessData.business.callbackUrl}
                onChange={handleChange}
              />

              <FormInputModule
                label="Deposit Fee Percent"
                type="number"
                name="depositFeePercent"
                placeholder="Enter deposit fee percent"
                value={businessData.business.depositFeePercent}
                onChange={handleNumberChange}
              />

              <FormInputModule
                label="Deposit Fee Flat"
                type="number"
                name="depositFeeFlat"
                placeholder="Enter flat fee"
                value={businessData.business.depositFeeFlat}
                onChange={handleNumberChange}
              />

              <FormInputModule
                label="Deposit Fee Cap"
                type="number"
                name="depositFeeCap"
                placeholder="Enter fee cap"
                value={businessData.business.depositFeeCap}
                onChange={handleNumberChange}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <ButtonModule
            className="w-full"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!requiredFieldsFilled() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Create Business"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default AddBusinessModal
