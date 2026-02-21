"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Sparkles, Loader2, Copy, Check, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function SummarizerPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [copied, setCopied] = useState(false);

    const summarize = async () => {
        if (!text.trim() || text.length < 50) {
            toast.error("Please paste at least 50 characters of text");
            return;
        }
        setLoading(true);
        setSummary("");

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSummary(data.summary);
        } catch (err: any) {
            toast.error(err.message || "Failed to summarize text");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard!");
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <FileText size={24} color="#f472b6" /> Chapter Summarizer
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Paste your textbook chapter or notes to get a concise summary and key points</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: summary ? "1fr 1fr" : "1fr", gap: "2rem" }}>
                {/* INPUT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="glass-card" style={{ padding: "1.25rem" }}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your chapter text, essay, or study notes here..."
                            className="input-field"
                            style={{ minHeight: 400, resize: "none", fontSize: "0.95rem", background: "transparent", border: "none", padding: 0 }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{text.length} characters</span>
                            <button
                                onClick={summarize}
                                disabled={loading || text.length < 50}
                                className="btn-primary"
                                style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)", padding: "0.6rem 1.5rem" }}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin-slow" /> : <Sparkles size={16} />}
                                {loading ? "Summarizing..." : "Summarize"}
                            </button>
                        </div>
                    </div>

                    {!summary && !loading && (
                        <div style={{ padding: "1rem", background: "rgba(244,114,182,0.1)", borderRadius: "0.75rem", display: "flex", gap: "0.75rem", border: "1px solid rgba(244,114,182,0.2)" }}>
                            <Info size={18} color="#f472b6" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Pro tip: Paste long chapters! AI will extract definitions, formulas, and main concepts automatically.
                            </p>
                        </div>
                    )}
                </div>

                {/* OUTPUT */}
                {(summary || loading) && (
                    <div className="glass-card animate-slide-up" style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f472b6", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Sparkles size={16} /> Summary Results
                            </div>
                            {summary && (
                                <button onClick={copyToClipboard} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                                    <span style={{ fontSize: "0.75rem" }}>{copied ? "Copied" : "Copy"}</span>
                                </button>
                            )}
                        </div>

                        <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", maxHeight: 500 }}>
                            {loading ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
                                    <Loader2 size={32} className="animate-spin-slow" color="#f472b6" />
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Distilling key information...</p>
                                </div>
                            ) : (
                                <div className="prose-ai">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
