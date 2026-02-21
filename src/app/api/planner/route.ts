import { NextRequest, NextResponse } from "next/server";
import { generateAIContent, buildPlannerPrompt } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { examDate, subject, level, topics } = await req.json();

        if (!examDate || !subject) {
            return NextResponse.json({ error: "Exam Date and Subject are required" }, { status: 400 });
        }

        const prompt = buildPlannerPrompt(examDate, subject, level, topics);
        const rawResponse = await generateAIContent(prompt);

        const jsonString = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return NextResponse.json(JSON.parse(jsonString));
        } catch (e) {
            console.error("Failed to parse planner JSON:", e);
            return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Planner API error:", error);
        return NextResponse.json({ error: "Failed to plan schedule" }, { status: 500 });
    }
}
