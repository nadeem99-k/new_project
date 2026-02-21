"use client";
import { CreditCard, Download, ExternalLink, Calendar, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";

export default function BillingHistoryPage() {
    const invoices = [
        { id: "INV-2026-001", date: "Feb 21, 2026", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
        { id: "INV-2026-002", date: "Jan 21, 2026", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
        { id: "INV-2025-012", date: "Dec 21, 2025", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
    ];

    return (
        <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem" }}>
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
                    <CreditCard size={28} color="#f59e0b" /> Billing History
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    View and download your past subscription invoices
                </p>
            </div>

            <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Invoice</th>
                            <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                            <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount</th>
                            <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                            <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, i) => (
                            <tr
                                key={inv.id}
                                className="animate-fade-in"
                                style={{
                                    borderBottom: i === invoices.length - 1 ? "none" : "1px solid var(--border)",
                                    transition: "background 0.2s",
                                    animationDelay: `${i * 0.1}s`
                                }}
                            >
                                <td style={{ padding: "1.25rem 1.5rem" }}>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inv.id}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{inv.type}</div>
                                </td>
                                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem" }}>{inv.date}</td>
                                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", fontWeight: 700, color: "#818cf8" }}>{inv.amount}</td>
                                <td style={{ padding: "1.25rem 1.5rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.6rem",
                                        borderRadius: "99px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        background: "rgba(52,211,153,0.1)",
                                        color: "#34d399",
                                        textTransform: "uppercase"
                                    }}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                                    <button
                                        title="Download PDF"
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "0.5rem",
                                            padding: "0.5rem",
                                            color: "var(--text-secondary)",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                                    >
                                        <Download size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <Receipt size={14} /> Need more detailed records? <Link href="#" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Contact Billing Support</Link>
                </p>
            </div>
        </div>
    );
}
