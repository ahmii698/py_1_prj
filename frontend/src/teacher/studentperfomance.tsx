import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  Users,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
  Clock,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  ArrowLeftRight,
  ArrowRight,
  Lightbulb,
  Network,
  Code2,
  Workflow,
  Database,
  Globe,
  Filter,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./studentperfomance.css";

/* ---------------- Types & data ---------------- */

interface Student {
  name: string;
  email: string;
  cls: string;
  avg: number;
  quiz: number;
  done: number;
}

type Status = "Excellent" | "Good" | "Average" | "Needs Help";

const students: Student[] = [
  { name: "Sara Ahmed", email: "sara.ahmed@gmail.com", cls: "BSCS - Sem 3", avg: 98, quiz: 92, done: 12 },
  { name: "Usman Khalid", email: "usman.khalid@gmail.com", cls: "BSCS - Sem 3", avg: 96, quiz: 88, done: 11 },
  { name: "Fatima Zahra", email: "fatima.zahra@gmail.com", cls: "BSCS - Sem 3", avg: 94, quiz: 85, done: 10 },
  { name: "Ahmed Khan", email: "ahmed.khan@gmail.com", cls: "BSCS - Sem 3", avg: 92, quiz: 81, done: 10 },
  { name: "Ayesha Noor", email: "ayesha.noor@gmail.com", cls: "BSCS - Sem 3", avg: 90, quiz: 78, done: 9 },
  { name: "Taha Qureshi", email: "taha.qureshi@gmail.com", cls: "BSCS - Sem 3", avg: 88, quiz: 76, done: 9 },
  { name: "Zainab Malik", email: "zainab.malik@gmail.com", cls: "BSCS - Sem 3", avg: 84, quiz: 72, done: 8 },
  { name: "Daniyal Shah", email: "daniyal.shah@gmail.com", cls: "BSCS - Sem 3", avg: 80, quiz: 68, done: 7 },
  { name: "Hamza Ali", email: "hamza.ali@gmail.com", cls: "BSCS - Sem 3", avg: 78, quiz: 70, done: 9 },
  { name: "Maryam Siddiqui", email: "maryam.siddiqui@gmail.com", cls: "BSCS - Sem 3", avg: 76, quiz: 74, done: 9 },
  { name: "Bilal Raza", email: "bilal.raza@gmail.com", cls: "BSCS - Sem 5", avg: 74, quiz: 66, done: 8 },
  { name: "Hira Tariq", email: "hira.tariq@gmail.com", cls: "BSCS - Sem 5", avg: 72, quiz: 69, done: 8 },
  { name: "Omar Farooq", email: "omar.farooq@gmail.com", cls: "BSSE - Sem 3", avg: 71, quiz: 64, done: 7 },
  { name: "Sana Javed", email: "sana.javed@gmail.com", cls: "BSSE - Sem 3", avg: 69, quiz: 62, done: 7 },
  { name: "Zain Abbas", email: "zain.abbas@gmail.com", cls: "BSSE - Sem 3", avg: 67, quiz: 60, done: 6 },
  { name: "Iqra Noman", email: "iqra.noman@gmail.com", cls: "BSSE - Sem 3", avg: 91, quiz: 87, done: 11 },
  { name: "Fahad Mirza", email: "fahad.mirza@gmail.com", cls: "BSCS - Sem 5", avg: 89, quiz: 83, done: 10 },
  { name: "Areeba Khan", email: "areeba.khan@gmail.com", cls: "BSCS - Sem 5", avg: 87, quiz: 80, done: 10 },
  { name: "Danish Qadir", email: "danish.qadir@gmail.com", cls: "BSSE - Sem 3", avg: 85, quiz: 79, done: 10 },
  { name: "Nimra Aslam", email: "nimra.aslam@gmail.com", cls: "BSSE - Sem 3", avg: 83, quiz: 76, done: 9 },
  { name: "Kamran Yousuf", email: "kamran.yousuf@gmail.com", cls: "BSCS - Sem 5", avg: 81, quiz: 72, done: 9 },
  { name: "Laiba Hussain", email: "laiba.hussain@gmail.com", cls: "BSCS - Sem 5", avg: 79, quiz: 71, done: 8 },
  { name: "Rehan Saeed", email: "rehan.saeed@gmail.com", cls: "BSSE - Sem 3", avg: 77, quiz: 68, done: 8 },
  { name: "Mahnoor Zia", email: "mahnoor.zia@gmail.com", cls: "BSSE - Sem 3", avg: 75, quiz: 67, done: 8 },
];

const TOTAL_ASSIGNMENTS = 12;
const PAGE_SIZE = 8;

const statusFor = (avg: number): Status =>
  avg >= 95 ? "Excellent" : avg >= 90 ? "Good" : avg >= 82 ? "Average" : "Needs Help";

const statusClass: Record<Status, string> = {
  Excellent: "excellent",
  Good: "good",
  Average: "average",
  "Needs Help": "help",
};

const avatarColors = ["#7c5cfc", "#16b58a", "#ff9f43", "#3b82f6", "#f43f9d", "#ef4458", "#0d9488", "#9333ea"];

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const classOptions = Array.from(new Set(students.map((s) => s.cls)));

const stats: { label: string; value: string; delta: string; icon: ReactNode; tone: string }[] = [
  { label: "Total Students", value: "124", delta: "12% from last month", icon: <Users size={20} />, tone: "purple" },
  { label: "Active Students", value: "98", delta: "8% from last month", icon: <CheckCircle2 size={20} />, tone: "green" },
  { label: "Avg. Quiz Score", value: "76%", delta: "6% from last month", icon: <TrendingUp size={20} />, tone: "red" },
  { label: "Assignments Submitted", value: "86", delta: "15% from last month", icon: <ClipboardList size={20} />, tone: "violet" },
  { label: "On Time Submission", value: "92%", delta: "7% from last month", icon: <Clock size={20} />, tone: "orange" },
];

const subjects: { name: string; value: number; icon: ReactNode; tone: string }[] = [
  { name: "Data Structures", value: 82, icon: <Network size={16} />, tone: "purple" },
  { name: "C Programming", value: 76, icon: <Code2 size={16} />, tone: "green" },
  { name: "Algorithms", value: 68, icon: <Workflow size={16} />, tone: "pink" },
  { name: "Database Systems", value: 74, icon: <Database size={16} />, tone: "blue" },
  { name: "Web Development", value: 71, icon: <Globe size={16} />, tone: "teal" },
];

const quickActions: { title: string; sub: string; icon: ReactNode }[] = [
  { title: "Export Report", sub: "Download performance report (PDF/Excel)", icon: <Download size={17} /> },
  { title: "View Quiz Analytics", sub: "Detailed quiz performance and insights", icon: <TrendingUp size={17} /> },
  { title: "Compare Students", sub: "Compare multiple students side by side", icon: <ArrowLeftRight size={17} /> },
];

const topPerformers = students.slice(0, 5);

/* ---------------- Trend chart ---------------- */

const chartDays = [1, 3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28, 31];
const chartSeries: { name: string; color: string; data: number[] }[] = [
  { name: "Average Score", color: "#7c5cfc", data: [43, 40, 46, 47, 52, 48, 55, 57, 53, 58, 60, 64, 66] },
  { name: "Highest Score", color: "#16b58a", data: [61, 64, 70, 68, 74, 70, 75, 72, 78, 76, 82, 80, 84] },
  { name: "Lowest Score", color: "#ff9f43", data: [22, 25, 30, 28, 34, 32, 38, 36, 40, 38, 42, 41, 44] },
];
const chartTicks = [1, 5, 10, 15, 20, 25, 31];

function TrendChart() {
  const W = 560;
  const H = 210;
  const left = 34;
  const right = 548;
  const top = 10;
  const bottom = 178;

  const xAt = (day: number) => left + ((day - 1) / 30) * (right - left);
  const yAt = (v: number) => bottom - (v / 100) * (bottom - top);

  const pathFor = (data: number[]) => {
    const pts = data.map((v, i) => ({ x: xAt(chartDays[i]), y: yAt(v) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const cx = (a.x + b.x) / 2;
      d += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
    }
    return { d, pts };
  };

  return (
    <svg className="sp-trend" viewBox={`0 0 ${W} ${H}`}>
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={left} x2={right} y1={yAt(g)} y2={yAt(g)} stroke="#eef0f6" />
          <text x={left - 8} y={yAt(g) + 3} textAnchor="end" fontSize="9" fill="#9a9fb5">
            {g}
          </text>
        </g>
      ))}

      {chartTicks.map((d) => (
        <text key={d} x={xAt(d)} y={bottom + 18} textAnchor="middle" fontSize="9" fill="#9a9fb5">
          May {d}
        </text>
      ))}

      {chartSeries.map((s) => {
        const { d, pts } = pathFor(s.data);
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.6" fill={s.color} stroke="#fff" strokeWidth="1" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Page ---------------- */

type Tab = "all" | "top" | "attention";

function StudentPerformance() {
  const [range, setRange] = useState("May 1, 2025 - May 31, 2025");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
      if (classFilter !== "All Classes" && s.cls !== classFilter) return false;
      if (tab === "top" && s.avg < 90) return false;
      if (tab === "attention" && s.avg >= 85) return false;
      return true;
    });
  }, [query, classFilter, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const startIdx = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="sp-layout">
      <Sidebar />

      <div className="sp-main">
        <Header />

        <div className="sp-content">
          {/* ============ CENTER ============ */}
          <div className="sp-center">
            {/* Title row */}
            <div className="sp-title-row">
              <div className="sp-title">
                <span className="sp-title-icon">
                  <BarChart3 size={26} />
                </span>
                <div>
                  <h1>Student Performance</h1>
                  <p>
                    Track and analyze your students' progress, compare performance, and identify areas for
                    improvement.
                  </p>
                </div>
              </div>

              <label className="sp-range">
                <CalendarDays size={15} />
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                  <option>May 1, 2025 - May 31, 2025</option>
                  <option>Apr 1, 2025 - Apr 30, 2025</option>
                  <option>Last 90 Days</option>
                </select>
              </label>
            </div>

            {/* Stats */}
            <section className="sp-stats">
              {stats.map((s) => (
                <div className="sp-stat" key={s.label}>
                  <span className={`ic tone-${s.tone}`}>{s.icon}</span>
                  <div>
                    <p className="lbl">{s.label}</p>
                    <p className="val">{s.value}</p>
                    <p className="delta">↑ {s.delta}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Trend + subjects */}
            <div className="sp-row">
              <section className="sp-card">
                <div className="sp-card-head">
                  <h3>Class Performance Trend</h3>
                  <ul className="sp-legend">
                    {chartSeries.map((s) => (
                      <li key={s.name}>
                        <i style={{ background: s.color }} />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <TrendChart />
              </section>

              <section className="sp-card">
                <div className="sp-card-head">
                  <h3>Performance by Subject</h3>
                  <a className="sp-link" href="#details">
                    View Details <ArrowRight size={11} />
                  </a>
                </div>
                <ul className="sp-subjects">
                  {subjects.map((s) => (
                    <li key={s.name}>
                      <span className={`ic tone-${s.tone}`}>{s.icon}</span>
                      <div className="mid">
                        <p>
                          {s.name}
                          <b>{s.value}%</b>
                        </p>
                        <span className="bar">
                          <span style={{ width: `${s.value}%` }} />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Table */}
            <section className="sp-card">
              <div className="sp-card-head">
                <h3>Student Performance Overview</h3>
                <div className="sp-tabs">
                  {(
                    [
                      ["all", "All Students"],
                      ["top", "Top Performers"],
                      ["attention", "Needs Attention"],
                    ] as [Tab, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={tab === key ? "on" : ""}
                      onClick={() => {
                        setTab(key);
                        resetPage();
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="sp-empty">
                  <Users size={30} />
                  <p>No students found. Try changing your filters.</p>
                </div>
              ) : (
                <div className="sp-table-wrap">
                  <table className="sp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Avg. Score</th>
                        <th>Quiz Avg.</th>
                        <th>Assignments</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((s, i) => {
                        const status = statusFor(s.avg);
                        const color = avatarColors[(startIdx + i) % avatarColors.length];
                        return (
                          <tr key={s.email}>
                            <td className="num">{startIdx + i + 1}</td>
                            <td>
                              <div className="sp-student">
                                <span className="avatar" style={{ background: color }}>
                                  {initialsOf(s.name)}
                                </span>
                                <div>
                                  <strong>{s.name}</strong>
                                  <small>{s.email}</small>
                                </div>
                              </div>
                            </td>
                            <td className="cls">{s.cls}</td>
                            <td className="bold">{s.avg}%</td>
                            <td className="bold">{s.quiz}%</td>
                            <td className="muted">
                              {s.done}/{TOTAL_ASSIGNMENTS}
                            </td>
                            <td>
                              <span className="sp-progress">
                                <span style={{ width: `${s.avg}%` }} />
                              </span>
                            </td>
                            <td>
                              <span className={`sp-status ${statusClass[status]}`}>{status}</span>
                            </td>
                            <td>
                              <div className="sp-actions">
                                <button type="button" className="sp-view">
                                  View <ChevronDown size={12} />
                                </button>
                                <button type="button" className="sp-more" aria-label="More">
                                  <MoreVertical size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="sp-foot">
                <span>
                  Showing {filtered.length === 0 ? 0 : startIdx + 1} to{" "}
                  {Math.min(startIdx + PAGE_SIZE, filtered.length)} of {filtered.length} students
                </span>
                <div className="sp-pager">
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
          <aside className="sp-right">
            <section className="sp-card">
              <h3 className="sp-plain-title">Filter &amp; Search</h3>

              <div className="sp-search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    resetPage();
                  }}
                />
              </div>

              <select
                className="sp-select"
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  resetPage();
                }}
              >
                <option>All Classes</option>
                {classOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                className="sp-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option>All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>

              <div className="sp-date-box">
                <CalendarDays size={14} />
                {range}
              </div>
            </section>

            <section className="sp-card">
              <h3 className="sp-plain-title with-icon">
                <Filter size={14} /> Quick Actions
              </h3>
              <ul className="sp-quick">
                {quickActions.map((q) => (
                  <li key={q.title}>
                    <button type="button">
                      <span className="ic">{q.icon}</span>
                      <span className="tx">
                        <strong>{q.title}</strong>
                        <small>{q.sub}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="sp-card">
              <div className="sp-card-head">
                <h3>Top Performers</h3>
                <a className="sp-link" href="#all">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <ul className="sp-top">
                {topPerformers.map((s, i) => (
                  <li key={s.email}>
                    <span className="rank">{i + 1}</span>
                    <span className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                      {initialsOf(s.name)}
                    </span>
                    <div className="info">
                      <strong>{s.name}</strong>
                      <small>BSCS - Semester 3</small>
                    </div>
                    <b>{s.avg}%</b>
                  </li>
                ))}
              </ul>
            </section>

            <section className="sp-card">
              <h3 className="sp-plain-title">Performance Insights</h3>
              <div className="sp-insight">
                <span className="ic">
                  <Lightbulb size={18} />
                </span>
                <p>Overall class performance is 6% higher than last month. Keep up the good work!</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default StudentPerformance;