// components/ProtectedRoute.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check authentication status when component mounts
    if (!loading && !isAuthenticated) {
      router.push("/signin/otech")
    }

    // Optional: Verify token validity if needed
    // if (token && !verifyTokenExpiration(token)) {
    //   // Handle token expiration (dispatch logout action if using Redux)
    //   router.push("/otech/signin")
    // }
  }, [isAuthenticated, loading, router, token])

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}

// // Helper function to check token expiration (if your tokens are JWTs)
// function verifyTokenExpiration(token: string): boolean {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]))
//     return payload.exp * 1000 > Date.now()
//   } catch (e) {
//     return false
//   }
// }
