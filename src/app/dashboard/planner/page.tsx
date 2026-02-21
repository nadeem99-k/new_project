"use client";
import { useState } from "react";
import { Calendar, Sparkles, Send, RefreshCw, Clock, Coffee, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PlanResponse {
    summary: string;
    schedule: { day: string; task: string; time: string }[];
    ramadan_tips: string;
}

export default function PlannerPage() {
    const [examDate, setExamDate] = useState("");
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("O-Level");
    const [topics, setTopics] = useState("");
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<PlanResponse | null>(null);

    const handlePlan = async () => {
        if (!examDate || !subject) return;
        setLoading(true);
        try {
            const res = await fetch("/api/planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ examDate, subject, level, topics }),
            });
            const data = await res.json();
            setPlan(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", minHeight: "90vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ width: 45, height: 45, borderRadius: "12px", background: "#6366f122", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
                    <Calendar size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Smart Exam Planner</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Your AI-powered roadmap to exam success</p>
                </div>
            </div>

            {!plan ? (
                <div className="glass-card animate-slide-up" style={{ padding: "2rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Exam Date</label>
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", outline: "none" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Level</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", outline: "none" }}
                            >
                                <option value="Matric">Matric</option>
                                <option value="FSc">FSc</option>
                                <option value="O-Level">O-Level</option>
                                <option value="A-Level">A-Level</option>
                                <option value="University">University</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Subject</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Physics, Pak Studies..."
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", outline: "none" }}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>Weak Topics (Optional)</label>
                        <textarea
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            placeholder="List topics you find difficult..."
                            style={{ width: "100%", height: 80, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", fontSize: "0.95rem", outline: "none", resize: "none" }}
                        />
                    </div>

                    <button
                        onClick={handlePlan}
                        disabled={loading || !examDate || !subject.trim()}
                        className="btn-accent"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "#6366f1", border: "none" }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? "Planning Your Success..." : "Generate Study Plan"}
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "4px solid #6366f1" }}>
                        <h3 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Strategy Overview</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>{plan.summary}</p>
                    </div>

                    <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                        <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Calendar size={18} color="#6366f1" />
                            <span style={{ fontWeight: 700 }}>Your Personalized Schedule</span>
                        </div>
                        {plan.schedule.map((item, i) => (
                            <div key={i} style={{ padding: "1.25rem", borderBottom: i === plan.schedule.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#6366f1", textTransform: "uppercase", width: 60, flexShrink: 0 }}>{item.day}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{item.task}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                        <Clock size={14} /> {item.time}
                                    </div>
                                </div>
                                <CheckCircle2 size={18} color="rgba(255,255,255,0.1)" />
                            </div>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: "1.5rem", background: "linear-gradient(135deg, rgba(4, 120, 87, 0.1), rgba(251, 191, 36, 0.05))", border: "1px solid rgba(251, 191, 36, 0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--ramadan-gold)" }}>
                            <Coffee size={20} />
                            <span style={{ fontWeight: 800 }}>Ramadan Prep Tip</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{plan.ramadan_tips}</p>
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={() => setPlan(null)} className="glass-card" style={{ flex: 1, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontWeight: 700 }}>
                            <RefreshCw size={18} /> New Plan
                        </button>
                        <button className="btn-accent" style={{ flex: 1, background: "#6366f1", border: "none" }}>
                            Save to Calendar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
