"use client"

import { Button } from "@/components/ui/button"
import {
     Pagination,
     PaginationContent,
     PaginationEllipsis,
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
import { UserStudentResponse } from "@/interface/UserStudent"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { cn } from "@/lib/utils"

interface UsersTableProps {
     users: UserStudentResponse[]
     loading: boolean
     onUpdateUser: (user: UpdateUserDetailsInterface) => void
     onUpdateStudent: (user: UpdateUserDetailsInterface) => void
     currentPage: number
     totalPages: number
     onPageChange: (page: number) => void
}

export default function ManagingUsersTable({
     users,
     loading,
     onUpdateUser,
     onUpdateStudent,
     currentPage,
     totalPages,
     onPageChange,
}: UsersTableProps) {
    
     const handleEdit = (user: UserStudentResponse) => {
          const commonData: UpdateUserDetailsInterface = {
               userId: String(user.userId),
               firstName: user.firstName,
               lastName: user.lastName,
               contactNumber: user.contactNumber,
               email: user.email,
               studentNumber: user.studentNumber,
               sectionId: user.sectionId?.toString(),
               section: user.section,
          }
          if (user.userType === "STUDENT") {
               onUpdateStudent(commonData)
          } else {
               onUpdateUser(commonData)
          }
     }

     const handlePageClick = (page: number) => {
          onPageChange(page)
     }

     const renderPageNumbers = () => {
          const pages = []
          const maxVisiblePages = 5
          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
          const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

          if (endPage - startPage < maxVisiblePages - 1) {
               startPage = Math.max(1, endPage - maxVisiblePages + 1)
          }

          if (startPage > 1) {
               pages.push(
                    <PaginationItem key={1}>
                         <PaginationLink
                              onClick={() => handlePageClick(1)}
                              isActive={currentPage === 1}
                         >
                              1
                         </PaginationLink>
                    </PaginationItem>
               )
               if (startPage > 2) {
                    pages.push(
                         <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                         </PaginationItem>
                    )
               }
          }

          for (let i = startPage; i <= endPage; i++) {
               pages.push(
                    <PaginationItem key={i}>
                         <PaginationLink
                              onClick={() => handlePageClick(i)}
                              isActive={currentPage === i}
                         >
                              {i}
                         </PaginationLink>
                    </PaginationItem>
               )
          }

          if (endPage < totalPages) {
               if (endPage < totalPages - 1) {
                    pages.push(
                         <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                         </PaginationItem>
                    )
               }
               pages.push(
                    <PaginationItem key={totalPages}>
                         <PaginationLink
                              onClick={() => handlePageClick(totalPages)}
                              isActive={currentPage === totalPages}
                         >
                              {totalPages}
                         </PaginationLink>
                    </PaginationItem>
               )
          }

          return pages
     }

     return (
          <div>
               <Table>
                    <TableHeader className="bg-gray-100">
                         <TableRow>
                              <TableHead className="font-semibold text-gray-900">
                                   FULL NAME
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   USER TYPE
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">SECTION</TableHead>
                              <TableHead className="font-semibold text-gray-900">COURSE</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   STUDENT NUMBER
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">EMAIL</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   CONTACT NUMBER
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   ACCOUNT STATUS
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   VIEW/ UPDATE
                              </TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={9} className="text-center text-gray-500">
                                        Loading...
                                   </TableCell>
                              </TableRow>
                         ) : users.length > 0 ? (
                              users.map((users) => (
                                   <TableRow key={users.userId}>
                                        <TableCell>{`${users.firstName || ""} ${users.lastName || ""}`}</TableCell>
                                        <TableCell>{users.userType || "N/A"}</TableCell>
                                        <TableCell>{users.section || "N/A"}</TableCell>
                                        <TableCell>{users.course || "N/A"}</TableCell>
                                        <TableCell>{users.studentNumber || "N/A"}</TableCell>
                                        <TableCell>{users.email || "N/A"}</TableCell>
                                        <TableCell>{users.contactNumber || "N/A"}</TableCell>
                                        <TableCell>{users.accountStatus || "N/A"}</TableCell>
                                        <TableCell>
                                             <Button
                                                  variant="outline"
                                                  className="rounded-sm"
                                                  onClick={() => handleEdit(users)}
                                             >
                                                  Update
                                             </Button>
                                        </TableCell>
                                   </TableRow>
                              ))
                         ) : (
                              <TableRow>
                                   <TableCell
                                        colSpan={9}
                                        className="h-24 text-center text-gray-500"
                                   >
                                        No users found.
                                   </TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>

               {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                         <Pagination>
                              <PaginationContent>
                                   <PaginationItem>
                                        <PaginationPrevious
                                             onClick={() =>
                                                  currentPage > 1 &&
                                                  handlePageClick(currentPage - 1)
                                             }
                                             className={cn(
                                                  "cursor-pointer",
                                                  currentPage === 1 &&
                                                       "pointer-events-none opacity-50"
                                             )}
                                        />
                                   </PaginationItem>
                                   {renderPageNumbers()}
                                   <PaginationItem>
                                        <PaginationNext
                                             onClick={() =>
                                                  currentPage < totalPages &&
                                                  handlePageClick(currentPage + 1)
                                             }
                                             className={cn(
                                                  "cursor-pointer",
                                                  currentPage === totalPages &&
                                                       "pointer-events-none opacity-50"
                                             )}
                                        />
                                   </PaginationItem>
                              </PaginationContent>
                         </Pagination>
                    </div>
               )}
          </div>
     )
}
