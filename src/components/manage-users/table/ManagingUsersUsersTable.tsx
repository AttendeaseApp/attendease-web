"use client"

import { Button } from "@/components/ui/button"
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

interface UsersTableProps {
     users: UserStudentResponse[]
     loading: boolean
     onUpdate: (user: UpdateUserDetailsInterface) => void
}

export default function ManagingUsersTable({ users, loading, onUpdate }: UsersTableProps) {
     return (
          <Table>
               <TableHeader className="bg-gray-100">
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">FULL NAME</TableHead>
                         <TableHead className="font-semibold text-gray-900">USER TYPE</TableHead>
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
                         <TableHead className="font-semibold text-gray-900">VIEW/ UPDATE</TableHead>
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
                         users.map((user) => (
                              <TableRow key={user.userId}>
                                   <TableCell>{`${user.firstName || ""} ${user.lastName || ""}`}</TableCell>
                                   <TableCell>{user.userType || "N/A"}</TableCell>
                                   <TableCell>{user.section || "N/A"}</TableCell>
                                   <TableCell>{user.course || "N/A"}</TableCell>
                                   <TableCell>{user.studentNumber || "N/A"}</TableCell>
                                   <TableCell>{user.email || "N/A"}</TableCell>
                                   <TableCell>{user.contactNumber || "N/A"}</TableCell>
                                   <TableCell>{user.accountStatus || "N/A"}</TableCell>
                                   <TableCell>
                                        <Button
                                             variant="outline"
                                             className="rounded-sm"
                                             onClick={() =>
                                                  onUpdate({
                                                       userId: String(user.userId),
                                                       firstName: user.firstName,
                                                       lastName: user.lastName,
                                                       contactNumber: user.contactNumber,
                                                       email: user.email,
                                                       studentNumber: user.studentNumber,
                                                       //     sectionId: user.sectionId?.toString()
                                                  })
                                             }
                                        >
                                             Update
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))
                    ) : (
                         <TableRow>
                              <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                                   No users found.
                              </TableCell>
                         </TableRow>
                    )}
               </TableBody>
          </Table>
     )
}
