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
 * Helper: Return a custom Leaflet icon based on disaster_type (APEX).
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
  // Fallback
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
 * Icons for each category 
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
function getHospitalIcon() {
  return new L.Icon({
    iconUrl: "/icons/hospital.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}
function getTransportIcon() {
  return new L.Icon({
    iconUrl: "/icons/transport.png",
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}
function getFoodIcon() {
  return new L.Icon({
    iconUrl: "/icons/food.png", // Make sure this file exists in /public/icons
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}
function getShelterIcon() {
  return new L.Icon({
    iconUrl: "/icons/shelter.png", // Make sure this file exists in /public/icons
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/marker-shadow.png",
  });
}

/** 
 * Fetch helpers for all categories
 */
async function fetchAccommodations(lat, lng) {
  try {
    const res = await fetch(`/api/accommodation?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching accommodations:", err);
    return null;
  }
}
async function fetchHospitals(lat, lng) {
  try {
    const res = await fetch(`/api/hospital?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    return null;
  }
}
async function fetchTransportation(lat, lng) {
  try {
    const res = await fetch(`/api/transportation?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching transportation:", err);
    return null;
  }
}
/** 
 * New: Social Services (Food, Shelter)
 */
async function fetchFoodServices(lat, lng) {
  try {
    const res = await fetch(`/api/social-services/food?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching food services:", err);
    return null;
  }
}
async function fetchShelterServices(lat, lng) {
  try {
    const res = await fetch(`/api/social-services/shelter?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching shelter services:", err);
    return null;
  }
}

export function DisastersPage() {
  // Disasters (APEX)
  const [allDisasters, setAllDisasters] = useState([]);
  // User location + Disasters near user
  const [userLocation, setUserLocation] = useState(null);
  const [disastersNearUser, setDisastersNearUser] = useState([]);
  // Selected location + Disasters near selected
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [disastersNearSelected, setDisastersNearSelected] = useState([]);

  // Accommodations
  const [accommodationsUser, setAccommodationsUser] = useState([]);
  const [accommodationsSelected, setAccommodationsSelected] = useState([]);

  // Hospitals
  const [hospitalsUser, setHospitalsUser] = useState([]);
  const [hospitalsSelected, setHospitalsSelected] = useState([]);

  // Transportation
  const [transportUser, setTransportUser] = useState([]);
  const [transportSelected, setTransportSelected] = useState([]);

  // // Social Services: Food
  // const [foodUser, setFoodUser] = useState([]);
  // const [foodSelected, setFoodSelected] = useState([]);

  // // Social Services: Shelter
  // const [shelterUser, setShelterUser] = useState([]);
  // const [shelterSelected, setShelterSelected] = useState([]);

  // Default coords
  const defaultCoords = [34.052235, -118.24368];

  // 1) Fetch APEX disaster data
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

  // 2) Once we have disasters, get user location & fetch user-based data
  useEffect(() => {
    if (!allDisasters.length) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Disasters near user
          const nearby = filterDisastersWithinRadius(allDisasters, [latitude, longitude], 50);
          setDisastersNearUser(nearby);

          // Fetch accommodations, hospitals, transport, food, shelter
          const accomData = await fetchAccommodations(latitude, longitude);
          setAccommodationsUser(accomData?.features || []);

          const hospitalData = await fetchHospitals(latitude, longitude);
          setHospitalsUser(hospitalData?.features || []);

          const transportData = await fetchTransportation(latitude, longitude);
          setTransportUser(transportData?.features || []);

          // const foodData = await fetchFoodServices(latitude, longitude);
          // setFoodUser(foodData?.features || []);

          // const shelterData = await fetchShelterServices(latitude, longitude);
          // setShelterUser(shelterData?.features || []);
        },
        async (error) => {
          console.error("Error getting geolocation:", error);
          // Fallback to default coords
          setUserLocation(defaultCoords);
          setDisastersNearUser(filterDisastersWithinRadius(allDisasters, defaultCoords, 50));

          const accomData = await fetchAccommodations(defaultCoords[0], defaultCoords[1]);
          setAccommodationsUser(accomData?.features || []);

          const hospitalData = await fetchHospitals(defaultCoords[0], defaultCoords[1]);
          setHospitalsUser(hospitalData?.features || []);

          const transportData = await fetchTransportation(defaultCoords[0], defaultCoords[1]);
          setTransportUser(transportData?.features || []);

          // const foodData = await fetchFoodServices(defaultCoords[0], defaultCoords[1]);
          // setFoodUser(foodData?.features || []);

          // const shelterData = await fetchShelterServices(defaultCoords[0], defaultCoords[1]);
          // setShelterUser(shelterData?.features || []);
        }
      );
    } else {
      console.error("Geolocation not supported, using defaults");
      setUserLocation(defaultCoords);
      setDisastersNearUser(filterDisastersWithinRadius(allDisasters, defaultCoords, 50));

      // same fallback fetch calls
      fetchAccommodations(defaultCoords[0], defaultCoords[1]).then((data) =>
        setAccommodationsUser(data?.features || [])
      );
      fetchHospitals(defaultCoords[0], defaultCoords[1]).then((data) =>
        setHospitalsUser(data?.features || [])
      );
      fetchTransportation(defaultCoords[0], defaultCoords[1]).then((data) =>
        setTransportUser(data?.features || [])
      );
      // fetchFoodServices(defaultCoords[0], defaultCoords[1]).then((data) =>
      //   setFoodUser(data?.features || [])
      // );
      // fetchShelterServices(defaultCoords[0], defaultCoords[1]).then((data) =>
      //   setShelterUser(data?.features || [])
      // );
    }
  }, [allDisasters]);

  // 3) Default selected location -> fetch everything there
  useEffect(() => {
    if (!allDisasters.length) return;

    setSelectedLocation(defaultCoords);

    const nearDefault = filterDisastersWithinRadius(allDisasters, defaultCoords, 50);
    setDisastersNearSelected(nearDefault);

    fetchAccommodations(defaultCoords[0], defaultCoords[1]).then((data) =>
      setAccommodationsSelected(data?.features || [])
    );
    fetchHospitals(defaultCoords[0], defaultCoords[1]).then((data) =>
      setHospitalsSelected(data?.features || [])
    );
    fetchTransportation(defaultCoords[0], defaultCoords[1]).then((data) =>
      setTransportSelected(data?.features || [])
    );
    // fetchFoodServices(defaultCoords[0], defaultCoords[1]).then((data) =>
    //   setFoodSelected(data?.features || [])
    // );
    // fetchShelterServices(defaultCoords[0], defaultCoords[1]).then((data) =>
    //   setShelterSelected(data?.features || [])
    // );
  }, [allDisasters]);

  // 4) When user clicks, fetch everything for that location
  const handleLocationSelect = async (latlng) => {
    const { lat, lng } = latlng;
    setSelectedLocation([lat, lng]);

    const nearby = filterDisastersWithinRadius(allDisasters, [lat, lng], 50);
    setDisastersNearSelected(nearby);

    const accomData = await fetchAccommodations(lat, lng);
    setAccommodationsSelected(accomData?.features || []);

    const hospitalData = await fetchHospitals(lat, lng);
    setHospitalsSelected(hospitalData?.features || []);

    const transportData = await fetchTransportation(lat, lng);
    setTransportSelected(transportData?.features || []);

    // const foodData = await fetchFoodServices(lat, lng);
    // setFoodSelected(foodData?.features || []);

    // const shelterData = await fetchShelterServices(lat, lng);
    // setShelterSelected(shelterData?.features || []);
  };

  // Circle styling
  const circleOptions = {
    color: disastersNearUser.length > 0 ? "red" : "blue",
    fillColor: disastersNearUser.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };
  const circleOptionsSelected = {
    color: disastersNearSelected.length > 0 ? "red" : "blue",
    fillColor: disastersNearSelected.length > 0 ? "red" : "blue",
    fillOpacity: 0.2,
  };

  // Icon for the SELECTED location
  const selectedLocationIcon = useMemo(() => {
    if (disastersNearSelected?.length > 0) {
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

  // Center the map on userLocation if available, else default
  const mapCenter = userLocation || defaultCoords;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Disasters + Social Services + More
        </h1>
        <p className="text-lg text-gray-700">
          Showing real-time data from Oracle APEX and Geoapify.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <MapContainer
          center={mapCenter}
          zoom={userLocation ? 10 : 4}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Circle for user's location */}
          {userLocation && (
            <Circle center={userLocation} radius={80467} pathOptions={circleOptions} />
          )}

          {/* Circle for selected location */}
          {selectedLocation && (
            <Circle
              center={selectedLocation}
              radius={80467}
              pathOptions={circleOptionsSelected}
            />
          )}

          {/* Handle map clicks */}
          <ClickHandler onLocationSelect={handleLocationSelect} />

          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <h2 className="font-bold text-lg">Your Location</h2>
                {disastersNearUser.length > 0 ? (
                  <ul>
                    {disastersNearUser.map((d) => (
                      <li key={d.id}>
                        {d.disaster_type} – {new Date(d.date_time).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No active disasters within 50 miles.</p>
                )}
              </Popup>
            </Marker>
          )}

          {/* Selected location marker */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={selectedLocationIcon}>
              <Popup>
                <h2 className="font-bold text-lg">
                  {selectedLocation[0] === defaultCoords[0] &&
                  selectedLocation[1] === defaultCoords[1]
                    ? "Default Location"
                    : "Selected Location"}
                </h2>
                {disastersNearSelected.length > 0 ? (
                  <ul>
                    {disastersNearSelected.map((d) => (
                      <li key={d.id}>
                        {d.disaster_type} –{" "}
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

          {/* DISASTER MARKERS (selected location) */}
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

          {/* ACCOMMODATIONS */}
          {accommodationsUser.map((a, i) => {
            const [lng, lat] = a.geometry.coordinates;
            return (
              <Marker key={`user-accom-${i}`} position={[lat, lng]} icon={getAccommodationIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {a.properties.name || "Accommodation"}
                  </h2>
                  {a.properties.address_line2 && <p>{a.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}
          {accommodationsSelected.map((a, i) => {
            const [lng, lat] = a.geometry.coordinates;
            return (
              <Marker key={`sel-accom-${i}`} position={[lat, lng]} icon={getAccommodationIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {a.properties.name || "Accommodation"}
                  </h2>
                  {a.properties.address_line2 && <p>{a.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}

          {/* HOSPITALS */}
          {hospitalsUser.map((h, i) => {
            const [lng, lat] = h.geometry.coordinates;
            return (
              <Marker key={`user-hosp-${i}`} position={[lat, lng]} icon={getHospitalIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {h.properties.name || "Hospital / Clinic"}
                  </h2>
                  {h.properties.address_line2 && <p>{h.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}
          {hospitalsSelected.map((h, i) => {
            const [lng, lat] = h.geometry.coordinates;
            return (
              <Marker key={`sel-hosp-${i}`} position={[lat, lng]} icon={getHospitalIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {h.properties.name || "Hospital / Clinic"}
                  </h2>
                  {h.properties.address_line2 && <p>{h.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}

          {/* TRANSPORTATION */}
          {transportUser.map((t, i) => {
            const [lng, lat] = t.geometry.coordinates;
            return (
              <Marker key={`user-trans-${i}`} position={[lat, lng]} icon={getTransportIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {t.properties.name || "Public Transport"}
                  </h2>
                  {t.properties.address_line2 && <p>{t.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}
          {transportSelected.map((t, i) => {
            const [lng, lat] = t.geometry.coordinates;
            return (
              <Marker key={`sel-trans-${i}`} position={[lat, lng]} icon={getTransportIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {t.properties.name || "Public Transport"}
                  </h2>
                  {t.properties.address_line2 && <p>{t.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}

          {/* FOOD SERVICES */}
          {/* {foodUser.map((f, i) => {
            const [lng, lat] = f.geometry.coordinates;
            return (
              <Marker key={`user-food-${i}`} position={[lat, lng]} icon={getFoodIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {f.properties.name || "Food Service"}
                  </h2>
                  {f.properties.address_line2 && <p>{f.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}
          {foodSelected.map((f, i) => {
            const [lng, lat] = f.geometry.coordinates;
            return (
              <Marker key={`sel-food-${i}`} position={[lat, lng]} icon={getFoodIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {f.properties.name || "Food Service"}
                  </h2>
                  {f.properties.address_line2 && <p>{f.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })} */}

          {/* SHELTER SERVICES */}
          {/* {shelterUser.map((s, i) => {
            const [lng, lat] = s.geometry.coordinates;
            return (
              <Marker key={`user-shelter-${i}`} position={[lat, lng]} icon={getShelterIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {s.properties.name || "Shelter Service"}
                  </h2>
                  {s.properties.address_line2 && <p>{s.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })}
          {shelterSelected.map((s, i) => {
            const [lng, lat] = s.geometry.coordinates;
            return (
              <Marker key={`sel-shelter-${i}`} position={[lat, lng]} icon={getShelterIcon()}>
                <Popup>
                  <h2 className="font-bold text-lg">
                    {s.properties.name || "Shelter Service"}
                  </h2>
                  {s.properties.address_line2 && <p>{s.properties.address_line2}</p>}
                </Popup>
              </Marker>
            );
          })} */}
        </MapContainer>
      </div>
    </div>
  );
}
