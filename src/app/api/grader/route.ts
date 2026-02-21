import { NextRequest, NextResponse } from "next/server";
import { generateAIContent, buildGradingPrompt } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { question, answer, subject } = await req.json();

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and Answer are required" }, { status: 400 });
        }

        const prompt = buildGradingPrompt(question, answer, subject || "General Studies");
        const rawResponse = await generateAIContent(prompt);

        // Clean potential markdown code blocks
        const jsonString = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return NextResponse.json(JSON.parse(jsonString));
        } catch (e) {
            console.error("Failed to parse grading JSON:", e);
            return NextResponse.json({
                score: "N/A",
                strengths: ["Internal error parsing response"],
                weaknesses: [],
                improvement_tips: "Please try again later.",
                model_answer_snippet: ""
            });
        }
    } catch (error: any) {
        console.error("Grader API error:", error);
        return NextResponse.json({ error: "Failed to grade answer" }, { status: 500 });
    }
}
