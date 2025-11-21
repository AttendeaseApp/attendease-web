"use client"
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
import { MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { ClusterSession } from "@/interface/cluster-and-course-interface"
export function ClusterTable({
     clusters,
     loading,
     onDeleteAction,
}: {
     clusters: ClusterSession[]
     loading: boolean
     onDeleteAction: (cluster: ClusterSession) => void
}) {
     const handleDelete = (cluster: ClusterSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (
               confirm(
                    `Are you sure you want to delete the cluster "${cluster.clusterName}"? This action cannot be undone and will also delete associated courses.`
               )
          ) {
               onDeleteAction(cluster)
          }
     }
     return (
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
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={(e) => handleDelete(cluster, e)}
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
