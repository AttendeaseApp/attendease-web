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
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Section } from "@/interface/academic/section/SectionInterface"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"

import {
     Pagination,
     PaginationContent,
     PaginationItem,
     PaginationLink,
     PaginationPrevious,
     PaginationNext,
} from "@/components/ui/pagination"

import { useMemo, useState } from "react"

interface SectionProps {
     sections: Section[]
     loading: boolean
     onEdit: (section: Section) => void
     onDelete: (section: Section) => void
}

export function AcademicSectionTable({ sections, loading, onEdit, onDelete }: SectionProps) {
     const [deleteTarget, setDeleteTarget] = useState<Section | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
          setDeleteDialogOpen(true)
     }

     const confirmDelete = () => {
          if (deleteTarget) onDelete(deleteTarget)
          setDeleteTarget(null)
          setDeleteDialogOpen(false)
     }

     return (
          <>
               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>SECTIONS for: {currentCourse?.name || "—"}</TableHead>
                              <TableHead className="text-right"></TableHead>
                         </TableRow>
                    </TableHeader>

                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        Loading sections...
                                   </TableCell>
                              </TableRow>
                         ) : filteredSections.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        No sections for this course.
                                   </TableCell>
                              </TableRow>
                         ) : (
                              filteredSections.map((section) => (
                                   <TableRow key={section.id}>
                                        <TableCell>{section.sectionName}</TableCell>

                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                       </Button>
                                                  </DropdownMenuTrigger>

                                                  <DropdownMenuContent align="end">
                                                       <DropdownMenuItem
                                                            onClick={(e) => handleEdit(section, e)}
                                                       >
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                       </DropdownMenuItem>

                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(section, e)
                                                            }
                                                       >
                                                            <Trash className="mr-2 h-4 w-4" />{" "}
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
                                             className="px-3 py-1 min-w-15 max-w-max"
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
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
