"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronDown } from "lucide-react";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { RETRIEVE_ALL_USERS } from "@/constants/api";



type User = {
  userId: number;
  firstName: string;
  lastName: string;
  userType?: string;
  section?: string;
  course?: string;
  studentNumber?: string;
  email?: string;
  contactNumber?: string;
};

export default function RetrieveAllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch (RETRIEVE_ALL_USERS,
          {
            headers: {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2OGM5ODk2OThkNDVjOWQxM2E1ZTJjNGMiLCJlbWFpbCI6ImZpbC5zeW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiT1NBIiwiaWF0IjoxNzYxNDgwMzEyLCJleHAiOjE3NjE5MTIzMTJ9.8Ie-blTCndaHh6m0naldOpmckTRrjjC-HOn8yvHdV6E", // token
            }, //hardcoded pa
          }
        );

        const data = await response.json();
        console.log("Fetched users:", data);

        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Error fetching users:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* top buttons */}
      <div className="w-full max-w-6xl mx-auto mb-4 flex justify-end space-x-2">
        <Button className="rounded-sm">Manually Add Account</Button>
        <Button className="rounded-sm">Import Student Accounts</Button>
        <Button variant="outline" className="rounded-sm">
          More Settings <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* search and filter buttons */}
      <div className="w-full max-w-6xl mx-auto mb-4 flex items-center justify-between flex-wrap mt-8">
        <div className="flex items-center space-x-2">
          <Input
            className="w-64 border border-gray-200"
            placeholder="Search..."
          />
          <ToggleGroup type="single" className="flex space-x-2">
            <ToggleGroupItem value="all">ALL</ToggleGroupItem>
            <ToggleGroupItem value="osa">OSA</ToggleGroupItem>
            <ToggleGroupItem value="student">STUDENT</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" className="rounded-sm">
            GRADE LEVEL <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            SECTION <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            COURSE <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            ACCOUNT STATUS <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-md border bg-white shadow mt-7">
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
              <TableHead>View / Update</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </TableCell>
                  <TableCell>{user.userType || "N/A"}</TableCell>
                  <TableCell>{user.section || "N/A"}</TableCell>
                  <TableCell>{user.course || "N/A"}</TableCell>
                  <TableCell>{user.studentNumber || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>{user.contactNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="rounded-sm">
                      Update 
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  No data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* back and next buttons */}
      <div className="w-full max-w-6xl mx-auto flex justify-end items-center space-x-2 mt-8">
        <Button variant="outline" className="rounded-sm">
          Previous
        </Button>
        <Button variant="outline" className="rounded-sm">
          Next
        </Button>
      </div>
    </div>
  );
}
