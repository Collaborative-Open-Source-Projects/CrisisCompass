/**
 * Determines the user’s location (or uses a default coordinate, here Los Angeles).
 * Draws a Leaflet map centered on that location.
 * Draws a 50‑mile radius circle around the user’s location whose color is red if any disaster data exist in that area (blue if none).
 * Uses your API data and “geocodes” each disaster’s designated area (or title) via the OpenStreetMap Nominatim API to get approximate coordinates.
 * Uses the Haversine formula to determine if each disaster is within 50 miles of the center.
 * Renders a marker for every disaster that qualifies.
 */

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configure default marker icons (ensure these files exist in your public folder)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Component to handle map clicks.
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// Helper: Geocode an area using Nominatim OpenStreetMap API.
async function geocodeArea(area) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        area
      )}`,
      {
        headers: { "User-Agent": "YourAppName/1.0 (youremail@example.com)" },
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error("Geocoding error for", area, err);
  }
  return null;
}

// Helper: Compute distance (in miles) between two lat/lng pairs using the Haversine formula.
function distanceInMiles([lat1, lon1], [lat2, lon2]) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles.
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helper: Return a custom Leaflet icon based on the disaster's type.
 */
function getDisasterIcon(disaster) {
  const type = disaster.incidentType?.toLowerCase() || "";
  if (type.includes("fire")) {
    return new L.Icon({
      iconUrl: "/icons/fire.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
    });
  } else if (type.includes("flood")) {
    return new L.Icon({
      iconUrl: "/icons/flood.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
    });
  } else if (type.includes("storm")) {
    return new L.Icon({
      iconUrl: "/icons/storm.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
    });
  }
  // Fallback to default marker.
  return new L.Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
    shadowSize: [41, 41],
  });
}

export function DisastersPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [disasters, setDisasters] = useState([]); // Disaster data for user location.
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDisasters, setSelectedDisasters] = useState([]); // Disaster data for selected location.
  const [disasterMarkers, setDisasterMarkers] = useState([]); // Disaster markers with geocoded coordinates.

  // Default coordinates: Los Angeles.
  const defaultCoords = [34.052235, -118.243683];

  // On mount: set default selected location and fetch its disaster data.
  useEffect(() => {
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

  // Get user's live location (if available) and fetch disaster data for that location.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
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

  // When selectedDisasters changes, geocode each disaster’s designated area and
  // keep only those whose coordinates are within 50 miles of the center.
  useEffect(() => {
    async function processDisasters() {
      const center = userLocation || defaultCoords;
      const markers = [];
      await Promise.all(
        selectedDisasters.map(async (disaster) => {
          // Use either declarationTitle or designatedArea as the geocode query.
          const area = disaster.declarationTitle || disaster.designatedArea;
          if (!area) return;
          const coords = await geocodeArea(area);
          if (coords) {
            const dist = distanceInMiles(center, coords);
            if (dist <= 50) {
              markers.push({ ...disaster, coordinates: coords });
            }
          }
        })
      );
      setDisasterMarkers(markers);
    }
    if (selectedDisasters.length > 0) {
      processDisasters();
    } else {
      setDisasterMarkers([]);
    }
  }, [selectedDisasters, userLocation]);

  // Determine the map center: use userLocation if available; otherwise, defaultCoords.
  const mapCenter = userLocation || defaultCoords;

  // Define circle options: red if disasters exist in user's area, blue otherwise.
  const circleOptions = {
    color: disasters && disasters.length > 0 ? "red" : "blue",
    fillColor: disasters && disasters.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };

  // Compute a custom icon for the selected location marker based on the latest disaster.
  // We sort the selectedDisasters by declarationDate (descending) and use the first disaster.
  const selectedLocationIcon = useMemo(() => {
    if (selectedDisasters && selectedDisasters.length > 0) {
      const sorted = [...selectedDisasters].sort(
        (a, b) => new Date(b.declarationDate) - new Date(a.declarationDate)
      );
      const latest = sorted[0];
      return getDisasterIcon(latest);
    }
    return new L.Icon({
      iconUrl: "/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
    });
  }, [selectedDisasters]);

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

          {/* Draw a 50-mile radius circle around the user location */}
          {userLocation && (
            <Circle center={userLocation} radius={80467} pathOptions={circleOptions} />
          )}

          {/* Handle map clicks */}
          <ClickHandler onLocationSelect={handleLocationSelect} />

          {/* Marker for user's current location */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="space-y-2">
                  <h2 className="font-bold text-lg">Your Location</h2>
                  {disasters.length > 0 ? (
                    <div>
                      <p className="font-semibold">Current Disaster Declarations:</p>
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

          {/* Marker for selected location (default or user-clicked) with custom icon */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={selectedLocationIcon}>
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
                      <p className="font-semibold">Disasters in this area:</p>
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

          {/* Markers for each disaster within 50 miles with a custom icon */}
          {disasterMarkers.map((disaster, index) => (
            <Marker
              key={`disaster-${index}`}
              position={disaster.coordinates}
              icon={getDisasterIcon(disaster)}
            >
              <Popup>
                <div className="space-y-2">
                  <h2 className="font-bold text-lg">
                    {disaster.incidentType} (
                    {new Date(disaster.declarationDate).toLocaleDateString()})
                  </h2>
                  <p>{disaster.declarationTitle || disaster.designatedArea}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
