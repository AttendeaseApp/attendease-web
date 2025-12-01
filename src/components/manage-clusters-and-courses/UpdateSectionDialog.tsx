"use client"
import { useState, useEffect } from "react"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSection } from "@/services/cluster-and-course-sessions"
import { CourseSession, Section } from "@/interface/cluster-and-course-interface"
interface UpdateSectionDialogProps {
     course: CourseSession
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
          sectionName: section.name,
     })
     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState(false)
     useEffect(() => {
          if (isOpen) {
               setFormData({
                    sectionName: section.name || "",
               })
               setError("")
          }
     }, [isOpen, section.name])
     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")
          setIsSubmitting(true)
          try {
               const updateSectionData = {
                    name: formData.sectionName,
               }
               console.log("Sending update payload:", updateSectionData)
               await updateSection(section.id, updateSectionData)
               onUpdate()
               onClose()
          } catch (err) {
               const message =
                    (err instanceof Error ? err.message : String(err)) + "Failed to update section."
               setError(message)
               console.error("Update failed:", err)
               if (onError) onError(message)
          } finally {
               setIsSubmitting(false)
          }
     }
     const handleClose = () => {
          onClose()
     }
     if (!isOpen) return null
     return (
          <Dialog open={isOpen} onOpenChange={handleClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Update Section: {section.name}</DialogTitle>
                         <DialogDescription>
                              Fill in the details to update the section in {course.courseName}.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="sectionName">Section Name</Label>
                              <Input
                                   id="sectionName"
                                   value={formData.sectionName}
                                   onChange={(e) =>
                                        handleInputChange("sectionName", e.target.value)
                                   }
                                   placeholder="Enter section name"
                                   required
                              />
                         </div>
                         {error && (
                              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                                   {error}
                              </div>
                         )}
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
                                   disabled={isSubmitting || !formData.sectionName.trim()}
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
