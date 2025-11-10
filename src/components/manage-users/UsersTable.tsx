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
import { UserStudentResponse } from "@/interface/user-interface"

interface UsersTableProps {
  users: UserStudentResponse[]
  loading: boolean
}

export default function UsersTable({ users, loading }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="h-16">
          <TableHead>Full Name</TableHead>
          <TableHead>User Type</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Student No.</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Contact Number</TableHead>
          <TableHead>Account Status</TableHead>
          <TableHead>View / Update</TableHead>
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
                <Button variant="outline" className="rounded-sm">
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
