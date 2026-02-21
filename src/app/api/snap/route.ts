import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        // Extract base64 data
        const base64Data = image.split(",")[1];

        const prompt = `You are an expert AI tutor. 
1. Look at this image of a student's question.
2. If it's a math problem, physics derivation, or any specific academic question, extract it.
3. Provide a step-by-step explanation and the final answer.
4. Keep the explanation simple enough for a student to understand.
5. Use markdown for clear formatting.`;

        const text = await generateAIContent(prompt, base64Data);

        // Save to history (non-blocking)
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("history").insert({
                    user_id: user.id,
                    type: "snap",
                    question: "[Image Question]",
                    answer: text,
                });
            }
        } catch (err) {
            console.error("Failed to save history:", err);
        }

        return NextResponse.json({ answer: text });
    } catch (error: any) {
        console.error("Snap API Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze image. Ensure your API key is correct and wait a moment." },
            { status: 500 }
        );
    }
}
