"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";
import { Brain } from "lucide-react";

export default function SignInPage() {
    const [googleLoading, setGoogleLoading] = useState(false);
    const supabase = createClient();

    async function handleGoogleSignIn() {
        setGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Google sign in failed");
            setGoogleLoading(false);
        }
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "var(--bg-dark)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "0.75rem", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Brain size={22} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "white" }}>Study<span className="gradient-text">AI</span></span>
                    </Link>
                </div>

                <div className="glass-card" style={{ padding: "2.5rem" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Welcome Back! 👋</div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Sign in to continue learning with StudyAI</p>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.75rem",
                            padding: "1rem",
                            borderRadius: "0.75rem",
                            border: "1px solid rgba(255,255,255,0.15)",
                            background: "rgba(255,255,255,0.06)",
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: googleLoading ? "not-allowed" : "pointer",
                            opacity: googleLoading ? 0.7 : 1,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!googleLoading) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    >
                        {googleLoading ? (
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.7s linear infinite" }} />
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                                <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.4 5.6-5 7.3v6h8.1c4.7-4.4 7.2-10.8 7.2-17.5z" fill="#4285F4" />
                                <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.5H2.8v6.2C6.8 42.9 14.8 48 24 48z" fill="#34A853" />
                                <path d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.8C1 17.4 0 20.6 0 24s1 6.6 2.8 9.1l8.3-4.2z" fill="#FBBC04" />
                                <path d="M24 9.5c3.3 0 6.3 1.1 8.6 3.3l6.4-6.4C35.9 2.1 30.4 0 24 0 14.8 0 6.8 5.1 2.8 12.9l8.3 6.2c1.8-5.5 6.9-9.6 12.9-9.6z" fill="#EA4335" />
                            </svg>
                        )}
                        {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        New to StudyAI?{" "}
                        <Link href="/sign-up" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Create a free account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
