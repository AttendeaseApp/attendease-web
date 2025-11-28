"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog"
import { Save, X, Filter, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { EventSession, EventStatus, EligibilityCriteria } from "@/interface/event/event-interface"
import { updateEvent } from "@/services/event-sessions"
import {
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/cluster-and-course-sessions"
import { getAllLocations } from "@/services/locations-service"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
import { Section } from "@/interface/students/SectionInterface"
import { EventLocation } from "@/interface/location-interface"
import EditEventStatusDialog from "./EditEventStatusDialog"

interface EditEventDialogProps {
     event: EventSession
     onUpdate: () => void
     isOpen: boolean
     onClose: () => void
}

interface EligibilityState {
     allStudents: boolean
     selectedClusters: string[]
     selectedCourses: string[]
     selectedSections: string[]
     isDirty: boolean
}

/**
 * EditEventDialog component for editing an existing event session.
 *
 * @param param0 as EditEventDialogProps
 * @returns JSX.Element The EditEventDialog component.
 */
export function EditEventDialog({ event, onUpdate, isOpen, onClose }: EditEventDialogProps) {
     const [formData, setFormData] = useState({
          eventName: event.eventName,
          description: event.description || "",
          timeInRegistrationStartDateTime: event.timeInRegistrationStartDateTime,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          eventStatus: event.eventStatus,
          eventLocationId: event.eventLocationId || "",
     })
     const [eligibility, setEligibility] = useState<EligibilityState>({
          allStudents: event.eligibleStudents?.allStudents ?? true,
          selectedClusters: event.eligibleStudents?.cluster ?? [],
          selectedCourses: event.eligibleStudents?.course ?? [],
          selectedSections: event.eligibleStudents?.sections ?? [],
          isDirty: false,
     })
     const [errors, setErrors] = useState<Record<string, string>>({})
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [clusters, setClusters] = useState<ClusterSession[]>([])
     const [courses, setCourses] = useState<CourseSession[]>([])
     const [sections, setSections] = useState<Section[]>([])
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [loadingHierarchy, setLoadingHierarchy] = useState(true)
     const [loadingLocations, setLoadingLocations] = useState(true)

     useEffect(() => {
          if (isOpen && event) {
               const formatToLocal = (dateStr?: string) => {
                    if (!dateStr) return ""
                    const date = new Date(dateStr.replace(" ", "T"))
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, "0")
                    const day = String(date.getDate()).padStart(2, "0")
                    const hours = String(date.getHours()).padStart(2, "0")
                    const minutes = String(date.getMinutes()).padStart(2, "0")
                    return `${year}-${month}-${day}T${hours}:${minutes}`
               }
               setFormData((prev) => ({
                    ...prev,
                    timeInRegistrationStartDateTime: formatToLocal(
                         event.timeInRegistrationStartDateTime
                    ),
                    startDateTime: formatToLocal(event.startDateTime),
                    endDateTime: formatToLocal(event.endDateTime),
               }))
          }
     }, [isOpen, event])

     useEffect(() => {
          const loadData = async () => {
               if (!isOpen) return
               try {
                    setLoadingHierarchy(true)
                    setLoadingLocations(true)
                    const [clustData, courseData, sectData, locData] = await Promise.all([
                         getAllClusters(),
                         getAllCourses(),
                         getAllSections(),
                         getAllLocations(),
                    ])
                    setClusters(clustData)
                    setCourses(courseData)
                    setSections(sectData)
                    setLocations(locData)
               } catch (err) {
                    console.error("Failed to load hierarchy data:", err)
                    setErrors((prev) => ({
                         ...prev,
                         general: "Failed to load eligibility options.",
                    }))
               } finally {
                    setLoadingHierarchy(false)
                    setLoadingLocations(false)
               }
          }
          loadData()
     }, [isOpen])

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [editStatus, setEditStatus] = useState<"success" | "error">("success")
     const [editMessage, setEditMessage] = useState("")

     const showStatus = (status: "success" | "error", message: string) => {
          setEditStatus(status)
          setEditMessage(message)
          setStatusDialogOpen(true)
     }

     const validateForm = () => {
          const newErrors: Record<string, string> = {}
          if (!formData.eventName.trim()) newErrors.eventName = "Event name is required"
          if (!formData.timeInRegistrationStartDateTime)
               newErrors.timeInRegistrationStartDateTime = "Registration start is required"
          if (!formData.startDateTime) newErrors.startDateTime = "Start date is required"
          if (!formData.endDateTime) newErrors.endDateTime = "End date is required"
          if (!formData.eventLocationId) newErrors.eventLocationId = "Location is required"
          if (
               !eligibility.allStudents &&
               eligibility.isDirty &&
               eligibility.selectedClusters.length === 0 &&
               eligibility.selectedCourses.length === 0 &&
               eligibility.selectedSections.length === 0
          ) {
               newErrors.eligibility = "Select at least one cluster, course, or section."
          }
          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
     }

     const handleInputChange = (field: keyof typeof formData, value: string | Date) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }))
     }

     const handleAllStudentsToggle = (checked: boolean) => {
          setEligibility({
               allStudents: checked,
               selectedClusters: checked ? [] : eligibility.selectedClusters,
               selectedCourses: checked ? [] : eligibility.selectedCourses,
               selectedSections: checked ? [] : eligibility.selectedSections,
               isDirty: true,
          })
     }

     const handleClusterSelect = (clusterId: string, checked: boolean) => {
          const newClusters = checked
               ? [...eligibility.selectedClusters, clusterId]
               : eligibility.selectedClusters.filter((id) => id !== clusterId)
          setEligibility((prev) => ({
               ...prev,
               selectedClusters: newClusters,
               selectedCourses: [],
               selectedSections: [],
               isDirty: true,
          }))
     }

     const handleCourseSelect = (courseId: string, checked: boolean) => {
          const newCourses = checked
               ? [...eligibility.selectedCourses, courseId]
               : eligibility.selectedCourses.filter((id) => id !== courseId)
          setEligibility((prev) => ({
               ...prev,
               selectedCourses: newCourses,
               selectedSections: [],
               isDirty: true,
          }))
     }

     const handleSectionSelect = (sectionId: string, checked: boolean) => {
          const newSections = checked
               ? [...eligibility.selectedSections, sectionId]
               : eligibility.selectedSections.filter((id) => id !== sectionId)
          setEligibility((prev) => ({ ...prev, selectedSections: newSections, isDirty: true }))
     }

     const filteredCourses = courses.filter((course) =>
          eligibility.selectedClusters.includes(course.cluster?.clusterId || "")
     )

     const filteredSections = sections.filter((section) =>
          eligibility.selectedCourses.includes(section.course?.id || "")
     )

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!validateForm()) return

          setIsSubmitting(true)
          try {
               const updatedData: Partial<EventSession> = {
                    eventName: formData.eventName,
                    description: formData.description || undefined,
                    timeInRegistrationStartDateTime: format(
                         new Date(formData.timeInRegistrationStartDateTime),
                         "yyyy-MM-dd HH:mm:ss"
                    ),
                    startDateTime: format(new Date(formData.startDateTime), "yyyy-MM-dd HH:mm:ss"),
                    endDateTime: format(new Date(formData.endDateTime), "yyyy-MM-dd HH:mm:ss"),
                    eventStatus: formData.eventStatus,
                    eventLocationId: formData.eventLocationId || undefined,
               }
               if (eligibility.isDirty || !eligibility.allStudents) {
                    updatedData.eligibleStudents = {
                         allStudents: eligibility.allStudents,
                         ...(eligibility.allStudents
                              ? {}
                              : {
                                     cluster: eligibility.selectedClusters,
                                     course: eligibility.selectedCourses,
                                     sections: eligibility.selectedSections,
                                }),
                    } as EligibilityCriteria
               }
               await updateEvent(event.eventId, updatedData)
               showStatus("success", "Successfully updated the event.")
          } catch (error) {
               console.error("Update failed:", error)
               setErrors({ general: "Failed to update event. Please try again." })
               showStatus("error", "Failed to update the event. Please verify time and location")
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          setErrors({})
          setIsSubmitting(false)
          onClose()
     }

     return (
          <>
               <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                         <DialogHeader>
                              <DialogTitle>Edit Event: {event.eventName}</DialogTitle>
                              <DialogDescription>Update the event details below.</DialogDescription>
                         </DialogHeader>
                         <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="space-y-2">
                                   <Label htmlFor="eventName">Event Name</Label>
                                   <Input
                                        id="eventName"
                                        value={formData.eventName}
                                        onChange={(e) =>
                                             handleInputChange("eventName", e.target.value)
                                        }
                                        placeholder="Enter event name"
                                        className={errors.eventName ? "border-red-500" : ""}
                                   />
                                   {errors.eventName && (
                                        <p className="text-sm text-red-500">{errors.eventName}</p>
                                   )}
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="description">Description</Label>
                                   <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                             handleInputChange("description", e.target.value)
                                        }
                                        placeholder="Enter description"
                                   />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="regStart">Registration Start</Label>
                                        <Input
                                             id="regStart"
                                             type="datetime-local"
                                             value={formData.timeInRegistrationStartDateTime}
                                             onChange={(e) =>
                                                  handleInputChange(
                                                       "timeInRegistrationStartDateTime",
                                                       e.target.value
                                                  )
                                             }
                                             className={
                                                  errors.timeInRegistrationStartDateTime
                                                       ? "border-red-500"
                                                       : ""
                                             }
                                        />
                                        {errors.timeInRegistrationStartDateTime && (
                                             <p className="text-sm text-red-500">
                                                  {errors.timeInRegistrationStartDateTime}
                                             </p>
                                        )}
                                   </div>
                                   <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                             id="startDate"
                                             type="datetime-local"
                                             value={formData.startDateTime}
                                             onChange={(e) =>
                                                  handleInputChange("startDateTime", e.target.value)
                                             }
                                             className={
                                                  errors.startDateTime ? "border-red-500" : ""
                                             }
                                        />
                                        {errors.startDateTime && (
                                             <p className="text-sm text-red-500">
                                                  {errors.startDateTime}
                                             </p>
                                        )}
                                   </div>
                                   <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                             id="endDate"
                                             type="datetime-local"
                                             value={formData.endDateTime}
                                             onChange={(e) =>
                                                  handleInputChange("endDateTime", e.target.value)
                                             }
                                             className={errors.endDateTime ? "border-red-500" : ""}
                                        />
                                        {errors.endDateTime && (
                                             <p className="text-sm text-red-500">
                                                  {errors.endDateTime}
                                             </p>
                                        )}
                                   </div>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="status">Status</Label>
                                   <Select
                                        value={formData.eventStatus}
                                        onValueChange={(value) =>
                                             handleInputChange("eventStatus", value as EventStatus)
                                        }
                                   >
                                        <SelectTrigger id="status">
                                             <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value={EventStatus.UPCOMING}>
                                                  {EventStatus.UPCOMING}
                                             </SelectItem>
                                             <SelectItem value={EventStatus.ONGOING}>
                                                  {EventStatus.ONGOING}
                                             </SelectItem>
                                             <SelectItem value={EventStatus.CANCELLED}>
                                                  {EventStatus.CANCELLED}
                                             </SelectItem>
                                             <SelectItem value={EventStatus.CONCLUDED}>
                                                  {EventStatus.CONCLUDED}
                                             </SelectItem>
                                             <SelectItem value={EventStatus.FINALIZED}>
                                                  {EventStatus.FINALIZED}
                                             </SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="eventLocationId">Location</Label>
                                   <Select
                                        value={formData.eventLocationId}
                                        onValueChange={(value) =>
                                             handleInputChange("eventLocationId", value)
                                        }
                                        disabled={loadingLocations}
                                   >
                                        <SelectTrigger
                                             className={
                                                  errors.eventLocationId ? "border-red-500" : ""
                                             }
                                        >
                                             <SelectValue
                                                  placeholder={
                                                       loadingLocations
                                                            ? "Loading locations..."
                                                            : event.eventLocation?.locationName ||
                                                              "Select a location"
                                                  }
                                             />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {locations.map((loc) => (
                                                  <SelectItem
                                                       key={loc.locationId}
                                                       value={loc.locationId}
                                                  >
                                                       {loc.locationName}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                                   {errors.eventLocationId && (
                                        <p className="text-sm text-red-500">
                                             {errors.eventLocationId}
                                        </p>
                                   )}
                              </div>
                              <div className="space-y-4">
                                   <Label>Eligible Attendees</Label>
                                   <div className="p-4 border rounded-md bg-muted/50">
                                        <div className="space-y-3">
                                             <div className="flex items-center space-x-2">
                                                  <Checkbox
                                                       id="allStudents"
                                                       checked={eligibility.allStudents}
                                                       onCheckedChange={handleAllStudentsToggle}
                                                  />
                                                  <Label
                                                       htmlFor="allStudents"
                                                       className="text-sm font-medium"
                                                  >
                                                       All Students
                                                  </Label>
                                             </div>
                                             {!eligibility.allStudents && (
                                                  <div className="space-y-4 pt-2">
                                                       <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                 <Filter className="h-4 w-4" />
                                                                 Select Clusters
                                                            </Label>
                                                            {loadingHierarchy ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      Loading clusters...
                                                                 </p>
                                                            ) : (
                                                                 <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                      {clusters.map((cluster) => (
                                                                           <div
                                                                                key={
                                                                                     cluster.clusterId
                                                                                }
                                                                                className="flex items-center space-x-2"
                                                                           >
                                                                                <Checkbox
                                                                                     id={`cluster-${cluster.clusterId}`}
                                                                                     checked={eligibility.selectedClusters.includes(
                                                                                          cluster.clusterId ||
                                                                                               ""
                                                                                     )}
                                                                                     onCheckedChange={(
                                                                                          checked
                                                                                     ) =>
                                                                                          handleClusterSelect(
                                                                                               cluster.clusterId ||
                                                                                                    "",
                                                                                               !!checked
                                                                                          )
                                                                                     }
                                                                                />
                                                                                <Label
                                                                                     htmlFor={`cluster-${cluster.clusterId}`}
                                                                                     className="text-sm"
                                                                                >
                                                                                     {
                                                                                          cluster.clusterName
                                                                                     }
                                                                                </Label>
                                                                           </div>
                                                                      ))}
                                                                 </div>
                                                            )}
                                                       </div>
                                                       <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                 <Filter className="h-4 w-4" />
                                                                 Select Courses{" "}
                                                                 <ChevronRight className="h-3 w-3" />
                                                            </Label>
                                                            {loadingHierarchy ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      Loading courses...
                                                                 </p>
                                                            ) : filteredCourses.length === 0 &&
                                                              eligibility.selectedClusters.length >
                                                                   0 ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      No courses in selected
                                                                      clusters.
                                                                 </p>
                                                            ) : (
                                                                 <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                      {filteredCourses.map(
                                                                           (course) => (
                                                                                <div
                                                                                     key={course.id}
                                                                                     className="flex items-center space-x-2"
                                                                                >
                                                                                     <Checkbox
                                                                                          id={`course-${course.id}`}
                                                                                          checked={eligibility.selectedCourses.includes(
                                                                                               course.id
                                                                                          )}
                                                                                          onCheckedChange={(
                                                                                               checked
                                                                                          ) =>
                                                                                               handleCourseSelect(
                                                                                                    course.id,
                                                                                                    !!checked
                                                                                               )
                                                                                          }
                                                                                     />
                                                                                     <Label
                                                                                          htmlFor={`course-${course.id}`}
                                                                                          className="text-sm"
                                                                                     >
                                                                                          {
                                                                                               course.courseName
                                                                                          }
                                                                                     </Label>
                                                                                </div>
                                                                           )
                                                                      )}
                                                                 </div>
                                                            )}
                                                       </div>
                                                       <div className="space-y-2">
                                                            <Label className="flex items-center gap-2 text-sm font-medium">
                                                                 <Filter className="h-4 w-4" />
                                                                 Select Sections{" "}
                                                                 <ChevronRight className="h-3 w-3" />
                                                            </Label>
                                                            {loadingHierarchy ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      Loading sections...
                                                                 </p>
                                                            ) : filteredSections.length === 0 &&
                                                              eligibility.selectedCourses.length >
                                                                   0 ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      No sections in selected
                                                                      courses.
                                                                 </p>
                                                            ) : (
                                                                 <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                      {filteredSections.map(
                                                                           (section) => (
                                                                                <div
                                                                                     key={
                                                                                          section.id
                                                                                     }
                                                                                     className="flex items-center space-x-2"
                                                                                >
                                                                                     <Checkbox
                                                                                          id={`section-${section.id}`}
                                                                                          checked={eligibility.selectedSections.includes(
                                                                                               section.id
                                                                                          )}
                                                                                          onCheckedChange={(
                                                                                               checked
                                                                                          ) =>
                                                                                               handleSectionSelect(
                                                                                                    section.id,
                                                                                                    !!checked
                                                                                               )
                                                                                          }
                                                                                     />
                                                                                     <Label
                                                                                          htmlFor={`section-${section.id}`}
                                                                                          className="text-sm"
                                                                                     >
                                                                                          {
                                                                                               section.name
                                                                                          }
                                                                                     </Label>
                                                                                </div>
                                                                           )
                                                                      )}
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                                   {errors.eligibility && (
                                        <p className="text-sm text-red-500">{errors.eligibility}</p>
                                   )}
                              </div>
                              {errors.general && (
                                   <p className="text-sm text-red-500 p-2 bg-red-50 rounded">
                                        {errors.general}
                                   </p>
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
                                        disabled={isSubmitting || loadingHierarchy}
                                   >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                   </Button>
                              </DialogFooter>
                         </form>
                    </DialogContent>
               </Dialog>
               <EditEventStatusDialog
                    open={statusDialogOpen}
                    status={editStatus}
                    message={editMessage}
                    onClose={() => {
                         setStatusDialogOpen(false)
                         if (editStatus === "success") {
                              onUpdate()
                              onClose()
                         }
                    }}
               />
          </>
     )
}
