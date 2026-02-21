import { NextRequest, NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const prompt = formData.get("prompt") as string;

        if (!file || !prompt) {
            return NextResponse.json({ error: "File and prompt are required" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");
        const mimeType = file.type;

        console.log(`[PDF Tutor] Processing file: ${file.name} (${mimeType})`);

        const response = await generateAIContent(
            `You are an expert tutor. I have uploaded a document. ${prompt}`,
            base64Data,
            mimeType
        );

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("PDF Tutor API error:", error);
        return NextResponse.json({ error: "Failed to process document" }, { status: 500 });
    }
}
