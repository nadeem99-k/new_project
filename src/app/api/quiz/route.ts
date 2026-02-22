import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { topic, userProfile } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Student context
        const boardInfo = userProfile?.board ? `following the ${userProfile.board} curriculum` : "";
        const gradeInfo = userProfile?.grade ? `for ${userProfile.grade} level` : "";
        const nameInfo = userProfile?.name ? `Personalize it for a student named ${userProfile.name}.` : "";

        const prompt = `Generate a 5-question multiple choice quiz on the topic: "${topic}" ${boardInfo} ${gradeInfo}.
${nameInfo}
Output ONLY a valid JSON array of objects with this structure:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": number, (0-3 index)
    "explanation": "string explaining why the answer is correct"
  }
]
Focus on checking conceptual understanding. Ensure the JSON is valid.`;

        let text = await generateAIContent(prompt);

        // Clean up markdown code blocks if AI includes them
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const questions = JSON.parse(text);

        // Save to history (non-blocking)
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from("history").insert({
                    user_id: user.id,
                    type: "quiz",
                    question: topic,
                    answer: `Generated a quiz with ${questions.length} questions.`,
                    metadata: { topic, questionCount: questions.length }
                });
            }
        } catch (err) {
            console.error("Failed to save history:", err);
        }

        return NextResponse.json({ questions });
    } catch (error: any) {
        console.error("Quiz API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz. Try a more specific topic." },
            { status: 500 }
        );
    }
}
