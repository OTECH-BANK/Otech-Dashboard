import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"

import { FormInputModule } from "../Input/Input"
import { FormSelectModule } from "../Input/FormSelectModule"
import { useAddEmployeeMutation, useGetBranchesQuery, useGetRolesQuery } from "lib/redux/employeeApi"
import { notify } from "../Notification/Notification"
import { PasswordInputModule } from "../Input/PasswordInput"

interface AddEmployeeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess?: () => void
}

const generateSuggestedPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const [suggestedPassword, setSuggestedPassword] = useState(generateSuggestedPassword())
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: suggestedPassword,
    roleId: 0,
    branchId: 0,
    approvalId: 0,
    changePwd: true,
    isactive: true,
  })

  // Fetch data
  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery()
  const { data: branchesData, isLoading: isBranchesLoading } = useGetBranchesQuery()
  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleUseSuggestedPassword = () => {
    setFormData((prev) => ({
      ...prev,
      password: suggestedPassword,
    }))
    notify("info", "Suggested password applied", {
      title: "Password",
      description: "You can modify it if needed",
      duration: 3000,
    })
  }

  const handleGenerateNewPassword = () => {
    const newPassword = generateSuggestedPassword()
    setSuggestedPassword(newPassword)
    setFormData((prev) => ({
      ...prev,
      password: newPassword,
    }))
    notify("info", "New password generated", {
      title: "Password",
      description: "You can modify it if needed",
      duration: 3000,
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await addEmployee(formData).unwrap()
      onRequestClose()
      notify("success", "Employee added successfully", {
        title: "Success",
        description: `${formData.name} has been added to the system`,
        duration: 5000,
      })
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Failed to add employee:", error)
      notify("error", "Failed to add employee", {
        title: "Error",
        description: error.data?.message || "An error occurred while adding the employee",
        duration: 5000,
      })
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.mobile.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.roleId > 0 &&
      formData.branchId > 0 &&
      formData.approvalId > 0
    )
  }

  // Prepare options for select components
  const roleOptions =
    rolesData?.data?.map((role) => ({
      value: role.id.toString(),
      label: `${role.title} (ID: ${role.id})`,
    })) || []

  const approvalOptions =
    rolesData?.data?.map((role) => ({
      value: role.id.toString(),
      label: `${role.title} (ID: ${role.id})`,
    })) || []

  const branchOptions =
    branchesData?.data?.map((branch) => ({
      value: branch.branchID.toString(),
      label: `${branch.branchName} (${branch.branchCode})`,
    })) || []

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 min-w-[600px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Add Employee</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 px-4 pb-4">
        <FormInputModule
          label="Full Name"
          name="name"
          type="text"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <FormInputModule
          label="Mobile Number"
          name="mobile"
          type="text"
          placeholder="Enter Phone Number"
          value={formData.mobile}
          onChange={handleInputChange}
          required
        />
        <FormInputModule
          label="Email"
          name="email"
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <FormSelectModule
          label="Role"
          name="roleId"
          value={formData.roleId.toString()}
          onChange={handleSelectChange}
          options={roleOptions}
          required
          disabled={isRolesLoading}
        />
        <FormSelectModule
          label="Approval Role"
          name="approvalId"
          value={formData.approvalId.toString()}
          onChange={handleSelectChange}
          options={approvalOptions}
          required
          disabled={isRolesLoading}
        />
        <FormSelectModule
          label="Branch"
          name="branchId"
          value={formData.branchId.toString()}
          onChange={handleSelectChange}
          options={branchOptions}
          required
          disabled={isBranchesLoading}
        />
        <div className="col-span-2">
          <PasswordInputModule
            label="Password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
            className="mb-0"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleUseSuggestedPassword}
              className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
            >
              Use Suggested
            </button>
            <button
              type="button"
              onClick={handleGenerateNewPassword}
              className="rounded bg-green-50 px-2 py-1 text-xs text-green-600 hover:bg-green-100"
            >
              Generate New
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Suggested password: <span className="font-mono">{suggestedPassword}</span>
          </p>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <ButtonModule
          variant="primary"
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!isFormValid() || isAdding || isRolesLoading || isBranchesLoading}
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
            "Add Employee"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default AddEmployeeModal
