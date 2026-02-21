import { NextRequest, NextResponse } from "next/server";
import { generateFlashcards } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { content, count } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const data = await generateFlashcards(content, count || 10);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Flashcards API error:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}
