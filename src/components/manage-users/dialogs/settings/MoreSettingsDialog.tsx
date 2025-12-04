"use client"

import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteAllStudentsAndBiometrics } from "@/services/api/user/management/user-management-services"
import * as React from "react"
import { toast } from "sonner"

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
     const [openDeleteAllModal, setOpenDeleteAllModal] = React.useState(false)
     const [loading, setLoading] = React.useState(false)

     const handleDeleteAll = async () => {
          try {
               setLoading(true)
               const result = await deleteAllStudentsAndBiometrics()
               toast.info(result)
               setOpenDeleteAllModal(false)
               onOpenChange(false)
          } catch (err) {
               const message =
                    err instanceof Error && err.message
                         ? err.message
                         : "Failed to delete all students"
               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
          <>
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
                                   <span className="text-sm font-semibold">
                                        Delete account by section
                                   </span>
                                   <span className="text-xs text-black">
                                        Delete accounts from a specific section.
                                   </span>
                              </Button>
                         </div>

                         <div className="flex flex-col gap-4 mt-4 w-full max-w-fit">
                              <Button
                                   variant="outline"
                                   className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 py-9"
                                   onClick={() => setOpenDeleteAllModal(true)}
                              >
                                   <span className="text-sm font-semibold leading-none">
                                        Delete all student accounts
                                   </span>
                                   <span className="text-xs text-black leading-tight">
                                        This action cannot be undone. All facial data will be
                                        permanently deleted.
                                   </span>
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               <AlertDialog open={openDeleteAllModal} onOpenChange={setOpenDeleteAllModal}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>
                                   Are you sure you want to delete ALL student accounts?
                              </AlertDialogTitle>
                              <p className="text-sm text-gray-500">
                                   This action is irreversible and will delete all biometrics and
                                   student accounts.
                              </p>
                         </AlertDialogHeader>

                         <AlertDialogFooter>
                              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                   disabled={loading}
                                   onClick={handleDeleteAll}
                                   className="bg-red-600 hover:bg-red-700"
                              >
                                   {loading ? "Deleting..." : "Yes, delete all"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
