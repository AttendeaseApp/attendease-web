"use client"

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
import { MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { EventLocation } from "@/interface/location-interface"

interface LocationsTableProps {
  locations: EventLocation[]
  loading: boolean
}

/**
 * LocationsTable component for displaying a table of locations.
 *
 * @param param0 as LocationsTableProps
 * @returns JSX.Element The LocationsTable component.
 */
export function LocationsTable({ locations, loading }: LocationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Location Name</TableHead>
          <TableHead>Location Type</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading locations...
            </TableCell>
          </TableRow>
        ) : locations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No locations found
            </TableCell>
          </TableRow>
        ) : (
          locations.map((eventLocation) => (
            <TableRow key={eventLocation.locationId}>
              <TableCell className="font-medium">{eventLocation.locationName}</TableCell>
              <TableCell>{eventLocation.locationType}</TableCell>
              <TableCell>{eventLocation.createdAt}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
