export async function PUT(req) {
    try {
        const disasters = await req.json();

        if (!Array.isArray(disasters)) {
            return new Response(JSON.stringify({ error: "Invalid input format. Expected an array." }), { status: 400 });
        }

        for (const disaster of disasters) {
            const formattedDisaster = {
                DISASTER_NAME: disaster.DISASTER_NAME || "Unknown",
                DISASTER_TYPE: disaster.DISASTER_TYPE || "Unknown",
                LATITUDE: disaster.LATITUDE?.toString() || "Unknown",
                LONGITUDE: disaster.LONGITUDE?.toString() || "Unknown",
                DATE_TIME: disaster.DATE_TIME ?.toString() || "Unknown",
                COUNTY: disaster.county || "Unknown",
                STATE: disaster.state || "Unknown",
                COUNTRY: disaster.country || "Unknown"
            };

            // Send PUT request for each disaster entry
            await fetch("https://apex.oracle.com/pls/apex/hackathonsid/disaster/insert_disaster", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formattedDisaster)
            });
        }

        console.log("Inserting into Oracle Database - Done")

        return new Response(JSON.stringify({ message: "Disasters processed" }), { status: 200 });
    } catch (error) {
        console.error("Insert Disaster API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}