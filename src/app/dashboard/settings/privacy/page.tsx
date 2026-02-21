"use client";
import { Shield, Lock, FileText, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    const sections = [
        {
            icon: <Lock size={20} color="#818cf8" />,
            title: "Data Protection",
            content: "Your data is encrypted and stored securely using industry-standard protocols. We do not sell your personal information to third parties."
        },
        {
            icon: <Eye size={20} color="#34d399" />,
            title: "Privacy Policy",
            content: "We only collect information necessary to provide you with the best AI tutoring experience. This includes your name, email, and study preferences."
        },
        {
            icon: <Shield size={20} color="#f59e0b" />,
            title: "Security Measures",
            content: "We use multi-factor authentication and regular security audits to ensure your account remains safe from unauthorized access."
        },
        {
            icon: <FileText size={20} color="#f472b6" />,
            title: "Terms of Service",
            content: "By using StudyAI, you agree to our terms of service. Our service is intended for educational purposes and should be used responsibly."
        }
    ];

    return (
        <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <Link
                    href="/dashboard/settings"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                    <ArrowLeft size={16} /> Back to Settings
                </Link>
                <h1 style={{ fontWeight: 800, fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Shield size={28} color="#818cf8" /> Privacy & Security
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    How we protect your data and privacy at StudyAI
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {sections.map((section, i) => (
                    <div
                        key={section.title}
                        className="glass-card animate-slide-up"
                        style={{ padding: "1.75rem", animationDelay: `${i * 0.1}s` }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: "0.75rem",
                                background: "rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {section.icon}
                            </div>
                            <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{section.title}</h2>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>

            <div
                className="glass"
                style={{
                    marginTop: "3rem",
                    padding: "1.5rem",
                    borderRadius: "1rem",
                    textAlign: "center",
                    border: "1px solid var(--border)"
                }}
            >
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Have questions about your privacy? Contact our support team at <strong style={{ color: "white" }}>privacy@studyai.pk</strong>
                </p>
            </div>
        </div>
    );
}
