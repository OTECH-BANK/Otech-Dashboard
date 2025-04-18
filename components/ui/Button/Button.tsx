"use client"

import React from "react"

type ButtonVariant = "primary" | "black" | "secondary" | "outline" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
  /** Optional icon element to render */
  icon?: React.ReactNode
  /** Position of the icon relative to the button text */
  iconPosition?: "start" | "end"
}

export const ButtonModule: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  icon,
  iconPosition = "start",
}) => {
  const baseClasses =
    "flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-[#f58634] text-[#2a2f4b] hover:bg-[#e57e2e] focus:ring-[#d97528]",
    black: "bg-[#131319] text-[#ffffff] hover:bg-[#000000] focus:ring-[#131319]",
    secondary: "bg-[#ffe8d1] text-[#f58634] hover:bg-[#fcd8bb] focus:ring-[#f58634]",
    outline: "border border-[#f58634] text-[#f58634] hover:bg-[#ffe8d1] focus:ring-[#f58634]",
    ghost: "text-[#f58634] hover:bg-[#ffe8d1] focus:ring-[#f58634]",
    danger: "bg-[#e05c2a] text-white hover:bg-[#d95425] focus:ring-[#c44d1f]",
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
    >
      {icon && iconPosition === "start" && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === "end" && <span className="ml-2 inline-flex items-center">{icon}</span>}
    </button>
  )
}
