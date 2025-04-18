// FormInputModule.tsx
"use client"
import React, { useState } from "react"

interface FormInputProps {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
}

export const FormInputModule: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  className = "",
  error = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`mb-3 ${className}`}>
      <label className="mb-1 block text-sm text-[#2a2f4b]">{label}</label>
      <div
        className={`
        flex h-[46px] items-center rounded-md border px-3
        py-2 ${error ? "border-[#D14343]" : "border-[#E0E0E0]"}
        ${isFocused ? "bg-[#FBFAFC] ring-2 ring-[#f58634]" : "bg-white"}
        transition-all duration-200
      `}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-base outline-none"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  )
}
