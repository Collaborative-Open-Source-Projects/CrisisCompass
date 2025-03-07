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

    let medicalAccs;

    let run = 0;
    
    do {
        if (run >= 10) {
            break;
        }
        medicalAccs = await fetch(`https://api.geoapify.com/v2/places?categories=healthcare.clinic_or_praxis.general,healthcare.hospital&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=10&apiKey=${process.env.PLACE_API}`);
        if (!medicalAccs.ok) {
            const errorText = await medicalAccs.text();
            return NextResponse.json(
                { error: "Failed to fetch medical accommodations details", details: errorText },
                { status: 500 }
            );
        }
        medicalAccs = await medicalAccs.json();
        radius *= 2;
        run++;
    } while(!medicalAccs.features.length && radius < 50000);

    console.debug(run);

    if (!medicalAccs.features.length) {
        return NextResponse.json(
            { message: `Failed to any medical accommodations till ${Math.floor(radius / 1000)} km` },
            { status: 404 }
        );
    }

    return NextResponse.json(medicalAccs, { status: 200 });
}