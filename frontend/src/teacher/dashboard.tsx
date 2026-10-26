import {
  Sun,
  Moon,
  GraduationCap,
  Users,
  FileText,
  ClipboardList,
  UserCheck,
  BookOpen,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronDown,
  PenLine,
  Send,
  FilePlus2,
  Upload,
  Sparkles,
  Bot,
  Quote,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./dashboard.css";

/* ---------------- Dummy data (baad mein API se aayega) ---------------- */
const CHART_LABELS = ["May 13", "May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"];
const AVG_SCORE = [41, 54, 54, 54, 51, 66, 59, 62];
const COMPLETION = [55, 68, 72, 66, 67, 75, 72, 76];

const STATS = [
  { label: "Total Students", value: "124", note: "12% from last week", trend: "up", icon: Users, tone: "purple" },
  { label: "Active Students", value: "98", note: "8% from last week", trend: "up", icon: UserCheck, tone: "green" },
  { label: "Total Classes", value: "3", note: "0% (no change)", trend: "up", icon: BookOpen, tone: "indigo" },
  { label: "Total Quizzes", value: "12", note: "20% from last week", trend: "up", icon: FileText, tone: "orange" },
  { label: "Pending Assignments", value: "8", note: "3% from last week", trend: "down", icon: ClipboardList, tone: "red" },
  { label: "Class Average", value: "76%", note: "6% from last week", trend: "up", icon: GraduationCap, tone: "purple" },
] as const;

const ACTIVITY = [
  { name: "Ahmed Khan", activity: "Completed Quiz (85%)", tone: "green", cls: "Data Structures", time: "2 hours ago" },
  { name: "Sara Ahmed", activity: "Submitted Assignment", tone: "blue", cls: "Database Systems", time: "3 hours ago" },
  { name: "Ali Raza", activity: "Started Quiz (In Progress)", tone: "orange", cls: "Data Structures", time: "4 hours ago" },
  { name: "Hamza Ali", activity: "Viewed Study Material", tone: "purple", cls: "Web Development", time: "5 hours ago" },
  { name: "Ayesha Noor", activity: "Completed Quiz (92%)", tone: "green", cls: "Data Structures", time: "6 hours ago" },
];

const TOP_STUDENTS = [
  { name: "Sara Ahmed", score: 92 },
  { name: "Umar Farooq", score: 88 },
  { name: "Ayesha Noor", score: 86 },
  { name: "Hamza Ali", score: 84 },
  { name: "Fatima Zahra", score: 82 },
];

const LOW_STUDENTS = [
  { name: "Zainab Malik", score: 42, date: "May 15, 2025" },
  { name: "Daniyal Shah", score: 48, date: "May 16, 2025" },
  { name: "Taha Qureshi", score: 51, date: "May 17, 2025" },
  { name: "Areeba Khan", score: 55, date: "May 18, 2025" },
];

const SUBJECTS = [
  { name: "Data Structures", students: 42, avg: "78%", completion: "88%", trend: "6%", color: "#7c5cfc" },
  { name: "Database Systems", students: 38, avg: "74%", completion: "82%", trend: "5%", color: "#10b981" },
  { name: "Web Development", students: 44, avg: "73%", completion: "80%", trend: "4%", color: "#3b82f6" },
];

const UPCOMING = [
  { title: "Data Structures Quiz", cls: "BSCS - Semester 3", date: "May 21, 2025", time: "10:00 AM", type: "Quiz", icon: PenLine },
  { title: "Python Basics Assignment", cls: "BSCS - Semester 3", date: "May 22, 2025", time: "11:59 PM", type: "Assignment", icon: Users },
  { title: "Web Development Quiz", cls: "BSCS - Semester 3", date: "May 24, 2025", time: "09:00 AM", type: "Quiz", icon: GraduationCap },
  { title: "Database Systems Assignment", cls: "BSCS - Semester 3", date: "May 26, 2025", time: "11:59 PM", type: "Assignment", icon: FileText },
];

const QUIZ_STATUS = [
  { label: "Completed", pct: 87, count: 104, color: "#10b981" },
  { label: "In Progress", pct: 6, count: 7, color: "#f59e0b" },
  { label: "Not Attempted", pct: 7, count: 9, color: "#ef4444" },
];

const AVATAR_COLORS = ["#7c5cfc", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6", "#8b5cf6"];

/* ---------------- Helpers ---------------- */
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Avatar = ({ name, index }: { name: string; index: number }) => (
  <span className="td-avatar" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
    {getInitials(name)}
  </span>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", icon: Sun };
  if (h < 17) return { text: "Good Afternoon", icon: Sun };
  return { text: "Good Evening", icon: Moon };
};

/* ---------------- Line chart (SVG) ---------------- */
const LineChart = () => {
  const W = 600;
  const H = 210;
  const L = 36;
  const R = 12;
  const T = 10;
  const B = 28;
  const n = CHART_LABELS.length;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + ((100 - v) / 100) * (H - T - B);

  const linePath = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaPath = (arr: number[]) => `${linePath(arr)} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <svg className="td-chart" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="tdAvg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7c5cfc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tdComp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className="td-grid" />
          <text x={L - 8} y={y(g) + 3} textAnchor="end" className="td-axis">
            {g}%
          </text>
        </g>
      ))}

      <path d={areaPath(COMPLETION)} fill="url(#tdComp)" />
      <path d={areaPath(AVG_SCORE)} fill="url(#tdAvg)" />
      <path d={linePath(COMPLETION)} fill="none" stroke="#60a5fa" strokeWidth="2" />
      <path d={linePath(AVG_SCORE)} fill="none" stroke="#7c5cfc" strokeWidth="2" />

      {COMPLETION.map((v, i) => (
        <circle key={`c${i}`} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#60a5fa" strokeWidth="1.5" />
      ))}
      {AVG_SCORE.map((v, i) => (
        <circle key={`a${i}`} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#7c5cfc" strokeWidth="1.5" />
      ))}

      {CHART_LABELS.map((lbl, i) => (
        <text key={lbl} x={x(i)} y={H - 8} textAnchor="middle" className="td-axis">
          {lbl}
        </text>
      ))}
    </svg>
  );
};

/* ---------------- Donut ---------------- */
const Donut = () => {
  const r = 52;
  const c = 2 * Math.PI * r;
  const total = QUIZ_STATUS.reduce((s, q) => s + q.count, 0);
  let offset = 0;
  return (
    <div className="td-donut">
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0f8" strokeWidth="18" />
        {QUIZ_STATUS.map((q) => {
          const len = (q.count / total) * c;
          const el = (
            <circle
              key={q.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={q.color}
              strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="td-donut-center">
        <strong>87%</strong>
        <span>Completed</span>
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */
export default function Dashboard() {
  const greet = getGreeting();
  const GreetIcon = greet.icon;

  return (
    <div className="td-shell">
      <Sidebar />

      <div className="td-main">
        <Header />

        <main className="td-page">
          <div className="td-layout">
            {/* ============ LEFT / CENTER ============ */}
            <div className="td-center">
              {/* Welcome banner */}
              <section className="td-banner">
                <div className="td-banner-left">
                  <div className="td-banner-title">
                    <GreetIcon size={34} className="td-sun" />
                    <div>
                      <h1>{greet.text}, Ahmed Khan</h1>
                      <p>Here's what's happening with your classes today.</p>
                    </div>
                  </div>
                  <div className="td-chips">
                    <span className="td-chip"><GraduationCap size={16} /> <b>3</b> Classes</span>
                    <span className="td-chip"><Users size={16} /> <b>124</b> Students</span>
                    <span className="td-chip"><FileText size={16} /> <b>12</b> Quizzes</span>
                    <span className="td-chip"><ClipboardList size={16} /> <b>8</b> Assignments</span>
                  </div>
                </div>
                <div className="td-banner-right">
                  <blockquote>
                    <Quote size={14} className="td-quote-icon" />
                    Great teaching is not about giving answers, it's about creating curiosity.
                  </blockquote>
                  <BookOpen size={76} className="td-banner-art" />
                </div>
              </section>

              {/* Stat cards */}
              <section className="td-stats">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="td-card td-stat">
                      <span className={`td-stat-icon ${s.tone}`}><Icon size={22} /></span>
                      <div>
                        <p>{s.label}</p>
                        <h3>{s.value}</h3>
                        <small className={s.trend}>
                          {s.trend === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {s.note}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Chart + Donut */}
              <section className="td-row-chart">
                <div className="td-card td-pad">
                  <div className="td-card-head">
                    <h2>Class Performance Overview</h2>
                    <button className="td-select-btn">Last 7 Days <ChevronDown size={14} /></button>
                  </div>
                  <div className="td-chart-wrap">
                    <div className="td-chart-main">
                      <div className="td-chart-legend">
                        <span><i style={{ background: "#7c5cfc" }} /> Average Score</span>
                        <span><i style={{ background: "#60a5fa" }} /> Completion Rate</span>
                      </div>
                      <LineChart />
                    </div>
                    <div className="td-chart-side">
                      <div className="td-mini">
                        <p>Average Score</p>
                        <h4>76%</h4>
                        <small><ArrowUp size={11} /> 6%</small>
                      </div>
                      <div className="td-mini">
                        <p>Completion Rate</p>
                        <h4>85%</h4>
                        <small><ArrowUp size={11} /> 8%</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="td-card td-pad">
                  <div className="td-card-head">
                    <h2>Quiz Completion Status</h2>
                  </div>
                  <div className="td-donut-row">
                    <Donut />
                    <ul className="td-legend">
                      {QUIZ_STATUS.map((q) => (
                        <li key={q.label}>
                          <i style={{ background: q.color }} />
                          <span>{q.label}</span>
                          <b>{q.pct}% ({q.count})</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tables */}
              <section className="td-row-tables">
                <div className="td-col">
                  <div className="td-card td-pad">
                    <div className="td-card-head">
                      <h2>Recent Student Activity</h2>
                      <a href="#" className="td-link" onClick={(e) => e.preventDefault()}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div className="td-table-wrap">
                      <table className="td-table">
                        <thead>
                          <tr><th>Student</th><th>Activity</th><th>Class</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                          {ACTIVITY.map((a, i) => (
                            <tr key={a.name + i}>
                              <td>
                                <div className="td-student"><Avatar name={a.name} index={i} />{a.name}</div>
                              </td>
                              <td><span className={`td-pill ${a.tone}`}>{a.activity}</span></td>
                              <td>{a.cls}</td>
                              <td className="td-muted">{a.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="td-card td-pad">
                    <div className="td-card-head">
                      <h2>Subject-wise Performance</h2>
                      <a href="#" className="td-link" onClick={(e) => e.preventDefault()}>View Details <ArrowRight size={12} /></a>
                    </div>
                    <div className="td-table-wrap">
                      <table className="td-table">
                        <thead>
                          <tr><th>Subject</th><th>Total Students</th><th>Avg. Score</th><th>Completion Rate</th><th>Trend</th></tr>
                        </thead>
                        <tbody>
                          {SUBJECTS.map((s) => (
                            <tr key={s.name}>
                              <td>
                                <div className="td-student">
                                  <span className="td-subj-icon" style={{ background: s.color }}><BookOpen size={14} /></span>
                                  {s.name}
                                </div>
                              </td>
                              <td>{s.students}</td>
                              <td>{s.avg}</td>
                              <td>{s.completion}</td>
                              <td className="td-up"><ArrowUp size={12} /> {s.trend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="td-col">
                  <div className="td-card td-pad">
                    <div className="td-card-head">
                      <h2>Top Performing Students</h2>
                      <a href="#" className="td-link" onClick={(e) => e.preventDefault()}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div className="td-table-wrap">
                      <table className="td-table">
                        <thead>
                          <tr><th>#</th><th>Student</th><th>Avg. Score</th><th /></tr>
                        </thead>
                        <tbody>
                          {TOP_STUDENTS.map((s, i) => (
                            <tr key={s.name}>
                              <td>{i + 1}</td>
                              <td>
                                <div className="td-student"><Avatar name={s.name} index={i + 2} />{s.name}</div>
                              </td>
                              <td><span className="td-pill green">{s.score}%</span></td>
                              <td className="td-up"><ArrowUp size={14} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="td-card td-pad">
                    <div className="td-card-head">
                      <h2>Low Performing Students</h2>
                      <a href="#" className="td-link" onClick={(e) => e.preventDefault()}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div className="td-table-wrap">
                      <table className="td-table">
                        <thead>
                          <tr><th>Student</th><th>Avg. Score</th><th>Last Attempt</th></tr>
                        </thead>
                        <tbody>
                          {LOW_STUDENTS.map((s, i) => (
                            <tr key={s.name}>
                              <td>
                                <div className="td-student"><Avatar name={s.name} index={i + 4} />{s.name}</div>
                              </td>
                              <td><span className="td-pill red">{s.score}%</span></td>
                              <td className="td-muted">{s.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ============ RIGHT COLUMN ============ */}
            <aside className="td-right">
              <div className="td-card td-today">
                <span className="td-today-icon"><CalendarDays size={22} /></span>
                <div>
                  <strong>Today</strong>
                  <p>May 20, 2025</p>
                </div>
                <button className="td-outline-btn">View Calendar <ArrowRight size={13} /></button>
              </div>

              <div className="td-card td-pad">
                <div className="td-card-head">
                  <h2>Upcoming</h2>
                  <a href="#" className="td-link" onClick={(e) => e.preventDefault()}>View All <ArrowRight size={12} /></a>
                </div>
                <div className="td-upcoming">
                  {UPCOMING.map((u) => {
                    const Icon = u.icon;
                    return (
                      <div key={u.title} className="td-up-item">
                        <span className="td-up-icon"><Icon size={18} /></span>
                        <div className="td-up-text">
                          <strong>{u.title}</strong>
                          <small>{u.cls}</small>
                          <small>{u.date} • {u.time}</small>
                        </div>
                        <span className={u.type === "Quiz" ? "td-tag quiz" : "td-tag assign"}>{u.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="td-card td-pad">
                <div className="td-card-head">
                  <h2>Quick Actions</h2>
                </div>
                <div className="td-quick">
                  <button><span><Send size={18} /></span> Create Quiz</button>
                  <button><span><FilePlus2 size={18} /></span> Add Assignment</button>
                  <button><span><Users size={18} /></span> Add Class</button>
                  <button><span><Upload size={18} /></span> Upload Material</button>
                </div>
              </div>

              <div className="td-ai">
                <div className="td-ai-text">
                  <Sparkles size={18} />
                  <h3>AI Teaching Insights</h3>
                  <p>Get personalized recommendations for your classes and students.</p>
                  <button>View Insights</button>
                </div>
                <Bot size={84} className="td-ai-art" />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}