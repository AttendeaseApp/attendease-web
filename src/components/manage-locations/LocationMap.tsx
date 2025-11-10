"use client"

import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw"
import type L from "leaflet"

interface MapProps {
  onCreated: (e: L.DrawEvents.Created) => void
  onDeleted: (e: L.DrawEvents.Deleted) => void
  tileType?: "esri" | "osm"
}

export default function LocationMap({ onCreated, onDeleted, tileType = "esri" }: MapProps) {
  return (
    <MapContainer center={[14.149, 120.955]} zoom={18} style={{ height: "100%", width: "100%" }}>
      {tileType === "esri" ? (
        <>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, etc."
          />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="Labels &copy; Esri"
            opacity={0.7}
          />
        </>
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      )}

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreated}
          onDeleted={onDeleted}
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            polyline: false,
            circlemarker: false,
            polygon: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}
