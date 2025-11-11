"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { AttendeesResponse, EventAttendeesResponse } from "@/interface/event-monitoring-interface"

interface AttendeesCardProps {
     attendeesData: EventAttendeesResponse
}

export const AttendeesCard: React.FC<AttendeesCardProps> = ({ attendeesData }) => {
     return (
          <Card className="mt-6">
               <CardHeader>
                    <CardTitle>Registered Attendees ({attendeesData.totalAttendees})</CardTitle>
               </CardHeader>
               <CardContent>
                    <div className="overflow-x-auto">
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Attendance Status</TableHead>
                                        <TableHead>Time In</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {attendeesData.attendees.map((a: AttendeesResponse) => (
                                        <TableRow
                                             key={a.attendanceRecordId}
                                             className="hover:bg-muted/50"
                                        >
                                             <TableCell>
                                                  {a.firstName} {a.lastName}
                                             </TableCell>
                                             <TableCell>{a.section}</TableCell>
                                             <TableCell>{a.course}</TableCell>
                                             <TableCell>{a.attendanceStatus}</TableCell>
                                             <TableCell>{a.timeIn}</TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </div>
               </CardContent>
          </Card>
     )
}
