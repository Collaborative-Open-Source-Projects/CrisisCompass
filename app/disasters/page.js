"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configure default marker icons (make sure the files exist in public/)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Component to handle map clicks
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      // When the map is clicked, call the provided handler with the location
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function DisastersPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDisasters, setSelectedDisasters] = useState([]);

  // Fixed marker coordinates (Los Angeles)
  const defaultCoords = [34.052235, -118.243683];

  // On mount: set default selected marker and fetch its disaster data
  useEffect(() => {
    // Automatically set the default selected location
    setSelectedLocation(defaultCoords);
    fetch(`/api/fema?latitude=${defaultCoords[0]}&longitude=${defaultCoords[1]}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.DisasterDeclarationsSummaries) {
          setSelectedDisasters(data.DisasterDeclarationsSummaries);
        } else {
          console.error("Unexpected data format", data);
          setSelectedDisasters([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching disaster data for default location:", err);
        setSelectedDisasters([]);
      });
  }, []);

  // Get user's live location on mount (if available)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Fetch disaster data for the user's location
          fetch(`/api/fema?latitude=${latitude}&longitude=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.DisasterDeclarationsSummaries) {
                setDisasters(data.DisasterDeclarationsSummaries);
              } else {
                console.error("Unexpected data format", data);
              }
            })
            .catch((err) => {
              console.error("Error fetching disaster data:", err);
            });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Called when the user clicks on the map.
  // It sets the selected location and fetches disaster data for that location.
  const handleLocationSelect = (latlng) => {
    const { lat, lng } = latlng;
    setSelectedLocation([lat, lng]);
    fetch(`/api/fema?latitude=${lat}&longitude=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.DisasterDeclarationsSummaries) {
          setSelectedDisasters(data.DisasterDeclarationsSummaries);
        } else {
          console.error("Unexpected data format", data);
          setSelectedDisasters([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching disaster data for selected location:", err);
        setSelectedDisasters([]);
      });
  };

  // Use user's location as center if available, otherwise use the default marker
  const mapCenter = userLocation || defaultCoords;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Current Disasters
        </h1>
        <p className="text-lg text-gray-700">
          We&apos;re here to show the current disasters and make a change.
        </p>
        <p className="text-md text-gray-700">
          Click anywhere on the map to check if there are any disasters in that area.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <MapContainer
          center={mapCenter}
          zoom={userLocation ? 10 : 4}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Handle clicks on the map */}
          <ClickHandler onLocationSelect={handleLocationSelect} />

          {/* Marker for user's current location */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="space-y-2">
                  <h2 className="font-bold text-lg">Your Location</h2>
                  {disasters.length > 0 ? (
                    <div>
                      <p className="font-semibold">
                        Current Disaster Declarations:
                      </p>
                      <ul className="list-disc ml-5">
                        {disasters.map((disaster, index) => (
                          <li key={index}>
                            {disaster.incidentType} declared on{" "}
                            {new Date(disaster.declarationDate).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No active disasters found for your area.</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Marker for selected location (default or user-clicked) */}
          {selectedLocation && (
            <Marker position={selectedLocation}>
              <Popup>
                <div className="space-y-2">
                  <h2 className="font-bold text-lg">
                    {selectedLocation[0] === defaultCoords[0] &&
                    selectedLocation[1] === defaultCoords[1]
                      ? "Default Location (Los Angeles)"
                      : "Selected Location"}
                  </h2>
                  {selectedDisasters.length > 0 ? (
                    <div>
                      <p className="font-semibold">
                        Disasters in this area:
                      </p>
                      <ul className="list-disc ml-5">
                        {selectedDisasters.map((disaster, index) => (
                          <li key={index}>
                            {disaster.incidentType} declared on{" "}
                            {new Date(disaster.declarationDate).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No active disasters found for this area.</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
