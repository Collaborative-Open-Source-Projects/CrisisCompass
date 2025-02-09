import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching data based on latitude/longitude.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const longitude = searchParams.get('longitude');
    const latitude = searchParams.get('latitude');
    // should be in meters, should be greater than 1000
    let radius = parseInt(searchParams.get('radius')) || 1000;

    let publicTransports;

    let run = 0;
    
    do {
        if (run >= 10) {
            break;
        }
        publicTransports = await fetch(`https://api.geoapify.com/v2/places?categories=public_transport&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=10&apiKey=${process.env.PLACE_API_KEY}`);
        if (!publicTransports.ok) {
            const errorText = await publicTransports.text();
            return NextResponse.json(
                { error: "Failed to fetch public transportation details", details: errorText },
                { status: 500 }
            );
        }
        publicTransports = await publicTransports.json();
        radius *= 2;
        run++;
    } while(!publicTransports.features.length && radius < 50000);

    console.debug(run);

    if (!publicTransports.features.length) {
        return NextResponse.json(
            { message: `Failed to any public transportation till ${Math.floor(radius / 1000)} km` },
            { status: 404 }
        );
    }

    return NextResponse.json(publicTransports, { status: 200 });
}