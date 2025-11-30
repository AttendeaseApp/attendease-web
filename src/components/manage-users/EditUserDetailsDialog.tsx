"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser } from "@/services/edit-user-details"

import { EditUserDetailsPayload } from "@/interface/users/edit-user-details"

interface EditUserDetailsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     user: EditUserDetailsPayload | null
     onUpdated: (updatedUser: EditUserDetailsPayload) => void
}

export default function UpdateUserDialog({
     open,
     onOpenChange,
     user,
     onUpdated,
}: EditUserDetailsDialogProps) {
     const [form, setForm] = useState<EditUserDetailsPayload>({
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          studentNumber: "",
          sectionId: "",
          userId: "",
     })

     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")

     useEffect(() => {
          if (!user) return

          setForm({
               firstName: user.firstName ?? "",
               lastName: user.lastName ?? "",
               contactNumber: user.contactNumber ?? "",
               email: user.email ?? "",
               studentNumber: user.studentNumber ?? "",
               sectionId: user.sectionId ?? "",
               userId: user.userId,
          })
     }, [user])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({
               ...prev,
               [name]: value,
          }))
     }

     const handleSubmit = async () => {
          setLoading(true)
          setError("")

          try {
               const { userId, ...body } = form
               const updated = await updateUser(userId, body)
               onUpdated(updated)
               alert("successfully updated")
               onOpenChange(false)
        } catch (err) {
     
     const message = err instanceof Error && err.message ? err.message : "Failed to update user"
     setError(message)
     alert(message) 
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
                              <Label>Student Number</Label>
                              <Input
                                   name="studentNumber"
                                   value={form.studentNumber}
                                   onChange={handleChange}
                              />
                         </div>

                         <div>
                              <Label>Section ID</Label>
                              <Input
                                   name="sectionId"
                                   value={form.sectionId}
                                   onChange={handleChange}
                              />
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

                         {error && <p className="text-red-500">{error}</p>}

                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => onOpenChange(false)}>
                                   Cancel
                              </Button>
                              <Button onClick={handleSubmit} disabled={loading}>
                                   {loading ? "Updating..." : "Update"}
                              </Button>
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
