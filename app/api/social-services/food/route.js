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

    let foodServices;

    let run = 0;
    
    do {
        if (run >= 10) {
            break;
        }
        foodServices = await fetch(`https://api.geoapify.com/v2/places?categories=service.social_facility.food&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${process.env.PLACE_API}`);
        if (!foodServices.ok) {
            const errorText = await foodServices.text();
            return NextResponse.json(
                { error: "Failed to fetch social food services details", details: errorText },
                { status: 500 }
            );
        }
        foodServices = await foodServices.json();
        radius *= 2;
        run++;
    } while(!foodServices.features.length && radius < 50000);

    console.debug(run);

    if (!foodServices.features.length) {
        return NextResponse.json(
            { message: `Failed to any social food services till ${Math.floor(radius / 1000)} km` },
            { status: 404 }
        );
    }

    return NextResponse.json(foodServices, { status: 200 });
}