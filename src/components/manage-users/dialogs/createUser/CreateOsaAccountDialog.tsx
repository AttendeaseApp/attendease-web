"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createOSAAccount } from "@/services/api/user/management/user-management-services"
import { toast } from "sonner"

interface AddOSAAccountDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     onAdd?: () => void
}

interface FormState {
     firstName: string
     lastName: string
     email: string
     password: string
     confirmPassword: string
     contactNumber?: string
}

export default function CreateOsaAccountDialog({
     open,
     onOpenChange,
     onAdd,
}: AddOSAAccountDialogProps) {
     const [form, setForm] = useState<FormState>({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNumber: "",
     })

     const [loading, setLoading] = useState(false)
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
     }

     const handleSubmit = async () => {
          if (form.password !== form.confirmPassword) {
               toast.error("Passwords do not match")
               return
          }

          setLoading(true)
          try {
               const { confirmPassword: _, ...payload } = form

               await createOSAAccount(payload)
               toast.success("OSA account created successfully")

               setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    contactNumber: "",
               })

               onOpenChange(false)
               onAdd?.()
          } catch (err: unknown) {
               const message = err instanceof Error ? err.message : "Failed to create OSA account"
               toast.error(message)
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
                                   placeholder="Enter OSA Email"
                                   value={form.email}
                                   onChange={handleChange}
                              />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <Label>Password</Label>
                                   <div className="relative">
                                        <Input
                                             name="password"
                                             type={showPassword ? "text" : "password"}
                                             placeholder="Password"
                                             value={form.password}
                                             onChange={handleChange}
                                        />
                                        <Button
                                             size="sm"
                                             variant="ghost"
                                             className="absolute right-2 top-1/2 -translate-y-1/2"
                                             onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                             {showPassword ? "Hide" : "Show"}
                                        </Button>
                                   </div>
                              </div>

                              <div>
                                   <Label>Confirm Password</Label>
                                   <div className="relative">
                                        <Input
                                             name="confirmPassword"
                                             type={showConfirmPassword ? "text" : "password"}
                                             placeholder="Confirm Password"
                                             value={form.confirmPassword}
                                             onChange={handleChange}
                                        />
                                        <Button
                                             size="sm"
                                             variant="ghost"
                                             className="absolute right-2 top-1/2 -translate-y-1/2"
                                             onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                             {showConfirmPassword ? "Hide" : "Show"}
                                        </Button>
                                   </div>
                              </div>
                         </div>

                         <div>
                              <Label>Contact No.</Label>
                              <Input
                                   name="contactNumber"
                                   type="text"
                                   inputMode="numeric"
                                   placeholder="Contact No."
                                   value={form.contactNumber}
                                   onChange={handleChange}
                              />
                         </div>

                         <div className="flex justify-end gap-2">
                              <Button
                                   variant="outline"
                                   onClick={() => {
                                        setForm({
                                             firstName: "",
                                             lastName: "",
                                             email: "",
                                             password: "",
                                             confirmPassword: "",
                                             contactNumber: "",
                                        })
                                        onOpenChange(false)
                                   }}
                              >
                                   Cancel
                              </Button>

                              <Button onClick={handleSubmit} disabled={loading}>
                                   {loading ? "Registering..." : "Register"}
                              </Button>
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
