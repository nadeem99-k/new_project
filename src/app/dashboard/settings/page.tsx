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
        school: "",
        location: "",
        bio: "",
        profilePic: null as string | null,
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, profilePic: reader.result as string });
                toast.success("Profile picture updated!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = () => {
        setLoading(true);
        // In real app, we would update profiles table in Supabase
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully!");
        }, 800);
    };

    return (
        <div className="container-responsive" style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "clamp(1.2rem, 5vw, 1.5rem)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <SettingsIcon size={24} color="var(--text-secondary)" /> Settings
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Manage your profile and study preferences</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* PROFILE SECTION */}
                <div className="glass-card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
                        <div style={{ position: "relative", cursor: "pointer" }}>
                            <div
                                onClick={() => document.getElementById("profile-upload")?.click()}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "1.8rem",
                                    fontWeight: 800,
                                    overflow: "hidden",
                                    border: "3px solid rgba(255,255,255,0.1)"
                                }}
                            >
                                {profile.profilePic ? (
                                    <img src={profile.profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    profile.name[0] || "S"
                                )}
                            </div>
                            <div
                                style={{ position: "absolute", bottom: 0, right: 0, background: "#818cf8", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-dark)" }}
                                onClick={() => document.getElementById("profile-upload")?.click()}
                            >
                                <Sparkles size={12} color="white" />
                            </div>
                            <input
                                id="profile-upload"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <div style={{ marginBottom: "0.5rem" }}>
                                <input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="Your Name"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        borderBottom: "1px solid transparent",
                                        color: "white",
                                        fontSize: "1.2rem",
                                        fontWeight: 800,
                                        width: "100%",
                                        outline: "none",
                                        padding: "2px 0"
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = "#818cf8"}
                                    onBlur={(e) => e.target.style.borderBottomColor = "transparent"}
                                />
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{profile.email}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <span className={profile.plan === "Pro" ? "badge-pro" : "badge-free"}>{profile.plan} Plan</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>School Name</label>
                            <input
                                value={profile.school}
                                onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                placeholder="Enter school/college"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Location / City</label>
                            <input
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                placeholder="City or area"
                                className="input-field"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Student Details / Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell AI about your interests, dream career, or study goals..."
                                className="input-field"
                                style={{ height: "80px", resize: "none", paddingTop: "0.75rem" }}
                            />
                        </div>
                    </div>

                    <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ marginTop: "2rem", width: "100%", justifyContent: "center" }}>
                        {loading ? "Saving..." : "Save Profile Details"}
                    </button>
                </div>

                {/* SUBSCRIPTION */}
                <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
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

                    <Link href="/dashboard/settings/billing" style={{ textDecoration: "none" }}>
                        <button className="btn-accent" style={{ width: "100%", justifyContent: "center" }}>
                            Upgrade to Pro — Rs. 299/month
                        </button>
                    </Link>
                </div>

                {/* SECURITY & HELP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
