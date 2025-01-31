import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching disaster data based on latitude/longitude.
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const longitude = searchParams.get('longitude');
  const latitude = searchParams.get('latitude');

  // Fetch location details from FCC API
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
  const fipsState = locationDetails?.State?.FIPS;
  const countyFIPS = locationDetails?.County?.FIPS;

  if (!fipsState || !countyFIPS) {
    return NextResponse.json(
      { error: "Missing FIPS code data in location details", locationDetails },
      { status: 500 }
    );
  }

  // FEMA expects the county code without the leading digits (typically first two digits)
  const countyCode = countyFIPS.substring(2);

  // Build FEMA API URL (ensure that your query string matches FEMA's expected format)
  const femaURL = `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=incidentEndDate eq null and fipsStateCode eq '${fipsState}' and fipsCountyCode eq '${countyCode}'&$orderby=incidentBeginDate desc`;

  // Fetch disaster data from FEMA API
  const femaRes = await fetch(femaURL);
  if (!femaRes.ok) {
    const errorText = await femaRes.text();
    return NextResponse.json(
      { error: "Failed to fetch disaster data", details: errorText },
      { status: 500 }
    );
  }

  let listOfDisasters;
  try {
    listOfDisasters = await femaRes.json();
  } catch (err) {
    const text = await femaRes.text();
    return NextResponse.json(
      { error: "Invalid JSON response from FEMA", text },
      { status: 500 }
    );
  }

  // Filter the disaster data to only include records from the past 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (listOfDisasters.DisasterDeclarationsSummaries) {
    listOfDisasters.DisasterDeclarationsSummaries = listOfDisasters.DisasterDeclarationsSummaries.filter(
      disaster => new Date(disaster.declarationDate) >= sixMonthsAgo
    );
  }

  return NextResponse.json({ ...listOfDisasters }, { status: 200 });
}
