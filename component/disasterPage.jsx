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

// Configure default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

/** 
 * Component to handle map clicks.
 * Whenever the user clicks, we call onLocationSelect with the lat/lng.
 */
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

/**
 * Helper: Compute distance (in miles) between two lat/lng pairs
 * using the Haversine formula.
 */
function distanceInMiles([lat1, lon1], [lat2, lon2]) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
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
 * Helper: Return a custom Leaflet icon based on the APEX field disaster_type
 */
function getDisasterIcon(disaster) {
  const type = disaster.disaster_type?.toLowerCase() || "";
  if (type.includes("fire")) {
    return new L.Icon({
      iconUrl: "/icons/fire.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
    });
  } else if (type.includes("flood")) {
    return new L.Icon({
      iconUrl: "/icons/flood.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
    });
  } else if (type.includes("storm")) {
    return new L.Icon({
      iconUrl: "/icons/storm.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
    });
  }
  // Fallback to default marker
  return new L.Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}

/**
 * Filters disasters to those within `radiusMiles` of `center`.
 * `disasters` is an array of objects with .latitude and .longitude from APEX.
 */
function filterDisastersWithinRadius(disasters, center, radiusMiles = 50) {
  return disasters.filter((d) => {
    const lat = parseFloat(d.latitude);
    const lng = parseFloat(d.longitude);
    // Skip if we don't have numeric lat/lng
    if (isNaN(lat) || isNaN(lng)) return false;
    const dist = distanceInMiles(center, [lat, lng]);
    return dist <= radiusMiles;
  });
}

export function DisastersPage() {
  const [allDisasters, setAllDisasters] = useState([]);  // All data from APEX
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]
  const [disastersNearUser, setDisastersNearUser] = useState([]); // within 50 mi
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [disastersNearSelected, setDisastersNearSelected] = useState([]);

  // Default coordinates: Los Angeles
  const defaultCoords = [-21.986378553248763, 130.41058593591805];

  // 1) On mount, fetch **all** the APEX disaster data
  useEffect(() => {
    fetch("https://apex.oracle.com/pls/apex/hackathonsid/disaster/allRecords")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.items) {
          setAllDisasters(data.items);
        } else {
          console.error("Unexpected APEX data format", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching APEX data:", err);
      });
  }, []);

  // 2) Get user's live location and filter disasters within 50 miles of it
  useEffect(() => {
    if (!allDisasters.length) return; // Wait till we have APEX data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          // Filter only the disasters near user
          const nearby = filterDisastersWithinRadius(
            allDisasters,
            [latitude, longitude],
            50
          );
          setDisastersNearUser(nearby);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Fallback if user denies or fails geolocation
          setUserLocation(defaultCoords);
          setDisastersNearUser(
            filterDisastersWithinRadius(allDisasters, defaultCoords, 50)
          );
        }
      );
    } else {
      // If geolocation not supported, just use default
      console.error("Geolocation not supported, using defaults");
      setUserLocation(defaultCoords);
      setDisastersNearUser(
        filterDisastersWithinRadius(allDisasters, defaultCoords, 50)
      );
    }
  }, [allDisasters]);

  // 3) Set up default selected location (LA) and its nearby disasters
  useEffect(() => {
    setSelectedLocation(defaultCoords);
    // We can also do a 50 mile filter for LA
    const nearLA = filterDisastersWithinRadius(allDisasters, defaultCoords, 50);
    setDisastersNearSelected(nearLA);
  }, [allDisasters]);

  // 4) When user clicks the map, update selectedLocation and filter new area
  const handleLocationSelect = (latlng) => {
    const { lat, lng } = latlng;
    setSelectedLocation([lat, lng]);
    const nearby = filterDisastersWithinRadius(allDisasters, [lat, lng], 50);
    setDisastersNearSelected(nearby);
  };

  // 5) The circle color around user is red if we found any disasters, else blue
  const circleOptions = {
    color: disastersNearUser?.length > 0 ? "red" : "blue",
    fillColor: disastersNearUser?.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };

  // 6) Build an icon for the “selected location” marker. We'll just pick
  //    the first disaster’s type if one exists.
  const selectedLocationIcon = useMemo(() => {
    if (disastersNearSelected && disastersNearSelected.length > 0) {
      // Just pick the first item, or do a “most recent” logic, etc.
      return getDisasterIcon(disastersNearSelected[0]);
    }
    return new L.Icon({
      iconUrl: "/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
    });
  }, [disastersNearSelected]);

  // 7) The center of the map is userLocation if available, else LA
  const mapCenter = userLocation || defaultCoords;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Current Disasters (APEX)
        </h1>
        <p className="text-lg text-gray-700">
          Showing disaster data from our Oracle APEX endpoint.
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Circle around the user's location (50 miles) */}
          {userLocation && (
            <Circle center={userLocation} radius={80467} pathOptions={circleOptions} />
          )}

          {/* Handle map clicks */}
          <ClickHandler onLocationSelect={handleLocationSelect} />

          {/* Marker for user's location */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <h2 className="font-bold text-lg">Your Location</h2>
                {disastersNearUser.length > 0 ? (
                  <ul>
                    {disastersNearUser.map((d) => (
                      <li key={d.id}>
                        {d.disaster_type} — {new Date(d.date_time).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No active disasters within 50 miles.</p>
                )}
              </Popup>
            </Marker>
          )}

          {/* Marker for the selected location (defaults to LA) */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={selectedLocationIcon}>
              <Popup>
                <h2 className="font-bold text-lg">
                  {selectedLocation[0] === defaultCoords[0] &&
                  selectedLocation[1] === defaultCoords[1]
                    ? "Default Location (Los Angeles)"
                    : "Selected Location"}
                </h2>
                {disastersNearSelected.length > 0 ? (
                  <ul>
                    {disastersNearSelected.map((d) => (
                      <li key={d.id}>
                        {d.disaster_type} — {new Date(d.date_time).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No active disasters within 50 miles.</p>
                )}
              </Popup>
            </Marker>
          )}

          {/* Markers for all disasters near the SELECTED location. 
              They use each disaster's actual lat/long from APEX.
          */}
          {disastersNearSelected.map((disaster) => (
            <Marker
              key={disaster.id}
              position={[disaster.latitude, disaster.longitude]}
              icon={getDisasterIcon(disaster)}
            >
              <Popup>
                <h2 className="font-bold text-lg">
                  {disaster.disaster_type} –{" "}
                  {new Date(disaster.date_time).toLocaleDateString()}
                </h2>
                <p>{disaster.disaster_name}</p>
                <p>
                  {disaster.county}, {disaster.state}, {disaster.country}
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
