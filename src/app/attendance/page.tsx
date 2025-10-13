'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

interface Student {
  fullName: string;
  cluster: string;
  course: string;
  gradeLevel: string;
  attendance: AttendanceStatus;
}

//mock data only
const data: Student[] = [
  { fullName: 'John Colsum Doe', cluster: 'CETE', course: 'BIT', gradeLevel: '101', attendance: 'Present' },
  { fullName: 'Cameron Williamson', cluster: 'CETE', course: 'BSIT', gradeLevel: '101', attendance: 'Late' },
  { fullName: 'Brooklyn Simmons', cluster: 'CBAM', course: 'BSA', gradeLevel: '201', attendance: 'Absent' },
  { fullName: 'Savannah Nguyen', cluster: 'CETE', course: 'BSECE', gradeLevel: '301', attendance: 'Present' },
  { fullName: 'Ralph Edwards', cluster: 'CBAM', course: 'BSA', gradeLevel: '301', attendance: 'Late' },
  { fullName: 'Theresa Webb', cluster: 'CBAM', course: 'BSA', gradeLevel: '401', attendance: 'Late' },
];

export default function AttendancePage() {
  const [search, setSearch] = useState('');

  const filtered = data.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-semibold text-foreground">Manage Events</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          More Settings <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="pl-10">
        <p className="text-xl font-semibold mb-4">
          Ongoing Event <span className="font-semibold text-foreground">Celestial Night</span>
        </p>

        <div className="flex justify-between items-center mb-3">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs font-medium">
              GRADE LEVEL <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-medium">
              SECTION <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-medium">
              COURSE <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-medium">
              ATTENDANCE STATUS <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium text-[13px] text-muted-foreground">
                  Full name
                </TableHead>
                <TableHead className="uppercase text-[13px] text-muted-foreground">
                  Cluster
                </TableHead>
                <TableHead className="uppercase text-[13px] text-muted-foreground">
                  Course
                </TableHead>
                <TableHead className="uppercase text-[13px] text-muted-foreground">
                  Grade Level
                </TableHead>
                <TableHead className="font-medium text-[13px] text-muted-foreground">
                  Attendance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student, i) => (
                <TableRow key={i}>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.cluster}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.gradeLevel}</TableCell>
                  <TableCell>
                    <Link
                      href="/attendance/logs"
                      className="text-sm hover:underline text-foreground inline-flex items-center gap-1"
                    >
                      {student.attendance} →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <p>0 of 5 row(s) selected.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
