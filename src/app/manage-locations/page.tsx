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

/**
 * ManageLocationsPage component for managing event locations(CREATE, READ, UPDATE, DELETE).
 *
 * @returns JSX.Element The ManageLocationsPage component.
 */
export default function ManageLocationsPage() {
     const [locations, setLocations] = useState<EventLocation[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [searchTerm, setSearchTerm] = useState("")
     const [openDialog, setOpenModal] = useState(false)

     const loadLocations = async () => {
          try {
               setLoading(true)
               setError(null)
               const data = await getAllLocations()
               setLocations(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load locations")
               console.error("Error loading locations:", err)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadLocations()
     }, [])

     const filteredEvents = locations.filter((location) => {
          const term = searchTerm.toLowerCase()

          const fields = [
               location.locationName,
               location.locationType,
               new Date(location.createdAt).toLocaleString(),
               location.updatedAt ? new Date(location.updatedAt).toLocaleString() : "",
          ]

          return fields.some((value) => value.toLowerCase().includes(term))
     })

     const handleDelete = async (location: EventLocation) => {
          try {
               await deleteLocation(location.locationId)
               setLocations((prev) => prev.filter((e) => e.locationId !== location.locationId))
               alert("Location deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               alert("Failed to delete location. Please try again.")
          }
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
                              Add New Location
                         </Button>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <Button variant="outline" size="sm" onClick={loadLocations}>
                              Refresh
                         </Button>
                    </div>

                    {error && (
                         <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                              {error}
                         </div>
                    )}

                    <LocationsTable
                         locations={filteredEvents}
                         loading={loading}
                         onDelete={handleDelete}
                    />

                    <CreateLocationDialog
                         open={openDialog}
                         onClose={() => setOpenModal(false)}
                         onSuccess={loadLocations}
                         existingLocations={locations}
                    />
               </div>
          </ProtectedLayout>
     )
}
