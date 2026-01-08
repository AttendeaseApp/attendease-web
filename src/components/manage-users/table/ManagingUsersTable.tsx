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
import { UserTypeEnum } from "@/interface/users/type/UserType"
import { cn } from "@/lib/utils"

interface UsersTableProps {
     users: UserStudentResponse[]
     loading: boolean
     onUpdateUser: (user: UpdateUserDetailsInterface) => void
     onUpdateStudent: (user: UpdateUserDetailsInterface) => void
     currentPage: number
     totalPages: number
     onPageChange: (page: number) => void
     selectedUserIds: string[]
     onToggleUser: (userId: string) => void
}

export default function ManagingUsersTable({
     users,
     loading,
     onUpdateUser,
     onUpdateStudent,
     currentPage,
     totalPages,
     onPageChange,
     selectedUserIds,
     onToggleUser,
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
          if (user.userType === UserTypeEnum.STUDENT) {
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
                    <TableHeader>
                         <TableRow>
                              <TableHead className="w-10" />
                              <TableHead className="font-semibold text-gray-900">Name</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   User Type
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">Section</TableHead>
                              <TableHead className="font-semibold text-gray-900">Course</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Student Number
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">Email</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Contact Number
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Account Status
                              </TableHead>
                              <TableHead className="text-center font-semibold text-gray-900">
                                   Update Info
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
                                        <TableCell>
                                             {users.userType === UserTypeEnum.STUDENT && (
                                                  <input
                                                       type="checkbox"
                                                       checked={selectedUserIds.includes(
                                                            String(users.userId)
                                                       )}
                                                       onChange={() =>
                                                            onToggleUser(String(users.userId))
                                                       }
                                                  />
                                             )}
                                        </TableCell>
                                        <TableCell>{`${users.firstName || ""} ${users.lastName || ""}`}</TableCell>
                                        <TableCell>{users.userType || "N/A"}</TableCell>
                                        <TableCell>{users.section || "N/A"}</TableCell>
                                        <TableCell>{users.course || "N/A"}</TableCell>
                                        <TableCell>{users.studentNumber || "N/A"}</TableCell>
                                        <TableCell>{users.email || "N/A"}</TableCell>
                                        <TableCell>{users.contactNumber || "N/A"}</TableCell>
                                        <TableCell>{users.accountStatus || "N/A"}</TableCell>
                                        <TableCell align="center">
                                             <Button
                                                  variant="outline"
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
