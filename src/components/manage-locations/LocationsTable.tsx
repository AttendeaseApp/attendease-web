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
     onDelete: (location: EventLocation) => void
}

/**
 * LocationsTable component for displaying a table of locations.
 *
 * @param param0 as LocationsTableProps
 * @returns JSX.Element The LocationsTable component.
 */
export function LocationsTable({ locations, loading, onDelete }: LocationsTableProps) {
     const handleDelete = (location: EventLocation, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (
               confirm(
                    `Are you sure you want to delete the location "${location.locationName}"? This action cannot be undone.`
               )
          ) {
               onDelete(location)
          }
     }
     return (
          <Table>
               <TableHeader className="font-semibold text-gray-900">
                    <TableRow>
                         <TableHead>LOCATION NAME</TableHead>
                         <TableHead>TYPE</TableHead>
                         <TableHead>CREATED (DATE-TIME)</TableHead>
                         <TableHead></TableHead>
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
                                   <TableCell className="font-medium">
                                        {eventLocation.locationName}
                                   </TableCell>
                                   <TableCell>{eventLocation.locationType}</TableCell>
                                   <TableCell>
                                        {new Date(eventLocation.createdAt).toLocaleString()}
                                   </TableCell>

                                   <TableCell className="text-right">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={(e) => handleDelete(eventLocation, e)}
                                        >
                                             Delete
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
