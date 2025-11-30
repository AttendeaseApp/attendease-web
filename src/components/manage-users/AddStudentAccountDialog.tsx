"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createStudentAccount, getSections } from "@/services/user-management-services"
import { StudentAccountPayload } from "@/interface/users/StudentInterface"
import { Section } from "@/interface/students/SectionInterface"
import CreateUserStatusDialog from "./CreateUserStatusDialog"

interface AddStudentAccountDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     onAdd?: () => void
}

export default function AddStudentAccountDialog({
     open,
     onOpenChange,
     onAdd,
}: AddStudentAccountDialogProps) {
     const [form, setForm] = useState<StudentAccountPayload & { confirmPassword: string }>({
          firstName: "",
          lastName: "",
          studentNumber: "",
          section: "",
          contactNumber: "",
          email: "",
          address: "",
          password: "",
          confirmPassword: "",
     })

     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")
     const [sections, setSections] = useState<Section[]>([])
     const [importStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [importMessage, setCreateMessage] = useState("")
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)

     const showStatus = (status: "success" | "error", message: string) => {
          setCreateStatus(status)
          setCreateMessage(message)
          setStatusDialogOpen(true)
     }

     useEffect(() => {
          if (!open) return

          const fetchSections = async () => {
               try {
                    const data = await getSections()
                    setSections(data)
               } catch (err) {
                    console.error("Failed to fetch sections:", err)
               }
          }

          fetchSections()
     }, [open])

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

          if (
               !form.firstName ||
               !form.lastName ||
               !form.studentNumber ||
               !form.section ||
               //!form.yearLevel ||
               !form.contactNumber ||
               !form.email ||
               !form.address ||
               !form.password
          ) {
               setError("Please fill in all fields")
               return
          }

          setLoading(true)
          try {
               const { confirmPassword, ...payload } = form
               await createStudentAccount(payload)
               showStatus("success", "Student account created successfully!")
               setForm({
                    firstName: "",
                    lastName: "",
                    studentNumber: "",
                    section: "",
                    contactNumber: "",
                    email: "",
                    address: "",
                    password: "",
                    confirmPassword: "",
               })
               onOpenChange(false)
               onAdd?.()
          } catch (err: unknown) {
               const message =
                    err instanceof Error ? err.message : "Failed to create student account"
               setError(message)
               showStatus("error", message)
               console.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
          <>
               <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-8">
                         <DialogHeader>
                              <DialogTitle className="text-2xl">
                                   Create a new Student account
                              </DialogTitle>
                              <p className="text-sm text-gray-500">
                                   Create a student user account here.
                              </p>
                         </DialogHeader>

                         <div className="space-y-6 mt-4">
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
                                   <Label>Student Number</Label>
                                   <Input
                                        name="studentNumber"
                                        placeholder="Enter Student Number"
                                        value={form.studentNumber}
                                        onChange={handleChange}
                                   />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                        <Label>Section</Label>
                                        <select
                                             name="section"
                                             value={form.section}
                                             onChange={(e) =>
                                                  setForm((prev) => ({
                                                       ...prev,
                                                       section: e.target.value,
                                                  }))
                                             }
                                             className="w-full border rounded px-2 py-1"
                                        >
                                             <option value="">Select Section</option>
                                             {sections.map((s) => (
                                                  <option key={s.id} value={s.name}>
                                                       {s.name}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   {/*     <div>
                                   <Label>Year Level</Label>
                                   <select
                                        name="yearLevel"
                                        value={form.yearLevel}
                                        onChange={(e) =>
                                             setForm((prev) => ({
                                                  ...prev,
                                                  yearLevel: e.target.value,
                                             }))
                                        }
                                        className="w-full border rounded px-2 py-1"
                                   >
                                        <option value="">Select Year Level</option>
                                        {yearLevels.map((yl) => (
                                             <option key={yl} value={yl}>
                                                  {yl}
                                             </option>
                                        ))}
                                   </select>
                              </div> */}
                              </div>

                              <div>
                                   <Label>Contact Number</Label>
                                   <Input
                                        name="contactNumber"
                                        placeholder="Enter Contact Number"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                   />
                              </div>

                              <div>
                                   <Label>Email</Label>
                                   <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        value={form.email}
                                        onChange={handleChange}
                                   />
                              </div>

                              <div>
                                   <Label>Address</Label>
                                   <Input
                                        name="address"
                                        placeholder="Enter Address"
                                        value={form.address}
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

                              {error && <p className="text-red-500">{error}</p>}

                              <div className="flex justify-end">
                                   <Button
                                        variant="outline"
                                        onClick={() => {
                                             setForm({
                                                  firstName: "",
                                                  lastName: "",
                                                  studentNumber: "",
                                                  section: "",
                                                  //yearLevel: "",
                                                  contactNumber: "",
                                                  email: "",
                                                  address: "",
                                                  password: "",
                                                  confirmPassword: "",
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

               <CreateUserStatusDialog
                    open={statusDialogOpen}
                    status={importStatus}
                    message={importMessage}
                    onClose={() => setStatusDialogOpen(false)}
               />
          </>
     )
}
