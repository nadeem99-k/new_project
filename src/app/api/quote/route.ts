import { NextResponse } from "next/server";
import { generateQuote } from "@/lib/ai";

export async function GET() {
    try {
        const quote = await generateQuote();
        return NextResponse.json({ quote });
    } catch (error) {
        return NextResponse.json({ quote: "The future belongs to those who prepare for it today. - StudyAI" });
    }
}
