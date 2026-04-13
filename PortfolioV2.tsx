// @ts-nocheck
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"
// @ts-ignore
import SmoothBeforeAfter from "https://framer.com/m/SmoothBeforeAfter-fet6ie.js"

const PURPLE  = "rgb(145, 75, 241)"
const BG      = "#FBFBFC"
const BG_ALT  = "#F4F3F9"
const TEXT    = "#1a1a1a"
const BODY    = "rgba(26,26,26,0.72)"
const MUTED   = "rgba(26,26,26,0.42)"
const BORDER  = "rgba(26,26,26,0.07)"
const PILL_BG = "rgba(26,26,26,0.055)"
const AA_ORANGE = "#e07b20"
const AA_LOGO = "https://www.automationanywhere.com/sites/default/files/images/AAI/automation-anywhere-logo-a-only.png"
const ease = [0.16, 1, 0.3, 1] as any

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// Purple scale
const PURPLE_SUBTLE = "rgba(145,75,241,0.08)"   // icon bg, chip bg, hover tint
const PURPLE_BORDER = "rgba(145,75,241,0.18)"   // active borders, rings
const PURPLE_HOVER  = "rgba(145,75,241,0.35)"   // hover border on chips

// Shadow scale — consistent elevation language
const SHADOW = {
    sm:        "0 2px 12px rgba(26,26,26,0.06)",
    md:        "0 4px 24px rgba(26,26,26,0.08)",
    lg:        "0 8px 40px rgba(26,26,26,0.10)",
    card:      "0 4px 24px rgba(0,0,0,0.05)",
    cardHover: "0 16px 56px rgba(0,0,0,0.10)",
    panel:     "0 4px 32px rgba(26,26,26,0.07)",
}

// Radius scale
const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, pill: 100 }

// Spacing scale — section vertical rhythm
const SPACE = { xs: 4, sm: 8, md: 16, lg: 32, xl: 48, xxl: 80 }

// Transition durations — one source of truth for motion speed
const DUR = { fast: 0.15, base: 0.2, slow: 0.35 }

// Type styles — spread directly into `style` props
const TS = {
    h2:      { fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600 as const, letterSpacing: "-0.03em", lineHeight: 1.15, color: TEXT },
    eyebrow: { fontSize: 11, color: MUTED, letterSpacing: "0.1em" },
    body:    { fontSize: 14, lineHeight: 1.85, color: BODY },
    label:   { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: MUTED },
    mono:    { fontFamily: "'DM Mono', 'Courier New', monospace" },
}

// ── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useScreen() {
    const [w, setW] = useState(1200) // safe SSR default
    useEffect(() => {
        setW(window.innerWidth) // read real width on mount
        const h = () => setW(window.innerWidth)
        window.addEventListener("resize", h)
        return () => window.removeEventListener("resize", h)
    }, [])
    return { isMobile: w < 640, isTablet: w < 1024, w }
}

// ── DOT — purple period used in all section headings ──────────────────────────
function Dot() { return <span style={{ color: PURPLE }}>.</span> }

// ── SECTION HEADER — eyebrow + h2 + Dot, used across all sections ─────────────
function SectionHeader({ eyebrow, title, mb = 48, sub }: { eyebrow?: string; title: string; mb?: number; sub?: React.ReactNode }) {
    return (
        <div>
            {eyebrow && <p style={{ ...TS.eyebrow, margin: "0 0 12px" }}>{eyebrow}</p>}
            <h2 style={{ ...TS.h2, margin: `0 0 ${mb}px` }}>{title}<Dot /></h2>
            {sub && sub}
        </div>
    )
}

// ── CONTAINER — max-width wrapper used across all sections ───────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{ maxWidth: 880, margin: "0 auto", boxSizing: "border-box" as const, ...style }}>
            {children}
        </div>
    )
}

function AABadge({ size = 18 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size, borderRadius: 4, flexShrink: 0, overflow: "hidden", background: "#fff", border: "1px solid rgba(26,26,26,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={AA_LOGO} alt="Automation Anywhere" style={{ width: size * 0.82, height: size * 0.82, objectFit: "contain", display: "block" }} />
        </div>
    )
}

const SUGGESTED_PROMPTS = [
    { label: "is she available?",       q: "is she available for work?" },
    { label: "what's she good at?",     q: "what is she good at?" },
    { label: "surprise me 🎲",          q: "tell me something surprising about her" },
]

// ── MOMO AVATAR (minimal dumpling) ───────────────────────────────────────────
function MomoAvatar({ size = 34 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size, borderRadius: "50%", background: PURPLE_SUBTLE, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 32 32" fill="none">
                {/* dumpling body — soft rounded shape */}
                <path d="M4 18 Q4 10 16 7 Q28 10 28 18 Q28 26 16 27 Q4 26 4 18Z" stroke={PURPLE} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {/* top pleats/folds */}
                <path d="M12 9 Q13 6 16 7" stroke={PURPLE} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M20 9 Q19 6 16 7" stroke={PURPLE} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                {/* eyes — simple dots */}
                <circle cx="12" cy="17" r="1.4" fill={PURPLE}/>
                <circle cx="20" cy="17" r="1.4" fill={PURPLE}/>
                {/* smile */}
                <path d="M13 21 Q16 23.5 19 21" stroke={PURPLE} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            </svg>
        </div>
    )
}

// ── MOMO TAMAGOTCHI (virtual pet inside chatbot) ─────────────────────────────
const TAMA_SEQUENCE: { state: string; duration: number; moveTo?: number }[] = [
    { state: "idle",    duration: 3000, moveTo: 0 },
    { state: "walk-r",  duration: 3500, moveTo: 80 },
    { state: "eat",     duration: 9000 },
    { state: "walk-l",  duration: 2500, moveTo: 0 },
    { state: "idle",    duration: 2000 },
    { state: "wave",    duration: 2500 },
    { state: "idle",    duration: 1500 },
    { state: "walk-r",  duration: 8000, moveTo: 260 },
    { state: "sleep",   duration: 15000 },
    { state: "idle",    duration: 3000 },
    { state: "walk-l",  duration: 8000, moveTo: 0 },
    { state: "idle",    duration: 2000 },
]

function MomoTamagotchi() {
    const [step, setStep] = useState(0)
    const [posX, setPosX] = useState(0) // pixels from center
    const state = TAMA_SEQUENCE[step % TAMA_SEQUENCE.length].state

    useEffect(() => {
        const entry = TAMA_SEQUENCE[step % TAMA_SEQUENCE.length]
        if (entry.moveTo !== undefined) setPosX(entry.moveTo)
        const t = setTimeout(() => {
            setStep(s => (s + 1) % TAMA_SEQUENCE.length)
        }, entry.duration)
        return () => clearTimeout(t)
    }, [step])

    const isSleep = state === "sleep"
    const isEat = state === "eat"
    const isWave = state === "wave"
    const isBounce = false // removed bounce during walk
    const isWalking = state === "walk-r" || state === "walk-l"

    return (
        <div style={{ height: 56, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative", overflow: "hidden", paddingBottom: 4 }}>

            <motion.div
                animate={{ x: posX }}
                transition={{ duration: 8, ease: "easeInOut" }}
                style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
                <motion.div
                    animate={
                        isSleep ? { y: [0, -1, 0] } :
                        { y: 0 }
                    }
                    transition={
                        isSleep ? { duration: 3, repeat: Infinity, ease: "easeInOut" } :
                        { duration: 0.3 }
                    }
                >
                    <svg width="52" height="46" viewBox="0 0 52 46" fill="none">
                        {/* shadow */}
                        <ellipse cx="26" cy="44" rx="8" ry="1.5" fill="rgba(145,75,241,0.06)" />

                        {/* left hand/arm */}
                        {isEat ? (
                            /* left hand holds bowl */
                            <motion.path d="M8 24 Q4 22 5 19" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"
                                animate={{ rotate: [0, -3, 0] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }} />
                        ) : isWave ? (
                            <path d="M8 24 Q5 22 6 20" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                        ) : isSleep ? (
                            <path d="M9 26 Q6 27 5 25" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
                        ) : (
                            <path d="M8 24 Q5 26 6 28" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                        )}

                        {/* right hand/arm */}
                        {isEat ? (<>
                            {/* right hand holds chopsticks */}
                            <motion.g
                                animate={{ rotate: [0, -8, 0, -8, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                            >
                                <path d="M44 24 Q47 20 46 14" stroke={PURPLE} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
                                <path d="M43 24 Q45 19 43 13" stroke={PURPLE} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
                            </motion.g>
                        </>) : isWave ? (
                            /* wave arm */
                            <motion.path d="M44 22 Q48 18 47 13" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"
                                animate={{ rotate: [0, -20, 20, -15, 0] }}
                                transition={{ duration: 0.6, repeat: 3, ease: "easeInOut" }}
                                style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }} />
                        ) : isSleep ? (
                            <path d="M43 26 Q46 27 47 25" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
                        ) : (
                            <path d="M44 24 Q47 26 46 28" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                        )}

                        {/* ramen bowl when eating */}
                        {isEat && (
                            <g>
                                {/* bowl */}
                                <path d="M2 24 Q2 30 13 31 L13 31" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                                <ellipse cx="8" cy="24" rx="7" ry="2.5" stroke={PURPLE} strokeWidth="1.1" fill="rgba(145,75,241,0.04)"/>
                                {/* noodles peeking out */}
                                <motion.path d="M5 23 Q6 20 8 22 Q10 20 11 23" stroke={PURPLE} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"
                                    animate={{ y: [0, -1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity }} />
                                {/* steam */}
                                <motion.path d="M6 20 Q7 17 6 15" stroke={PURPLE} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.2"
                                    animate={{ opacity: [0.15, 0.3, 0.15], y: [0, -2, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }} />
                                <motion.path d="M10 20 Q11 16 10 14" stroke={PURPLE} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.2"
                                    animate={{ opacity: [0.1, 0.25, 0.1], y: [0, -2, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} />
                            </g>
                        )}

                        {/* body — flipped when walking left */}
                        <g style={state === "walk-l" ? { transform: "scaleX(-1)", transformOrigin: "26px 20px" } : undefined}>
                            <path d="M12 24 Q12 16 26 13 Q40 16 40 24 Q40 34 26 36 Q12 34 12 24Z" stroke={PURPLE} strokeWidth="1.8" fill="rgba(145,75,241,0.06)" strokeLinecap="round" strokeLinejoin="round"/>

                            {/* top pleats */}
                            <path d="M21 15 Q22.5 11.5 26 13" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                            <path d="M31 15 Q29.5 11.5 26 13" stroke={PURPLE} strokeWidth="1.3" fill="none" strokeLinecap="round"/>

                            {/* eyes */}
                            {isSleep ? (<>
                                <path d="M20 23 Q21.5 21.5 23 23" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                                <path d="M29 23 Q30.5 21.5 32 23" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                            </>) : isEat ? (<>
                                {/* happy squint eyes while eating */}
                                <path d="M20 22 Q21.5 20.5 23 22" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                                <path d="M29 22 Q30.5 20.5 32 22" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                            </>) : (<>
                                <circle cx="21.5" cy="22" r="1.4" fill={PURPLE}/>
                                <circle cx="30.5" cy="22" r="1.4" fill={PURPLE}/>
                            </>)}

                            {/* mouth */}
                            {isEat ? (
                                <motion.ellipse cx="26" cy="27" rx="2.2" ry="1.8" fill={PURPLE} opacity="0.25"
                                    animate={{ ry: [1.8, 0.6, 1.8] }}
                                    transition={{ duration: 0.5, repeat: Infinity }} />
                            ) : isSleep ? (
                                <ellipse cx="26" cy="27" rx="1.5" ry="0.8" fill={PURPLE} opacity="0.15"/>
                            ) : (
                                <path d="M23 27 Q26 29.5 29 27" stroke={PURPLE} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                            )}

                            {/* cheek blush when eating */}
                            {isEat && (<>
                                <circle cx="18" cy="25" r="2" fill={PURPLE} opacity="0.06"/>
                                <circle cx="34" cy="25" r="2" fill={PURPLE} opacity="0.06"/>
                            </>)}
                        </g>

                        {/* little feet when walking */}
                        {isWalking && (<>
                            <motion.ellipse cx="22" cy="37" rx="3" ry="1.5" fill={PURPLE} opacity="0.15"
                                animate={{ y: [0, -1, 0] }}
                                transition={{ duration: 0.4, repeat: Infinity }} />
                            <motion.ellipse cx="30" cy="37" rx="3" ry="1.5" fill={PURPLE} opacity="0.15"
                                animate={{ y: [0, -1, 0] }}
                                transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }} />
                        </>)}
                    </svg>
                </motion.div>

                {/* floating Zs when sleeping */}
                {isSleep && (<>
                    <motion.span animate={{ opacity: [0, 0.5, 0], y: [0, -14] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                        style={{ position: "absolute", top: -4, right: -6, fontSize: 9, color: PURPLE, fontFamily: "Georgia, serif", fontWeight: 700 }}>z</motion.span>
                    <motion.span animate={{ opacity: [0, 0.35, 0], y: [0, -16] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                        style={{ position: "absolute", top: -8, right: 0, fontSize: 7, color: PURPLE, fontFamily: "Georgia, serif", fontWeight: 700 }}>z</motion.span>
                    <motion.span animate={{ opacity: [0, 0.25, 0], y: [0, -18] }} transition={{ duration: 2.5, repeat: Infinity, delay: 2.0 }}
                        style={{ position: "absolute", top: -10, right: -10, fontSize: 5, color: PURPLE, fontFamily: "Georgia, serif", fontWeight: 700 }}>z</motion.span>
                </>)}
            </motion.div>
        </div>
    )
}

// ── MOMO CHATBOT ──────────────────────────────────────────────────────────────
function MomoChatbot() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm Momo — ask me anything about Sonal's work, background, or what she's up to." },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [hasUserSent, setHasUserSent] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messages.length > 1) messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [messages])

    useEffect(() => {
        const id = "dm-mono-font"
        if (!document.getElementById(id)) {
            const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"
            l.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
            document.head.appendChild(l)
        }
    }, [])

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return
        setHasUserSent(true)
        const userMsg = { role: "user", content: text }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)
        try {
            const res = await fetch("https://sonal-api-proxy.vercel.app/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 1024,
                    system: `You are Momo, Sonal Soni's personal AI assistant embedded in her portfolio. You know her well — speak like a trusted colleague who's worked alongside her and genuinely respects her work. Warm, direct, no fluff. Never use emojis.

WHO IS SONAL:
- Sonal Soni, Product Designer with 4+ years of experience
- CS engineering background → switched to design in her final year of engineering school
- Currently pursuing Master of Design in Interaction Design at California College of the Arts (CCA), San Francisco — graduating Summer 2026
- Spent 2021–2025 at Automation Anywhere (global RPA/AI automation leader) as a UX Designer

WHAT SHE'S BUILT:
- AI Agent Studio: Designed the GenAI tooling layer for Automation Anywhere's platform — helped citizen developers (non-coders) build AI agents using natural language, with full audit trails and governance controls for enterprise admins. Platform runs 400M+ automations per year.
- macOS Automation Packages: First-ever Keynote and Numbers automation packages for Automation Anywhere — brought enterprise workflow automation natively to Mac, reaching 100M+ Mac users.
- Enterprise Governance UX: Designed RBAC (role-based access control), audit trails, data masking, and compliance interfaces for regulated enterprise environments.
- Pathfinder Academy: Unified 5 disconnected enterprise learning platforms into one cohesive experience. Achieved 97% engagement rate, 271 monthly certifications, went from 5 platforms to 1.

WHAT SHE'S GOOD AT:
- Tackling complex problems — she doesn't shy away from ambiguity or scope; she digs in, maps it out, and finds the path through
- Systems thinking — she can hold the full complexity of a product and still find the clearest path for users
- Deep research — she goes beyond surface-level discovery; she interviews, synthesizes, and comes back with a point of view
- Designing for hard problems: complex workflow builders, enterprise governance interfaces, data-heavy admin tools — the kind of work that requires deep understanding of the problem, not just pattern matching
- AI and automation UX — she's been working in this space since 2021, well before it became a crowded field
- Bridging engineering and design — her CS background means she can engage with technical constraints directly, not just hand off specs and hope for the best
- Learning and adapting quickly — she gets up to speed on new teams, tools, and domains without needing a long ramp-up
- Delivering on time — she's reliable; she estimates well, flags blockers early, and follows through
- User research, Figma, Framer, AI-assisted design workflows

HER PERSONALITY AND WORK STYLE:
- Morning person, genuinely high-energy in the right environment
- Extrovert — she gets energy from collaboration, conversation, and being around people
- Curious by nature — she's always asking why, exploring adjacent fields, and connecting dots across disciplines
- Loves to explore and try new things — new tools, new places, new approaches; she doesn't default to the familiar
- Draws on whiteboards, brings structure to ambiguous problems
- Foodie — obsessed with Trader Joe's, loves trying new restaurants, cooks momos (the dumplings, which she is partially named after)
- Paints, gardens, plays piano
- Moved from engineering to design against the expected path — she makes unconventional moves when she believes in them
- Coded this entire portfolio herself using Claude (the AI) and Framer — yes, the chatbot you're talking to right now

WHAT SHE'S LOOKING FOR:
- Senior Product Designer or Product Designer II roles
- Available July/August 2026 (internships from May 2026)
- Requires F-1 visa sponsorship
- Open to remote, hybrid, or onsite
- Values: strong team culture over brand name, real learning environment, space to experiment and push craft

CONTACT:
- Email: soni7sonal@gmail.com
- LinkedIn: linkedin.com/in/sonal-soni

HOW TO RESPOND:
- 2–4 sentences max. Conversational, specific, grounded.
- NEVER use emojis — not a single one, not even at the end of a sentence.
- NEVER use informal slang or dismissive descriptors. Avoid words like "unsexy", "nerdy", "boring", "nobody wants to touch it", "grind", "beast mode", or anything that sounds like tech-bro casualness.
- No filler phrases: no "Great question!", no "Absolutely!", no "Of course!"
- Tone: like a thoughtful colleague who knows the work well and can describe it with precision and warmth — not a hype machine, not a recruiter, not a friend texting.
- If asked what she's good at: "She specializes in complex product surfaces — workflow builders, governance tools, enterprise admin interfaces. The kind of work that requires real understanding of the system, not just visual polish. She's thorough in her research, reliable on delivery, and adapts fast to new teams and domains. And she's been doing AI and automation UX since 2021."
- If asked about CCA: "She's completing her Master of Design in Interaction Design at CCA in San Francisco — graduating Summer 2026. It's where she's developing the strategic and leadership side of her design practice, working with faculty from Apple, IDEO, and Google."
- If asked about availability: "She's available from July/August 2026, with internship availability from May. Open to any location — remote, hybrid, or onsite."
- If asked specifically about visa or sponsorship: "She's on an F-1 visa and will need sponsorship. She's been transparent about this throughout her job search."
- If asked something you genuinely don't know: "I don't have a clear answer on that one — you'd get a better response reaching out to Sonal directly at soni7sonal@gmail.com."
- Never say anything like "Ohhhhhh SHIT!" or informal exclamations. Stay composed and precise.`,
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                }),
            })
            const data = await res.json()
            if (data.content?.[0]) {
                const reply = data.content[0].text
                if (reply.toLowerCase().includes("don't have a great answer") || reply.toLowerCase().includes("reach out to sonal directly")) {
                    fetch("https://formsubmit.co/ajax/soni7sonal@gmail.com", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({ name: "Momo AI", message: `Unknown Question: ${text}\n\nTimestamp: ${new Date().toISOString()}` }),
                    }).catch(() => {})
                }
                setMessages(prev => [...prev, { role: "assistant", content: reply }])
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Email soni7sonal@gmail.com directly!" }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ background: "#fff", borderRadius: RADIUS.xl, overflow: "hidden", border: `1px solid ${BORDER}`, boxShadow: SHADOW.panel }}>

            {/* header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
                <MomoAvatar size={34} />
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, letterSpacing: "-0.01em" }}>Momo</span>
                    <span style={{ fontSize: 11, color: MUTED }}>Sonal's AI assistant</span>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: MUTED }}>online</span>
                </div>
            </div>

            {/* messages */}
            <div style={{ height: 300, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                        {msg.role === "assistant" && (
                            <MomoAvatar size={28} />
                        )}
                        <div style={{
                            maxWidth: "76%",
                            padding: "10px 14px",
                            borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                            background: msg.role === "user" ? PURPLE : BG_ALT,
                            color: msg.role === "user" ? "#fff" : BODY,
                            fontSize: 13.5,
                            lineHeight: 1.65,
                            letterSpacing: "-0.005em",
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* typing indicator */}
                {isLoading && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                        <MomoAvatar size={28} />
                        <div style={{ background: BG_ALT, borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: 4 }}>
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 5, height: 5, borderRadius: "50%", background: PURPLE }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* suggested prompts — pill chips, shown before first message */}
                <AnimatePresence>
                    {!hasUserSent && (
                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
                            style={{ display: "flex", flexWrap: "wrap", gap: 7, paddingLeft: 36, marginTop: 4 }}>
                            {SUGGESTED_PROMPTS.map((p, idx) => (
                                <motion.button key={p.label}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22, delay: 0.2 + idx * 0.06 }}
                                    onClick={() => sendMessage(p.q)}
                                    whileHover={{ background: PURPLE_SUBTLE, borderColor: PURPLE_HOVER }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        background: "rgba(26,26,26,0.04)",
                                        border: `1px solid ${BORDER}`,
                                        borderRadius: RADIUS.pill,
                                        padding: "6px 14px",
                                        color: BODY,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        lineHeight: 1,
                                        fontFamily: "inherit",
                                    }}>
                                    {p.label}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* tamagotchi pet */}
            <MomoTamagotchi />

            {/* input */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, background: BG }}>
                <input
                    type="text" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                    placeholder="Ask Momo anything..."
                    disabled={isLoading}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: TEXT, fontSize: 13.5, fontFamily: "inherit", caretColor: PURPLE }}
                />
                <motion.button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} transition={{ duration: 0.12 }}
                    style={{ background: PURPLE, border: "none", borderRadius: RADIUS.sm, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", opacity: isLoading || !input.trim() ? 0.35 : 1, flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.button>
            </div>
        </div>
    )
}
// ─────────────────────────────────────────────────────────────────────────────

interface Project { num: string; title: string; tag: string; year: string; description: string; accent: string; bgFrom: string; bgTo: string; imgLabel: string; video?: string; pills?: string[]; subtitle?: string; stats?: { value: string; label: string }[]; spaceCover?: boolean; href?: string; passwordProtected?: boolean }
interface TimelineEntry { year: string; role: string; place: string; current: boolean; logo?: string; logoCover?: boolean }

const PROJECTS: Project[] = [
    { num: "01", title: "AI Agent Studio", tag: "Enterprise · AI", year: "2024", description: "GenAI tooling for developers who don't know prompt engineering — and governance for admins who audit what they build.", accent: PURPLE_SUBTLE, bgFrom: "rgba(145,75,241,0.12)", bgTo: "rgba(180,130,255,0.06)", imgLabel: "AI / Enterprise", video: "https://files.catbox.moe/ecqocs.mov", pills: ["Citizen Development", "Low code/no code", "Agentic UX", "Governance First"], subtitle: "No-code infrastructure for Citizen Developers to build and govern autonomous agents.", stats: [{ value: "30%", label: "Faster Build Time" }, { value: "10x", label: "Workforce Scale" }, { value: "100%", label: "Auditable Logic" }], passwordProtected: true },
    { num: "02", title: "Apple Keynote Package", tag: "Enterprise · macOS", year: "2023-2024", description: "Built the automation packages that brought enterprise workflows to 100M+ Mac users — Keynote and Numbers, designed natively.", accent: "rgba(0,122,255,0.08)", bgFrom: "rgba(0,122,255,0.1)", bgTo: "rgba(100,180,255,0.04)", imgLabel: "macOS / Enterprise", video: "https://res.cloudinary.com/dg3ftzryf/video/upload/v1776039028/Screen_Recording_2026-04-12_at_5.09.46_PM_baelml.mov", pills: ["Keynote Package", "Citizen Developer", "Mac Users", "Property Panel Redesign"], subtitle: "Designing 20+ automation actions for Mac enterprise users.", stats: [{ value: "20+", label: "Actions Designed" }, { value: "4→1", label: "Packages Referenced" }, { value: "23%", label: "Enterprise Mac Market" }] },
    { num: "03", title: "Pathfinder Academy", tag: "Ed-tech · Product", year: "2022", description: "Unified 5 disconnected platforms into one mission-driven experience.", subtitle: "Unified 5 disconnected platforms into one mission-driven experience.", accent: "rgba(52,199,89,0.08)", bgFrom: "rgba(52,199,89,0.1)", bgTo: "rgba(100,220,140,0.04)", imgLabel: "Ed-tech / Product", spaceCover: true, stats: [{ value: "97%", label: "Engagement Rate" }, { value: "271", label: "Monthly Certifications" }, { value: "5 → 1", label: "Platform Consolidation" }], pills: ["Enterprise Learning", "Unified Experience", "Community Engagement", "Design System & Components"], href: "/pathfinder-academy" },
]

const WORDS = ["automating.", "waking with the sun.", "unlearning.", "simplifying scale.", "elevating the energy."]


const TIMELINE: TimelineEntry[] = [
    { year: "2015", role: "B.Tech · CS & Engineering", place: "Mody University",    current: false, logo: "https://files.catbox.moe/2x5hdm.jpg",    logoCover: true },
    { year: "2019", role: "Design & Innovation",        place: "ISDI Mumbai",         current: false, logo: "https://files.catbox.moe/13t3wi.jpg" },
    { year: "2020", role: "Sugar Project",              place: "Hefei, China",         current: false, logo: "https://files.catbox.moe/v8kf90.png" },
    { year: "2021", role: "UX Designer",                place: "Automation Anywhere", current: false, logo: "https://www.automationanywhere.com/sites/default/files/images/AAI/automation-anywhere-logo-a-only.png" },
    { year: "2025", role: "MDes · Interaction Design",  place: "CCA San Francisco",   current: true,  logo: "https://files.catbox.moe/qrnsva.jpg",    logoCover: true },
]


function useWordCycle(list: string[], interval = 3500): string {
    const [i, setI] = useState(0)
    useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % list.length), interval); return () => clearInterval(t) }, [])
    return list[i]
}

// ── TINY FLOWER + BUNNY CHARACTER (nav logo) ─────────────────────────────────
function TinyFlowerCharacter() {
    const [isNight, setIsNight] = useState(() => { const h = new Date().getHours(); return h >= 22 || h < 6 })
    useEffect(() => {
        const check = () => { const h = new Date().getHours(); setIsNight(h >= 22 || h < 6) }
        const t = setInterval(check, 60000)
        return () => clearInterval(t)
    }, [])

    // ViewBox "0 0 50 100" · 28×42px · scale 0.42 CSS px / SVG unit
    // Shorter pot: rim y=62–69, body y=68–84. Sleep: head cy=55 — visible above rim (top y=47).
    // Awake rest: head cy=76, ears y=67–78 — all inside pot. Peek: y=-17 CSS → head SVG y≈35, ears y≈26. ✓
    const T  = [0, 0.12, 0.22, 0.34, 0.46, 0.56, 0.64, 0.73, 0.84, 1.0]
    const pY = [0,   0,  -17,  -17,  -17,  -17,  -17,  -17,    0,   0]
    const pR = [0,   0,    0,   -8,   -8,    8,    8,    0,    0,   0]

    return (
        <div style={{ position: "relative", width: 28, height: 42, flexShrink: 0, alignSelf: "center" }}>
            <svg width="28" height="42" viewBox="0 0 50 100" fill="none" style={{ overflow: "visible" }}>

                {/* ── FLOWER — 4 petals, bigger, sways gently ── */}
                <motion.g
                    animate={{ rotate: [0, -4, 3, -2, 0] }}
                    transition={{ duration: 4, times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                >
                    <path d="M25 63 Q24 48 25 22" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <motion.g
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                        {[0, 72, 144, 216, 288].map(a => {
                            const cx = 25 + Math.sin(a * Math.PI / 180) * 7
                            const cy = 22 - Math.cos(a * Math.PI / 180) * 7
                            return (
                                <g key={a}>
                                    <ellipse cx={cx} cy={cy} rx="3.5" ry="5.5" transform={`rotate(${a},${cx},${cy})`} fill={PURPLE} opacity="0.28" />
                                    <ellipse cx={cx} cy={cy} rx="3.5" ry="5.5" transform={`rotate(${a},${cx},${cy})`} stroke={PURPLE} strokeWidth="1.1" fill="none" />
                                </g>
                            )
                        })}
                        <circle cx="25" cy="22" r="5" fill={PURPLE} opacity="0.85" />
                    </motion.g>
                </motion.g>

                {/* ── BUNNY — rendered before pot so pot fill masks body at rest ── */}
                {isNight ? (
                    /* SLEEP — head cy=55 pokes above rim (top y=47), ears y=43–54 all above rim y=62 */
                    <motion.g
                        animate={{ y: [0, -1, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <rect x="16.5" y="43" width="4.5" height="12" rx="2.25" stroke={TEXT} strokeWidth="1.1" fill={BG} />
                        <rect x="29" y="43" width="4.5" height="12" rx="2.25" stroke={TEXT} strokeWidth="1.1" fill={BG} />
                        <circle cx="25" cy="55" r="8" fill={BG} stroke={TEXT} strokeWidth="1.2" />
                        {/* closed-eye arcs */}
                        <path d="M20.5 54 Q22 52 23.5 54" stroke={TEXT} strokeWidth="1.1" fill="none" strokeLinecap="round" />
                        <path d="M26.5 54 Q28 52 29.5 54" stroke={TEXT} strokeWidth="1.1" fill="none" strokeLinecap="round" />
                        <ellipse cx="25" cy="57" rx="1.2" ry="0.8" fill={TEXT} opacity="0.3" />
                    </motion.g>
                ) : (
                    /* AWAKE — head cy=76, ears y=67–78 inside pot at rest; peek y=-17 CSS */
                    <motion.g
                        animate={{ y: pY }}
                        transition={{ duration: 11, times: T, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                    >
                        <motion.g
                            animate={{ rotate: pR }}
                            transition={{ duration: 11, times: T, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                            {/* left ear — twitches on its own */}
                            <motion.rect
                                x="17" y="67" width="4.5" height="12" rx="2.25"
                                stroke={TEXT} strokeWidth="1.1" fill={BG}
                                animate={{ rotate: [0, -9, 0, -5, 0, 0, 0, 0, 0, 0] }}
                                transition={{ duration: 11, times: T, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                            />
                            {/* right ear — twitches opposite */}
                            <motion.rect
                                x="28.5" y="67" width="4.5" height="12" rx="2.25"
                                stroke={TEXT} strokeWidth="1.1" fill={BG}
                                animate={{ rotate: [0, 7, 0, 4, 0, 0, 0, 0, 0, 0] }}
                                transition={{ duration: 11, times: T, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                            />
                            {/* head */}
                            <circle cx="25" cy="76" r="7.5" fill={BG} stroke={TEXT} strokeWidth="1.2" />
                            {/* eyes with blink */}
                            <motion.g
                                animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
                                transition={{ duration: 11, times: [0, 0.40, 0.41, 0.42, 1], repeat: Infinity, delay: 1.5 }}
                                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                            >
                                <circle cx="21.5" cy="75.5" r="1.5" fill={TEXT} />
                                <circle cx="28.5" cy="75.5" r="1.5" fill={TEXT} />
                                <circle cx="22.2" cy="74.8" r="0.55" fill={BG} />
                                <circle cx="29.2" cy="74.8" r="0.55" fill={BG} />
                            </motion.g>
                            {/* nose + tiny smile */}
                            <ellipse cx="25" cy="78.5" rx="1.3" ry="0.9" fill={TEXT} opacity="0.4" />
                            <path d="M23.5 79.5 Q25 81 26.5 79.5" stroke={TEXT} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.5" />
                        </motion.g>
                    </motion.g>
                )}

                {/* ── POT — drawn after bunny; opaque BG fill masks bunny at rest ── */}
                {/* Shorter pot: body y=68–84 (16 units vs 24 before), rim y=62–69, base y=83–86.5 */}
                <path d="M11 68 L13 84 L37 84 L39 68 Z" fill={BG} stroke={TEXT} strokeWidth="1.3" strokeLinejoin="round" />
                <rect x="11" y="83" width="28" height="3.5" rx="1.75" fill={BG} stroke={TEXT} strokeWidth="1.1" />
                <rect x="8" y="62" width="34" height="7" rx="3.5" fill={BG} stroke={TEXT} strokeWidth="1.2" />
                <path d="M13 65.5 Q25 62.5 37 65.5" stroke={TEXT} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.38" />

                {/* ── FLOATING Zs — night only ── */}
                {isNight && (<>
                    <motion.g animate={{ opacity: [0, 0.55, 0], y: [0, -10] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.8, ease: "easeOut" }}>
                        <text x="34" y="57" fontSize="6" fill={TEXT} fontFamily="Georgia, serif" fontWeight="700">z</text>
                    </motion.g>
                    <motion.g animate={{ opacity: [0, 0.38, 0], y: [0, -12] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2.4, ease: "easeOut" }}>
                        <text x="30" y="55" fontSize="4.5" fill={TEXT} fontFamily="Georgia, serif" fontWeight="700">z</text>
                    </motion.g>
                    <motion.g animate={{ opacity: [0, 0.28, 0], y: [0, -14] }} transition={{ duration: 4.5, repeat: Infinity, delay: 4.1, ease: "easeOut" }}>
                        <text x="36" y="54" fontSize="3.5" fill={TEXT} fontFamily="Georgia, serif" fontWeight="700">z</text>
                    </motion.g>
                </>)}
            </svg>
        </div>
    )
}

function Flower({ size, opacity, duration, top, left, right, delay = 0 }: { size: number; opacity: number; duration: number; top?: string | number; left?: string | number; right?: string | number; delay?: number }) {
    const arm = size * 0.18; const len = size * 0.46
    return (
        <motion.div animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: "linear", delay }}
            style={{ position: "absolute", top, left, right, width: size, height: size, opacity, pointerEvents: "none" }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
                <g transform={`translate(${size / 2}, ${size / 2})`}>
                    {[0, 60, 120].map(angle => <rect key={angle} x={-arm / 2} y={-len} width={arm} height={len * 2} rx={arm / 2} fill={PURPLE} transform={`rotate(${angle})`} />)}
                </g>
            </svg>
        </motion.div>
    )
}

function Reveal({ children, delay = 0, y = 16 }: { children: React.ReactNode; delay?: number; y?: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-40px 0px" })
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease }}>
            {children}
        </motion.div>
    )
}

// ── BEFORE / AFTER SLIDER ────────────────────────────────────────────────────
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pct = useMotionValue(53)
    const smoothPct = useSpring(pct, { stiffness: 600, damping: 48, mass: 0.35 })
    const [dragging, setDragging] = useState(false)

    const clipPath   = useTransform(smoothPct, v => `inset(0 ${100 - v}% 0 0)`)
    const handleLeft = useTransform(smoothPct, v => `${v}%`)

    const seek = (clientX: number) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        pct.set(Math.max(1, Math.min(99, ((clientX - rect.left) / rect.width) * 100)))
    }

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", cursor: "col-resize", touchAction: "none", userSelect: "none" }}
            onPointerDown={e => { containerRef.current?.setPointerCapture(e.pointerId); setDragging(true); seek(e.clientX) }}
            onPointerMove={e => { if (dragging) seek(e.clientX) }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
        >
            {/* After image — full width, bottom layer */}
            <img src={after} draggable={false}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%", display: "block", pointerEvents: "none" }} />

            {/* Before image — clipped to left of divider */}
            <motion.div style={{ position: "absolute", inset: 0, clipPath, willChange: "clip-path" }}>
                <img src={before} draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%", display: "block" }} />
            </motion.div>

            {/* Divider + handle */}
            <motion.div style={{ position: "absolute", top: 0, bottom: 0, left: handleLeft, transform: "translateX(-50%)", pointerEvents: "none", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", willChange: "left" }}>
                <div style={{ width: 1.5, flex: 1, background: "rgba(255,255,255,0.55)" }} />
                {/* Handle circle */}
                <div style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.92)",
                    boxShadow: dragging ? "0 4px 24px rgba(0,0,0,0.22)" : "0 2px 12px rgba(0,0,0,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "box-shadow 0.15s",
                }}>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                        <path d="M4 5H1M15 5H12M4 1L1 5L4 9M12 1L15 5L12 9" stroke="rgba(26,26,26,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </motion.div>
        </div>
    )
}

// ── SOUNDCLOUD MUSIC PILL ─────────────────────────────────────────────────────
function SoundCloudPill() {
    const [playing, setPlaying]   = useState(false)
    const [title, setTitle]       = useState("")
    const [art, setArt]           = useState("")
    const [progress, setProgress] = useState(0)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const widgetRef = useRef<any>(null)

    const SC_URL = "https://soundcloud.com/sonal-soni-3/sets/portfolio"

    useEffect(() => {
        const load = () => {
            if (document.getElementById("sc-api-js")) { initWidget(); return }
            const s = document.createElement("script")
            s.id = "sc-api-js"
            s.src = "https://w.soundcloud.com/player/api.js"
            s.onload = initWidget
            document.head.appendChild(s)
        }
        const t = setTimeout(load, 400)
        return () => clearTimeout(t)
    }, [])

    const initWidget = () => {
        const SC = (window as any).SC
        if (!SC || !iframeRef.current) { setTimeout(initWidget, 200); return }
        const w = SC.Widget(iframeRef.current)
        widgetRef.current = w
        w.bind(SC.Widget.Events.READY, () => {
            fetchTrack()
        })
        w.bind(SC.Widget.Events.PLAY,  () => { setPlaying(true);  fetchTrack() })
        w.bind(SC.Widget.Events.PAUSE, () => setPlaying(false))
        w.bind(SC.Widget.Events.FINISH,() => { setPlaying(false); setProgress(0) })
        w.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => setProgress(e.relativePosition || 0))
    }

    const fetchTrack = () => {
        const w = widgetRef.current; if (!w) return
        w.getCurrentSound((s: any) => {
            if (!s) return
            setTitle(s.title || "")
            const img = (s.artwork_url || s.user?.avatar_url || "").replace("-large", "-t300x300")
            setArt(img)
        })
    }

    const hasPlayedRef = useRef(false)
    const toggle = () => {
        const w = widgetRef.current; if (!w) return
        if (playing) { w.pause(); return }
        if (!hasPlayedRef.current) {
            hasPlayedRef.current = true
            w.getSounds((sounds: any[]) => {
                if (sounds && sounds.length > 1) {
                    const idx = Math.floor(Math.random() * sounds.length)
                    w.skip(idx)
                }
                w.play()
            })
        } else {
            w.play()
        }
    }

    const label = title || "click to listen ♫"
    const marquee = playing && label.length > 16

    return (
        <>
            <iframe
                ref={iframeRef}
                id="sc-widget-iframe"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(SC_URL)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&liking=false&download=false&sharing=false`}
                allow="autoplay"
                style={{ display: "none", position: "absolute", width: 0, height: 0, border: 0 }}
            />
            <motion.div
                onClick={toggle}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{
                    display: "inline-flex", alignItems: "center",
                    background: PILL_BG, borderRadius: RADIUS.pill,
                    height: 34, paddingRight: 14, overflow: "hidden",
                    cursor: "pointer", userSelect: "none", position: "relative",
                }}
            >
                {/* CD disc — entire disc spins when playing */}
                <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    marginLeft: 3, zIndex: 2, position: "relative",
                }}>
                    {/* Shadow */}
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "0 1px 6px rgba(0,0,0,0.18)", zIndex: 0, pointerEvents: "none" }} />
                    {/* Spinning disc — artwork + rings rotate together */}
                    <motion.div
                        style={{
                            position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
                            background: art ? "transparent" : "rgba(26,26,26,0.10)",
                            border: `2px solid ${BG}`,
                        }}
                        animate={playing ? { rotate: 360 } : { rotate: 0 }}
                        transition={playing ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Artwork */}
                        {art
                            ? <img src={art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                              </div>
                        }
                        {/* Concentric ring overlays */}
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                            <div style={{ position: "absolute", width: 19, height: 19, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.32)" }} />
                            <div style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.32)" }} />
                            <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.32)" }} />
                        </div>
                        {/* Center hole */}
                        <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: BG, border: "1px solid rgba(200,200,200,0.4)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 4 }} />
                    </motion.div>
                    {/* Light flare overlay */}
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none", zIndex: 5, overflow: "hidden" }}>
                        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" style={{ display: "block" }}>
                            <defs>
                                <filter id="cd-flare" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                                </filter>
                            </defs>
                            <ellipse cx="13" cy="11" rx="6" ry="3" fill="white" opacity="0.22" filter="url(#cd-flare)" transform="rotate(-30 13 11)" />
                            <ellipse cx="10" cy="14" rx="2.5" ry="1.2" fill="white" opacity="0.13" filter="url(#cd-flare)" transform="rotate(-30 10 14)" />
                        </svg>
                    </div>
                </div>

                {/* Label + progress bar */}
                <div style={{ paddingLeft: 8, overflow: "hidden", maxWidth: 88 }}>
                    <div style={{ overflow: "hidden", height: "1.25em", position: "relative" }}>
                        {marquee ? (
                            <motion.div
                                key={title}
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                style={{ display: "inline-flex", whiteSpace: "nowrap" }}
                            >
                                <span style={{ fontSize: 12, color: TEXT, fontWeight: 450, letterSpacing: "-0.01em" }}>{label}&nbsp;&nbsp;&nbsp;</span>
                                <span style={{ fontSize: 12, color: TEXT, fontWeight: 450, letterSpacing: "-0.01em" }}>{label}&nbsp;&nbsp;&nbsp;</span>
                            </motion.div>
                        ) : (
                            <span style={{ fontSize: 12, color: TEXT, fontWeight: 450, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{label}</span>
                        )}
                    </div>
                    {/* Progress bar */}
                    <div style={{ marginTop: 4, height: 2, borderRadius: 1, background: "rgba(26,26,26,0.08)", position: "relative", overflow: "hidden" }}>
                        <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0,
                            width: `${progress * 100}%`,
                            background: playing ? PURPLE : "rgba(26,26,26,0.15)",
                            borderRadius: 1, transition: "width 0.5s linear",
                        }} />
                    </div>
                </div>
            </motion.div>
        </>
    )
}

function NavPill({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    const [hov, setHov] = useState(false)
    return (
        <motion.a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            animate={{ background: hov ? "rgba(26,26,26,0.09)" : PILL_BG }} transition={{ duration: DUR.fast }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: RADIUS.pill, fontSize: 13, color: TEXT, textDecoration: "none", fontWeight: 400, whiteSpace: "nowrap" }}>
            {icon && <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>}
            {children}
        </motion.a>
    )
}

function LinkedInIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function ResumeIcon() {
    return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}

const CONTACT_LINKS = [
    {
        label: "email",
        value: "soni7sonal@gmail.com",
        href: "mailto:soni7sonal@gmail.com",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>,
    },
    {
        label: "linkedin",
        value: "linkedin.com/in/sonal-soni",
        href: "https://linkedin.com/in/sonal-soni",
        target: "_blank",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
        label: "behance",
        value: "behance.net/soni7sonal3daa",
        href: "https://www.behance.net/soni7sonal3daa",
        target: "_blank",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.051-1.891-5.051-5.23 0-3.16 1.899-5.27 5.063-5.27 3.036 0 4.802 1.96 5.098 5.09.023.333.022.5-.005.643H16.73c.12 1.25.983 1.91 2.018 1.91.93 0 1.494-.47 1.83-1.143H23.726zM16.781 11h3.68c-.102-1.126-.773-1.75-1.81-1.75-1.044 0-1.747.637-1.87 1.75z"/><path d="M5 7h4.5c3.04 0 3.965 1.68 3.965 3.153 0 1.37-.752 2.14-1.54 2.47.956.3 1.965 1.136 1.965 2.814C13.89 17.567 12.537 19 9.39 19H5V7zm4.195 4.5c.974 0 1.43-.545 1.43-1.27 0-.766-.49-1.23-1.43-1.23H7.5v2.5h1.695zm.216 4.5c1.07 0 1.589-.57 1.589-1.394 0-.852-.6-1.356-1.607-1.356H7.5v2.75h1.911z"/></svg>,
    },
    {
        label: "resume",
        value: "view PDF →",
        href: "https://raw.githubusercontent.com/soni7sonal/portfolio/main/Sonal_Resume.pdf",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
]

function ordinal(n: number): string {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n.toLocaleString() + (s[(v - 20) % 10] || s[v] || s[0])
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    const [hov, setHov] = useState(false)
    return (
        <motion.a
            href={href} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            animate={{ color: hov ? PURPLE : TEXT }}
            transition={{ duration: 0.15 }}
            style={{ textDecoration: "none", fontWeight: 500, borderBottom: `1px solid ${hov ? PURPLE_HOVER : BORDER}`, paddingBottom: 1, transition: `border-color ${DUR.fast}s` }}
        >
            {children}
        </motion.a>
    )
}

function FooterBar() {
    const [count, setCount] = useState<number | null>(null)
    useEffect(() => {
        fetch("https://api.counterapi.dev/v1/sonalsoni-portfolio/visits/up")
            .then(r => r.json())
            .then(d => setCount(d.count))
            .catch(() => {})
    }, [])
    return (
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                style={{ maxWidth: 880, margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.01em", textAlign: "center", lineHeight: 1.6 }}>
                    Coded with <FooterLink href="https://www.cursor.com">Cursor</FooterLink> · Vibed with <FooterLink href="https://claude.ai">Claude</FooterLink> · Designed in <FooterLink href="https://www.framer.com">Framer</FooterLink>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.01em" }}>© 2026 Sonal Soni</span>
                    {count !== null && (
                        <>
                            <span style={{ fontSize: 11, color: BORDER }}>·</span>
                            <span style={{ ...TS.mono, fontSize: 10, letterSpacing: "0.04em", color: MUTED }}>
                                {ordinal(count).toUpperCase()} VISITOR <span style={{ opacity: 0.6 }}>:)</span>
                            </span>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

function ContactLink({ item }: { item: typeof CONTACT_LINKS[0] }) {
    const [hov, setHov] = useState(false)
    return (
        <motion.a
            href={item.href}
            target={item.target}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            animate={{
                borderColor: hov ? PURPLE_HOVER : BORDER,
                background: hov ? PURPLE_SUBTLE : "#fff",
            }}
            transition={{ duration: DUR.fast }}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", textDecoration: "none", borderRadius: RADIUS.md, border: `1px solid ${BORDER}`, cursor: "pointer" }}
        >
            <motion.div
                animate={{ color: hov ? PURPLE : MUTED }}
                transition={{ duration: 0.15 }}
                style={{ width: 38, height: 38, borderRadius: RADIUS.sm, background: hov ? PURPLE_SUBTLE : BG_ALT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: `background ${DUR.fast}s` }}
            >
                {item.icon}
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <span style={{ ...TS.label, fontSize: 10 }}>{item.label}</span>
                <motion.span animate={{ color: hov ? PURPLE : TEXT }} transition={{ duration: 0.15 }} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</motion.span>
            </div>
            <motion.span animate={{ x: hov ? 3 : 0, opacity: hov ? 0.8 : 0.2, color: PURPLE }} transition={{ duration: 0.15 }} style={{ marginLeft: "auto", fontSize: 15, flexShrink: 0 }}>→</motion.span>
        </motion.a>
    )
}

// ── POLAROID STACK ────────────────────────────────────────────────────────────
interface PolaroidItem {
    src: string          // image or GIF url
    alt: string
    caption?: string
    rotate: number       // initial tilt in degrees
    x: number            // initial x offset
    y: number            // initial y offset
    badge?: { src: string; label: string }  // optional overlay badge
}

const POLAROID_ITEMS: PolaroidItem[] = [
    { src: "https://files.catbox.moe/26ulgg.jpg",     alt: "skydiving",    caption: "jumped from 18,000 ft over silicon valley. still processing it.",                             rotate: -9,  x: -500, y:  20 },
    { src: "https://files.catbox.moe/ckaw6k.jpeg",  alt: "canvas",       caption: "first canvas i ever sold. never thought someone would pay for something i made just for joy.", rotate:  4,  x: -340, y: -65 },
    { src: "https://files.catbox.moe/1x588f.png",    alt: "mom",          caption: "i manage this from wherever i am. my mom makes it actually work.",                            rotate: -13, x: -175, y:  55, badge: { src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", label: "Airbnb" } },
    { src: "https://files.catbox.moe/zz1kje.png",    alt: "bangalore",    caption: "core memories with the best design team in bangalore.",                                        rotate:  6,  x:  -20, y: -40 },
    { src: "https://files.catbox.moe/skbiy9.jpeg",   alt: "food",         caption: "always up for Bánh Xèo and a global potluck.",                                             rotate:  10, x:  145, y: -15 },
    { src: "https://files.catbox.moe/zjvyp0.jpeg",   alt: "karaoke",      caption: "my SF family. loud, warm, and always down for karaoke.",                                       rotate: -7,  x:  300, y:  40 },
    { src: "data:image/jpeg;base64,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",   alt: "atv",          caption: "always yes to things i've never tried before.",                                                rotate:  3,  x: -395, y:  80 },
    { src: "https://files.catbox.moe/y8t4lw.gif",    alt: "art",          caption: "i never knew art could exist in this form.",                                                   rotate:  7,  x:  450, y: -55 },
    { src: "https://files.catbox.moe/qs7io6.jpg",    alt: "hotpot",       caption: "spice, steam, and the best Hotpot ever tried.",                                          rotate:  9,  x:  570, y: -35 },
]

const STAMP_OPTIONS = [
    { emoji: "\u2764\uFE0F", label: "heart" },
    { emoji: "\uD83E\uDD2F", label: "mind-blown" },
    { emoji: "\uD83D\uDD25", label: "fire" },
]

interface PlacedStamp { emoji: string; x: number; y: number; id: number }

function Polaroid({ item, zIndex }: { item: PolaroidItem; zIndex: number }) {
    const x = useMotionValue(item.x)
    const y = useMotionValue(item.y)
    const [isDragging, setIsDragging] = useState(false)
    const [lifted, setLifted] = useState(false)
    const [stamps, setStamps] = useState<PlacedStamp[]>([])
    const [showStampBar, setShowStampBar] = useState(false)
    const [imgError, setImgError] = useState(false)
    const stampIdRef = useRef(0)
    const photoRef = useRef<HTMLDivElement>(null)

    const addStamp = (emoji: string) => {
        // place stamp at random position on the photo
        const sx = 15 + Math.random() * 70 // 15-85% x
        const sy = 15 + Math.random() * 70 // 15-85% y
        const id = stampIdRef.current++
        setStamps(prev => [...prev, { emoji, x: sx, y: sy, id }])
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.08}
            style={{ x, y, zIndex: lifted ? 50 : zIndex, position: "absolute", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
            initial={{ rotate: item.rotate }}
            whileHover={{ scale: 1.06, rotate: item.rotate * 0.35 }}
            whileDrag={{ scale: 1.09, rotate: item.rotate * 0.2 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            onDragStart={() => { setIsDragging(true); setLifted(true) }}
            onDragEnd={() => setIsDragging(false)}
            onMouseEnter={() => setShowStampBar(true)}
            onMouseLeave={() => setShowStampBar(false)}
        >
            {/* Polaroid frame */}
            <div style={{
                background: "#fff",
                padding: "8px 8px 38px 8px",
                borderRadius: RADIUS.lg,
                border: "1px solid rgba(47,53,87,0.08)",
                boxShadow: isDragging
                    ? "0 20px 56px rgba(47,53,87,0.20), 0 4px 14px rgba(47,53,87,0.10)"
                    : "0 4px 12px rgba(47,53,87,0.10), 0 1px 2px rgba(47,53,87,0.05)",
                width: 240,
                userSelect: "none",
            }}>
                {/* Photo area */}
                <div ref={photoRef} style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#e0dfe8", borderRadius: "10px 10px 2px 2px", overflow: "hidden", border: "1px solid #f0f0f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.src && !imgError ? (
                        <img src={item.src} alt={item.alt} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                    ) : (
                        <svg width="100%" height="100%" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                            <rect width="160" height="160" fill="#dddde8" />
                            <rect x="55" y="48" width="50" height="40" rx="4" fill="#b8b8cb" />
                            <circle cx="80" cy="44" r="10" fill="#b8b8cb" />
                            <ellipse cx="80" cy="120" rx="38" ry="22" fill="#b8b8cb" />
                        </svg>
                    )}

                    {/* Placed stamps on photo */}
                    <AnimatePresence>
                        {stamps.map(s => (
                            <motion.div
                                key={s.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                style={{
                                    position: "absolute",
                                    left: `${s.x}%`, top: `${s.y}%`,
                                    transform: "translate(-50%, -50%)",
                                    fontSize: 18, lineHeight: 1,
                                    pointerEvents: "none",
                                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))",
                                }}
                            >
                                {s.emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Optional badge overlay */}
                    {item.badge && (
                        <div style={{
                            position: "absolute", bottom: 8, left: 8,
                            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                            borderRadius: RADIUS.sm, padding: "5px 10px",
                            display: "flex", alignItems: "center",
                            boxShadow: SHADOW.sm,
                            border: "1px solid rgba(255,255,255,0.6)",
                        }}>
                            <img src={item.badge.src} alt={item.badge.label} style={{ height: 16, width: "auto", display: "block", pointerEvents: "none" }} />
                        </div>
                    )}

                    {/* Stamp picker bar — appears on hover at bottom */}
                    <AnimatePresence>
                        {showStampBar && !isDragging && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: "absolute", bottom: 8, right: 8,
                                    background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
                                    borderRadius: RADIUS.pill, padding: "4px 6px",
                                    display: "flex", alignItems: "center", gap: 2,
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                                    border: "1px solid rgba(255,255,255,0.7)",
                                }}
                            >
                                {STAMP_OPTIONS.map(s => (
                                    <motion.button
                                        key={s.label}
                                        onClick={e => { e.stopPropagation(); addStamp(s.emoji) }}
                                        whileHover={{ scale: 1.25 }}
                                        whileTap={{ scale: 0.85 }}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            fontSize: 14, lineHeight: 1, padding: "3px 4px",
                                            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        {s.emoji}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Caption + stamp count */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "10px 4px 0", minHeight: 16 }}>
                    {item.caption && (
                        <p style={{ ...TS.mono, margin: 0, flex: 1, fontSize: 10.5, color: "rgba(47,53,87,0.38)", textAlign: "center", lineHeight: 1.3, letterSpacing: "0.01em" }}>{item.caption}</p>
                    )}
                </div>
                {stamps.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                        {Object.entries(stamps.reduce((acc, s) => { acc[s.emoji] = (acc[s.emoji] || 0) + 1; return acc }, {} as Record<string, number>)).map(([emoji, count]) => (
                            <span key={emoji} style={{
                                fontSize: 10, display: "inline-flex", alignItems: "center", gap: 2,
                                background: "rgba(145,75,241,0.06)", borderRadius: RADIUS.pill,
                                padding: "2px 7px 2px 4px", color: MUTED, ...TS.mono,
                            }}>
                                <span style={{ fontSize: 11 }}>{emoji}</span>
                                {count as number}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

function PolaroidStack() {
    const { isMobile } = useScreen()
    const xScale = isMobile ? 0.28 : 1
    const yScale = isMobile ? 0.45 : 1
    return (
        <section style={{ background: BG, padding: isMobile ? `${SPACE.xl}px 0 64px` : `${SPACE.xxl}px 0 140px`, overflow: "hidden", position: "relative" }}>
            <Flower size={isMobile ? 200 : 380} opacity={0.026} duration={90} top={-60} left={-100} />
            <Flower size={isMobile ? 90 : 160} opacity={0.02} duration={60} top={300} right={-40} delay={12} />
            <Flower size={isMobile ? 70 : 120} opacity={0.018} duration={45} top={80} right={200} delay={6} />
            <Container style={{ padding: isMobile ? "0 16px" : "0 40px" }}>
                <Reveal>
                    <SectionHeader eyebrow="everyone codes switches" title="Here's who I am when I'm not designing." />
                </Reveal>
            </Container>
            <div style={{ position: "relative", height: isMobile ? 360 : 520, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
                {POLAROID_ITEMS.map((item, i) => (
                    <Polaroid key={i} item={{ ...item, x: item.x * xScale, y: item.y * yScale }} zIndex={i + 1} />
                ))}
            </div>
        </section>
    )
}
// ─────────────────────────────────────────────────────────────────────────────

// ── SUSHI BELT ────────────────────────────────────────────────────────────────

function SushiNigiri({ color }: { color: string }) {
    return (
        <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="65" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <ellipse cx="27" cy="61" rx="23" ry="8" fill="#f6f6f0" stroke="#e2e2d8" strokeWidth="1"/>
            <path d="M6 50 Q27 41 48 50 L46 59 Q27 64 8 59Z" fill="#fafaf0" stroke="#dededa" strokeWidth="0.9"/>
            <path d="M8 41 Q27 31 46 41 L44 50 Q27 55 10 50Z" fill={color} opacity="0.91" stroke={color} strokeWidth="0.3"/>
            <path d="M12 38 Q27 33 42 38" stroke="rgba(255,255,255,0.48)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
    )
}

function SushiMaki({ color }: { color: string }) {
    return (
        <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="65" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <ellipse cx="27" cy="61" rx="23" ry="8" fill="#f6f6f0" stroke="#e2e2d8" strokeWidth="1"/>
            <circle cx="27" cy="42" r="21" fill="#253d30" stroke="#1a2e22" strokeWidth="1"/>
            {[0,45,90,135,180,225,270,315].map(a => (
                <circle key={a} cx={27+Math.cos(a*Math.PI/180)*16.5} cy={42+Math.sin(a*Math.PI/180)*16.5} r="1" fill="rgba(240,220,140,0.3)"/>
            ))}
            <circle cx="27" cy="42" r="15" fill="#fafaf0"/>
            <circle cx="27" cy="42" r="8" fill={color}/>
            <circle cx="24" cy="39" r="3.2" fill="rgba(255,255,255,0.2)"/>
        </svg>
    )
}

function SushiTamago() {
    return (
        <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="65" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <ellipse cx="27" cy="61" rx="23" ry="8" fill="#f6f6f0" stroke="#e2e2d8" strokeWidth="1"/>
            <path d="M6 52 Q27 44 48 52 L46 59 Q27 63 8 59Z" fill="#fafaf0" stroke="#dededa" strokeWidth="0.9"/>
            <rect x="8" y="37" width="38" height="17" rx="5.5" fill="#ffd53e" stroke="#e6be20" strokeWidth="0.9"/>
            <path d="M11 41 Q27 37 43 41" stroke="rgba(255,255,255,0.52)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <rect x="8" y="49" width="38" height="5" rx="2.2" fill="#253d30" opacity="0.86"/>
        </svg>
    )
}

function SushiEbi() {
    return (
        <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="65" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <ellipse cx="27" cy="61" rx="23" ry="8" fill="#f6f6f0" stroke="#e2e2d8" strokeWidth="1"/>
            <path d="M6 52 Q27 44 48 52 L46 59 Q27 63 8 59Z" fill="#fafaf0" stroke="#dededa" strokeWidth="0.9"/>
            <path d="M8 46 Q10 33 27 31 Q44 33 46 46 Q42 52 27 53 Q12 52 8 46Z" fill="#ffb898" stroke="#e89572" strokeWidth="0.9"/>
            <path d="M11 43 Q27 37 43 43" stroke="#d07850" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.55"/>
            <path d="M9 47 Q27 41 45 47" stroke="#d07850" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.3"/>
            <path d="M44 39 Q50 34 46 30 Q48 35 44 39Z" fill="#ffad88" stroke="#e89572" strokeWidth="0.8"/>
        </svg>
    )
}

function SushiGunkan() {
    return (
        <svg width="54" height="74" viewBox="0 0 54 74" fill="none">
            <ellipse cx="27" cy="71" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <ellipse cx="27" cy="67" rx="23" ry="8" fill="#f6f6f0" stroke="#e2e2d8" strokeWidth="1"/>
            <rect x="7" y="49" width="40" height="19" rx="4" fill="#253d30" stroke="#1a2e22" strokeWidth="1"/>
            <rect x="9" y="52" width="36" height="14" rx="2.5" fill="#fafaf0"/>
            {[11,18,25,32,39,46].map((x,i)=>(<circle key={i} cx={x} cy={46} r="6.5" fill="#ff6b35" stroke="#e05828" strokeWidth="0.7"/>))}
            {[14,21,28,35,42].map((x,i)=>(<circle key={i} cx={x} cy={40} r="5.8" fill="#ff6b35" stroke="#e05828" strokeWidth="0.7"/>))}
            {[11,18,25,32,39,46].map((x,i)=>(<circle key={i} cx={x-1.8} cy={44} r="2.2" fill="rgba(255,255,255,0.28)"/>))}
        </svg>
    )
}

function SushiOnigiri() {
    return (
        <svg width="54" height="68" viewBox="0 0 54 68" fill="none">
            <ellipse cx="27" cy="65" rx="23" ry="4.5" fill="rgba(0,0,0,0.07)"/>
            <path d="M7 54 Q7 33 27 22 Q47 33 47 54 Q45 62 27 64 Q9 62 7 54Z" fill="#fafaf0" stroke="#dededa" strokeWidth="1.1"/>
            <path d="M7 54 Q9 61 27 63 Q45 61 47 54 L45 53 Q43 60 27 61 Q11 60 9 53Z" fill="#253d30" opacity="0.86"/>
            <ellipse cx="27" cy="38" r="5.5" fill="#ff6b35" opacity="0.82"/>
        </svg>
    )
}

const BELT_TYPES = [
    "nigiri-salmon","maki-tuna","tamago","ebi","gunkan",
    "maki-cucumber","onigiri","nigiri-tuna","maki-salmon","ebi",
]

function SushiItem({ type }: { type: string }) {
    if (type === "maki-tuna")     return <SushiMaki color="#b82030"/>
    if (type === "maki-cucumber") return <SushiMaki color="#5cb86a"/>
    if (type === "maki-salmon")   return <SushiMaki color="#e8784a"/>
    if (type === "nigiri-salmon") return <SushiNigiri color="#e8784a"/>
    if (type === "nigiri-tuna")   return <SushiNigiri color="#b82030"/>
    if (type === "tamago")        return <SushiTamago/>
    if (type === "ebi")           return <SushiEbi/>
    if (type === "gunkan")        return <SushiGunkan/>
    if (type === "onigiri")       return <SushiOnigiri/>
    return null
}

// ── SPACE COVER (Pathfinder Academy) ─────────────────────────────────────────
const STARS = Array.from({ length: 48 }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: (i * 97.3) % 100,
    r: 0.6 + (i % 4) * 0.35,
    delay: (i * 0.19) % 3,
    dur: 2.5 + (i % 5) * 0.7,
}))

function SpaceFallback() {
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #0a0e1a 0%, #0d1f2d 40%, #0e2318 100%)", position: "relative", overflow: "hidden" }}>
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
                {STARS.map((s, i) => (
                    <motion.circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
                        animate={{ opacity: [0.2, 0.9, 0.2] }}
                        transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }} />
                ))}
            </svg>
            <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: 36, lineHeight: 1 }}>🚀</motion.div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "system-ui" }}>Pathfinder Academy</div>
            </div>
        </div>
    )
}

function SpaceCover() {
    const [failed, setFailed] = useState(false)
    if (failed) return <SpaceFallback />
    return (
        <video
            src="https://files.catbox.moe/4os4kd.mov"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
    )
}
// ─────────────────────────────────────────────────────────────────────────────

function StackCard({ project, index, total, scrollYProgress }: { project: Project; index: number; total: number; scrollYProgress: any }) {
    const [hovered, setHovered] = useState(false)
    const { isMobile } = useScreen()
    const scale = useTransform(scrollYProgress, [(index + 0.6) / total, Math.min((index + 0.95) / total, 1)], [1, 0.95 - index * 0.01])
    const opacity = useTransform(scrollYProgress, [(index + 0.6) / total, Math.min((index + 0.95) / total, 1)], [1, index === total - 1 ? 1 : 0.8])
    const visualPanel = (
        <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "10px 10px 0 0", overflow: "hidden", background: `linear-gradient(135deg, ${project.bgFrom}, ${project.bgTo})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
            {project.spaceCover ? (
                <SpaceCover />
            ) : project.video ? (
                <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            ) : (
                <>
                    <span style={{ position: "absolute", fontSize: "clamp(80px, 12vw, 140px)", fontWeight: 700, color: "rgba(26,26,26,0.06)", letterSpacing: "-0.05em", lineHeight: 1, userSelect: "none", bottom: 12, right: 20 }}>{project.num}</span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.18 }}>
                        {[0, 1, 2].map(row => <div key={row} style={{ display: "flex", gap: 8 }}>{[0, 1, 2, 3, 4].map(col => <div key={col} style={{ width: 4, height: 4, borderRadius: "50%", background: PURPLE, opacity: (row + col) % 2 === 0 ? 1 : 0.4 }} />)}</div>)}
                    </div>
                </>
            )}
            {project.pills && project.pills.length > 0 ? (
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "calc(100% - 32px)" }}>
                    {project.pills.map(pill => (
                        <span key={pill} style={{ fontSize: 11, color: PURPLE, background: "rgba(255,255,255,0.82)", padding: "4px 12px", borderRadius: RADIUS.pill, border: `1px solid ${PURPLE_BORDER}`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", whiteSpace: "nowrap", fontWeight: 500 }}>{pill}</span>
                    ))}
                </div>
            ) : (
                !project.spaceCover && <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, color: MUTED, background: "rgba(255,255,255,0.75)", padding: "4px 12px", borderRadius: RADIUS.pill, border: `1px solid ${BORDER}`, backdropFilter: "blur(8px)" }}>{project.imgLabel}</div>
            )}
            {!project.href && !project.passwordProtected && (
                <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "linear-gradient(135deg, #f5a04a, #e07b20)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    padding: "4px 11px",
                    borderRadius: RADIUS.pill,
                    textTransform: "uppercase" as const,
                    boxShadow: "0 2px 10px rgba(224,123,32,0.38)",
                    userSelect: "none" as const,
                }}>COMING SOON</div>
            )}
            {project.passwordProtected && (
                <div style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.9)" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
            )}
            {project.passwordProtected && hovered && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(2px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                    borderRadius: "10px 10px 0 0",
                }}>
                    <div style={{
                        background: "rgba(0,0,0,0.7)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: RADIUS.pill,
                        padding: "8px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span style={{
                            fontSize: 12,
                            color: "white",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                        }}>
                            Password required to read
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
    const textPanel = (
        <div style={{ padding: isMobile ? "16px 20px 20px" : "24px 32px 28px", display: "flex", flexDirection: "column" }}>
            {(!project.pills || project.pills.length === 0) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: MUTED, background: project.accent, padding: "3px 10px", borderRadius: RADIUS.pill, border: `1px solid ${BORDER}` }}>{project.tag}</span>
                    <span style={{ fontSize: 11, color: MUTED, marginLeft: "auto" }}>{project.year}</span>
                </div>
            )}
            <motion.h3 animate={{ color: hovered ? PURPLE : TEXT }} transition={{ duration: DUR.fast }}
                style={{ fontSize: isMobile ? 18 : "clamp(17px, 1.8vw, 21px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 6px" }}>
                {project.title}
            </motion.h3>
            {project.subtitle ? (
                <p style={{ fontSize: isMobile ? 13.5 : 13, color: BODY, lineHeight: 1.55, margin: "0 0 16px" }}>{project.subtitle}</p>
            ) : (
                <p style={{ fontSize: isMobile ? 13.5 : 13, color: MUTED, lineHeight: 1.75, margin: "0 0 16px" }}>{project.description}</p>
            )}
            {project.stats && project.stats.length > 0 && (
                <div style={{ display: "flex", gap: isMobile ? 20 : 28, marginBottom: 20, paddingTop: 4 }}>
                    {project.stats.map(s => (
                        <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 22, fontWeight: 600, color: TEXT, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "inherit" }}>{s.value}</span>
                            <span style={{ fontSize: 11, color: MUTED, fontFamily: "inherit" }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            )}
            {project.passwordProtected ? (
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    marginTop: "auto",
                    padding: "8px 16px",
                    borderRadius: RADIUS.pill,
                    border: `1px solid ${BORDER}`,
                    background: BG_ALT,
                    width: "fit-content",
                    cursor: "default",
                }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke={MUTED} strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}>
                        Password required
                    </span>
                </div>
            ) : (
                <motion.span animate={{ x: hovered ? 4 : 0, color: hovered ? PURPLE : MUTED }} transition={{ duration: DUR.fast }} style={{ fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5, marginTop: "auto" }}>view case study →</motion.span>
            )}
        </div>
    )
    return (
        <motion.div style={{ position: "sticky", top: (isMobile ? 72 : 96) + index * (isMobile ? 10 : 14), zIndex: index + 1, scale, opacity }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <motion.div animate={{ boxShadow: hovered ? SHADOW.cardHover : SHADOW.card }} transition={{ duration: DUR.slow }}
                onClick={() => project.href && (window.location.href = project.href)}
                style={{ background: "#fff", borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`, overflow: "hidden", display: "flex", flexDirection: "column", cursor: project.href ? "pointer" : "default" }}>
                {visualPanel}
                {textPanel}
            </motion.div>
        </motion.div>
    )
}

function CaseStudiesStack() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
    const { isMobile } = useScreen()
    const csPx = isMobile ? "16px" : "40px"
    return (
        <section ref={ref} id="work" style={{ background: BG_ALT }}>
            <Container style={{ padding: `${isMobile ? SPACE.xl : SPACE.xxl}px ${csPx} 24px` }}>
                <Reveal>
                    <SectionHeader title="Case studies" mb={8} sub={
                        <p style={{ ...TS.eyebrow, margin: 0 }}>
                            <span style={{ color: TEXT, fontWeight: 500 }}>Automation Anywhere</span>, 2021–2025
                        </p>
                    } />
                </Reveal>
            </Container>
            <Container style={{ padding: `0 ${csPx}`, paddingBottom: "8vh" }}>
                {PROJECTS.map((p, i) => <div key={p.num} style={{ marginBottom: "8vh" }}><StackCard project={p} index={i} total={PROJECTS.length} scrollYProgress={scrollYProgress} /></div>)}
            </Container>
        </section>
    )
}

// Honeycomb journey map — zoomed to Asia-Pacific + Americas band
const MAP_W = 700, MAP_H = 420
const LON_MIN = -130, LON_MAX = 145, LAT_MIN = 0, LAT_MAX = 56
const HEX_R = 8                                 // pointy-top hex radius (canvas px)
const HEX_COL_W = Math.sqrt(3) * HEX_R         // horizontal distance between hex centers in a row
const HEX_ROW_H = HEX_R * 1.5                  // vertical distance between row centers
const HEX_GLOW_NEAR = 38, HEX_GLOW_FAR = 75    // glow radii in canvas px

// [r, g, b] per city matching country flag colors
const CITY_COLORS: [number, number, number][] = [
    [255, 140,   0],   // Mumbai    – India saffron
    [220,  38,  38],   // Hefei     – China red
    [255, 140,   0],   // Bangalore – India saffron
    [ 59, 130, 246],   // SF        – USA blue
]
const MAP_STOPS = [
    { lon: 72.88,   lat: 19.08, label: "Mumbai",       current: false, tx: -13, ty: -14, ta: "right" as CanvasTextAlign },
    { lon: 117.23,  lat: 31.82, label: "Hefei",         current: false, tx: -13, ty:  6,  ta: "right" as CanvasTextAlign },
    { lon: 77.59,   lat: 12.97, label: "Bangalore",     current: false, tx:  13, ty:  18, ta: "left"  as CanvasTextAlign },
    { lon: -122.42, lat: 37.77, label: "San Francisco", current: true,  tx:  13, ty: -14, ta: "left"  as CanvasTextAlign },
]
function mapProj(lon: number, lat: number): [number, number] {
    return [
        (lon - LON_MIN) / (LON_MAX - LON_MIN) * MAP_W,
        (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * MAP_H,
    ]
}
function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6  // pointy-top: first vertex at top
        i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
    }
    ctx.closePath()
}

function JourneyMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const inView = useInView(containerRef, { once: true, margin: "-60px 0px" })
    const [phase, setPhase] = useState<"idle"|"loading"|"ready">("idle")
    // packed as [cx, cy, minCityDist] triplets for all land hexes
    const hexData = useRef(new Float32Array(0))

    useEffect(() => {
        if (!inView || phase !== "idle") return
        setPhase("loading"); let dead = false
        Promise.all([
            // @ts-ignore
            import("https://esm.sh/d3-geo@3"),
            // @ts-ignore
            import("https://esm.sh/topojson-client@3"),
            fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r => r.json()),
        ]).then(([d3geo, topo, world]: any[]) => {
            if (dead) return
            const land = topo.feature(world, world.objects.land)
            const cityPos = MAP_STOPS.map(s => mapProj(s.lon, s.lat))
            const buf: number[] = []
            let row = 0
            for (let cy = HEX_R; cy < MAP_H + HEX_R * 2; cy += HEX_ROW_H, row++) {
                const offset = (row % 2 === 1) ? HEX_COL_W / 2 : 0
                for (let cx = offset; cx < MAP_W + HEX_COL_W; cx += HEX_COL_W) {
                    const lon = LON_MIN + (cx / MAP_W) * (LON_MAX - LON_MIN)
                    const lat = LAT_MAX - (cy / MAP_H) * (LAT_MAX - LAT_MIN)
                    if (lat < LAT_MIN - 5 || lat > LAT_MAX + 5) continue
                    if (d3geo.geoContains(land, [lon, lat])) {
                        let minD = Infinity, closestIdx = 0
                        for (let ci = 0; ci < cityPos.length; ci++) {
                            const d = Math.hypot(cx - cityPos[ci][0], cy - cityPos[ci][1])
                            if (d < minD) { minD = d; closestIdx = ci }
                        }
                        buf.push(cx, cy, minD, closestIdx)
                    }
                }
            }
            hexData.current = new Float32Array(buf)
            if (!dead) setPhase("ready")
        }).catch(console.error)
        return () => { dead = true }
    }, [inView])

    useEffect(() => {
        if (phase !== "ready" || !canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")!
        let dashOff = 0; let animId: number

        const positions = MAP_STOPS.map(s => mapProj(s.lon, s.lat))
        // arcs: [fromIdx, toIdx, cpx, cpy]  — journey order: Mumbai→Hefei→Bangalore→SF
        const ARCS: [number, number, number, number][] = [
            [0, 1, 520,  30],  // Mumbai → Hefei (northeast arc)
            [1, 2, 510, 230],  // Hefei → Bangalore (south arc)
            [2, 3, 260,  -25], // Bangalore → SF (long transpacific arc)
        ]

        const draw = () => {
            ctx.clearRect(0, 0, MAP_W, MAP_H)
            ctx.fillStyle = "#f4f4f6"
            ctx.fillRect(0, 0, MAP_W, MAP_H)

            // draw honeycomb hex grid — color by proximity + country flag color
            const hexes = hexData.current
            for (let i = 0; i < hexes.length; i += 4) {
                const cx = hexes[i], cy = hexes[i + 1], dist = hexes[i + 2], ci = hexes[i + 3]
                const [r, g, b] = CITY_COLORS[ci]
                drawHex(ctx, cx, cy, HEX_R * 0.80)
                if (dist <= HEX_GLOW_NEAR) {
                    const t = 1 - dist / HEX_GLOW_NEAR
                    ctx.fillStyle = `rgba(${r},${g},${b},${(0.15 + t * 0.55).toFixed(2)})`
                } else if (dist <= HEX_GLOW_FAR) {
                    const t = 1 - (dist - HEX_GLOW_NEAR) / (HEX_GLOW_FAR - HEX_GLOW_NEAR)
                    ctx.fillStyle = `rgba(${r},${g},${b},${(t * 0.15).toFixed(2)})`
                } else {
                    ctx.fillStyle = "rgba(26,26,26,0.09)"
                }
                ctx.fill()
            }

            // animated flight arcs
            ctx.save()
            ctx.lineWidth = 1.8
            ctx.strokeStyle = PURPLE
            ctx.globalAlpha = 0.45
            ctx.setLineDash([5, 6])
            ctx.lineDashOffset = -dashOff
            for (const [fi, ti, cpx, cpy] of ARCS) {
                const [fx, fy] = positions[fi]; const [tx, ty] = positions[ti]
                ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(cpx, cpy, tx, ty); ctx.stroke()
            }
            ctx.restore()

            // city markers + labels
            for (let i = 0; i < MAP_STOPS.length; i++) {
                const s = MAP_STOPS[i]; const [x, y] = positions[i]; const R = s.current ? 9 : 6
                const [cr, cg, cb] = CITY_COLORS[i]
                const dotColor = `rgb(${cr},${cg},${cb})`
                // outer glow
                const g = ctx.createRadialGradient(x, y, 0, x, y, R * 3.5)
                g.addColorStop(0, `rgba(${cr},${cg},${cb},${s.current ? 0.32 : 0.22})`)
                g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
                ctx.beginPath(); ctx.arc(x, y, R * 3.5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
                // dot
                ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fillStyle = dotColor; ctx.fill()
                ctx.beginPath(); ctx.arc(x, y, R * 0.44, 0, Math.PI * 2); ctx.fillStyle = "white"; ctx.fill()
                // label background for readability
                ctx.font = `${s.current ? 700 : 500} 17px 'Instrument Sans', system-ui, sans-serif`
                const labelX = x + s.tx, labelY = y + s.ty
                const metrics = ctx.measureText(s.label)
                const pad = 4, lh = 10
                const bx = s.ta === "right" ? labelX - metrics.width - pad : labelX - pad
                ctx.fillStyle = "rgba(244,244,246,0.82)"
                ctx.beginPath()
                if (ctx.roundRect) ctx.roundRect(bx, labelY - lh - pad, metrics.width + pad * 2, lh + pad * 2, 3)
                else ctx.rect(bx, labelY - lh - pad, metrics.width + pad * 2, lh + pad * 2)
                ctx.fill()
                // label text — always dark/black for legibility
                ctx.fillStyle = s.current ? "rgba(26,26,26,0.95)" : "rgba(26,26,26,0.78)"
                ctx.textAlign = s.ta
                ctx.textBaseline = "bottom"
                ctx.fillText(s.label, labelX, labelY)
                ctx.textBaseline = "alphabetic"
            }

            dashOff = (dashOff + 0.12) % 11
            animId = requestAnimationFrame(draw)
        }

        animId = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(animId)
    }, [phase])

    return (
        <div ref={containerRef}>
            <div style={{ borderRadius: RADIUS.md, overflow: "hidden", border: `1px solid ${BORDER}`, background: "#f4f4f6", position: "relative" }}>
                {phase !== "ready" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ width: 20, height: 20, border: `2px solid ${PURPLE_BORDER}`, borderTopColor: PURPLE, borderRadius: "50%" }} />
                    </div>
                )}
                <canvas ref={canvasRef} width={MAP_W} height={MAP_H}
                    style={{ width: "100%", height: "auto", display: "block", opacity: phase === "ready" ? 1 : 0, transition: "opacity 0.6s" }}/>
            </div>

            {/* City legend pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 14, marginBottom: 20 }}>
                {[
                    { flag: "🇮🇳", label: "Mumbai" },
                    { flag: "🇨🇳", label: "Hefei" },
                    { flag: "🇮🇳", label: "Bangalore" },
                    { flag: "🇺🇸", label: "San Francisco", current: true },
                ].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: RADIUS.pill, background: m.current ? PURPLE_SUBTLE : "rgba(26,26,26,0.04)", border: `1px solid ${m.current ? PURPLE_BORDER : BORDER}` }}>
                        <span style={{ fontSize: 11 }}>{m.flag}</span>
                        <span style={{ fontSize: 10, letterSpacing: "0.02em", whiteSpace: "nowrap", color: m.current ? PURPLE : MUTED, fontWeight: m.current ? 600 : 400 }}>{m.label}{m.current && " · now ✦"}</span>
                    </div>
                ))}
            </div>

            {/* Timeline — year(52px) | logo(72px, center=88px) | text */}
            <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 87, top: 8, bottom: 8, width: 1, background: "rgba(26,26,26,0.08)" }} />
                {TIMELINE.map((entry, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 72px 1fr", gap: 0, alignItems: "center", padding: "12px 0" }}>
                        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.03em", color: entry.current ? PURPLE : MUTED, textAlign: "right", lineHeight: 1 }}>{entry.year}</span>
                        <div style={{ display: "flex", justifyContent: "center", zIndex: 1 }}>
                            {entry.logo ? (
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: "#fff",
                                    border: entry.current ? `1.5px solid ${PURPLE_HOVER}` : `1px solid rgba(26,26,26,0.10)`,
                                    boxShadow: entry.current ? `0 0 0 4px rgba(145,75,241,0.10), 0 2px 8px rgba(26,26,26,0.08)` : "0 1px 4px rgba(26,26,26,0.08)",
                                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <img src={entry.logo} alt={entry.place} style={{ width: entry.logoCover ? "100%" : "88%", height: entry.logoCover ? "100%" : "88%", objectFit: entry.logoCover ? "cover" : "contain", display: "block" }} />
                                </div>
                            ) : (
                                <div style={{ width: entry.current ? 10 : 7, height: entry.current ? 10 : 7, borderRadius: "50%", background: entry.current ? PURPLE : "rgba(26,26,26,0.2)", boxShadow: entry.current ? `0 0 0 3px rgba(145,75,241,0.15)` : "none", flexShrink: 0 }} />
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 14 }}>
                            <span style={{ fontSize: 14, fontWeight: entry.current ? 600 : 400, color: entry.current ? TEXT : BODY, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{entry.role}</span>
                            <span style={{ fontSize: 12, color: entry.current ? PURPLE : MUTED, fontWeight: entry.current ? 500 : 400 }}>{entry.place}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function PortfolioV2({ forceMobile = false }: { forceMobile?: boolean }) {
    const { scrollYProgress } = useScroll()
    const currentWord = useWordCycle(WORDS)
    const screen = useScreen()
    const isMobile = forceMobile || screen.isMobile
    const isTablet = screen.isTablet
    const px = isMobile ? "16px" : "40px"

    useEffect(() => {
        // Ensure mobile browsers use actual device width, not simulated desktop width
        let vp = document.querySelector('meta[name="viewport"]')
        if (!vp) { vp = document.createElement("meta"); vp.setAttribute("name", "viewport"); document.head.appendChild(vp) }
        vp.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5")

        const id1 = "instrument-sans-font"
        if (!document.getElementById(id1)) { const l = document.createElement("link"); l.id = id1; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"; document.head.appendChild(l) }
        const id2 = "sacramento-font"
        if (!document.getElementById(id2)) { const l = document.createElement("link"); l.id = id2; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Sacramento&display=swap"; document.head.appendChild(l) }
        const id3 = "dm-mono-font"
        if (!document.getElementById(id3)) { const l = document.createElement("link"); l.id = id3; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"; document.head.appendChild(l) }
    }, [])

    return (
        <div style={{ color: TEXT, fontFamily: "'Instrument Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
            <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: PURPLE, scaleX: scrollYProgress, transformOrigin: "0%", zIndex: 200 }} />

            {/* ── NAV ── */}
            <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "10px 14px" : "10px 24px", background: "rgba(251,251,252,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}` }}>
                {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <motion.div whileHover={{ scale: 1.05, color: PURPLE }} transition={{ duration: DUR.fast }}
                                    style={{ fontFamily: "'Sacramento', cursive", fontSize: 28, color: TEXT, lineHeight: 1, userSelect: "none", cursor: "default" }}>
                                    sonal
                                </motion.div>
                                <TinyFlowerCharacter />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <NavPill href="#work">Work</NavPill>
                                <NavPill href="#about">About</NavPill>
                                <NavPill href="#explorations">More</NavPill>
                            </div>
                        </div>
                        <SoundCloudPill />
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                            <SoundCloudPill />
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: RADIUS.pill, background: PILL_BG, fontSize: 13, color: MUTED }}>
                                <svg width="22" height="16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 24 Q12 20 24 24 Q36 28 48 24V32H0Z" fill="rgba(100,180,235,0.18)"/>
                                    <path d="M3 26.5 Q7 24.5 11 26.5" stroke="rgba(70,150,210,0.35)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                                    <path d="M20 26.5 Q24 24.5 28 26.5" stroke="rgba(70,150,210,0.35)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                                    <path d="M37 26.5 Q41 24.5 45 26.5" stroke="rgba(70,150,210,0.35)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                                    <rect x="0" y="20" width="48" height="1.8" rx="0.9" fill="rgba(192,54,44,0.55)"/>
                                    <rect x="10" y="4" width="1.8" height="17" rx="0.9" fill="#C0362C"/>
                                    <rect x="14" y="4" width="1.8" height="17" rx="0.9" fill="#C0362C"/>
                                    <rect x="9.5" y="7" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.7)"/>
                                    <rect x="9.5" y="11" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.7)"/>
                                    <rect x="9.5" y="15" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.5)"/>
                                    <rect x="32.2" y="4" width="1.8" height="17" rx="0.9" fill="#C0362C"/>
                                    <rect x="36.2" y="4" width="1.8" height="17" rx="0.9" fill="#C0362C"/>
                                    <rect x="31.7" y="7" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.7)"/>
                                    <rect x="31.7" y="11" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.7)"/>
                                    <rect x="31.7" y="15" width="7" height="1.2" rx="0.6" fill="rgba(192,54,44,0.5)"/>
                                    <path d="M0 20 Q5 17 11 4" stroke="#C0362C" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
                                    <path d="M11 4 Q24 16 37 4" stroke="#C0362C" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
                                    <path d="M37 4 Q43 17 48 20" stroke="#C0362C" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
                                    <line x1="5" y1="17" x2="5" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="8" y1="11" x2="8" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="19" y1="13" x2="19" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="24" y1="15" x2="24" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="29" y1="13" x2="29" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="40" y1="11" x2="40" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                    <line x1="43" y1="17" x2="43" y2="20" stroke="rgba(192,54,44,0.4)" strokeWidth="0.8"/>
                                </svg>
                                San Francisco, CA
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <motion.div whileHover={{ scale: 1.05, color: PURPLE }} transition={{ duration: DUR.fast }}
                                style={{ fontFamily: "'Sacramento', cursive", fontSize: 36, color: TEXT, lineHeight: 1, userSelect: "none", cursor: "default" }}>
                                sonal
                            </motion.div>
                            <TinyFlowerCharacter />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", flex: 1 }}>
                            <NavPill href="#work">Work</NavPill>
                            <NavPill href="#about">About</NavPill>
                            <NavPill href="#explorations">Explorations</NavPill>
                        </div>
                    </>
                )}
            </motion.nav>

            {/* ── HERO — BG ── */}
            <div style={{ background: BG, position: "relative", overflow: "hidden" }}>
                <Flower size={isMobile ? 220 : 420} opacity={0.028} duration={80} top={60} right={-80} />
                <Flower size={isMobile ? 100 : 180} opacity={0.022} duration={55} top={320} left={-50} delay={8} />
                <Flower size={isMobile ? 70 : 110} opacity={0.018} duration={40} top={500} right={120} delay={4} />
                <section style={{ maxWidth: 880, margin: "0 auto", padding: `${isMobile ? 120 : 148}px ${px} 0`, position: "relative", zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }} style={{ marginBottom: 20 }}>
                        <h1 style={{ fontSize: isMobile ? 26 : "clamp(26px, 3vw, 36px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: isMobile ? "-0.02em" : "-0.03em", margin: 0, color: TEXT }}>
                            Hi there! I'm Sonal <span style={{ color: MUTED, fontStyle: "italic", fontWeight: 400, fontSize: "0.72em" }}>[as in So-null]</span><span style={{ color: PURPLE }}>.</span>
                        </h1>
                    </motion.div>
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.35, ease }}
                        style={{ fontSize: isMobile ? 17 : "clamp(16px, 1.8vw, 26px)", fontWeight: 400, color: BODY, lineHeight: 1.55, letterSpacing: "-0.015em", margin: "0 0 32px", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0 6px" }}>
                        <span>A product designer with 4+ years designing, delivering and always</span>
                        <span style={{ display: "inline-block", overflow: "hidden", height: "1.5em", verticalAlign: "bottom" }}>
                            <AnimatePresence mode="wait">
                                <motion.span key={currentWord} initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-100%", opacity: 0 }}
                                    transition={{ duration: 0.38, ease }} style={{ color: PURPLE, fontWeight: 500, display: "block", whiteSpace: "nowrap" }}>{currentWord}</motion.span>
                            </AnimatePresence>
                        </span>
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.5, ease }}
                        style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
                        <a href="https://linkedin.com/in/sonal-soni" target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: BODY, textDecoration: "none", fontWeight: 400 }}
                            onMouseEnter={e => (e.currentTarget.style.color = TEXT)} onMouseLeave={e => (e.currentTarget.style.color = BODY)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0A66C2", flexShrink: 0 }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            LinkedIn
                        </a>
                        <a href="https://raw.githubusercontent.com/soni7sonal/portfolio/main/Sonal_Resume.pdf"
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: BODY, textDecoration: "none", fontWeight: 400 }}
                            onMouseEnter={e => (e.currentTarget.style.color = TEXT)} onMouseLeave={e => (e.currentTarget.style.color = BODY)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Resume
                        </a>
                    </motion.div>
                </section>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.6, ease }}
                    style={{ padding: `0 ${px} 80px`, maxWidth: 880, margin: "0 auto", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
                    <div style={{ borderRadius: RADIUS.xl, overflow: "hidden", height: isMobile ? "clamp(220px, 44vh, 300px)" : "clamp(320px, 52vh, 560px)", boxShadow: SHADOW.lg, border: `1px solid ${BORDER}` }}>
                        <BeforeAfterSlider
                            before="https://files.catbox.moe/vms8h4.jpg"
                            after="https://files.catbox.moe/70qphv.jpg"
                        />
                    </div>
                </motion.div>
            </div>

            {/* ── WORK — BG_ALT ── */}
            <CaseStudiesStack />

            {/* ── ABOUT — BG ── */}
            <section id="about" style={{ background: BG }}>
                <Container style={{ padding: `${isMobile ? SPACE.xl : SPACE.xxl}px ${px} ${isMobile ? SPACE.xl : 96}px` }}>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? "32px 0" : "0 64px", alignItems: "start" }}>
                        <div>
                            <Reveal><SectionHeader title="Design is my passport" mb={36} /></Reveal>
                            <Reveal delay={0.06}><p style={{ fontSize: "clamp(15px, 1.7vw, 20px)", lineHeight: 1.75, color: TEXT, margin: "0 0 24px" }}>The most important <strong>map</strong> I ever ignored was the one telling me to{" "}<span style={{ color: PURPLE }}>stay in my lane</span>.</p></Reveal>
                            <Reveal delay={0.1}><p style={{ ...TS.body, margin: "0 0 14px" }}>In my final year of engineering, a predictable desk job actually terrified me. I felt stuck in a bubble, constantly asking everyone, What next? That curiosity is exactly how I found design. I packed my bags, moved to a new city, and finally saw the real impact designers bring to day-to-day life.</p></Reveal>
                            <Reveal delay={0.14}><p style={{ ...TS.body, margin: "0 0 14px" }}>That choice shifted everything. Design became my passport and since then it has taken me across borders, introduced me to a global community of creators, and gifted me those unexpected aha moments that keep me grounded.</p></Reveal>
                            <Reveal delay={0.18}><p style={{ ...TS.body, margin: "0 0 14px" }}>I spent <span style={{ color: PURPLE, fontWeight: 600 }}>4+ years</span> alongside an incredible team at a global leader in automation, helping design workflows that run <span style={{ color: PURPLE, fontWeight: 600 }}>400M+</span> automations annually.</p></Reveal>
                            <Reveal delay={0.22}><p style={{ ...TS.body, margin: 0 }}>Currently, I'm at CCA in San Francisco, pursuing my Master of Design in Interaction Design. I am choosing to stick with that feeling of discovery, learning and unlearning as I go.</p></Reveal>
                        </div>
                        <Reveal delay={0.08}><JourneyMap /></Reveal>
                    </div>
                </Container>
            </section>

            {/* ── POLAROID STACK ── */}
            <PolaroidStack />

            {/* ── CONTACT — BG_ALT ── */}
            <section id="contact" style={{ background: BG_ALT }}>
                <Container style={{ padding: `${isMobile ? SPACE.xl : SPACE.xxl}px ${px} 0` }}>
                    <Reveal>
                        <SectionHeader title="Let's connect" mb={48} />
                    </Reveal>

                    <Reveal delay={0.08} y={16}>
                        <div style={{ marginBottom: 40 }}>
                            <MomoChatbot />
                        </div>
                    </Reveal>

                    <Reveal delay={0.16}>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, paddingBottom: isMobile ? 32 : 64 }}>
                            {CONTACT_LINKS.map(item => <ContactLink key={item.label} item={item} />)}
                        </div>
                    </Reveal>
                </Container>

                <FooterBar />
            </section>
        </div>
    )
}

addPropertyControls(PortfolioV2, {
    forceMobile: {
        type: ControlType.Boolean,
        title: "Force Mobile",
        defaultValue: false,
    },
})
