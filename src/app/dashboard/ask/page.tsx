"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Brain, Loader2, BookOpen, Volume2, Mic, MicOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const subjects = ["General", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Urdu", "Islamiat", "Pakistan Studies", "Computer Science", "History", "Geography"];
const boards = ["Punjab Board", "Federal Board", "Sindh Board", "KPK Board", "Cambridge O/A Level", "Matric", "FSc / FA"];
const languages = ["English", "Urdu (Roman)", "Urdu"];

type Message = { role: "user" | "ai"; content: string };

export default function AskPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Assalam o Alaikum! 👋 I'm your AI tutor. Ask me anything from your textbook and I'll explain it step by step in your language!" },
    ]);
    const [input, setInput] = useState("");
    const [subject, setSubject] = useState("General");
    const [board, setBoard] = useState("Punjab Board");
    const [language, setLanguage] = useState("English");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [isListening, setIsListening] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await createClient().auth.getUser();
            if (user) {
                const { data } = await createClient()
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    setUserProfile(data);
                    setBoard(data.board || "Punjab Board");
                } else {
                    setUserProfile({ name: user.user_metadata.full_name });
                }
            }
        };
        fetchProfile();
    }, []);

    // --- Voice Logic (Speech to Text) ---
    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Your browser doesn't support voice recognition.");

        const recognition = new SpeechRecognition();
        recognition.lang = language === "Urdu" ? "ur-PK" : "en-US";
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    // --- Voice Logic (Text to Speech) ---
    const speakMessage = (text: string) => {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === "Urdu" ? "ur-PK" : "en-US";
        window.speechSynthesis.speak(utterance);
    };

    async function sendMessage() {
        if (!input.trim() || loading) return;
        const question = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setLoading(true);
        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    subject,
                    board,
                    language,
                    userProfile: userProfile ? {
                        name: userProfile.name,
                        school: userProfile.school,
                        location: userProfile.location,
                        bio: userProfile.bio,
                        grade: userProfile.grade
                    } : undefined
                }),
            });
            const data = await res.json();
            const aiResponse = data.answer || "Sorry, I couldn't answer that. Please try again.";
            setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", content: "❌ Error connecting to AI. Please check your connection and try again." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            height: "calc(100vh - 60px - 70px)", // Accounting for mobile header and bottom nav
            display: "flex",
            flexDirection: "column",
            maxWidth: 800,
            margin: "0 auto",
            padding: "1rem"
        }} className="responsive-chat-container">
            <div style={{ marginBottom: "1rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: "clamp(1.2rem, 5vw, 1.5rem)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Brain size={24} color="#818cf8" /> Ask AI Tutor
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Type any question and get a step-by-step explanation</p>
            </div>

            {/* SELECTORS */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {[
                    { value: subject, onChange: setSubject, options: subjects, label: "Subject" },
                    { value: board, onChange: setBoard, options: boards, label: "Board" },
                    { value: language, onChange: setLanguage, options: languages, label: "Language" },
                ].map((sel) => (
                    <select
                        key={sel.label}
                        value={sel.value}
                        onChange={(e) => sel.onChange(e.target.value)}
                        className="input-field"
                        style={{ width: "auto", flex: "1 1 100px", fontSize: "0.75rem", padding: "0.4rem 0.6rem" }}
                    >
                        {sel.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                ))}
            </div>

            {/* MESSAGES */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "1rem" }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        {msg.role === "ai" && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "0.4rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Brain size={13} color="white" />
                                    </div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>StudyAI</span>
                                </div>
                                <button
                                    onClick={() => speakMessage(msg.content)}
                                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                                >
                                    <Volume2 size={14} /> <span style={{ fontSize: "0.7rem" }}>Listen</span>
                                </button>
                            </div>
                        )}
                        <div className={msg.role === "user" ? "chat-user" : "chat-ai"} style={{ maxWidth: "90%", fontSize: "0.85rem" }}>
                            {msg.role === "ai" ? (
                                <div className="prose-ai">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <p style={{ lineHeight: 1.6 }}>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Brain size={13} color="white" />
                        </div>
                        <div className="chat-ai" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Loader2 size={16} style={{ animation: "spin-slow 1s linear infinite" }} color="#818cf8" />
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={{ padding: "1rem 0", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <BookOpen size={15} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your question..."
                        className="input-field"
                        style={{ paddingLeft: "2.2rem", paddingRight: "2.8rem", fontSize: "0.9rem" }}
                        disabled={loading}
                    />
                    <button
                        onClick={startListening}
                        style={{
                            position: "absolute",
                            right: "0.6rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: isListening ? "rgba(239, 68, 68, 0.1)" : "none",
                            border: "none",
                            color: isListening ? "#ef4444" : "#818cf8",
                            cursor: "pointer",
                            padding: "0.3rem",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                </div>
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="btn-primary"
                    style={{ padding: "0.6rem 1rem", minWidth: "44px", justifyContent: "center", opacity: loading || !input.trim() ? 0.6 : 1 }}
                >
                    <Send size={16} />
                </button>
            </div>

            <style jsx>{`
                @media (min-width: 769px) {
                    .responsive-chat-container {
                        height: 100vh !important;
                        padding: 1.5rem 1rem 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
