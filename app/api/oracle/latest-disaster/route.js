export async function GET() {
    try {
        // Fetch the latest disaster from Oracle APEX
        const response = await fetch("https://apex.oracle.com/pls/apex/hackathonsid/disaster/latestRecord");

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Failed to fetch latest disaster: ${response.statusText}` }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();

        // Return the latest disaster data
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching latest disaster:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
