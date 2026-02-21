"use client";
import { useState, useEffect, useRef } from "react";
import { Brain, Sparkles, Download, RefreshCw, Maximize2, GitBranch, ZoomIn, ZoomOut, Search } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MindMapPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [chartCode, setChartCode] = useState("");
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [mermaidLoaded, setMermaidLoaded] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        // Load Mermaid via CDN
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
        script.async = true;
        script.onload = () => {
            (window as any).mermaid.initialize({
                startOnLoad: true,
                theme: "dark",
                securityLevel: "loose",
                fontFamily: "Outfit, Inter, sans-serif"
            });
            setMermaidLoaded(true);
        };
        document.body.appendChild(script);
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, []);

    useEffect(() => {
        if (chartCode && mermaidRef.current && mermaidLoaded) {
            mermaidRef.current.removeAttribute("data-processed");
            (window as any).mermaid.contentLoaded();
            setZoom(1); // Reset zoom on new generation
        }
    }, [chartCode, mermaidLoaded]);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/mindmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            const data = await res.json();
            if (data.code) {
                setChartCode(data.code);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to generate mind map");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!mermaidRef.current) return;
        const svg = mermaidRef.current.querySelector("svg");
        if (!svg) {
            toast.error("Nothing to export yet!");
            return;
        }

        try {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                if (ctx) {
                    ctx.fillStyle = "#0f172a";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.scale(2, 2);
                    ctx.drawImage(img, 0, 0);
                }

                URL.revokeObjectURL(url);
                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `mindmap-${topic.replace(/\s+/g, "-").toLowerCase()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                toast.success("Mindmap exported as PNG!");
            };
            img.src = url;
        } catch (err) {
            console.error("Export error:", err);
            toast.error("Failed to export image");
        }
    };

    return (
        <div className="container-responsive" style={{ minHeight: "90vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: 45, height: 45, borderRadius: "12px", background: "#f59e0b22", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", flexShrink: 0 }}>
                    <GitBranch size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>AI Mind Mapper</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Visualize complex topics and connections</p>
                </div>
            </div>

            {!chartCode ? (
                <div className="glass-card animate-slide-up" style={{ padding: "1.5rem", textAlign: "center" }}>
                    <div style={{ maxWidth: 500, margin: "0 auto" }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f59e0b11", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#f59e0b" }}>
                            <Brain size={32} />
                        </div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>What topic are we mapping?</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Enter a subject or complex concept.</p>

                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexDirection: "column" }}>
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder="e.g. Parts of the Human Heart"
                                className="input-field"
                                style={{ width: "100%" }}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !topic.trim()}
                                className="btn-accent"
                                style={{ background: "#f59e0b", padding: "0.85rem 1.5rem", width: "100%", justifyContent: "center" }}
                            >
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : <><Sparkles size={20} /> Generate Map</>}
                            </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                            {["Cell Structure", "Newton's Laws", "Pak Studies"].map(t => (
                                <button key={t} onClick={() => setTopic(t)} style={{ background: "rgba(255,255,255,0.05)", border: "none", padding: "0.3rem 0.6rem", borderRadius: "15px", fontSize: "0.7rem", cursor: "pointer", color: "var(--text-secondary)" }}>{t}</button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                        <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>Map: {topic}</h3>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "2px" }}>
                                <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} style={{ background: "none", border: "none", color: "white", padding: "0.4rem", cursor: "pointer", display: "flex", alignItems: "center" }} title="Zoom Out">
                                    <ZoomOut size={16} />
                                </button>
                                <button onClick={() => setZoom(1)} style={{ background: "none", border: "none", color: "var(--ramadan-gold)", padding: "0 0.4rem", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}>
                                    {Math.round(zoom * 100)}%
                                </button>
                                <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} style={{ background: "none", border: "none", color: "white", padding: "0.4rem", cursor: "pointer", display: "flex", alignItems: "center" }} title="Zoom In">
                                    <ZoomIn size={16} />
                                </button>
                            </div>
                            <button onClick={() => setChartCode("")} className="glass-card" style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <RefreshCw size={14} /> Reset
                            </button>
                            <button onClick={handleDownload} className="btn-accent" style={{ background: "var(--ramadan-gold)", border: "none", padding: "0.4rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "black" }}>
                                <Download size={14} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: "0", overflow: "hidden", background: "rgba(0,0,0,0.2)", minHeight: 450, position: "relative" }}>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "all 0.2s ease-out",
                                transform: `scale(${zoom})`,
                                padding: "2rem",
                                minHeight: 450
                            }}
                        >
                            <div ref={mermaidRef} className="mermaid">
                                {chartCode}
                            </div>
                        </div>

                        {/* Custom Map Control Overlay Hint */}
                        <div style={{ position: "absolute", bottom: "1rem", right: "1rem", pointerEvents: "none", opacity: 0.6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "var(--text-secondary)", background: "rgba(0,0,0,0.4)", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>
                                <Search size={12} /> Interactive View
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ marginTop: "1.5rem", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Maximize2 size={20} color="var(--ramadan-gold)" />
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            **Pro Tip:** Visual maps help you retain information 3x faster than text notes. Use zoom to focus on specific branches.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
