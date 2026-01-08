"use client"

import { useState, useEffect } from "react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { editMyProfile } from "@/services/osa-edit-my-profile"
import { OsaEditMyProfileInterface } from "@/interface/my-profile/OsaEditMyProfileInterface"
import { getOSAProfile } from "@/services/api/user/management/user-management-services"

export default function OsaEditMyProfilePage() {
     const [form, setForm] = useState<OsaEditMyProfileInterface>({
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          accountStatus: "ACTIVE",
          userType: "OSA",
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
               try{
                    const data = await getOSAProfile()
                    setForm({
                         firstName: data.firstName ?? "",
                         lastName: data.lastName ?? "",
                         contactNumber: data.contactNumber ?? "",
                         email: data.email ?? "",
                         accountStatus: "ACTIVE",
                         userType: "OSA",
                    })
                    setHasChanges(false)
               } catch (err){
                    console.error(err)
               }
          }

          fetchProfile()
     }, [])

     const handleSubmit = async () => {
          setLoading(true)
          try {
               const body = {
                    firstname: form.firstName,
                    lastname: form.lastName,
                    contactNumber: form.contactNumber,
                    email: form.email,
               }
               console.log("submitting body", body)
               const res = await editMyProfile(body)
               console.log("api response", res)
               if (res.success) {
                    router.push("/account")
               } else {
                    console.log("Failed to update profile", res.message)
               }
          } catch (err) {
               console.error(err)
          } finally {
               setLoading(false)
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6 p-6">
                    <Label className="block mb-2 text-2xl font-bold text-slate-900">
                         My Profile
                    </Label>

                    <div className="flex flex-col gap-6">
                         <Label className="block text-xl font-semibold text-slate-900">
                              Edit My Profile
                         </Label>

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

                              {/* cancel and reset buttons */}
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