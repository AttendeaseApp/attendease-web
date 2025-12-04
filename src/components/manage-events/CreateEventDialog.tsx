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
     SelectGroup,
     SelectLabel,
} from "@/components/ui/select"
import {
     Command,
     CommandEmpty,
     CommandInput,
     CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { createEvent } from "@/services/event-sessions"
import { getAllLocations } from "@/services/locations-service"
import { EventLocation } from "@/interface/location-interface"
import {
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/cluster-and-course-sessions"
import CreateLocationDialog from "../manage-locations/CreateLocationDialog"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { toast } from "sonner"

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
     const [clusters, setClusters] = useState<Cluster[]>([])
     const [courses, setCourses] = useState<Course[]>([])
     const [sections, setSections] = useState<Section[]>([])
     const [loadingLocations, setLoadingLocations] = useState(true)
     const [loadingHierarchy, setLoadingHierarchy] = useState(true)
     const [open, setOpen] = useState(false)
     const [searchQuery, setSearchQuery] = useState("")

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

                    if (!search) return true // allow empty or space input

                    return value.includes(search)
               })
          }

          return items.filter(opts.predicate)
     }
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [createStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [createMessage, setCreateMessage] = useState("")
     const [createNewLocation, setCreateNewLocation] = useState(false)
     const [editingLocation, setEditingLocation] = useState<EventLocation | null>(null)
     const [isEditMode, setIsEditMode] = useState(false)

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

     const handleCreateVenue = (newLocation: EventLocation) => {
          setLocations((prev) => [...prev, newLocation])
          handleInputChange("eventLocationId", newLocation.locationId)
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

     const isFormComplete =
          formData.eventName.trim() !== "" &&
          formData.eventLocationId !== "" &&
          (eligibility.allStudents ||
               eligibility.selectedClusters.length > 0 ||
               eligibility.selectedCourses.length > 0 ||
               eligibility.selectedSections.length > 0)

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
               toast.success("Successfully created the event.")
               onClose()
               onCreate()
          } catch (err) {
               console.error("Create failed:", err)
               const message = err instanceof Error ? err.message : "Failed to create event."
               setError(message)
               toast.error(message)
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          setError("")
          onClose()
     }

     const closeDialog = () => {
          setCreateNewLocation(false)
          setEditingLocation(null)
          setIsEditMode(false)
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
                                             <SelectGroup>
                                                  <SelectLabel className="mb-3" />
                                                  {locations.map((loc) => (
                                                       <SelectItem
                                                            key={loc.locationId}
                                                            value={loc.locationId}
                                                       >
                                                            {loc.locationName}
                                                       </SelectItem>
                                                  ))}
                                             </SelectGroup>
                                             <SelectGroup>
                                                  <SelectLabel className="mb-3" />
                                                  <div
                                                       className="flex items-center gap-1 px-2 py-2 text-sm cursor-pointer hover:bg-accent rounded"
                                                       onClick={() => setCreateNewLocation(true)}
                                                  >
                                                       <Plus className="w-4 h-4"/> 
                                                       <span>Create New Venue </span>
                                                  </div>
                                             </SelectGroup>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <CreateLocationDialog
                                   open={createNewLocation}
                                   onClose={closeDialog}
                                   onSuccess={handleCreateVenue}
                                   existingLocations={locations}
                              />

                              <div className="space-y-4 flex flex-col">
                                   <Label>Eligible Attendees</Label>
                                   <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                             <Button
                                                  variant="outline"
                                                  className="w-[200px] justify-between"
                                             >
                                                  {eligibility.allStudents
                                                       ? "All Students"
                                                       : "Select Attendees"}
                                             </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0 w-[300px]">
                                             <Command>
                                                  <CommandInput
                                                       placeholder="Search..."
                                                       value={searchQuery}
                                                       onValueChange={(value) =>
                                                            setSearchQuery(value)
                                                       }
                                                  />

                                                  <CommandList className="max-h-64 overflow-y-auto space-y-4 p-2">
                                                       <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                 id="allStudents"
                                                                 checked={eligibility.allStudents}
                                                                 onCheckedChange={
                                                                      handleAllStudentsToggle
                                                                 }
                                                            />
                                                            <Label
                                                                 htmlFor="allStudents"
                                                                 className="text-sm font-medium"
                                                            >
                                                                 All Students
                                                            </Label>
                                                       </div>
                                                       {!eligibility.allStudents && (
                                                            <>
                                                                 <div className="space-y-2">
                                                                      {loadingHierarchy ? (
                                                                           <p className="text-sm text-muted-foreground">
                                                                                Loading clusters...
                                                                           </p>
                                                                      ) : (
                                                                           <>
                                                                                <Label className="text-sm font-medium">
                                                                                     Clusters
                                                                                </Label>
                                                                                {filterItems(
                                                                                     clusters,
                                                                                     {
                                                                                          key: "clusterName",
                                                                                     }
                                                                                ).map((cluster) => (
                                                                                     <div
                                                                                          key={
                                                                                               cluster.clusterId
                                                                                          }
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
                                                                                {filterItems(
                                                                                     clusters,
                                                                                     {
                                                                                          key: "clusterName",
                                                                                     }
                                                                                ).length === 0 && (
                                                                                     <CommandEmpty>
                                                                                          No
                                                                                          clusters
                                                                                          found.
                                                                                     </CommandEmpty>
                                                                                )}
                                                                           </>
                                                                      )}
                                                                 </div>

                                                                 <div className="space-y-2">
                                                                      {loadingHierarchy ? (
                                                                           <p className="text-sm text-muted-foreground">
                                                                                Loading Courses...
                                                                           </p>
                                                                      ) : (
                                                                           <>
                                                                                <Label className="text-sm font-medium">
                                                                                     Courses
                                                                                </Label>
                                                                                {filterItems(
                                                                                     courses,
                                                                                     {
                                                                                          key: "courseName",
                                                                                     }
                                                                                ).map((course) => (
                                                                                     <div
                                                                                          key={
                                                                                               course.id
                                                                                          }
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
                                                                                ))}
                                                                                {filterItems(
                                                                                     courses,
                                                                                     {
                                                                                          key: "courseName",
                                                                                     }
                                                                                ).length === 0 && (
                                                                                     <CommandEmpty>
                                                                                          No courses
                                                                                          found.
                                                                                     </CommandEmpty>
                                                                                )}
                                                                           </>
                                                                      )}
                                                                 </div>

                                                                 <div className="space-y-2">
                                                                      {loadingHierarchy ? (
                                                                           <p className="text-sm text-muted-foreground">
                                                                                Loading Courses...
                                                                           </p>
                                                                      ) : (
                                                                           <>
                                                                                <Label className="text-sm font-medium">
                                                                                     Sections
                                                                                </Label>
                                                                                {filterItems(
                                                                                     sections,
                                                                                     {
                                                                                          key: "sectionName",
                                                                                     }
                                                                                ).map((section) => (
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
                                                                                ))}
                                                                                {filterItems(
                                                                                     sections,
                                                                                     {
                                                                                          key: "sectionName",
                                                                                     }
                                                                                ).length === 0 && (
                                                                                     <CommandEmpty>
                                                                                          No section
                                                                                          found.
                                                                                     </CommandEmpty>
                                                                                )}
                                                                           </>
                                                                      )}
                                                                 </div>
                                                            </>
                                                       )}
                                                  </CommandList>
                                             </Command>
                                        </PopoverContent>
                                   </Popover>
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
                                             isSubmitting || loadingHierarchy || !isFormComplete
                                        }
                                   >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {isSubmitting ? "Creating..." : "Create Event"}
                                   </Button>
                              </DialogFooter>
                         </form>
                    </DialogContent>
               </Dialog>
          </>
     )
}
