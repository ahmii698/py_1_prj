import { useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  ClipboardList,
  CheckCircle2,
  Trophy,
  Clock,
  ArrowUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Braces,
  Atom,
  Workflow,
  Database,
  Globe,
  Upload,
  Target,
  Timer,
  Link2,
  Box,
  CalendarDays,
  Bot,
  ShieldCheck,
  Flame,
  Medal,
  Compass,
  ListChecks,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./Dashboard.css";

type Tone = "purple" | "blue" | "green" | "orange" | "red";

/* ---------------- Data ---------------- */

const stats: {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
  tone: Tone;
}[] = [
  { label: "Total PDFs", value: "12", delta: "3 this week", icon: <FileText size={20} />, tone: "purple" },
  { label: "Total Quizzes", value: "8", delta: "2 this week", icon: <ClipboardList size={20} />, tone: "purple" },
  { label: "Completed Quizzes", value: "5", delta: "1 this week", icon: <CheckCircle2 size={20} />, tone: "green" },
  { label: "Average Score", value: "78%", delta: "12% this week", icon: <Trophy size={20} />, tone: "orange" },
  { label: "Study Hours", value: "18.6", delta: "6% this week", icon: <Clock size={20} />, tone: "purple" },
];

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekValues = [28, 43, 58, 43, 62, 49, 73];

const subjects = [
  { name: "Data Structures", value: 92, color: "#7c5cff" },
  { name: "Algorithms", value: 78, color: "#4f9bff" },
  { name: "Web Development", value: 66, color: "#34c77b" },
  { name: "Database Systems", value: 58, color: "#ffab40" },
  { name: "Others", value: 41, color: "#cfd5e6" },
];

const quizResults: {
  name: string;
  score: number;
  date: string;
  time: string;
  icon: ReactNode;
  tone: Tone;
}[] = [
  { name: "Data Structures Quiz", score: 85, date: "May 20, 2025", time: "12m 32s", icon: <Braces size={16} />, tone: "purple" },
  { name: "React Basics Quiz", score: 72, date: "May 18, 2025", time: "18m 45s", icon: <Atom size={16} />, tone: "green" },
  { name: "Algorithms Quiz", score: 90, date: "May 16, 2025", time: "14m 20s", icon: <Workflow size={16} />, tone: "blue" },
  { name: "Database Quiz", score: 65, date: "May 14, 2025", time: "22m 11s", icon: <Database size={16} />, tone: "red" },
  { name: "Web Development Quiz", score: 78, date: "May 12, 2025", time: "16m 03s", icon: <Globe size={16} />, tone: "green" },
];

const activities: { text: string; sub?: string; time: string; icon: ReactNode; tone: Tone }[] = [
  { text: "You completed a quiz", sub: "(Data Structures Quiz)", time: "12m ago", icon: <CheckCircle2 size={14} />, tone: "purple" },
  { text: "You uploaded a new PDF", sub: "(React Notes.pdf)", time: "2h ago", icon: <Upload size={14} />, tone: "purple" },
  { text: "You earned a new achievement", sub: "(First Quiz)", time: "5h ago", icon: <Trophy size={14} />, tone: "orange" },
  { text: "You added a new study goal", sub: "(5 Quizzes per Week)", time: "1 day ago", icon: <Target size={14} />, tone: "green" },
  { text: "You completed a study session", sub: "(45 minutes)", time: "1 day ago", icon: <Timer size={14} />, tone: "green" },
];

const weakTopics: { name: string; value: number; color: string; icon: ReactNode; tone: Tone }[] = [
  { name: "Linked Lists", value: 35, color: "#ff5d6c", icon: <Link2 size={14} />, tone: "red" },
  { name: "Database Normalization", value: 48, color: "#ffab40", icon: <Database size={14} />, tone: "orange" },
  { name: "React Hooks", value: 62, color: "#34c77b", icon: <Atom size={14} />, tone: "green" },
  { name: "Object Oriented Programming", value: 71, color: "#7c5cff", icon: <Box size={14} />, tone: "purple" },
];

const quickActions: { title: string; sub: string; icon: ReactNode }[] = [
  { title: "Upload PDF", sub: "Generate quiz from your PDF", icon: <Upload size={16} /> },
  { title: "View My Quizzes", sub: "See all your quizzes", icon: <ListChecks size={16} /> },
  { title: "Study Schedule", sub: "Plan your study time", icon: <CalendarDays size={16} /> },
  { title: "AI Assistant", sub: "Ask anything about your PDFs", icon: <Bot size={16} /> },
];

const initialPlan = [
  { id: 1, title: "Complete React Basics", time: "10:00 AM - 11:30 AM", done: true },
  { id: 2, title: "Data Structures Quiz", time: "01:00 PM - 02:00 PM", done: true },
  { id: 3, title: "Read Chapter 4", time: "03:30 PM - 04:30 PM", done: false },
];

const achievements: { name: string; xp: string; icon: ReactNode; tone: Tone }[] = [
  { name: "First Quiz", xp: "+50 XP", icon: <ShieldCheck size={26} />, tone: "green" },
  { name: "Streak 3", xp: "+100 XP", icon: <Flame size={26} />, tone: "orange" },
  { name: "Top Score", xp: "+200 XP", icon: <Medal size={26} />, tone: "purple" },
  { name: "Explorer", xp: "+150 XP", icon: <Compass size={26} />, tone: "purple" },
];

/* Calendar: May 2025 (Mon first) */
const calendarCells: { day: number; muted: boolean }[] = [
  ...[28, 29, 30].map((d) => ({ day: d, muted: true })),
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, muted: false })),
  { day: 1, muted: true },
];

/* ---------------- Charts ---------------- */

function LearningChart() {
  const [hover, setHover] = useState<number>(2);

  const W = 520;
  const H = 200;
  const left = 44;
  const right = 510;
  const top = 14;
  const bottom = 165;

  const xAt = (i: number) => left + (i * (right - left)) / (weekValues.length - 1);
  const yAt = (v: number) => bottom - (v / 100) * (bottom - top);

  const pts = weekValues.map((v, i) => ({ x: xAt(i), y: yAt(v) }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    line += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x} ${bottom} L ${pts[0].x} ${bottom} Z`;

  const grid = [0, 25, 50, 75, 100];
  const hp = pts[hover];

  return (
    <svg className="sd-line-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lpArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7c5cff" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {grid.map((g) => (
        <g key={g}>
          <line x1={left} x2={right} y1={yAt(g)} y2={yAt(g)} stroke="#eef0f6" strokeWidth="1" />
          <text x={left - 10} y={yAt(g) + 4} textAnchor="end" fontSize="10" fill="#9a9fb5">
            {g}%
          </text>
        </g>
      ))}

      {weekLabels.map((l, i) => (
        <text key={l} x={xAt(i)} y={bottom + 22} textAnchor="middle" fontSize="10" fill="#9a9fb5">
          {l}
        </text>
      ))}

      <path d={area} fill="url(#lpArea)" />
      <path d={line} fill="none" stroke="#7c5cff" strokeWidth="2.2" strokeLinecap="round" />

      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHover(i)} style={{ cursor: "pointer" }}>
          <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
          <circle
            cx={p.x}
            cy={p.y}
            r={hover === i ? 5 : 3.5}
            fill="#7c5cff"
            stroke="#fff"
            strokeWidth="2"
          />
        </g>
      ))}

      <g>
        <rect x={hp.x - 28} y={hp.y - 42} width="56" height="28" rx="7" fill="#1f1b4b" />
        <text x={hp.x} y={hp.y - 31} textAnchor="middle" fontSize="9" fill="#c9c4ff">
          {weekLabels[hover]}
        </text>
        <text x={hp.x} y={hp.y - 20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
          {weekValues[hover]}%
        </text>
      </g>
    </svg>
  );
}

function SubjectDonut() {
  const R = 62;
  const C = 2 * Math.PI * R;
  const total = subjects.reduce((s, x) => s + x.value, 0);
  const gap = 4;
  let offset = 0;

  return (
    <svg className="sd-donut" viewBox="0 0 160 160">
      <g transform="rotate(-90 80 80)">
        {subjects.map((s) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={s.name}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${len - gap} ${C - len + gap}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </g>
      <text x="80" y="82" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1c1c3c">
        78%
      </text>
      <text x="80" y="98" textAnchor="middle" fontSize="9" fill="#8a8fa8">
        Average Score
      </text>
    </svg>
  );
}

/* ---------------- Page ---------------- */

function Dashboard() {
  const [plan, setPlan] = useState(initialPlan);
  const [range, setRange] = useState("Last 7 Days");

  const togglePlan = (id: number) =>
    setPlan((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));

  const scoreClass = (s: number) => (s >= 80 ? "good" : s >= 70 ? "mid" : "bad");

  return (
    <div className="sd-layout">
      <Sidebar />

      <div className="sd-main">
        <Header />

        <div className="sd-content">
          {/* ============ CENTER ============ */}
          <div className="sd-center">
            {/* Welcome banner */}
            <section className="sd-welcome">
              <div>
                <h1>
                  Good Morning, Ahmed! <span>👋</span>
                </h1>
                <p>Keep going! Your hard work is building a better future.</p>
              </div>
              <div className="sd-welcome-quote">
                “ Success is the sum of small
                <br />
                efforts, repeated day in and day out.”
              </div>
              <svg className="sd-welcome-art" viewBox="0 0 170 100" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="85" cy="94" rx="70" ry="5" fill="#d9d2ff" />
                <rect x="55" y="62" width="50" height="6" rx="3" fill="#8b6cff" />
                <rect x="62" y="44" width="36" height="20" rx="3" fill="#ffffff" stroke="#c9bfff" />
                <circle cx="80" cy="30" r="9" fill="#f3c9a8" />
                <path d="M66 26 Q80 8 94 26 Q86 18 66 26Z" fill="#3b2a6b" />
                <path d="M68 44 Q80 34 92 44 L96 62 L64 62Z" fill="#7c5cff" />
                <rect x="128" y="52" width="6" height="40" rx="3" fill="#6d4aff" />
                <ellipse cx="124" cy="46" rx="9" ry="14" fill="#a78bfa" />
                <ellipse cx="138" cy="42" rx="9" ry="14" fill="#8b6cff" />
              </svg>
            </section>

            {/* Stats */}
            <section className="sd-stats">
              {stats.map((s) => (
                <div className="sd-stat" key={s.label}>
                  <div className={`sd-icon-box tone-${s.tone}`}>{s.icon}</div>
                  <p className="sd-stat-label">{s.label}</p>
                  <p className="sd-stat-value">{s.value}</p>
                  <p className="sd-stat-delta">
                    <ArrowUp size={12} /> {s.delta}
                  </p>
                </div>
              ))}
            </section>

            {/* Row 1 */}
            <div className="sd-row">
              <section className="sd-card">
                <div className="sd-card-head">
                  <h3>Your Learning Progress</h3>
                  <select value={range} onChange={(e) => setRange(e.target.value)}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
                <LearningChart />
              </section>

              <section className="sd-card">
                <div className="sd-card-head">
                  <h3>Subject Performance</h3>
                  <a className="sd-link" href="#details">
                    View Details <ArrowRight size={12} />
                  </a>
                </div>
                <div className="sd-subject">
                  <SubjectDonut />
                  <ul className="sd-legend">
                    {subjects.map((s) => (
                      <li key={s.name}>
                        <span className="dot" style={{ background: s.color }} />
                        <span className="name">{s.name}</span>
                        <span className="val">{s.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Row 2 */}
            <div className="sd-row">
              <div className="sd-stack">
                <section className="sd-card">
                  <div className="sd-card-head">
                    <h3>Recent Quiz Results</h3>
                    <a className="sd-link" href="#all">
                      View All <ArrowRight size={12} />
                    </a>
                  </div>
                  <table className="sd-table">
                    <thead>
                      <tr>
                        <th>Quiz Name</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((q) => (
                        <tr key={q.name}>
                          <td>
                            <div className="sd-quiz-name">
                              <span className={`sd-mini-icon tone-${q.tone}`}>{q.icon}</span>
                              {q.name}
                            </div>
                          </td>
                          <td>
                            <span className={`sd-score ${scoreClass(q.score)}`}>{q.score}%</span>
                          </td>
                          <td>{q.date}</td>
                          <td>{q.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section className="sd-card">
                  <div className="sd-card-head">
                    <h3>Recent Activity</h3>
                    <a className="sd-link" href="#all">
                      View All <ArrowRight size={12} />
                    </a>
                  </div>
                  <ul className="sd-activity">
                    {activities.map((a, i) => (
                      <li key={i}>
                        <span className={`sd-mini-icon round tone-${a.tone}`}>{a.icon}</span>
                        <span className="txt">
                          {a.text} <em>{a.sub}</em>
                        </span>
                        <span className="time">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="sd-stack">
                <section className="sd-card">
                  <div className="sd-card-head">
                    <h3>Continue Learning</h3>
                    <a className="sd-link" href="#all">
                      View All <ArrowRight size={12} />
                    </a>
                  </div>
                  <div className="sd-continue">
                    <div>
                      <h4>Continue your journey</h4>
                      <p>
                        Upload a PDF and generate a quiz to
                        <br />
                        keep learning!
                      </p>
                      <button type="button" className="sd-btn-white">
                        Generate Quiz
                      </button>
                    </div>
                    <svg className="sd-continue-art" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="60" cy="82" rx="52" ry="6" fill="rgba(255,255,255,0.25)" />
                      <rect x="34" y="14" width="52" height="62" rx="6" fill="#ffffff" opacity="0.95" />
                      <rect x="42" y="24" width="28" height="4" rx="2" fill="#c9bfff" />
                      <rect x="42" y="34" width="36" height="4" rx="2" fill="#ddd6ff" />
                      <circle cx="60" cy="56" r="11" fill="#8b6cff" />
                      <path d="M60 62 V50 M55 55 L60 50 L65 55" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </section>

                <section className="sd-card">
                  <div className="sd-card-head">
                    <h3>Weak Topics</h3>
                    <a className="sd-link" href="#all">
                      View All <ArrowRight size={12} />
                    </a>
                  </div>
                  <ul className="sd-weak">
                    {weakTopics.map((w) => (
                      <li key={w.name}>
                        <span className={`sd-mini-icon tone-${w.tone}`}>{w.icon}</span>
                        <span className="name">{w.name}</span>
                        <span className="pct">{w.value}%</span>
                        <span className="bar">
                          <span style={{ width: `${w.value}%`, background: w.color }} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="sd-bottom-split">
                  <section className="sd-card sd-quick">
                    <h3>Quick Actions</h3>
                    <div className="sd-quick-grid">
                      {quickActions.map((q) => (
                        <button type="button" key={q.title} className="sd-quick-item">
                          <span className="ic">{q.icon}</span>
                          <span>
                            <strong>{q.title}</strong>
                            <small>{q.sub}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="sd-doing-great">
                    <h4>You're doing great!</h4>
                    <p>Keep learning, keep growing.</p>
                    <button type="button" className="sd-btn-white small">
                      View Progress
                    </button>
                    <svg className="sd-mountain" viewBox="0 0 160 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="0,80 50,28 80,52 110,20 160,80" fill="rgba(30,20,80,0.55)" />
                      <polygon points="60,80 110,20 160,80" fill="rgba(20,10,60,0.6)" />
                    </svg>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="sd-right">
            <section className="sd-card">
              <h3 className="sd-plain-title">Study Schedule</h3>
              <div className="sd-cal-head">
                <button type="button" aria-label="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <span>May 2025</span>
                <button type="button" aria-label="Next month">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="sd-cal-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="dow">
                    {d}
                  </span>
                ))}
                {calendarCells.map((c, i) => (
                  <span
                    key={i}
                    className={`day ${c.muted ? "muted" : ""} ${!c.muted && c.day === 20 ? "today" : ""}`}
                  >
                    {c.day}
                  </span>
                ))}
              </div>
            </section>

            <section className="sd-card">
              <div className="sd-card-head">
                <h3>Today's Plan</h3>
                <a className="sd-link" href="#all">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <ul className="sd-plan">
                {plan.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`sd-check ${p.done ? "on" : ""}`}
                      onClick={() => togglePlan(p.id)}
                      aria-label={`Toggle ${p.title}`}
                    >
                      {p.done && <Check size={13} strokeWidth={3} />}
                    </button>
                    <div>
                      <p className="t">{p.title}</p>
                      <p className="s">{p.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="sd-card">
              <div className="sd-card-head">
                <h3>Learning Goals</h3>
                <a className="sd-link" href="#all">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <div className="sd-goal">
                <div className="ring">
                  <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="#eef0f6" strokeWidth="6" />
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      fill="none"
                      stroke="#7c5cff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(2 / 5) * 2 * Math.PI * 27} ${2 * Math.PI * 27}`}
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <span>2/5</span>
                </div>
                <div className="info">
                  <h4>Weekly Goals</h4>
                  <p>Complete 5 quizzes this week</p>
                  <div className="bar">
                    <span style={{ width: "40%" }} />
                  </div>
                </div>
              </div>
            </section>

            <section className="sd-card">
              <div className="sd-card-head">
                <h3>Achievements</h3>
                <a className="sd-link" href="#all">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <div className="sd-ach">
                {achievements.map((a) => (
                  <div className="item" key={a.name}>
                    <span className={`badge tone-${a.tone}`}>{a.icon}</span>
                    <p>{a.name}</p>
                    <strong>{a.xp}</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;