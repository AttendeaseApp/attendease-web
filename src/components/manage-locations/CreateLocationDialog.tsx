"use client"
import dynamic from "next/dynamic"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { createLocation } from "@/services/locations-service"
import { EventLocationRequest } from "@/interface/location-interface"
import L from "leaflet"
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false })

interface CreateLocationModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateLocationDialog({
  open,
  onClose,
  onSuccess,
}: CreateLocationModalProps) {
  const [locationName, setLocationName] = useState("")
  const [locationType, setLocationType] = useState("INDOOR")
  const [polygon, setPolygon] = useState<number[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tileType, setTileType] = useState<"esri" | "osm">("esri")

  const handleCreate = async () => {
    if (!polygon.length) {
      setError("Please draw a polygon on the map.")
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
      await createLocation(payload)
      onSuccess()
      onClose()
    } catch (err) {
      setError("Failed to create location.")
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Create New Location</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Inputs and selects */}
          <div className="flex flex-col gap-4">
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

            <label className="font-medium">Map Options</label>
            <select
              className="border rounded-md px-3 py-2"
              value={tileType}
              onChange={(e) => setTileType(e.target.value as "esri" | "osm")}
            >
              <option value="esri">Esri Satellite + Labels</option>
              <option value="osm">OpenStreetMap</option>
            </select>

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>

          {/* Right column: Map */}
          <div className="h-[500px]">
            <LocationMap onCreated={onCreated} onDeleted={onDeleted} tileType={tileType} />
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
      </DialogContent>
    </Dialog>
  )
}
