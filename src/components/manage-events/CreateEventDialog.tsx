"use client"

import { useState, useEffect } from "react"
import { format, addHours } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Filter, ChevronRight, ChevronDownIcon, Plus, X } from "lucide-react"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createEvent } from "@/services/event-sessions"
import { getAllLocations } from "@/services/locations-service"
import { EventLocation } from "@/interface/location-interface"
import {
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/cluster-and-course-sessions"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
import { Section } from "@/interface/students/SectionInterface"
import CreateEventStatusDialog from "@/components/manage-events/CreateEventStatusDialog"

interface CreateEventDialogProps {
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
}

type DateFields = "timeInRegistrationStartDateTime" | "startDateTime" | "endDateTime"

interface EligibilityState {
     allStudents: boolean
     selectedClusters: string[]
     selectedCourses: string[]
     selectedSections: string[]
}

/**
 * CreateEventDialog component for creating a new event session.
 *
 * @param param0 as CreateEventDialogProps
 * @returns JSX.Element The CreateEventDialog component.
 */
export function CreateEventDialog({ isOpen, onClose, onCreate }: CreateEventDialogProps) {
     const now = new Date()
     const [formData, setFormData] = useState({
          eventName: "",
          description: "",
          timeInRegistrationStartDateTime: now,
          startDateTime: addHours(now, 1),
          endDateTime: addHours(now, 3),
          eventLocationId: "",
     })
     const [eligibility, setEligibility] = useState<EligibilityState>({
          allStudents: true,
          selectedClusters: [],
          selectedCourses: [],
          selectedSections: [],
     })
     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [clusters, setClusters] = useState<ClusterSession[]>([])
     const [courses, setCourses] = useState<CourseSession[]>([])
     const [sections, setSections] = useState<Section[]>([])
     const [loadingLocations, setLoadingLocations] = useState(true)
     const [loadingHierarchy, setLoadingHierarchy] = useState(true)
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [createStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [createMessage, setCreateMessage] = useState("")

     const showStatus = (status: "success" | "error", message: string) => {
          setCreateStatus(status)
          setCreateMessage(message)
          setStatusDialogOpen(true)
     }

     const getCoursesUnderCluster = (clId: string) => {
          return courses.filter((c) => c.cluster?.clusterId === clId).map((c) => c.id)
     }

     const getSectionsUnderCourse = (coId: string) => {
          return sections.filter((s) => s.course?.id === coId).map((s) => s.id)
     }

     const getClusterOfCourse = (coId: string) => {
          const course = courses.find((c) => c.id === coId)
          return course?.cluster?.clusterId
     }

     const getCourseOfSection = (seId: string) => {
          const section = sections.find((s) => s.id === seId)
          return section?.course?.id
     }

     const cleanEligibility = (selClusters: string[], selCourses: string[], selSecs: string[]) => {
          let newCourses = [...selCourses]
          const newSecs = [...selSecs]
          let newClusters = [...selClusters]
          newCourses = newCourses.filter((coId) => {
               const coSecs = getSectionsUnderCourse(coId)
               return coSecs.length === 0 || coSecs.every((seId) => selSecs.includes(seId))
          })
          newClusters = newClusters.filter((clId) => {
               const clCourses = getCoursesUnderCluster(clId)
               return clCourses.length === 0 || clCourses.every((coId) => newCourses.includes(coId))
          })
          return {
               selectedClusters: newClusters,
               selectedCourses: newCourses,
               selectedSections: newSecs,
          }
     }

     useEffect(() => {
          const loadData = async () => {
               try {
                    setLoadingLocations(true)
                    setLoadingHierarchy(true)
                    const [locData, clustData, courseData, sectData] = await Promise.all([
                         getAllLocations(),
                         getAllClusters(),
                         getAllCourses(),
                         getAllSections(),
                    ])
                    setLocations(locData)
                    setClusters(clustData)
                    setCourses(courseData)
                    setSections(sectData)
               } catch (err) {
                    console.error("Failed to load data:", err)
                    setError("Failed to load required data (locations or academic hierarchy).")
               } finally {
                    setLoadingLocations(false)
                    setLoadingHierarchy(false)
               }
          }
          if (isOpen) loadData()
     }, [isOpen])

     useEffect(() => {
          if (isOpen) {
               const now = new Date()
               setFormData({
                    eventName: "",
                    description: "",
                    timeInRegistrationStartDateTime: now,
                    startDateTime: addHours(now, 1),
                    endDateTime: addHours(now, 3),
                    eventLocationId: "",
               })
               setEligibility({
                    allStudents: true,
                    selectedClusters: [],
                    selectedCourses: [],
                    selectedSections: [],
               })
               setError("")
          }
     }, [isOpen])

     const handleInputChange = (field: keyof typeof formData, value: string | Date) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleAllStudentsToggle = (checked: boolean) => {
          setEligibility({
               allStudents: checked,
               selectedClusters: checked ? [] : eligibility.selectedClusters,
               selectedCourses: checked ? [] : eligibility.selectedCourses,
               selectedSections: checked ? [] : eligibility.selectedSections,
          })
     }

     const handleClusterSelect = (clusterId: string, checked: boolean) => {
          setEligibility((prev) => {
               let newClusters = [...prev.selectedClusters]
               let newCourses = [...prev.selectedCourses]
               let newSections = [...prev.selectedSections]
               if (checked) {
                    if (!newClusters.includes(clusterId)) {
                         newClusters.push(clusterId)
                         const clCourses = getCoursesUnderCluster(clusterId)
                         clCourses.forEach((coId) => {
                              if (!newCourses.includes(coId)) {
                                   newCourses.push(coId)
                                   const coSecs = getSectionsUnderCourse(coId)
                                   coSecs.forEach((seId) => {
                                        if (!newSections.includes(seId)) {
                                             newSections.push(seId)
                                        }
                                   })
                              }
                         })
                    }
               } else {
                    newClusters = newClusters.filter((id) => id !== clusterId)
                    const clCourses = getCoursesUnderCluster(clusterId)
                    newCourses = newCourses.filter((id) => !clCourses.includes(id))
                    newSections = newSections.filter((seId) => {
                         const coId = getCourseOfSection(seId)
                         return coId && !clCourses.includes(coId)
                    })
               }
               return {
                    ...prev,
                    selectedClusters: newClusters,
                    selectedCourses: newCourses,
                    selectedSections: newSections,
               }
          })
     }

     const handleCourseSelect = (courseId: string, checked: boolean) => {
          setEligibility((prev) => {
               let newCourses = [...prev.selectedCourses]
               let newSections = [...prev.selectedSections]
               let newClusters = [...prev.selectedClusters]
               if (checked) {
                    if (!newCourses.includes(courseId)) {
                         newCourses.push(courseId)
                         const coSecs = getSectionsUnderCourse(courseId)
                         coSecs.forEach((seId) => {
                              if (!newSections.includes(seId)) {
                                   newSections.push(seId)
                              }
                         })
                         const clId = getClusterOfCourse(courseId)
                         if (clId && !newClusters.includes(clId)) {
                              const clCourses = getCoursesUnderCluster(clId)
                              const allSelected = clCourses.every((cid) => newCourses.includes(cid))
                              if (allSelected) {
                                   newClusters.push(clId)
                              }
                         }
                    }
               } else {
                    newCourses = newCourses.filter((id) => id !== courseId)
                    const coSecs = getSectionsUnderCourse(courseId)
                    newSections = newSections.filter((id) => !coSecs.includes(id))
                    const clId = getClusterOfCourse(courseId)
                    if (clId && newClusters.includes(clId)) {
                         const clCourses = getCoursesUnderCluster(clId)
                         const stillAll = clCourses.every((cid) => newCourses.includes(cid))
                         if (!stillAll) {
                              newClusters = newClusters.filter((cid) => cid !== clId)
                         }
                    }
               }
               return {
                    ...prev,
                    selectedClusters: newClusters,
                    selectedCourses: newCourses,
                    selectedSections: newSections,
               }
          })
     }

     const handleSectionSelect = (sectionId: string, checked: boolean) => {
          setEligibility((prev) => {
               let newSections = [...prev.selectedSections]
               let newCourses = [...prev.selectedCourses]
               let newClusters = [...prev.selectedClusters]
               if (checked) {
                    if (!newSections.includes(sectionId)) {
                         newSections.push(sectionId)
                         const coId = getCourseOfSection(sectionId)
                         if (coId && !newCourses.includes(coId)) {
                              const coSecs = getSectionsUnderCourse(coId)
                              const allSelected = coSecs.every((sid) => newSections.includes(sid))
                              if (allSelected) {
                                   newCourses.push(coId)
                                   const clId = getClusterOfCourse(coId)
                                   if (clId && !newClusters.includes(clId)) {
                                        const clCourses = getCoursesUnderCluster(clId)
                                        const allCoursesSel = clCourses.every((cid) =>
                                             newCourses.includes(cid)
                                        )
                                        if (allCoursesSel) {
                                             newClusters.push(clId)
                                        }
                                   }
                              }
                         }
                    }
               } else {
                    newSections = newSections.filter((id) => id !== sectionId)
                    const coId = getCourseOfSection(sectionId)
                    if (coId && newCourses.includes(coId)) {
                         const coSecs = getSectionsUnderCourse(coId)
                         const stillAll = coSecs.every((sid) => newSections.includes(sid))
                         if (!stillAll) {
                              newCourses = newCourses.filter((cid) => cid !== coId)
                              const clId = getClusterOfCourse(coId)
                              if (clId && newClusters.includes(clId)) {
                                   const clCourses = getCoursesUnderCluster(clId)
                                   const stillAllCourses = clCourses.every((cid) =>
                                        newCourses.includes(cid)
                                   )
                                   if (!stillAllCourses) {
                                        newClusters = newClusters.filter((cid) => cid !== clId)
                                   }
                              }
                         }
                    }
               }

               return {
                    ...prev,
                    selectedClusters: newClusters,
                    selectedCourses: newCourses,
                    selectedSections: newSections,
               }
          })
     }

     const filteredCourses =
          eligibility.selectedClusters.length === 0
               ? courses
               : courses.filter((course) =>
                      eligibility.selectedClusters.includes(course.cluster?.clusterId || "")
                 )

     const filteredSections =
          eligibility.selectedCourses.length === 0
               ? sections
               : sections.filter((section) =>
                      eligibility.selectedCourses.includes(section.course?.id || "")
                 )

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")

          if (
               !eligibility.allStudents &&
               eligibility.selectedClusters.length === 0 &&
               eligibility.selectedCourses.length === 0 &&
               eligibility.selectedSections.length === 0
          ) {
               setError("Select at least one cluster, course, or section for eligibility.")
               return
          }

          setIsSubmitting(true)
          try {
               const cleaned = cleanEligibility(
                    eligibility.selectedClusters,
                    eligibility.selectedCourses,
                    eligibility.selectedSections
               )

               const newEventData = {
                    eventName: formData.eventName,
                    description: formData.description || undefined,
                    timeInRegistrationStartDateTime: format(
                         formData.timeInRegistrationStartDateTime,
                         "yyyy-MM-dd hh:mm:ss a"
                    ),
                    startDateTime: format(formData.startDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    endDateTime: format(formData.endDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    eventLocationId: formData.eventLocationId,
                    eligibleStudents: eligibility.allStudents
                         ? { allStudents: true }
                         : {
                                allStudents: false,
                                cluster: cleaned.selectedClusters,
                                course: cleaned.selectedCourses,
                                sections: cleaned.selectedSections,
                           },
               }
               console.log("Sending create payload:", newEventData)
               await createEvent(newEventData)

               showStatus("success", "Succesfully created the event.")
          } catch (err) {
               console.error("Create failed:", err)
               setError(err instanceof Error ? err.message : "Failed to create event.")
               showStatus("error", "Failed to create the event")
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          onClose()
     }

     const getDateDisplay = (date: Date): string => {
          return format(date, "MMM dd, yyyy")
     }

     const getHour12 = (date: Date): string => {
          return format(date, "h")
     }

     const getMinute = (date: Date): string => {
          return format(date, "mm")
     }

     const getPeriod = (date: Date): "AM" | "PM" => {
          return format(date, "a").toUpperCase() as "AM" | "PM"
     }

     const updateTime = (
          field: DateFields,
          hourStr?: string,
          minStr?: string,
          period?: "AM" | "PM"
     ) => {
          const date = formData[field]
          const currentHour12 = hourStr ?? getHour12(date)
          const currentMin = minStr ?? getMinute(date)
          const currentPeriod = period ?? getPeriod(date)

          let hour24 = parseInt(currentHour12)
          if (isNaN(hour24) || hour24 < 1 || hour24 > 12) return

          if (currentPeriod === "PM" && hour24 !== 12) hour24 += 12
          if (currentPeriod === "AM" && hour24 === 12) hour24 = 0

          const min = parseInt(currentMin)
          if (isNaN(min) || min < 0 || min > 59) return

          const newDate = new Date(date)
          newDate.setHours(hour24, min, 0, 0)
          handleInputChange(field, newDate)
     }

     const applyPreservedTimeToDate = (baseDate: Date, preservedDate: Date): Date => {
          const preservedHour12 = getHour12(preservedDate)
          const preservedMin = getMinute(preservedDate)
          const preservedPeriod = getPeriod(preservedDate)

          let hour24 = parseInt(preservedHour12)
          if (preservedPeriod === "PM" && hour24 !== 12) hour24 += 12
          if (preservedPeriod === "AM" && hour24 === 12) hour24 = 0

          const newDate = new Date(baseDate)
          newDate.setHours(hour24, parseInt(preservedMin), 0, 0)
          return newDate
     }

     const handleDateSelect = (field: DateFields, selectedDate: Date | undefined) => {
          if (selectedDate) {
               const preservedDate = formData[field]
               const newDate = applyPreservedTimeToDate(selectedDate, preservedDate)
               handleInputChange(field, newDate)
          }
     }

     if (!isOpen) return null

     return (
          <>
               <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                         <DialogHeader>
                              <DialogTitle>Create New Event</DialogTitle>
                              <DialogDescription>
                                   Fill in the details to create a new event.
                              </DialogDescription>
                         </DialogHeader>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="eventName">Event Name</Label>
                                   <Input
                                        id="eventName"
                                        value={formData.eventName}
                                        onChange={(e) =>
                                             handleInputChange("eventName", e.target.value)
                                        }
                                        placeholder="Enter event name"
                                        required
                                   />
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="description">Description</Label>
                                   <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                             handleInputChange("description", e.target.value)
                                        }
                                        placeholder="Enter description (optional)"
                                   />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   {/* Registration Start */}
                                   <div className="space-y-2">
                                        <Label>Registration Start</Label>
                                        <div className="flex flex-col gap-3">
                                             {/* Date Picker */}
                                             <Popover>
                                                  <PopoverTrigger asChild>
                                                       <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal"
                                                            id="reg-date"
                                                       >
                                                            {getDateDisplay(
                                                                 formData.timeInRegistrationStartDateTime
                                                            )}
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                       </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent
                                                       className="w-auto overflow-hidden p-0"
                                                       align="start"
                                                  >
                                                       <Calendar
                                                            mode="single"
                                                            selected={
                                                                 formData.timeInRegistrationStartDateTime
                                                            }
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "timeInRegistrationStartDateTime",
                                                                      selectedDate
                                                                 )
                                                            }
                                                            initialFocus
                                                       />
                                                  </PopoverContent>
                                             </Popover>
                                             {/* 12-Hour Time Inputs */}
                                             <div className="flex items-center gap-1">
                                                  <Input
                                                       type="number"
                                                       min={1}
                                                       max={12}
                                                       value={getHour12(
                                                            formData.timeInRegistrationStartDateTime
                                                       )}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "timeInRegistrationStartDateTime",
                                                                 e.target.value,
                                                                 undefined,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="1"
                                                  />
                                                  <span className="text-muted-foreground">:</span>
                                                  <Input
                                                       type="number"
                                                       min={0}
                                                       max={59}
                                                       step={1}
                                                       value={getMinute(
                                                            formData.timeInRegistrationStartDateTime
                                                       )}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "timeInRegistrationStartDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  <Select
                                                       value={getPeriod(
                                                            formData.timeInRegistrationStartDateTime
                                                       )}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "timeInRegistrationStartDateTime",
                                                                 undefined,
                                                                 undefined,
                                                                 value as "AM" | "PM"
                                                            )
                                                       }
                                                  >
                                                       <SelectTrigger className="w-20 h-10">
                                                            <SelectValue placeholder="AM/PM" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Start Date & Time */}
                                   <div className="space-y-2">
                                        <Label>Start Date & Time</Label>
                                        <div className="flex flex-col gap-3">
                                             {/* Date Picker */}
                                             <Popover>
                                                  <PopoverTrigger asChild>
                                                       <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal"
                                                            id="start-date"
                                                       >
                                                            {getDateDisplay(formData.startDateTime)}
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                       </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent
                                                       className="w-auto overflow-hidden p-0"
                                                       align="start"
                                                  >
                                                       <Calendar
                                                            mode="single"
                                                            selected={formData.startDateTime}
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "startDateTime",
                                                                      selectedDate
                                                                 )
                                                            }
                                                            initialFocus
                                                       />
                                                  </PopoverContent>
                                             </Popover>
                                             {/* 12-Hour Time Inputs */}
                                             <div className="flex items-center gap-1">
                                                  <Input
                                                       type="number"
                                                       min={1}
                                                       max={12}
                                                       value={getHour12(formData.startDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "startDateTime",
                                                                 e.target.value,
                                                                 undefined,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="1"
                                                  />
                                                  <span className="text-muted-foreground">:</span>
                                                  <Input
                                                       type="number"
                                                       min={0}
                                                       max={59}
                                                       step={1}
                                                       value={getMinute(formData.startDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "startDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  <Select
                                                       value={getPeriod(formData.startDateTime)}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "startDateTime",
                                                                 undefined,
                                                                 undefined,
                                                                 value as "AM" | "PM"
                                                            )
                                                       }
                                                  >
                                                       <SelectTrigger className="w-20 h-10">
                                                            <SelectValue placeholder="AM/PM" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </div>

                                   {/* End Date & Time */}
                                   <div className="space-y-2">
                                        <Label>End Date & Time</Label>
                                        <div className="flex flex-col gap-3">
                                             {/* Date Picker */}
                                             <Popover>
                                                  <PopoverTrigger asChild>
                                                       <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal"
                                                            id="end-date"
                                                       >
                                                            {getDateDisplay(formData.endDateTime)}
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                       </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent
                                                       className="w-auto overflow-hidden p-0"
                                                       align="start"
                                                  >
                                                       <Calendar
                                                            mode="single"
                                                            selected={formData.endDateTime}
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "endDateTime",
                                                                      selectedDate
                                                                 )
                                                            }
                                                            initialFocus
                                                       />
                                                  </PopoverContent>
                                             </Popover>
                                             {/* 12-Hour Time Inputs */}
                                             <div className="flex items-center gap-1">
                                                  <Input
                                                       type="number"
                                                       min={1}
                                                       max={12}
                                                       value={getHour12(formData.endDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "endDateTime",
                                                                 e.target.value,
                                                                 undefined,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="1"
                                                  />
                                                  <span className="text-muted-foreground">:</span>
                                                  <Input
                                                       type="number"
                                                       min={0}
                                                       max={59}
                                                       step={1}
                                                       value={getMinute(formData.endDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "endDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  <Select
                                                       value={getPeriod(formData.endDateTime)}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "endDateTime",
                                                                 undefined,
                                                                 undefined,
                                                                 value as "AM" | "PM"
                                                            )
                                                       }
                                                  >
                                                       <SelectTrigger className="w-20 h-10">
                                                            <SelectValue placeholder="AM/PM" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </div>
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
                                        <SelectTrigger>
                                             <SelectValue
                                                  placeholder={
                                                       loadingLocations
                                                            ? "Loading locations..."
                                                            : "Select a location"
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
                                                       {/* Clusters */}
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

                                                       {/* Courses (filtered by selected clusters) */}
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
                                                                      No courses available for
                                                                      selected clusters.
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
                                                                      No sections available for
                                                                      selected courses.
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
                                        disabled={isSubmitting || loadingHierarchy}
                                   >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {isSubmitting ? "Creating..." : "Create Event"}
                                   </Button>
                              </DialogFooter>
                         </form>
                    </DialogContent>
               </Dialog>

               <CreateEventStatusDialog
                    open={statusDialogOpen}
                    status={createStatus}
                    message={createMessage}
                    onClose={() => {
                         setStatusDialogOpen(false)
                         if (createStatus === "success") {
                              onClose()
                              onCreate()
                         }
                    }}
               />
          </>
     )
}
