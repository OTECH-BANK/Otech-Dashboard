// FormInputModule.tsx
"use client"
import React, { useState } from "react"

interface FormInputProps {
  label: string
  type: string
  name?: string
  placeholder: string
  value: string | number | any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
  required?: boolean
  disabled?: boolean
}

export const FormInputModule: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  className = "",
  error = false,
  required = false,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`${className}`}>
      <label className="mb-1 block text-sm text-[#2a2f4b]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`
        flex h-[46px] items-center rounded-md border px-3
        py-2 ${error ? "border-[#D14343]" : "border-[#E0E0E0]"}
        ${isFocused ? "bg-[#FBFAFC] ring-2 ring-[#f58634]" : "bg-white"}
        ${disabled ? "bg-gray-100" : ""}
        transition-all duration-200
      `}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
