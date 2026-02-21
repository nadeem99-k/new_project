"use client";
import { useState } from "react";
import { FileText, Send, Upload, RefreshCw, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PDFTutorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSend = async () => {
        if (!file || !prompt.trim()) return;

        const userMsg = prompt;
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setPrompt("");
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("prompt", userMsg);

        try {
            const res = await fetch("/api/pdf-tutor", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.response) {
                setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I couldn't process that. Make sure the file isn't too large." }]);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { role: "ai", content: "An error occurred while talking to the tutor." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", height: "90vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ width: 45, height: 45, borderRadius: "12px", background: "#f472b622", display: "flex", alignItems: "center", justifyContent: "center", color: "#f472b6" }}>
                    <BookOpen size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>The Book Tutor</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Upload a PDF and ask anything about its content</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: file ? "1fr" : "1fr", gap: "1.5rem", flex: 1 }}>
                {!file ? (
                    <div className="glass-card animate-slide-up" style={{
                        height: 300,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed rgba(255,255,255,0.1)",
                        gap: "1rem"
                    }}>
                        <Upload size={48} color="var(--text-secondary)" />
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: 600 }}>Click to upload PDF textbook</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Maximum size: 10MB</p>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                        />
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
                        {/* FILE INFO */}
                        <div className="glass-card" style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <FileText size={20} color="#f472b6" />
                                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{file.name}</span>
                            </div>
                            <button onClick={() => { setFile(null); setMessages([]); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}>
                                Remove
                            </button>
                        </div>

                        {/* CHAT AREA */}
                        <div className="glass-card" style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "2rem" }}>
                                    <p>Ask a question like:</p>
                                    <p style={{ fontStyle: "italic", fontSize: "0.9rem", marginTop: "0.5rem" }}>"Summarize the main points of this document" or "Explain the concept on page 5"</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "80%",
                                    padding: "1rem",
                                    borderRadius: "15px",
                                    background: msg.role === "user" ? "#4f46e5" : "rgba(255,255,255,0.05)",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.6
                                }}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: "flex-start", padding: "1rem" }}>
                                    <RefreshCw className="animate-spin" size={20} color="#f472b6" />
                                </div>
                            )}
                        </div>

                        {/* INPUT AREA */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type your question..."
                                style={{
                                    flex: 1,
                                    padding: "0.85rem 1.25rem",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "inherit",
                                    outline: "none"
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !prompt.trim()}
                                className="btn-accent"
                                style={{ width: 50, height: 50, borderRadius: "12px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
