"use client"

import { useState } from "react"
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
} from "@/components/ui/alert-dialog"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Plus, Pencil, Trash } from "lucide-react"
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import {
     LocationPurposeLabel,
     LocationPurposeType,
} from "@/interface/enums/location/location-purpose-type-enum"

interface LocationsTableProps {
     locations: EventLocation[]
     loading: boolean
     onDelete: (location: EventLocation) => void
     onEdit: (location: EventLocation) => void
}

export function LocationsTable({ locations, loading, onDelete, onEdit }: LocationsTableProps) {
     const [deleteTarget, setDeleteTarget] = useState<EventLocation | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

     const confirmDelete = () => {
          if (deleteTarget) {
               onDelete(deleteTarget)
          }
     }

     return (
          <>
               <Table className="w-full">
                    <TableHeader>
                         <TableRow>
                              <TableHead className="font-semibold text-gray-900">
                                   Locations
                              </TableHead>
                         </TableRow>
                    </TableHeader>

                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell className="py-8 text-center">
                                        Loading locations...
                                   </TableCell>
                              </TableRow>
                         ) : locations.length === 0 ? (
                              <TableRow>
                                   <TableCell className="py-8">
                                        <Empty className="border-0">
                                             <EmptyHeader>
                                                  <EmptyMedia className="bg-transparent">
                                                       <Plus className="h-8 w-8 text-muted-foreground" />
                                                  </EmptyMedia>
                                                  <EmptyTitle>No locations yet</EmptyTitle>
                                                  <EmptyDescription>
                                                       You haven’t created any locations yet. Add
                                                       one to define physical venues for events.
                                                  </EmptyDescription>
                                             </EmptyHeader>
                                        </Empty>
                                   </TableCell>
                              </TableRow>
                         ) : (
                              locations.map((location) => (
                                   <TableRow key={location.locationId} className="align-top">
                                        <TableCell className="py-4">
                                             <div>
                                                  {/* Header */}
                                                  <div className="flex items-start justify-between gap-4">
                                                       <div className="font-semibold text-gray-900 text-lg">
                                                            {location.locationName}
                                                       </div>

                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                 <Button variant="ghost" size="sm">
                                                                      Options
                                                                 </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                 <DropdownMenuItem
                                                                      onClick={() =>
                                                                           onEdit(location)
                                                                      }
                                                                 >
                                                                      <Pencil className="mr-2 h-4 w-4" />
                                                                      Edit
                                                                 </DropdownMenuItem>
                                                                 <DropdownMenuItem
                                                                      className="text-red-600"
                                                                      onClick={() => {
                                                                           setDeleteTarget(location)
                                                                           setDeleteDialogOpen(true)
                                                                      }}
                                                                 >
                                                                      <Trash className="mr-2 h-4 w-4" />
                                                                      Delete
                                                                 </DropdownMenuItem>
                                                                 <DropdownMenuSeparator />
                                                            </DropdownMenuContent>
                                                       </DropdownMenu>
                                                  </div>

                                                  {/* Details */}
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                                                       <div>
                                                            <span className="font-medium">
                                                                 Purpose:
                                                            </span>{" "}
                                                            {
                                                                 LocationPurposeLabel[
                                                                      location.locationPurposeType as LocationPurposeType
                                                                 ]
                                                            }
                                                       </div>
                                                       <div>
                                                            <span className="font-medium">
                                                                 Environment:
                                                            </span>{" "}
                                                            {location.locationEnvironment}
                                                       </div>
                                                       <div>
                                                            <span className="font-medium">
                                                                 Created:
                                                            </span>{" "}
                                                            {new Date(
                                                                 location.createdAt
                                                            ).toLocaleString()}
                                                       </div>
                                                       <div>
                                                            <span className="font-medium">
                                                                 Description:
                                                            </span>{" "}
                                                            {location.description}
                                                       </div>
                                                  </div>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>

               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete{" "}
                                   <strong>{deleteTarget?.locationName}</strong>? This action cannot
                                   be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
