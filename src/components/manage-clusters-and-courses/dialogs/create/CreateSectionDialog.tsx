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
import { createSection } from "@/services/cluster-and-course-sessions"
import { Plus, X } from "lucide-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

interface CreateSectionDialogProps {
     course: Course
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
     onError?: (message: string) => void
}

interface SectionFormData {
     sectionName: string
}

export function CreateSectionDialog({
     course,
     isOpen,
     onClose,
     onCreate,
}: CreateSectionDialogProps) {
     const [formData, setFormData] = useState<SectionFormData>({ sectionName: "" })
     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

     useEffect(() => {
          if (isOpen) {
               setFormData({ sectionName: "" })
               setError("")
          }
     }, [isOpen])

     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
          setFormData({ sectionName: e.target.value })
          if (error) setError("")
     }

     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          setError("")
          setIsSubmitting(true)
          try {
               const newSection: Section = { sectionName: formData.sectionName } as Section
               await createSection(course.id, newSection)
               onCreate()
               onClose()
          } catch (err) {
               const message = `${err instanceof Error ? err.message : String(err)}, Failed to create section.`
               setError(message)
               toast.error(message)
          } finally {
               setIsSubmitting(false)
          }
     }

     if (!isOpen) return null

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create New Section</DialogTitle>
                         <DialogDescription>
                              Fill in the details to create a new section in{" "}
                              <strong>{course.courseName}</strong>.
                              <br />
                              <strong>Format:</strong> {course.courseName}-XXX (e.g.,{" "}
                              {course.courseName}-101)
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="sectionName">Section Name</Label>
                              <Input
                                   id="sectionName"
                                   value={formData.sectionName}
                                   onChange={handleInputChange}
                                   placeholder={`Enter section name (e.g., ${course.courseName}-101)`}
                                   required
                              />
                         </div>

                         <DialogFooter className="flex justify-end space-x-2 pt-4">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={isSubmitting}
                              >
                                   <X className="mr-2 h-4 w-4" />
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={isSubmitting || !formData.sectionName.trim()}
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   {isSubmitting ? "Creating..." : "Create Section"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
