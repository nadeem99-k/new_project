"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { History, Brain, MessageSquare, Camera, ChevronRight, Calendar, Loader2, Search } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/history")
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                if (data.history) setHistory(data.history);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    const filteredHistory = history.filter(h =>
        h.question?.toLowerCase().includes(search.toLowerCase()) ||
        h.answer?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ fontWeight: 800, fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <History size={28} color="#818cf8" /> Study History
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
                        Review your past questions and explanations
                    </p>
                </div>

                <div className="glass" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", width: "100%", maxWidth: 300 }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ background: "none", border: "none", color: "white", outline: "none", width: "100%", fontSize: "0.9rem" }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
                    <Loader2 size={40} className="animate-spin-slow" color="#818cf8" />
                    <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading history...</p>
                </div>
            ) : error ? (
                <div className="glass-card" style={{ padding: "3rem 2rem", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#f87171" }}>Database Sync Issue</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                        We couldn't sync your history. Please ensure the 'history' table is created in your Supabase project.
                    </p>
                    <button onClick={() => window.location.reload()} className="glass-card" style={{ padding: "0.6rem 1.25rem", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Retry Sync
                    </button>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <MessageSquare size={48} color="var(--text-secondary)" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                    <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No history found</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
                        {search ? "No matches for your search." : "Start asking questions to see them here!"}
                    </p>
                    {!search && (
                        <Link href="/dashboard/ask" className="btn-primary">
                            Ask Your First Question
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {filteredHistory.map((item, i) => (
                        <div
                            key={item.id}
                            className="glass-card animate-slide-up"
                            style={{ padding: "1.5rem", animationDelay: `${i * 0.05}s` }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "0.5rem",
                                        background: item.type === "snap" ? "rgba(52,211,153,0.1)" : "rgba(129,140,248,0.1)",
                                        color: item.type === "snap" ? "#34d399" : "#818cf8",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {item.type === "snap" ? <Camera size={16} /> : <MessageSquare size={16} />}
                                    </div>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "capitalize" }}>
                                        {item.type === "snap" ? "Snap & Solve" : "AI Q&A"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                                    <Calendar size={14} />
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                                {item.question}
                            </h3>

                            <div className="prose-ai" style={{
                                fontSize: "0.9rem",
                                color: "var(--text-secondary)",
                                maxHeight: 150,
                                overflow: "hidden",
                                position: "relative",
                                marginBottom: "1rem",
                                WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                                maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
                            }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
                            </div>

                            <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#818cf8", fontWeight: 600, fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                View Full Explanation <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
