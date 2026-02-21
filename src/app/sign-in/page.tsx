"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Brain, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success("Welcome back! 🎓");
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Sign in failed");
        } finally {
            setLoading(false);
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
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Welcome Back! 👋</div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Sign in to continue learning</p>
                    </div>

                    <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: "2.5rem" }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input type={showPass ? "text" : "password"} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "0.9rem", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Sign Up Free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
