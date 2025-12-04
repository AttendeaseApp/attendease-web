"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { EligibilityCriteria, EventSession, EventStatus } from "@/interface/event/event-interface"
import { EventLocation } from "@/interface/location-interface"
import {
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/cluster-and-course-sessions"
import { updateEvent } from "@/services/event-sessions"
import { getAllLocations } from "@/services/locations-service"
import { format } from "date-fns"
import { ChevronDownIcon, ChevronRight, Filter, Save, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import EditEventStatusDialog from "./EditEventStatusDialog"
import { toast } from "sonner"

interface EditEventDialogProps {
     event: EventSession
     onUpdate: () => void
     isOpen: boolean
     onClose: () => void
}

type DateFields = "timeInRegistrationStartDateTime" | "startDateTime" | "endDateTime"
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
     const [formData, setFormData] = useState<{
          eventName: string
          description: string
          timeInRegistrationStartDateTime: Date
          startDateTime: Date
          endDateTime: Date
          eventStatus: EventStatus
          eventLocationId?: string | undefined
     }>({
          eventName: event.eventName,
          description: event.description || "",
          timeInRegistrationStartDateTime: new Date(event.timeInRegistrationStartDateTime),
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
          eventStatus: event.eventStatus || EventStatus.UPCOMING,
          eventLocationId: event.eventLocationId || undefined,
     })

     const [eligibility, setEligibility] = useState<EligibilityState>({
          allStudents: true,
          selectedClusters: [],
          selectedCourses: [],
          selectedSections: [],
          isDirty: false,
     })
     const [hasChanges, setHasChanges] = useState(false)
     const [errors, setErrors] = useState<Record<string, string>>({})
     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          const loadLocations = async () => {
               try {
                    setLoadingLocations(true)
                    const data = await getAllLocations()
                    setLocations(data)
               } catch (err) {
                    console.error("Failed to load locations:", err)
               } finally {
                    setLoadingLocations(false)
               }
          }

          loadLocations()
     }, [])
     const [clusters, setClusters] = useState<Cluster[]>([])
     const [courses, setCourses] = useState<Course[]>([])
     const [sections, setSections] = useState<Section[]>([])
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [loadingHierarchy, setLoadingHierarchy] = useState(true)
     const [loadingLocations, setLoadingLocations] = useState(true)

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [editStatus, setEditStatus] = useState<"success" | "error">("success")
     const [editMessage, setEditMessage] = useState("")

     const getCoursesUnderCluster = useCallback(
          (clId: string) => {
               return courses.filter((c) => c.cluster?.clusterId === clId).map((c) => c.id)
          },
          [courses]
     )

     const getSectionsUnderCourse = useCallback(
          (coId: string) => {
               return sections.filter((s) => s.course?.id === coId).map((s) => s.id)
          },
          [sections]
     )

     const getClusterOfCourse = useCallback(
          (coId: string) => {
               const course = courses.find((c) => c.id === coId)
               return course?.cluster?.clusterId
          },
          [courses]
     )

     const getCourseOfSection = useCallback(
          (seId: string) => {
               const section = sections.find((s) => s.id === seId)
               return section?.course?.id
          },
          [sections]
     )

     const cleanEligibility = useCallback(
          (selClusters: string[], selCourses: string[], selSecs: string[]) => {
               let newCourses = [...selCourses]
               const newSecs = [...selSecs]
               let newClusters = [...selClusters]
               newCourses = newCourses.filter((coId) => {
                    const coSecs = getSectionsUnderCourse(coId)
                    return coSecs.length === 0 || coSecs.every((seId) => selSecs.includes(seId))
               })
               newClusters = newClusters.filter((clId) => {
                    const clCourses = getCoursesUnderCluster(clId)
                    return (
                         clCourses.length === 0 ||
                         clCourses.every((coId) => newCourses.includes(coId))
                    )
               })
               return {
                    selectedClusters: newClusters,
                    selectedCourses: newCourses,
                    selectedSections: newSecs,
               }
          },
          [getSectionsUnderCourse, getCoursesUnderCluster]
     )

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

     useEffect(() => {
          if (isOpen && event && clusters.length > 0 && courses.length > 0 && sections.length > 0) {
               // const formatToLocal = (dateStr?: string): string => {
               //      if (!dateStr) return ""
               //      try {
               //           const parsedDate = new Date(dateStr.replace(" ", "T"))
               //           if (isNaN(parsedDate.getTime())) {
               //                return ""
               //           }
               //           const year = parsedDate.getFullYear()
               //           const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
               //           const day = String(parsedDate.getDate()).padStart(2, "0")
               //           const hours = String(parsedDate.getHours()).padStart(2, "0")
               //           const minutes = String(parsedDate.getMinutes()).padStart(2, "0")
               //           return `${year}-${month}-${day}T${hours}:${minutes}`
               //      } catch (err) {
               //           console.error("Date parsing error:", err)
               //           return ""
               //      }
               // }

               setFormData({
                    ...formData,
                    eventName: event.eventName || "",
                    description: event.description || "",
                    timeInRegistrationStartDateTime: new Date(
                         event.timeInRegistrationStartDateTime
                    ),
                    startDateTime: new Date(event.startDateTime),
                    endDateTime: new Date(event.endDateTime),
                    eventStatus: event.eventStatus,
                    eventLocationId: event.eventLocationId || "",
               })

               const tempElig = {
                    allStudents: event.eligibleStudents?.allStudents ?? true,
                    selectedClusters: event.eligibleStudents?.cluster ?? [],
                    selectedCourses: event.eligibleStudents?.course ?? [],
                    selectedSections: event.eligibleStudents?.sections ?? [],
               }

               let finalElig = { ...tempElig }

               if (!tempElig.allStudents) {
                    const cleaned = cleanEligibility(
                         tempElig.selectedClusters,
                         tempElig.selectedCourses,
                         tempElig.selectedSections
                    )
                    finalElig = {
                         allStudents: false,
                         selectedClusters: cleaned.selectedClusters,
                         selectedCourses: cleaned.selectedCourses,
                         selectedSections: cleaned.selectedSections,
                    }
               }

               setEligibility({
                    ...finalElig,
                    isDirty: false,
               })

               setHasChanges(false)
               setErrors({})
          }
     }, [isOpen, event, clusters.length, courses.length, sections.length, cleanEligibility, formData])

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
          setHasChanges(true)
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
          setHasChanges(true)
     }

     const handleClusterSelect = useCallback(
          (clusterId: string, checked: boolean) => {
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
                         isDirty: true,
                    }
               })
               setHasChanges(true)
          },
          [getCoursesUnderCluster, getSectionsUnderCourse, getCourseOfSection]
     )

     const handleCourseSelect = useCallback(
          (courseId: string, checked: boolean) => {
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
                                   const allSelected = clCourses.every((cid) =>
                                        newCourses.includes(cid)
                                   )
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
                         isDirty: true,
                    }
               })
               setHasChanges(true)
          },
          [getSectionsUnderCourse, getClusterOfCourse, getCoursesUnderCluster]
     )

     const handleSectionSelect = useCallback(
          (sectionId: string, checked: boolean) => {
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
                                   const allSelected = coSecs.every((sid) =>
                                        newSections.includes(sid)
                                   )
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
                         isDirty: true,
                    }
               })
               setHasChanges(true)
          },
          [getCourseOfSection, getSectionsUnderCourse, getClusterOfCourse, getCoursesUnderCluster]
     )

     const filteredCourses =
          eligibility.selectedClusters.length === 0
               ? courses
               : courses.filter((course) =>
                      eligibility.selectedClusters.some(
                           (clId) => course.cluster?.clusterId === clId
                      )
                 )

     const filteredSections =
          eligibility.selectedCourses.length === 0
               ? sections
               : sections.filter((section) =>
                      eligibility.selectedCourses.some((coId) => section.course?.id === coId)
                 )

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!validateForm()) return
          setIsSubmitting(true)
          try {
               // const parseDateTime = (dateTimeStr: string): Date => {
               //      return new Date(dateTimeStr)
               // }

               let eligibleStudents: EligibilityCriteria | undefined
               if (eligibility.isDirty || !eligibility.allStudents) {
                    const cleaned = cleanEligibility(
                         eligibility.selectedClusters,
                         eligibility.selectedCourses,
                         eligibility.selectedSections
                    )
                    eligibleStudents = {
                         allStudents: eligibility.allStudents,
                         ...(eligibility.allStudents
                              ? {}
                              : {
                                     cluster: cleaned.selectedClusters,
                                     course: cleaned.selectedCourses,
                                     sections: cleaned.selectedSections,
                                }),
                    } as EligibilityCriteria
               }

               const updatedData: Partial<EventSession> = {
                    eventName: formData.eventName,
                    description: formData.description || undefined,
                    timeInRegistrationStartDateTime: format(
                         formData.timeInRegistrationStartDateTime,
                         "yyyy-MM-dd hh:mm:ss a"
                    ),
                    startDateTime: format(formData.startDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    endDateTime: format(formData.endDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    eventStatus: formData.eventStatus,
                    eventLocationId: formData.eventLocationId || undefined,
                    ...(eligibleStudents && { eligibleStudents }),
               }

               await updateEvent(event.eventId, updatedData)
               toast.success("Successfully updated the event.")
          } catch (error) {
               console.error("Update failed:", error)
               setErrors({ general: "Failed to update event. Please try again." })
               toast.error("Failed to update the event. Please verify time and location" + error)
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          setErrors({})
          setIsSubmitting(false)
          onClose()
     }

     const getDateDisplay = (date: Date): string => format(date, "MMM dd, yyyy")
     const getHour12 = (date: Date): string => format(date, "h")
     const getMinute = (date: Date): string => format(date, "mm")
     const getPeriod = (date: Date): "AM" | "PM" => format(date, "a").toUpperCase() as "AM" | "PM"

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
                                   {/* Registration Start */}
                                   <div className="space-y-2">
                                        <Label htmlFor="regStart">Registration Start</Label>
                                        <div className="flex flex-col gap-3">
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
                                                  {errors.timeInRegistrationStartDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.timeInRegistrationStartDateTime}
                                                       </p>
                                                  )}
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
                                        {errors.timeInRegistrationStartDateTime && (
                                             <p className="text-sm text-red-500">
                                                  {errors.timeInRegistrationStartDateTime}
                                             </p>
                                        )}
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
                                                  {errors.startDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.startDateTime}
                                                       </p>
                                                  )}
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
                                                  {errors.endDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.endDateTime}
                                                       </p>
                                                  )}
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
                                                            ) : filteredCourses.length === 0 ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      No courses available.
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
                                                            ) : filteredSections.length === 0 ? (
                                                                 <p className="text-sm text-muted-foreground">
                                                                      No sections available.
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
                                                                                               section.sectionName
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
                                        disabled={isSubmitting || loadingHierarchy || !hasChanges}
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
