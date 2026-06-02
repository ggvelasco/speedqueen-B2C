"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useAnimation, animate, useScroll, useTransform, type Variants } from "framer-motion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy: "#002868",
  navyD: "#001540",
  navyL: "#0a3580",
  red: "#E31B23",
  redD: "#B0141B",
  white: "#FFFFFF",
  offW: "#F4F6FC",
  cream: "#FDF8F2",
  muted: "#5A6272",
  border: "rgba(0,40,104,0.1)",
};

// ─── Framer variants ──────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
});

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── Animated progress ring ───────────────────────────────────────────────────
function ProgressRing({
  pct,
  color,
  size = 80,
  stroke = 7,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

// ─── iPhone Mockup ────────────────────────────────────────────────────────────
const PHONE_W = 240;
const PHONE_H = 520;
const SHELL_RADIUS = 52;
const SCREEN_RADIUS = 44;
const PADDING_X = 12;
const PADDING_Y = 16;

function IPhoneMockup() {
  const [mins, setMins] = useState(23);
  useEffect(() => {
    const t = setInterval(() => setMins((m) => (m > 1 ? m - 1 : 23)), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: `${PHONE_W}px`, margin: "0 auto" }}
    >
      {/* glow */}
      <div
        style={{
          position: "absolute",
          inset: "-24px",
          background: `radial-gradient(ellipse at center, rgba(227,27,35,0.22) 0%, transparent 70%)`,
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* phone shell */}
      <div
        style={{
          position: "relative",
          width: `${PHONE_W}px`,
          height: `${PHONE_H}px`,
          background: "linear-gradient(160deg, #222236 0%, #0d0d1a 100%)",
          borderRadius: `${SHELL_RADIUS}px`,
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          boxShadow: [
            "0 40px 80px rgba(0,0,0,0.55)",
            "0 0 0 1.5px rgba(255,255,255,0.1)",
            "inset 0 0 0 1px rgba(255,255,255,0.04)",
            "inset 2px 0 4px rgba(255,255,255,0.03)",
          ].join(", "),
          overflow: "hidden",
        }}
      >
        {/* side buttons */}
        <div style={{ position: "absolute", left: "-3.5px", top: "90px", width: "3.5px", height: "22px", background: "#30304a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: "-3.5px", top: "126px", width: "3.5px", height: "48px", background: "#30304a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: "-3.5px", top: "184px", width: "3.5px", height: "48px", background: "#30304a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", right: "-3.5px", top: "148px", width: "3.5px", height: "72px", background: "#30304a", borderRadius: "0 2px 2px 0" }} />

        {/* screen */}
        <div
          style={{
            background: `linear-gradient(160deg, ${C.navyD} 0%, ${C.navy} 100%)`,
            borderRadius: `${SCREEN_RADIUS}px`,
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* status bar */}
          <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontFamily: "monospace" }}>9:41</span>
            <div style={{ width: "60px", height: "12px", background: "#0d0d1a", borderRadius: "8px" }} />
            <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
              {[3, 2, 1].map((i) => (
                <div key={i} style={{ width: "3px", height: `${4 + i * 2}px`, background: "rgba(255,255,255,0.7)", borderRadius: "1px" }} />
              ))}
              <div style={{ width: "14px", height: "8px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "2px", marginLeft: "2px", position: "relative" }}>
                <div style={{ position: "absolute", right: "-3px", top: "2px", width: "2px", height: "4px", background: "rgba(255,255,255,0.5)", borderRadius: "1px" }} />
                <div style={{ position: "absolute", inset: "1px", background: "rgba(255,255,255,0.7)", borderRadius: "1px", width: "70%" }} />
              </div>
            </div>
          </div>

          {/* app header */}
          <div style={{ padding: "4px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>Speed Queen</div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: C.white, fontFamily: "sans-serif", lineHeight: 1 }}>Gambelas</div>
          </div>

          {/* main content */}
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ProgressRing pct={73} color={C.red} size={90} stroke={7} />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 900, color: C.white, fontFamily: "sans-serif", lineHeight: 1 }}>73%</div>
                <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>completo</div>
              </div>
            </div>

            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "rgba(227,27,35,0.15)", border: "1px solid rgba(227,27,35,0.3)", borderRadius: "20px", padding: "5px 12px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red }} />
              <span style={{ fontSize: "9px", fontWeight: 700, color: C.red, fontFamily: "sans-serif", letterSpacing: "0.05em" }}>LAVAGEM EM CURSO</span>
            </motion.div>

            <div style={{ textAlign: "center" }}>
              <motion.div
                key={mins}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: "28px", fontWeight: 900, color: C.white, fontFamily: "sans-serif", lineHeight: 1 }}
              >
                {String(mins).padStart(2, "0")}:00
              </motion.div>
              <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", marginTop: "2px" }}>minutos restantes</div>
            </div>

            <div style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Máquina</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.white, fontFamily: "sans-serif" }}>Nº 4 · 12kg</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Programa</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.white, fontFamily: "sans-serif" }}>60°C · Algodão</div>
              </div>
            </div>

            <div style={{ width: "100%", background: C.red, borderRadius: "10px", padding: "9px", textAlign: "center", fontSize: "9px", fontWeight: 800, color: C.white, fontFamily: "sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Gerir Lavagem
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-around", paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {["🏠", "👕", "📍", "👤"].map((icon, i) => (
                <div key={i} style={{ fontSize: "14px", opacity: i === 0 ? 1 : 0.35 }}>{icon}</div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "4px" }}>
              <div style={{ width: "52px", height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px" }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scroll reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Benefit card ─────────────────────────────────────────────────────────────
function BenefitCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,40,104,0.13)` }}
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        borderRadius: "20px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "14px",
      }}
    >
      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #EEF3FF, #D3E4FE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "16px", color: C.navy, marginBottom: "8px" }}>{title}</div>
        <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.7 }}>{desc}</div>
      </div>
    </motion.div>
  );
}

// ─── Review card ─────────────────────────────────────────────────────────────
function ReviewCard({ text, author, avatar }: { text: string; author: string; avatar: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "20px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
    >
      <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 1l1.6 3.6 3.9.5-2.8 2.8.7 3.9L7 10.1l-3.4 1.7.7-3.9L1.5 5.1l3.9-.5z" fill={C.red} />
          </svg>
        ))}
      </div>
      <p style={{ fontSize: "14px", color: C.muted, fontStyle: "italic", lineHeight: 1.75, marginBottom: "16px" }}>"{text}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.navy}, ${C.navyL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
          {avatar}
        </div>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "13px", color: C.navy }}>{author}</span>
      </div>
    </motion.div>
  );
}

// ─── Responsive breakpoint hook ───────────────────────────────────────────────
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SpeedQueenGambelas() {
  const [scrolled, setScrolled] = useState(false);
  const isDesktop = useIsDesktop();

  // Parallax ref for desktop phone
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Responsive values ──
  const maxW = "1200px";
  const gutter = isDesktop ? "clamp(40px, 6vw, 80px)" : "20px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: ${C.offW}; color: ${C.navy}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        h1,h2,h3,h4 { font-family: 'Montserrat', sans-serif; }
        button { cursor: pointer; border: none; outline: none; font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: scrolled ? "rgba(0,21,64,0.98)" : "rgba(0,40,104,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
          transition: "background 0.4s, box-shadow 0.4s",
        }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${gutter}`, height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px" }}>⚡</span>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", color: C.white, letterSpacing: "0.04em" }}>
              Speed Queen <span style={{ opacity: 0.55, fontSize: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Gambelas</span>
            </span>
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            PT-PT
          </div>
        </div>
      </motion.header>

      <main style={{ paddingBottom: "80px" }}>

        {/* ── HERO ── */}
        <section
          ref={heroRef}
          style={{
            background: C.navyD,
            padding: isDesktop ? `120px ${gutter} 100px` : `90px 20px 52px`,
            position: "relative", overflow: "hidden",
            minHeight: "100svh", display: "flex", alignItems: "center",
          }}
        >
          {/* ── VIDEO BACKGROUND ── */}
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <source src="/teaser-lp2.mp4" type="video/mp4" />
          </video>

          {/* Layer 1 — dark base so video never burns through raw */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,15,48,0.55)", zIndex: 1, pointerEvents: "none" }} />

          {/* Layer 2 — directional gradient: heavier on text side */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: isDesktop
              ? `linear-gradient(105deg, rgba(0,21,64,0.92) 0%, rgba(0,21,64,0.75) 45%, rgba(0,21,64,0.30) 100%)`
              : `linear-gradient(180deg, rgba(0,21,64,0.88) 0%, rgba(0,21,64,0.68) 60%, rgba(0,21,64,0.88) 100%)`,
          }} />

          {/* Layer 3 — subtle red vignette at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
            background: `linear-gradient(to top, rgba(179,20,27,0.20), transparent)`,
            zIndex: 3, pointerEvents: "none",
          }} />

          {/* decorative elements */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px", pointerEvents: "none", zIndex: 4 }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.red} 0%, transparent 60%)`, zIndex: 5 }} />
          {[260, 180].map((size, i) => (
            <div key={i} style={{ position: "absolute", top: `${-80 + i * 40}px`, right: `${-80 + i * 40}px`, width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.03 + i * 0.01})`, pointerEvents: "none", zIndex: 4 }} />
          ))}

          {/* inner grid — above all overlay layers */}
          <div style={{
            maxWidth: maxW, width: "100%", margin: "0 auto", position: "relative", zIndex: 10,
            display: isDesktop ? "grid" : "flex",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : undefined,
            flexDirection: isDesktop ? undefined : "column",
            gap: isDesktop ? "64px" : "40px",
            alignItems: "center",
          }}>

            {/* LEFT col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <motion.div variants={stagger(0.1)} initial="hidden" animate="show" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(227,27,35,0.15)", border: "1px solid rgba(227,27,35,0.3)", borderRadius: "20px", padding: "5px 14px", width: "fit-content" }}>
                <span style={{ fontSize: "10px" }}>🔥</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#ff6b6b", letterSpacing: "0.06em", textTransform: "uppercase" }}>10% desconto na 1ª lavagem</span>
              </motion.div>

              <motion.h1
                variants={stagger(0.2)} initial="hidden" animate="show"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isDesktop ? "clamp(48px, 5.5vw, 80px)" : "clamp(36px, 9vw, 48px)", color: C.white, lineHeight: 1.0, letterSpacing: "0.02em" }}
              >
                O seu edredom não cabe na máquina?{" "}
                <span style={{ color: "transparent", backgroundImage: `linear-gradient(135deg, ${C.red}, #ff4d55)`, WebkitBackgroundClip: "text", backgroundClip: "text" }}>
                  Lave e seque tudo em menos de 1 hora.
                </span>
              </motion.h1>

              <motion.p variants={stagger(0.32)} initial="hidden" animate="show" style={{ fontSize: isDesktop ? "17px" : "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                Na Speed Queen Gambelas, tem máquinas industriais à sua disposição. Descarregue a app e gerencie tudo pelo telemóvel.
              </motion.p>

              {/* stats */}
              <motion.div variants={stagger(0.45)} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { val: 20, suf: "kg", label: "Capacidade" },
                  { val: 45, suf: "min", label: "Lavagem" },
                  { val: 120, suf: "+", label: "Avaliações" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "14px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isDesktop ? "32px" : "24px", color: C.white, lineHeight: 1 }}>
                      <Counter to={s.val} suffix={s.suf} />
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "4px", letterSpacing: "0.04em" }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.button
                variants={stagger(0.6)} initial="hidden" animate="show"
                whileHover={{ scale: 1.02, boxShadow: `0 8px 32px rgba(227,27,35,0.6)` }}
                whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "18px", background: `linear-gradient(135deg, ${C.red}, ${C.redD})`, color: C.white, fontWeight: 900, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase", borderRadius: "16px", boxShadow: `0 4px 24px rgba(227,27,35,0.45)` }}
              >
                📲 Descarregar a App — Grátis
              </motion.button>

              <motion.p variants={stagger(0.7)} initial="hidden" animate="show" style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                App Store · Google Play · Sem custos
              </motion.p>
            </div>

            {/* RIGHT col: Phone (with parallax on desktop) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              {isDesktop ? (
                <motion.div style={{ y: phoneY }}>
                  <IPhoneMockup />
                </motion.div>
              ) : (
                <IPhoneMockup />
              )}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{ padding: isDesktop ? `72px ${gutter}` : "52px 20px 44px", background: C.offW }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: "36px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.red, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Porque vale a pena sair de casa</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: isDesktop ? "clamp(36px, 3.5vw, 52px)" : "28px", color: C.navy, lineHeight: 1.1 }}>
                  Tudo o que a sua máquina não consegue fazer
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: "16px" }}>
              {[
                { icon: "🧺", title: "Capacidade Extra", desc: "Máquinas de 10 a 20 kg. Edredões, cobertores, roupa de cama — tudo de uma só vez." },
                { icon: "⚡", title: "Lave e Seque em 45min", desc: "Ciclo completo em menos de 1 hora. Sem dias de espera, sem roupa húmida." },
                { icon: "📶", title: "Wi-Fi & Conforto", desc: "Ambiente climatizado, seguro e Wi-Fi gratuito enquanto aguarda." },
              ].map((b, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <BenefitCard {...b} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PET CORNER ── */}
        <section style={{ padding: isDesktop ? `0 ${gutter} 72px` : "0 20px 52px" }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <Reveal>
              <div style={{ background: C.cream, border: `1.5px solid rgba(227,27,35,0.12)`, borderRadius: "24px", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `linear-gradient(180deg, ${C.red}, transparent)`, borderRadius: "4px 0 0 4px", zIndex: 1 }} />

                <div style={{
                  display: isDesktop ? "grid" : "flex",
                  gridTemplateColumns: isDesktop ? "1fr 420px" : undefined,
                  flexDirection: isDesktop ? undefined : "column",
                }}>
                  {/* Content side */}
                  <div style={{ padding: isDesktop ? "44px 48px" : "28px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(227,27,35,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>🐾</div>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: C.red, letterSpacing: "0.12em", textTransform: "uppercase" }}>Exclusivo</div>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: isDesktop ? "44px" : "28px", color: C.navy, lineHeight: 1 }}>Pet Corner</h2>
                      </div>
                    </div>

                    <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.85 }}>
                      O seu melhor amigo também merece higiene total. Temos máquinas{" "}
                      <strong style={{ color: C.navy }}>exclusivas para itens de animais</strong>{" "}
                      — camas, mantas, brinquedos. Sem misturar com roupa normal.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        { icon: "🛁", text: "Máquinas dedicadas apenas a itens pet" },
                        { icon: "🧼", text: "Sem contaminação cruzada com a sua roupa" },
                        { icon: "🌡️", text: "Programas especiais de temperatura segura" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.white, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{item.icon}</div>
                          <span style={{ fontSize: "13px", color: C.muted, fontWeight: 500 }}>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(227,27,35,0.08)", border: "1px solid rgba(227,27,35,0.18)", borderRadius: "12px", padding: "10px 16px", width: "fit-content" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.red, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: C.redD }}>
                        Única lavandaria na zona com área exclusiva Pet
                      </span>
                    </div>
                  </div>

                  {/* Image side */}
                  <div style={{
                    position: "relative",
                    height: isDesktop ? "auto" : "280px",
                    minHeight: isDesktop ? "460px" : undefined,
                    overflow: "hidden",
                  }}>
                    {/* Replace src with your actual image path, e.g. /images/pet-corner.jpg */}
                    <img
                      src="/images/pet-corner.jpg"
                      alt="Máquina Pet Corner — exclusiva para itens de animais"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />
                    {/* Red overlay tint at bottom for brand consistency */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
                      background: "linear-gradient(to top, rgba(179,20,27,0.55), transparent)",
                      pointerEvents: "none",
                    }} />
                    {/* Floating label on image */}
                    <div style={{
                      position: "absolute", bottom: "16px", left: "16px", right: "16px",
                      background: "rgba(0,21,64,0.85)", backdropFilter: "blur(8px)",
                      borderRadius: "12px", padding: "10px 14px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{ fontSize: "18px" }}>🐾</span>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: C.white, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pet Corner</div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>Esta máquina é de uso exclusivo para roupas de animais</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: isDesktop ? `72px ${gutter}` : "52px 20px", background: `linear-gradient(160deg, ${C.navyD} 0%, ${C.navy} 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.red}, transparent)` }} />
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: "40px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(227,27,35,0.8)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Simples assim</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: isDesktop ? "clamp(36px, 3.5vw, 52px)" : "28px", color: C.white }}>Como Funciona</h2>
              </div>
            </Reveal>

            {isDesktop ? (
              /* Desktop: 4-column horizontal */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
                {[
                  { n: 1, icon: "📲", label: "Descarregue a App e resgate o bónus de 10%" },
                  { n: 2, icon: "👕", label: "Traga as suas roupas (ou os itens do seu pet)" },
                  { n: 3, icon: "💳", label: "Escolha a máquina e pague pelo telemóvel" },
                  { n: 4, icon: "✨", label: "Relaxe com Wi-Fi e leve tudo limpo e seco" },
                ].map((s, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <motion.div whileHover={{ y: -4 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "50%",
                        background: i === 0 ? C.red : "rgba(255,255,255,0.1)",
                        border: `2px solid ${i === 0 ? C.red : "rgba(255,255,255,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", color: C.white,
                      }}>
                        {s.n}
                      </div>
                      <div style={{ fontSize: "22px" }}>{s.icon}</div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: C.white, lineHeight: 1.55 }}>{s.label}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            ) : (
              /* Mobile: vertical with connector line */
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { n: 1, icon: "📲", label: "Descarregue a App e resgate o bónus de 10%" },
                  { n: 2, icon: "👕", label: "Traga as suas roupas (ou os itens do seu pet)" },
                  { n: 3, icon: "💳", label: "Escolha a máquina e pague pelo telemóvel" },
                  { n: 4, icon: "✨", label: "Relaxe com Wi-Fi e leve tudo limpo e seco" },
                ].map((s, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div style={{ display: "flex", gap: "16px", paddingBottom: i < 3 ? "24px" : "0" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: i === 0 ? C.red : "rgba(255,255,255,0.1)", border: `2px solid ${i === 0 ? C.red : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: C.white }}>
                          {s.n}
                        </div>
                        {i < 3 && <div style={{ width: "2px", flex: 1, minHeight: "24px", background: "rgba(255,255,255,0.08)", marginTop: "4px" }} />}
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: C.white, lineHeight: 1.55 }}>{s.label}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal delay={0.4}>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 8px 32px rgba(227,27,35,0.5)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: "44px",
                  width: isDesktop ? "auto" : "100%",
                  padding: isDesktop ? "18px 48px" : "16px",
                  background: C.red, color: C.white, fontWeight: 900,
                  fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase",
                  borderRadius: "14px", boxShadow: `0 4px 20px rgba(227,27,35,0.4)`,
                  display: isDesktop ? "block" : undefined,
                }}
              >
                📲 Descarregar a App Agora
              </motion.button>
            </Reveal>
          </div>
        </section>

        {/* ── SOCIAL PROOF ── */}
        <section style={{ padding: isDesktop ? `72px ${gutter}` : "52px 20px 44px", background: C.offW }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: isDesktop ? "64px" : "48px", color: C.navy, lineHeight: 1 }}>4.8</div>
                  <div style={{ display: "flex", gap: "3px", margin: "4px 0" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 14 14">
                        <path d="M7 1l1.6 3.6 3.9.5-2.8 2.8.7 3.9L7 10.1l-3.4 1.7.7-3.9L1.5 5.1l3.9-.5z" fill={C.red} />
                      </svg>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: C.muted }}>+120 avaliações no Google</div>
                </div>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: "16px" }}>
              {[
                { text: "Muito limpo e rápido. A app é super prática e paguei tudo pelo telemóvel!", author: "Maria S.", avatar: "👩" },
                { text: "Nunca mais lavo em casa! As máquinas secam incrivelmente bem e o espaço é impecável.", author: "João P.", avatar: "👨" },
                { text: "Adorei o Pet Corner! Lavei as mantas do meu cão separadas sem qualquer drama.", author: "Ana L.", avatar: "👩‍🦰" },
              ].map((r, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <ReviewCard {...r} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: `linear-gradient(160deg, ${C.navyD}, ${C.navy})`, padding: isDesktop ? `52px ${gutter} 44px` : "44px 20px 36px", textAlign: "center" }}>
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: "28px", color: C.white, marginBottom: "6px" }}>Speed Queen Gambelas</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "28px" }}>Lavandaria Self-Service · Faro, Portugal</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "20px" }}>
                <span style={{ fontSize: "16px" }}>📍</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Rua Dr. Leonardo Ferreira, Gambelas, Faro</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <motion.button whileTap={{ scale: 0.97 }} style={{ padding: "14px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.2)", background: "transparent", color: C.white, fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  📍 Como Chegar
                </motion.button>
                <motion.button whileHover={{ scale: 1.02, boxShadow: `0 8px 24px rgba(227,27,35,0.5)` }} whileTap={{ scale: 0.97 }} style={{ padding: "14px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.red}, ${C.redD})`, color: C.white, fontWeight: 900, fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: `0 4px 18px rgba(227,27,35,0.4)` }}>
                  📲 Descarregar a App
                </motion.button>
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>© 2025 Speed Queen Gambelas · Todos os direitos reservados</p>
            </Reveal>
          </div>
        </footer>
      </main>

      {/* ── STICKY BAR ── */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: `linear-gradient(135deg, ${C.red}, ${C.redD})`, boxShadow: "0 -4px 30px rgba(227,27,35,0.4)" }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto" }}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "18px 20px", background: "transparent", color: C.white, fontWeight: 900, fontSize: "13px", letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            📲 Quero o meu desconto — Descarregar Agora
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}