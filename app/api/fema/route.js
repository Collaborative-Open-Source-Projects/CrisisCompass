import { NextRequest, NextResponse } from "next/server";

/** 
 * @param {NextRequest} request
 * @returns {NextResponse} 
 */ 
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;

    const longitude = searchParams.get('longitude');
    const latitude = searchParams.get('latitude');

    const locationDetails = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${latitude}&longitude=${longitude}&censusYear=2020&showall=false&format=json`);

    const listOfDisasters = await fetch(`https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=incidentEndDate%20eq%20null%20and%20fipsStateCode%20eq%20%27${locationDetails["State"]["FIPS"]}%27%20and%20fipsCountyCode%20eq%20%27${locationDetails["County"]["FIPS"].substring(2)}%27&$orderby=incidentBeginDate%20desc`);

    return NextResponse.json({ listOfDisasters }, { status: 200 });
}