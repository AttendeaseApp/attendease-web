"use client"

import { useState, useEffect } from "react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { updateUser } from "@/services/edit-user-details"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { getOSAProfile } from "@/services/api/user/management/user-management-services"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { toast } from "sonner"

export default function OsaEditMyProfilePage() {
     const [form, setForm] = useState<UpdateUserDetailsInterface>({
          userId: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
     })
     const [loading, setLoading] = useState(false)
     const [hasChanges, setHasChanges] = useState(false)

     const router = useRouter()
     const GoBackToProfilePage = async () => {
          router.push("/account")
     }

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
          setHasChanges(true)
     }

     useEffect(() => {
          const fetchProfile = async () => {
               try {
                    const data = await getOSAProfile()
                    setForm({
                         userId: String(data.userId),
                         firstName: data.firstName ?? "",
                         lastName: data.lastName ?? "",
                         contactNumber: data.contactNumber ?? "",
                         email: data.email ?? "",
                    })
                    setHasChanges(false)
               } catch (err) {
                    console.error(err)
               }
          }

          fetchProfile()
     }, [])

     const handleSubmit = async () => {
          setLoading(true)
          try {
               const body: Omit<UpdateUserDetailsInterface, "userId"> = {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    contactNumber: form.contactNumber,
                    email: form.email,
               }
               await updateUser(form.userId, body)
               toast.success("Successfully updated profile.")
               router.push("/account")
          } catch (err) {
               const message =
                    err instanceof Error && err.message ? err.message : "Failed to update user"
               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6 p-6">
                    <div>
                         <Breadcrumb>
                              <BreadcrumbList>
                                   <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                             <Link href="/account">My Profile Page</Link>
                                        </BreadcrumbLink>
                                   </BreadcrumbItem>
                                   <BreadcrumbSeparator />
                                   <BreadcrumbItem>
                                        <BreadcrumbLink>{"Edit My Profile"}</BreadcrumbLink>
                                   </BreadcrumbItem>
                              </BreadcrumbList>
                         </Breadcrumb>
                    </div>
                    <Label className="block mb-2 text-2xl font-bold text-slate-900">
                         Edit My Profile
                    </Label>

                    <div className="flex flex-col gap-6">
                         {/* <Label className="block text-xl font-semibold text-slate-900">
                              Edit My Profile
                         </Label> */}

                         {/* <div className="flex flex-col gap-4 w-full max-w-3xl"> */}
                         <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                        <Label>First Name</Label>
                                        <Input
                                             name="firstName"
                                             value={form.firstName}
                                             onChange={handleChange}
                                        />
                                   </div>
                                   <div>
                                        <Label>Last Name</Label>
                                        <Input
                                             name="lastName"
                                             value={form.lastName}
                                             onChange={handleChange}
                                        />
                                   </div>
                              </div>
                              <div>
                                   <Label>Contact Number</Label>
                                   <Input
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                   />
                              </div>
                              <div>
                                   <Label>Email</Label>
                                   <Input name="email" value={form.email} onChange={handleChange} />
                              </div>

                              {/* cancel and submit buttons */}
                              <div className="flex justify-end gap-3 mt-4">
                                   <Button
                                        variant="outline"
                                        className="rounded-sm bg-white text-black border border-slate-300"
                                        onClick={GoBackToProfilePage}
                                   >
                                        Cancel
                                   </Button>

                                   <Button
                                        className="rounded-sm"
                                        onClick={handleSubmit}
                                        disabled={loading && !hasChanges}
                                   >
                                        {loading ? "Updating..." : "Update Profile"}
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </ProtectedLayout>
     )
}
