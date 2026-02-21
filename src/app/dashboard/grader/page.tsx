"use client";
import { useState } from "react";
import { TrendingUp, Sparkles, Send, RefreshCw, CheckCircle2, AlertCircle, Bookmark } from "lucide-react";
import Link from "next/link";

interface GradeResponse {
    score: string;
    strengths: string[];
    weaknesses: string[];
    improvement_tips: string;
    model_answer_snippet: string;
}

export default function GraderPage() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [subject, setSubject] = useState("English");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GradeResponse | null>(null);

    const handleGrade = async () => {
        if (!question.trim() || !answer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/grader", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, answer, subject }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", minHeight: "90vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ width: 45, height: 45, borderRadius: "12px", background: "#10b98122", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>AI Essay Grader</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Get instant exam scores and improvement tips</p>
                </div>
            </div>

            {!result ? (
                <div className="glass-card animate-slide-up" style={{ padding: "2rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Subject</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", outline: "none" }}
                        >
                            <option value="English">English</option>
                            <option value="History">History</option>
                            <option value="Science">Science</option>
                            <option value="Islamic Studies">Islamic Studies</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>The Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Paste the exam question here..."
                            style={{ width: "100%", height: 80, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", fontSize: "0.95rem", outline: "none", resize: "none" }}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Your Answer</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type or paste your answer here..."
                            style={{ width: "100%", minHeight: 250, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", fontSize: "0.95rem", outline: "none", resize: "vertical" }}
                        />
                    </div>

                    <button
                        onClick={handleGrade}
                        disabled={loading || !question.trim() || !answer.trim()}
                        className="btn-accent"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "#10b981", border: "none" }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? "Grading..." : "Submit for Grading"}
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* SCORE HEADER */}
                    <div className="glass-card" style={{ padding: "2rem", textAlign: "center", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.05))", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        <p style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "2px", color: "#10b981", fontWeight: 800, marginBottom: "0.5rem" }}>Estimated Grade</p>
                        <h2 style={{ fontSize: "4rem", fontWeight: 900, color: "white", margin: 0 }}>{result.score}</h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                        {/* STRENGTHS */}
                        <div className="glass-card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#34d399" }}>
                                <CheckCircle2 size={20} />
                                <span style={{ fontWeight: 700 }}>Strengths</span>
                            </div>
                            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {result.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>

                        {/* WEAKNESSES */}
                        <div className="glass-card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#f87171" }}>
                                <AlertCircle size={20} />
                                <span style={{ fontWeight: 700 }}>Areas for Revision</span>
                            </div>
                            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {result.weaknesses.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* TIPS & MODEL */}
                    <div className="glass-card" style={{ padding: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#f59e0b" }}>
                            <Sparkles size={20} />
                            <span style={{ fontWeight: 700 }}>Pro Exam Tips</span>
                        </div>
                        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "2rem" }}>
                            {result.improvement_tips}
                        </p>

                        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--ramadan-gold)" }}>
                                <Bookmark size={18} />
                                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Perfect Answer Snippet</span>
                            </div>
                            <p style={{ fontSize: "0.9rem", fontStyle: "italic", lineHeight: 1.6 }}>
                                "{result.model_answer_snippet}..."
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setResult(null)}
                        className="glass-card"
                        style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontWeight: 700 }}
                    >
                        <RefreshCw size={18} /> Grade Another Answer
                    </button>
                    <Link href="/dashboard" style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
                        Back to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}
