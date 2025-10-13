"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, SlidersHorizontal, Check, ChevronDown } from "lucide-react";

// Mock data
const users = [
  { name: "Ralph Edward", cluster: "CBAM", program: "BSA", gradeLevel: "301", status: "Registered" },
  { name: "Cameron Williamson", cluster: "CETE", program: "BSIT", gradeLevel: "201", status: "Not Registered" },
  { name: "Savannah Nguyen", cluster: "CBAM", program: "BSBA", gradeLevel: "401", status: "Registered" },
  { name: "Theresa Webb", cluster: "CBAM", program: "THM", gradeLevel: "301", status: "Not Registered" },
  { name: "Erwin Edward", cluster: "CETE", program: "ECE", gradeLevel: "401", status: "Registered" },
  { name: "Dustie Edward", cluster: "CETE", program: "BIT", gradeLevel: "201", status: "Registered" },
  { name: "Courtney Henry", cluster: "CBAM", program: "BSA", gradeLevel: "401", status: "Not Registered" },
  { name: "Guy Hawkins", cluster: "CETE", program: "YEC", gradeLevel: "301", status: "Registered" },
  { name: "Jacob Jones", cluster: "CBAM", program: "BSBA", gradeLevel: "201", status: "Registered" },
  { name: "Kristin Watson", cluster: "CBAM", program: "THM", gradeLevel: "401", status: "Not Registered" },
  { name: "Leslie Alexander", cluster: "CETE", program: "ECE", gradeLevel: "301", status: "Registered" },
  { name: "Devon Lane", cluster: "CETE", program: "BIT", gradeLevel: "201", status: "Not Registered" },
  { name: "Wade Warren", cluster: "CBAM", program: "BSA", gradeLevel: "401", status: "Registered" },
  { name: "Eleanor Pena", cluster: "CETE", program: "BSIT", gradeLevel: "301", status: "Registered" },
  { name: "Darlene Robertson", cluster: "CBAM", program: "THM", gradeLevel: "201", status: "Not Registered" },
  { name: "Jerome Bell", cluster: "CETE", program: "ECE", gradeLevel: "401", status: "Registered" },
  { name: "Bessie Cooper", cluster: "CBAM", program: "BSBA", gradeLevel: "301", status: "Registered" },
  { name: "Ronald Richards", cluster: "CETE", program: "YEC", gradeLevel: "401", status: "Not Registered" },
  { name: "Darrell Steward", cluster: "CETE", program: "BIT", gradeLevel: "201", status: "Registered" },
  { name: "Kathryn Murphy", cluster: "CBAM", program: "BSA", gradeLevel: "301", status: "Registered" },
];

export default function ManageUsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      const allNames = users.map(user => user.name);
      setSelectedUsers(allNames);
    } else {
      setSelectedUsers([]);
    }
  }

  function toggleSelect(name: string) {
    if (selectedUsers.includes(name)) {
      setSelectedUsers(selectedUsers.filter(n => n !== name));
    } else {
      setSelectedUsers([...selectedUsers, name]);
    }
  }

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Users</h1>

        <div className="flex flex-col items-end">
          <div className="flex gap-3">
            <Button variant="destructive">Delete</Button>
            <Button variant="outline" className="flex items-center">
              More Settings
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Input placeholder="Filter tasks..." className="w-[200px]" />
        <Select>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="not-registered">Not registered</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Cluster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CBAM">CBAM</SelectItem>
            <SelectItem value="CETE">CETE</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Grade Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="301">301</SelectItem>
            <SelectItem value="401">401</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedUsers.length === users.length}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span className="font-medium">Select All</span>
                </div>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Cluster</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => {
              const isSelected = selectedUsers.includes(user.name);
              const isRegistered = user.status === "Registered";

              return (
                <TableRow key={user.name}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(user.name)}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.cluster}</TableCell>
                  <TableCell>{user.program}</TableCell>
                  <TableCell>{user.gradeLevel}</TableCell>
                  <TableCell>
                    {isRegistered ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-gray-600" />
                        </div>
                        <span>Registered</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 border border-gray-400 rounded-full" />
                        <span>Not registered</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t bg-white px-4 py-3 text-sm text-muted-foreground rounded-b-lg">
          <p>{selectedUsers.length} of {users.length} row(s) selected.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-[70px] text-center">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span>Page 1 of 10</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">«</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">‹</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">›</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">»</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
