import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const prompt = `Summarize the following educational text/chapter for a student.
Format the output with these sections:
### 📝 Overview
A 2-3 sentence summary of the whole text.

### 🔑 Key Points
Bullet list of the most important concepts.

### 💡 Important Terms
List of key terms and their definitions found in the text.

### ❓ Possible Exam Questions
3-5 questions that could be asked based on this material.

Text:
${text}`;

        const summary = await generateAIContent(prompt);

        // Save to history (non-blocking)
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("history").insert({
                    user_id: user.id,
                    type: "summarize",
                    question: text.substring(0, 100) + "...",
                    answer: summary,
                });
            }
        } catch (err) {
            console.error("Failed to save history:", err);
        }

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error("Summarize API Error:", error);
        return NextResponse.json(
            { error: "Failed to summarize. Text might be too long or contains filtered content." },
            { status: 500 }
        );
    }
}
