"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Importing modular components
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { ButtonModule } from "components/ui/Button/Button"
import Footer from "components/Footer/Footer"
import { FormInputModule } from "components/ui/Input/Input"
import { notify } from "components/ui/Notification/Notification"
import { useLoginMutation } from "lib/redux/otechplusApi"
import { LuArrowLeft } from "react-icons/lu"

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)

  const router = useRouter()
  const [login] = useLoginMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await login({ username, password }).unwrap()

      // Store tokens in localStorage or state management
      localStorage.setItem("accessToken", response.tokens.accessToken)
      localStorage.setItem("refreshToken", response.tokens.refreshToken)
      localStorage.setItem("user", JSON.stringify(response.user))

      notify("success", "Login successful!", {
        description: response.message || "Redirecting to dashboard...",
        duration: 1000,
      })

      setTimeout(() => router.push("/otech-plus/dashboard"), 1000)
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Login failed. Please try again."

      if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.status === 401) {
        errorMessage = "Invalid username or password"
      }

      notify("error", "Login failed", {
        description: errorMessage,
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  useEffect(() => {
    if (showSuccessNotification || showErrorNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false)
        setShowErrorNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showSuccessNotification, showErrorNotification])

  // Disable the button if loading or if either field is empty
  const isButtonDisabled = loading || username.trim() === "" || password.trim() === ""

  return (
    <section className="flex h-screen flex-grow bg-[#F8F9FA]">
      <div className="flex w-full flex-col items-center max-sm:mt-10 md:mt-20">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img src="/otech logo.svg" alt="profile" className="h-10 w-10" />
          <p className="text-xl font-semibold text-[#2a2f4b]">Otech MFB</p>
        </div>

        <div className="flex h-auto rounded-lg max-sm:w-[95%] md:w-[428px] md:border md:bg-[#FFFFFF] md:shadow-sm xl:w-[428px]">
          <div className="w-full justify-center px-7 py-7  max-sm:p-4">
            <div className="mb-4 flex items-center border-b pb-2">
              <p className="text-lg font-semibold">Log in to your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <FormInputModule
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                className="mb-3"
                required
              />

              <PasswordInputModule
                label="Password"
                placeholder="Enter Password"
                value={password}
                onChange={handlePasswordChange}
                className="mb-3"
              />

              <Link
                href="/forgot-password"
                className="mb-6 flex justify-end transition-all duration-200 ease-in-out hover:text-[#f58634]"
              >
                Forgot Password?
              </Link>

              <ButtonModule type="submit" variant="primary" size="lg" disabled={isButtonDisabled} className="w-full">
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
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 transition-all duration-200 ease-in-out hover:text-[#f4af7e]"
        >
          <LuArrowLeft />
          <p>Back</p>
        </Link>

        <Footer />
      </div>
    </section>
  )
}

export default SignIn
