"use client"

import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { updateSection } from "@/services/api/academic/cluster-and-course-sessions"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UpdateSectionDialogProps {
     course: Course
     isOpen: boolean
     onClose: () => void
     onUpdate: () => void
     onError?: (message: string) => void
     section: Section
}

export function UpdateSectionDialog({
     course,
     isOpen,
     onClose,
     onUpdate,
     onError,
     section,
}: UpdateSectionDialogProps) {
     const [formData, setFormData] = useState({
          sectionName: "",
          yearLevel: 1,
          semester: 1,
     })

     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          if (isOpen) {
               setFormData({
                    sectionName: section.sectionName ?? "",
                    yearLevel: section.yearLevel ?? 1,
                    semester: section.semester ?? 1,
               })
               setError("")
          }
     }, [isOpen, section])

     const handleInputChange = (field: keyof typeof formData, value: string | number) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const hasChanges =
          formData.sectionName.trim() !== section.sectionName ||
          formData.yearLevel !== section.yearLevel ||
          formData.semester !== section.semester

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!hasChanges) {
               return
          }

          setIsSubmitting(true)
          setError("")

          try {
               const payload = {
                    sectionName: formData.sectionName.trim(),
                    yearLevel: formData.yearLevel,
                    semester: formData.semester,
               }

               console.log("Updating section:", payload)

               await updateSection(section.id, payload)

               toast.success("Section updated successfully")
               onUpdate()
               onClose()
          } catch (err) {
               let message = "Failed to update section"

               if (err instanceof Error) {
                    message = err.message
               }

               setError(message)
               onError?.(message)
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          if (!isSubmitting) onClose()
     }

     if (!isOpen) return null

     return (
          <Dialog open={isOpen} onOpenChange={handleClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Update Section: {section.sectionName}</DialogTitle>
                         <DialogDescription>
                              Update section details for <strong>{course.courseName}</strong>
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         {/* section name*/}
                         <div className="space-y-2">
                              <Label htmlFor="sectionName">Section Name</Label>
                              <Input
                                   id="sectionName"
                                   value={formData.sectionName}
                                   onChange={(e) =>
                                        handleInputChange("sectionName", e.target.value)
                                   }
                                   placeholder="e.g. BSCS-201"
                                   required
                              />
                         </div>

                         {/* year lvl*/}
                         <div className="space-y-2">
                              <Label htmlFor="yearLevel">Year Level</Label>
                              <Input
                                   id="yearLevel"
                                   type="number"
                                   min={1}
                                   max={4}
                                   value={formData.yearLevel}
                                   onChange={(e) =>
                                        handleInputChange("yearLevel", Number(e.target.value))
                                   }
                                   required
                              />
                         </div>

                         {/* semster*/}
                         <div className="space-y-2">
                              <Label htmlFor="semester">Semester</Label>
                              <Input
                                   id="semester"
                                   type="number"
                                   min={1}
                                   max={2}
                                   value={formData.semester}
                                   onChange={(e) =>
                                        handleInputChange("semester", Number(e.target.value))
                                   }
                                   required
                              />
                         </div>

                         <DialogFooter className="flex justify-end space-x-2 pt-4">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={handleClose}
                                   disabled={isSubmitting}
                              >
                                   <X className="mr-2 h-4 w-4" />
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={
                                        isSubmitting || !formData.sectionName.trim() || !hasChanges
                                   }
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   {isSubmitting ? "Updating..." : "Update Section"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
