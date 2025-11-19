"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createOSAAccount, OsaAccountPayload } from "@/services/user-management-services"

interface AddAccountDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
}

export default function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
     const [form, setForm] = useState<
          OsaAccountPayload & { confirmPassword: string; contact?: string }
     >({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          contact: "",
          userType: "OSA",
     })

     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
     }

     const handleSubmit = async () => {
          setError("")

          if (form.password !== form.confirmPassword) {
               setError("Passwords do not match")
               return
          }

          setLoading(true)
          try {
               const { confirmPassword, contact, ...payload } = form
               await createOSAAccount(payload)

               console.log("Account created")

               setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    contact: "",
                    userType: "OSA",
               })
               onOpenChange(false)
          } catch (err: unknown) {
               const message = err instanceof Error ? err.message : "Failed to create account"
               setError(message)
               console.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="max-w-4xl p-8">
                    <DialogHeader>
                         <DialogTitle className="text-2xl">Create a new OSA account</DialogTitle>
                         <p className="text-sm text-gray-500">Create new user account here.</p>
                    </DialogHeader>

                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <Label>First Name</Label>
                                   <Input
                                        name="firstName"
                                        placeholder="Enter First Name"
                                        value={form.firstName}
                                        onChange={handleChange}
                                   />
                              </div>

                              <div>
                                   <Label>Last Name</Label>
                                   <Input
                                        name="lastName"
                                        placeholder="Enter Last Name"
                                        value={form.lastName}
                                        onChange={handleChange}
                                   />
                              </div>
                         </div>

                         <div>
                              <Label>Email Address</Label>
                              <Input
                                   name="email"
                                   type="email"
                                   placeholder="Enter Onpassive Email ID"
                                   value={form.email}
                                   onChange={handleChange}
                              />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <Label>Password</Label>
                                   <Input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                   />
                              </div>

                              <div>
                                   <Label>Confirm Password</Label>
                                   <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                   />
                              </div>
                         </div>

                         <div>
                              <Label>Contact No.</Label>
                              <Input
                                   name="contact"
                                   placeholder="Contact No."
                                   value={form.contact}
                                   onChange={handleChange}
                              />
                         </div>

                         {error && <p className="text-red-500">{error}</p>}

                         <div className="flex justify-end">
                              <Button onClick={handleSubmit} disabled={loading}>
                                   {loading ? "Registering..." : "Register"}
                              </Button>
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
