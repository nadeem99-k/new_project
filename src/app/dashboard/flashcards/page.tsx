"use client";
import { useState } from "react";
import { Brain, Sparkles, ChevronLeft, ChevronRight, RefreshCw, Plus } from "lucide-react";
import Link from "next/link";

interface Flashcard {
    front: string;
    back: string;
}

export default function FlashcardsPage() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async () => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, count: 10 }),
            });
            const data = await res.json();
            if (data.flashcards) {
                setFlashcards(data.flashcards);
                setCurrentIndex(0);
                setIsFlipped(false);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 150);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto", minHeight: "90vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ width: 45, height: 45, borderRadius: "12px", background: "#8b5cf622", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                    <Brain size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>AI Flashcard Generator</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Turn your notes into study decks instantly</p>
                </div>
            </div>

            {flashcards.length === 0 ? (
                <div className="glass-card animate-slide-up" style={{ padding: "2rem" }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your notes, a chapter summary, or textbook text here..."
                        style={{
                            width: "100%",
                            minHeight: 200,
                            padding: "1rem",
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "inherit",
                            fontSize: "0.95rem",
                            marginBottom: "1.5rem",
                            outline: "none",
                            resize: "vertical"
                        }}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !content.trim()}
                        className="btn-accent"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? "Magic in progress..." : "Generate Study Deck"}
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <p style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                            Card {currentIndex + 1} of {flashcards.length}
                        </p>
                        <button
                            onClick={() => setFlashcards([])}
                            style={{ background: "none", border: "none", color: "#8b5cf6", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                            <Plus size={16} /> New Set
                        </button>
                    </div>

                    {/* FLASHCARD CONTAINER */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{
                            perspective: "1000px",
                            cursor: "pointer",
                            height: 350,
                            marginBottom: "2rem"
                        }}
                    >
                        <div style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}>
                            {/* FRONT */}
                            <div className="glass-card" style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "2rem",
                                fontSize: "1.2rem",
                                fontWeight: 700,
                                border: "2px solid rgba(139, 92, 246, 0.3)",
                            }}>
                                {flashcards[currentIndex].front}
                            </div>

                            {/* BACK */}
                            <div className="glass-card" style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "2rem",
                                fontSize: "1.1rem",
                                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(79, 70, 229, 0.1))",
                                border: "2px solid rgba(139, 92, 246, 0.5)",
                            }}>
                                {flashcards[currentIndex].back}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center" }}>
                        <button onClick={prevCard} className="glass-card" style={{ width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextCard} className="btn-accent" style={{ padding: "0 2.5rem", height: 60, borderRadius: "30px" }}>
                            Next Card
                        </button>
                        <button onClick={nextCard} className="glass-card" style={{ width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
