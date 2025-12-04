"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
     createStudentAccount,
     getSections,
} from "@/services/api/user/management/user-management-services"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
     Command,
     CommandEmpty,
     CommandInput,
     CommandItem,
     CommandList,
} from "@/components/ui/command"
import { Check } from "lucide-react"
import { StudentRegistrationInterface } from "@/interface/management/registration/StudentRegistrationInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { toast } from "sonner"

interface AddStudentAccountDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     onAdd?: () => void
}

export default function CreateStudentAccountDialog({
     open,
     onOpenChange,
     onAdd,
}: AddStudentAccountDialogProps) {
     const [form, setForm] = useState<StudentRegistrationInterface & { confirmPassword: string }>({
          firstName: "",
          lastName: "",
          studentNumber: "",
          section: "",
          contactNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
     })

     const [loading, setLoading] = useState(false)
     const [sections, setSections] = useState<Section[]>([])
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
     const [popoverOpen, setPopoverOpen] = useState(false)
     const selectedSection = sections.find((s) => String(s.id) === form.section)

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
          if (form.password !== form.confirmPassword) {
               toast.error("Passwords do not match")
               return
          }

          if (
               !form.firstName ||
               !form.lastName ||
               !form.studentNumber ||
               !form.section ||
               !form.contactNumber ||
               !form.email ||
               !form.password
          ) {
               toast.warning("Please fill in all fields")
               return
          }

          setLoading(true)
          try {
               const { confirmPassword: _, ...payload } = form

               await createStudentAccount(payload)
               toast.success("Student account created successfully!")

               setForm({
                    firstName: "",
                    lastName: "",
                    studentNumber: "",
                    section: "",
                    contactNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
               })
               onOpenChange(false)
               onAdd?.()
          } catch (err: unknown) {
               const message =
                    err instanceof Error ? err.message : "Failed to create student account"
               toast.error(message)
               console.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
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
                                   <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                        <PopoverTrigger asChild>
                                             <Button
                                                  variant="outline"
                                                  className="w-full justify-between"
                                             >
                                                  {selectedSection?.sectionName ?? "Select Section"}
                                             </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0">
                                             <Command>
                                                  <CommandInput placeholder="Search sections..." />
                                                  <CommandList className="w-full max-h-32">
                                                       <CommandEmpty>
                                                            No section found.
                                                       </CommandEmpty>

                                                       {sections.map((s) => {
                                                            const isSelected =
                                                                 form.section === String(s.id)
                                                            return (
                                                                 <CommandItem
                                                                      key={s.id}
                                                                      value={s.sectionName}
                                                                      onSelect={() => {
                                                                           setForm((prev) => ({
                                                                                ...prev,
                                                                                section: String(
                                                                                     s.id
                                                                                ),
                                                                           }))
                                                                           setPopoverOpen(false)
                                                                      }}
                                                                 >
                                                                      {s.sectionName}
                                                                      {isSelected && (
                                                                           <Check className="ml-auto" />
                                                                      )}
                                                                 </CommandItem>
                                                            )
                                                       })}
                                                  </CommandList>
                                             </Command>
                                        </PopoverContent>
                                   </Popover>
                                   {/* <select
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
                                        {sections.map((sections) => (
                                             <option key={sections.id} value={sections.sectionName}>
                                                  {sections.sectionName}
                                             </option>
                                        ))}
                                   </select> */}
                              </div>
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

                         <div className="flex justify-end gap-2">
                              <Button
                                   variant="outline"
                                   onClick={() => {
                                        setForm({
                                             firstName: "",
                                             lastName: "",
                                             studentNumber: "",
                                             section: "",
                                             contactNumber: "",
                                             email: "",
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
     )
}
