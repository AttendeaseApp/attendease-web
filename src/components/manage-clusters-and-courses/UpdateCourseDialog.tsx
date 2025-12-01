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
import { updateCourse } from "@/services/cluster-and-course-sessions"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
interface UpdateCourseDialogProps {
     cluster: ClusterSession
     isOpen: boolean
     onClose: () => void
     onUpdate: () => void
     onError?: (message: string) => void
     courses: CourseSession
    //  courses: { courseName: string }[]
}
export function UpdateCourseDialog({
     cluster,
     isOpen,
     onClose,
     onUpdate,
     onError,
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
                    courseName: "",
               })
               setError("")
          }
     }, [isOpen])
     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")

        //   const duplicate = courses.some(
        //        (c) => c.courseName.toLowerCase().trim() === formData.courseName.toLowerCase().trim()
        //   )

        //   if (duplicate) {
        //        setError("Course name already exists.")
        //        return
        //   }
          setIsSubmitting(true)
          try {
               const updateCourseData = {
                    courseName: formData.courseName,
               }
               console.log("Sending update payload:", updateCourseData)
               await updateCourse(cluster.clusterId, updateCourseData)
               onUpdate()
               onClose()
          } catch (err) {
               const message = err + ", " + "Failed to update course."
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
