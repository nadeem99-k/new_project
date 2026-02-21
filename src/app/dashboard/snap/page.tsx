"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Camera, Upload, Loader2, Sparkles, Image as ImageIcon, X, Brain } from "lucide-react";
import toast from "react-hot-toast";

export default function SnapPage() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setAnswer("");
            };
            reader.readAsDataURL(file);
        }
    };

    const solveImage = async () => {
        if (!image) return;
        setLoading(true);
        setAnswer("");

        try {
            // Note: In a real app, we'd send the base64 to our API
            const res = await fetch("/api/snap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAnswer(data.answer);
        } catch (err: any) {
            toast.error(err.message || "Failed to analyze image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-responsive" style={{ minHeight: "100vh" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Camera size={24} color="#34d399" /> Snap & Solve
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Take a photo of any question to get an instant explanation</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: image ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr", gap: "1.5rem" }}>
                {/* UPLOAD SECTION */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {!image ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="glass-card"
                            style={{
                                height: 280,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1rem",
                                cursor: "pointer",
                                border: "2px dashed rgba(255,255,255,0.1)",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#34d399")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        >
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                                <Upload size={28} />
                            </div>
                            <div style={{ textAlign: "center", padding: "0 1rem" }}>
                                <div style={{ fontWeight: 700 }}>Upload or Take Photo</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Supports JPG, PNG</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ position: "relative" }}>
                            <img
                                src={image}
                                alt="Question"
                                style={{ width: "100%", borderRadius: "1rem", border: "1px solid var(--border)", display: "block" }}
                            />
                            <button
                                onClick={() => { setImage(null); setAnswer(""); }}
                                style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    {image && !answer && !loading && (
                        <button onClick={solveImage} className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #10b981, #059669)" }}>
                            <Sparkles size={18} /> Solve This Question
                        </button>
                    )}

                    {image && (answer || loading) && (
                        <button onClick={() => { setImage(null); setAnswer(""); }} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                            Upload Another Photo
                        </button>
                    )}
                </div>

                {/* ANSWER SECTION */}
                {(answer || loading) && (
                    <div className="glass-card animate-slide-up" style={{ padding: "1.25rem", minHeight: 250 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#34d399", fontWeight: 700 }}>
                            <Brain size={18} />
                            AI Explanation
                        </div>

                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", gap: "1rem" }}>
                                <Loader2 size={32} className="animate-spin" color="#34d399" />
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>Analyzing image & solving...</p>
                            </div>
                        ) : (
                            <div className="prose-ai" style={{ fontSize: "0.88rem" }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!image && (
                <div style={{ marginTop: "4rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-secondary)" }}>How it works</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: <ImageIcon size={20} />, text: "Take a clear photo of one question" },
                            { icon: <Sparkles size={20} />, text: "AI extracts text and images" },
                            { icon: <Brain size={20} />, text: "Get step-by-step logic and answer" },
                        ].map((step, i) => (
                            <div key={i} style={{ display: "flex", gap: "0.75rem" }}>
                                <div style={{ color: "#34d399" }}>{step.icon}</div>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
