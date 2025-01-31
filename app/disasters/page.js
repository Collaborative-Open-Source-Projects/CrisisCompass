"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function DisastersPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Load and parse the CSV file
    fetch("/static/uscounties.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row) => ({
              county: row.county,
              state: row.state_name,
              lat: parseFloat(row.lat),
              lng: parseFloat(row.lng),
              population: row.population,
            }));
            setLocations(parsedData);
          },
        });
      });
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Current Disasters
        </h1>
        <p className="text-lg text-gray-700">
          We're here to show the current disasters and make a change.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <MapContainer
          center={[37.8, -96]}
          zoom={4}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>
                <strong>
                  {loc.county}, {loc.state}
                </strong>
                <br />
                Population: {loc.population}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
