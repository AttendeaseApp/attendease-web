import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Ellipsis } from "lucide-react"

const eventslist = [
  {
    selectID: "INV001",
    eventname: "Celestial Night",
    attendees: "ALL",
    date: "January 8, 2025",
    time: "8:00 PM - 9:00PM",
    place: "St. John Paul"
  },
  {
    selectID: "INV002",
    eventname: "Palarong Pinoy",
    attendees: "ALL",
    date: "January 9, 2025",
    time: "8:00 PM - 9:00PM",
    place: "St. John Paul"
  }

]

export function EventsTable() {
  return (
    <Table>
      <TableCaption>List of Events.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Select</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Attendees</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Place</TableHead>
          <TableHead className="padding-10"> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventslist.map((event) => (
          <TableRow key={event.selectID}>
            <TableCell className="font-medium">{event.selectID}</TableCell>
            <TableCell>{event.eventname}</TableCell>
            <TableCell>{event.attendees}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.time}</TableCell>
            <TableCell>{event.place}</TableCell>
            <TableCell><button className='hover:bg-gray-200'><Ellipsis /></button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}