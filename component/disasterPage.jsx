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
 */
function filterDisastersWithinRadius(disasters, center, radiusMiles = 50) {
  return disasters.filter((d) => {
    const lat = parseFloat(d.latitude);
    const lng = parseFloat(d.longitude);
    if (isNaN(lat) || isNaN(lng)) return false;
    const dist = distanceInMiles(center, [lat, lng]);
    return dist <= radiusMiles;
  });
}

/** 
 * Create an icon for accommodations. 
 */
function getAccommodationIcon() {
  return new L.Icon({
    iconUrl: "/icons/hotel.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}

/** 
 * Helper: fetch accommodations from your Next.js route. 
 */
async function fetchAccommodations(latitude, longitude) {
  try {
    const res = await fetch(
      `/api/accommodation?latitude=${latitude}&longitude=${longitude}&radius=1000`
    );
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching accommodations:", err);
    return null;
  }
}

export function DisastersPage() {
  const [allDisasters, setAllDisasters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [disastersNearUser, setDisastersNearUser] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [disastersNearSelected, setDisastersNearSelected] = useState([]);
  const [accommodationsUser, setAccommodationsUser] = useState([]);
  const [accommodationsSelected, setAccommodationsSelected] = useState([]);
  const defaultCoords = [-21.986378553248763, 130.41058593591805];

  // 1) On mount, fetch all the APEX disaster data
  useEffect(() => {
    fetch("https://apex.oracle.com/pls/apex/hackathonsid/disaster/allRecords")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
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

  // 2) Get user's live location -> filter disasters & fetch accommodations
  useEffect(() => {
    if (!allDisasters.length) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          const nearby = filterDisastersWithinRadius(
            allDisasters,
            [latitude, longitude],
            50
          );
          setDisastersNearUser(nearby);

          const accomData = await fetchAccommodations(latitude, longitude);
          if (accomData && accomData.features) {
            setAccommodationsUser(accomData.features);
          } else {
            setAccommodationsUser([]);
          }
        },
        async (error) => {
          console.error("Error getting geolocation:", error);
          setUserLocation(defaultCoords);
          setDisastersNearUser(
            filterDisastersWithinRadius(allDisasters, defaultCoords, 50)
          );
          const accomData = await fetchAccommodations(
            defaultCoords[0],
            defaultCoords[1]
          );
          if (accomData && accomData.features) {
            setAccommodationsUser(accomData.features);
          } else {
            setAccommodationsUser([]);
          }
        }
      );
    } else {
      console.error("Geolocation not supported, using defaults");
      setUserLocation(defaultCoords);
      setDisastersNearUser(
        filterDisastersWithinRadius(allDisasters, defaultCoords, 50)
      );
      fetchAccommodations(defaultCoords[0], defaultCoords[1]).then(
        (accomData) => {
          if (accomData && accomData.features) {
            setAccommodationsUser(accomData.features);
          } else {
            setAccommodationsUser([]);
          }
        }
      );
    }
  }, [allDisasters]);

  // 3) Set up default selected location and its nearby disasters
  useEffect(() => {
    setSelectedLocation(defaultCoords);
    const nearDefault = filterDisastersWithinRadius(
      allDisasters,
      defaultCoords,
      50
    );
    setDisastersNearSelected(nearDefault);
    fetchAccommodations(defaultCoords[0], defaultCoords[1]).then((accomData) => {
      if (accomData && accomData.features) {
        setAccommodationsSelected(accomData.features);
      } else {
        setAccommodationsSelected([]);
      }
    });
  }, [allDisasters]);

  // 4) When user clicks the map, update selectedLocation -> fetch disasters & accommodations
  const handleLocationSelect = async (latlng) => {
    const { lat, lng } = latlng;
    setSelectedLocation([lat, lng]);
    const nearby = filterDisastersWithinRadius(allDisasters, [lat, lng], 50);
    setDisastersNearSelected(nearby);
    const accomData = await fetchAccommodations(lat, lng);
    if (accomData && accomData.features) {
      setAccommodationsSelected(accomData.features);
    } else {
      setAccommodationsSelected([]);
    }
  };

  // 5) Circles for user and selected location
  const circleOptions = {
    color: disastersNearUser?.length > 0 ? "red" : "blue",
    fillColor: disastersNearUser?.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };

  const circleOptionsSelected = {
    color: disastersNearSelected?.length > 0 ? "red" : "blue",
    fillColor: disastersNearSelected?.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };

  // 6) Icon for the selected location
  const selectedLocationIcon = useMemo(() => {
    if (disastersNearSelected && disastersNearSelected.length > 0) {
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

  // 7) Map center
  const mapCenter = userLocation || defaultCoords;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Current Disasters & Nearby Accommodations
        </h1>
        <p className="text-lg text-gray-700">
          Showing real-time data from Oracle APEX and Geoapify.
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

          {/* Circle around the user's location */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={80467}
              pathOptions={circleOptions}
            />
          )}

          {/* Circle around the selected location */}
          {selectedLocation && (
            <Circle
              center={selectedLocation}
              radius={80467}
              pathOptions={circleOptionsSelected}
            />
          )}

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
                        {d.disaster_type} —{" "}
                        {new Date(d.date_time).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No active disasters within 50 miles.</p>
                )}
              </Popup>
            </Marker>
          )}

          {/* Marker for the selected location */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={selectedLocationIcon}>
              <Popup>
                <h2 className="font-bold text-lg">
                  {selectedLocation[0] === defaultCoords[0] &&
                  selectedLocation[1] === defaultCoords[1]
                    ? "Default Location (LA or another default)"
                    : "Selected Location"}
                </h2>
                {disastersNearSelected.length > 0 ? (
                  <ul>
                    {disastersNearSelected.map((d) => (
                      <li key={d.id}>
                        {d.disaster_type} —{" "}
                        {new Date(d.date_time).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No active disasters within 50 miles.</p>
                )}
              </Popup>
            </Marker>
          )}

          {/* Disasters near the SELECTED location */}
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

          {/* Accommodations near the user's location */}
          {accommodationsUser.map((accom, idx) => {
            const [lng, lat] = accom.geometry.coordinates;
            return (
              <Marker
                key={`user-accom-${idx}`}
                position={[lat, lng]}
                icon={getAccommodationIcon()}
              >
                <Popup>
                  <h2 className="font-bold text-lg">
                    {accom.properties.name || "Accommodation"}
                  </h2>
                  {accom.properties.address_line2 && (
                    <p>{accom.properties.address_line2}</p>
                  )}
                </Popup>
              </Marker>
            );
          })}

          {/* Accommodations near the SELECTED location */}
          {accommodationsSelected.map((accom, idx) => {
            const [lng, lat] = accom.geometry.coordinates;
            return (
              <Marker
                key={`selected-accom-${idx}`}
                position={[lat, lng]}
                icon={getAccommodationIcon()}
              >
                <Popup>
                  <h2 className="font-bold text-lg">
                    {accom.properties.name || "Accommodation"}
                  </h2>
                  {accom.properties.address_line2 && (
                    <p>{accom.properties.address_line2}</p>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}