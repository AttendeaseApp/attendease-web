"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Plus, Search } from "lucide-react"
import { LocationsTable } from "@/components/manage-locations/LocationsTable"
import { EventLocation } from "@/interface/location-interface"
import { deleteLocation, getAllLocations } from "@/services/locations-service"
import CreateLocationDialog from "@/components/manage-locations/CreateLocationDialog"
import UpdateLocationDialog from "@/components/manage-locations/UpdateLocationDialog"
import { toast } from "sonner"

/**
 * ManageLocationsPage component for managing event locations (CREATE, READ, UPDATE, DELETE).
 *
 * Displays a table of existing locations with search, refresh, create, edit, and delete functionality.
 * Uses conditional rendering to show either create or update modals based on state.
 */
export default function ManageLocationsPage() {
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [loading, setLoading] = useState(true)
     const [searchTerm, setSearchTerm] = useState("")
     const [openDialog, setOpenModal] = useState(false)
     const [editingLocation, setEditingLocation] = useState<EventLocation | null>(null)
     const [isEditMode, setIsEditMode] = useState(false)

     const loadLocations = async () => {
          try {
               setLoading(true)
               const data = await getAllLocations()
               setLocations(data)
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : "Failed to load locations"
               toast.error(errorMessage)
               console.error("Error loading locations:", err)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadLocations()
     }, [])
     const [selectedType] = useState("all")
     const filteredEvents = locations.filter((location) => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter((w) => w)

          if (selectedType !== "all" && location.locationType !== selectedType) {
               return false
          }

          const fields = [
               location.locationName,
               location.locationType,
               new Date(location.createdAt).toLocaleString(),
          ]

          return searchWords.every((sw) =>
               fields.some((f) => (f?.toString().toLowerCase() || "").includes(sw))
          )
     })

     const handleDelete = async (location: EventLocation) => {
          try {
               await deleteLocation(location.locationId)
               setLocations((prev) => prev.filter((e) => e.locationId !== location.locationId))
               toast.success("Location deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               const errorMessage =
                    error instanceof Error ? error.message : "Unknown error occurred"
               toast.warning(`Failed to delete location: ${errorMessage}`)
          }
     }

     const handleEdit = (location: EventLocation) => {
          setEditingLocation(location)
          setIsEditMode(true)
          setOpenModal(true)
     }

     const closeDialog = () => {
          setOpenModal(false)
          setEditingLocation(null)
          setIsEditMode(false)
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">Manage Venues</h1>
                              <p className="text-muted-foreground mt-1">
                                   Define physical locations available for future events.
                              </p>
                         </div>
                         <Button className="sm:w-auto" onClick={() => setOpenModal(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create New Location
                         </Button>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search locations..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <Button variant="outline" size="sm" onClick={loadLocations}>
                              Refresh
                         </Button>
                    </div>

                    <LocationsTable
                         locations={filteredEvents}
                         loading={loading}
                         onDelete={handleDelete}
                         onEdit={handleEdit}
                    />
                    {isEditMode && editingLocation ? (
                         <UpdateLocationDialog
                              open={openDialog}
                              onClose={closeDialog}
                              onSuccess={loadLocations}
                              location={editingLocation}
                         />
                    ) : (
                         <CreateLocationDialog
                              open={openDialog}
                              onClose={closeDialog}
                              onSuccess={loadLocations}
                              existingLocations={locations}
                         />
                    )}
               </div>
          </ProtectedLayout>
     )
}
