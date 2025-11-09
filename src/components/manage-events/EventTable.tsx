"use client"

import { EventSession, EventStatus } from "@/interface/event-interface"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil } from "lucide-react"

interface EventTableProps {
  events: EventSession[]
  loading: boolean
  onEdit: (event: EventSession) => void
}

export function EventTable({ events, loading, onEdit }: EventTableProps) {
  const handleEdit = (event: EventSession, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit(event)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Registration Start</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading events...
            </TableCell>
          </TableRow>
        ) : events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No events found
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <TableRow key={event.eventId}>
              <TableCell className="font-medium">{event.eventName}</TableCell>
              <TableCell>
                {new Date(event.timeInRegistrationStartDateTime).toLocaleString()}
              </TableCell>
              <TableCell>{new Date(event.startDateTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(event.endDateTime).toLocaleString()}</TableCell>
              <TableCell>
                <span
                  className={cn("rounded-full px-2 py-1 text-xs", {
                    "bg-green-100 text-green-700": event.eventStatus === EventStatus.ONGOING,
                    "bg-yellow-100 text-yellow-700": event.eventStatus === EventStatus.REGISTRATION,
                    "bg-blue-100 text-blue-700": event.eventStatus === EventStatus.UPCOMING,
                    "bg-red-100 text-red-700": event.eventStatus === EventStatus.CANCELLED,
                    "bg-gray-100":
                      event.eventStatus === EventStatus.CONCLUDED ||
                      event.eventStatus === EventStatus.FINALIZED,
                  })}
                >
                  {event.eventStatus}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleEdit(event, e)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
