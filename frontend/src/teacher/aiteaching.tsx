import { useState } from "react";
import {
  Brain,
  Sparkles,
  Users,
  Target,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Calendar,
  PenLine,
  CalendarClock,
  ListChecks,
  Share2,
  Upload,
  FileBarChart,
  Wand2,
  Bot,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Minus,
  MoreVertical,
  TrendingUp,
  HelpCircle,
  BarChart3,
  CircleDot,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./aiteaching.css";

type Tab = "Overview" | "Learning Gaps" | "At Risk Students" | "Quiz Insights" | "Subject Analysis" | "Lesson Planner";
type Trend = "up" | "down" | "flat";
type Difficulty = "Hard" | "Medium" | "Easy";

const TABS: Tab[] = ["Overview", "Learning Gaps", "At Risk Students", "Quiz Insights", "Subject Analysis", "Lesson Planner"];

const STATS = [
  { label: "Total Students", value: "124", note: "12% from last month", trend: "up", icon: Users, tone: "purple" },
  { label: "Avg. Class Score", value: "68%", note: "8% from last month", trend: "up", icon: Target, tone: "green" },
  { label: "Students at Risk", value: "12", note: "5% from last month", trend: "down", icon: AlertTriangle, tone: "red" },
  { label: "Topics Needing Attention", value: "5", note: "2 from last month", trend: "up", icon: BookOpen, tone: "indigo" },
  { label: "Recommended Actions", value: "8", note: "3 from last month", trend: "up", icon: Lightbulb, tone: "orange" },
] as const;

const LEARNING_GAPS = [
  { topic: "Linked Lists", pct: 62, students: "26 / 40 students" },
  { topic: "Trees", pct: 58, students: "23 / 40 students" },
  { topic: "Recursion", pct: 54, students: "20 / 40 students" },
  { topic: "Sorting Algorithms", pct: 47, students: "18 / 40 students" },
  { topic: "Dynamic Programming", pct: 42, students: "17 / 40 students" },
];

const AT_RISK: { name: string; cls: string; score: number; trend: Trend; concern: string }[] = [
  { name: "Usman Khalid", cls: "BSCS - Sem 3", score: 52, trend: "down", concern: "Linked Lists" },
  { name: "Fatima Zahra", cls: "BSCS - Sem 3", score: 58, trend: "down", concern: "Trees" },
  { name: "Daniyal Shah", cls: "BSCS - Sem 3", score: 61, trend: "down", concern: "Recursion" },
  { name: "Ayesha Noor", cls: "BSCS - Sem 3", score: 65, trend: "flat", concern: "Arrays" },
  { name: "Zainab Malik", cls: "BSCS - Sem 3", score: 67, trend: "up", concern: "Sorting" },
];

const SUBJECTS = [
  { name: "Data Structures", short: "Data Structures", value: 76, color: "#8b6cff" },
  { name: "C Programming", short: "C Programming", value: 72, color: "#5eead4" },
  { name: "Algorithms", short: "Algorithms", value: 68, color: "#fcd34d" },
  { name: "Database Systems", short: "Database Systems", value: 63, color: "#60a5fa" },
  { name: "Web Development", short: "Web Dev", value: 58, color: "#fb7185" },
];

const QUIZ_INSIGHTS: { q: string; title: string; wrong: number; level: Difficulty }[] = [
  { q: "Q3", title: "Linked List insertion operation", wrong: 72, level: "Hard" },
  { q: "Q7", title: "Time complexity of Quick Sort", wrong: 68, level: "Medium" },
  { q: "Q12", title: "Recursion base case", wrong: 61, level: "Medium" },
  { q: "Q18", title: "Binary search edge case", wrong: 57, level: "Easy" },
  { q: "Q22", title: "Tree traversal (postorder)", wrong: 49, level: "Medium" },
];

const CLASS_AVG = [
  { d: 1, v: 48 }, { d: 4, v: 52 }, { d: 7, v: 50 }, { d: 10, v: 54 }, { d: 13, v: 52 }, { d: 16, v: 58 },
  { d: 19, v: 56 }, { d: 22, v: 62 }, { d: 25, v: 60 }, { d: 28, v: 66 }, { d: 31, v: 64 },
];
const TOP_PERF = [
  { d: 1, v: 70 }, { d: 4, v: 74 }, { d: 7, v: 72 }, { d: 10, v: 78 }, { d: 13, v: 76 }, { d: 16, v: 82 },
  { d: 19, v: 80 }, { d: 22, v: 84 }, { d: 25, v: 82 }, { d: 28, v: 86 }, { d: 31, v: 85 },
];
const X_LABELS = [1, 5, 10, 15, 20, 25, 31];

const KEY_INSIGHTS = [
  "Class average improved by 8% this month.",
  "Performance in Algorithms is steadily increasing.",
  "Linked Lists remains the biggest challenge.",
  "12 students are at risk of falling behind.",
];

const RECOMMENDATIONS = [
  { title: "Revise Linked Lists", desc: "26 students need practice. Share notes and create a focused quiz.", icon: Sparkles },
  { title: "Schedule Revision Session", desc: "Recommended for Linked Lists & Trees. (2 sessions)", icon: CalendarClock },
  { title: "Create Practice Quiz", desc: "10 questions • Medium difficulty (Linked Lists)", icon: ListChecks },
  { title: "Share Additional Material", desc: "Add more examples and visuals for weak topics.", icon: Share2 },
];

const QUICK_ACTIONS = [
  { title: "Generate Quiz", desc: "Create AI quiz from weak topics", icon: PenLine },
  { title: "Upload Material", desc: "Add PDF, notes or video resources", icon: Upload },
  { title: "View Detailed Reports", desc: "Export class performance report", icon: FileBarChart },
];

const AVATAR_COLORS = ["#7c5cfc", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6", "#8b5cf6"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const levelClass = (l: Difficulty) => (l === "Hard" ? "ai-pill red" : l === "Medium" ? "ai-pill orange" : "ai-pill green");

/* ---------------- Line chart ---------------- */
const ProgressChart = () => {
  const W = 620;
  const H = 170;
  const L = 32;
  const R = 10;
  const T = 8;
  const B = 24;
  const x = (d: number) => L + ((d - 1) / 30) * (W - L - R);
  const y = (v: number) => T + ((100 - v) / 100) * (H - T - B);
  const path = (arr: { d: number; v: number }[]) => arr.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.d)},${y(p.v)}`).join(" ");

  return (
    <svg className="ai-line" viewBox={`0 0 ${W} ${H}`}>
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className="ai-grid-line" />
          <text x={L - 6} y={y(g) + 3} textAnchor="end" className="ai-axis">{g}</text>
        </g>
      ))}
      <path d={path(TOP_PERF)} fill="none" stroke="#14b8a6" strokeWidth="2" />
      <path d={path(CLASS_AVG)} fill="none" stroke="#7c5cfc" strokeWidth="2" />
      {TOP_PERF.map((p) => (
        <circle key={`t${p.d}`} cx={x(p.d)} cy={y(p.v)} r="2.5" fill="#fff" stroke="#14b8a6" strokeWidth="1.5" />
      ))}
      {CLASS_AVG.map((p) => (
        <circle key={`c${p.d}`} cx={x(p.d)} cy={y(p.v)} r="2.5" fill="#fff" stroke="#7c5cfc" strokeWidth="1.5" />
      ))}
      {X_LABELS.map((d) => (
        <text key={d} x={x(d)} y={H - 6} textAnchor="middle" className="ai-axis">May {d}</text>
      ))}
    </svg>
  );
};

/* ---------------- Page ---------------- */
export default function AiTeaching() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [classVal, setClassVal] = useState("BSCS - Semester 3");

  const show = (key: Tab) => tab === "Overview" || tab === key;
  const isOverview = tab === "Overview";

  return (
    <div className="ai-shell">
      <Sidebar />

      <div className="ai-main">
        <Header />

        <main className="ai-page">
          <div className="ai-layout">
            {/* ============ CENTER ============ */}
            <div className="ai-center">
              {/* Banner */}
              <section className="ai-banner">
                <div className="ai-banner-left">
                  <span className="ai-banner-icon"><Brain size={28} /></span>
                  <div>
                    <h1>AI Teaching Insights</h1>
                    <p>Get smart insights, identify learning gaps and receive personalized recommendations to help your students perform better.</p>
                  </div>
                </div>
                <div className="ai-banner-right">
                  <div className="ai-select">
                    <select value={classVal} onChange={(e) => setClassVal(e.target.value)}>
                      <option>BSCS - Semester 3</option>
                      <option>BSCS - Semester 4</option>
                      <option>BSSE - Semester 3</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                  <button className="ai-date-btn">
                    <Calendar size={14} /> May 1, 2025 – May 31, 2025 <ChevronDown size={14} />
                  </button>
                </div>
              </section>

              {/* Stats */}
              <section className="ai-stats">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="ai-card ai-stat">
                      <span className={`ai-stat-icon ${s.tone}`}><Icon size={22} /></span>
                      <div>
                        <p>{s.label}</p>
                        <h3>{s.value}</h3>
                        <small className={s.tone === "red" ? "bad" : "good"}>
                          {s.trend === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {s.note}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Panel */}
              <section className="ai-card ai-panel">
                <div className="ai-tabs">
                  {TABS.map((t) => (
                    <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>

                {tab === "Lesson Planner" ? (
                  <div className="ai-placeholder">
                    <Wand2 size={34} />
                    <h3>AI Lesson Planner</h3>
                    <p>Weak topics ke hisaab se lesson plan yahan generate hoga. Backend jodne ke baad ye section active hoga.</p>
                  </div>
                ) : (
                  <>
                    <div className={isOverview ? "ai-grid" : "ai-grid single"}>
                      {/* Learning gaps */}
                      {show("Learning Gaps") && (
                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><Brain size={18} /></span>
                              <div>
                                <h2>Learning Gaps</h2>
                                <small>Key areas where students are struggling based on quiz results.</small>
                              </div>
                            </div>
                            <a href="#" className="ai-link" onClick={(e) => e.preventDefault()}>
                              View Details <ArrowRight size={12} />
                            </a>
                          </div>

                          <div className="ai-gaps">
                            {LEARNING_GAPS.map((g) => (
                              <div key={g.topic} className="ai-gap-row">
                                <span className="ai-gap-name">{g.topic}</span>
                                <div className="ai-gap-bar"><div style={{ width: `${g.pct}%` }} /></div>
                                <b>{g.pct}%</b>
                                <small>{g.students}</small>
                              </div>
                            ))}
                          </div>

                          <div className="ai-callout">
                            <span className="ai-callout-icon"><Lightbulb size={14} /></span>
                            <p>
                              <b>Most common mistake:</b> Students are struggling with insertion and deletion operations in Linked Lists.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Students needing attention */}
                      {show("At Risk Students") && (
                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><Users size={18} /></span>
                              <div>
                                <h2>Students Needing Attention</h2>
                                <small>Students with low scores, declining progress or incomplete quizzes.</small>
                              </div>
                            </div>
                            <a href="#" className="ai-link" onClick={(e) => e.preventDefault()}>
                              View All <ArrowRight size={12} />
                            </a>
                          </div>

                          <div className="ai-table-wrap">
                            <table className="ai-table">
                              <thead>
                                <tr>
                                  <th>Student</th>
                                  <th>Avg. Score</th>
                                  <th>Trend</th>
                                  <th>Main Concern</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {AT_RISK.map((s, i) => (
                                  <tr key={s.name}>
                                    <td>
                                      <div className="ai-student">
                                        <span className="ai-avatar" style={{ background: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length] }}>
                                          {getInitials(s.name)}
                                        </span>
                                        <div>
                                          <strong>{s.name}</strong>
                                          <small>{s.cls}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="ai-score">{s.score}%</td>
                                    <td>
                                      {s.trend === "down" && <ArrowDown size={14} className="t-down" />}
                                      {s.trend === "up" && <ArrowUp size={14} className="t-up" />}
                                      {s.trend === "flat" && <Minus size={14} className="t-flat" />}
                                    </td>
                                    <td>{s.concern}</td>
                                    <td>
                                      <div className="ai-row-actions">
                                        <button className="ai-view">View <ChevronDown size={11} /></button>
                                        <button className="ai-dots"><MoreVertical size={14} /></button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Subject performance */}
                      {show("Subject Analysis") && (
                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><BarChart3 size={18} /></span>
                              <h2>Subject Performance</h2>
                            </div>
                            <a href="#" className="ai-link" onClick={(e) => e.preventDefault()}>
                              View Details <ArrowRight size={12} />
                            </a>
                          </div>

                          <div className="ai-subj-wrap">
                            <div className="ai-subj-chart">
                              <div className="ai-y">
                                {[100, 75, 50, 25, 0].map((n) => (
                                  <span key={n}>{n}</span>
                                ))}
                              </div>
                              <div className="ai-bars">
                                {SUBJECTS.map((s) => (
                                  <div key={s.name} className="ai-bar-col">
                                    <div className="ai-bar-track">
                                      <div className="ai-bar-fill" style={{ height: `${s.value}%`, background: s.color }} />
                                    </div>
                                    <span>{s.short}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <ul className="ai-subj-legend">
                              {SUBJECTS.map((s) => (
                                <li key={s.name}>
                                  <i style={{ background: s.color }} />
                                  <span>{s.name}</span>
                                  <b>{s.value}%</b>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Quiz insights */}
                      {show("Quiz Insights") && (
                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><HelpCircle size={18} /></span>
                              <div>
                                <h2>Quiz Insights</h2>
                                <small>Most Missed Questions</small>
                              </div>
                            </div>
                            <a href="#" className="ai-link" onClick={(e) => e.preventDefault()}>
                              View All <ArrowRight size={12} />
                            </a>
                          </div>

                          <div className="ai-quiz-list">
                            {QUIZ_INSIGHTS.map((q) => (
                              <div key={q.q} className="ai-quiz-row">
                                <span className="ai-qtag">{q.q}</span>
                                <span className="ai-qtitle">{q.title}</span>
                                <span className="ai-wrong">{q.wrong}% wrong</span>
                                <span className={levelClass(q.level)}>{q.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress + key insights (Overview only) */}
                    {isOverview && (
                      <div className="ai-bottom">
                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><TrendingUp size={18} /></span>
                              <div>
                                <h2>Progress Over Time</h2>
                                <small>Class average score and improvement trend</small>
                              </div>
                            </div>
                            <div className="ai-chart-legend">
                              <span><i style={{ background: "#7c5cfc" }} /> Class Average</span>
                              <span><i style={{ background: "#14b8a6" }} /> Top Performers</span>
                            </div>
                          </div>
                          <ProgressChart />
                        </div>

                        <div className="ai-box">
                          <div className="ai-box-head">
                            <div className="ai-box-title">
                              <span className="ai-box-icon"><Lightbulb size={18} /></span>
                              <h2>Key Insights</h2>
                            </div>
                          </div>
                          <ul className="ai-key">
                            {KEY_INSIGHTS.map((k) => (
                              <li key={k}>
                                <CircleDot size={13} />
                                <span>{k}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>

            {/* ============ RIGHT ============ */}
            <aside className="ai-right">
              <div className="ai-card ai-pad">
                <div className="ai-head-row">
                  <h2><Sparkles size={17} /> AI Recommendations</h2>
                  <a href="#" className="ai-link" onClick={(e) => e.preventDefault()}>View All <ArrowRight size={12} /></a>
                </div>
                <div className="ai-list">
                  {RECOMMENDATIONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button key={r.title} className="ai-list-item">
                        <span className="ai-list-icon"><Icon size={18} /></span>
                        <div>
                          <strong>{r.title}</strong>
                          <small>{r.desc}</small>
                        </div>
                        <ChevronRight size={16} className="ai-chev" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ai-card ai-pad">
                <div className="ai-head-row">
                  <h2><Wand2 size={17} /> Quick Actions</h2>
                </div>
                <div className="ai-list">
                  {QUICK_ACTIONS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button key={q.title} className="ai-list-item">
                        <span className="ai-list-icon"><Icon size={18} /></span>
                        <div>
                          <strong>{q.title}</strong>
                          <small>{q.desc}</small>
                        </div>
                        <ChevronRight size={16} className="ai-chev" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ai-promo">
                <div className="ai-promo-text">
                  <h3>AI is here to help you teach better!</h3>
                  <div className="ai-promo-chips">
                    <span>Better insights</span>
                    <span>Better learning</span>
                    <span>Better results</span>
                  </div>
                </div>
                <Bot size={72} className="ai-promo-art" />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}