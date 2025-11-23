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
import { ChevronDownIcon, Plus, X } from "lucide-react"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { createEvent } from "@/services/event-sessions"
import { getAllLocations } from "@/services/locations-service"
import { EventLocation } from "@/interface/location-interface"
import CreateEventStatusDialog from "@/components/manage-events/CreateEventStatusDialog"

interface CreateEventDialogProps {
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
}

type DateFields = "timeInRegistrationStartDateTime" | "startDateTime" | "endDateTime"

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
     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [loadingLocations, setLoadingLocations] = useState(true)

        
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [createStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [createMessage, setCreateMessage] = useState("")

   
     const showStatus = (status: "success" | "error", message: string) => {
          setCreateStatus(status)
          setCreateMessage(message)
          setStatusDialogOpen(true)
     }


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
               setError("")
          }
     }, [isOpen])

     const handleInputChange = (field: keyof typeof formData, value: string | Date) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")

          setIsSubmitting(true)
          try {
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
               }
               console.log("Sending create payload:", newEventData)
               await createEvent(newEventData)
      
               showStatus("success","Succesfully created the event.")

              

               
          } catch (err) {
               console.error("Create failed:", err)
               setError(err instanceof Error ? err.message : "Failed to create event.")
               showStatus("error","Failed to create the event")
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
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                                   onChange={(e) => handleInputChange("eventName", e.target.value)}
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
                              <Button type="submit" disabled={isSubmitting}>
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
