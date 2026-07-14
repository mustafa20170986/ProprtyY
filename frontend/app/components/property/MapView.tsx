"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

// Fix leaflet icon
const fixIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

export default function MapView({ properties }: { properties: any[] }) {
  useEffect(() => { fixIcons(); }, []);

  const center: [number, number] = properties?.[0]?.coordinates ? [properties[0].coordinates.lat, properties[0].coordinates.lng] : [25.2048, 55.2708];

  return (
    <div className="h-[500px] lg:h-[calc(100vh-200px)] rounded-[2rem] overflow-hidden border border-black/10 sticky top-24">
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
        {properties?.map((p) => p.coordinates && (
          <Marker key={p._id} position={[p.coordinates.lat, p.coordinates.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{p.title}</strong><br/>
                {p.location?.city} - ${p.price?.toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
