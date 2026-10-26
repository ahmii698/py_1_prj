import { useMemo, useState } from "react";
import {
  GraduationCap,
  Download,
  Calendar,
  ChevronDown,
  Search,
  Users,
  CheckCircle2,
  Ban,
  Clock,
  BarChart3,
  ShieldCheck,
  Eye,
  Send,
  Play,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Plus,
  Brain,
  ArrowRight,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./progress.css";

type QuizStatus = "Completed" | "Not Attempted" | "In Progress";
type Result = "Pass" | "Fail" | "Pending" | "Ongoing";

interface StudentRow {
  id: number;
  name: string;
  studentId: string;
  subject: string;
  status: QuizStatus;
  score: number | null;
  timeTaken: string | null;
  attemptDate: string | null;
  result: Result;
}

const ALL_STUDENTS: StudentRow[] = [
  { id: 1, name: "Ahmed Khan", studentId: "BSCS-0032", subject: "Data Structures", status: "Completed", score: 85, timeTaken: "28m 45s", attemptDate: "May 20, 2025", result: "Pass" },
  { id: 2, name: "Ali Raza", studentId: "BSCS-0045", subject: "Data Structures", status: "Not Attempted", score: null, timeTaken: null, attemptDate: null, result: "Pending" },
  { id: 3, name: "Sara Ahmed", studentId: "BSCS-0061", subject: "Data Structures", status: "Completed", score: 92, timeTaken: "22m 10s", attemptDate: "May 19, 2025", result: "Pass" },
  { id: 4, name: "Hamza Ali", studentId: "BSCS-0078", subject: "Data Structures", status: "In Progress", score: null, timeTaken: "12m 34s", attemptDate: "May 21, 2025", result: "Ongoing" },
  { id: 5, name: "Ayesha Noor", studentId: "BSCS-0091", subject: "Data Structures", status: "Completed", score: 42, timeTaken: "18m 12s", attemptDate: "May 18, 2025", result: "Fail" },
  { id: 6, name: "Usman Khalid", studentId: "BSCS-0105", subject: "Data Structures", status: "Completed", score: 78, timeTaken: "31m 20s", attemptDate: "May 17, 2025", result: "Pass" },
  { id: 7, name: "Fatima Zahra", studentId: "BSCS-0112", subject: "Data Structures", status: "Completed", score: 68, timeTaken: "25m 03s", attemptDate: "May 16, 2025", result: "Pass" },
  { id: 8, name: "Talha Qureshi", studentId: "BSCS-0126", subject: "Data Structures", status: "Not Attempted", score: null, timeTaken: null, attemptDate: null, result: "Pending" },
  { id: 9, name: "Zainab Malik", studentId: "BSCS-0140", subject: "Data Structures", status: "Completed", score: 88, timeTaken: "27m 41s", attemptDate: "May 15, 2025", result: "Pass" },
  { id: 10, name: "Daniyal Shah", studentId: "BSCS-0157", subject: "Data Structures", status: "Completed", score: 56, timeTaken: "33m 12s", attemptDate: "May 14, 2025", result: "Pass" },
];

const SUBJECTS = [
  { name: "Data Structures", value: 76, color: "#7c5cfc" },
  { name: "Algorithms", value: 68, color: "#3b82f6" },
  { name: "Database Systems", value: 82, color: "#10b981" },
  { name: "Web Development", value: 71, color: "#f59e0b" },
];

const TOP_PERFORMERS = [
  { name: "Sara Ahmed", score: 92, trophy: "gold" },
  { name: "Ahmed Khan", score: 85, trophy: "silver" },
  { name: "Usman Khalid", score: 78, trophy: "bronze" },
];

const AVATAR_COLORS = ["#7c5cfc", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6", "#8b5cf6"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Avatar = ({ name, id }: { name: string; id: number }) => (
  <span className="pg-avatar" style={{ background: AVATAR_COLORS[id % AVATAR_COLORS.length] }}>
    {getInitials(name)}
  </span>
);

const statusClass = (s: QuizStatus) =>
  s === "Completed" ? "pg-badge pg-badge-green" : s === "Not Attempted" ? "pg-badge pg-badge-red" : "pg-badge pg-badge-purple";

const resultClass = (r: Result) =>
  r === "Pass" ? "pg-badge pg-badge-green" : r === "Fail" ? "pg-badge pg-badge-red" : r === "Ongoing" ? "pg-badge pg-badge-orange" : "pg-badge pg-badge-gray";

/* Donut chart */
const Donut = ({ pass, fail, incomplete, average }: { pass: number; fail: number; incomplete: number; average: number }) => {
  const total = pass + fail + incomplete || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  const segs = [
    { v: pass, color: "#10b981" },
    { v: fail, color: "#ef4444" },
    { v: incomplete, color: "#f59e0b" },
  ];
  let offset = 0;
  return (
    <div className="pg-donut">
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0f8" strokeWidth="16" />
        {segs.map((s, i) => {
          const len = (s.v / total) * c;
          const el = (
            <circle
              key={i}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="pg-donut-center">
        <strong>{average}%</strong>
        <span>Class Average</span>
      </div>
    </div>
  );
};

export default function Progress() {
  const [search, setSearch] = useState("");
  const [classVal, setClassVal] = useState("BSCS - Semester 3");
  const [subject, setSubject] = useState("Data Structures");
  const [quiz, setQuiz] = useState("Arrays Quiz 01");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_STUDENTS.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q);
      const matchStatus = status === "All Statuses" || s.status === status;
      return matchSearch && matchStatus;
    });
  }, [search, status]);

  return (
    <div className="pg-shell">
      <Sidebar />

      <div className="pg-main">
        <Header />

        <div className="pg-page">
          {/* Page header */}
          <div className="pg-head">
            <div className="pg-head-left">
              <div className="pg-head-icon">
                <GraduationCap size={28} />
              </div>
              <div>
                <h1>Student Progress &amp; Quiz Tracking</h1>
                <p>
                  Track your students' quiz attempts, results and overall performance. Get insights, identify weak areas and help your
                  students improve.
                </p>
              </div>
            </div>
            <div className="pg-head-right">
              <button className="pg-btn-primary">
                <Download size={16} /> Export Report
              </button>
              <button className="pg-date-btn">
                <Calendar size={16} /> May 1, 2025 – May 31, 2025 <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="pg-card pg-filters">
            <div className="pg-field">
              <label>Class</label>
              <div className="pg-select">
                <select value={classVal} onChange={(e) => setClassVal(e.target.value)}>
                  <option>BSCS - Semester 3</option>
                  <option>BSCS - Semester 4</option>
                  <option>BSSE - Semester 2</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="pg-field">
              <label>Subject</label>
              <div className="pg-select">
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option>Data Structures</option>
                  <option>Algorithms</option>
                  <option>Database Systems</option>
                  <option>Web Development</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="pg-field">
              <label>Quiz</label>
              <div className="pg-select">
                <select value={quiz} onChange={(e) => setQuiz(e.target.value)}>
                  <option>Arrays Quiz 01</option>
                  <option>Linked List Quiz</option>
                  <option>Trees Quiz</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="pg-field">
              <label>Status</label>
              <div className="pg-select">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option>All Statuses</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Not Attempted</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="pg-field">
              <label>Date Range</label>
              <div className="pg-select pg-select-date">
                <Calendar size={16} />
                <span>May 1, 2025 – May 31, 2025</span>
              </div>
            </div>
            <div className="pg-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Stat cards */}
          <div className="pg-stats">
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon purple"><Users size={22} /></span>
              <div>
                <p>Total Students</p>
                <h3>40</h3>
              </div>
            </div>
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon green"><CheckCircle2 size={22} /></span>
              <div>
                <p>Quiz Completed</p>
                <h3>32</h3>
                <small className="up">↓ 80%</small>
              </div>
            </div>
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon red"><Ban size={22} /></span>
              <div>
                <p>Not Attempted</p>
                <h3>6</h3>
                <small className="down">↓ 15%</small>
              </div>
            </div>
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon purple"><Clock size={22} /></span>
              <div>
                <p>In Progress</p>
                <h3>2</h3>
                <small className="muted">↓ 5%</small>
              </div>
            </div>
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon indigo"><BarChart3 size={22} /></span>
              <div>
                <p>Class Average</p>
                <h3>76%</h3>
              </div>
            </div>
            <div className="pg-card pg-stat">
              <span className="pg-stat-icon green"><ShieldCheck size={22} /></span>
              <div>
                <p>Pass Rate</p>
                <h3>85%</h3>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="pg-grid">
            {/* Left: table + AI insight */}
            <div className="pg-left">
              <div className="pg-card pg-table-card">
                <h2 className="pg-card-title">Students &amp; Quiz Results</h2>
                <div className="pg-table-wrap">
                  <table className="pg-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Subject</th>
                        <th>Quiz Status</th>
                        <th>Score</th>
                        <th>Time Taken</th>
                        <th>Attempt Date</th>
                        <th>Result</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={10} className="pg-empty">No students found</td>
                        </tr>
                      )}
                      {filtered.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}.</td>
                          <td>
                            <div className="pg-student">
                              <Avatar name={s.name} id={s.id} />
                              <span>{s.name}</span>
                            </div>
                          </td>
                          <td className="pg-sid">{s.studentId}</td>
                          <td>{s.subject}</td>
                          <td><span className={statusClass(s.status)}>● {s.status}</span></td>
                          <td className="pg-score">{s.score !== null ? `${s.score}%` : "—"}</td>
                          <td>{s.timeTaken ?? "—"}</td>
                          <td>{s.attemptDate ?? "—"}</td>
                          <td><span className={resultClass(s.result)}>● {s.result}</span></td>
                          <td>
                            <div className="pg-actions">
                              {s.status === "Completed" && (
                                <button className="pg-act-btn"><Eye size={14} /> View</button>
                              )}
                              {s.status === "Not Attempted" && (
                                <button className="pg-act-btn"><Send size={14} /> Remind</button>
                              )}
                              {s.status === "In Progress" && (
                                <button className="pg-act-btn"><Play size={14} /> Continue</button>
                              )}
                              <button className="pg-dots"><MoreVertical size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pg-table-foot">
                  <span>Showing 1 to {filtered.length} of 40 students</span>
                  <div className="pg-pager">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
                    {[1, 2, 4].map((n) => (
                      <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(4, p + 1))}><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="pg-insight">
                <span className="pg-insight-icon"><Brain size={26} /></span>
                <div className="pg-insight-text">
                  <strong>AI Insights</strong>
                  <p>6 students are struggling with recursion. Consider creating a revision quiz or additional practice material.</p>
                </div>
                <button className="pg-btn-primary pg-btn-sm">
                  View Recommendations <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right column */}
            <aside className="pg-right">
              <div className="pg-card pg-side-card">
                <div className="pg-side-head">
                  <h3>Performance Overview</h3>
                  <button className="pg-mini-select">Subject Wise <ChevronDown size={12} /></button>
                </div>
                <div className="pg-overview">
                  <Donut pass={34} fail={4} incomplete={2} average={76} />
                  <ul className="pg-legend">
                    <li><i style={{ background: "#10b981" }} /> Pass (85%) <b>34</b></li>
                    <li><i style={{ background: "#ef4444" }} /> Fail (10%) <b>4</b></li>
                    <li><i style={{ background: "#f59e0b" }} /> Incomplete (5%) <b>2</b></li>
                  </ul>
                </div>
              </div>

              <div className="pg-card pg-side-card">
                <div className="pg-side-head">
                  <h3>Subject Performance</h3>
                  <a href="#" className="pg-link" onClick={(e) => e.preventDefault()}>View Details →</a>
                </div>
                <div className="pg-subjects">
                  {SUBJECTS.map((s) => (
                    <div key={s.name} className="pg-subject">
                      <div className="pg-subject-row">
                        <span>{s.name}</span>
                        <b>{s.value}%</b>
                      </div>
                      <div className="pg-bar">
                        <div style={{ width: `${s.value}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pg-card pg-side-card">
                <div className="pg-side-head">
                  <h3>Top Performers</h3>
                  <a href="#" className="pg-link" onClick={(e) => e.preventDefault()}>View All →</a>
                </div>
                <div className="pg-top">
                  {TOP_PERFORMERS.map((p, i) => (
                    <div key={p.name} className="pg-top-row">
                      <div className="pg-student">
                        <Avatar name={p.name} id={i + 3} />
                        <span>{p.name}</span>
                      </div>
                      <div className="pg-top-score">
                        <b>{p.score}%</b>
                        <Trophy size={16} className={`trophy ${p.trophy}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pg-card pg-side-card">
                <div className="pg-side-head">
                  <h3>Quick Actions</h3>
                </div>
                <div className="pg-quick">
                  <button><Send size={15} /> Send Reminder</button>
                  <button><BarChart3 size={15} /> View Analytics</button>
                  <button><Plus size={15} /> Create Quiz</button>
                  <button><Download size={15} /> Export Report</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}