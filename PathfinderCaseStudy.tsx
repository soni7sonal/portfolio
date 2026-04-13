// @ts-nocheck
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// ── SHARED DESIGN TOKENS (mirror of PortfolioV2.tsx) ─────────────────────────
const PURPLE       = "rgb(145, 75, 241)"
const BG           = "#FBFBFC"
const BG_ALT       = "#F4F3F9"
const TEXT         = "#1a1a1a"
const BODY         = "rgba(26,26,26,0.72)"
const MUTED        = "rgba(26,26,26,0.42)"
const BORDER       = "rgba(26,26,26,0.07)"
const ease         = [0.16, 1, 0.3, 1] as any

const SHADOW = {
    sm:        "0 2px 12px rgba(26,26,26,0.06)",
    md:        "0 4px 24px rgba(26,26,26,0.08)",
    lg:        "0 8px 40px rgba(26,26,26,0.10)",
    card:      "0 4px 24px rgba(0,0,0,0.05)",
    cardHover: "0 16px 56px rgba(0,0,0,0.10)",
}
const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, pill: 100 }
const TS = {
    h2:      { fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600 as const, letterSpacing: "-0.03em", lineHeight: 1.15, color: TEXT },
    body:    { fontSize: 14, lineHeight: 1.85, color: BODY },
    label:   { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: MUTED },
}

// ── PATHFINDER-SPECIFIC TOKENS ────────────────────────────────────────────────
const PF_NAVY      = "#060D1F"
const PF_BLUE      = "#1A6EEB"
const PF_ORANGE    = "#E84B1A"
const PF_TEXT      = "#FFFFFF"
const PF_MUTED     = "rgba(255,255,255,0.55)"
const PF_BORDER    = "rgba(255,255,255,0.08)"
const PF_CARD      = "rgba(255,255,255,0.04)"

// ── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
function useScreen() {
    const [w, setW] = useState(1200)
    useEffect(() => {
        setW(window.innerWidth)
        const h = () => setW(window.innerWidth)
        window.addEventListener("resize", h)
        return () => window.removeEventListener("resize", h)
    }, [])
    return { isMobile: w < 640, isTablet: w < 1024, w }
}

// ── PLACEHOLDER ───────────────────────────────────────────────────────────────
function Placeholder({ label, height = 320, dark = false }: { label: string; height?: number; dark?: boolean }) {
    return (
        <div style={{
            width: "100%", height, borderRadius: RADIUS.lg,
            border: `1.5px dashed ${dark ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.15)"}`,
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(26,26,26,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            color: dark ? "rgba(255,255,255,0.35)" : MUTED,
            letterSpacing: "0.04em", textAlign: "center" as const,
            padding: "0 24px", boxSizing: "border-box" as const
        }}>
            [ {label} ]
        </div>
    )
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function PFEyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const,
            color: MUTED, margin: "0 0 12px", fontWeight: 500
        }}>{children}</p>
    )
}

function PFHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 style={{ ...TS.h2, margin: "0 0 20px" }}>
            {children}<span style={{ color: PF_BLUE }}>.</span>
        </h2>
    )
}

function PFHeadingDark({ children }: { children: React.ReactNode }) {
    return (
        <h2 style={{
            fontSize: "clamp(24px,3vw,36px)", fontWeight: 600,
            letterSpacing: "-0.03em", lineHeight: 1.15,
            color: PF_TEXT, margin: "0 0 20px"
        }}>
            {children}<span style={{ color: PF_BLUE }}>.</span>
        </h2>
    )
}

function MetaPill({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: MUTED }}>
                {label}
            </span>
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                {value}
            </span>
        </div>
    )
}

function StatBlock({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
    return (
        <div style={{ textAlign: "center" as const }}>
            <div style={{
                fontSize: "clamp(32px,5vw,52px)", fontWeight: 700,
                letterSpacing: "-0.04em", lineHeight: 1,
                color: dark ? PF_TEXT : TEXT, marginBottom: 8
            }}>
                {value}
            </div>
            <div style={{
                fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const,
                color: dark ? PF_MUTED : MUTED
            }}>
                {label}
            </div>
        </div>
    )
}

// ── BROWSER CHROME ─────────────────────────────────────────────────────────────
function BrowserFrame({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            borderRadius: RADIUS.lg, overflow: "hidden",
            border: `1px solid ${BORDER}`, boxShadow: SHADOW.lg, background: BG
        }}>
            <div style={{
                height: 36, background: "#f0f0f2",
                borderBottom: `1px solid ${BORDER}`,
                display: "flex", alignItems: "center", padding: "0 14px", gap: 6
            }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
            </div>
            {children}
        </div>
    )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function PathfinderCaseStudy() {
    const { isMobile } = useScreen()
    const px = isMobile ? "16px" : "40px"

    return (
        <div style={{
            color: TEXT,
            fontFamily: "'Instrument Sans', sans-serif",
            background: BG,
            overflowX: "hidden"
        }}>

            {/* ══════════════════════════════════════════════════════════
                SECTION 1 — HERO
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: PF_NAVY,
                position: "relative",
                minHeight: isMobile ? 380 : 560,
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden"
            }}>
                {/* Full-bleed hero background */}
                <div style={{ position: "absolute", inset: 0 }}>
                    <Placeholder
                        label="ANIM: pathfinder_cover.mp4 — space video loop, autoplay muted loop, covers full section, object-fit: cover, opacity 0.7"
                        height={isMobile ? 380 : 560}
                        dark
                    />
                </div>

                {/* Gradient overlay */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(6,13,31,0.2) 0%, rgba(6,13,31,0.75) 60%, rgba(6,13,31,0.95) 100%)"
                }} />

                {/* Hero content */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    maxWidth: 960, margin: "0 auto",
                    padding: `0 ${px} ${isMobile ? 40 : 64}px`,
                    boxSizing: "border-box"
                }}>
                    <p style={{
                        fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.4)", margin: "0 0 16px"
                    }}>
                        Case Study — Automation Anywhere · 2022
                    </p>

                    <h1 style={{
                        fontSize: isMobile ? 36 : "clamp(40px,6vw,72px)",
                        fontWeight: 700, letterSpacing: "-0.04em",
                        lineHeight: 1, color: PF_TEXT, margin: "0 0 16px"
                    }}>
                        Pathfinder Academy
                    </h1>

                    <p style={{
                        fontSize: isMobile ? 15 : 18, lineHeight: 1.6,
                        color: "rgba(255,255,255,0.65)",
                        maxWidth: 560, margin: "0 0 32px"
                    }}>
                        Unified 5 disconnected enterprise learning platforms into one mission-driven experience for 400M+ automations running globally.
                    </p>

                    {/* Stat pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {[
                            { value: "97%", label: "Engagement Rate" },
                            { value: "271", label: "Certifications / mo" },
                            { value: "5 → 1", label: "Platforms Unified" },
                        ].map((s, i) => (
                            <div key={i} style={{
                                padding: "8px 16px", borderRadius: RADIUS.pill,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.14)",
                                backdropFilter: "blur(8px)",
                                display: "flex", alignItems: "center", gap: 8
                            }}>
                                <span style={{ fontSize: 16, fontWeight: 700, color: PF_TEXT }}>{s.value}</span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 2 — OUTCOME
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 64}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>The Outcome</PFEyebrow>
                    <PFHeading>What changed</PFHeading>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                        gap: isMobile ? "32px 16px" : "0 40px",
                        marginTop: 40, paddingTop: 40,
                        borderTop: `1px solid ${BORDER}`
                    }}>
                        <StatBlock value="97%" label="Engagement Rate" />
                        <StatBlock value="271" label="Monthly Certifications" />
                        <StatBlock value="5 → 1" label="Platform Consolidation" />
                    </div>

                    <p style={{ ...TS.body, maxWidth: 600, marginTop: 32 }}>
                        Pathfinder Academy became the primary learning channel across Automation Anywhere's global partner and customer network — serving developers, business analysts, and automation leads across every skill level.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 3 — CONTEXT
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG_ALT }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>Context</PFEyebrow>
                    <PFHeading>The project</PFHeading>

                    {/* Metadata row */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                        gap: isMobile ? "24px 16px" : "0 32px",
                        padding: "28px 32px",
                        background: BG, borderRadius: RADIUS.lg,
                        border: `1px solid ${BORDER}`, marginBottom: 40
                    }}>
                        <MetaPill label="Year" value="2022" />
                        <MetaPill label="My Role" value="Product Designer" />
                        <MetaPill label="Type" value="Ed-tech · Enterprise" />
                        <MetaPill label="Timeline" value="6 Months" />
                    </div>

                    {/* Role + Team */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 32 : 64,
                        alignItems: "start"
                    }}>
                        <div>
                            <p style={{ ...TS.label, marginBottom: 16 }}>My Responsibilities</p>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                                {[
                                    "Led end-to-end UX for the unified platform",
                                    "Defined information architecture across 5 learning tracks",
                                    "Designed the community and engagement system",
                                    "Built and documented the Pathfinder design system",
                                    "Collaborated with PM, engineering, and content leads",
                                ].map((item, i) => (
                                    <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <span style={{ color: PF_ORANGE, fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>—</span>
                                        <span style={{ ...TS.body, margin: 0 }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p style={{ ...TS.label, marginBottom: 16 }}>The Team</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[
                                    { name: "Sonal Soni", role: "Product Designer" },
                                    { name: "Team Member", role: "Product Manager" },
                                    { name: "Team Member", role: "Engineering Lead" },
                                    { name: "Team Member", role: "Content Strategist" },
                                ].map((member, i) => (
                                    <div key={i} style={{
                                        padding: "14px 16px", background: BG,
                                        borderRadius: RADIUS.md, border: `1px solid ${BORDER}`,
                                        display: "flex", gap: 10, alignItems: "center"
                                    }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: "rgba(26,26,26,0.06)",
                                            border: `1.5px dashed ${BORDER}`,
                                            flexShrink: 0, display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 10, color: MUTED
                                        }}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{member.name}</div>
                                            <div style={{ fontSize: 11, color: MUTED }}>{member.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 4 — THE PROBLEM
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>The Problem</PFEyebrow>
                    <PFHeading>Five worlds, no map</PFHeading>

                    <Placeholder
                        label="IMG: 5 platform logos arranged as scattered/fragmented grid — Automation Lead, Citizen Developer, Pro Developer, Focused Learning, Instructor-Led — show as disconnected islands with labels"
                        height={200}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 48, borderTop: `1px solid ${BORDER}` }}>
                        {[
                            {
                                num: "01",
                                title: "No unified learning identity",
                                user: "As a learner, I don't know where to start — each platform looks different and has its own login.",
                                problem: "Automation Anywhere had 5 separate learning products with no shared navigation, no consistent brand, and no way for learners to see their full progress.",
                                hmw: "How might we give every learner a single front door to their entire learning journey?"
                            },
                            {
                                num: "02",
                                title: "Role-blind content structure",
                                user: "As a citizen developer, I waste time filtering out content meant for pro developers.",
                                problem: "Content was organized by topic, not by role. A business analyst and a senior RPA developer faced the same overwhelming catalog.",
                                hmw: "How might we make the right learning path immediately obvious based on who you are?"
                            },
                            {
                                num: "03",
                                title: "No engagement loop",
                                user: "As an automation lead, I have no visibility on where my team is in their skill development.",
                                problem: "There was no feedback mechanism — no badges, no progress tracking, no community signal. Completion was the only milestone.",
                                hmw: "How might we reward progress at every step, not just at the finish line?"
                            },
                        ].map((pattern, i) => (
                            <div key={i} style={{
                                padding: "32px 0",
                                borderBottom: `1px solid ${BORDER}`,
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "80px 1fr",
                                gap: isMobile ? 12 : 32,
                                alignItems: "start"
                            }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                                    color: PF_ORANGE, paddingTop: 4
                                }}>{pattern.num}</span>

                                <div>
                                    <h3 style={{
                                        fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em",
                                        color: TEXT, margin: "0 0 12px"
                                    }}>{pattern.title}</h3>

                                    <p style={{
                                        fontSize: 13, lineHeight: 1.7, color: BODY, fontStyle: "italic",
                                        borderLeft: `2px solid ${PF_ORANGE}`,
                                        paddingLeft: 14, margin: "0 0 12px"
                                    }}>"{pattern.user}"</p>

                                    <p style={{ ...TS.body, margin: "0 0 16px" }}>{pattern.problem}</p>

                                    <div style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "8px 14px",
                                        background: "rgba(26,110,235,0.07)",
                                        border: "1px solid rgba(26,110,235,0.18)",
                                        borderRadius: RADIUS.md
                                    }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                                            color: PF_BLUE, textTransform: "uppercase" as const
                                        }}>HMW</span>
                                        <span style={{ fontSize: 13, color: TEXT }}>{pattern.hmw}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 5 — WHO WE DESIGNED FOR
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG_ALT }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>Who We Designed For</PFEyebrow>
                    <PFHeading>Two archetypes, one platform</PFHeading>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 16
                    }}>
                        {[
                            {
                                name: "The Automation Leader",
                                tag: "Strategic / Team-level",
                                sentence: "Needs his team certified and progressing without chasing them across disconnected tools.",
                                goals: [
                                    "Track team skill development at a glance",
                                    "Assign role-specific learning paths",
                                    "Report certification progress to leadership"
                                ],
                                friction: "No visibility. No single place to manage team learning.",
                                imgLabel: "IMG: persona-automation-leader.png — older man, dark maroon sweater, arms crossed"
                            },
                            {
                                name: "The Citizen Developer",
                                tag: "Practitioner / Individual",
                                sentence: "Wants to learn what's relevant to her role without wading through content built for engineers.",
                                goals: [
                                    "Find role-specific courses fast",
                                    "Earn badges that validate her skills",
                                    "Connect with a community of peers"
                                ],
                                friction: "Topic-first catalog. Everything looks the same regardless of skill level.",
                                imgLabel: "IMG: persona-citizen-developer.png — young woman, white blazer, smiling"
                            },
                        ].map((persona, i) => (
                            <div key={i} style={{
                                background: BG, borderRadius: RADIUS.xl,
                                border: `1px solid ${BORDER}`, overflow: "hidden",
                                boxShadow: SHADOW.card
                            }}>
                                <Placeholder label={persona.imgLabel} height={200} />

                                <div style={{ padding: 24 }}>
                                    <span style={{
                                        fontSize: 10, letterSpacing: "0.1em",
                                        textTransform: "uppercase" as const,
                                        color: PF_ORANGE, fontWeight: 600
                                    }}>{persona.tag}</span>

                                    <h3 style={{
                                        fontSize: 18, fontWeight: 600, color: TEXT,
                                        margin: "8px 0 12px", letterSpacing: "-0.02em"
                                    }}>{persona.name}</h3>

                                    <p style={{
                                        fontSize: 14, lineHeight: 1.65, color: BODY,
                                        margin: "0 0 20px", fontStyle: "italic"
                                    }}>"{persona.sentence}"</p>

                                    <p style={{ ...TS.label, marginBottom: 10 }}>Goals</p>
                                    <ul style={{
                                        margin: "0 0 16px", padding: 0, listStyle: "none",
                                        display: "flex", flexDirection: "column", gap: 6
                                    }}>
                                        {persona.goals.map((g, j) => (
                                            <li key={j} style={{
                                                fontSize: 13, color: BODY,
                                                display: "flex", gap: 8, alignItems: "flex-start"
                                            }}>
                                                <span style={{ color: PF_BLUE, flexShrink: 0 }}>✦</span>
                                                {g}
                                            </li>
                                        ))}
                                    </ul>

                                    <div style={{
                                        padding: "10px 14px",
                                        background: "rgba(232,75,26,0.06)",
                                        border: "1px solid rgba(232,75,26,0.14)",
                                        borderRadius: RADIUS.sm,
                                        fontSize: 12, color: BODY, lineHeight: 1.6
                                    }}>
                                        <span style={{ fontWeight: 600, color: PF_ORANGE }}>Friction: </span>
                                        {persona.friction}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 6 — THREE KEY DESIGN DECISIONS
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>Design Process</PFEyebrow>
                    <PFHeading>Three decisions that defined the platform</PFHeading>
                    <p style={{ ...TS.body, maxWidth: 540, margin: "0 0 56px" }}>
                        Pathfinder was a large project — six months, multiple stakeholders, and a lot of competing directions. These are the three moments where design judgment mattered most.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {[
                            {
                                num: "01",
                                decision: "Consolidate, not federate",
                                body: "Five teams wanted five platforms. The temptation was to build a portal that linked them — a hub with links to each existing tool. We pushed for full consolidation: one platform, one identity, one learner journey. This meant negotiating a shared information architecture across stakeholders with competing priorities — and making the case that short-term migration pain was worth long-term engagement gains.",
                                imgLabel: "IMG/DIAGRAM: IA decision matrix — 'Federate vs Consolidate' comparison. 2-column table or diagram showing trade-offs. Height: 220px"
                            },
                            {
                                num: "02",
                                decision: "Role-first, not topic-first",
                                body: "Early information architecture sorted content by subject — RPA basics, advanced scripting, process automation. We reordered everything around roles: Citizen Developer, Pro Developer, Automation Leader, Business Analyst. Learners stopped asking 'where do I start?' because the answer was built into the navigation itself.",
                                imgLabel: "IMG: IA sketch or navigation wireframe — role-based top-level nav vs topic-based. Before/after layout. Height: 220px"
                            },
                            {
                                num: "03",
                                decision: "Badges before certifications",
                                body: "Certification processes at enterprise scale are slow — committee reviews, content audits, legal sign-offs. To drive immediate engagement, we introduced a badge system that rewarded progress at every milestone, not just at course completion. This micro-reward loop is what drove the 97% engagement rate — learners had a reason to come back before they were 'done'.",
                                imgLabel: "IMG: Badge system sketch or component — progress indicator + badge states (locked, in-progress, earned). Height: 220px"
                            },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: "48px 0",
                                borderTop: `1px solid ${BORDER}`,
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                                gap: isMobile ? 24 : 64,
                                alignItems: "center"
                            }}>
                                <div style={{ order: isMobile ? 1 : (i % 2 === 0 ? 1 : 2) }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                                            color: PF_ORANGE, textTransform: "uppercase" as const
                                        }}>Decision {item.num}</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 600,
                                        letterSpacing: "-0.02em", color: TEXT,
                                        margin: "0 0 16px", lineHeight: 1.2
                                    }}>{item.decision}</h3>
                                    <p style={{ ...TS.body, margin: 0 }}>{item.body}</p>
                                </div>

                                <div style={{ order: isMobile ? 2 : (i % 2 === 0 ? 2 : 1) }}>
                                    <Placeholder label={item.imgLabel} height={220} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 7 — THE SOLUTION
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG_ALT }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>The Solution</PFEyebrow>
                    <PFHeading>Two moments that define the experience</PFHeading>

                    {/* Spotlight A */}
                    <div style={{ marginBottom: 64 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{
                                padding: "4px 12px", borderRadius: RADIUS.pill,
                                background: "rgba(26,110,235,0.08)",
                                border: "1px solid rgba(26,110,235,0.18)",
                                fontSize: 11, color: PF_BLUE, fontWeight: 600,
                                letterSpacing: "0.06em", textTransform: "uppercase" as const
                            }}>Spotlight A</span>
                            <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>
                                The Unified Landing Experience
                            </span>
                        </div>

                        <BrowserFrame>
                            <Placeholder
                                label="IMG: Pathfinder Academy landing page — from 'Pathfinder Academy New Landing Page - 12.pdf' screenshot. Dark space theme, unified navigation, Career Quests + Skill Boosters sections visible."
                                height={400}
                            />
                        </BrowserFrame>

                        <p style={{ ...TS.body, marginTop: 16, maxWidth: 560 }}>
                            The new landing page replaced 5 separate entry points with one role-aware homepage. Learners land here, identify their role, and enter a curated path — no catalog browsing, no cross-platform navigation.
                        </p>
                    </div>

                    {/* Spotlight B */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{
                                padding: "4px 12px", borderRadius: RADIUS.pill,
                                background: "rgba(232,75,26,0.08)",
                                border: "1px solid rgba(232,75,26,0.18)",
                                fontSize: 11, color: PF_ORANGE, fontWeight: 600,
                                letterSpacing: "0.06em", textTransform: "uppercase" as const
                            }}>Spotlight B</span>
                            <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>
                                The Community &amp; Engagement Layer
                            </span>
                        </div>

                        <BrowserFrame>
                            <Placeholder
                                label="IMG: Community page — image-community.png (rockets + planet illustration) as hero, community features below: peer forums, badge showcase, monthly flight plans."
                                height={400}
                            />
                        </BrowserFrame>

                        <p style={{ ...TS.body, marginTop: 16, maxWidth: 560 }}>
                            The engagement loop that drove 97% participation: badges rewarding every milestone, a peer community for sharing progress, and monthly Flight Plans keeping learners oriented toward what's next.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 8 — DESIGN SYSTEM  ★ DARK
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: PF_NAVY, position: "relative", overflow: "hidden" }}>
                {/* Starfield texture placeholder (position absolute) */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}>
                    <Placeholder
                        label="IMG BG: banner-skill-builder.png — position absolute, inset 0, object-fit cover, opacity 0.3, pointer-events none"
                        height={600}
                        dark
                    />
                </div>

                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 96}px ${px}`,
                    boxSizing: "border-box",
                    position: "relative", zIndex: 1
                }}>
                    <p style={{
                        fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.4)", margin: "0 0 12px"
                    }}>
                        Design System
                    </p>
                    <h2 style={{
                        fontSize: "clamp(24px,3vw,36px)", fontWeight: 600,
                        letterSpacing: "-0.03em", lineHeight: 1.15,
                        color: PF_TEXT, margin: "0 0 16px"
                    }}>
                        Built to scale across every learning path<span style={{ color: PF_BLUE }}>.</span>
                    </h2>
                    <p style={{
                        fontSize: 14, lineHeight: 1.85, color: PF_MUTED,
                        maxWidth: 520, margin: "0 0 56px"
                    }}>
                        To support a unified platform across multiple roles and content types, I built a design system from the ground up — covering tokens, components, templates, and responsive behavior.
                    </p>

                    {/* 3×2 Thumb gallery */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
                        gap: 16
                    }}>
                        {[
                            { num: "01", label: "Color & Tokens",            img: "IMG: AAI WDS Color Palette screenshot — navy, electric blue, orange, white token swatches" },
                            { num: "02", label: "Typography",                img: "IMG: AAI WDS Typography Desktop screenshot — type scale from display heading to body text" },
                            { num: "03", label: "Iconography & Illustrations", img: "IMG: 5 platform icons (orange line-art) + rockets/planets illustration composite" },
                            { num: "04", label: "Core Components",           img: "IMG: Component variations — course cards, badge states, CTA buttons, navigation" },
                            { num: "05", label: "Page Templates",            img: "IMG: Key UI — course page layout and community page layout" },
                            { num: "06", label: "Responsive System",         img: "IMG: 3 breakpoints side-by-side — desktop, tablet, mobile" },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px 0px" }}
                                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                                whileHover={{ y: -4 }}
                                style={{
                                    background: PF_CARD, border: `1px solid ${PF_BORDER}`,
                                    borderRadius: RADIUS.lg, overflow: "hidden", cursor: "pointer"
                                }}
                            >
                                <Placeholder label={card.img} height={isMobile ? 100 : 140} dark />
                                <div style={{
                                    padding: "12px 14px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center"
                                }}>
                                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{card.label}</span>
                                    <span style={{
                                        fontSize: 10, color: PF_BLUE,
                                        padding: "2px 8px",
                                        background: "rgba(26,110,235,0.15)",
                                        border: "1px solid rgba(26,110,235,0.3)",
                                        borderRadius: 100, letterSpacing: "0.04em"
                                    }}>{card.num}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stat strip */}
                    <div style={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        gap: isMobile ? 24 : 48, flexWrap: "wrap",
                        marginTop: 56, paddingTop: 40,
                        borderTop: "1px solid rgba(255,255,255,0.08)"
                    }}>
                        {[
                            { value: "45+", label: "Components" },
                            { value: "3", label: "Breakpoints" },
                            { value: "1", label: "Token Set" },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: "center" as const }}>
                                <div style={{ fontSize: 28, fontWeight: 700, color: PF_TEXT, letterSpacing: "-0.03em" }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: PF_MUTED, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginTop: 4 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <p style={{
                        textAlign: "center" as const, fontSize: 12,
                        color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginTop: 32
                    }}>
                        Documented in Figma and delivered to engineering with component usage guidelines.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 9 — IMPACT
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>Impact</PFEyebrow>
                    <PFHeading>What the numbers say</PFHeading>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
                        gap: "40px 24px",
                        padding: "48px 0",
                        borderTop: `1px solid ${BORDER}`,
                        borderBottom: `1px solid ${BORDER}`
                    }}>
                        <StatBlock value="97%" label="Engagement Rate" />
                        <StatBlock value="271" label="Monthly Certifications" />
                        <StatBlock value="5 → 1" label="Platforms Unified" />
                        <StatBlock value="400M+" label="Automations Running Globally" />
                        <StatBlock value="Free" label="Open to All Learners" />
                        <StatBlock value="2" label="Learning Tracks Launched" />
                    </div>

                    <p style={{ ...TS.body, maxWidth: 560, marginTop: 32 }}>
                        Pathfinder Academy became the primary learning channel across Automation Anywhere's global network. The platform went from a fragmented internal tool to the face of AA's education brand — open, free, and built for everyone.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 10 — WHAT'S NEXT
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG_ALT }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>What's Next</PFEyebrow>
                    <PFHeading>Questions I'm still sitting with</PFHeading>

                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {[
                            "How might personalisation — adaptive learning paths based on role, progress, and employer data — change the engagement model at scale?",
                            "Can the badge and certification system evolve into a portable credential that learners carry across organisations, not just within AA?",
                            "What would it look like to bring community and learning into the same surface — so asking a question and taking a lesson feel like the same action?",
                        ].map((q, i) => (
                            <div key={i} style={{
                                padding: "28px 0", borderBottom: `1px solid ${BORDER}`,
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "32px 1fr",
                                gap: isMobile ? 8 : 24, alignItems: "start"
                            }}>
                                <span style={{ fontSize: 11, color: PF_BLUE, fontWeight: 700, paddingTop: 3, letterSpacing: "0.06em" }}>↗</span>
                                <p style={{ fontSize: 15, lineHeight: 1.7, color: BODY, margin: 0 }}>{q}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 11 — REFLECTIONS
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: BG }}>
                <div style={{
                    maxWidth: 960, margin: "0 auto",
                    padding: `${isMobile ? 48 : 80}px ${px}`,
                    boxSizing: "border-box"
                }}>
                    <PFEyebrow>Reflections</PFEyebrow>
                    <PFHeading>What this project taught me</PFHeading>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 16
                    }}>
                        {[
                            {
                                label: "On stakeholder alignment",
                                body: "The hardest design problem wasn't the interface — it was getting five teams with five different visions to agree on one. I learned that design systems are as much about people as they are about components."
                            },
                            {
                                label: "On enterprise constraints",
                                body: "Shipping in an enterprise means working within legal, technical, and organisational constraints that move slower than design. I learned to find the latitude within constraints, not around them."
                            },
                            {
                                label: "On measuring engagement",
                                body: "97% is a number I'm proud of, but I'd push harder now to tie engagement to outcome — not just time spent, but skills demonstrated and applied on the job."
                            },
                            {
                                label: "On building systems",
                                body: "A design system is a product. It needs the same research, iteration, and documentation as anything user-facing. I underestimated that at the start and learned it the hard way."
                            },
                        ].map((r, i) => (
                            <div key={i} style={{
                                padding: 24, background: BG_ALT,
                                borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`
                            }}>
                                <p style={{ ...TS.label, color: PF_ORANGE, marginBottom: 10 }}>{r.label}</p>
                                <p style={{ ...TS.body, margin: 0 }}>{r.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SECTION 12 — CLOSE + CTA  ★ DARK
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: PF_NAVY, position: "relative", overflow: "hidden" }}>
                {/* Night sky background */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }}>
                    <Placeholder
                        label="IMG BG: banner-hero-bg.png — night sky photo, position absolute, inset 0, object-fit cover, opacity 0.15"
                        height={480}
                        dark
                    />
                </div>

                <div style={{
                    maxWidth: 640, margin: "0 auto", textAlign: "center" as const,
                    padding: `${isMobile ? 64 : 120}px ${px}`,
                    boxSizing: "border-box",
                    position: "relative", zIndex: 1
                }}>
                    <p style={{
                        fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.3)", margin: "0 0 20px"
                    }}>
                        Case Study Complete
                    </p>

                    <h2 style={{
                        fontSize: isMobile ? 28 : "clamp(32px,5vw,52px)",
                        fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1,
                        color: PF_TEXT, margin: "0 0 20px"
                    }}>
                        Want to talk about it<span style={{ color: PF_BLUE }}>?</span>
                    </h2>

                    <p style={{
                        fontSize: 16, lineHeight: 1.7, color: PF_MUTED,
                        margin: "0 0 40px"
                    }}>
                        I'd love to walk you through the decisions, trade-offs, and what I'd do differently. Let's talk.
                    </p>

                    {/* CTAs */}
                    <div style={{
                        display: "flex", gap: 12, justifyContent: "center",
                        flexWrap: "wrap", marginBottom: 64
                    }}>
                        <a
                            href="mailto:sonal@sonalsoni.design"
                            style={{
                                padding: "12px 28px", borderRadius: RADIUS.pill,
                                background: PF_BLUE, color: PF_TEXT,
                                fontSize: 14, fontWeight: 600,
                                textDecoration: "none", letterSpacing: "0.02em",
                                display: "inline-block"
                            }}
                        >
                            Get in touch
                        </a>
                        <a
                            href="/"
                            style={{
                                padding: "12px 28px", borderRadius: RADIUS.pill,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.16)",
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 14, fontWeight: 600,
                                textDecoration: "none", letterSpacing: "0.02em",
                                display: "inline-block"
                            }}
                        >
                            ← Back to portfolio
                        </a>
                    </div>

                    {/* Next case study teaser */}
                    <div style={{
                        paddingTop: 40,
                        borderTop: "1px solid rgba(255,255,255,0.08)"
                    }}>
                        <p style={{
                            fontSize: 11, letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "rgba(255,255,255,0.25)", marginBottom: 16
                        }}>
                            Next Case Study
                        </p>
                        <a
                            href="/ai-agent-studio"
                            style={{
                                fontSize: isMobile ? 18 : 22, fontWeight: 600,
                                color: "rgba(255,255,255,0.7)",
                                letterSpacing: "-0.02em",
                                textDecoration: "none",
                                display: "inline-flex", alignItems: "center", gap: 10,
                                transition: "color 0.2s"
                            }}
                        >
                            AI Agent Studio <span style={{ fontSize: 16, opacity: 0.5 }}>→</span>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    )
}

addPropertyControls(PathfinderCaseStudy, {
    _placeholder: {
        type: ControlType.String,
        title: "Note",
        defaultValue: "Pathfinder Academy case study — no controls needed",
    }
})
