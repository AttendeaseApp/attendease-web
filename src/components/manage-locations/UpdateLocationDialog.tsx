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
import { updateLocation } from "@/services/locations-service"
import { EventLocation, EventLocationRequest } from "@/interface/location-interface"
import { toast } from "sonner"
import L from "leaflet"
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false })
interface UpdateLocationModalProps {
     open: boolean
     onClose: () => void
     onSuccess: () => void
     location: EventLocation
}
export default function UpdateLocationDialog({
     open,
     onClose,
     onSuccess,
     location,
}: UpdateLocationModalProps) {
     const [locationName, setLocationName] = useState(location.locationName || "")
     const [locationType, setLocationType] = useState(location.locationType || "INDOOR")
     const [polygon, setPolygon] = useState<number[][]>(location.coordinates || [])
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
          } else if (open && location) {
               setLocationName(location.locationName || "")
               setLocationType(location.locationType || "INDOOR")
               setPolygon(location.coordinates || [])
          }
     }, [open, location])

     const handleUpdate = async () => {
          if (!locationName.trim()) {
               toast.error("Location name is required.")
               return
          }
          if (!polygon.length) {
               toast.error("Please draw or adjust the polygon on the map.")
               return
          }
          const payload: Partial<EventLocationRequest> = {
               locationName: locationName.trim(),
               locationType,
               geoJsonData: {
                    type: "Polygon",
                    coordinates: [polygon],
               },
          }
          try {
               setLoading(true)
               await updateLocation(location.locationId, payload)
               onSuccess()
               showStatus("success", "Successfully updated location")
               // REMOVED: onClose() here—moved to AlertDialogAction
          } catch (err) {
               toast.error("Failed: " + (err instanceof Error ? err.message : "Unknown error"))
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
     const title = isSuccess ? "Update Successful" : "Update Failed"
     const titleColor = isSuccess ? "text-green-600" : "text-red-600"

     const closeStatusAndParent = () => {
          setStatusDialogOpen(false)
          onClose()
     }

     return (
          <Dialog open={open} onOpenChange={onClose}>
               <DialogContent_ className="max-w-7xl">
                    <DialogHeader>
                         <DialogTitle>Update Location</DialogTitle>
                         <DialogDescription className="text-sm text-muted-foreground mb-4">
                              Update the geofenced area for {location.locationName}:
                         </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex flex-col">
                              <div className="flex flex-col gap-2 mb-5">
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

                              <div className="flex flex-col gap-2 mb-5">
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
                                   <label className="font-medium block mb-2">
                                        Update Rules (Data Integrity)
                                   </label>
                                   <p className="text-sm text-muted-foreground mb-2">
                                        This location can be updated if it&apos;s only used in
                                        events with status <strong>UPCOMING</strong> or{" "}
                                        <strong>CANCELLED</strong> (safe to change).
                                   </p>
                                   <p className="text-sm text-muted-foreground mb-2">
                                        Updates are <strong>blocked</strong> for events in{" "}
                                        <strong>REGISTRATION</strong>, <strong>ONGOING</strong>,{" "}
                                        <strong>CONCLUDED</strong>, or <strong>FINALIZED</strong> to
                                        protect attendance records and historical data. Reassign or
                                        cancel those events first.
                                   </p>
                                   <p className="text-xs text-muted-foreground italic mb-2">
                                        If blocked, you&apos;ll see an error toast with details.
                                   </p>
                                   <label className="font-medium block mb-2">
                                        Need help on updating an event location? Follow these steps:
                                   </label>
                                   <ol className="list-decimal list-inside text-sm text-muted-foreground">
                                        <li>Modify the name if needed.</li>
                                        <li>Update the type (indoor/outdoor).</li>
                                        <li>Adjust the boundary on the map.</li>
                                        <li>Click &quot;Update Location&quot; to save.</li>
                                   </ol>
                              </div>
                         </div>
                         <div className="h-[500px]">
                              <LocationMap
                                   onCreated={onCreated}
                                   onDeleted={onDeleted}
                                   tileType={tileType}
                                   initialPolygon={polygon}
                              />
                         </div>
                    </div>
                    <DialogFooter>
                         <Button variant="outline" onClick={onClose}>
                              Cancel
                         </Button>
                         <Button onClick={handleUpdate} disabled={loading}>
                              {" "}
                              {loading ? "Updating..." : "Update Location"}
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
                              <AlertDialogAction onClick={closeStatusAndParent}>
                                   OK
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </Dialog>
     )
}
