import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  History,
  FileText,
  CheckCircle2,
  Trophy,
  Star,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  Upload,
  Target,
  Play,
  Clock,
  Calendar,
  FileCheck2,
  Brain,
  Code2,
  Database,
  Globe,
  Cpu,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./quizhistory.css";

type Subject =
  | "Computer Science"
  | "Programming"
  | "Database"
  | "Web Development"
  | "AI & Data Science";

type Status = "Completed" | "Failed";

interface Quiz {
  id: number;
  name: string;
  questions: number;
  subject: Subject;
  pdf: string;
  pages: number;
  score: number;
  time: string;
  date: string;
  clock: string;
  status: Status;
}

const quizzes: Quiz[] = [
  { id: 1, name: "Data Structures Quiz", questions: 10, subject: "Computer Science", pdf: "DSA Notes.pdf", pages: 24, score: 90, time: "12m 34s", date: "May 20, 2025", clock: "10:30 AM", status: "Completed" },
  { id: 2, name: "Python Basics Quiz", questions: 10, subject: "Programming", pdf: "Python Basics.pdf", pages: 18, score: 70, time: "15m 20s", date: "May 18, 2025", clock: "02:15 PM", status: "Completed" },
  { id: 3, name: "Database Systems Quiz", questions: 15, subject: "Database", pdf: "DB Systems.pdf", pages: 32, score: 85, time: "18m 45s", date: "May 16, 2025", clock: "11:20 AM", status: "Completed" },
  { id: 4, name: "Web Development Quiz", questions: 10, subject: "Web Development", pdf: "React JS.pdf", pages: 28, score: 60, time: "14m 10s", date: "May 12, 2025", clock: "04:35 PM", status: "Completed" },
  { id: 5, name: "JavaScript Essentials", questions: 10, subject: "Programming", pdf: "JavaScript.pdf", pages: 20, score: 100, time: "09m 52s", date: "May 10, 2025", clock: "01:10 PM", status: "Completed" },
  { id: 6, name: "Operating Systems Quiz", questions: 10, subject: "Computer Science", pdf: "OS Concepts.pdf", pages: 26, score: 75, time: "16m 33s", date: "May 8, 2025", clock: "09:50 AM", status: "Completed" },
  { id: 7, name: "Machine Learning Quiz", questions: 12, subject: "AI & Data Science", pdf: "ML Basics.pdf", pages: 40, score: 55, time: "20m 15s", date: "May 5, 2025", clock: "03:22 PM", status: "Failed" },
  { id: 8, name: "Computer Networks Quiz", questions: 10, subject: "Computer Science", pdf: "Networks.pdf", pages: 22, score: 80, time: "13m 40s", date: "May 3, 2025", clock: "11:05 AM", status: "Completed" },
  { id: 9, name: "Data Structures Quiz", questions: 10, subject: "Computer Science", pdf: "DSA Notes.pdf", pages: 24, score: 65, time: "17m 12s", date: "Apr 28, 2025", clock: "05:40 PM", status: "Completed" },
  { id: 10, name: "Python Advanced Quiz", questions: 15, subject: "Programming", pdf: "Python Advanced.pdf", pages: 36, score: 88, time: "22m 07s", date: "Apr 25, 2025", clock: "10:18 AM", status: "Completed" },
  { id: 11, name: "CSS Fundamentals Quiz", questions: 10, subject: "Web Development", pdf: "CSS Basics.pdf", pages: 22, score: 82, time: "11m 30s", date: "Apr 22, 2025", clock: "12:10 PM", status: "Completed" },
  { id: 12, name: "SQL Joins Quiz", questions: 10, subject: "Database", pdf: "SQL Joins.pdf", pages: 18, score: 78, time: "13m 05s", date: "Apr 20, 2025", clock: "09:25 AM", status: "Completed" },
  { id: 13, name: "React Hooks Quiz", questions: 10, subject: "Programming", pdf: "React Hooks.pdf", pages: 20, score: 66, time: "15m 48s", date: "Apr 18, 2025", clock: "04:00 PM", status: "Completed" },
  { id: 14, name: "Neural Networks Quiz", questions: 12, subject: "AI & Data Science", pdf: "NN Intro.pdf", pages: 36, score: 58, time: "19m 20s", date: "Apr 15, 2025", clock: "02:45 PM", status: "Failed" },
  { id: 15, name: "Linux Basics Quiz", questions: 10, subject: "Computer Science", pdf: "Linux.pdf", pages: 24, score: 92, time: "10m 12s", date: "Apr 12, 2025", clock: "11:40 AM", status: "Completed" },
  { id: 16, name: "Algorithms Quiz", questions: 15, subject: "Computer Science", pdf: "Algorithms.pdf", pages: 40, score: 87, time: "21m 30s", date: "Apr 10, 2025", clock: "03:15 PM", status: "Completed" },
  { id: 17, name: "HTML Essentials Quiz", questions: 10, subject: "Web Development", pdf: "HTML.pdf", pages: 16, score: 95, time: "08m 44s", date: "Apr 8, 2025", clock: "10:00 AM", status: "Completed" },
  { id: 18, name: "Python OOP Quiz", questions: 10, subject: "Programming", pdf: "OOP.pdf", pages: 28, score: 74, time: "14m 55s", date: "Apr 5, 2025", clock: "01:30 PM", status: "Completed" },
];

const subjectList: Subject[] = [
  "Computer Science",
  "Programming",
  "Database",
  "Web Development",
  "AI & Data Science",
];

const subjectTone: Record<Subject, string> = {
  "Computer Science": "purple",
  Programming: "blue",
  Database: "red",
  "Web Development": "teal",
  "AI & Data Science": "violet",
};

const subjectIcon: Record<Subject, ReactNode> = {
  "Computer Science": <Cpu size={15} />,
  Programming: <Code2 size={15} />,
  Database: <Database size={15} />,
  "Web Development": <Globe size={15} />,
  "AI & Data Science": <Brain size={15} />,
};

const stats: { label: string; value: string; sub: string; icon: ReactNode; tone: string; up?: boolean }[] = [
  { label: "Total Quizzes", value: "18", sub: "3 this month", icon: <FileText size={18} />, tone: "purple", up: true },
  { label: "Completed", value: "15", sub: "2 this month", icon: <CheckCircle2 size={18} />, tone: "green", up: true },
  { label: "Average Score", value: "78%", sub: "12% this month", icon: <Trophy size={18} />, tone: "orange", up: true },
  { label: "Highest Score", value: "100%", sub: "Your best performance", icon: <Star size={18} />, tone: "purple" },
];

const chartPoints: { label: string; value: number }[] = [
  { label: "Apr 25", value: 65 },
  { label: "Apr 27", value: 72 },
  { label: "Apr 29", value: 68 },
  { label: "May 1", value: 78 },
  { label: "May 3", value: 76 },
  { label: "May 5", value: 80 },
  { label: "May 8", value: 70 },
  { label: "May 10", value: 85 },
  { label: "May 12", value: 78 },
  { label: "May 14", value: 82 },
  { label: "May 16", value: 76 },
  { label: "May 18", value: 88 },
  { label: "May 20", value: 92 },
  { label: "May 21", value: 84 },
  { label: "May 23", value: 90 },
];

const chartTicks = [0, 4, 7, 10, 14];

const subjectPerf: { name: string; value: number; icon: ReactNode; tone: string }[] = [
  { name: "Computer Science", value: 82, icon: <FileText size={14} />, tone: "purple" },
  { name: "Programming", value: 76, icon: <Code2 size={14} />, tone: "blue" },
  { name: "Database", value: 68, icon: <Database size={14} />, tone: "red" },
  { name: "Web Development", value: 70, icon: <Globe size={14} />, tone: "teal" },
  { name: "AI & Data Science", value: 55, icon: <Brain size={14} />, tone: "violet" },
];

const activity: { title: string; sub: string; icon: ReactNode; tone: string }[] = [
  { title: "You completed Data Structures Quiz", sub: "Score: 90% • 12m ago", icon: <FileCheck2 size={15} />, tone: "purple" },
  { title: "You uploaded a new PDF", sub: "DSA Notes.pdf • 1h ago", icon: <Upload size={15} />, tone: "purple" },
  { title: "You completed Python Basics Quiz", sub: "Score: 70% • 1 day ago", icon: <Trophy size={15} />, tone: "orange" },
  { title: "You started Web Development Quiz", sub: "In progress • 2 days ago", icon: <Play size={15} />, tone: "purple" },
];

const PAGE_SIZE = 10;

const scoreColor = (s: number) => (s >= 75 ? "#16a864" : s >= 60 ? "#f59e0b" : "#ef4458");

/* ---------------- Score ring ---------------- */

function ScoreRing({ score }: { score: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <span className="qh-score">
      <svg viewBox="0 0 28 28">
        <circle cx="14" cy="14" r={r} fill="none" stroke="#eef0f6" strokeWidth="3" />
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          transform="rotate(-90 14 14)"
        />
      </svg>
      <b>{score}%</b>
    </span>
  );
}

/* ---------------- Overview chart ---------------- */

function OverviewChart() {
  const [hover, setHover] = useState(12);

  const W = 300;
  const H = 150;
  const left = 30;
  const right = 292;
  const top = 12;
  const bottom = 118;

  const xAt = (i: number) => left + (i * (right - left)) / (chartPoints.length - 1);
  const yAt = (v: number) => bottom - (v / 100) * (bottom - top);
  const pts = chartPoints.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const cx = (a.x + b.x) / 2;
    line += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x} ${bottom} L ${pts[0].x} ${bottom} Z`;
  const hp = pts[hover];

  return (
    <svg className="qh-chart" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="qhArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c5cff" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={left} x2={right} y1={yAt(g)} y2={yAt(g)} stroke="#eef0f6" />
          <text x={left - 6} y={yAt(g) + 3} textAnchor="end" fontSize="8" fill="#9a9fb5">
            {g}%
          </text>
        </g>
      ))}

      {chartTicks.map((i) => (
        <text key={i} x={xAt(i)} y={bottom + 16} textAnchor="middle" fontSize="8" fill="#9a9fb5">
          {chartPoints[i].label}
        </text>
      ))}

      <path d={area} fill="url(#qhArea)" />
      <path d={line} fill="none" stroke="#7c5cff" strokeWidth="1.8" strokeLinecap="round" />

      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHover(i)} style={{ cursor: "pointer" }}>
          <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
          <circle
            cx={p.x}
            cy={p.y}
            r={hover === i ? 3.6 : 2.2}
            fill="#7c5cff"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </g>
      ))}

      <g>
        <rect x={hp.x - 20} y={hp.y - 34} width="40" height="24" rx="5" fill="#1f1b4b" />
        <text x={hp.x} y={hp.y - 24} textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
          {chartPoints[hover].value}%
        </text>
        <text x={hp.x} y={hp.y - 15} textAnchor="middle" fontSize="7" fill="#c9c4ff">
          {chartPoints[hover].label}
        </text>
      </g>
    </svg>
  );
}

/* ---------------- Page ---------------- */

function QuizHistory() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [status, setStatus] = useState("All Statuses");
  const [range, setRange] = useState("Last 30 Days");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quizzes.filter(
      (z) =>
        (z.name.toLowerCase().includes(q) ||
          z.subject.toLowerCase().includes(q) ||
          z.pdf.toLowerCase().includes(q)) &&
        (subject === "All Subjects" || z.subject === subject) &&
        (status === "All Statuses" || z.status === status)
    );
  }, [query, subject, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const startIdx = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="qh-layout">
      <Sidebar />

      <div className="qh-main">
        <Header />

        <div className="qh-content">
          {/* ============ CENTER ============ */}
          <div className="qh-center">
            {/* Banner */}
            <section className="qh-banner">
              <span className="qh-banner-icon">
                <History size={26} />
              </span>
              <div>
                <h1>Quiz History</h1>
                <p>Track your past quiz attempts, view detailed results and monitor your progress over time.</p>
              </div>
              <div className="qh-banner-art">
                <em>
                  Each attempt
                  <br />
                  brings you closer
                  <br />
                  to your goals!
                </em>
                <svg viewBox="0 0 130 80" xmlns="http://www.w3.org/2000/svg">
                  <rect x="30" y="14" width="90" height="56" rx="8" fill="#ffffff" stroke="#d6ccff" />
                  <rect x="40" y="26" width="40" height="6" rx="3" fill="#c9bfff" />
                  <rect x="40" y="38" width="64" height="5" rx="2.5" fill="#e4dcff" />
                  <rect x="40" y="48" width="52" height="5" rx="2.5" fill="#ede9fe" />
                  <circle cx="104" cy="56" r="9" fill="#a78bfa" />
                </svg>
              </div>
            </section>

            {/* Stats */}
            <section className="qh-stats">
              {stats.map((s) => (
                <div className="qh-stat" key={s.label}>
                  <div className="row">
                    <span className={`ic tone-${s.tone}`}>{s.icon}</span>
                    <span className="lbl">{s.label}</span>
                  </div>
                  <p className="val">{s.value}</p>
                  <p className={`sub ${s.up ? "up" : ""}`}>
                    {s.up && <ArrowUp size={11} />} {s.sub}
                  </p>
                </div>
              ))}
            </section>

            {/* Table card */}
            <section className="qh-card qh-table-card">
              <div className="qh-toolbar">
                <div className="qh-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search by quiz name, subject, or PDF..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      resetPage();
                    }}
                  />
                </div>

                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    resetPage();
                  }}
                >
                  <option>All Subjects</option>
                  {subjectList.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    resetPage();
                  }}
                >
                  <option>All Statuses</option>
                  <option>Completed</option>
                  <option>Failed</option>
                </select>

                <select value={range} onChange={(e) => setRange(e.target.value)}>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>All Time</option>
                </select>

                <div className="qh-view">
                  <button
                    type="button"
                    className={view === "grid" ? "on" : ""}
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    className={view === "list" ? "on" : ""}
                    onClick={() => setView("list")}
                    aria-label="List view"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="qh-empty">
                  <History size={32} />
                  <p>No quizzes found. Try changing your filters.</p>
                </div>
              ) : view === "list" ? (
                <div className="qh-table-wrap">
                  <table className="qh-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Quiz Name</th>
                        <th>Subject</th>
                        <th>PDF Document</th>
                        <th>Score</th>
                        <th>Time Taken</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((z, i) => (
                        <tr key={z.id}>
                          <td className="num">{startIdx + i + 1}</td>
                          <td>
                            <div className="qh-name">
                              <span className={`ic tone-${subjectTone[z.subject]}`}>
                                {subjectIcon[z.subject]}
                              </span>
                              <div>
                                <strong>{z.name}</strong>
                                <small>{z.questions} Questions • MCQs</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`qh-chip tone-${subjectTone[z.subject]}`}>{z.subject}</span>
                          </td>
                          <td>
                            <div className="qh-pdf">
                              <FileText size={12} />
                              <div>
                                <span>{z.pdf}</span>
                                <small>({z.pages} pages)</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <ScoreRing score={z.score} />
                          </td>
                          <td className="muted">{z.time}</td>
                          <td className="muted">
                            {z.date}
                            <small>{z.clock}</small>
                          </td>
                          <td>
                            <span className={`qh-status ${z.status.toLowerCase()}`}>
                              <i />
                              {z.status}
                            </span>
                          </td>
                          <td>
                            <div className="qh-actions">
                              <button type="button" className="qh-view-btn">
                                View
                              </button>
                              <button type="button" className="qh-more" aria-label="More">
                                <MoreVertical size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="qh-grid">
                  {rows.map((z) => (
                    <article className="qh-gcard" key={z.id}>
                      <div className="top">
                        <span className={`ic tone-${subjectTone[z.subject]}`}>
                          {subjectIcon[z.subject]}
                        </span>
                        <span className={`qh-status ${z.status.toLowerCase()}`}>
                          <i />
                          {z.status}
                        </span>
                      </div>
                      <h4>{z.name}</h4>
                      <span className={`qh-chip tone-${subjectTone[z.subject]}`}>{z.subject}</span>
                      <div className="mid">
                        <ScoreRing score={z.score} />
                        <div className="meta">
                          <span>
                            <Clock size={11} /> {z.time}
                          </span>
                          <span>
                            <Calendar size={11} /> {z.date}
                          </span>
                        </div>
                      </div>
                      <button type="button" className="qh-view-btn full">
                        View
                      </button>
                    </article>
                  ))}
                </div>
              )}

              <div className="qh-foot">
                <span>
                  Showing {filtered.length === 0 ? 0 : startIdx + 1} to{" "}
                  {Math.min(startIdx + PAGE_SIZE, filtered.length)} of {filtered.length} quizzes
                </span>
                <div className="qh-pager">
                  <button
                    type="button"
                    disabled={current === 1}
                    onClick={() => setPage(current - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={n === current ? "on" : ""}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={current === totalPages}
                    onClick={() => setPage(current + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="qh-right">
            <section className="qh-card">
              <div className="qh-card-head">
                <h3>Performance Overview</h3>
                <select defaultValue="Last 30 Days">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <OverviewChart />
            </section>

            <section className="qh-card">
              <div className="qh-card-head">
                <h3>Subject-wise Performance</h3>
                <a className="qh-link" href="#all">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <ul className="qh-subjects">
                {subjectPerf.map((s) => (
                  <li key={s.name}>
                    <span className={`ic tone-${s.tone}`}>{s.icon}</span>
                    <div className="mid">
                      <p>{s.name}</p>
                      <span className="bar">
                        <span style={{ width: `${s.value}%` }} />
                      </span>
                    </div>
                    <b>{s.value}%</b>
                  </li>
                ))}
              </ul>
            </section>

            <section className="qh-card">
              <div className="qh-card-head">
                <h3>Recent Activity</h3>
                <a className="qh-link" href="#all">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <ul className="qh-activity">
                {activity.map((a) => (
                  <li key={a.title}>
                    <span className={`ic tone-${a.tone}`}>{a.icon}</span>
                    <div>
                      <p>{a.title}</p>
                      <small>{a.sub}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="qh-keep">
              <span className="target">
                <Target size={22} />
              </span>
              <div>
                <h4>Keep going!</h4>
                <p>
                  Your hard work is paying off.
                  <br />
                  You're making great progress!
                </p>
              </div>
              <svg viewBox="0 0 110 70" xmlns="http://www.w3.org/2000/svg">
                <polygon points="10,70 50,20 72,44 86,30 108,70" fill="#c4b5fd" />
                <polygon points="38,70 68,34 96,70" fill="#8b5cf6" />
                <line x1="50" y1="20" x2="50" y2="6" stroke="#6d4aff" strokeWidth="2" />
                <polygon points="50,6 64,11 50,16" fill="#6d4aff" />
              </svg>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default QuizHistory;