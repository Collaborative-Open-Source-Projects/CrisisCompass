"use client";
import { useState } from "react";

export default function CheckDisaster() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const fetchAndStoreDisasters = async () => {
        setLoading(true);
        setResult(null);

        try {
            // Fetch the latest disaster from Oracle APEX
            const apexResponse = await fetch("/api/oracle/latest-disaster");
            const apexData = await apexResponse.json();

            console.log(apexData);

            if (!apexResponse.ok) {
                throw new Error("Failed to fetch latest disaster from Oracle APEX");
            }

            const latestApexDisaster = apexData?.items?.[0]; // Extract latest disaster

            // Fetch all disasters from NASA API
            const nasaResponse = await fetch("/api/nasa/get-disaster");
            const nasaDisasters = await nasaResponse.json();

            if (!nasaResponse.ok) {
                throw new Error("Failed to fetch disasters from NASA API");
            }

            // Filter NASA disasters - Only keep disasters newer than the latest Oracle disaster
            const filteredDisasters = nasaDisasters.filter(disaster => {
                return (
                    !latestApexDisaster || // If no latest disaster, insert all
                    new Date(disaster.date_time) > new Date(latestApexDisaster.date_time)
                );
            });

            if (filteredDisasters.length === 0) {
                setResult({ message: "No new disasters to insert." });
                return;
            }

            // Insert filtered disasters into Oracle APEX
            const insertResponse = await fetch("/api/oracle/insert-disaster", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredDisasters),
            });

            const insertResult = await insertResponse.json();
            setResult(insertResult);
        } catch (error) {
            console.error("Error:", error);
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Fetch & Store Disasters</h1>
            <button 
                onClick={fetchAndStoreDisasters} 
                disabled={loading} 
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Processing..." : "Fetch & Store Disasters"}
            </button>
            {result && (
                <pre className="mt-4 p-4 bg-gray-100 rounded">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}