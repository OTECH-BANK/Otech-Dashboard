import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"
import { FormSelectModule } from "../Input/FormSelectModule"
import { useAddCustomerMutation, useGetPendingApprovalCustomersQuery } from "lib/redux/customerApi"
import { notify } from "../Notification/Notification"
import { useGetStatesQuery, useGetLGAsByStateQuery } from "lib/redux/api"
import { useGetCustomerTypesQuery, useGetIdentityTypesQuery, useGetProductTypesQuery } from "lib/redux/api"

interface AddCustomerModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    corporateName: "",
    headOfficeAddress: "",
    headOfficeLgaName: "",
    headOfficeStateName: "",
    countryName: "Nigeria",
    officialEmailAddress: "",
    officialPhoneNO: "",
    dateIncorporated: new Date().toISOString(),
    officialSignatures: "/ydjhbijdfg dfbhsidfghyjfsdfgbfhxf-hgzysrfghjnzdfbgzdt089456745nbhcfbvhdfgdfvdfvdvx",
    taxIdentificationNumber: "",
    registrationNumber: "",
    openingAmount: 0,
    identityTypeID: 0,
    accountProductTypeID: 0,
    accountType: "Savings",
    customerTypeID: 0,
  })

  // Fetch states
  const { data: statesData } = useGetStatesQuery()
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null)

  // Fetch LGAs based on selected state
  const { data: lgasData, isFetching: isFetchingLGAs } = useGetLGAsByStateQuery(selectedStateId as number, {
    skip: !selectedStateId,
  })

  // Fetch dropdown options
  const { data: identityTypesData } = useGetIdentityTypesQuery()
  const { data: productTypesData } = useGetProductTypesQuery()
  const { data: customerTypesData } = useGetCustomerTypesQuery()

  const [addCustomer, { isLoading: isAdding }] = useAddCustomerMutation()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = "target" in e ? e.target : e

    if (name === "headOfficeStateName") {
      const selectedState = statesData?.data.find((state) => state.stateName === value)
      if (selectedState) {
        setSelectedStateId(selectedState.stateID)
        setFormData((prev) => ({
          ...prev,
          headOfficeStateName: selectedState.stateName,
          headOfficeLgaName: "", // Reset LGA when state changes
        }))
      }
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = "target" in e ? e.target : e
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Convert to number for ID fields
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: new Date(value).toISOString(),
    }))
  }

  const { refetch: refetchPendingCustomers } = useGetPendingApprovalCustomersQuery({
    pageNumber: 1,
    pageSize: 10,
  })

  // Modify your handleSubmit function to include refetch
  const handleSubmit = async () => {
    try {
      const response = await addCustomer(formData as any).unwrap()
      onRequestClose()
      notify("success", "Customer added successfully", {
        title: "Success",
        description: `${formData.corporateName} has been added to the system`,
        duration: 5000,
      })

      // Trigger refetch of pending customers
      await refetchPendingCustomers()

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Failed to add customer:", error)
      notify("error", "Failed to add customer", {
        title: "Error",
        description: error.data?.message || "An error occurred while adding the customer",
        duration: 5000,
      })
    }
  }

  const isFormValid = () => {
    return (
      formData.corporateName.trim() &&
      formData.headOfficeAddress.trim() &&
      formData.officialEmailAddress.trim() &&
      formData.officialPhoneNO.trim() &&
      formData.taxIdentificationNumber.trim()
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="min-w-[1000px] max-w-4xl overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto flex items-center justify-center p-4"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Add New Customer</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 px-4 pb-4">
        <FormInputModule
          label="Corporate Name"
          name="corporateName"
          type="text"
          placeholder="Enter Corporate Name"
          value={formData.corporateName}
          onChange={handleInputChange}
          required
          className="col-span-2"
        />

        <FormInputModule
          label="Head Office Address"
          name="headOfficeAddress"
          type="text"
          placeholder="Enter Head Office Address"
          value={formData.headOfficeAddress}
          onChange={handleInputChange}
          required
          className="col-span-2"
        />

        {statesData && (
          <FormSelectModule
            label="State"
            name="headOfficeStateName"
            value={formData.headOfficeStateName}
            onChange={handleInputChange}
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
          value={formData.headOfficeLgaName}
          onChange={handleInputChange}
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
          name="countryName"
          type="text"
          placeholder="Enter Country Name"
          value={formData.countryName}
          onChange={handleInputChange}
        />

        <FormInputModule
          label="Official Email"
          name="officialEmailAddress"
          type="email"
          placeholder="Enter Official Email"
          value={formData.officialEmailAddress}
          onChange={handleInputChange}
          required
        />

        <FormInputModule
          label="Official Phone Number"
          name="officialPhoneNO"
          type="tel"
          placeholder="Enter Official Phone Number"
          value={formData.officialPhoneNO}
          onChange={handleInputChange}
          required
        />

        <FormInputModule
          label="Date Incorporated"
          name="dateIncorporated"
          placeholder="Enter Date"
          type="date"
          value={new Date(formData.dateIncorporated).toISOString().split("T")[0] || ""}
          onChange={handleDateChange}
        />

        <FormInputModule
          label="TIN"
          name="taxIdentificationNumber"
          type="text"
          placeholder="Enter Tax Identification Number"
          value={formData.taxIdentificationNumber}
          onChange={handleInputChange}
          required
        />

        <FormInputModule
          label="Registration Number"
          name="registrationNumber"
          type="text"
          placeholder="Enter Registration Number"
          value={formData.registrationNumber}
          onChange={handleInputChange}
        />

        <FormInputModule
          label="Opening Amount"
          name="openingAmount"
          type="number"
          placeholder="Enter Opening Amount"
          value={formData.openingAmount}
          onChange={handleNumberInputChange}
        />

        {identityTypesData && (
          <FormSelectModule
            label="Identity Type"
            name="identityTypeID"
            value={formData.identityTypeID.toString()}
            onChange={handleSelectChange}
            options={[
              { value: "0", label: "Select Identity Type" },
              ...identityTypesData.data.map((identityType) => ({
                value: identityType.identityTypeID.toString(),
                label: identityType.identityTypeName,
              })),
            ]}
          />
        )}

        {productTypesData && (
          <FormSelectModule
            label="Account Product Type"
            name="accountProductTypeID"
            value={formData.accountProductTypeID.toString()}
            onChange={handleSelectChange}
            options={[
              { value: "0", label: "Select Product Type" },
              ...productTypesData.data.map((product) => ({
                value: product.productTypeID.toString(),
                label: product.productTypeName,
              })),
            ]}
          />
        )}

        {customerTypesData && (
          <FormSelectModule
            label="Customer Type"
            name="customerTypeID"
            value={formData.customerTypeID.toString()}
            onChange={handleSelectChange}
            options={[
              { value: "0", label: "Select Customer Type" },
              ...customerTypesData.data.map((customerType) => ({
                value: customerType.customerTypeID.toString(),
                label: customerType.customerTypeName,
              })),
            ]}
          />
        )}

        <FormSelectModule
          label="Account Type"
          name="accountType"
          value={formData.accountType}
          onChange={(e) => setFormData((prev) => ({ ...prev, accountType: e.target.value }))}
          options={[
            { value: "Savings", label: "Savings" },
            { value: "Current", label: "Current" },
            { value: "Fixed Deposit", label: "Fixed Deposit" },
          ]}
        />
      </div>
      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <ButtonModule
          variant="primary"
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!isFormValid() || isAdding}
        >
          {isAdding ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            "Add Customer"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default AddCustomerModal
