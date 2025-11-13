"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserStudentResponse } from "@/interface/user-interface"
import { getOSAProfile } from "@/services/user-management-services"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function OsaProfilePage() {
     const [user, setUser] = useState<UserStudentResponse | null>(null)
     const [loading, setLoading] = useState<boolean>(false)
     const [error, setError] = useState<string | null>(null)

     const router = useRouter()
     const GoTochangePassword = async () => {
          router.push("/change-password")
     }

     const loadProfile = async () => {
          try {
               setLoading(true)
               setError(null)
               const data = await getOSAProfile()
               setUser(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load profile")
               console.error("Error loading profile:", err)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadProfile()
     }, [])

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6 p-6">
                    {/* header  */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>
                         </div>
                    </div>
                    {/* name  */}
                    <div className="flex items-start justify-between mb-1">
                         <div>
                              <h2 className="text-2xl font-semibold leading-tight">
                                   {user?.firstName} {user?.lastName}
                              </h2>
                              <p className="text-muted-foreground text-lg mt-1">{user?.userType}</p>
                         </div>

                         <Button className="rounded-sm self-start" onClick={GoTochangePassword}>
                              {" "}
                              Change Password
                         </Button>
                    </div>

                    {/* osa account details  */}
                    <div>
                         <h3 className="text-xl font-semibold mb-4">Account Details</h3>

                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        User ID
                                   </Label>
                                   <p>{user?.userId || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Email Address
                                   </Label>
                                   <p>{user?.email || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        First Name
                                   </Label>
                                   <p>{user?.firstName || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Last Name
                                   </Label>
                                   <p>{user?.lastName || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Contact Number
                                   </Label>
                                   <p>{user?.contactNumber || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        User Type
                                   </Label>
                                   <p>{user?.userType || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Account Created At
                                   </Label>
                                   <p>{user?.createdAt || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Account Updated At
                                   </Label>
                                   <p>{user?.updatedAt || "N/A"}</p>
                              </div>
                              <div>
                                   <Label className="block font-semibold text-sky-600 mb-1">
                                        Account Status
                                   </Label>
                                   <p>{user?.accountStatus || "N/A"}</p>
                              </div>
                         </div>
                    </div>
               </div>
          </ProtectedLayout>
     )
}
