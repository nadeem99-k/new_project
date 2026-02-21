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
 * Generate content using Groq (Fastest & Free)
 */
async function generateGroqContent(prompt: string, imageBase64?: string) {
    if (!process.env.GROQ_API_KEY) throw new Error("Groq API key missing");

    const model = imageBase64 ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";

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
 */
export async function generateAIContent(prompt: string, base64Data?: string, mimeType: string = "image/jpeg") {
    // 1. Try Groq first (it's much faster) - Note: Groq currently best for images, not large PDFs
    // If it's a PDF, we should probably skip Groq as it doesn't handle PDF multi-modal as well as Gemini yet
    if (mimeType !== "application/pdf") {
        try {
            console.log("[AI] Trying Groq...");
            return await generateGroqContent(prompt, base64Data);
        } catch (error: any) {
            console.warn(`[AI] Groq failed: ${error.message}. Falling back to Gemini...`);
        }
    }

    // 2. Try Gemini with key rotation
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
    language: string = "English"
) {
    const isUrdu = language.toLowerCase().includes("urdu");

    return `You are an expert AI tutor for students in Pakistan following the ${board} curriculum.
Your goal is to help the student understand the core concept of the following ${subject} question.

Student's Question:
"${question}"

Instructions:
1. Identify the core topic and concept being tested.
2. Provide a step-by-step solution. Break down complex steps into simpler, manageable parts.
3. Use ${language} for the entire response.
${isUrdu ? "- If using Urdu script, ensure it's clear. If using Roman Urdu, keep it natural." : ""}
4. Formatting: Use bold text for key terms and markdown tables/lists for clarity.
5. If it's a math/science problem, include a 'Pro Tip' or 'Exam Tip' section at the end.
6. Friendly Tone: Act like a supportive teacher (use phrases like "Don't worry," "Here's the trick," etc.).

Remember: Don't just give the answer; teach the student how to solve similar problems!`;
}
