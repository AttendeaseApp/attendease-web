"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Home component that redirects users based on authentication status.
 *
 * @returns JSX.Element The Home component.
 */
export default function Home() {
     const router = useRouter()

     useEffect(() => {
          const token = localStorage.getItem("authToken")
          if (token) {
               router.push("/dashboard")
          } else {
               router.push("/login")
          }
     }, [router])
     return null
}
