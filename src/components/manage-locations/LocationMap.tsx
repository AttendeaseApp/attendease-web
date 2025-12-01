"use client"

import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import "leaflet-draw"
import L from "leaflet"
import { useEffect, useRef } from "react"
interface MapProps {
     onCreated: (e: L.DrawEvents.Created) => void
     onDeleted: (e: L.DrawEvents.Deleted) => void
     tileType?: "esri" | "osm"
     initialPolygon?: number[][]
}

export default function LocationMap({
     onCreated,
     onDeleted,
     tileType = "esri",
     initialPolygon,
}: MapProps) {
     const mapRef = useRef<L.Map>(null)
     const featureGroupRef = useRef<L.FeatureGroup>(null)
     useEffect(() => {
          if (featureGroupRef.current && initialPolygon && initialPolygon.length > 0) {
               featureGroupRef.current.clearLayers()
               const latLngs = initialPolygon.map(([lng, lat]) => L.latLng(lat, lng)) as L.LatLng[]
               L.polygon(latLngs, { color: "blue" }).addTo(featureGroupRef.current)
          }
     }, [initialPolygon])

     return (
          <MapContainer
               ref={mapRef}
               center={[14.149, 120.955]}
               zoom={18}
               style={{ height: "100%", width: "100%" }}
          >
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
               <FeatureGroup ref={featureGroupRef}>
                    {" "}
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
