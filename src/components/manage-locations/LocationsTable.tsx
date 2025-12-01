"use client"

import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EventLocation } from "@/interface/location-interface"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Plus } from "lucide-react"

interface LocationsTableProps {
     locations: EventLocation[]
     loading: boolean
     onDelete: (location: EventLocation) => void
     onEdit: (location: EventLocation) => void
}

/**
 * LocationsTable component for displaying a table of locations.
 *
 * @param param0 as LocationsTableProps
 * @returns JSX.Element The LocationsTable component.
 */
export function LocationsTable({ locations, loading, onDelete, onEdit }: LocationsTableProps) {
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
                              <TableCell colSpan={4} className="text-center py-8">
                                   Loading locations...
                              </TableCell>
                         </TableRow>
                    ) : locations.length === 0 ? (
                         <TableRow>
                              <TableCell colSpan={4} className="text-center py-8">
                                   <Empty className="border-0">
                                        <EmptyHeader>
                                             <EmptyMedia className="bg-transparent">
                                                  <Plus className="h-8 w-8 text-muted-foreground" />
                                             </EmptyMedia>
                                             <EmptyTitle>No locations yet</EmptyTitle>
                                             <EmptyDescription>
                                                  You haven&rsquo;t created any locations. Start by
                                                  adding a new one to define physical venues for
                                                  events.
                                             </EmptyDescription>
                                        </EmptyHeader>
                                   </Empty>
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
                                        <div className="flex justify-end space-x-2">
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => onEdit(eventLocation)}
                                             >
                                                  Edit
                                             </Button>
                                             <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            Delete
                                                       </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                       <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                 Confirm Deletion
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                 Are you sure you want to delete the
                                                                 location{" "}
                                                                 {eventLocation.locationName}? This
                                                                 action cannot be undone.
                                                            </AlertDialogDescription>
                                                       </AlertDialogHeader>
                                                       <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                 Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                 onClick={() =>
                                                                      onDelete(eventLocation)
                                                                 }
                                                            >
                                                                 Delete
                                                            </AlertDialogAction>
                                                       </AlertDialogFooter>
                                                  </AlertDialogContent>
                                             </AlertDialog>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
