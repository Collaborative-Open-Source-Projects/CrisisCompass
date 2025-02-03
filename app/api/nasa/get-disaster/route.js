export async function GET(req) {
    try {
        // Fetch disaster data from NASA EONET API
        const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events");
        const data = await response.json();

        if (!data || !data.events) {
            return new Response(JSON.stringify({ error: "Failed to fetch disaster data." }), { status: 500 });
        }

        // Filter disasters and return the latest 10, sorted by most recent date
        const latestDisasters = sortDisastersByDate(data.events).slice(0, 10);

        // Fetch location details (county, city, state, country)
        const detailedDisasters = [];
        let i = 0; 
        for (const disaster of latestDisasters) {
            const locationData = await getLocationDetails(disaster.LATITUDE, disaster.LONGITUDE);
            detailedDisasters.push({ ...disaster, ...locationData });
            await delay(1000); // Wait 1 second before next request
            console.log(i++);
        }

        console.log("Fetching Disasters from NASA API - Done")

        return new Response(JSON.stringify(detailedDisasters), { status: 200 });
    } catch (error) {
        console.error("NASA API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

/**
 * Sort disasters by most recent date (latest disaster first)
 */
function sortDisastersByDate(events) {
    return events
        .map(event => {
            const coords = event.geometry[0]?.coordinates;
            const dateTime = event.geometry[0]?.date;
            if (!coords || !dateTime) return null;

            const [eventLon, eventLat] = coords;
            return {
                DISASTER_NAME: event.title,
                DISASTER_TYPE: event.categories.map(cat => cat.title).join(", "),
                LATITUDE: eventLat,
                LONGITUDE: eventLon,
                DATE_TIME: new Date(dateTime).toISOString(),
            };
        })
        .filter(event => event) // Filter out any null results
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // Sort by most recent date
}

// Fetch county, city, state, country, and zipcode using Nominatim API
async function getLocationDetails(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();

        if (!data.address) return {};

        return {
            county: data.address.county || null,
            city: data.address.city || data.address.town || data.address.village || null,
            state: data.address.state || null,
            country: data.address.country || null,
        };
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return {};
    }
}

// Wait for a given number of milliseconds
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}