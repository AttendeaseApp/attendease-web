"use client"

import {
     ATTENDANCE_STATUS_VALUES,
     AttendanceStatusValue,
} from "@/interface/attendance/status/AttendanceStatus"
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
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import UpdateStudentAttendanceRecordStatusDialog from "./UpdateStudentAttendanceRecordStatusDialog"

interface UpdateAttendanceDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     attendee: AttendeesResponse | null
     onUpdate: (data: { status: AttendanceStatusValue; reason: string }) => Promise<void>
     submitting: boolean
}

export function UpdateStudentAttendanceRecordDialog({
     open,
     onOpenChange,
     attendee,
     onUpdate,
     submitting,
}: UpdateAttendanceDialogProps) {
     const getFullName = (a: AttendeesResponse) => `${a.firstName} ${a.lastName}`
     const [status, setStatus] = useState<AttendanceStatusValue>(
          attendee?.attendanceStatus || "IDLE"
     )

     const [reason, setReason] = useState(attendee?.reason || "")
     const [initialized, setInitialized] = useState(false)

     useEffect(() => {
          if (!initialized && attendee) {
               setStatus(attendee.attendanceStatus)
               setReason(attendee.reason || "")
               setInitialized(true)
          }
     }, [attendee, initialized])
     // useEffect(() => {
     //      if (attendee) {
     //           setStatus(attendee.attendanceStatus)
     //           setReason(attendee.reason || "")
     //      }
     // }, [attendee])

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [editStatus, setEditStatus] = useState<"success" | "error">("success")
     const [editMessage, setEditMessage] = useState("")

     const showStatus = (status: "success" | "error", message: string) => {
          setEditStatus(status)
          setEditMessage(message)
          setStatusDialogOpen(true)
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!attendee) return
          try {
               await onUpdate({ status, reason })
               showStatus("success", "Successfully updated" + (attendee ? getFullName(attendee) : "attendance record"))
          } catch (err) {
               console.error("Update error:", err)
               showStatus("error", "Failed to update student's record.")
          }
     }

     return (
          <>
               <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-md">
                         <DialogHeader>
                              <DialogTitle>Edit Attendance</DialogTitle>
                              <DialogDescription>
                                   Edit status for {attendee ? getFullName(attendee) : "Student"}.
                              </DialogDescription>
                         </DialogHeader>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                   <Label htmlFor="status">Status</Label>
                                   <Select
                                        value={status}
                                        onValueChange={(v) => setStatus(v as AttendanceStatusValue)}
                                   >
                                        <SelectTrigger id="status">
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {ATTENDANCE_STATUS_VALUES.map((value) => (
                                                  <SelectItem key={value} value={value}>
                                                       {value}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div>
                                   <Label htmlFor="reason">Reason (Optional)</Label>
                                   <Input
                                        id="reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="e.g., Late due to traffic"
                                   />
                              </div>
                              <DialogFooter>
                                   <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                   >
                                        Cancel
                                   </Button>
                                   <Button type="submit" disabled={submitting}>
                                        {submitting ? "Saving..." : "Save Changes"}
                                   </Button>
                              </DialogFooter>
                         </form>
                    </DialogContent>
               </Dialog>
               
               <UpdateStudentAttendanceRecordStatusDialog
                    open={statusDialogOpen}
                    status={editStatus}
                    message={editMessage}
                    onClose={() => {
                         setStatusDialogOpen(false)
                         // if (editStatus === "success") {
                         //      onOpenChange(false)
                         // }
                    }}
               />
          </>
     )
}
