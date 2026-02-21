"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Settings as SettingsIcon, User, Book, MapPin, Sparkles, CreditCard, Shield, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const boards = ["Punjab Board", "Federal Board", "Sindh Board", "KPK Board", "Balochistan Board", "Cambridge O/A Level", "Matric", "FSc / FA"];
const grades = ["Grade 9", "Grade 10", "Grade 11 (1st Year)", "Grade 12 (2nd Year)", "O-Levels", "A-Levels"];

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        board: "Punjab Board",
        grade: "Grade 10",
        plan: "Free",
    });

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setProfile((prev) => ({
                    ...prev,
                    name: data.user?.user_metadata?.full_name || "",
                    email: data.user?.email || "",
                }));
            }
        });
    }, [supabase.auth]);

    const handleUpdate = () => {
        setLoading(true);
        // In real app, we would update profiles table in Supabase
        setTimeout(() => {
            setLoading(false);
            toast.success("Preferences updated successfully!");
        }, 800);
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <SettingsIcon size={24} color="var(--text-secondary)" /> Settings
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Manage your profile and study preferences</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* PROFILE SECTION */}
                <div className="glass-card" style={{ padding: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: 800 }}>
                            {profile.name[0] || "S"}
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: "1.2rem" }}>{profile.name || "Student"}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{profile.email}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <span className={profile.plan === "Pro" ? "badge-pro" : "badge-free"}>{profile.plan} Plan</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Study Board</label>
                            <div style={{ position: "relative" }}>
                                <MapPin size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <select
                                    value={profile.board}
                                    onChange={(e) => setProfile({ ...profile, board: e.target.value })}
                                    className="input-field"
                                    style={{ paddingLeft: "2.5rem" }}
                                >
                                    {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Grade / Level</label>
                            <div style={{ position: "relative" }}>
                                <Book size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                                <select
                                    value={profile.grade}
                                    onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                                    className="input-field"
                                    style={{ paddingLeft: "2.5rem" }}
                                >
                                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ marginTop: "2rem", width: "100%", justifyContent: "center" }}>
                        {loading ? "Saving..." : "Save Preferences"}
                    </button>
                </div>

                {/* SUBSCRIPTION */}
                <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <Sparkles size={20} color="#f59e0b" />
                            <h3 style={{ fontWeight: 800 }}>Subscription</h3>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Current: <strong>Free Tier</strong></span>
                    </div>

                    <div style={{ background: "rgba(245,158,11,0.05)", borderRadius: "1rem", padding: "1.25rem", border: "1px solid rgba(245,158,11,0.1)", marginBottom: "1.5rem" }}>
                        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            You are currently on the free plan. Upgrade to <strong style={{ color: "white" }}>Pro</strong> and unlock Snap & Solve, more daily questions, and advanced math steps.
                        </p>
                    </div>

                    <button className="btn-accent" style={{ width: "100%", justifyContent: "center" }}>
                        Upgrade to Pro — Rs. 299/month
                    </button>
                </div>

                {/* SECURITY & HELP */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                        { icon: <Shield size={18} />, title: "Privacy & Security", desc: "Terms and conditions", href: "/dashboard/settings/privacy" },
                        { icon: <CreditCard size={18} />, title: "Billing History", desc: "View invoices", href: "/dashboard/settings/billing" },
                    ].map(item => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="glass"
                            style={{
                                padding: "1.25rem",
                                borderRadius: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                textDecoration: "none",
                                color: "inherit"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <div style={{ color: "var(--text-secondary)" }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{item.title}</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{item.desc}</div>
                            </div>
                            <ChevronRight size={16} color="var(--text-secondary)" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
