"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MoreSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MoreSettingsDialog({ open, onOpenChange }: MoreSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>More settings</DialogTitle>
          <p className="text-sm text-gray-500">
            Account deactivation, deletion, and facial data removal.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4 w-full max-w-fit">
          <Button
            variant="outline"
            className="flex flex-col max-w items-start justify-center gap-1 rounded-md bg-white text-red-500 py-9"
          >
            <span className="text-sm font-semibold leading-none">
              Permanently DELETE all accounts (OSA and STUDENT)
            </span>
            <span className="text-xs text-black leading-tight">
              This action cannot be undone. This will permanently delete all accounts and remove all
              data from our database.
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 py-9"
          >
            <span className="text-sm font-semibold leading-none">
              Permanently DELETE all facial data (ALL STUDENT)
            </span>
            <span className="text-xs text-black leading-tight">
              This action cannot be undone. This will permanently delete all facial data from our
              database. Students will be required to register their facial data again.
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-black py-9"
          >
            <span className="text-sm font-semibold leading-none">
              Deactivate all accounts (OSA and STUDENT)
            </span>
            <span className="text-xs text-black leading-tight">
              Sets all accounts to INACTIVE. All accounts are still saved but inactive.
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
