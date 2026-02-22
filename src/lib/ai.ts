import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// --- Gemini Configuration ---
const GEMINI_KEYS = (process.env.GEMINI_API_KEY || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

let currentGeminiIndex = 0;

// --- Groq Configuration ---
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || "",
    baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Auto-select the best Groq model based on subject
 * - CS/Coding      → qwen-2.5-coder-32b       (specialized code model)
 * - Math/Science   → deepseek-r1-distill-llama-70b (reasoning model)
 * - General        → llama-3.3-70b-versatile   (best all-rounder)
 */
export function getModelForSubject(subject: string): string {
    const s = subject.toLowerCase();

    // Coding / CS subjects
    if (
        s.includes("computer") || s.includes("programming") || s.includes("coding") ||
        s.includes("cs") || s.includes("ict") || s.includes("software") ||
        s.includes("algorithm") || s.includes("database") || s.includes("web dev")
    ) {
        console.log(`[AI] Subject "${subject}" → Model: qwen-2.5-coder-32b 💻`);
        return "qwen-2.5-coder-32b";
    }

    // Math & hard science — needs strong reasoning
    if (
        s.includes("math") || s.includes("maths") || s.includes("mathematics") ||
        s.includes("calculus") || s.includes("algebra") || s.includes("physics") ||
        s.includes("chemistry") || s.includes("chem") || s.includes("statistics") ||
        s.includes("trigonometry")
    ) {
        console.log(`[AI] Subject "${subject}" → Model: deepseek-r1-distill-llama-70b ⚛️`);
        return "deepseek-r1-distill-llama-70b";
    }

    // Default: best general-purpose model
    console.log(`[AI] Subject "${subject}" → Model: llama-3.3-70b-versatile 📚`);
    return "llama-3.3-70b-versatile";
}

/**
 * Generate content using Groq (Fastest & Free)
 */
async function generateGroqContent(prompt: string, imageBase64?: string, preferredModel?: string) {
    if (!process.env.GROQ_API_KEY) throw new Error("Groq API key missing");

    // Vision tasks always use a vision-capable model; otherwise use preferred or default
    const model = imageBase64
        ? "llama-3.2-11b-vision-preview"
        : (preferredModel || "llama-3.3-70b-versatile");

    const messages: any[] = [
        {
            role: "user",
            content: imageBase64
                ? [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
                : prompt
        }
    ];

    const response = await groq.chat.completions.create({
        model,
        messages,
    });

    return response.choices[0]?.message?.content || "";
}

/**
 * Generate content using Gemini (Robust Fallback)
 */
async function generateGeminiContent(prompt: string, base64Data?: string, mimeType: string = "image/jpeg") {
    if (GEMINI_KEYS.length === 0) throw new Error("Gemini API keys missing");

    const key = GEMINI_KEYS[currentGeminiIndex % GEMINI_KEYS.length];
    currentGeminiIndex++;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    if (base64Data) {
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType } },
        ]);
        return result.response.text();
    } else {
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}

/**
 * Unified generation with Groq -> Gemini Fallback
 * Pass `subject` to auto-select the best model for that subject.
 */
export async function generateAIContent(
    prompt: string,
    base64Data?: string,
    mimeType: string = "image/jpeg",
    subject: string = ""
) {
    // Auto-select the best model for this subject
    const preferredModel = subject ? getModelForSubject(subject) : "llama-3.3-70b-versatile";
    const safeModel = "llama-3.3-70b-versatile"; // Always available fallback within Groq

    // 1. Try Groq first (fastest & free)
    // Skip for PDFs — Groq doesn't handle PDF multi-modal as well as Gemini
    if (mimeType !== "application/pdf") {
        // 1a. Try the subject-optimized model
        try {
            console.log(`[AI] Trying Groq with model: ${preferredModel}...`);
            return await generateGroqContent(prompt, base64Data, preferredModel);
        } catch (error: any) {
            console.warn(`[AI] Groq (${preferredModel}) failed: ${error.message}`);
        }

        // 1b. If preferred model failed AND it's different from safe model, try safe model
        if (preferredModel !== safeModel) {
            try {
                console.log(`[AI] Groq retry with safe model: ${safeModel}...`);
                return await generateGroqContent(prompt, base64Data, safeModel);
            } catch (error: any) {
                console.warn(`[AI] Groq (${safeModel}) also failed: ${error.message}. Falling back to Gemini...`);
            }
        }
    }

    // 2. Last resort: Gemini with key rotation
    let lastError = new Error("Generation failed");
    for (let i = 0; i < Math.max(GEMINI_KEYS.length, 1); i++) {
        try {
            console.log(`[AI] Gemini Fallback Attempt ${i + 1}...`);
            return await generateGeminiContent(prompt, base64Data, mimeType);
        } catch (gemError: any) {
            lastError = gemError;
            console.warn(`[AI] Gemini attempt ${i + 1} failed: ${gemError.message}`);
        }
    }
    throw lastError;
}

/**
 * Build a prompt for generating flashcards
 */
export function buildFlashcardPrompt(content: string, count: number = 10) {
    return `Generate ${count} high-quality study flashcards based on the following content.
Each flashcard should follow this JSON format:
{
  "flashcards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ]
}

Content to study:
"${content}"

Rules:
1. Keep the "front" concise and clear.
2. Keep the "back" informative but easy to memorize.
3. Only return the JSON object, nothing else.`;
}

/**
 * Generate Flashcards (JSON output)
 */
export async function generateFlashcards(content: string, count: number = 10) {
    const prompt = buildFlashcardPrompt(content, count);
    const rawResponse = await generateAIContent(prompt);

    // Clean potential markdown code blocks from response
    const jsonString = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse flashcards JSON:", e);
        // Minimal fallback if JSON parsing fails
        return { flashcards: [{ front: "Error generating cards", back: "Please try again with a smaller text chunk." }] };
    }
}

/**
 * Build a prompt for grading an answer
 */
export function buildGradingPrompt(question: string, studentAnswer: string, subject: string) {
    return `You are an expert examiner for ${subject}. 
Please grade the following student's answer based on professional exam rubrics.

Question: "${question}"
Student's Answer: "${studentAnswer}"

Provide your feedback in the following JSON format:
{
  "score": "X/10",
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "improvement_tips": "Specific advice to get a higher score",
  "model_answer_snippet": "A short example of how a perfect answer would start"
}

Only return the JSON object.`;
}

/**
 * Build a prompt for generating a Mind Map (Mermaid.js format)
 */
export function buildMindMapPrompt(topic: string) {
    return `Generate a comprehensive mind map for the topic: "${topic}".
Format the output as a Mermaid.js graph code (graph TD).
Ensure the nodes are clear and logically connected from the main topic to sub-topics and details.

Rules:
1. Only return the Mermaid graph code.
2. Start with "graph TD".
3. Use sensible node labels.`;
}

/**
 * Build a prompt for the Smart Exam Planner
 */
export function buildPlannerPrompt(examDate: string, subject: string, level: string, topics: string) {
    return `Generate a personalized study schedule for a student preparing for an ${subject} exam.
Exam Date: ${examDate}
Level: ${level}
Key Topics: ${topics}

Provide the schedule in the following JSON format:
{
  "summary": "Short overview of the strategy",
  "schedule": [
    { "day": "Day 1", "task": "Task description", "time": "Recommended duration" }
  ],
  "ramadan_tips": "How to adjust this during fasting"
}

Ensure the schedule is realistic and focuses on high-yield topics first. Only return JSON.`;
}

/**
 * Generate a motivational quote for students
 */
export async function generateQuote() {
    return generateAIContent("Generate a short, powerful motivational quote for a student (Matric/FSc/O-Level). Include the author or 'StudyAI'. Max 15 words.");
}

export function buildTutorPrompt(
    question: string,
    subject: string,
    board: string,
    language: string = "English",
    userProfile?: { school?: string; location?: string; bio?: string; grade?: string; name?: string }
) {
    const isUrdu = language.toLowerCase().includes("urdu");

    // Construct student background context
    let background = `curriculum for ${board}`;
    if (userProfile?.grade) background += `, ${userProfile.grade}`;
    if (userProfile?.school) background += ` at ${userProfile.school}`;
    if (userProfile?.location) background += ` in ${userProfile.location}`;

    const studentName = userProfile?.name || "dear student";
    const studentInfo = userProfile?.bio ? `\nStudent Background: ${userProfile.bio}` : "";

    // --- Subject-specific teacher persona ---
    const subjectLower = subject.toLowerCase();
    let teacherName = "Dr. StudyAI";
    let teacherSpecialty = "all subjects";
    let teacherEmoji = "📚";

    if (subjectLower.includes("computer") || subjectLower.includes("cs") || subjectLower.includes("ict") || subjectLower.includes("programming")) {
        teacherName = "Dr. Sufyan";
        teacherSpecialty = "Computer Science & Programming";
        teacherEmoji = "💻";
    } else if (subjectLower.includes("english") || subjectLower.includes("literature") || subjectLower.includes("grammar")) {
        teacherName = "Ms. Aisha";
        teacherSpecialty = "English Language & Literature";
        teacherEmoji = "✍️";
    } else if (subjectLower.includes("bio") || subjectLower.includes("biology")) {
        teacherName = "Dr. Hassan";
        teacherSpecialty = "Biology & Life Sciences";
        teacherEmoji = "🧬";
    } else if (subjectLower.includes("chem") || subjectLower.includes("chemistry")) {
        teacherName = "Dr. Zainab";
        teacherSpecialty = "Chemistry";
        teacherEmoji = "⚗️";
    } else if (subjectLower.includes("phys") || subjectLower.includes("physics")) {
        teacherName = "Prof. Usman";
        teacherSpecialty = "Physics";
        teacherEmoji = "⚛️";
    } else if (subjectLower.includes("math") || subjectLower.includes("maths") || subjectLower.includes("mathematics") || subjectLower.includes("calculus") || subjectLower.includes("algebra")) {
        teacherName = "Sir Ali";
        teacherSpecialty = "Mathematics";
        teacherEmoji = "📐";
    } else if (subjectLower.includes("urdu")) {
        teacherName = "Ustaz Tariq";
        teacherSpecialty = "Urdu Language & Literature";
        teacherEmoji = "📖";
    } else if (subjectLower.includes("pak studies") || subjectLower.includes("pakistan") || subjectLower.includes("history") || subjectLower.includes("social")) {
        teacherName = "Ms. Sana";
        teacherSpecialty = "Pakistan Studies & History";
        teacherEmoji = "🌍";
    } else if (subjectLower.includes("islamiat") || subjectLower.includes("islamic") || subjectLower.includes("quran")) {
        teacherName = "Maulana Bilal";
        teacherSpecialty = "Islamiat & Religious Studies";
        teacherEmoji = "🕌";
    } else if (subjectLower.includes("econ") || subjectLower.includes("economics") || subjectLower.includes("commerce") || subjectLower.includes("account")) {
        teacherName = "Sir Kamran";
        teacherSpecialty = "Economics & Commerce";
        teacherEmoji = "📊";
    }

    // Detect if the student is just greeting — not asking a real question
    const greetingPattern = /^(hi+|hello+|hlo+|hey+|salam|assalam|aoa|yo+|sup|greetings|good (morning|evening|afternoon|night)|howdy|what'?s up)[!?.،\s]*$/i;
    const isGreeting = greetingPattern.test(question.trim());

    if (isGreeting) {
        return `You are ${teacherName} ${teacherEmoji} — an expert ${teacherSpecialty} teacher. The student just greeted you.

Student's message: "${question}"
Student's name: ${studentName}

Respond with a SHORT, friendly, human greeting (2–4 sentences MAX). Do NOT give any lessons, tips, or structured teaching. Just:
1. Introduce yourself as ${teacherName}, their ${teacherSpecialty} teacher.
2. Greet ${studentName} warmly and tell them you're excited to help.
3. Ask ONE question: what topic in ${subject} they need help with today.

Example tone: "Hey ${studentName}! 👋 I'm ${teacherName}, your ${teacherSpecialty} teacher. So great to have you here — let's make ${subject} easy and fun! What topic shall we tackle today?"

Keep it SHORT and NATURAL — no bullet points, no headings, no long lists. Max 3–4 sentences!`;
    }

    return `You are ${teacherName} ${teacherEmoji} — a warm, expert, and highly engaging ${teacherSpecialty} teacher for students following the ${background}.${studentInfo}

Your personality:
- You are ${teacherName}, an expert in ${teacherSpecialty}. Always refer to yourself as ${teacherName}.
- You are patient, encouraging, and passionate about ${subject}.
- You celebrate the student's curiosity ("Great question!", "Excellent thinking!", "I love that you asked this!").
- You never just give the final answer — you TEACH the concept so the student can solve it independently.

Student's Question (from ${studentName}):
"${question}"

🎯 YOUR RESPONSE STRUCTURE — follow this EXACTLY:

**Step 1 — Warm Greeting & Acknowledgement**
Start with ONE short warm sentence to ${studentName}. Acknowledge their question as ${teacherName}. Example: "Great question, ${studentName}! As your ${teacherSpecialty} teacher, let me walk you through this."

**Step 2 — Core Concept Identification**
In 1–2 sentences, name the exact topic or concept this question is about in ${subject}.

**Step 3 — Step-by-Step Teaching**
Break the solution into clear, numbered steps. For each step:
- Explain WHY you are doing it, not just WHAT.
- Use **bold** for key terms.
- Use markdown tables or bullet lists where helpful.
${isUrdu ? "- Respond fully in Urdu/Roman Urdu (as chosen). Keep it natural and clear." : "- Respond fully in " + language + "."}

**Step 4 — ${teacherEmoji} Pro Tip from ${teacherName}**
Give ONE powerful exam tip or memory trick specific to ${board} and ${subject}.

**Step 5 — Follow-Up Question ❓**
End with ONE thoughtful question that makes the student think deeper about ${subject}.
- This is MANDATORY. Keep it short and directly related to what was just taught.

Remember: Your goal as ${teacherName} is to make ${studentName} SMARTER and MORE CONFIDENT in ${subject}!`;
}
