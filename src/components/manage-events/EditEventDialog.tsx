"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
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
     SelectGroup,
     SelectItem,
     SelectLabel,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { EligibilityCriteria, EventSession, EventStatus } from "@/interface/event/event-interface"
import { EventLocation } from "@/interface/location-interface"
import { getAllClusters } from "@/services/api/academic/cluster-management-service"
import { getAllCourses } from "@/services/api/academic/course-management-service"
import { getAllSections } from "@/services/api/academic/section-management-service"
import { cancelEvent, updateEvent } from "@/services/event-sessions"
import { getAllLocations } from "@/services/locations-service"
import { format } from "date-fns"
import { ChevronDownIcon, Save, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import EditEventStatusDialog from "./EditEventStatusDialog"

interface EditEventDialogProps {
     event: EventSession
     onUpdate: () => void
     isOpen: boolean
     onClose: () => void
}

type DateFields = "registrationDateTime" | "startingDateTime" | "endingDateTime"
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
          registrationDateTime: Date
          startingDateTime: Date
          endingDateTime: Date
          eventStatus: EventStatus
          eligibleStudents?: EligibilityCriteria | undefined
          registrationLocationId?: string | undefined
          venueLocationId?: string | undefined
          facialVerificationEnabled?: boolean
          attendanceLocationMonitoringEnabled?: boolean
          strictLocationValidation?: boolean
     }>({
          eventName: event.eventName,
          description: event.description || "",
          registrationDateTime: new Date(event.registrationDateTime),
          startingDateTime: new Date(event.startingDateTime),
          endingDateTime: new Date(event.endingDateTime),
          eventStatus: event.eventStatus || EventStatus.UPCOMING,
          eligibleStudents: event.eligibleStudents,
          registrationLocationId: event.registrationLocationId || undefined,
          venueLocationId: event.venueLocationId || undefined,
          facialVerificationEnabled: event.facialVerificationEnabled || undefined,
          attendanceLocationMonitoringEnabled:
               event.attendanceLocationMonitoringEnabled || undefined,
          strictLocationValidation: event.strictLocationValidation || undefined,
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
     const [open, setOpen] = useState(false)
     const [searchQuery, setSearchQuery] = useState("")

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [editStatus] = useState<"success" | "error">("success")
     const [editMessage] = useState("")

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
               setFormData({
                    ...formData,
                    eventName: event.eventName || "",
                    description: event.description || "",
                    registrationDateTime: new Date(event.registrationDateTime),
                    startingDateTime: new Date(event.startingDateTime),
                    endingDateTime: new Date(event.endingDateTime),
                    eventStatus: event.eventStatus,
                    registrationLocationId: event.registrationLocationId || "",
                    venueLocationId: event.venueLocationId || "",
                    facialVerificationEnabled: !!event.facialVerificationEnabled,
                    attendanceLocationMonitoringEnabled: !!event.attendanceLocationMonitoringEnabled,
                    strictLocationValidation: !!event.strictLocationValidation,
               })

                const tempElig = {
                    allStudents: event.eligibleStudents?.allStudents ?? true,
                    selectedClusters: event.eligibleStudents?.clusters ?? [],
                    selectedCourses: event.eligibleStudents?.courses ?? [],
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

          // TODO: fix this later
     }, [isOpen, event, clusters.length, courses.length, sections.length, cleanEligibility])

     const validateForm = () => {
          const newErrors: Record<string, string> = {}
          if (!formData.eventName.trim()) newErrors.eventName = "Event name is required"
          if (!formData.registrationDateTime)
               newErrors.registrationDateTime = "Registration start is required"
          if (!formData.startingDateTime) newErrors.startingDateTime = "Start date is required"
          if (!formData.endingDateTime) newErrors.endingDateTime = "End date is required"
          if (!formData.registrationLocationId)
               newErrors.registrationLocationId = "Location is required"
          if (!formData.venueLocationId) newErrors.venueLocationId = "Location is required"
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

     const handleInputChange = (field: keyof typeof formData, value: string | Date | boolean) => {
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

     const handleCancelEvent = async () => {
          try {
               setIsSubmitting(true)
               await cancelEvent(event.eventId)
               toast.success("Event cancelled")
               onUpdate()
          } catch (error) {
               toast.error("Failed to cancel event" + error)
               console.error(error)
          } finally {
               setIsSubmitting(false)
          }
     }

     const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, " ").trim()

     const filterItems = <T,>(
          items: T[],
          opts: { key: keyof T } | { predicate: (item: T) => boolean }
     ) => {
          const search = normalize(searchQuery)

          if ("key" in opts) {
               const { key } = opts

               return items.filter((item) => {
                    const value = normalize((item[key] ?? "").toString())

                    if (!search) return true

                    return value.includes(search)
               })
          }

          return items.filter(opts.predicate)
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!validateForm()) return
          setIsSubmitting(true)
          try {
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
                                     clusters: cleaned.selectedClusters,
                                     courses: cleaned.selectedCourses,
                                     sections: cleaned.selectedSections,
                                }),
                    } as EligibilityCriteria
               }

               const updatedData: Partial<EventSession> = {
                    eventName: formData.eventName,
                    description: formData.description || undefined,
                    registrationDateTime: format(
                         formData.registrationDateTime,
                         "yyyy-MM-dd hh:mm:ss a"
                    ),
                    startingDateTime: format(formData.startingDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    endingDateTime: format(formData.endingDateTime, "yyyy-MM-dd hh:mm:ss a"),
                    eligibleStudents: formData.eligibleStudents || undefined,
                    registrationLocationId: formData.registrationLocationId || undefined,
                    venueLocationId: formData.venueLocationId || undefined,
                    ...(eligibleStudents && { eligibleStudents }),
               }

               await updateEvent(event.eventId, updatedData)
               toast.success("Successfully updated the event.")
               onUpdate()
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
                                                                 formData.registrationDateTime
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
                                                            selected={formData.registrationDateTime}
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "registrationDateTime",
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
                                                            formData.registrationDateTime
                                                       )}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "registrationDateTime",
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
                                                            formData.registrationDateTime
                                                       )}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "registrationDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  {errors.registrationDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.registrationDateTime}
                                                       </p>
                                                  )}
                                                  <Select
                                                       value={getPeriod(
                                                            formData.registrationDateTime
                                                       )}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "registrationDateTime",
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
                                        {errors.registrationDateTime && (
                                             <p className="text-sm text-red-500">
                                                  {errors.registrationDateTime}
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
                                                            {getDateDisplay(
                                                                 formData.startingDateTime
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
                                                            selected={formData.startingDateTime}
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "startingDateTime",
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
                                                       value={getHour12(formData.startingDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "startingDateTime",
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
                                                       value={getMinute(formData.startingDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "startingDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  {errors.startingDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.startingDateTime}
                                                       </p>
                                                  )}
                                                  <Select
                                                       value={getPeriod(formData.startingDateTime)}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "startingDateTime",
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
                                                            {getDateDisplay(
                                                                 formData.endingDateTime
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
                                                            selected={formData.endingDateTime}
                                                            onSelect={(selectedDate) =>
                                                                 handleDateSelect(
                                                                      "endingDateTime",
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
                                                       value={getHour12(formData.endingDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "endingDateTime",
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
                                                       value={getMinute(formData.endingDateTime)}
                                                       onChange={(e) =>
                                                            updateTime(
                                                                 "endingDateTime",
                                                                 undefined,
                                                                 e.target.value,
                                                                 undefined
                                                            )
                                                       }
                                                       className="w-16 h-10"
                                                       placeholder="00"
                                                  />
                                                  {errors.endingDateTime && (
                                                       <p className="text-sm text-red-500">
                                                            {errors.endingDateTime}
                                                       </p>
                                                  )}
                                                  <Select
                                                       value={getPeriod(formData.endingDateTime)}
                                                       onValueChange={(value) =>
                                                            updateTime(
                                                                 "endingDateTime",
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

                              <div className="grid grid-cols-2 gap-4 w-full">
                                   <div className="space-y-2">
                                        <Label htmlFor="registrationLocationId">
                                             Registration Location
                                        </Label>
                                        <Select
                                             value={formData.registrationLocationId}
                                             onValueChange={(value) =>
                                                  handleInputChange("registrationLocationId", value)
                                             }
                                             disabled={loadingLocations}
                                        >
                                             <SelectTrigger
                                                  className={
                                                       errors.registrationLocationId
                                                            ? "border-red-500"
                                                            : ""
                                                  }
                                             >
                                                  <SelectValue
                                                       placeholder={
                                                            loadingLocations
                                                                 ? "Loading locations..."
                                                                 : event.registrationLocationName ||
                                                                   "Select registration location"
                                                       }
                                                  />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectGroup>
                                                       <SelectLabel className="mb-3">
                                                            Registration Venues
                                                       </SelectLabel>
                                                       {locations
                                                            .filter(
                                                                 (loc) =>
                                                                      loc.locationPurposeType ===
                                                                      "REGISTRATION_AREA"
                                                            )
                                                            .map((loc) => (
                                                                 <SelectItem
                                                                      key={loc.locationId}
                                                                      value={loc.locationId}
                                                                 >
                                                                      {loc.locationName}
                                                                 </SelectItem>
                                                            ))}
                                                  </SelectGroup>
                                             </SelectContent>
                                        </Select>
                                   </div>

                                   <div className="space-y-2">
                                        <Label htmlFor="venueLocationId">Event Location</Label>
                                        <Select
                                             value={formData.venueLocationId}
                                             onValueChange={(value) =>
                                                  handleInputChange("venueLocationId", value)
                                             }
                                             disabled={loadingLocations}
                                        >
                                             <SelectTrigger
                                                  className={
                                                       errors.venueLocationId
                                                            ? "border-red-500"
                                                            : ""
                                                  }
                                             >
                                                  <SelectValue
                                                       placeholder={
                                                            loadingLocations
                                                                 ? "Loading locations..."
                                                                 : event.venueLocationName ||
                                                                   "Select event location"
                                                       }
                                                  />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectGroup>
                                                       <SelectLabel className="mb-3">
                                                            Event Venues
                                                       </SelectLabel>
                                                       {locations
                                                            .filter(
                                                                 (loc) =>
                                                                      loc.locationPurposeType ===
                                                                      "EVENT_VENUE"
                                                            )
                                                            .map((loc) => (
                                                                 <SelectItem
                                                                      key={loc.locationId}
                                                                      value={loc.locationId}
                                                                 >
                                                                      {loc.locationName}
                                                                 </SelectItem>
                                                            ))}
                                                  </SelectGroup>
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>

                              <div className="space-y-4 flex flex-col">
                                   <Label>Eligible Attendees</Label>
                                   {/* <Input
                                                                   placeholder="Search clusters, courses, and sections..."
                                                                   value={searchQuery}
                                                                   onChange={(e) => setSearchQuery(e.target.value)}
                                                                   className="mt-2"
                                                                 /> */}
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
                                        <Tabs defaultValue="clusters">
                                             <TabsList className="grid grid-cols-3 w-full">
                                                  <TabsTrigger value="clusters">
                                                       Clusters
                                                  </TabsTrigger>
                                                  <TabsTrigger value="courses">Courses</TabsTrigger>
                                                  <TabsTrigger value="sections">
                                                       Sections
                                                  </TabsTrigger>
                                             </TabsList>

                                             <TabsContent value="clusters" className="mt-4">
                                                  <ScrollArea className="h-30 pr-4">
                                                       {loadingHierarchy ? (
                                                            <p className="text-sm text-muted-foreground">
                                                                 Loading clusters...
                                                            </p>
                                                       ) : filterItems(clusters, {
                                                              key: "clusterName",
                                                         }).length > 0 ? (
                                                            <div className="space-y-2">
                                                                 {filterItems(clusters, {
                                                                      key: "clusterName",
                                                                 }).map((cluster) => (
                                                                      <div
                                                                           key={cluster.clusterId}
                                                                           className="flex items-center space-x-2"
                                                                      >
                                                                           <Checkbox
                                                                                id={`cluster-${cluster.clusterId}`}
                                                                                checked={eligibility.selectedClusters.includes(
                                                                                     cluster.clusterId
                                                                                )}
                                                                                onCheckedChange={(
                                                                                     checked
                                                                                ) =>
                                                                                     handleClusterSelect(
                                                                                          cluster.clusterId,
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
                                                       ) : (
                                                            <p className="text-sm text-muted-foreground">
                                                                 No clusters found.
                                                            </p>
                                                       )}
                                                  </ScrollArea>
                                             </TabsContent>

                                             <TabsContent value="courses" className="mt-4">
                                                  <ScrollArea className="h-30 pr-4">
                                                       {loadingHierarchy ? (
                                                            <p className="text-sm text-muted-foreground">
                                                                 Loading courses...
                                                            </p>
                                                       ) : filterItems(courses, {
                                                              key: "courseName",
                                                         }).length > 0 ? (
                                                            <div className="space-y-2">
                                                                 {filterItems(courses, {
                                                                      key: "courseName",
                                                                 }).map((course) => (
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
                                                                                {course.courseName}
                                                                           </Label>
                                                                      </div>
                                                                 ))}
                                                            </div>
                                                       ) : (
                                                            <p className="text-sm text-muted-foreground">
                                                                 No courses found.
                                                            </p>
                                                       )}
                                                  </ScrollArea>
                                             </TabsContent>

                                             <TabsContent value="sections" className="mt-4">
                                                  <ScrollArea className="h-30 pr-4">
                                                       {loadingHierarchy ? (
                                                            <p className="text-sm text-muted-foreground">
                                                                 Loading sections...
                                                            </p>
                                                       ) : filterItems(sections, {
                                                              key: "sectionName",
                                                         }).length > 0 ? (
                                                            <div className="space-y-2">
                                                                 {filterItems(sections, {
                                                                      key: "sectionName",
                                                                 }).map((section) => (
                                                                      <div
                                                                           key={section.id}
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
                                                                 ))}
                                                            </div>
                                                       ) : (
                                                            <p className="text-sm text-muted-foreground">
                                                                 No sections found.
                                                            </p>
                                                       )}
                                                  </ScrollArea>
                                             </TabsContent>
                                        </Tabs>
                                   )}
                              </div>
                              <Card className="relative w-full p-4">
                                   <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="icon"
                                                  className="absolute right-4 top-4"
                                             >
                                                  <HelpCircle className="h-3 w-3" />
                                             </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="center" sideOffset={8}>
                                             <p className="text-sm">
                                                  <strong>What are these checkboxes for?</strong>
                                                  <br />
                                                  <br />
                                                  <strong>Facial Verification:</strong>
                                                  <ul className="list-disc list-inside mt-1 text-xs">
                                                       <li>
                                                            This require the student to authenticate
                                                            their identity through facial
                                                            recognition.
                                                       </li>
                                                       <li>
                                                            They will be marked as
                                                            &apos;Absent&apos; to the event until
                                                            their facial is confirmed.
                                                       </li>
                                                       <br />
                                                  </ul>
                                                  <strong>Attendance Monitoring:</strong>
                                                  <ul className="list-disc list-inside mt-1 text-xs">
                                                       <li>
                                                            This monitors the student&apos;s
                                                            location while the event is
                                                            &apos;Ongoing&apos; when they leave the{" "}
                                                            <br /> venue it may affect their
                                                            attendance.
                                                       </li>
                                                       <li>
                                                            <strong>Note:</strong> This require the
                                                            students an internet connection
                                                            throughout the whole event. <br />
                                                            If internet connection failed, students
                                                            will marked as &apos;Absent&apos;
                                                       </li>
                                                       <br />
                                                  </ul>
                                                  <strong>Location Validation:</strong>
                                                  <ul className="list-disc list-inside mt-1 text-xs">
                                                       <li>
                                                            This requires the student to register on
                                                            both venues.
                                                       </li>
                                                       <li>
                                                            They will only marked as
                                                            &apos;Present&apos; when they
                                                            succesfully registered on both venues.
                                                       </li>
                                                  </ul>
                                             </p>
                                        </TooltipContent>
                                   </Tooltip>
                                   <Label className="text-base">Other Settings</Label>
                                   <div className="space-y-2 pl-2 pb-2">
                                        <Label>Facial Verification</Label>
                                        <div className="flex items-center space-x-2">
                                             <Checkbox
                                                  id="facialVerificationEnabled"
                                                  checked={formData.facialVerificationEnabled}
                                                  onCheckedChange={(checked) =>
                                                       handleInputChange(
                                                            "facialVerificationEnabled",
                                                            !!checked
                                                       )
                                                  }
                                             />
                                             <Label
                                                  htmlFor="facialVerificationEnabled"
                                                  className="text-sm font-medium"
                                             >
                                                  Require Facial Verification for Registration
                                             </Label>
                                        </div>
                                   </div>
                                   <div className="space-y-2 pl-2 pb-2">
                                        <Label>Attendance Monitoring</Label>
                                        <div className="flex items-center space-x-2">
                                             <Checkbox
                                                  id="attendanceLocationMonitoringEnabled"
                                                  checked={
                                                       formData.attendanceLocationMonitoringEnabled
                                                  }
                                                  onCheckedChange={(checked) =>
                                                       handleInputChange(
                                                            "attendanceLocationMonitoringEnabled",
                                                            !!checked
                                                       )
                                                  }
                                             />
                                             <Label
                                                  htmlFor="attendanceLocationMonitoringEnabled"
                                                  className="text-sm font-medium"
                                             >
                                                  Require Location Monitoring while Event is Ongoing
                                             </Label>
                                        </div>
                                   </div>
                                   <div className="space-y-2 pl-2 pb-2">
                                        <Label>Location Validation</Label>
                                        <div className="flex items-center space-x-2">
                                             <Checkbox
                                                  id="strictLocationValidation"
                                                  checked={formData.strictLocationValidation}
                                                  onCheckedChange={(checked) =>
                                                       handleInputChange(
                                                            "strictLocationValidation",
                                                            !!checked
                                                       )
                                                  }
                                             />
                                             <Label
                                                  htmlFor="strictLocationValidation"
                                                  className="text-sm font-medium"
                                             >
                                                  Require Location Validation for Both Locations
                                             </Label>
                                        </div>
                                   </div>
                              </Card>
                              <DialogFooter className="flex justify-end space-x-2 pt-4">
                                   <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Close
                                   </Button>
                                   <Button
                                        type="button"
                                        variant="outline"
                                        disabled={
                                             isSubmitting ||
                                             event.eventStatus === EventStatus.CANCELLED
                                        }
                                        className="hover: bg-red-100 border-red-400"
                                        onClick={handleCancelEvent}
                                   >
                                        Cancel this Event
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
