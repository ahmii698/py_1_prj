import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ClipboardCheck,
  Eye,
  MoreVertical,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Filter,
  BookOpen,
  CalendarDays,
  Trophy,
  Send,
  Download,
  BarChart3,
  Plus,
  GraduationCap,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./student.css";

type StudentStatus = "Active" | "Inactive";
type TabKey = "all" | "active" | "inactive";

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  classes: string[];
  completed: number;
  total: number;
  avgScore: number;
  lastActivity: string; // ISO
  status: StudentStatus;
}

const PAGE_SIZE = 12;
const AVATAR_COLORS = ["#6d4aff", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#ef4444"];

const CLASS_OPTIONS = [
  "BSCS - S3",
  "Web Dev",
  "AI & ML",
  "Data Structures",
  "Algorithms",
  "Database Systems",
  "Computer Networks",
  "Web Development",
];

const SUBJECT_OPTIONS = [
  "Computer Science",
  "Programming",
  "Database",
  "Web Development",
  "AI & Data Science",
];

const CLASS_TONE: Record<string, string> = {
  "BSCS - S3": "purple",
  "Web Dev": "violet",
  "AI & ML": "purple",
  "Data Structures": "lavender",
  Algorithms: "lavender",
  "Web Development": "lavender",
  "Database Systems": "blue",
  "Computer Networks": "blue",
};

// TODO: replace with API data (GET /api/teacher/students)
const BASE: Omit<Student, "id">[] = [
  { name: "Ahmed Khan", email: "ahmed.khan@gmail.com", studentId: "BSCS-0032", classes: ["BSCS - S3"], completed: 8, total: 10, avgScore: 85, lastActivity: "2025-05-20T10:45", status: "Active" },
  { name: "Ali Raza", email: "ali.raza@gmail.com", studentId: "BSCS-0045", classes: ["BSCS - S3", "Web Dev"], completed: 5, total: 10, avgScore: 68, lastActivity: "2025-05-19T14:30", status: "Active" },
  { name: "Sara Ahmed", email: "sara.ahmed@gmail.com", studentId: "BSCS-0061", classes: ["BSCS - S3"], completed: 10, total: 10, avgScore: 92, lastActivity: "2025-05-19T11:20", status: "Active" },
  { name: "Hamza Ali", email: "hamza.ali@gmail.com", studentId: "BSCS-0078", classes: ["AI & ML"], completed: 4, total: 10, avgScore: 56, lastActivity: "2025-05-18T16:15", status: "Active" },
  { name: "Ayesha Noor", email: "ayesha.noor@gmail.com", studentId: "BSCS-0091", classes: ["Data Structures"], completed: 7, total: 10, avgScore: 78, lastActivity: "2025-05-18T12:05", status: "Active" },
  { name: "Usman Khalid", email: "usman.khalid@gmail.com", studentId: "BSCS-0105", classes: ["Data Structures"], completed: 6, total: 10, avgScore: 64, lastActivity: "2025-05-17T15:40", status: "Active" },
  { name: "Fatima Zahra", email: "fatima.zahra@gmail.com", studentId: "BSCS-0112", classes: ["Algorithms"], completed: 9, total: 10, avgScore: 88, lastActivity: "2025-05-16T13:25", status: "Active" },
  { name: "Talha Qureshi", email: "talha.qureshi@gmail.com", studentId: "BSCS-0126", classes: ["Data Structures"], completed: 2, total: 10, avgScore: 34, lastActivity: "2025-05-15T11:10", status: "Inactive" },
  { name: "Zainab Malik", email: "zainab.malik@gmail.com", studentId: "BSCS-0140", classes: ["Algorithms"], completed: 8, total: 10, avgScore: 82, lastActivity: "2025-05-14T14:50", status: "Active" },
  { name: "Daniyal Shah", email: "daniyal.shah@gmail.com", studentId: "BSCS-0157", classes: ["Web Development"], completed: 6, total: 10, avgScore: 60, lastActivity: "2025-05-13T10:35", status: "Active" },
  { name: "Hira Fatima", email: "hira.fatima@gmail.com", studentId: "BSCS-0168", classes: ["Database Systems"], completed: 5, total: 10, avgScore: 48, lastActivity: "2025-05-12T16:20", status: "Inactive" },
  { name: "Mohsin Raza", email: "mohsin.raza@gmail.com", studentId: "BSCS-0182", classes: ["Computer Networks"], completed: 9, total: 10, avgScore: 90, lastActivity: "2025-05-11T12:15", status: "Active" },
];

const FIRST = ["Bilal", "Noor", "Saad", "Maryam", "Omar", "Iqra", "Hassan", "Areeba", "Zain", "Laiba", "Faizan", "Mehak", "Rizwan", "Sana"];
const LAST = ["Sheikh", "Butt", "Mirza", "Chaudhry", "Siddiqui", "Baig", "Javed", "Aslam"];

function buildStudents(): Student[] {
  const list: Omit<Student, "id">[] = [...BASE];
  for (let i = 0; i < 112; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 3) % LAST.length];
    const inactive = [2, 6, 11].includes(i % 14);
    const total = 10;
    const completed = inactive ? 1 + (i % 4) : 4 + (i % 7);
    const avg = inactive ? 25 + ((i * 7) % 30) : 50 + ((i * 11) % 46);
    const day = 1 + (i % 10);
    list.push({
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@gmail.com`.toLowerCase(),
      studentId: `BSCS-${String(200 + i * 3).padStart(4, "0")}`,
      classes: [CLASS_OPTIONS[i % CLASS_OPTIONS.length]],
      completed: Math.min(completed, total),
      total,
      avgScore: avg,
      lastActivity: `2025-05-${String(day).padStart(2, "0")}T${String(9 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
      status: inactive ? "Inactive" : "Active",
    });
  }
  return list.map((s, i) => ({ ...s, id: i + 1 }));
}

const ALL_STUDENTS = buildStudents();

const performanceBands = [
  { label: "Excellent (90-100)", value: 18, color: "#10b981" },
  { label: "Good (70-89)", value: 38, color: "#6dd49a" },
  { label: "Average (50-69)", value: 26, color: "#fbbf24" },
  { label: "Below Average (0-49)", value: 18, color: "#f472b6" },
];

const topStudents = [
  { name: "Sara Ahmed", score: 92, trophy: "gold" },
  { name: "Usman Khalid", score: 88, trophy: "silver" },
  { name: "Fatima Zahra", score: 88, trophy: "bronze" },
  { name: "Ahmed Khan", score: 85, trophy: "gold" },
  { name: "Mohsin Raza", score: 90, trophy: "silver" },
];

/* ---------- helpers ---------- */

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <span
      className="st-avatar"
      style={{ background: colorFor(name), width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function scoreTone(score: number) {
  if (score >= 80) return "green";
  if (score >= 60) return "orange";
  return "red";
}

function pageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function Donut() {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="st-donut">
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f0eef9" strokeWidth="16" />
        {performanceBands.map((b) => {
          const len = (b.value / 100) * c;
          const el = (
            <circle
              key={b.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={b.color}
              strokeWidth="16"
              strokeDasharray={`${len - 2} ${c - len + 2}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="st-donut-center">
        <b>76%</b>
        <span>Class Average</span>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

function Students() {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [minScore, setMinScore] = useState("0");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const counts = useMemo(() => {
    const active = ALL_STUDENTS.filter((s) => s.status === "Active").length;
    return { all: ALL_STUDENTS.length, active, inactive: ALL_STUDENTS.length - active };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_STUDENTS.filter((s) => {
      if (tab === "active" && s.status !== "Active") return false;
      if (tab === "inactive" && s.status !== "Inactive") return false;
      if (classFilter !== "all" && !s.classes.includes(classFilter)) return false;
      if (s.avgScore < Number(minScore)) return false;
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.email.toLowerCase().includes(q) &&
        !s.studentId.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [tab, search, classFilter, minScore]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const allOnPage = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const toggleAll = () => {
    if (allOnPage) setSelected(selected.filter((id) => !rows.some((r) => r.id === id)));
    else setSelected([...new Set([...selected, ...rows.map((r) => r.id)])]);
  };

  const toggleOne = (id: number) =>
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const resetPage = () => setPage(1);

  const handleView = (s: Student) => {
    // TODO: navigate(`/teacher/students/${s.id}`)
    console.log("View student:", s.id);
  };

  const statCards = [
    { label: "Total Students", value: counts.all, sub: "12% from last month", up: true, icon: <Users size={20} />, tone: "purple" },
    { label: "Active Students", value: counts.active, sub: "8% from last month", up: true, icon: <UserCheck size={20} />, tone: "green" },
    { label: "Inactive Students", value: counts.inactive, sub: "3% from last month", up: false, icon: <UserX size={20} />, tone: "red" },
    { label: "Avg. Class Performance", value: "76%", sub: "6% from last month", up: true, icon: <ClipboardCheck size={20} />, tone: "blue" },
  ];

  const quickActions = [
    { label: "Send Reminder", icon: <Send size={18} /> },
    { label: "Export Report", icon: <Download size={18} /> },
    { label: "View Analytics", icon: <BarChart3 size={18} /> },
    { label: "Add New Student", icon: <Plus size={18} /> },
  ];

  return (
    <div className="st-shell">
      <Sidebar />

      <div className="st-main">
        <Header />

        <div className="st-content">
          {/* ===== Center ===== */}
          <div className="st-center">
            {/* Banner */}
            <section className="st-banner">
              <div className="st-banner-icon">
                <Users size={26} />
              </div>
              <div className="st-banner-text">
                <h1>My Students</h1>
                <p>
                  View and manage all your enrolled students. Track their progress,
                  performance and engagement across all your classes and courses.
                </p>
              </div>
              <div className="st-banner-art" aria-hidden="true">
                <GraduationCap size={70} strokeWidth={1.2} />
              </div>
            </section>

            {/* Stats */}
            <section className="st-stats">
              {statCards.map((c) => (
                <div className="st-stat" key={c.label}>
                  <div className={`st-stat-icon ${c.tone}`}>{c.icon}</div>
                  <div className="st-stat-body">
                    <p className="st-stat-label">{c.label}</p>
                    <p className="st-stat-value">{c.value}</p>
                    <p className={`st-stat-sub ${c.up ? "up" : "down"}`}>
                      {c.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      {c.sub}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Table card */}
            <section className="st-card">
              <div className="st-toolbar">
                <div className="st-tabs">
                  {(
                    [
                      ["all", `All Students (${counts.all})`],
                      ["active", `Active (${counts.active})`],
                      ["inactive", `Inactive (${counts.inactive})`],
                    ] as [TabKey, string][]
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

                <div className="st-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search students by name, ID or email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                  />
                </div>

                <div className="st-filter-wrap">
                  <button
                    type="button"
                    className="st-filter-btn"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    <ChevronDown size={14} />
                  </button>
                  {showFilters && (
                    <div className="st-filter-pop">
                      <label>Minimum Avg. Score</label>
                      <select
                        value={minScore}
                        onChange={(e) => {
                          setMinScore(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="0">Any score</option>
                        <option value="50">50% and above</option>
                        <option value="70">70% and above</option>
                        <option value="90">90% and above</option>
                      </select>
                      <button
                        type="button"
                        className="st-filter-clear"
                        onClick={() => {
                          setMinScore("0");
                          setClassFilter("all");
                          setSubjectFilter("all");
                          setSearch("");
                          resetPage();
                          setShowFilters(false);
                        }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="st-empty">
                  <Users size={36} />
                  <p>No students found</p>
                  <span>Try changing your search or filters.</span>
                </div>
              ) : (
                <div className="st-table-wrap">
                  <table className="st-table">
                    <thead>
                      <tr>
                        <th className="st-check">
                          <input type="checkbox" checked={allOnPage} onChange={toggleAll} />
                        </th>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Classes</th>
                        <th>
                          Quiz Attempts
                          <br />
                          <span className="st-th-sub">(Completed / Total)</span>
                        </th>
                        <th>Avg. Score</th>
                        <th>Progress</th>
                        <th>Last Activity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((s) => {
                        const pct = Math.round((s.completed / s.total) * 100);
                        return (
                          <tr key={s.id} className={selected.includes(s.id) ? "sel" : ""}>
                            <td className="st-check">
                              <input
                                type="checkbox"
                                checked={selected.includes(s.id)}
                                onChange={() => toggleOne(s.id)}
                              />
                            </td>
                            <td>
                              <div className="st-person">
                                <Avatar name={s.name} />
                                <div>
                                  <p className="st-person-name">{s.name}</p>
                                  <p className="st-person-mail">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="st-id">{s.studentId}</td>
                            <td>
                              <div className="st-classes">
                                {s.classes.map((c) => (
                                  <span key={c} className={`st-chip ${CLASS_TONE[c] ?? "lavender"}`}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className="st-attempts">
                                {s.completed} / {s.total}
                              </span>
                              <span className="st-attempts-pct">{pct}%</span>
                            </td>
                            <td>
                              <span className={`st-score ${scoreTone(s.avgScore)}`}>
                                {s.avgScore}%
                              </span>
                            </td>
                            <td>
                              <div className="st-progress">
                                <span style={{ width: `${pct}%` }} />
                              </div>
                            </td>
                            <td>
                              <p className="st-date">{fmtDate(s.lastActivity)}</p>
                              <p className="st-date-sub">{fmtTime(s.lastActivity)}</p>
                            </td>
                            <td>
                              <span className={`st-status ${s.status === "Active" ? "ok" : "off"}`}>
                                {s.status}
                              </span>
                            </td>
                            <td>
                              <div className="st-actions">
                                <button type="button" className="st-view" onClick={() => handleView(s)}>
                                  <Eye size={13} /> View
                                </button>
                                <div className="st-more-wrap">
                                  <button
                                    type="button"
                                    className="st-more"
                                    aria-label="More actions"
                                    onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                                  >
                                    <MoreVertical size={15} />
                                  </button>
                                  {menuOpen === s.id && (
                                    <div className="st-menu">
                                      <button type="button" onClick={() => setMenuOpen(null)}>
                                        Send Message
                                      </button>
                                      <button type="button" onClick={() => setMenuOpen(null)}>
                                        View Performance
                                      </button>
                                      <button
                                        type="button"
                                        className="danger"
                                        onClick={() => setMenuOpen(null)}
                                      >
                                        Remove Student
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="st-pager">
                  <p>
                    Showing {start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
                    {filtered.length} students
                    {selected.length > 0 && ` • ${selected.length} selected`}
                  </p>
                  <div className="st-pages">
                    <button
                      type="button"
                      disabled={current === 1}
                      onClick={() => setPage(current - 1)}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {pageList(current, totalPages).map((n, i) =>
                      n === "..." ? (
                        <span key={`d${i}`} className="st-dots">
                          …
                        </span>
                      ) : (
                        <button
                          type="button"
                          key={n}
                          className={n === current ? "on" : ""}
                          onClick={() => setPage(n)}
                        >
                          {n}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      disabled={current === totalPages}
                      onClick={() => setPage(current + 1)}
                      aria-label="Next page"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ===== Right column ===== */}
          <aside className="st-right">
            <section className="st-side-card">
              <label className="st-side-label">
                <Filter size={13} /> Class Filter
              </label>
              <div className="st-big-select">
                <select
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    resetPage();
                  }}
                >
                  <option value="all">All Classes</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>

              <label className="st-side-label">
                <BookOpen size={13} /> Subject Filter
              </label>
              <div className="st-big-select">
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="all">All Subjects</option>
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>

              <div className="st-big-select st-date">
                <CalendarDays size={15} className="st-date-icon" />
                <select defaultValue="may">
                  <option value="may">May 1, 2025 - May 31, 2025</option>
                  <option value="apr">Apr 1, 2025 - Apr 30, 2025</option>
                  <option value="mar">Mar 1, 2025 - Mar 31, 2025</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </section>

            <section className="st-side-card">
              <h3 className="st-side-title">Student Performance Overview</h3>
              <div className="st-perf">
                <Donut />
                <ul className="st-legend">
                  {performanceBands.map((b) => (
                    <li key={b.label}>
                      <i style={{ background: b.color }} />
                      <span>{b.label}</span>
                      <b>{b.value}%</b>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="st-side-card">
              <div className="st-side-head">
                <h3 className="st-side-title">Top Performing Students</h3>
                <button type="button" className="st-link">
                  View All <ChevronRight size={11} />
                </button>
              </div>
              <ul className="st-top">
                {topStudents.map((t) => (
                  <li key={t.name}>
                    <Avatar name={t.name} size={30} />
                    <span className="st-top-name">{t.name}</span>
                    <b>{t.score}%</b>
                    <Trophy size={15} className={`st-trophy ${t.trophy}`} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="st-side-card">
              <h3 className="st-side-title">Quick Actions</h3>
              <div className="st-quick">
                {quickActions.map((a) => (
                  <button type="button" key={a.label}>
                    {a.icon}
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="st-insight">
              <div className="st-insight-icon">
                <BookOpen size={26} />
              </div>
              <p>
                Better insights.
                <br />
                Better learning outcomes.
              </p>
              <ChevronRight size={18} />
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Students;