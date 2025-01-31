import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/geminiInit";

/** 
 * @param {NextRequest} request
 * @returns {NextResponse} 
 */ 
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;

    const county = searchParams.get('county');

    let response = await run(county);
    response = await JSON.parse(response.replace('json', '').replaceAll('```', '').trim());

    console.log(response);

    return NextResponse.json({ response }, { status: 200 });
}