"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

interface FormSelectModuleProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string } }) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
  disabled?: boolean
  className?: string
  error?: boolean
}

export const FormSelectModule: React.FC<FormSelectModuleProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = "",
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (value: string) => {
    // Create a synthetic event that matches both possible types
    const syntheticEvent = {
      target: {
        name,
        value,
        // Include type to help TypeScript narrow the type
        type: "select-one",
      },
    }

    // Cast to the expected type
    onChange(syntheticEvent as ChangeEvent<HTMLSelectElement>)
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="mb-1 block text-sm text-[#2a2f4b]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`
          flex h-[46px] cursor-pointer items-center justify-between rounded-md border px-3
          py-2 ${error ? "border-[#D14343]" : "border-[#E0E0E0]"}
          ${isFocused ? "bg-[#FBFAFC] ring-2 ring-[#f58634]" : "bg-white"}
          ${disabled ? "cursor-not-allowed bg-[#ffe8d1]" : ""}
          transition-all duration-200
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => !disabled && setIsFocused(false)}
      >
        <span className="text-base">{selectedOption?.label || "Select an option"}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-[#E0E0E0] bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 text-base hover:bg-[#FBFAFC] ${
                  value === option.value ? "bg-[#ffe8d1] text-[#f58634]" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
