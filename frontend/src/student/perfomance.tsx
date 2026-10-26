import {
  Trophy,
  FileText,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Calendar,
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  Star,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowUp,
  Award,
  Compass,
  Brain,
  Layers,
  Database,
  Globe,
  Repeat,
  Braces,
  Link2,
  Check,
  Bot,
  Code2,
  Network,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./perfomance.css";

/* ---------------- DATA ---------------- */

const stats = [
  { label: "Average Score", value: "78%", note: "12% from last 30 days", icon: <Trophy size={18} />, tone: "amber" },
  { label: "Total Quizzes", value: "18", note: "3 this week", icon: <FileText size={18} />, tone: "violet" },
  { label: "Completed Quizzes", value: "15", note: "2 this week", icon: <CheckCircle2 size={18} />, tone: "green" },
  { label: "Study Hours", value: "18.6", note: "6% from last 30 days", icon: <Clock size={18} />, tone: "indigo" },
  { label: "Accuracy Rate", value: "85%", note: "6% from last 30 days", icon: <Target size={18} />, tone: "purple" },
];

const scoreLabels = ["Apr 25", "Apr 28", "May 1", "May 4", "May 7", "May 10", "May 13", "May 16", "May 19", "May 22", "May 25"];
const scoreData = [40, 45, 50, 48, 50, 62, 58, 65, 60, 68, 64, 62, 66, 72, 76, 74, 66, 72, 76, 80, 83];

const subjects = [
  { name: "Computer Science", value: 88, color: "#7c4dff" },
  { name: "Programming", value: 76, color: "#3b9cff" },
  { name: "Database Systems", value: 68, color: "#22b573" },
  { name: "Web Development", value: 82, color: "#fbb02d" },
  { name: "Others", value: 60, color: "#cfd5e3" },
];

const topics = [
  { name: "Arrays", value: 92, color: "#7c4dff", icon: <Braces size={14} /> },
  { name: "Linked Lists", value: 68, color: "#3b9cff", icon: <Link2 size={14} /> },
  { name: "Recursion", value: 74, color: "#14b88a", icon: <Repeat size={14} /> },
  { name: "OOP Concepts", value: 81, color: "#fbb02d", icon: <Layers size={14} /> },
  { name: "Database Queries", value: 63, color: "#f2555a", icon: <Database size={14} /> },
  { name: "Web APIs", value: 79, color: "#14b88a", icon: <Globe size={14} /> },
];

const quizResults = [
  { name: "Data Structures Quiz", subject: "Computer Science", score: 90, date: "May 20, 2025", icon: <Network size={14} />, tone: "violet" },
  { name: "React Basics Quiz", subject: "Programming", score: 72, date: "May 18, 2025", icon: <Code2 size={14} />, tone: "blue" },
  { name: "Algorithms Quiz", subject: "Computer Science", score: 85, date: "May 16, 2025", icon: <Brain size={14} />, tone: "violet" },
  { name: "Database Quiz", subject: "Database Systems", score: 65, date: "May 14, 2025", icon: <Database size={14} />, tone: "red" },
  { name: "Web Development Quiz", subject: "Web Development", score: 78, date: "May 12, 2025", icon: <Globe size={14} />, tone: "green" },
];

const strong = [
  { name: "OOP Concepts", value: 81 },
  { name: "Arrays", value: 92 },
  { name: "Web Development", value: 82 },
];

const weak = [
  { name: "Database Systems", value: 65 },
  { name: "Linked Lists", value: 68 },
  { name: "Recursion", value: 74 },
];

const comparison = [
  { label: "CS", prev: 66, latest: 80 },
  { label: "Programming", prev: 72, latest: 82 },
  { label: "DB", prev: 62, latest: 78 },
  { label: "Web Dev", prev: 70, latest: 88 },
  { label: "Others", prev: 88, latest: 95 },
];

const insights = [
  { title: "Great Progress!", text: "Your average score improved by 12% compared to the last 30 days.", icon: <ArrowUp size={16} />, tone: "green" },
  { title: "Focus Area", text: "Database Systems is your weakest subject. Consider more practice quizzes.", icon: <AlertTriangle size={16} />, tone: "red" },
  { title: "Strong Point", text: "You scored 92% in Computer Science. Keep it up!", icon: <Star size={16} />, tone: "blue" },
  { title: "Recommendation", text: "Try our AI recommendations for personalized study material.", icon: <Sparkles size={16} />, tone: "violet" },
];

const streakDays = [
  { d: "Mon", done: true },
  { d: "Tue", done: true },
  { d: "Wed", done: true },
  { d: "Thu", done: true },
  { d: "Fri", done: true },
  { d: "Sat", done: true },
  { d: "Sun", done: false },
];

const achievements = [
  { name: "First Quiz", xp: "+50 XP", icon: <Award size={20} />, tone: "violet" },
  { name: "Streak 7", xp: "+100 XP", icon: <Flame size={20} />, tone: "orange" },
  { name: "Top Score", xp: "+200 XP", icon: <Star size={20} />, tone: "purple" },
  { name: "Explorer", xp: "+150 XP", icon: <Compass size={20} />, tone: "violet" },
];

/* ---------------- HELPERS ---------------- */

const scoreClass = (v: number) => (v >= 80 ? "good" : v >= 70 ? "mid" : "bad");

/* Line chart geometry */
const CW = 600;
const CH = 190;
const PL = 34;
const PR = 10;
const PT = 10;
const PB = 6;

function buildLine() {
  const n = scoreData.length;
  const pts = scoreData.map((v, i) => {
    const x = PL + (i / (n - 1)) * (CW - PL - PR);
    const y = PT + (1 - v / 100) * (CH - PT - PB);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${CH - PB} L${pts[0][0].toFixed(1)},${CH - PB} Z`;
  return { pts, line, area };
}

/* Donut geometry */
const R = 62;
const CIRC = 2 * Math.PI * R;

/* ---------------- COMPONENT ---------------- */

function Performance() {
  const { pts, line, area } = buildLine();
  const total = subjects.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const gap = 3;
  const tipIdx = 15;

  return (
    <div className="pf-shell">
      <Sidebar />

      <div className="pf-main">
        <Header />

        <div className="pf-content">
          {/* ============ LEFT / CENTER ============ */}
          <div className="pf-center">
            {/* Page title */}
            <div className="pf-title-card">
              <div className="pf-title-left">
                <div className="pf-title-icon">
                  <BarChart3 size={26} />
                </div>
                <div>
                  <h1 className="pf-title">Performance Analytics</h1>
                  <p className="pf-subtitle">
                    Track your progress, analyze your strengths and weaknesses, and see how you're improving over time.
                  </p>
                </div>
              </div>
              <div className="pf-select pf-select-lg">
                <Calendar size={14} />
                <select defaultValue="30" aria-label="Date range">
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Stat cards */}
            <div className="pf-stats">
              {stats.map((s) => (
                <div className="pf-card pf-stat" key={s.label}>
                  <div className="pf-stat-top">
                    <span className={`pf-stat-icon ${s.tone}`}>{s.icon}</span>
                    <span className="pf-stat-label">{s.label}</span>
                  </div>
                  <p className="pf-stat-value">{s.value}</p>
                  <p className="pf-stat-note">
                    <ArrowUp size={12} /> {s.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Score progress + Subject-wise */}
            <div className="pf-row pf-row-chart">
              <div className="pf-card">
                <div className="pf-card-head">
                  <h3>Score Progress Over Time</h3>
                  <div className="pf-select">
                    <select defaultValue="30" aria-label="Range">
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 90 Days</option>
                    </select>
                    <ChevronDown size={12} />
                  </div>
                </div>

                <div className="pf-line-wrap">
                  <svg viewBox={`0 0 ${CW} ${CH}`} className="pf-line-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pfArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#7c4dff" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {[0, 25, 50, 75, 100].map((g) => {
                      const y = PT + (1 - g / 100) * (CH - PT - PB);
                      return (
                        <g key={g}>
                          <line x1={PL} x2={CW - PR} y1={y} y2={y} className="pf-grid-line" />
                          <text x={PL - 6} y={y + 3} textAnchor="end" className="pf-axis-text">
                            {g}%
                          </text>
                        </g>
                      );
                    })}
                    <path d={area} fill="url(#pfArea)" />
                    <path d={line} className="pf-line-path" />
                    {pts.map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r={i === tipIdx ? 4 : 2.6} className="pf-dot" />
                    ))}
                  </svg>

                  <div
                    className="pf-tooltip"
                    style={{ left: `${(pts[tipIdx][0] / CW) * 100}%`, top: `${(pts[tipIdx][1] / CH) * 100}%` }}
                  >
                    <span>May 22, 2025</span>
                    <b>92%</b>
                  </div>

                  <div className="pf-x-labels">
                    {scoreLabels.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <h3>Subject-wise Performance</h3>
                </div>
                <div className="pf-donut-row">
                  <div className="pf-donut">
                    <svg viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r={R} className="pf-donut-bg" />
                      {subjects.map((s) => {
                        const len = (s.value / total) * CIRC;
                        const dash = Math.max(len - gap, 0);
                        const el = (
                          <circle
                            key={s.name}
                            cx="80"
                            cy="80"
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="18"
                            strokeDasharray={`${dash} ${CIRC - dash}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 80 80)"
                          />
                        );
                        offset += len;
                        return el;
                      })}
                    </svg>
                    <div className="pf-donut-center">
                      <b>78%</b>
                      <span>Overall Score</span>
                    </div>
                  </div>

                  <ul className="pf-legend">
                    {subjects.map((s) => (
                      <li key={s.name}>
                        <span className="pf-legend-dot" style={{ background: s.color }} />
                        <span className="pf-legend-name">{s.name}</span>
                        <span className="pf-legend-val">{s.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance by topic + Recent results */}
            <div className="pf-row pf-row-tables">
              <div className="pf-card">
                <div className="pf-card-head">
                  <h3>Performance by Topic</h3>
                  <a href="#all" className="pf-link">
                    View All <ArrowRight size={12} />
                  </a>
                </div>
                <div className="pf-topic-head">
                  <span>Topic</span>
                  <span>Score</span>
                </div>
                <div className="pf-topic-list">
                  {topics.map((t) => (
                    <div className="pf-topic" key={t.name}>
                      <span className="pf-topic-icon" style={{ background: t.color }}>
                        {t.icon}
                      </span>
                      <span className="pf-topic-name">{t.name}</span>
                      <span className="pf-topic-score">{t.value}%</span>
                      <div className="pf-bar">
                        <div className="pf-bar-fill" style={{ width: `${t.value}%`, background: t.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <h3>Recent Quiz Results</h3>
                  <a href="#all" className="pf-link">
                    View All <ArrowRight size={12} />
                  </a>
                </div>
                <table className="pf-table">
                  <thead>
                    <tr>
                      <th>Quiz Name</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.map((q) => (
                      <tr key={q.name}>
                        <td>
                          <div className="pf-quiz-name">
                            <span className={`pf-quiz-icon ${q.tone}`}>{q.icon}</span>
                            {q.name}
                          </div>
                        </td>
                        <td>
                          <span className="pf-tag">{q.subject}</span>
                        </td>
                        <td>
                          <span className={`pf-score ${scoreClass(q.score)}`}>{q.score}%</span>
                        </td>
                        <td className="pf-date">{q.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strengths + Progress comparison */}
            <div className="pf-row pf-row-bottom">
              <div className="pf-card">
                <div className="pf-card-head">
                  <h3 className="pf-head-icon">
                    <Sparkles size={14} /> Strengths &amp; Weaknesses
                  </h3>
                </div>
                <div className="pf-sw">
                  <div>
                    <p className="pf-sw-title">Your Strongest Topics</p>
                    {strong.map((s) => (
                      <div className="pf-sw-item" key={s.name}>
                        <span className="pf-sw-icon good">
                          <Check size={12} />
                        </span>
                        <span className="pf-sw-name">{s.name}</span>
                        <span className="pf-sw-val good">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="pf-sw-divider" />
                  <div>
                    <p className="pf-sw-title">Topics to Improve</p>
                    {weak.map((s) => (
                      <div className="pf-sw-item" key={s.name}>
                        <span className="pf-sw-icon bad">
                          <AlertTriangle size={12} />
                        </span>
                        <span className="pf-sw-name">{s.name}</span>
                        <span className="pf-sw-val bad">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <h3>Progress Comparison</h3>
                  <div className="pf-select">
                    <select defaultValue="4" aria-label="Weeks">
                      <option value="4">Last 4 Weeks</option>
                      <option value="8">Last 8 Weeks</option>
                    </select>
                    <ChevronDown size={12} />
                  </div>
                </div>
                <div className="pf-cmp-legend">
                  <span>
                    <i className="prev" /> Previous
                  </span>
                  <span>
                    <i className="latest" /> Latest
                  </span>
                </div>
                <div className="pf-cmp">
                  <div className="pf-cmp-y">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                  <div className="pf-cmp-plot">
                    {comparison.map((c) => (
                      <div className="pf-cmp-group" key={c.label}>
                        <div className="pf-cmp-bars">
                          <div className="pf-cmp-bar prev" style={{ height: `${c.prev}%` }} />
                          <div className="pf-cmp-bar latest" style={{ height: `${c.latest}%` }} />
                        </div>
                        <span className="pf-cmp-label">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <aside className="pf-right">
            <div className="pf-card">
              <div className="pf-card-head">
                <h3 className="pf-head-icon">
                  <Lightbulb size={14} /> Quick Insights
                </h3>
              </div>
              <div className="pf-insights">
                {insights.map((i) => (
                  <div className="pf-insight" key={i.title}>
                    <span className={`pf-insight-icon ${i.tone}`}>{i.icon}</span>
                    <div>
                      <p className="pf-insight-title">{i.title}</p>
                      <p className="pf-insight-text">{i.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-card">
              <div className="pf-card-head">
                <h3 className="pf-head-icon">
                  <Flame size={14} className="flame" /> Learning Streak
                </h3>
              </div>
              <div className="pf-streak-main">
                <span className="pf-streak-flame">
                  <Flame size={22} />
                </span>
                <div>
                  <p className="pf-streak-days">7 Days</p>
                  <p className="pf-streak-note">Keep your streak going!</p>
                </div>
              </div>
              <div className="pf-streak-row">
                {streakDays.map((s) => (
                  <div className="pf-streak-day" key={s.d}>
                    <span className={`pf-streak-dot ${s.done ? "done" : ""}`}>{s.done && <Check size={12} />}</span>
                    <span>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-card">
              <div className="pf-card-head">
                <h3>Achievements</h3>
                <a href="#all" className="pf-link">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <div className="pf-ach">
                {achievements.map((a) => (
                  <div className="pf-ach-item" key={a.name}>
                    <span className={`pf-ach-icon ${a.tone}`}>{a.icon}</span>
                    <p className="pf-ach-name">{a.name}</p>
                    <p className="pf-ach-xp">{a.xp}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pf-ai">
              <div className="pf-ai-text">
                <span className="pf-ai-icon">
                  <Brain size={20} />
                </span>
                <h3>AI Recommendations</h3>
                <p>Based on your performance, we've found some areas you can improve.</p>
                <button type="button" className="pf-ai-btn">
                  View Recommendations <ArrowRight size={14} />
                </button>
              </div>
              <span className="pf-ai-bot">
                <Bot size={54} />
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Performance;