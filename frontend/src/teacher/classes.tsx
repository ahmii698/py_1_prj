import { useMemo, useState } from "react";
import {
  Plus,
  Users,
  BookOpen,
  Layers,
  PlayCircle,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Copy,
  Check,
  MoreVertical,
  Eye,
  Settings2,
  Code2,
  Cpu,
  Database,
  Globe,
  Network,
  Zap,
  UserPlus,
  BarChart3,
  CalendarDays,
  ArrowRight,
  UserCheck,
  FileText,
  FilePlus2,
  RefreshCw,
  PresentationIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./classes.css";

type Tone = "purple" | "blue" | "green" | "orange" | "slate";
type ClassStatus = "Active" | "Archived";
type Tab = "All Classes" | "Active" | "Archived";

interface ClassItem {
  id: number;
  section: string;
  subject: string;
  code: string;
  students: number;
  quizzes: number;
  progress: number;
  status: ClassStatus;
  tone: Tone;
  icon: LucideIcon;
}

const CLASSES: ClassItem[] = [
  { id: 1, section: "BSCS - Semester 3", subject: "Data Structures", code: "DS3-2025", students: 28, quizzes: 4, progress: 78, status: "Active", tone: "purple", icon: Code2 },
  { id: 2, section: "BSCS - Semester 3", subject: "Algorithms", code: "ALG3-2025", students: 24, quizzes: 3, progress: 65, status: "Active", tone: "blue", icon: Cpu },
  { id: 3, section: "BSCS - Semester 3", subject: "Database Systems", code: "DB3-2025", students: 22, quizzes: 3, progress: 58, status: "Active", tone: "green", icon: Database },
  { id: 4, section: "BSCS - Semester 3", subject: "Web Development", code: "WD3-2025", students: 18, quizzes: 2, progress: 72, status: "Active", tone: "orange", icon: Globe },
  { id: 5, section: "BSCS - Semester 4", subject: "Computer Networks", code: "CN4-2025", students: 12, quizzes: 1, progress: 100, status: "Archived", tone: "slate", icon: Network },
];

const TONE_COLORS: Record<Tone, string> = {
  purple: "#7c5cfc",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f59e0b",
  slate: "#8b90b5",
};

const SUBJECT_COLORS = ["#4f86d6", "#3b82f6", "#10b981", "#f5a623", "#9aa3d6"];

const QUICK_ACTIONS = [
  { title: "Create New Class", desc: "Set up a new class with subject and code", icon: Zap },
  { title: "Add Students", desc: "Share class code or invite students", icon: UserPlus },
  { title: "View All Students", desc: "See complete student list across classes", icon: Users },
  { title: "Class Analytics", desc: "View class-wise performance overview", icon: BarChart3 },
];

const RECENT_ACTIVITY = [
  { title: "New student joined", desc: "Usman Raza joined BSCS - Semester 3 (Data Structures)", time: "2 hours", icon: UserCheck },
  { title: "Quiz completed", desc: "Sara Ahmed completed Arrays Quiz 01", time: "4 hours", icon: FileText },
  { title: "New assignment", desc: "Database Design Assignment created", time: "6 hours", icon: FilePlus2 },
  { title: "Class updated", desc: "Web Development class details updated", time: "1 day", icon: RefreshCw },
];

const UPCOMING = [
  { date: "May 21, 2025 10:00 AM", cls: "BSCS - Semester 3", subject: "Data Structures", event: "Quiz: Arrays Quiz 01", status: "Upcoming" },
  { date: "May 22, 2025 11:00 AM", cls: "BSCS - Semester 3", subject: "Algorithms", event: "Assignment: Sorting Algorithms", status: "Upcoming" },
  { date: "May 24, 2025 09:00 AM", cls: "BSCS - Semester 3", subject: "Database Systems", event: "Quiz: SQL Basics", status: "Active" },
  { date: "May 26, 2025 02:00 PM", cls: "BSCS - Semester 3", subject: "Web Development", event: "Assignment: Frontend Project", status: "Upcoming" },
];

const TABS: Tab[] = ["All Classes", "Active", "Archived"];

/* ---------------- Donut ---------------- */
const SubjectDonut = ({ items }: { items: ClassItem[] }) => {
  const r = 50;
  const c = 2 * Math.PI * r;
  const total = items.length || 1;
  let offset = 0;
  return (
    <div className="cl-donut">
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef0f8" strokeWidth="18" />
        {items.map((it, i) => {
          const len = (1 / total) * c;
          const el = (
            <circle
              key={it.id}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={SUBJECT_COLORS[i % SUBJECT_COLORS.length]}
              strokeWidth="18"
              strokeDasharray={`${len - 2} ${c - len + 2}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="cl-donut-center">
        <strong>{items.length}</strong>
        <span>Classes</span>
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */
export default function Classes() {
  const [tab, setTab] = useState<Tab>("All Classes");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("default");
  const [copied, setCopied] = useState<string | null>(null);

  const subjects = useMemo(() => Array.from(new Set(CLASSES.map((c) => c.subject))), []);

  const totalStudents = CLASSES.reduce((s, c) => s + c.students, 0);
  const activeCount = CLASSES.filter((c) => c.status === "Active").length;
  const archivedCount = CLASSES.length - activeCount;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = CLASSES.filter((c) => {
      const matchTab = tab === "All Classes" || c.status === tab;
      const matchSubject = subjectFilter === "All Subjects" || c.subject === subjectFilter;
      const matchSearch =
        !q ||
        c.subject.toLowerCase().includes(q) ||
        c.section.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q);
      return matchTab && matchSubject && matchSearch;
    });
    if (sortBy === "progress") list = [...list].sort((a, b) => b.progress - a.progress);
    if (sortBy === "students") list = [...list].sort((a, b) => b.students - a.students);
    if (sortBy === "name") list = [...list].sort((a, b) => a.subject.localeCompare(b.subject));
    return list;
  }, [tab, search, subjectFilter, sortBy]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard block ho to ignore */
    }
  };

  return (
    <div className="cl-shell">
      <Sidebar />

      <div className="cl-main">
        <Header />

        <main className="cl-page">
          <div className="cl-layout">
            {/* ============ CENTER ============ */}
            <div className="cl-center">
              {/* Banner */}
              <section className="cl-banner">
                <div className="cl-banner-left">
                  <span className="cl-banner-icon"><PresentationIcon size={26} /></span>
                  <div>
                    <h1>My Classes</h1>
                    <p>Manage your classes, add new ones, and keep track of student engagement.</p>
                  </div>
                </div>
                <div className="cl-banner-right">
                  <BookOpen size={64} className="cl-banner-art" />
                  <button className="cl-btn-primary">
                    <Plus size={16} /> Create New Class
                  </button>
                </div>
              </section>

              {/* Stats */}
              <section className="cl-stats">
                <div className="cl-card cl-stat">
                  <span className="cl-stat-icon purple"><Users size={22} /></span>
                  <div>
                    <p>Total Classes</p>
                    <h3>{CLASSES.length}</h3>
                    <small><b className="g">↑ Active</b> &nbsp; {archivedCount} Archived</small>
                  </div>
                </div>
                <div className="cl-card cl-stat">
                  <span className="cl-stat-icon green"><Users size={22} /></span>
                  <div>
                    <p>Total Students</p>
                    <h3>{totalStudents}</h3>
                    <small>Across all classes</small>
                  </div>
                </div>
                <div className="cl-card cl-stat">
                  <span className="cl-stat-icon pink"><FileText size={22} /></span>
                  <div>
                    <p>Total Subjects</p>
                    <h3>{subjects.length}</h3>
                    <small>Different subjects</small>
                  </div>
                </div>
                <div className="cl-card cl-stat">
                  <span className="cl-stat-icon blue"><PlayCircle size={22} /></span>
                  <div>
                    <p>Active Classes</p>
                    <h3>{activeCount}</h3>
                    <small>Currently running</small>
                  </div>
                </div>
              </section>

              {/* Classes panel */}
              <section className="cl-card cl-panel">
                <div className="cl-toolbar">
                  <div className="cl-tabs">
                    {TABS.map((t) => (
                      <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="cl-tools">
                    <div className="cl-search">
                      <Search size={15} />
                      <input
                        type="text"
                        placeholder="Search classes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="cl-select">
                      <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                        <option>All Subjects</option>
                        {subjects.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <div className="cl-select cl-select-sort">
                      <SlidersHorizontal size={14} className="cl-sort-icon" />
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="default">Sort by</option>
                        <option value="progress">Progress (High-Low)</option>
                        <option value="students">Students (High-Low)</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="cl-grid">
                  {visible.map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.id} className="cl-class-card">
                        <div className={`cl-class-head ${c.tone}`}>
                          <span className="cl-class-icon" style={{ color: TONE_COLORS[c.tone] }}>
                            <Icon size={22} />
                          </span>
                          <div className="cl-class-title">
                            <strong>{c.section}</strong>
                            <small>{c.subject}</small>
                          </div>
                          <span className={c.status === "Active" ? "cl-status active" : "cl-status archived"}>
                            ● {c.status}
                          </span>
                        </div>

                        <div className="cl-code-row">
                          <span>Class Code: {c.code}</span>
                          <button className="cl-copy" onClick={() => copyCode(c.code)}>
                            {copied === c.code ? <Check size={12} /> : <Copy size={12} />}
                            {copied === c.code ? "Copied" : "Copy"}
                          </button>
                        </div>

                        <div className="cl-meta">
                          <span><Users size={14} /> {c.students} Students</span>
                          <span><Layers size={14} /> {c.quizzes} {c.quizzes === 1 ? "Quiz" : "Quizzes"}</span>
                        </div>

                        <div className="cl-progress">
                          <div className="cl-bar">
                            <div style={{ width: `${c.progress}%`, background: TONE_COLORS[c.tone] }} />
                          </div>
                          <b>{c.progress}%</b>
                        </div>

                        <div className="cl-card-actions">
                          <button><Eye size={14} /> View Students</button>
                          <button><Settings2 size={14} /> Manage Class</button>
                          <button className="cl-dots"><MoreVertical size={16} /></button>
                        </div>
                      </div>
                    );
                  })}

                  {tab !== "Archived" && (
                    <div className="cl-add-card">
                      <span className="cl-add-icon"><Plus size={22} /></span>
                      <h4>Add New Class</h4>
                      <p>Create a new class and start managing your students.</p>
                      <button className="cl-btn-primary">
                        <Plus size={15} /> Create New Class
                      </button>
                    </div>
                  )}

                  {visible.length === 0 && tab === "Archived" && (
                    <p className="cl-empty">Koi class nahi mili</p>
                  )}
                </div>
              </section>

              {/* Upcoming */}
              <section className="cl-card cl-pad">
                <div className="cl-head-row">
                  <h2><CalendarDays size={18} /> Upcoming Classes &amp; Deadlines</h2>
                  <a href="#" className="cl-link" onClick={(e) => e.preventDefault()}>
                    View Calendar <ArrowRight size={12} />
                  </a>
                </div>
                <div className="cl-table-wrap">
                  <table className="cl-table">
                    <thead>
                      <tr>
                        <th>Date &amp; Time</th>
                        <th>Class</th>
                        <th>Subject</th>
                        <th>Event</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UPCOMING.map((u) => (
                        <tr key={u.date}>
                          <td>{u.date}</td>
                          <td>{u.cls}</td>
                          <td>{u.subject}</td>
                          <td>{u.event}</td>
                          <td>
                            <span className={u.status === "Active" ? "cl-pill green" : "cl-pill purple"}>{u.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ============ RIGHT ============ */}
            <aside className="cl-right">
              <div className="cl-card cl-pad">
                <div className="cl-head-row">
                  <h2><Zap size={16} /> Quick Actions</h2>
                </div>
                <div className="cl-quick">
                  {QUICK_ACTIONS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <button key={q.title}>
                        <span><Icon size={18} /></span>
                        <div>
                          <strong>{q.title}</strong>
                          <small>{q.desc}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cl-card cl-pad">
                <div className="cl-head-row">
                  <h2><Zap size={16} /> Classes by Subject</h2>
                </div>
                <div className="cl-subject-row">
                  <SubjectDonut items={CLASSES} />
                  <ul className="cl-legend">
                    {CLASSES.map((c, i) => (
                      <li key={c.id}>
                        <i style={{ background: SUBJECT_COLORS[i % SUBJECT_COLORS.length] }} />
                        <span>{c.subject}</span>
                        <b>1 ({Math.round(100 / CLASSES.length)}%)</b>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="cl-card cl-pad">
                <div className="cl-head-row">
                  <h2>Recent Activity</h2>
                </div>
                <div className="cl-activity">
                  {RECENT_ACTIVITY.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.title} className="cl-act-item">
                        <span className="cl-act-icon"><Icon size={16} /></span>
                        <div className="cl-act-text">
                          <strong>{a.title}</strong>
                          <small>{a.desc}</small>
                        </div>
                        <span className="cl-act-time">{a.time}</span>
                      </div>
                    );
                  })}
                </div>
                <a href="#" className="cl-link cl-view-all" onClick={(e) => e.preventDefault()}>
                  View All Activity <ArrowRight size={12} />
                </a>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}