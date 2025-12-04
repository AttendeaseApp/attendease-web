"use client"

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
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import React, { useState } from "react"

export function AcademicClusterTable({
     clusters,
     loading,
     onEditAction,
     onDeleteAction,
}: {
     clusters: Cluster[]
     loading: boolean
     onEditAction: (cluster: Cluster) => void
     onDeleteAction: (cluster: Cluster) => Promise<void>
}) {
     const [deleteTarget, setDeleteTarget] = useState<Cluster | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const handleEdit = (cluster: Cluster, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEditAction(cluster)
     }
     const openDeleteDialog = (cluster: Cluster, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDeleteTarget(cluster)
          setDeleteDialogOpen(true)
     }
     const confirmDelete = async () => {
          if (deleteTarget) {
               onDeleteAction(deleteTarget)
          }
     }
     return (
          <>
               <Table className="w-full">
                    <TableHeader>
                         <TableRow>
                              <TableHead>CLUSTER</TableHead>
                              <TableHead className="text-right"></TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        Loading clusters...
                                   </TableCell>
                              </TableRow>
                         ) : clusters.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={2} className="text-center py-8">
                                        No clusters found
                                   </TableCell>
                              </TableRow>
                         ) : (
                              clusters.map((cluster) => (
                                   <TableRow key={cluster.clusterId}>
                                        <TableCell>{cluster.clusterName || " –"}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                 Open menu
                                                            </span>
                                                       </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                       <DropdownMenuItem
                                                            onClick={(e) => handleEdit(cluster, e)}
                                                       >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                       </DropdownMenuItem>
                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(cluster, e)
                                                            }
                                                       >
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
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete the cluster{" "}
                                   <strong>{deleteTarget?.clusterName}</strong>? This action cannot
                                   be undone and will also delete associated courses.
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
