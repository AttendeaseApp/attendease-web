'use client';

import { useState, useEffect } from 'react';
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

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        'https://attendease-backend-latest.onrender.com/api/registration/students',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setError('Cannot fetch student data');
        return;
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) =>
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
          Ongoing Event{' '}
          <span className="font-semibold text-foreground">Celestial Night</span>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map((student, i) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {error || 'No records found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <p>{filtered.length} of {students.length} row(s) displayed.</p>
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
