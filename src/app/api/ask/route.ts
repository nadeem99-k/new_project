import { NextResponse } from "next/server";
import { generateAIContent, buildTutorPrompt } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { question, subject, board, language, userProfile } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const prompt = buildTutorPrompt(question, subject, board, language, userProfile);
        const text = await generateAIContent(prompt, undefined, "image/jpeg", subject || "");

        // Save to history (non-blocking)
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("history").insert({
                    user_id: user.id,
                    type: "ask",
                    question: question,
                    answer: text,
                    metadata: { subject, board, language }
                });
            }
        } catch (err) {
            console.error("Failed to save history:", err);
        }

        return NextResponse.json({ answer: text });
    } catch (error: any) {
        console.error("Orbit API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate answer. Please check your API key." },
            { status: 500 }
        );
    }
}
