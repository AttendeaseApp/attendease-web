"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CreateClustercCoursesStatusDialogProps {
     open: boolean
     status: "success" | "error"
     message: string
     onClose: () => void
}

export default function CreateClustercCoursesStatusDialog(props: CreateClustercCoursesStatusDialogProps) {
     const { open, status, message, onClose } = props

     const isSuccess = status === "success"
     const title = isSuccess ? "Create Successful" : "Create Failed"
     const titleColor = isSuccess ? "text-green-600" : "text-red-600"

     return (
          <Dialog open={open} onOpenChange={onClose}>
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