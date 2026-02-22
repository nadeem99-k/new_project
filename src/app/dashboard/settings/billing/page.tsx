"use client";
import { CreditCard, Download, ExternalLink, Calendar, ArrowLeft, Receipt, Upload, CheckCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function BillingHistoryPage() {
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const invoices = [
        { id: "INV-2026-001", date: "Feb 21, 2026", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
        { id: "INV-2026-002", date: "Jan 21, 2026", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
        { id: "INV-2025-012", date: "Dec 21, 2025", amount: "Rs. 299", status: "Paid", type: "Pro Plan Subscription" },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
                toast.success("Screenshot attached!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmPayment = () => {
        if (!screenshot) return toast.error("Please upload a screenshot first.");
        setIsUploading(true);
        // Simulate API call
        setTimeout(() => {
            setIsUploading(false);
            setScreenshot(null);
            toast.success("Payment proof submitted! We will verify it within 24 hours.");
        }, 2000);
    };

    return (
        <div className="container-responsive" style={{ maxWidth: 800 }}>
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
                <h1 style={{ fontWeight: 800, fontSize: "clamp(1.5rem, 6vw, 1.75rem)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <CreditCard size={28} color="#f59e0b" /> Billing & Payment
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    Manage your payment methods and view past invoices
                </p>
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Receipt size={18} color="#f59e0b" /> 1. Send Payment (JazzCash)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                    <div style={{ background: "rgba(245, 158, 11, 0.05)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.25rem", textTransform: "uppercase", fontWeight: 700 }}>Account Number</div>
                        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#f59e0b" }}>03139183850</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.25rem", textTransform: "uppercase", fontWeight: 700 }}>Account Name</div>
                        <div style={{ fontWeight: 700, fontSize: "1rem" }}>HAMEER ALI KALHORO</div>
                    </div>
                </div>
            </div>

            {/* CONFIRM PAYMENT SECTION */}
            <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem", border: "1px solid rgba(79, 70, 229, 0.3)" }}>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle size={18} color="var(--primary-light)" /> 2. Confirm Payment
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        After sending <b>Rs. 299</b> to the JazzCash account above, please upload a screenshot of your transaction receipt for verification.
                    </p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    {!screenshot ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-secondary"
                            style={{ width: "100%", justifyContent: "center", borderStyle: "dashed", height: "80px", flexDirection: "column", gap: "0.5rem" }}
                        >
                            <Upload size={20} />
                            <span style={{ fontSize: "0.85rem" }}>Upload Transaction Screenshot</span>
                        </button>
                    ) : (
                        <div style={{ position: "relative", width: "100%", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--border)" }}>
                            <img src={screenshot} alt="Payment Receipt" style={{ width: "100%", height: "auto", display: "block" }} />
                            <button
                                onClick={() => setScreenshot(null)}
                                style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(0,0,0,0.5)", border: "none", color: "white", padding: "0.4rem", borderRadius: "50%", cursor: "pointer" }}
                            >
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleConfirmPayment}
                        disabled={!screenshot || isUploading}
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", opacity: (!screenshot || isUploading) ? 0.6 : 1 }}
                    >
                        {isUploading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : "Submit for Verification"}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>Invoice History</h3>
            </div>

            {/* Desktop Table View */}
            <div className="glass-card hide-mobile" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
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
                                            className="invoice-btn"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "0.5rem",
                                                padding: "0.5rem",
                                                color: "var(--text-secondary)",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="show-mobile" style={{ flexDirection: "column", gap: "1rem" }}>
                {invoices.map((inv) => (
                    <div key={inv.id} className="glass-card" style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>{inv.id}</div>
                                <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: "0.2rem" }}>{inv.type}</div>
                            </div>
                            <span style={{
                                padding: "0.2rem 0.6rem",
                                borderRadius: "99px",
                                fontSize: "0.65rem",
                                fontWeight: 800,
                                background: "rgba(52,211,153,0.1)",
                                color: "#34d399",
                                textTransform: "uppercase"
                            }}>
                                {inv.status}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{inv.date}</div>
                                <div style={{ fontWeight: 800, color: "#818cf8", fontSize: "1.1rem" }}>{inv.amount}</div>
                            </div>
                            <button className="btn-secondary" style={{ padding: "0.5rem 0.75rem" }}>
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Receipt size={14} /> Need more detailed records? <Link href="#" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}>Contact Billing Support</Link>
                </p>
            </div>

            <style jsx>{`
                .invoice-btn:hover {
                    background: var(--primary) !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
}
