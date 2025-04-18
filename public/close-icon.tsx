// OtechPlusIcon.tsx
import React from "react"

export interface IconProps {
  className?: string
}

const CloseIcon: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.5" width="28" height="28" rx="14" fill="#CBD5E1" />
      <rect
        x="9.98743"
        y="8.9043"
        width="13.4167"
        height="1.75"
        rx="0.875"
        transform="rotate(45 9.98743 8.9043)"
        fill="#384860"
      />
      <rect
        x="8.82077"
        y="18.2363"
        width="13.4167"
        height="1.75"
        rx="0.875"
        transform="rotate(-45 8.82077 18.2363)"
        fill="#384860"
      />
    </svg>
  )
}

export default CloseIcon
