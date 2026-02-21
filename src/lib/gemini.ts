import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuration Pool
const GEMINI_KEYS = (process.env.GEMINI_API_KEY || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

let currentKeyIndex = 0;

/**
 * Get the next working Gemini model instance from the rotation pool.
 */
function getNextGeminiModel() {
    if (GEMINI_KEYS.length === 0) {
        throw new Error("No Gemini API keys found in GEMINI_API_KEY environment variable.");
    }

    // Rotate to next key
    const key = GEMINI_KEYS[currentKeyIndex % GEMINI_KEYS.length];
    currentKeyIndex++;

    const genAI = new GoogleGenerativeAI(key);
    // Using gemini-2.0-flash for best balance of speed, cost (free), and vision
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

/**
 * Robust content generation with automatic key rotation on failure.
 */
export async function generateOrbitContent(prompt: string, imageBase64?: string) {
    let lastError: any = null;

    // Try up to the total number of keys available
    const maxRetries = Math.max(GEMINI_KEYS.length, 3);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const model = getNextGeminiModel();
        const keySnippet = GEMINI_KEYS[(currentKeyIndex - 1) % GEMINI_KEYS.length].substring(0, 8);

        try {
            console.log(`[AI] Attempt ${attempt + 1}/${maxRetries} using Key ${keySnippet}...`);

            if (imageBase64) {
                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: "image/jpeg",
                        },
                    },
                ]);
                const text = result.response.text();
                console.log(`[AI] Success via Key ${keySnippet}`);
                return text;
            } else {
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                console.log(`[AI] Success via Key ${keySnippet}`);
                return text;
            }
        } catch (error: any) {
            lastError = error;
            const status = error.status || "Unknown";
            console.warn(`[AI] Key ${keySnippet} failed (Status: ${status}): ${error.message}`);

            // If it's a rate limit (429) or internal error (500), try next key immediately
            if (status === 429 || status === 500 || error.message?.includes("quota") || error.message?.includes("Too Many Requests")) {
                console.log("[AI] Rotating key and retrying...");
                continue;
            }

            // For other errors (like blocked content), we might want to throw immediately
            // but for robustness in "last chance", we retry anyway with next key
            console.log("[AI] Unexpected error, trying next key anyway...");
        }
    }

    console.error("[AI] All rotation attempts failed.");
    throw lastError || new Error("AI generation failed after multiple retries across all keys.");
}

/**
 * Re-exporting ORBIT_MODELS for compatibility with existing routes
 * though rotation now handles model selection internally.
 */
export const ORBIT_MODELS = {
    FLASH: "gemini-2.0-flash",
    PRO: "gemini-2.0-flash",
    LITE: "gemini-2.0-flash",
};

/**
 * Build a structured prompt for the expert tutor.
 */
export function buildTutorPrompt(
    question: string,
    subject: string,
    board: string,
    language: string = "English"
) {
    return `You are an expert AI tutor for ${board} curriculum students in Pakistan.
Subject: ${subject}
Language: Respond in ${language}. If Urdu is selected, use Roman Urdu or actual Urdu script.

Instructions:
- Explain step by step in a simple, friendly way
- Use numbered steps for multi-step solutions
- For math/science, show all workings clearly
- End with a short summary tip
- Keep it concise yet complete

Student's Question:
${question}`;
}
