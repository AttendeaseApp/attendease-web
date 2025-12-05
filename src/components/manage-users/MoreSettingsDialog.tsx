"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MoreSettingsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
     setOpenDeleteModal: (open: boolean) => void
}

export default function MoreSettingsDialog({
     open,
     onOpenChange,
     setOpenDeleteModal,
}: MoreSettingsDialogProps) {
     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="max-w-fit">
                    <DialogHeader>
                         <DialogTitle>More settings</DialogTitle>
                         <p className="text-sm text-gray-500">
                              Account deactivation, deletion, and facial data removal.
                         </p>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-4 w-full">
                         <Button
                              variant="outline"
                              className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 w-full h-16"
                              onClick={() => setOpenDeleteModal(true)}
                         >
                              <span className="text-sm font-semibold leading-none">
                                   Delete account by section
                              </span>
                              <span className="text-xs text-black leading-tight">
                                   This action will allow you to delete accounts from a specific
                                   section.
                              </span>
                         </Button>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 w-full max-w-fit">
                         <Button
                              variant="outline"
                              className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 py-9"
                         >
                              <span className="text-sm font-semibold leading-none">
                                   Delete all student account
                              </span>
                              <span className="text-xs text-black leading-tight">
                                   This action cannot be undone. This will permanently delete all
                                   facial data from our database. Students will be required to
                                   register their facial data again.
                              </span>
                         </Button>
                    </div>
               </DialogContent>
          </Dialog>
     )
}
