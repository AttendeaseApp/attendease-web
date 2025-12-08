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
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Course } from "@/interface/academic/course/CourseInterface"
import { updateCourse } from "@/services/cluster-and-course-sessions"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UpdateCourseDialogProps {
     cluster: Cluster
     isOpen: boolean
     onClose: () => void
     onUpdate: () => void
     onError?: (message: string) => void
     courses: Course
}

export function UpdateCourseDialog({
     cluster,
     isOpen,
     onClose,
     onUpdate,
     courses,
}: UpdateCourseDialogProps) {
     const [formData, setFormData] = useState({
          courseName: courses.courseName,
     })

     const [error, setError] = useState<string>("")

     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          if (isOpen) {
               setFormData({
                    courseName: courses.courseName || "",
               })
               setError("")
          }
     }, [isOpen, courses.courseName])

     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")
          setIsSubmitting(true)
          try {
               const updateCourseData = {
                    courseName: formData.courseName,
               }
               console.log("Sending update payload:", updateCourseData)
               await updateCourse(courses.id, updateCourseData)
               onUpdate()
               onClose()
          } catch (err) {
               const message =
                    (err instanceof Error ? err.message : String(err)) + " Failed to update course."
               setError(message)
               console.error("Update failed:", err)
               toast.error(message)
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
                         <DialogTitle>Update Course: {courses.courseName}</DialogTitle>
                         <DialogDescription>
                              Fill in the details to update the course in {cluster.clusterName}.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="courseName">Course Name</Label>
                              <Input
                                   id="courseName"
                                   value={formData.courseName}
                                   onChange={(e) => handleInputChange("courseName", e.target.value)}
                                   placeholder="Enter course name"
                                   required
                              />
                         </div>
                         {/* {error && (
                              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                                   {error}
                              </div>
                         )} */}
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
                                   disabled={isSubmitting || !formData.courseName.trim()}
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   {isSubmitting ? "Updating..." : "Update Course"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
