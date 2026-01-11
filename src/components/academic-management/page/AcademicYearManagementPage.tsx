"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"
import {
     getAllAcademicYears,
     activateAcademicYear,
     deactivateAcademicYear,
     deleteAcademicYear,
     AcademicYear,
} from "@/services/api/academic/academic-year-management-service"
import { AcademicYearTable } from "../tables/AcademicYearTable"
import { CreateAcademicYearDialog } from "../dialogs/create/CreateAcademicYearDialog"
import { UpdateAcademicYearDialog } from "../dialogs/update/UpdateAcademicYearDialog"

export default function AcademicYearManagementPage() {
     const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
     const [loading, setLoading] = useState(true)
     const [actionLoading, setActionLoading] = useState(false)

     const [createDialogOpen, setCreateDialogOpen] = useState(false)
     const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const [activateDialogOpen, setActivateDialogOpen] = useState(false)
     const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)

     const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null)

     const fetchAcademicYears = async () => {
          try {
               setLoading(true)
               const data = await getAllAcademicYears()
               setAcademicYears(data)
          } catch (error) {
               console.error("Failed to fetch academic years:", error)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          fetchAcademicYears()
     }, [])

     const handleEdit = (academicYear: AcademicYear) => {
          setSelectedAcademicYear(academicYear)
          setUpdateDialogOpen(true)
     }

     const handleDeleteClick = (academicYear: AcademicYear) => {
          setSelectedAcademicYear(academicYear)
          setDeleteDialogOpen(true)
     }

     const handleDeleteConfirm = async () => {
          if (!selectedAcademicYear) return

          setActionLoading(true)
          try {
               await deleteAcademicYear(selectedAcademicYear.id)
               setDeleteDialogOpen(false)
               fetchAcademicYears()
          } catch (error) {
               console.error("Failed to delete academic year:", error)
          } finally {
               setActionLoading(false)
          }
     }

     const handleActivateClick = (academicYear: AcademicYear) => {
          setSelectedAcademicYear(academicYear)
          setActivateDialogOpen(true)
     }

     const handleActivateConfirm = async () => {
          if (!selectedAcademicYear) return

          setActionLoading(true)
          try {
               await activateAcademicYear(selectedAcademicYear.id)
               setActivateDialogOpen(false)
               fetchAcademicYears()
          } catch (error) {
               console.error("Failed to activate academic year:", error)
          } finally {
               setActionLoading(false)
          }
     }

     const handleDeactivateClick = (academicYear: AcademicYear) => {
          setSelectedAcademicYear(academicYear)
          setDeactivateDialogOpen(true)
     }

     const handleDeactivateConfirm = async () => {
          if (!selectedAcademicYear) return

          setActionLoading(true)
          try {
               await deactivateAcademicYear(selectedAcademicYear.id)
               setDeactivateDialogOpen(false)
               fetchAcademicYears()
          } catch (error) {
               console.error("Failed to deactivate academic year:", error)
          } finally {
               setActionLoading(false)
          }
     }

     return (
          <div className="container mx-auto py-8 space-y-6">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight">
                              Academic Year Management
                         </h1>
                         <p className="text-muted-foreground">
                              Manage academic years and semester schedules
                         </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                         <Plus className="mr-2 h-4 w-4" />
                         Create Academic Year
                    </Button>
               </div>

               {/* Table */}
               <AcademicYearTable
                    academicYears={academicYears}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onActivate={handleActivateClick}
                    onDeactivate={handleDeactivateClick}
               />

               {/* Create Dialog */}
               <CreateAcademicYearDialog
                    isOpen={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    onCreate={fetchAcademicYears}
               />

               {/* Update Dialog */}
               {selectedAcademicYear && (
                    <UpdateAcademicYearDialog
                         academicYear={selectedAcademicYear}
                         isOpen={updateDialogOpen}
                         onClose={() => setUpdateDialogOpen(false)}
                         onUpdate={fetchAcademicYears}
                    />
               )}

               {/* Delete Confirmation Dialog */}
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Delete Academic Year</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete{" "}
                                   <strong>{selectedAcademicYear?.academicYearName}</strong>? This
                                   action cannot be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={handleDeleteConfirm}
                                   disabled={actionLoading}
                                   className="bg-destructive hover:bg-destructive/90"
                              >
                                   {actionLoading ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>

               {/* Activate Confirmation Dialog */}
               <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Activate Academic Year</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to activate{" "}
                                   <strong>{selectedAcademicYear?.academicYearName}</strong>? This
                                   will deactivate any currently active academic year.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={handleActivateConfirm}
                                   disabled={actionLoading}
                              >
                                   {actionLoading ? "Activating..." : "Activate"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>

               {/* Deactivate Confirmation Dialog */}
               <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate Academic Year</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to deactivate{" "}
                                   <strong>{selectedAcademicYear?.academicYearName}</strong>? No
                                   academic year will be active after this action.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={handleDeactivateConfirm}
                                   disabled={actionLoading}
                              >
                                   {actionLoading ? "Deactivating..." : "Deactivate"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </div>
     )
}
