"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calculator, Send, Loader2, BookOpen, Clock, Sparkles } from "lucide-react";

export default function MathSolverPage() {
    const [problem, setProblem] = useState("");
    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState("");

    const solveMath = async () => {
        if (!problem.trim() || loading) return;
        setLoading(true);
        setSolution("");

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: `Solve this math problem with clear steps: ${problem}`,
                    subject: "Mathematics",
                    board: "General",
                    language: "English"
                }),
            });
            const data = await res.json();
            setSolution(data.answer);
        } catch (err) {
            setSolution("Failed to solve the problem. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Calculator size={24} color="#f59e0b" /> Math Solver
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Get detailed steps for any mathematical equation or problem</p>
            </div>

            <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.75rem" }}>
                        Enter your problem
                    </label>
                    <textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="e.g. Solve 2x + 5 = 15 or differentiate sin(x) * cos(x)"
                        className="input-field"
                        style={{ minHeight: 120, resize: "vertical", fontSize: "1rem" }}
                    />
                </div>
                <button
                    onClick={solveMath}
                    disabled={loading || !problem.trim()}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                    {loading ? <Loader2 size={20} className="animate-spin-slow" /> : <Sparkles size={18} />}
                    {loading ? "Solving..." : "Solve Instantly"}
                </button>
            </div>

            {solution && (
                <div className="glass-card animate-slide-up" style={{ padding: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "#f59e0b", fontWeight: 700 }}>
                        <BookOpen size={18} />
                        Step-by-Step Solution
                    </div>
                    <div className="prose-ai">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{solution}</ReactMarkdown>
                    </div>
                </div>
            )}

            {!solution && !loading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", opacity: 0.7 }}>
                    {[
                        { title: "Algebra", icon: <Calculator size={16} /> },
                        { title: "Calculus", icon: <Calculator size={16} /> },
                        { title: "Geometry", icon: <Calculator size={16} /> },
                        { title: "Statistics", icon: <Calculator size={16} /> },
                    ].map(cat => (
                        <div key={cat.title} className="glass" style={{ padding: "1rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
                            {cat.icon} {cat.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
