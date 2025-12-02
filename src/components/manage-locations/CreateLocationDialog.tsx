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
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogContent,
} from "@/components/ui/alert-dialog"
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
}: CreateLocationModalProps) {
     const [locationName, setLocationName] = useState("")
     const [locationType, setLocationType] = useState("INDOOR")
     const [polygon, setPolygon] = useState<number[][]>([])
     const [loading, setLoading] = useState(false)
     const [tileType, setTileType] = useState<"esri" | "osm">("esri")
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [createStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [createMessage, setCreateMessage] = useState("")
     const showStatus = (status: "success" | "error", message: string) => {
          setCreateStatus(status)
          setCreateMessage(message)
          setStatusDialogOpen(true)
     }

     useEffect(() => {
          if (!open) {
               setLocationName("")
               setPolygon([])
          }
     }, [open])

     const handleCreate = async () => {
          if (!locationName.trim()) {
               toast.error("Location name is required.")
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
               geoJsonData: {
                    type: "Polygon",
                    coordinates: [polygon],
               },
          }

          try {
               setLoading(true)
               const newLocation = await createLocation(payload)
               onSuccess(newLocation)
               showStatus("success", "Successfully created location")
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
          setPolygon(coords)
     }

     const onDeleted = () => {
          setPolygon([])
     }
     const isSuccess = createStatus === "success"
     const title = isSuccess ? "Create Successful" : "Create Failed"
     const titleColor = isSuccess ? "text-green-600" : "text-red-600"
     return (
          <Dialog open={open} onOpenChange={onClose}>
               <DialogContent_ className="max-w-7xl">
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
                              Cancel
                         </Button>
                         <Button onClick={handleCreate} disabled={loading}>
                              {loading ? "Creating..." : "Create Location"}
                         </Button>
                    </DialogFooter>
               </DialogContent_>
               <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle className={titleColor}>{title}</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-muted-foreground">
                                   {createMessage}
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogAction onClick={() => setStatusDialogOpen(false)}>
                                   OK
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </Dialog>
     )
}
