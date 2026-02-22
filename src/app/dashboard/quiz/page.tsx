"use client";
import { useState, useEffect } from "react";
import { HelpCircle, Sparkles, Loader2, CheckCircle2, XCircle, Brain, RefreshCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Question = {
    question: string;
    options: string[];
    answer: number; // index of correct option
    explanation: string;
};

export default function QuizPage() {
    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await createClient().auth.getUser();
            if (user) {
                const { data } = await createClient()
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                if (data) setUserProfile(data);
            }
        };
        fetchProfile();
    }, []);

    async function generateQuiz() {
        if (!topic.trim()) return;
        setLoading(true);
        setQuestions([]);
        setScore(0);
        setCurrentIdx(0);
        setFinished(false);
        setSelectedOpt(null);

        try {
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    userProfile: userProfile ? {
                        board: userProfile.board,
                        grade: userProfile.grade,
                        name: userProfile.name
                    } : undefined
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setQuestions(data.questions);
            toast.success("Quiz generated!");
        } catch (err: any) {
            toast.error(err.message || "Failed to generate quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (idx: number) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        if (idx === questions[currentIdx].answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOpt(null);
        } else {
            setFinished(true);
        }
    };

    const currentQuestion = questions[currentIdx];

    return (
        <div className="container-responsive" style={{ maxWidth: 700, minHeight: "90vh" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "clamp(1.2rem, 5vw, 1.5rem)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <HelpCircle size={24} color="#60a5fa" /> Quiz Generator
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Practice with AI-generated MCQs on any topic</p>
            </div>

            {questions.length === 0 && !loading && (
                <div className="glass-card" style={{ padding: "1.5rem md:2rem", textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", margin: "0 auto 1.5rem" }}>
                        <Brain size={28} />
                    </div>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>What do you want to practice?</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>Enter a chapter name or topic (e.g. Photosynthesis, Newton Laws)</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
                            placeholder="Enter topic..."
                            className="input-field"
                        />
                        <button onClick={generateQuiz} className="btn-primary" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", width: "100%", justifyContent: "center" }}>
                            Generate
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="glass-card" style={{ padding: "3rem 1rem", textAlign: "center" }}>
                    <Loader2 size={36} className="animate-spin-slow" color="#60a5fa" style={{ margin: "0 auto 1.5rem" }} />
                    <h3 style={{ fontWeight: 700 }}>Creating Your Quiz...</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Gemini is preparing challenging questions for you</p>
                </div>
            )}

            {questions.length > 0 && !finished && (
                <div className="animate-slide-up">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Question {currentIdx + 1} of {questions.length}</span>
                        <span style={{ fontSize: "0.75rem", color: "#60a5fa", fontWeight: 700 }}>Score: {score}</span>
                    </div>

                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#60a5fa", width: `${((currentIdx + 1) / questions.length) * 100}%`, transition: "width 0.3s ease" }} />
                    </div>

                    <div className="glass-card" style={{ padding: "1.5rem md:2rem" }}>
                        <h3 style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)", fontWeight: 700, lineHeight: 1.5, marginBottom: "1.5rem" }}>{currentQuestion.question}</h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {currentQuestion.options.map((opt, i) => {
                                const isCorrect = i === currentQuestion.answer;
                                const isSelected = i === selectedOpt;

                                let borderColor = "var(--border)";
                                let bgColor = "rgba(255,255,255,0.03)";

                                if (selectedOpt !== null) {
                                    if (isCorrect) {
                                        borderColor = "#10b981";
                                        bgColor = "rgba(16,185,129,0.1)";
                                    } else if (isSelected) {
                                        borderColor = "#ef4444";
                                        bgColor = "rgba(239,68,68,0.1)";
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionClick(i)}
                                        style={{
                                            textAlign: "left",
                                            padding: "0.85rem 1rem",
                                            borderRadius: "0.75rem",
                                            background: bgColor,
                                            border: `1px solid ${borderColor}`,
                                            color: "var(--text-primary)",
                                            cursor: selectedOpt === null ? "pointer" : "default",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "1rem",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>{opt}</span>
                                        {selectedOpt !== null && isCorrect && <CheckCircle2 size={16} color="#10b981" />}
                                        {selectedOpt !== null && isSelected && !isCorrect && <XCircle size={16} color="#ef4444" />}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedOpt !== null && (
                            <div className="animate-fade-in" style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem", borderLeft: "3px solid #60a5fa" }}>
                                <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.4rem", color: "#60a5fa" }}>Explanation:</div>
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{currentQuestion.explanation}</p>

                                <button onClick={nextQuestion} className="btn-primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}>
                                    {currentIdx + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {finished && (
                <div className="glass-card animate-bounce-in" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Quiz Completed!</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.9rem" }}>You scored <span style={{ color: "#60a5fa", fontWeight: 800 }}>{score}</span> out of {questions.length}</p>

                    <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
                        <button onClick={() => setQuestions([])} className="btn-secondary" style={{ justifyContent: "center" }}>
                            <RefreshCcw size={18} /> Try Another
                        </button>
                        <button onClick={() => setQuestions([])} className="btn-primary" style={{ justifyContent: "center" }}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
