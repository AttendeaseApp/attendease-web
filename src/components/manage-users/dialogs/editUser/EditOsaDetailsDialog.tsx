"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { updateUser } from "@/services/edit-user-details"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface EditUserDetailsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     user: UpdateUserDetailsInterface | null
     onUpdated: (updatedUser: UpdateUserDetailsInterface) => void
}

export default function EditUserDetailsDialog({
     open,
     onOpenChange,
     user,
     onUpdated,
}: EditUserDetailsDialogProps) {
     const [form, setForm] = useState<
          UpdateUserDetailsInterface & { password?: string; confirmPassword?: string }
     >({
          userId: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          studentNumber: "",
          sectionId: "",
          password: "",
          confirmPassword: "",
     })
     const [loading, setLoading] = useState(false)
     const [hasChanges, setHasChanges] = useState(false)
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

     useEffect(() => {
          if (!user) return
          setForm((prev) => ({
               ...prev,
               userId: user.userId,
               firstName: user.firstName ?? "",
               lastName: user.lastName ?? "",
               contactNumber: user.contactNumber ?? "",
               email: user.email ?? "",
               studentNumber: user.studentNumber ?? "",
               sectionId: user.sectionId ?? "",
               password: "",
               confirmPassword: "",
          }))
          setHasChanges(false)
     }, [user])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
          setHasChanges(true)
     }

     const handleSubmit = async () => {
          if (form.password && form.password !== form.confirmPassword) {
               toast.error("Passwords do not match")
               return
          }
          setLoading(true)
          try {
               const { userId, password, confirmPassword, ...rest } = form
               const body: Omit<UpdateUserDetailsInterface, "userId"> & { password?: string } = {
                    ...rest,
                    studentNumber: undefined,
                    sectionId: undefined,
                    password: password || undefined,
               }
               const updated = await updateUser(userId, body)
               onUpdated(updated)
               toast.success("Successfully updated user.")
               onOpenChange(false)
          } catch (err) {
               const message =
                    err instanceof Error && err.message ? err.message : "Failed to update user"
               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     if (!user) return null

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-8">
                    <DialogHeader>
                         <DialogTitle>Update User</DialogTitle>
                         <p className="text-sm text-gray-500">Edit user details below.</p>
                    </DialogHeader>
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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <Label>Password (leave blank to keep current)</Label>
                                   <div className="relative">
                                        <Input
                                             name="password"
                                             type={showPassword ? "text" : "password"}
                                             placeholder="New Password"
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
                                             placeholder="Confirm New Password"
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
                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => onOpenChange(false)}>
                                   Cancel
                              </Button>
                              <Button
                                   onClick={handleSubmit}
                                   disabled={loading || (!hasChanges && !form.password)}
                              >
                                   {loading ? "Updating..." : "Update"}
                              </Button>
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
