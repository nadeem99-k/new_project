"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import {
    Brain,
    LayoutDashboard,
    MessageSquare,
    Camera,
    Calculator,
    FileText,
    HelpCircle,
    Settings,
    LogOut,
    Sparkles,
    History,
    Calendar,
    TrendingUp,
    Share2,
    FileSearch,
    Menu,
    X,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Home" },
    { href: "/dashboard/history", icon: <History size={18} />, label: "History" },
    { href: "/dashboard/ask", icon: <MessageSquare size={18} />, label: "Ask AI" },
    { href: "/dashboard/snap", icon: <Camera size={18} />, label: "Snap & Solve" },
    { href: "/dashboard/math", icon: <Calculator size={18} />, label: "Math Solver" },
    { href: "/dashboard/summarize", icon: <FileText size={18} />, label: "Summarize" },
    { href: "/dashboard/quiz", icon: <Sparkles size={18} />, label: "AI Quiz" },
    { href: "/dashboard/planner", icon: <Calendar size={18} />, label: "Exam Planner" },
    { href: "/dashboard/grader", icon: <TrendingUp size={18} />, label: "Essay Grader" },
    { href: "/dashboard/flashcards", icon: <Brain size={18} />, label: "Flashcards" },
    { href: "/dashboard/mindmap", icon: <Share2 size={18} />, label: "Mindmap" },
    { href: "/dashboard/pdf-tutor", icon: <FileSearch size={18} />, label: "PDF Tutor" },
    { href: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    async function handleSignOut() {
        await supabase.auth.signOut();
        toast.success("Signed out!");
        router.push("/");
        router.refresh();
    }

    // Toggle body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add("mobile-drawer-open");
        } else {
            document.body.classList.remove("mobile-drawer-open");
        }
    }, [isMenuOpen]);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-dark)" }}>
            {/* SIDEBAR — Desktop */}
            <aside
                className="hide-mobile"
                style={{
                    width: 230,
                    minHeight: "100vh",
                    background: "var(--bg-card)",
                    borderRight: "1px solid var(--border)",
                    flexDirection: "column",
                    padding: "1.5rem 1rem",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 50,
                }}
            >
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2.5rem", padding: "0 0.5rem" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "0.6rem", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Brain size={18} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                        Study<span className="gradient-text">AI</span>
                    </span>
                </div>

                {/* Nav */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Pro badge */}
                <div
                    className="glass-card"
                    style={{ padding: "1rem", marginBottom: "1rem", textAlign: "center" }}
                >
                    <Sparkles size={20} color="#f59e0b" style={{ margin: "0 auto 0.5rem" }} />
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                        Upgrade to Pro
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                        Unlimited questions + Snap & Solve
                    </div>
                    <Link href="/dashboard/settings" className="btn-accent" style={{ fontSize: "0.78rem", padding: "0.4rem 0.9rem", justifyContent: "center", width: "100%" }}>
                        Upgrade — Rs.299/mo
                    </Link>
                </div>

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1rem", borderRadius: "0.75rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500, transition: "all 0.2s", width: "100%" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </aside>

            {/* MOBILE TOP HEADER */}
            <header
                className="show-mobile"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    background: "rgba(10, 10, 26, 0.95)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1.25rem",
                    zIndex: 100
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "0.5rem", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Brain size={18} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>Study<span className="gradient-text">AI</span></span>
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* MAIN CONTENT */}
            <main style={{ flex: 1, paddingBottom: 100, minHeight: "100vh" }} className="responsive-main">
                {children}
            </main>

            {/* MOBILE TOOL DRAWER */}
            {isMenuOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(8px)",
                        zIndex: 150,
                        display: "flex",
                        flexDirection: "column",
                        padding: "2rem 1.5rem",
                        animation: "fade-in 0.3s ease-out"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <span style={{ fontWeight: 800, fontSize: "1.2rem" }}>All <span className="gradient-text">Tools</span></span>
                        <button onClick={() => setIsMenuOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "0.5rem", borderRadius: "50%" }}>
                            <HelpCircle size={24} style={{ transform: "rotate(45deg)" }} />
                        </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", overflowY: "auto", paddingBottom: "2rem" }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "1.5rem 1rem",
                                    background: pathname === item.href ? "rgba(79, 70, 229, 0.2)" : "rgba(255,255,255,0.05)",
                                    borderRadius: "1rem",
                                    border: pathname === item.href ? "1px solid rgba(79, 70, 229, 0.4)" : "1px solid rgba(255,255,255,0.1)",
                                    color: pathname === item.href ? "#818cf8" : "white",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    transition: "all 0.2s"
                                }}
                            >
                                <div style={{ color: pathname === item.href ? "#818cf8" : "var(--text-secondary)" }}>
                                    {item.icon}
                                </div>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="btn-secondary"
                        style={{ marginTop: "auto", justifyContent: "center", padding: "1rem" }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            )}

            {/* BOTTOM NAV — Mobile */}
            <nav
                className="show-mobile"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(17, 17, 40, 0.9)",
                    backdropFilter: "blur(12px)",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "0.6rem 0.2rem calc(0.6rem + env(safe-area-inset-bottom))",
                    zIndex: 100,
                }}
            >
                {navItems.slice(0, 4).map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.25rem",
                            color: pathname === item.href ? "#818cf8" : "var(--text-secondary)",
                            textDecoration: "none",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            padding: "0.3rem 0.5rem",
                            minWidth: "60px"
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.25rem",
                        color: isMenuOpen ? "#818cf8" : "var(--text-secondary)",
                        background: "none",
                        border: "none",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "0.3rem 0.5rem",
                        cursor: "pointer",
                        minWidth: "60px"
                    }}
                >
                    <LayoutDashboard size={18} />
                    More
                </button>
            </nav>

            <style>{`
        @media (min-width: 769px) {
          .responsive-main { margin-left: 230px !important; }
        }
        @media (max-width: 768px) {
          .responsive-main { 
            margin-left: 0 !important; 
            padding-top: 60px !important;
          }
        }
      `}</style>
        </div>
    );
}
