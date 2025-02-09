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
    // should be in meters, should be greater than 5000
    let radius = parseInt(searchParams.get('radius')) || 5000;

    let shelterServices;

    let run = 0;
    
    do {
        if (run >= 10) {
            break;
        }
        shelterServices = await fetch(`https://api.geoapify.com/v2/places?categories=service.social_facility.shelter&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=10&apiKey=${process.env.PLACE_API_KEY}`);
        if (!shelterServices.ok) {
            const errorText = await shelterServices.text();
            return NextResponse.json(
                { error: "Failed to fetch social shelter services details", details: errorText },
                { status: 500 }
            );
        }
        shelterServices = await shelterServices.json();
        radius *= 2;
        run++;
    } while(!shelterServices.features.length && radius < 50000);

    console.debug(run);

    if (!shelterServices.features.length) {
        return NextResponse.json(
            { message: `Failed to any social shelter services till ${Math.floor(radius / 1000)} km` },
            { status: 404 }
        );
    }

    return NextResponse.json(shelterServices, { status: 200 });
}