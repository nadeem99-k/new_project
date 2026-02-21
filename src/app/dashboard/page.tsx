"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Brain,
    Camera,
    Calculator,
    FileText,
    HelpCircle,
    MessageSquare,
    Sparkles,
    TrendingUp,
    Zap,
    Calendar,
    Share2,
    FileSearch,
    Clock
} from "lucide-react";

const featureCategories = [
    {
        name: "Solve & Ask",
        items: [
            { href: "/dashboard/ask", icon: <MessageSquare size={20} />, label: "Ask AI", desc: "Type any question", color: "#818cf8" },
            { href: "/dashboard/snap", icon: <Camera size={20} />, label: "Snap & Solve", desc: "Photo of question", color: "#10b981" },
            { href: "/dashboard/math", icon: <Calculator size={20} />, label: "Math Solver", desc: "Step-by-step help", color: "#f59e0b" },
        ]
    },
    {
        name: "Study Tools",
        items: [
            { href: "/dashboard/flashcards", icon: <Brain size={20} />, label: "Flashcards", desc: "Memorize fast", color: "#8b5cf6" },
            { href: "/dashboard/quiz", icon: <Sparkles size={20} />, label: "AI Quiz", desc: "Test yourself", color: "#ec4899" },
            { href: "/dashboard/summarize", icon: <FileText size={20} />, label: "Summarizer", desc: "Shorten long text", color: "#3b82f6" },
            { href: "/dashboard/mindmap", icon: <Share2 size={20} />, label: "Mindmap", desc: "Visual study", color: "#06b6d4" },
            { href: "/dashboard/pdf-tutor", icon: <FileSearch size={20} />, label: "PDF Tutor", desc: "Chat with PDFs", color: "#f43f5e" },
        ]
    },
    {
        name: "Planning & Grading",
        items: [
            { href: "/dashboard/planner", icon: <Calendar size={20} />, label: "Exam Planner", desc: "Study schedule", color: "#6366f1" },
            { href: "/dashboard/grader", icon: <TrendingUp size={20} />, label: "Essay Grader", desc: "Get exam scores", color: "#10b981" },
        ]
    }
];

const tips = [
    "📸 Try Snap & Solve — just take a photo of your textbook question!",
    "🧮 The Math Solver shows every step so you actually learn.",
    "🎴 Flashcards are proven to improve memory retention by 40%.",
    "📝 Use the Summarizer before exams to quickly review chapters.",
    "🌙 Ramadan study tip: Study right after Sehri when your mind is fresh!",
    "🎯 Practice with the Quiz Generator to test yourself.",
];

export default function DashboardHome() {
    const [userName, setUserName] = useState("Student");
    const [tip, setTip] = useState(tips[0]); // stable default for SSR
    const [greeting, setGreeting] = useState("Good Morning"); // stable default for SSR
    const [quote, setQuote] = useState("Loading your daily motivation...");
    const supabase = createClient();

    useEffect(() => {
        // Run client-only logic after mount to avoid hydration mismatch
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening");

        supabase.auth.getUser().then(({ data }) => {
            const name = data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] || "Student";
            setUserName(name);
        });

        fetch("/api/quote")
            .then(res => res.json())
            .then(data => setQuote(data.quote))
            .catch(() => setQuote("The future belongs to those who prepare for it today. - StudyAI"));
    }, [supabase.auth]);

    return (
        <div className="ramadan-pattern container-responsive" style={{ minHeight: "100vh" }}>
            {/* GREETING */}
            <div className="animate-slide-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Brain size={24} color="white" />
                    </div>
                    <div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{greeting} 👋</p>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{userName}</h1>
                    </div>
                </div>
            </div>

            {/* QUOTE OF THE DAY */}
            <div className="glass-card animate-slide-up" style={{ padding: "1.25rem", marginBottom: "2rem", borderLeft: "4px solid var(--ramadan-gold)", background: "rgba(255, 215, 0, 0.05)", animationDelay: "0.05s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Sparkles size={16} color="var(--ramadan-gold)" />
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--ramadan-gold)" }}>Quote of the day</span>
                </div>
                <p style={{ fontSize: "1rem", fontStyle: "italic", fontWeight: 600, color: "white", lineHeight: 1.4 }}>"{quote}"</p>
            </div>

            {/* TIP BANNER */}
            <div className="glass-card animate-slide-up" style={{ padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem", animationDelay: "0.1s" }}>
                <Zap size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{tip}</p>
            </div>

            {/* STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
                {[
                    { label: "Questions Today", value: "0 / 5", icon: <MessageSquare size={18} />, color: "#818cf8" },
                    { label: "Total Solved", value: "0", icon: <TrendingUp size={18} />, color: "#34d399" },
                    { label: "Current Plan", value: "Free", icon: <Clock size={18} />, color: "#f59e0b" },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card animate-slide-up" style={{ padding: "1rem" }}>
                        <div style={{ color: stat.color, marginBottom: "0.5rem" }}>{stat.icon}</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* QUICK ACTIONS CATEGORIZED */}
            {featureCategories.map((category, catIdx) => (
                <div key={category.name} style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Sparkles size={16} color="var(--ramadan-gold)" />
                        {category.name}
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
                        {category.items.map((action, i) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="glass-card animate-slide-up"
                                style={{
                                    padding: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.85rem",
                                    textDecoration: "none",
                                    color: "inherit",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    animationDelay: `${(catIdx * 0.1) + (i * 0.05)}s`,
                                    border: `1px solid rgba(255,255,255,0.05)`,
                                }}
                                onMouseEnter={(e) => {
                                    if (window.innerWidth > 768) {
                                        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                                        (e.currentTarget as HTMLElement).style.borderColor = `${action.color}44`;
                                        (e.currentTarget as HTMLElement).style.background = `${action.color}08`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                                    (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                                }}
                            >
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "10px",
                                    background: `${action.color}15`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: action.color,
                                    flexShrink: 0
                                }}>
                                    {action.icon}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* STUDY ANALYTICS */}
            <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>Weekly Progress</h2>
                <div className="glass-card animate-slide-up" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 120, padding: "0 0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        {[
                            { day: "M", val: 40 },
                            { day: "T", val: 65 },
                            { day: "W", val: 30 },
                            { day: "T", val: 85 },
                            { day: "F", val: 50 },
                            { day: "S", val: 95 },
                            { day: "S", val: 0 },
                        ].map((d, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", width: "10%" }}>
                                <div style={{
                                    width: "100%",
                                    height: `${d.val}%`,
                                    background: d.val > 70 ? "var(--ramadan-gold)" : "linear-gradient(to top, #4f46e5, #818cf8)",
                                    borderRadius: "3px 3px 0 0",
                                    transition: "height 1s ease-out"
                                }}></div>
                                <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", fontWeight: 600 }}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", gap: "0.5rem" }}>
                        <div>
                            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#34d399" }}>85%</div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>Accuracy</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#818cf8" }}>12h</div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>Study Time</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ramadan-gold)" }}>🔥 5</div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* UPGRADE BANNER */}
            <div
                className="glass-card"
                style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))",
                    border: "1px solid rgba(79,70,229,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1.25rem",
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Sparkles size={18} color="#f59e0b" /> Upgrade to Pro
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                        Unlimited questions, Snap & Solve + more
                    </div>
                </div>
                <Link href="/dashboard/settings" className="btn-accent" style={{ whiteSpace: "nowrap", width: "100%", justifyContent: "center", maxWidth: "200px" }}>
                    Get Pro — Rs.299/mo
                </Link>
            </div>

            {/* RAMADAN FOCUS TIMER */}
            <div className="glass-card animate-slide-up" style={{
                marginTop: "2.5rem",
                marginBottom: "2rem",
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(4, 120, 87, 0.2), rgba(251, 191, 36, 0.1))",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                animationDelay: "0.2s"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Zap size={18} color="var(--ramadan-gold)" />
                        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--ramadan-gold)" }}>Ramadan Focus Mode</span>
                    </div>
                    <div style={{ fontSize: "0.65rem", background: "rgba(251, 191, 36, 0.2)", padding: "0.2rem 0.6rem", borderRadius: "20px", color: "var(--ramadan-gold)", fontWeight: 700 }}>
                        ACTIVE
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ textAlign: "center", padding: "0.75rem", borderRadius: "10px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "1px" }}>Time until Iftar</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>04:12:45</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "0.75rem", borderRadius: "10px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "1px" }}>Best Study Window</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ramadan-gold)" }}>After Sehri</div>
                    </div>
                </div>

                <div style={{ fontSize: "0.75rem", fontStyle: "italic", textAlign: "center", color: "rgba(255,255,255,0.8)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.75rem" }}>
                    "Seeking knowledge is an obligation upon every Muslim."
                </div>
            </div>
        </div>
    );
}
