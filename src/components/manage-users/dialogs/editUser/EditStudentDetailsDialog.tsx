"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
     Command,
     CommandEmpty,
     CommandInput,
     CommandItem,
     CommandList,
} from "@/components/ui/command"
import { Check } from "lucide-react"
import { Section } from "@/interface/academic/section/SectionInterface"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { updateUser } from "@/services/edit-user-details"
import { getSections } from "@/services/api/user/management/user-management-services"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface EditStudentDetailsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     user: UpdateUserDetailsInterface | null
     onUpdated: (updatedUser: UpdateUserDetailsInterface) => void
}

export default function EditStudentDetailsDialog({
     open,
     onOpenChange,
     user,
     onUpdated,
}: EditStudentDetailsDialogProps) {
     const [form, setForm] = useState<UpdateUserDetailsInterface>({
          userId: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          studentNumber: "",
          sectionId: "",
     })
     const [sections, setSections] = useState<Section[]>([])
     const [loading, setLoading] = useState(false)
     const [popoverOpen, setPopoverOpen] = useState(false)
     const [hasChanges, setHasChanges] = useState(false)

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

     useEffect(() => {
          if (!user || sections.length === 0) return
          const currentSection = sections.find((s) => String(s.id) === user.sectionId)
          setForm((prev) => ({
               ...prev,
               sectionId: currentSection ? String(currentSection.id) : "",
          }))
     }, [user, sections])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setForm((prev) => ({ ...prev, [name]: value }))
          setHasChanges(true)
     }

     const handleSubmit = async () => {
          setLoading(true)
          try {
               const { userId, sectionId, ...rest } = form
               const body: Omit<UpdateUserDetailsInterface, "userId"> = {
                    ...rest,
                    sectionId: sectionId === "" ? undefined : sectionId,
               }
               const updated = await updateUser(userId, body)
               onUpdated(updated)
               toast.success("Successfully updated student.")
               onOpenChange(false)
          } catch (err) {
               const message =
                    err instanceof Error && err.message ? err.message : "Failed to update student"
               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     if (!user) return null

     return (
          <>
               <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-8">
                         <DialogHeader>
                              <DialogTitle>Update Student</DialogTitle>
                              <p className="text-sm text-gray-500">Edit student details below.</p>
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
                                   <Label>Section</Label>
                                   <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                        <PopoverTrigger asChild>
                                             <Button
                                                  variant="outline"
                                                  className="w-full justify-between"
                                             >
                                                  {form.sectionId
                                                       ? sections.find(
                                                              (s) =>
                                                                   String(s.id) ===
                                                                   String(form.sectionId)
                                                         )?.sectionName
                                                       : "Select Section"}
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
                                                                 String(form.sectionId) ===
                                                                 String(s.id)
                                                            return (
                                                                 <CommandItem
                                                                      key={s.id}
                                                                      value={s.sectionName}
                                                                      onSelect={() => {
                                                                           setForm((prev) => ({
                                                                                ...prev,
                                                                                sectionId: String(
                                                                                     s.id
                                                                                ),
                                                                           }))
                                                                           setHasChanges(true)
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
          </>
     )
}
