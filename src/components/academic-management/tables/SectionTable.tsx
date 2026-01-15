"use client"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
     Pagination,
     PaginationContent,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
} from "@/components/ui/pagination"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Section } from "@/interface/academic/section/SectionInterface"
import { activateSection, deleteSection } from "@/services/api/academic/section-management-service"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, Pencil, Power, Trash } from "lucide-react"
import { toast } from "sonner"
import { useMemo, useState } from "react"

interface SectionProps {
     sections: Section[]
     loading: boolean
     onEdit: (section: Section) => void
     onDelete: (section: Section) => void
     onRefresh?: () => void
}

export function SectionTable({ sections, loading, onEdit, onRefresh }: SectionProps) {
     const [deleteTarget, setDeleteTarget] = useState<Section | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const [isDeleting, setIsDeleting] = useState(false)

     const [activationDialogOpen, setActivationDialogOpen] = useState(false)
     const [activationSection, setActivationSection] = useState<Section | null>(null)
     const [activationError, setActivationError] = useState<string | null>(null)
     const [isActivating, setIsActivating] = useState(false)
     const [hasAttemptedActivation, setHasAttemptedActivation] = useState(false)

     const courses = useMemo(() => {
          const map = new Map<string, string>()
          sections.forEach((s) => {
               if (s.course) map.set(s.course.id, s.course.courseName)
          })
          return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
     }, [sections])
     const totalPages = courses.length
     const [currentPage, setCurrentPage] = useState(1)
     const currentCourse = courses[currentPage - 1]
     const filteredSections = sections.filter((s) => s.course?.id === currentCourse?.id)

     const handleEdit = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(section)
     }

     const openDeleteDialog = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDeleteTarget(section)
          setIsDeleting(false)
          setDeleteDialogOpen(true)
     }

     const confirmDelete = async () => {
          if (!deleteTarget) return

          setIsDeleting(true)

          try {
               await deleteSection(deleteTarget.id)
               toast.success("SUCCESS", {
                    description: `Section "${deleteTarget.sectionName}" has been deleted successfully!`,
               })
               setTimeout(() => {
                    handleCloseDeleteDialog()
                    onRefresh?.()
               }, 1500)
          } catch (error: unknown) {
               if (error instanceof Error) {
                    const errorMsg = error.message || "Failed to delete section."
                    toast.error("ERROR", {
                         description: errorMsg,
                    })
               } else {
                    toast.error("ERROR", {
                         description: "An unknown error occurred.",
                    })
               }
          } finally {
               setIsDeleting(false)
          }
     }

     const handleCloseDeleteDialog = () => {
          setDeleteDialogOpen(false)
          setDeleteTarget(null)
          setIsDeleting(false)
     }

     const openActivationDialog = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setActivationSection(section)
          setActivationError(null)
          setIsActivating(false)
          setHasAttemptedActivation(false)
          setActivationDialogOpen(true)
     }

     const handleConfirmActivate = async () => {
          if (!activationSection) return

          setHasAttemptedActivation(true)
          setIsActivating(true)
          setActivationError(null)

          try {
               await activateSection(activationSection.id)
               setTimeout(() => {
                    handleCloseActivationDialog()
                    onRefresh?.()
               }, 1500)
          } catch (error: unknown) {
               if (error instanceof Error) {
                    setActivationError(error.message || "Failed to activate section.")
               } else {
                    setActivationError("An unknown error occurred.")
               }
          } finally {
               setIsActivating(false)
          }
     }

     const handleCloseActivationDialog = () => {
          setActivationDialogOpen(false)
          setActivationSection(null)
          setActivationError(null)
          setIsActivating(false)
          setHasAttemptedActivation(false)
     }

     const isConfirm = !hasAttemptedActivation
     const isLoading = isActivating
     const isError = !isLoading && !!activationError

     return (
          <>
               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>Section Name</TableHead>
                              <TableHead>Year Level</TableHead>
                              <TableHead>Semester</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={5} className="text-center py-8">
                                        Loading sections...
                                   </TableCell>
                              </TableRow>
                         ) : filteredSections.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={5} className="text-center py-8">
                                        No sections for this course.
                                   </TableCell>
                              </TableRow>
                         ) : (
                              filteredSections.map((section) => (
                                   <TableRow key={section.id}>
                                        <TableCell className="font-medium">
                                             {section.sectionName}
                                        </TableCell>
                                        <TableCell>{section.yearLevel}</TableCell>
                                        <TableCell>{section.semester}</TableCell>
                                        <TableCell>
                                             <Badge
                                                  variant={
                                                       section.isActive ? "default" : "secondary"
                                                  }
                                             >
                                                  {section.isActive ? "Active" : "Inactive"}
                                             </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                       </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                       {/* Edit */}
                                                       <DropdownMenuItem
                                                            onClick={(e) => handleEdit(section, e)}
                                                       >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                       </DropdownMenuItem>
                                                       <DropdownMenuSeparator />
                                                       {/* Delete */}
                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(section, e)
                                                            }
                                                       >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                       </DropdownMenuItem>
                                                       <DropdownMenuSeparator />
                                                       {/* Activate */}
                                                       {!section.isActive && (
                                                            <DropdownMenuItem
                                                                 onClick={(e) =>
                                                                      openActivationDialog(
                                                                           section,
                                                                           e
                                                                      )
                                                                 }
                                                            >
                                                                 <Power className="mr-2 h-4 w-4" />
                                                                 Activate
                                                            </DropdownMenuItem>
                                                       )}
                                                  </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>
               {/* Pagination */}
               {totalPages > 0 && (
                    <Pagination className="my-4">
                         <PaginationContent className="flex flex-wrap gap-2">
                              <PaginationItem>
                                   <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                             e.preventDefault()
                                             setCurrentPage((p) => Math.max(1, p - 1))
                                        }}
                                        aria-disabled={currentPage === 1}
                                   />
                              </PaginationItem>
                              {courses.map((course, index) => (
                                   <PaginationItem key={course.id}>
                                        <PaginationLink
                                             href="#"
                                             isActive={currentCourse?.id === course.id}
                                             onClick={(e) => {
                                                  e.preventDefault()
                                                  setCurrentPage(index + 1)
                                             }}
                                        >
                                             {course.name}
                                        </PaginationLink>
                                   </PaginationItem>
                              ))}
                              <PaginationItem>
                                   <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                             e.preventDefault()
                                             setCurrentPage((p) => Math.min(totalPages, p + 1))
                                        }}
                                        aria-disabled={currentPage === totalPages}
                                   />
                              </PaginationItem>
                         </PaginationContent>
                    </Pagination>
               )}
               {/* Delete confirmation dialog */}
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Delete section <strong>{deleteTarget?.sectionName}</strong>? This
                                   cannot be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Go Back</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                                   {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
               {/* Activation dialog */}
               <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>
                                   {isConfirm
                                        ? "Confirm Activation"
                                        : isLoading
                                          ? "Activating Section..."
                                          : isError
                                            ? "Activation Failed"
                                            : "Section Activated"}
                              </DialogTitle>
                              <DialogDescription>
                                   {isConfirm ? (
                                        <>
                                             Are you sure you want to activate section{" "}
                                             <strong>{activationSection?.sectionName}</strong>? This
                                             will deactivate other active sections in the same
                                             course and semester.
                                        </>
                                   ) : isLoading ? (
                                        "Please wait while we activate the section."
                                   ) : isError ? (
                                        <>{activationError}</>
                                   ) : (
                                        <>
                                             Section{" "}
                                             <strong>{activationSection?.sectionName}</strong> is
                                             now Active!
                                        </>
                                   )}
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter>
                              {isConfirm ? (
                                   <>
                                        <Button
                                             variant="outline"
                                             onClick={handleCloseActivationDialog}
                                        >
                                             Go Back
                                        </Button>
                                        <Button onClick={handleConfirmActivate}>Activate</Button>
                                   </>
                              ) : isLoading ? (
                                   <Button disabled>Activating...</Button>
                              ) : (
                                   <Button onClick={handleCloseActivationDialog}>
                                        {isError ? "Close" : "OK"}
                                   </Button>
                              )}
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </>
     )
}
