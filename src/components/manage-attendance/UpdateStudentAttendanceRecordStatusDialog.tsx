"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface UpdateStudentAttendanceRecordStatusDialog {
     open: boolean
     status: "success" | "error"
     message: string
     onClose: () => void
}

export default function UpdateStudentAttendanceRecordStatusDialog({
     open,
     status,
     message,
     onClose,
}: UpdateStudentAttendanceRecordStatusDialog) {
     const isSuccess = status === "success"
     const title = isSuccess ? "Update Saved" : "Update Failed"
     const titleColor = isSuccess ? "text-green-600" : "text-red-600"

     return (
          <Dialog
               open={open}
               onOpenChange={(isOpen) => {
                    if (!isOpen) onClose()
               }}
          >
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle className={titleColor}>{title}</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">{message}</p>

                    <div className="flex justify-end mt-6">
                         <Button onClick={onClose}>OK</Button>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
