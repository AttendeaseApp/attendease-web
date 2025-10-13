'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function StudentLogPage() {
  const data = [
    {
      fullName: 'John Colsum Doe',
      cluster: 'CETE',
      course: 'BIT',
      gradeLevel: '101',
      attendance: {
        status: 'Present',
        timeIn: '8:25',
        timeOut: '__:__',
      },
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Manage Events
        </h2>
        <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          More Settings <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="pl-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/attendance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xl font-medium text-muted-foreground">
            Ongoing Event{' '}
            <span className="text-foreground font-semibold">
              Celestial Night
            </span>
          </p>
        </div>

        <div className="flex justify-between items-center mb-3">
          <Input placeholder="Search" className="max-w-xs" />
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
                <TableHead>Full name</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Attendance Log</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.cluster}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.gradeLevel}</TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        • {student.attendance.status}
                      </p>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Time In: {student.attendance.timeIn}
                        <br />
                        Time Out: {student.attendance.timeOut}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            0 of 5 row(s) selected.
          </p>
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
