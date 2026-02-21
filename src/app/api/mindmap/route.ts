import { NextRequest, NextResponse } from "next/server";
import { generateAIContent, buildMindMapPrompt } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const prompt = buildMindMapPrompt(topic);
        const mermaidCode = await generateAIContent(prompt);

        // Clean potential markdown blocks
        const cleanedCode = mermaidCode.replace(/```mermaid/g, "").replace(/```/g, "").trim();

        return NextResponse.json({ code: cleanedCode });
    } catch (error: any) {
        console.error("Mindmap API error:", error);
        return NextResponse.json({ error: "Failed to generate mind map" }, { status: 500 });
    }
}
