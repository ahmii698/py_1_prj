import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  CheckCircle2,
  Pencil,
  CalendarDays,
  Users,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Copy,
  Activity,
  Clock,
  Zap,
  ArrowRight,
  Database,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./viewquiz.css";

type QuizStatus = "Published" | "Draft" | "Scheduled" | "Closed";
type StatusFilter = "all" | QuizStatus;

interface Quiz {
  id: number;
  title: string;
  note: string;
  subject: string;
  className: string;
  questions: number;
  attempts: number;
  avg: number | null;
  status: QuizStatus;
  updated: string; // YYYY-MM-DDTHH:mm (local)
  created: string; // YYYY-MM-DDTHH:mm (local)
}

const PAGE_SIZE = 5;

const SUBJECTS = ["Data Structures", "C Programming", "Algorithms", "Programming", "Database Systems"];
const CLASSES = ["BSCS - Semester 2", "BSCS - Semester 3", "BSCS - Semester 4"];

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All Quizzes" },
  { key: "Published", label: "Published" },
  { key: "Draft", label: "Drafts" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Closed", label: "Closed" },
];

const WEEKLY_ATTEMPTS = [
  { label: "Sep 29", value: 34 },
  { label: "Oct 6", value: 48 },
  { label: "Oct 13", value: 65 },
  { label: "Oct 20", value: 92 },
];

/* ---------- sample data (TODO: replace with API: GET /api/teacher/quizzes) ---------- */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function minusDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return toLocalISO(d);
}

function mk(
  id: number,
  title: string,
  note: string,
  subject: string,
  className: string,
  questions: number,
  attempts: number,
  avg: number | null,
  status: QuizStatus,
  updated: string
): Quiz {
  return { id, title, note, subject, className, questions, attempts, avg, status, updated, created: minusDays(updated, 6) };
}

const FIRST_FIVE: Quiz[] = [
  mk(1, "Data Structures Quiz 1", "Based on chapter 1-3", "Data Structures", "BSCS - Semester 3", 20, 38, 78, "Published", "2026-10-20T10:24"),
  mk(2, "C Programming Fundamentals", "Basics to loops and functions", "C Programming", "BSCS - Semester 2", 15, 42, 84, "Published", "2026-10-18T14:16"),
  mk(3, "Algorithms Practice Test", "Sorting, searching and complexity", "Algorithms", "BSCS - Semester 4", 25, 0, null, "Draft", "2026-10-16T11:03"),
  mk(4, "Arrays & Linked Lists", "Array operations and linked lists", "Data Structures", "BSCS - Semester 3", 10, 0, null, "Scheduled", "2026-10-15T16:20"),
  mk(5, "Midterm Revision Quiz", "Mixed topics revision", "Programming", "BSCS - Semester 2", 30, 56, 71, "Closed", "2026-10-12T09:45"),
];

const MORE_TITLES = [
  "Stacks and Queues Quiz",
  "Binary Trees Quiz",
  "HTML & CSS Basics",
  "SQL Joins Practice",
  "Recursion Drill",
  "Pointers in C",
  "Graph Algorithms Quiz",
  "Normalization Test",
  "JavaScript Essentials",
  "Sorting Algorithms Quiz",
  "Database Design Quiz",
  "React Basics",
  "Hash Tables Quiz",
  "Operating Systems Quiz",
  "Dynamic Programming",
  "Networking Basics",
  "File Handling in C",
  "Time Complexity Quiz",
  "REST API Quiz",
];

function buildQuizzes(): Quiz[] {
  const list: Quiz[] = [...FIRST_FIVE];
  MORE_TITLES.forEach((title, k) => {
    let status: QuizStatus = "Published";
    if (k === 3 || k === 11) status = "Draft";
    else if (k === 7) status = "Scheduled";
    else if (k === 5 || k === 14) status = "Closed";

    const hasAttempts = status === "Published" || status === "Closed";
    const d = new Date(2026, 9, 11 - k, 9 + (k % 8), (k * 17) % 60);
    list.push(
      mk(
        6 + k,
        title,
        "Created from question bank",
        SUBJECTS[k % SUBJECTS.length],
        CLASSES[(k + 1) % CLASSES.length],
        10 + ((k * 5) % 25),
        hasAttempts ? 20 + ((k * 13) % 40) : 0,
        hasAttempts ? 55 + ((k * 7) % 40) : null,
        status,
        toLocalISO(d)
      )
    );
  });
  return list;
}

/* ---------- helpers ---------- */

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function pageList(current: number, total: number): (number | "...")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "..."];
  if (current >= total - 2) return ["...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "..."];
}

/* ---------- page ---------- */

function ViewQuiz() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>(buildQuizzes);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const stats = useMemo(() => {
    const count = (s: QuizStatus) => quizzes.filter((x) => x.status === s).length;
    return {
      total: quizzes.length,
      published: count("Published"),
      draft: count("Draft"),
      scheduled: count("Scheduled"),
      closed: count("Closed"),
      attempts: quizzes.reduce((sum, x) => sum + x.attempts, 0),
    };
  }, [quizzes]);

  const tabCount = (key: StatusFilter) =>
    key === "all" ? stats.total : key === "Published" ? stats.published : key === "Draft" ? stats.draft : key === "Scheduled" ? stats.scheduled : stats.closed;

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const days = dateFilter === "all" ? null : Number(dateFilter);
    const limit = days === null ? 0 : Date.now() - days * 86400000;
    return quizzes.filter((x) => {
      if (status !== "all" && x.status !== status) return false;
      if (subjectFilter !== "all" && x.subject !== subjectFilter) return false;
      if (classFilter !== "all" && x.className !== classFilter) return false;
      if (days !== null && new Date(x.created).getTime() < limit) return false;
      if (s && !x.title.toLowerCase().includes(s) && !x.subject.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [quizzes, status, search, subjectFilter, classFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const allOnPage = rows.length > 0 && rows.every((r) => checked.includes(r.id));

  const recent = useMemo(
    () => [...quizzes].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5),
    [quizzes]
  );

  const maxWeek = Math.max(100, ...WEEKLY_ATTEMPTS.map((w) => w.value));

  /* ----- handlers ----- */
  const resetPage = () => setPage(1);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const toggleOne = (id: number) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const toggleAll = () => {
    if (allOnPage) setChecked((c) => c.filter((id) => !rows.some((r) => r.id === id)));
    else setChecked((c) => [...new Set([...c, ...rows.map((r) => r.id)])]);
  };

  const changeStatus = (id: number, next: QuizStatus) => {
    // TODO: PATCH /api/teacher/quizzes/:id { status }
    setQuizzes((prev) => prev.map((x) => (x.id === id ? { ...x, status: next, updated: toLocalISO(new Date()) } : x)));
    setMenuOpen(null);
    showToast(`Quiz ${next === "Published" ? "published" : next === "Closed" ? "closed" : "updated"}`);
  };

  const duplicate = (id: number) => {
    const src = quizzes.find((x) => x.id === id);
    if (!src) return;
    const now = toLocalISO(new Date());
    // TODO: POST /api/teacher/quizzes/:id/duplicate
    setQuizzes((prev) => [
      { ...src, id: Date.now(), title: `${src.title} (Copy)`, status: "Draft", attempts: 0, avg: null, updated: now, created: now },
      ...prev,
    ]);
    setMenuOpen(null);
    showToast("Quiz duplicated as draft");
  };

  const remove = (ids: number[]) => {
    // TODO: DELETE /api/teacher/quizzes
    setQuizzes((prev) => prev.filter((x) => !ids.includes(x.id)));
    setChecked((c) => c.filter((id) => !ids.includes(id)));
    setMenuOpen(null);
  };

  const deleteOne = (id: number) => {
    setMenuOpen(null);
    if (window.confirm("Delete this quiz?")) remove([id]);
  };

  const deleteChecked = () => {
    if (window.confirm(`Delete ${checked.length} selected quiz(zes)?`)) remove(checked);
  };

  const edit = (id: number) => {
    setMenuOpen(null);
    // TODO: navigate(`/teacher/create-quiz?edit=${id}`)
    console.log("Edit quiz:", id);
    navigate("/teacher/create-quiz");
  };

  const viewResults = (id: number) => {
    setMenuOpen(null);
    // TODO: navigate(`/teacher/results/${id}`)
    console.log("View results:", id);
    navigate("/teacher/analytics");
  };

  const quickDuplicate = () => {
    if (checked.length === 1) duplicate(checked[0]);
    else showToast("Select one quiz from the table first");
  };

  const statCards = [
    { label: "Total Quizzes", value: stats.total, sub: "12% from last month", up: true, icon: <FileText size={22} />, tone: "purple" },
    { label: "Published", value: stats.published, sub: "23% from last month", up: true, icon: <CheckCircle2 size={22} />, tone: "green" },
    { label: "Drafts", value: stats.draft, sub: "25% from last month", up: false, icon: <Pencil size={22} />, tone: "violet" },
    { label: "Scheduled", value: stats.scheduled, sub: "100% from last month", up: true, icon: <CalendarDays size={22} />, tone: "purple" },
    { label: "Total Attempts", value: stats.attempts, sub: "18% from last month", up: true, icon: <Users size={22} />, tone: "violet" },
  ];

  return (
    <div className="vq-shell">
      <Sidebar />

      <div className="vq-main">
        <Header />

        {menuOpen !== null && <div className="vq-backdrop" onClick={() => setMenuOpen(null)} />}

        <div className="vq-content">
          {/* ===== Center ===== */}
          <div className="vq-center">
            {/* Banner */}
            <section className="vq-banner">
              <div className="vq-banner-icon">
                <FileText size={28} />
              </div>
              <div className="vq-banner-text">
                <h1>My Quizzes</h1>
                <p>Manage your quizzes, track attempts, and review class performance.</p>
              </div>
              <button type="button" className="vq-create" onClick={() => navigate("/teacher/create-quiz")}>
                <Plus size={16} /> Create Quiz
              </button>
            </section>

            {/* Stats */}
            <section className="vq-stats">
              {statCards.map((c) => (
                <div className="vq-stat" key={c.label}>
                  <span className={`vq-stat-icon ${c.tone}`}>{c.icon}</span>
                  <div>
                    <p className="vq-stat-label">{c.label}</p>
                    <p className="vq-stat-value">{c.value}</p>
                    <p className={`vq-stat-sub ${c.up ? "up" : "down"}`}>
                      {c.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      <b>{c.sub.split(" ")[0]}</b> {c.sub.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* All quizzes */}
            <section className="vq-card">
              <div className="vq-card-head">
                <h2>All Quizzes</h2>
                <div className="vq-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                  />
                </div>
              </div>

              <div className="vq-toolbar">
                <div className="vq-tabs">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={status === t.key ? "on" : ""}
                      onClick={() => {
                        setStatus(t.key);
                        resetPage();
                      }}
                    >
                      {t.label}
                      {t.key !== "all" && ` (${tabCount(t.key)})`}
                    </button>
                  ))}
                </div>

                <div className="vq-filters">
                  <div className="vq-filter">
                    <label>Subject</label>
                    <div className="vq-select">
                      <select
                        value={subjectFilter}
                        onChange={(e) => {
                          setSubjectFilter(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="all">All Subjects</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  </div>

                  <div className="vq-filter">
                    <label>Class</label>
                    <div className="vq-select">
                      <select
                        value={classFilter}
                        onChange={(e) => {
                          setClassFilter(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="all">All Classes</option>
                        {CLASSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  </div>

                  <div className="vq-filter">
                    <label>Date Created</label>
                    <div className="vq-select">
                      <select
                        value={dateFilter}
                        onChange={(e) => {
                          setDateFilter(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="all">All Dates</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  </div>

                  <div className="vq-filter">
                    <label>Status</label>
                    <div className="vq-select">
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value as StatusFilter);
                          resetPage();
                        }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  </div>
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="vq-empty">
                  <FileText size={36} strokeWidth={1.4} />
                  <p>No quizzes found</p>
                  <span>Try changing your search or filters.</span>
                </div>
              ) : (
                <div className="vq-table-wrap">
                  <table className="vq-table">
                    <thead>
                      <tr>
                        <th className="vq-check">
                          <input type="checkbox" checked={allOnPage} onChange={toggleAll} />
                        </th>
                        <th>Quiz Title</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th className="c">Questions</th>
                        <th className="c">Attempts</th>
                        <th className="c">Avg. Score</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th className="c">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((x) => (
                        <tr key={x.id} className={checked.includes(x.id) ? "sel" : ""}>
                          <td className="vq-check">
                            <input type="checkbox" checked={checked.includes(x.id)} onChange={() => toggleOne(x.id)} />
                          </td>
                          <td>
                            <div className="vq-title">
                              <span className="vq-title-icon">
                                <FileText size={18} />
                              </span>
                              <div>
                                <p>{x.title}</p>
                                <small>{x.note}</small>
                              </div>
                            </div>
                          </td>
                          <td className="vq-text">{x.subject}</td>
                          <td className="vq-text">{x.className}</td>
                          <td className="c">{x.questions}</td>
                          <td className="c">{x.attempts}</td>
                          <td className="c">{x.avg === null ? "—" : `${x.avg}%`}</td>
                          <td>
                            <span className={`vq-status ${x.status.toLowerCase()}`}>{x.status}</span>
                          </td>
                          <td className="vq-updated">
                            <p>{fmtDate(x.updated)}</p>
                            <small>{fmtTime(x.updated)}</small>
                          </td>
                          <td className="c">
                            <div className="vq-more-wrap">
                              <button
                                type="button"
                                className="vq-more"
                                aria-label="More actions"
                                onClick={() => setMenuOpen(menuOpen === x.id ? null : x.id)}
                              >
                                <MoreVertical size={16} />
                              </button>
                              {menuOpen === x.id && (
                                <div className="vq-menu">
                                  <button type="button" onClick={() => edit(x.id)}>
                                    Edit Quiz
                                  </button>
                                  <button type="button" onClick={() => viewResults(x.id)}>
                                    View Results
                                  </button>
                                  <button type="button" onClick={() => duplicate(x.id)}>
                                    Duplicate
                                  </button>
                                  {(x.status === "Draft" || x.status === "Scheduled") && (
                                    <button type="button" onClick={() => changeStatus(x.id, "Published")}>
                                      Publish Now
                                    </button>
                                  )}
                                  {x.status === "Published" && (
                                    <button type="button" onClick={() => changeStatus(x.id, "Closed")}>
                                      Close Quiz
                                    </button>
                                  )}
                                  {x.status === "Closed" && (
                                    <button type="button" onClick={() => changeStatus(x.id, "Published")}>
                                      Reopen
                                    </button>
                                  )}
                                  <button type="button" className="danger" onClick={() => deleteOne(x.id)}>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="vq-pager">
                  <p>
                    Showing {start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} quizzes
                    {checked.length > 0 && (
                      <button type="button" className="vq-bulk" onClick={deleteChecked}>
                        Delete selected ({checked.length})
                      </button>
                    )}
                  </p>
                  <div className="vq-pages">
                    <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
                      <ChevronLeft size={14} />
                    </button>
                    {pageList(current, totalPages).map((n, i) =>
                      n === "..." ? (
                        <span key={`d${i}`} className="vq-dots">
                          …
                        </span>
                      ) : (
                        <button type="button" key={n} className={n === current ? "on" : ""} onClick={() => setPage(n)}>
                          {n}
                        </button>
                      )
                    )}
                    <button type="button" disabled={current === totalPages} onClick={() => setPage(current + 1)} aria-label="Next page">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ===== Right column ===== */}
          <aside className="vq-right">
            <section className="vq-side-card">
              <div className="vq-side-head">
                <h3 className="vq-side-title">
                  <Activity size={17} /> Quiz Performance
                </h3>
                <button type="button" className="vq-link" onClick={() => navigate("/teacher/analytics")}>
                  View Details <ArrowRight size={11} />
                </button>
              </div>
              <p className="vq-chart-title">Total Attempts (Last 4 Weeks)</p>
              <div className="vq-chart">
                <div className="vq-chart-y">
                  {[100, 75, 50, 25, 0].map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
                <div className="vq-chart-plot">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={i} style={{ top: `${i * 25}%` }} />
                  ))}
                  <div className="vq-bars">
                    {WEEKLY_ATTEMPTS.map((w) => (
                      <div className="vq-bar-col" key={w.label}>
                        <span className="vq-bar" style={{ height: `${(w.value / maxWeek) * 100}%` }} title={`${w.value} attempts`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="vq-chart-x">
                {WEEKLY_ATTEMPTS.map((w) => (
                  <span key={w.label}>{w.label}</span>
                ))}
              </div>
            </section>

            <section className="vq-side-card">
              <div className="vq-side-head">
                <h3 className="vq-side-title">
                  <Clock size={17} /> Recently Updated
                </h3>
                <button type="button" className="vq-link" onClick={() => setStatus("all")}>
                  View All <ArrowRight size={11} />
                </button>
              </div>
              <ul className="vq-recent">
                {recent.map((r) => (
                  <li key={r.id}>
                    <span className="vq-recent-icon">
                      <FileText size={16} />
                    </span>
                    <div>
                      <p>{r.title}</p>
                      <small>
                        {r.subject} • {r.className}
                      </small>
                      <small className="ago">{timeAgo(r.updated)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="vq-side-card">
              <h3 className="vq-side-title">
                <Zap size={17} /> Quick Actions
              </h3>
              <div className="vq-quick">
                <button type="button" onClick={quickDuplicate}>
                  <span className="vq-quick-icon">
                    <Copy size={18} />
                  </span>
                  <span>
                    <b>Duplicate Quiz</b>
                    <small>Copy an existing quiz</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
                <button type="button" onClick={() => navigate("/teacher/analytics")}>
                  <span className="vq-quick-icon">
                    <Users size={18} />
                  </span>
                  <span>
                    <b>View Results</b>
                    <small>Check quiz performance</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
                <button type="button" onClick={() => navigate("/teacher/question-bank")}>
                  <span className="vq-quick-icon">
                    <Database size={18} />
                  </span>
                  <span>
                    <b>Manage Question Bank</b>
                    <small>Browse and edit questions</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {toast && <div className="vq-toast">{toast}</div>}
    </div>
  );
}

export default ViewQuiz;