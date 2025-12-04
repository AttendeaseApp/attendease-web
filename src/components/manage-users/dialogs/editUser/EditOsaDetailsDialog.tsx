"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { updateUser } from "@/services/edit-user-details"
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
     const [form, setForm] = useState<UpdateUserDetailsInterface>({
          userId: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          studentNumber: "",
          sectionId: "",
     })
     const [loading, setLoading] = useState(false)
     const [hasChanges, setHasChanges] = useState(false)

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
          }))
          setHasChanges(false)
     }, [user])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
          setHasChanges(true)
     }

     const handleSubmit = async () => {
          setLoading(true)
          try {
               const { userId, ...rest } = form
               const body: Omit<UpdateUserDetailsInterface, "userId"> = {
                    ...rest,
                    studentNumber: undefined,
                    sectionId: undefined,
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
                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => onOpenChange(false)}>
                                   Cancel
                              </Button>
                              <Button onClick={handleSubmit} disabled={loading || !hasChanges}>
                                   {loading ? "Updating..." : "Update"}
                              </Button>
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
