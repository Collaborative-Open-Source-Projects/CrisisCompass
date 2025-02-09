import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { phone, message } = await req.json();

        if (!phone || !message) {
            return NextResponse.json({ error: "Phone and message are required" }, { status: 400 });
        }

        const apiKey = process.env.WHATSAPP_API_KEY;

        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to send message" }, { status: response.status });
        }

        return NextResponse.json({ success: true, message: "Message sent successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}