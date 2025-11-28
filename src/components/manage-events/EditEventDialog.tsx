"use client"

import { useState } from "react"
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
import { Save, X } from "lucide-react"
import { EventSession, EventStatus } from "@/interface/event/event-interface"
import { updateEvent } from "@/services/event-sessions"
import EditEventStatusDialog from "./EditEventStatusDialog"

interface EditEventDialogProps {
     event: EventSession
     onUpdate: () => void
     isOpen: boolean
     onClose: () => void
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
     })
     const [errors, setErrors] = useState<Record<string, string>>({})
     const [isSubmitting, setIsSubmitting] = useState(false)
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
          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
     }

     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!validateForm()) return

          setIsSubmitting(true)
          try {
               const updatedData = {
                    eventName: formData.eventName,
                    description: formData.description || undefined,
                    timeInRegistrationStartDateTime: format(
                         new Date(formData.timeInRegistrationStartDateTime),
                         "yyyy-MM-dd HH:mm:ss"
                    ),
                    startDateTime: format(new Date(formData.startDateTime), "yyyy-MM-dd HH:mm:ss"),
                    endDateTime: format(new Date(formData.endDateTime), "yyyy-MM-dd HH:mm:ss"),
                    eventStatus: formData.eventStatus,
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
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                         <DialogHeader>
                              <DialogTitle>Edit Event</DialogTitle>
                              <DialogDescription>Update the event details below.</DialogDescription>
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
                                             handleInputChange("eventStatus", value)
                                        }
                                   >
                                        <SelectTrigger id="status">
                                             <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value={EventStatus.CANCELLED}>
                                                  {EventStatus.CANCELLED}
                                             </SelectItem>
                                        </SelectContent>
                                   </Select>
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
                                   <Button type="submit" disabled={!handleInputChange}>
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
