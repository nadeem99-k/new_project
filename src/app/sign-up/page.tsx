"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Brain, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("Please fill all fields");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } },
            });
            if (signUpError) throw signUpError;

            // Auto sign-in immediately so no email confirmation is needed
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) throw signInError;

            toast.success("Account created! Welcome to StudyAI 🎉");
            router.push("/dashboard");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to create account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                background: "var(--bg-dark)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* BG orbs */}
            <div style={{ position: "absolute", top: "10%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
                {/* Logo */}
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
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                            Create Account <Sparkles size={20} style={{ display: "inline", color: "#f59e0b" }} />
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            Join thousands of students learning smarter
                        </p>
                    </div>

                    <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Full Name</label>
                            <div style={{ position: "relative" }}>
                                <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: "100%", justifyContent: "center", padding: "0.9rem", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Creating Account..." : "Create Free Account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Already have an account?{" "}
                        <Link href="/sign-in" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
