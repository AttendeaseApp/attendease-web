"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Card } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { login } from "@/services/auth"

export default function Login() {
     const [showPassword, setShowPassword] = useState(false)
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [loading, setLoading] = useState(false)
     const router = useRouter()

     const handleLogin = async () => {
          if (!email || !password) {
               alert("Please fill in both email and password.")
               return
          }
          setLoading(true)

          try {
               const result = await login(email, password)
               if (result.success) {
                    router.push("/dashboard")
               } else {
                    alert("Login failed: " + result.message)
               }
          } catch (error) {
               alert("Error: Something went wrong. Please try again. " + String(error))
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="flex h-screen">
               <div className="flex-[7] flex items-center justify-center bg-white">
                    <div className="flex flex-col items-center justify-center gap-6">
                         <Card className="w-full max-w-md p-8 shadow-lg">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                   <div>
                                        <h1 className="text-4xl mb-2 ">RCIANS ATTENDEASE</h1>
                                        <p className="text-gray-600 mb-6">
                                             Office of the Student Affairs: Events and Attendance
                                             Management Portal
                                        </p>
                                   </div>
                              </div>

                              <p className="text-gray-600 mb-6">
                                   Log into your Attendease account.
                              </p>

                              <div className="mb-4">
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                   />
                              </div>

                              <div className="mb-4 relative">
                                   <Label htmlFor="password">Password</Label>
                                   <div className="relative">
                                        <Input
                                             id="password"
                                             type={showPassword ? "text" : "password"}
                                             placeholder="Password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             className="pr-10"
                                        />

                                        <button
                                             type="button"
                                             onClick={() => setShowPassword(!showPassword)}
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                             {showPassword ? (
                                                  <EyeOff className="h-5 w-5" />
                                             ) : (
                                                  <Eye className="h-5 w-5" />
                                             )}
                                        </button>
                                   </div>
                              </div>

                              <Button
                                   className="w-full mb-4"
                                   onClick={handleLogin}
                                   disabled={loading}
                              >
                                   {loading ? "LOGGING IN..." : "LOG IN"}
                              </Button>
                         </Card>

                         <p>2025 Rogationist College - College Department</p>
                    </div>
               </div>
          </div>
     )
}
