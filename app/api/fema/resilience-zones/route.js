import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/geminiInit";

/** 
 * @param {NextRequest} request
 * @returns {NextResponse} 
 */ 
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;

    const longitude = searchParams.get('longitude');
    const latitude = searchParams.get('latitude');

    const locURL = `https://geo.fcc.gov/api/census/block/find?latitude=${latitude}&longitude=${longitude}&censusYear=2020&showall=false&format=json`;
    const locRes = await fetch(locURL);
  
    if (!locRes.ok) {
      const errorText = await locRes.text();
      return NextResponse.json(
        { error: "Failed to fetch location details", details: errorText },
        { status: 500 }
      );
    }
  
    const locationDetails = await locRes.json();

    // Extract FIPS codes from the location details
    const stateName = locationDetails?.State?.name;
    const countyName = locationDetails?.County?.name;

    if (!stateName || !countyName) {
        return NextResponse.json(
        [],
        { status: 200 }
        );
    }

    let response = await run(`${countyName}, ${stateName}`);
    response = await JSON.parse(response.replace('json', '').replaceAll('```', '').trim());

    console.log(response);

    return NextResponse.json(response, { status: 200 });
}