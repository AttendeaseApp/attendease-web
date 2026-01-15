"use client"
import dynamic from "next/dynamic"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
     Dialog,
     DialogContent as DialogContent_,
     DialogHeader,
     DialogTitle,
     DialogDescription,
     DialogFooter,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { createLocation } from "@/services/locations-service"
import { EventLocation, EventLocationRequest } from "@/interface/location-interface"
import { toast } from "sonner"
import L from "leaflet"
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false })

interface CreateLocationModalProps {
     open: boolean
     onClose: () => void
     onSuccess: (newLocation: EventLocation) => void
     existingLocations: { locationName: string }[]
     defaultLocationPurpose?: "EVENT_VENUE" | "REGISTRATION_AREA"
}

/**
 * CreateLocationDialog component.
 *
 * A modal dialog for creating a new event location, including name, type,
 * and geofenced polygon boundary via an interactive Leaflet map.
 *
 * Handles form validation (including duplicate names), API submission,
 * and user feedback via toasts and status alerts. Supports Esri satellite
 * or OpenStreetMap tile layers.
 *
 * @param {CreateLocationModalProps} props - Component props.
 */
export default function CreateLocationDialog({
     open,
     onClose,
     onSuccess,
     existingLocations,
     defaultLocationPurpose,
}: CreateLocationModalProps) {
     const [locationName, setLocationName] = useState("")
     const [locationType, setLocationType] = useState("INDOOR")
     const [locationPurpose, setLocationPurpose] = useState<"EVENT_VENUE" | "REGISTRATION_AREA">(
          "EVENT_VENUE"
     )
     const [description, setDescription] = useState("")
     const [polygon, setPolygon] = useState<number[][]>([])
     const [loading, setLoading] = useState(false)
     const [tileType, setTileType] = useState<"esri" | "osm">("esri")

     useEffect(() => {
          if (!open) {
               setLocationPurpose(defaultLocationPurpose ?? "EVENT_VENUE")
               setLocationName("")
               setDescription("")
               setPolygon([])
          }
     }, [open, defaultLocationPurpose])

     const handleCreate = async () => {
          if (!locationName.trim()) {
               toast.error("Location name is required.")
               return
          }

          if (!locationPurpose.trim()) {
               toast.error("Location Purpose is required.")
               return
          }

          const exists = existingLocations.some(
               (loc) => loc.locationName.trim().toLowerCase() === locationName.trim().toLowerCase()
          )

          if (exists) {
               toast.error("This location name already exists.")
               return
          }

          if (!polygon.length) {
               toast.error("Please draw a polygon on the map.")
               return
          }

          const payload: EventLocationRequest = {
               locationName,
               locationType,
               locationPurpose,
               description,
               locationGeometry: {
                    type: "Polygon",
                    coordinates: [polygon],
               },
          }

          try {
               setLoading(true)
               const newLocation = await createLocation(payload)
               onSuccess(newLocation)
               toast.success("SUCCESS", {
                    description: `Location created successfully!`,
               })
               onClose()
          } catch (err) {
               toast.error("Failed to create location.")
               console.error(err)
          } finally {
               setLoading(false)
          }
     }

     const onCreated = (e: { layer: L.Layer }) => {
          const layer = e.layer as L.Polygon
          const latlngs = layer.getLatLngs()[0] as L.LatLng[]
          const coords = latlngs.map((point) => [point.lng, point.lat])
          if (
               coords.length > 0 &&
               (coords[0][0] !== coords[coords.length - 1][0] ||
                    coords[0][1] !== coords[coords.length - 1][1])
          ) {
               coords.push([...coords[0]])
          }
          setPolygon(coords)
     }

     const onDeleted = () => {
          setPolygon([])
     }

     return (
          <Dialog open={open} onOpenChange={onClose}>
               <DialogContent_ className="max-w-7xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                         <DialogTitle>Create New Location</DialogTitle>
                         <DialogDescription className="text-sm text-muted-foreground mb-4">
                              Create a geofenced event area that is reusable when creating new event
                              sessions.
                         </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Left column: Inputs and selects */}
                         <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2 mb-6">
                                   <label className="font-medium">Venue Details</label>
                                   <Input
                                        placeholder="Location Name"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                   />

                                   <select
                                        className="border rounded-md px-3 py-2"
                                        value={locationType}
                                        onChange={(e) => setLocationType(e.target.value)}
                                   >
                                        <option value="INDOOR">Indoor</option>
                                        <option value="OUTDOOR">Outdoor</option>
                                   </select>

                                   <select
                                        className="border rounded-md px-3 py-2"
                                        value={locationPurpose}
                                        onChange={(e) =>
                                             setLocationPurpose(
                                                  e.target.value as
                                                       | "EVENT_VENUE"
                                                       | "REGISTRATION_AREA"
                                             )
                                        }
                                   >
                                        <option value="EVENT_VENUE">Event Venue</option>
                                        <option value="REGISTRATION_AREA">Registration Area</option>
                                   </select>

                                   <Input
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                   />
                              </div>

                              <div className="flex flex-col gap-2 mb-6">
                                   <label className="font-medium">Map Layers</label>
                                   <select
                                        className="border rounded-md px-3 py-2 w-full"
                                        value={tileType}
                                        onChange={(e) =>
                                             setTileType(e.target.value as "esri" | "osm")
                                        }
                                   >
                                        <option value="esri">Esri Satellite + Labels</option>
                                        <option value="osm">OpenStreetMap</option>
                                   </select>
                              </div>

                              <div className="mb-6 p-4 bg-amber-50 rounded-md border border-amber-200">
                                   <label className="font-medium">
                                        Need help on creating an event location? Follow these steps:
                                   </label>
                                   <ol className="space-y-1 list-decimal list-inside text-sm text-muted-foreground">
                                        <li>Enter a unique name for the location.</li>
                                        <li>Select whether it&rsquo;s indoor or outdoor.</li>
                                        <li>
                                             Choose a map style (Esri for satellite imagery or
                                             OpenStreetMap for standard tiles).
                                        </li>
                                        <li>
                                             Draw the location boundary on the map: Click the
                                             polygon tool (top-right), click points to outline the
                                             area, and double-click or click finish to close the
                                             shape. You can edit or delete it as needed.
                                        </li>
                                        <li>
                                             Click &quot;Create Location&quot; to save. Remember,
                                             the boundary must be a closed polygon.
                                        </li>
                                   </ol>
                              </div>
                         </div>

                         {/* Right column: Map */}
                         <div className="h-[500px]">
                              <LocationMap
                                   onCreated={onCreated}
                                   onDeleted={onDeleted}
                                   tileType={tileType}
                              />
                         </div>
                    </div>

                    <DialogFooter>
                         <Button variant="outline" onClick={onClose}>
                              <X className="mr-2 h-4 w-4" />
                              Close
                         </Button>
                         <Button onClick={handleCreate} disabled={loading}>
                              {loading ? "Creating..." : "Create Location"}
                         </Button>
                    </DialogFooter>
               </DialogContent_>
          </Dialog>
     )
}
