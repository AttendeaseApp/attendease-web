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
import { bulkCreateSections } from "@/services/api/academic/cluster-and-course-sessions"
import { Plus, X, Trash2 } from "lucide-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

interface CreateSectionDialogProps {
     course: Course
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
}

interface SectionFormData {
     sectionName: string
     yearLevel: number
     semester: number
}

export function CreateSectionDialog({
     course,
     isOpen,
     onClose,
     onCreate,
}: CreateSectionDialogProps) {
     const [sections, setSections] = useState<SectionFormData[]>([])
     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          if (isOpen) {
               setSections([{ sectionName: "", yearLevel: 1, semester: 1 }])
          }
     }, [isOpen])

     const updateSection = (
          index: number,
          field: keyof SectionFormData,
          value: string | number
     ) => {
          const updated = [...sections]
          updated[index] = { ...updated[index], [field]: value }
          setSections(updated)
     }

     const addRow = () => {
          setSections([...sections, { sectionName: "", yearLevel: 1, semester: 1 }])
     }

     const removeRow = (index: number) => {
          setSections(sections.filter((_, i) => i !== index))
     }

     const handleSubmit = async (e: FormEvent) => {
          e.preventDefault()
          setIsSubmitting(true)

          try {
               await bulkCreateSections(course.id, sections)
               toast.success("Sections created successfully")
               onCreate()
               onClose()
          } catch (err) {
               toast.error("Failed to create sections")
          } finally {
               setIsSubmitting(false)
          }
     }

     if (!isOpen) return null

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create Sections</DialogTitle>
                         <DialogDescription>
                              Add one or more sections for <strong>{course.courseName}</strong>
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                         {sections.map((section, index) => (
                              <div
                                   key={index}
                                   className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md"
                              >
                                   <div className="col-span-5">
                                        <Label>Section Name</Label>
                                        <Input
                                             value={section.sectionName}
                                             placeholder={`${course.courseName}-101`}
                                             onChange={(e) =>
                                                  updateSection(
                                                       index,
                                                       "sectionName",
                                                       e.target.value
                                                  )
                                             }
                                             required
                                        />
                                   </div>

                                   <div className="col-span-3">
                                        <Label>Year Level</Label>
                                        <Input
                                             type="number"
                                             min={1}
                                             max={4}
                                             value={section.yearLevel}
                                             onChange={(e) =>
                                                  updateSection(
                                                       index,
                                                       "yearLevel",
                                                       Number(e.target.value)
                                                  )
                                             }
                                             required
                                        />
                                   </div>

                                   <div className="col-span-3">
                                        <Label>Semester</Label>
                                        <Input
                                             type="number"
                                             min={1}
                                             max={2}
                                             value={section.semester}
                                             onChange={(e) =>
                                                  updateSection(
                                                       index,
                                                       "semester",
                                                       Number(e.target.value)
                                                  )
                                             }
                                             required
                                        />
                                   </div>

                                   <div className="col-span-1 flex justify-end">
                                        {sections.length > 1 && (
                                             <Button
                                                  type="button"
                                                  variant="ghost"
                                                  onClick={() => removeRow(index)}
                                             >
                                                  <Trash2 className="h-4 w-4 text-red-500" />
                                             </Button>
                                        )}
                                   </div>
                              </div>
                         ))}

                         <Button type="button" variant="outline" onClick={addRow}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Another Section
                         </Button>

                         <DialogFooter>
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={isSubmitting}
                              >
                                   <X className="mr-2 h-4 w-4" />
                                   Cancel
                              </Button>
                              <Button type="submit" disabled={isSubmitting}>
                                   {isSubmitting ? "Creating..." : "Create Sections"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
