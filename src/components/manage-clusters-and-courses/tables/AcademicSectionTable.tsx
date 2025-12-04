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
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Section } from "@/interface/academic/section/SectionInterface"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useState } from "react"

interface SectionProps {
     sections: Section[]
     loading: boolean
     onEdit: (section: Section) => void
     onDelete: (section: Section) => void
}

export function AcademicSectionTable({ sections, loading, onEdit, onDelete }: SectionProps) {
     const [deleteTarget, setDeleteTarget] = useState<Section | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

     const handleEdit = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(section)
     }

     const openDeleteDialog = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDeleteTarget(section)
          setDeleteDialogOpen(true)
     }

     const confirmDelete = () => {
          if (deleteTarget) {
               onDelete(deleteTarget)
          }
          setDeleteTarget(null)
          setDeleteDialogOpen(false)
     }

     return (
          <>
               <Table className="w-full">
                    <TableHeader>
                         <TableRow>
                              <TableHead>SECTION</TableHead>
                              <TableHead>REFERENCED COURSE</TableHead>
                              <TableHead className="text-right"></TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        Loading sections and courses...
                                   </TableCell>
                              </TableRow>
                         ) : sections.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        No sections and courses found
                                   </TableCell>
                              </TableRow>
                         ) : (
                              sections.map((section) => (
                                   <TableRow key={`${section.id || "no-course"}`}>
                                        <TableCell>{section.sectionName || " –"}</TableCell>
                                        <TableCell>{section.course?.courseName || " –"}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                 Open menu
                                                            </span>
                                                       </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                       <DropdownMenuItem
                                                            onClick={(e) => handleEdit(section, e)}
                                                       >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                       </DropdownMenuItem>
                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(section, e)
                                                            }
                                                       >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                       </DropdownMenuItem>
                                                       <DropdownMenuSeparator />
                                                  </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>

               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete the section{" "}
                                   <strong>{deleteTarget?.sectionName}</strong>? This action cannot
                                   be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
