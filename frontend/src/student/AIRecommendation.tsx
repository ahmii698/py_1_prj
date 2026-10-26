import {
  Bot,
  Compass,
  Crosshair,
  Zap,
  Target,
  FileText,
  AlertTriangle,
  Star,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Flame,
  Check,
  Clock,
  Lock,
  Rocket,
  Upload,
  FilePlus2,
  CalendarDays,
  Network,
  Code2,
  Database,
  Atom,
  Layers,
  Globe,
  Repeat,
  Braces,
  Brain,
  TrendingUp,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./AIRecommendation.css";

/* ---------------- DATA ---------------- */

const chips = [
  { label: "Smarter Learning Path", icon: <Compass size={14} /> },
  { label: "Focus on Weak Topics", icon: <Crosshair size={14} /> },
  { label: "Improve Faster", icon: <Zap size={14} /> },
  { label: "Achieve Your Goals", icon: <Target size={14} /> },
];

const recommended = [
  {
    subject: "Computer Science",
    tone: "violet",
    icon: <Network size={26} />,
    title: "Linked Lists – Complete Guide",
    text: "Focus on weak areas with targeted quiz and concept revision.",
    questions: 12,
    level: "Medium",
    cta: "Start Learning",
  },
  {
    subject: "Programming",
    tone: "blue",
    icon: <Code2 size={26} />,
    title: "Recursion – Practice Quiz",
    text: "Improve your understanding with AI generated questions.",
    questions: 10,
    level: "Hard",
    cta: "Start Quiz",
  },
  {
    subject: "Database Systems",
    tone: "green",
    icon: <Database size={26} />,
    title: "Database Normalization",
    text: "Review key concepts and take a short quiz.",
    questions: 8,
    level: "Medium",
    cta: "Start Learning",
  },
  {
    subject: "Web Development",
    tone: "sky",
    icon: <Atom size={26} />,
    title: "React JS – Advanced Concepts",
    text: "Learn advanced topics with practical examples and quiz.",
    questions: 10,
    level: "Medium",
    cta: "Start Learning",
  },
];

const weakTopics = [
  { name: "Linked Lists", value: 35, trend: -12, color: "#f2555a", icon: <Braces size={14} />, tone: "red", action: "Practice Quiz + Study", kind: "primary" },
  { name: "Recursion", value: 62, trend: -5, color: "#fbb02d", icon: <Repeat size={14} />, tone: "orange", action: "Practice Quiz", kind: "primary" },
  { name: "Database Systems", value: 68, trend: 8, color: "#22b573", icon: <Database size={14} />, tone: "green", action: "Study Material", kind: "soft" },
  { name: "Web Development", value: 72, trend: 10, color: "#3b9cff", icon: <Globe size={14} />, tone: "blue", action: "Practice Quiz", kind: "primary" },
  { name: "OOP Concepts", value: 81, trend: 6, color: "#7c4dff", icon: <Layers size={14} />, tone: "violet", action: "View Resources", kind: "soft" },
];

const path = [
  { n: 1, title: "Linked Lists", text: "Start with a quick revision and 10 practice questions.", time: "Est. 1 hour", tone: "red", state: "start" },
  { n: 2, title: "Recursion", text: "Continue with concept review and quiz.", time: "Est. 1.5 hours", tone: "orange", state: "outline" },
  { n: 3, title: "Algorithms", text: "Move to advanced topics based on your progress.", time: "Est. 2 hours", tone: "green", state: "locked" },
  { n: 4, title: "Database Systems", text: "Complete this path to improve your overall score.", time: "Est. 1.5 hours", tone: "blue", state: "locked" },
];

const quickActions = [
  { title: "Generate Quiz", text: "Create a new quiz from your PDF", icon: <FilePlus2 size={16} /> },
  { title: "Upload PDF", text: "Add study material", icon: <Upload size={16} /> },
  { title: "Study Schedule", text: "Plan your study time", icon: <CalendarDays size={16} /> },
  { title: "AI Assistant", text: "Ask anything from your PDFs", icon: <Bot size={16} /> },
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

const topRecommended = [
  { n: 1, name: "Linked Lists", acc: 35, tone: "red", icon: <Braces size={16} /> },
  { n: 2, name: "Recursion", acc: 62, tone: "orange", icon: <Repeat size={16} /> },
  { n: 3, name: "Database Systems", acc: 68, tone: "green", icon: <Database size={16} /> },
  { n: 4, name: "Web Development", acc: 72, tone: "blue", icon: <Globe size={16} /> },
  { n: 5, name: "OOP Concepts", acc: 81, tone: "violet", icon: <Layers size={16} /> },
];

/* ---------------- HELPERS ---------------- */

const R = 32;
const CIRC = 2 * Math.PI * R;
const PROGRESS = 68;

/* ---------------- COMPONENT ---------------- */

function AIRecommendation() {
  return (
    <div className="ar-shell">
      <Sidebar />

      <div className="ar-main">
        <Header />

        <div className="ar-content">
          {/* ============ CENTER ============ */}
          <div className="ar-center">
            {/* Banner */}
            <div className="ar-banner">
              <div className="ar-banner-top">
                <span className="ar-banner-bot">
                  <Bot size={44} />
                </span>
                <div>
                  <h1 className="ar-title">AI Learning Recommendations</h1>
                  <p className="ar-subtitle">
                    Personalized suggestions based on your performance, goals and learning pattern.
                  </p>
                </div>
                <span className="ar-banner-note">Your progress matters!</span>
              </div>
              <div className="ar-chips">
                {chips.map((c) => (
                  <div className="ar-chip" key={c.label}>
                    <span className="ar-chip-icon">{c.icon}</span>
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary cards */}
            <div className="ar-summary">
              <div className="ar-card ar-sum">
                <div className="ar-sum-head">
                  <span className="ar-sum-icon violet">
                    <FileText size={16} />
                  </span>
                  <span className="ar-sum-label">Overall Progress</span>
                </div>
                <div className="ar-progress">
                  <div className="ar-progress-donut">
                    <svg viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r={R} className="ar-donut-bg" />
                      <circle
                        cx="40"
                        cy="40"
                        r={R}
                        className="ar-donut-fg"
                        strokeDasharray={`${(PROGRESS / 100) * CIRC} ${CIRC}`}
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="ar-progress-center">
                      <b>{PROGRESS}%</b>
                      <span>Completed</span>
                    </div>
                  </div>
                  <p className="ar-progress-text">
                    Completed
                    <br />
                    <span>Keep going! You're doing great.</span>
                  </p>
                </div>
              </div>

              <div className="ar-card ar-sum">
                <div className="ar-sum-head">
                  <span className="ar-sum-icon red">
                    <AlertTriangle size={16} />
                  </span>
                  <span className="ar-sum-label">Weakest Topic</span>
                </div>
                <p className="ar-sum-value">Linked Lists</p>
                <p className="ar-sum-sub">
                  <b>35%</b> accuracy
                </p>
                <div className="ar-mini-bar">
                  <div style={{ width: "35%", background: "#f2555a" }} />
                </div>
                <button type="button" className="ar-btn-soft">
                  Focus Here <ArrowRight size={12} />
                </button>
              </div>

              <div className="ar-card ar-sum">
                <div className="ar-sum-head">
                  <span className="ar-sum-icon amber">
                    <Star size={16} />
                  </span>
                  <span className="ar-sum-label">Recommended Next</span>
                </div>
                <p className="ar-sum-value">Algorithms</p>
                <p className="ar-sum-sub">Suggested Quiz + Study Material</p>
                <button type="button" className="ar-btn-primary">
                  Start Learning <ArrowRight size={12} />
                </button>
              </div>

              <div className="ar-card ar-sum">
                <div className="ar-sum-head">
                  <span className="ar-sum-icon indigo">
                    <Target size={16} />
                  </span>
                  <span className="ar-sum-label">Learning Goal</span>
                </div>
                <p className="ar-sum-value">Improve Overall Score</p>
                <p className="ar-goal">
                  78% <ArrowRight size={14} /> <b>90%</b>
                </p>
                <p className="ar-sum-sub">in next 4 weeks</p>
                <button type="button" className="ar-btn-soft">
                  View Plan <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Recommended For You */}
            <div className="ar-card">
              <div className="ar-card-head">
                <h3 className="ar-head-icon">
                  <Sparkles size={14} /> Recommended For You
                </h3>
                <a href="#all" className="ar-link">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <div className="ar-rec-grid">
                {recommended.map((r) => (
                  <div className="ar-rec" key={r.title}>
                    <div className="ar-rec-top">
                      <span className={`ar-subject ${r.tone}`}>{r.subject}</span>
                      <span className={`ar-rec-art ${r.tone}`}>{r.icon}</span>
                    </div>
                    <h4 className="ar-rec-title">{r.title}</h4>
                    <p className="ar-rec-text">{r.text}</p>
                    <div className="ar-rec-meta">
                      <span className="ar-meta-pill">+{r.questions} Questions</span>
                      <span className={`ar-level ${r.level.toLowerCase()}`}>{r.level}</span>
                    </div>
                    <button type="button" className="ar-btn-primary ar-btn-block">
                      {r.cta} <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak topics + Learning path */}
            <div className="ar-row-bottom">
              <div className="ar-card">
                <div className="ar-card-head">
                  <h3 className="ar-head-icon">
                    <AlertTriangle size={14} className="red" /> Your Weak Topics
                  </h3>
                  <a href="#all" className="ar-link">
                    View All <ArrowRight size={12} />
                  </a>
                </div>
                <table className="ar-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Accuracy</th>
                      <th>Trend</th>
                      <th>Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weakTopics.map((t) => (
                      <tr key={t.name}>
                        <td>
                          <div className="ar-topic">
                            <span className={`ar-topic-icon ${t.tone}`}>{t.icon}</span>
                            {t.name}
                          </div>
                        </td>
                        <td>
                          <div className="ar-acc">
                            <b>{t.value}%</b>
                            <div className="ar-acc-bar">
                              <div style={{ width: `${t.value}%`, background: t.color }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`ar-trend ${t.trend < 0 ? "down" : "up"}`}>
                            {t.trend < 0 ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
                            {Math.abs(t.trend)}%
                          </span>
                        </td>
                        <td>
                          <button type="button" className={`ar-action ${t.kind}`}>
                            {t.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ar-card">
                <div className="ar-card-head">
                  <h3 className="ar-head-icon">
                    <TrendingUp size={14} /> Learning Path Suggestion
                  </h3>
                </div>
                <div className="ar-path">
                  {path.map((p, i) => (
                    <div className="ar-path-item" key={p.n}>
                      <div className="ar-path-rail">
                        <span className={`ar-path-num ${p.tone}`}>{p.n}</span>
                        {i < path.length - 1 && <span className="ar-path-line" />}
                      </div>
                      <div className="ar-path-body">
                        <p className="ar-path-title">{p.title}</p>
                        <p className="ar-path-text">{p.text}</p>
                        <p className="ar-path-time">
                          <Clock size={10} /> {p.time}
                        </p>
                      </div>
                      {p.state === "start" && (
                        <button type="button" className="ar-path-btn solid">
                          Start
                        </button>
                      )}
                      {p.state === "outline" && (
                        <button type="button" className="ar-path-btn outline">
                          Start
                        </button>
                      )}
                      {p.state === "locked" && (
                        <span className="ar-path-btn locked">
                          <Lock size={10} /> Locked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="ar-path-note">
                  <Rocket size={14} />
                  Follow this personalized path to improve your weak topics and achieve your goals faster!
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="ar-right">
            <div className="ar-card">
              <div className="ar-card-head">
                <h3 className="ar-head-icon">
                  <Zap size={14} /> Quick Actions
                </h3>
              </div>
              <div className="ar-qa-list">
                {quickActions.map((q) => (
                  <button type="button" className="ar-qa" key={q.title}>
                    <span className="ar-qa-icon">{q.icon}</span>
                    <span className="ar-qa-text">
                      <b>{q.title}</b>
                      <small>{q.text}</small>
                    </span>
                    <ArrowUpRight size={14} className="ar-qa-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="ar-card">
              <div className="ar-card-head">
                <h3 className="ar-head-icon">
                  <Flame size={14} className="flame" /> Your Learning Streak
                </h3>
              </div>
              <div className="ar-streak-main">
                <span className="ar-streak-flame">
                  <Flame size={20} />
                </span>
                <div>
                  <p className="ar-streak-days">7 Days</p>
                  <p className="ar-streak-note">Keep your streak going!</p>
                </div>
              </div>
              <div className="ar-streak-row">
                {streakDays.map((s) => (
                  <div className="ar-streak-day" key={s.d}>
                    <span className={`ar-streak-dot ${s.done ? "done" : ""}`}>{s.done && <Check size={12} />}</span>
                    <span>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ar-card">
              <div className="ar-card-head">
                <h3 className="ar-head-icon">
                  <Brain size={14} /> Top Recommended Topics
                </h3>
                <a href="#all" className="ar-link">
                  View All <ArrowRight size={12} />
                </a>
              </div>
              <div className="ar-top-list">
                {topRecommended.map((t) => (
                  <div className="ar-top" key={t.name}>
                    <span className="ar-top-n">{t.n}</span>
                    <span className={`ar-top-icon ${t.tone}`}>{t.icon}</span>
                    <div className="ar-top-info">
                      <p>{t.name}</p>
                      <span className={`ar-acc-tag ${t.tone}`}>{t.acc}% accuracy</span>
                    </div>
                    <button type="button" className="ar-practice">
                      Practice Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AIRecommendation;