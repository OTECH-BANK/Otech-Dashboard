"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

// Importing modular components
import { ButtonModule } from "components/ui/Button/Button"
import Footer from "components/Footer/Footer"
import { notify } from "components/ui/Notification/Notification"
import UserIcon from "public/user-icon"
import OtechPlusIcon from "public/otech-plus-icon"
import OtechIcon from "public/otech-icon"

interface AccountType {
  id: string
  label: string
  description: string
  icon: React.FC<{ className?: string }>
}

const accountTypes: AccountType[] = [
  {
    id: "otech-plus",
    label: "Otech Plus",
    description:
      "Admin interface for managing merchants, payments, and user activity on the Otech Plus scan‑to‑pay platform.",
    icon: OtechPlusIcon,
  },
  {
    id: "otech",
    label: "Otech",
    description:
      "Otech MFB Admin Dashboard: Central hub for overseeing all Otech MFB platforms and financial operations.",
    icon: OtechIcon,
  },
  // Uncomment or add more account types as necessary.
  // {
  //   id: "personal",
  //   label: "Personal",
  //   description: "I am an individual looking to manage my crypto taxes.",
  //   icon: UserIcon,
  // },
]

interface AccountTypeCardProps {
  accountType: AccountType
  selected: boolean
  onSelect: (id: string) => void
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({ accountType, selected, onSelect }) => {
  const IconComponent = accountType.icon

  return (
    <div
      onClick={() => onSelect(accountType.id)}
      className={`group flex h-auto w-full cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors duration-200 ${
        selected ? "border-primary bg-[#fff1e7]" : "border-[#E5EBEF] bg-white hover:bg-gray-100"
      }`}
    >
      <div
        className={`rounded-md p-2 transition-colors duration-200 ${
          selected ? "bg-[#f4af7e]" : "bg-[#E5EBEF] group-hover:bg-gray-200"
        }`}
      >
        <IconComponent
          className={`h-6 w-6 ${selected ? "text-[#2a2f4b]" : "text-[#384860] group-hover:text-[#2a2f4b]"}`}
        />
      </div>
      <div>
        <p className="font-semibold">{accountType.label}</p>
        <p className="text-grey-400 text-sm">{accountType.description}</p>
      </div>
    </div>
  )
}

const Accounts: React.FC = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAccountType) {
      notify("error", "Selection required", {
        description: "Please select an account type before proceeding.",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      notify("success", "Login successful!", {
        description: "Redirecting to login page...",
        duration: 3000,
      })

      // Redirect to the corresponding login page for the selected account type.
      setTimeout(() => router.push(`/signin/${selectedAccountType}`), 3000)
    } catch (error) {
      notify("error", "Login failed", {
        description: "Invalid credentials. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex h-screen flex-grow bg-[#F8F9FA]">
      <div className="mt-20 flex w-full flex-col items-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img src="/otech logo.svg" alt="logo" className="h-10 w-10" />
          <p className="text-xl font-semibold text-[#2a2f4b]">Otech MFB</p>
        </div>

        <div className="flex h-auto rounded-lg bg-white shadow-sm max-sm:w-[95%] md:w-[428px] xl:max-w-[428px]">
          <div className="w-full px-7 py-7">
            <div className="mb-4 border-b pb-2">
              <p className="text-lg font-semibold">Account Type</p>
              <p className="text-sm">
                Select an account type that best describes you and how you intend to use Otech MFB.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex flex-col gap-4">
                {accountTypes.map((type) => (
                  <AccountTypeCard
                    key={type.id}
                    accountType={type}
                    selected={selectedAccountType === type.id}
                    onSelect={setSelectedAccountType}
                  />
                ))}
              </div>

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !selectedAccountType}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Continue"
                )}
              </ButtonModule>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </section>
  )
}

export default Accounts
