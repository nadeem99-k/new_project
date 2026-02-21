"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Camera,
  Brain,
  Zap,
  Star,
  CheckCircle,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Play,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: <Brain size={28} />,
    title: "Ask Anything",
    desc: "Type any question from your textbook and get a clear, step-by-step explanation instantly.",
    color: "#818cf8",
  },
  {
    icon: <Camera size={28} />,
    title: "Snap & Solve",
    desc: "Take a photo of any question — AI reads it and solves it step by step. No typing needed!",
    color: "#34d399",
  },
  {
    icon: <Zap size={28} />,
    title: "Math Solver",
    desc: "From algebra to calculus — every step explained clearly so you actually understand it.",
    color: "#f59e0b",
  },
  {
    icon: <BookOpen size={28} />,
    title: "Chapter Summarizer",
    desc: "Paste any chapter and get key points, important terms, and possible exam questions.",
    color: "#f472b6",
  },
  {
    icon: <Star size={28} />,
    title: "Quiz Generator",
    desc: "Practice with AI-generated MCQs from any topic. Get instant feedback and explanations.",
    color: "#60a5fa",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Urdu Support",
    desc: "Get explanations in Urdu or English. Perfect for Urdu-medium students.",
    color: "#a78bfa",
  },
];

const boards = [
  "Punjab Board",
  "Federal Board",
  "Sindh Board",
  "KPK Board",
  "Balochistan Board",
  "Cambridge O/A Level",
  "Matric",
  "FSc / FA",
];

const stats = [
  { value: "10,000+", label: "Students Helped" },
  { value: "50,000+", label: "Questions Answered" },
  { value: "8+", label: "Curriculum Boards" },
  { value: "24/7", label: "Always Available" },
];

const pricing = [
  {
    name: "Free",
    price: "Rs. 0",
    period: "",
    features: ["5 questions per day", "Text Q&A", "Basic explanations", "1 board"],
    cta: "Start Free",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Student Pro",
    price: "Rs. 299",
    period: "/month",
    features: [
      "Unlimited questions",
      "Snap & Solve (Photo)",
      "Math Solver",
      "Quiz Generator",
      "Chapter Summarizer",
      "Urdu support",
      "All boards",
    ],
    cta: "Get Pro",
    href: "/sign-up",
    highlight: true,
  },
  {
    name: "Family",
    price: "Rs. 599",
    period: "/month",
    features: [
      "Everything in Pro",
      "Up to 3 students",
      "Progress dashboard",
      "Priority support",
    ],
    cta: "Get Family",
    href: "/sign-up",
    highlight: false,
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem clamp(1rem, 5vw, 2rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(10,10,26,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
          height: "70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "0.6rem",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>
            Study<span className="gradient-text">AI</span>
          </span>
        </div>

        <div
          className="hide-mobile"
          style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", alignItems: "center" }}
        >
          {["Features", "Boards", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "white")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-secondary)")
              }
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/sign-in" className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Get Started Free
          </Link>
        </div>

        <button
          className="show-mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,26,0.98)",
            backdropFilter: "blur(20px)",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          {/* Header inside menu */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            height: "70px",
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "0.6rem", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={20} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>Study<span className="gradient-text">AI</span></span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", cursor: "pointer", padding: "0.5rem", borderRadius: "0.5rem" }}
            >
              <X size={28} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4rem 2rem",
              gap: "3.5rem",
              overflowY: "auto",
            }}
            className="animate-slide-down"
          >
            <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}>
              {["Features", "Boards", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em"
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div style={{
              width: "100%",
              maxWidth: 320,
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
              marginTop: "auto",
              paddingTop: "2rem",
              paddingBottom: "3rem"
            }}>
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "1.1rem", fontSize: "1.05rem" }}>Sign In</Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1.1rem", fontSize: "1.05rem" }}>Get Started Free</Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(6rem, 15vh, 10rem) 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <div style={{ maxWidth: 780, position: "relative", zIndex: 1 }}>
          <div
            className="glass"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "#818cf8",
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            Pakistan&apos;s First AI Tutor for Local Curriculum
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Your AI Tutor,
            <br />
            <span className="gradient-text">Available 24/7</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-secondary)",
              maxWidth: 580,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
              padding: "0 1rem"
            }}
          >
            Snap a photo of any textbook question and get instant step-by-step
            answers in <strong style={{ color: "white" }}>Urdu</strong> or{" "}
            <strong style={{ color: "white" }}>English</strong>. Supports Punjab,
            Federal, Sindh & Cambridge boards.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2rem" }}>
              <Play size={18} />
              Start Free — No Credit Card
            </Link>
            <a href="#features" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.9rem 2rem" }}>
              See How It Works
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              marginTop: "4rem",
              flexWrap: "wrap",
              padding: "0 1rem"
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#818cf8" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>
            Everything You Need to{" "}
            <span className="gradient-text">Ace Your Exams</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem", fontSize: "1.05rem" }}>
            Powered by Google&apos;s Gemini AI — the most advanced AI available
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "1.75rem",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${f.color}22`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "1rem",
                  background: `${f.color}22`,
                  border: `1px solid ${f.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                  marginBottom: "1.25rem",
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.6rem" }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.9rem" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARDS */}
      <section
        id="boards"
        style={{ padding: "5rem 1.5rem", background: "rgba(79,70,229,0.04)" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" }}>
            Supports <span className="gradient-text">All Major Boards</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
            Whether you&apos;re studying for Matric, FSc, or Cambridge — we&apos;ve got you.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {boards.map((b) => (
              <div
                key={b}
                className="glass"
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#818cf8",
                }}
              >
                <Award size={15} />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "5rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800 }}>
            Affordable for Every <span className="gradient-text">Pakistani Student</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem" }}>
            Less than one private tuition session per month!
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(0, 320px))",
            justifyContent: "center",
            gap: "2rem",
            alignItems: "stretch",
            padding: "0 1rem",
          }}
        >
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={plan.highlight ? "glass-card animate-pulse-glow" : "glass-card"}
              style={{
                padding: "2.25rem 1.75rem",
                position: "relative",
                border: plan.highlight ? "1px solid rgba(79,70,229,0.5)" : "1px solid var(--border)",
                boxShadow: plan.highlight ? "0 20px 50px rgba(79,70,229,0.15)" : "none",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    padding: "0.25rem 1rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  ⭐ Most Popular
                </div>
              )}
              <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "#818cf8" }}>
                  {plan.price}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {plan.period}
                </span>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem" }}>
                    <CheckCircle size={16} color="#4ade80" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={plan.highlight ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <Users size={48} color="#818cf8" style={{ margin: "0 auto 1.5rem" }} />
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" }}>
          Join <span className="gradient-text">10,000+ Students</span> Already Using StudyAI
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>
          Stop struggling alone at midnight. Your AI tutor is always ready — free to start!
        </p>
        <Link href="/sign-up" className="btn-accent" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
          <Sparkles size={20} />
          Start Learning Free Today
        </Link>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
      <footer
        style={{
          padding: "2.5rem",
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Brain size={16} color="#818cf8" />
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>StudyAI</span>
        </div>
        <p>© 2026 StudyAI. Built with ❤️ for Pakistani Students.</p>
      </footer>
    </div>
  );
}
