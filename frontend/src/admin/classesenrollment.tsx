import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Users, GraduationCap, User, BookOpen, HelpCircle, Search, ChevronRight,
  ChevronLeft, Eye, Pencil, MoreVertical, Plus, Download, Zap, RotateCcw,
  Clock, ArrowUp, ArrowDown, CheckCircle2, UserCog, FilePlus, Code2,
  Calculator, FlaskConical, Atom, Monitor, MessageCircle, Globe, Cpu,
  Network, Brain, Shield, Smartphone, Dna, Landmark, Languages, Sigma,
  PieChart, ArrowUpDown, CalendarDays, Database,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./classesenrollment.css";

type Status = "Active" | "Pending" | "Archived";
type IconType = ComponentType<{ size?: number }>;

interface ClassRow {
  id: number;
  name: string;
  code: string;
  subject: string;
  teacher: string;
  semester: string;
  enrolled: number;
  status: Status;
  color: string;
  icon: IconType;
}

const CLASSES: ClassRow[] = [
  { id: 1, name: "BSCS Semester 1", code: "BSCS101", subject: "Computer Science", teacher: "Ali Ahmed", semester: "Semester 1", enrolled: 45, status: "Active", color: "#7c4dff", icon: Code2 },
  { id: 2, name: "BSCS Semester 3", code: "BSCS301", subject: "Data Structures", teacher: "Sara Khan", semester: "Semester 3", enrolled: 38, status: "Active", color: "#22b8a0", icon: Code2 },
  { id: 3, name: "Mathematics", code: "MATH101", subject: "Mathematics", teacher: "Bilal Ahmed", semester: "Semester 1", enrolled: 52, status: "Active", color: "#f59e42", icon: Calculator },
  { id: 4, name: "Physics", code: "PHY101", subject: "Physics", teacher: "Hira Fatima", semester: "Semester 1", enrolled: 40, status: "Active", color: "#a855f7", icon: Atom },
  { id: 5, name: "English Literature", code: "ENG101", subject: "English", teacher: "Usman Khan", semester: "Semester 1", enrolled: 28, status: "Active", color: "#ec4899", icon: BookOpen },
  { id: 6, name: "Software Engineering", code: "SE201", subject: "Software Engineering", teacher: "Ayesha Khan", semester: "Semester 4", enrolled: 32, status: "Active", color: "#14b8a6", icon: Monitor },
  { id: 7, name: "Chemistry", code: "CHE101", subject: "Chemistry", teacher: "Zain Ali", semester: "Semester 1", enrolled: 36, status: "Active", color: "#8b5cf6", icon: FlaskConical },
  { id: 8, name: "Web Development", code: "WD301", subject: "Web Development", teacher: "Fatima Ali", semester: "Semester 3", enrolled: 25, status: "Pending", color: "#2563eb", icon: Globe },
  { id: 9, name: "Database Systems", code: "DBS401", subject: "Database Systems", teacher: "Hassan Raza", semester: "Semester 4", enrolled: 29, status: "Active", color: "#ef4444", icon: Database },
  { id: 10, name: "Communication Skills", code: "COM101", subject: "Communication", teacher: "Sana Zulfiqar", semester: "Semester 1", enrolled: 22, status: "Active", color: "#7c4dff", icon: MessageCircle },
  { id: 11, name: "Operating Systems", code: "OS301", subject: "Operating Systems", teacher: "Ali Ahmed", semester: "Semester 3", enrolled: 34, status: "Active", color: "#0ea5e9", icon: Cpu },
  { id: 12, name: "Computer Networks", code: "CN401", subject: "Networking", teacher: "Bilal Ahmed", semester: "Semester 4", enrolled: 31, status: "Active", color: "#22b8a0", icon: Network },
  { id: 13, name: "Algorithms", code: "ALG302", subject: "Data Structures", teacher: "Sara Khan", semester: "Semester 3", enrolled: 37, status: "Active", color: "#f59e42", icon: Code2 },
  { id: 14, name: "Statistics", code: "STA201", subject: "Mathematics", teacher: "Hira Fatima", semester: "Semester 2", enrolled: 41, status: "Active", color: "#a855f7", icon: Sigma },
  { id: 15, name: "Biology", code: "BIO101", subject: "Biology", teacher: "Zain Ali", semester: "Semester 1", enrolled: 30, status: "Active", color: "#16a34a", icon: Dna },
  { id: 16, name: "Economics", code: "ECO101", subject: "Economics", teacher: "Usman Khan", semester: "Semester 2", enrolled: 27, status: "Active", color: "#ec4899", icon: Landmark },
  { id: 17, name: "Islamic Studies", code: "ISL101", subject: "Islamiat", teacher: "Sana Zulfiqar", semester: "Semester 1", enrolled: 48, status: "Active", color: "#14b8a6", icon: BookOpen },
  { id: 18, name: "Urdu", code: "URD101", subject: "Urdu", teacher: "Fatima Ali", semester: "Semester 1", enrolled: 33, status: "Active", color: "#8b5cf6", icon: Languages },
  { id: 19, name: "Machine Learning", code: "ML501", subject: "Artificial Intelligence", teacher: "Ayesha Khan", semester: "Semester 5", enrolled: 26, status: "Active", color: "#2563eb", icon: Brain },
  { id: 20, name: "Discrete Math", code: "DM201", subject: "Mathematics", teacher: "Bilal Ahmed", semester: "Semester 2", enrolled: 39, status: "Active", color: "#ef4444", icon: Sigma },
  { id: 21, name: "Linear Algebra", code: "LA201", subject: "Mathematics", teacher: "Hira Fatima", semester: "Semester 2", enrolled: 35, status: "Active", color: "#7c4dff", icon: Calculator },
  { id: 22, name: "Artificial Intelligence", code: "AI401", subject: "Artificial Intelligence", teacher: "Ali Ahmed", semester: "Semester 4", enrolled: 24, status: "Archived", color: "#0ea5e9", icon: Brain },
  { id: 23, name: "Cyber Security", code: "CS402", subject: "Security", teacher: "Hassan Raza", semester: "Semester 4", enrolled: 21, status: "Archived", color: "#22b8a0", icon: Shield },
  { id: 24, name: "Mobile App Development", code: "MAD401", subject: "Web Development", teacher: "Fatima Ali", semester: "Semester 4", enrolled: 19, status: "Pending", color: "#f59e42", icon: Smartphone },
];

const RECENT = [
  { name: "Web Development", meta: "SE 301 • Semester 3", status: "Pending", when: "2 days ago", color: "#2563eb", icon: Globe },
  { name: "Database Systems", meta: "DBS401 • Semester 4", status: "Active", when: "3 days ago", color: "#ef4444", icon: Database },
  { name: "Communication Skills", meta: "COM101 • Semester 1", status: "Active", when: "5 days ago", color: "#7c4dff", icon: MessageCircle },
  { name: "Chemistry", meta: "CHE101 • Semester 1", status: "Active", when: "6 days ago", color: "#8b5cf6", icon: FlaskConical },
  { name: "Physics", meta: "PHY101 • Semester 1", status: "Active", when: "1 week ago", color: "#a855f7", icon: Atom },
];

const AVATAR_COLORS = ["#6d4de0", "#e0574d", "#2f9e8f", "#d98a1f", "#3b82c4", "#b04fb8", "#4a7c3f"];
const PAGE_SIZE = 10;

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.length % AVATAR_COLORS.length];

type Tab = "classes" | "enrollment";

export default function ClassesEnrollment() {
  const [tab, setTab] = useState<Tab>("classes");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [teacher, setTeacher] = useState("all");
  const [semester, setSemester] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [sortDir, setSortDir] = useState<"none" | "asc" | "desc">("none");

  const subjects = useMemo(() => Array.from(new Set(CLASSES.map((c) => c.subject))).sort(), []);
  const teachers = useMemo(() => Array.from(new Set(CLASSES.map((c) => c.teacher))).sort(), []);
  const semesters = useMemo(() => Array.from(new Set(CLASSES.map((c) => c.semester))).sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = CLASSES.filter((c) => {
      if (subject !== "all" && c.subject !== subject) return false;
      if (teacher !== "all" && c.teacher !== teacher) return false;
      if (semester !== "all" && c.semester !== semester) return false;
      if (status !== "all" && c.status !== status) return false;
      if (q && !`${c.name} ${c.code} ${c.subject}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortDir !== "none") {
      list = [...list].sort((a, b) =>
        sortDir === "asc" ? a.enrolled - b.enrolled : b.enrolled - a.enrolled
      );
    }
    return list;
  }, [search, subject, teacher, semester, status, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const toggleAll = () =>
    setSelected(allChecked
      ? selected.filter((id) => !rows.some((r) => r.id === id))
      : Array.from(new Set([...selected, ...rows.map((r) => r.id)])));
  const toggleOne = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

  const clearFilters = () => {
    setSearch(""); setSubject("all"); setTeacher("all");
    setSemester("all"); setStatus("all"); setSortDir("none"); setPage(1);
  };

  const cycleSort = () =>
    setSortDir((d) => (d === "none" ? "desc" : d === "desc" ? "asc" : "none"));

  const stats = [
    { label: "Total Classes", value: "24", icon: BookOpen, tone: "blue", trend: "12%", up: true, vs: "vs. last month" },
    { label: "Active Classes", value: "20", icon: CheckCircle2, tone: "green", trend: "11%", up: true, vs: "vs. last month" },
    { label: "Total Enrolled Students", value: "842", icon: Users, tone: "purple", trend: "18%", up: true, vs: "vs. last month" },
    { label: "Teachers Assigned", value: "16", icon: User, tone: "violet", trend: "6%", up: true, vs: "vs. last month" },
    { label: "Pending Enrollments", value: "8", icon: Clock, tone: "grey", trend: "33%", up: false, vs: "vs. last week" },
  ];

  const quick = [
    { title: "Create Class", sub: "Add a new class", icon: FilePlus },
    { title: "Manage Enrollment", sub: "Add/remove students", icon: UserCog },
    { title: "Assign Teacher", sub: "Set class teacher", icon: User },
    { title: "Export Classes", sub: "Download class records", icon: Download },
  ];

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="ce-app">
          <div className="ce-content">
            {/* LEFT */}
            <div className="ce-left">
              <div className="ce-hero">
                <div className="ce-hero-icon"><GraduationCap size={28} /></div>
                <div>
                  <h1>Classes &amp; Enrollment</h1>
                  <p>Manage classes, assign teachers and handle student enrollments across the platform.</p>
                </div>
                <div className="ce-hero-art"><GraduationCap size={56} /></div>
              </div>

              <div className="ce-stats">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="ce-stat" key={s.label}>
                      <div className={`ce-stat-icon ${s.tone}`}><Icon size={20} /></div>
                      <div>
                        <span className="ce-stat-label">{s.label}</span>
                        <h3>{s.value}</h3>
                        <p className={s.up ? "up" : "down"}>
                          {s.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {s.trend}
                        </p>
                        <small>{s.vs}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ce-card">
                <div className="ce-card-top">
                  <div className="ce-tabs">
                    <button className={tab === "classes" ? "active" : ""} onClick={() => setTab("classes")}>
                      All Classes
                    </button>
                    <button className={tab === "enrollment" ? "active" : ""} onClick={() => setTab("enrollment")}>
                      Enrollment Management
                    </button>
                  </div>
                  <button className="ce-create"><Plus size={15} /> Create Class</button>
                </div>

                {tab === "enrollment" ? (
                  <div className="ce-placeholder">
                    <Users size={30} />
                    <p>Enrollment Management yahan aayega.</p>
                  </div>
                ) : (
                  <>
                    <div className="ce-filters">
                      <div className="ce-filter-search">
                        <Search size={15} />
                        <input
                          placeholder="Search classes by name, code, subject..."
                          value={search}
                          onChange={(e) => resetPage(setSearch)(e.target.value)}
                        />
                      </div>
                      <select value={subject} onChange={(e) => resetPage(setSubject)(e.target.value)}>
                        <option value="all">All Subjects</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={teacher} onChange={(e) => resetPage(setTeacher)(e.target.value)}>
                        <option value="all">All Teachers</option>
                        {teachers.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={semester} onChange={(e) => resetPage(setSemester)(e.target.value)}>
                        <option value="all">All Semesters</option>
                        {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={status} onChange={(e) => resetPage(setStatus)(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <button className="ce-clear" onClick={clearFilters}>
                        <RotateCcw size={13} /> Clear Filters
                      </button>
                    </div>

                    <div className="ce-table-wrap">
                      <table className="ce-table">
                        <thead>
                          <tr>
                            <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                            <th>Class Name</th>
                            <th>Class Code</th>
                            <th>Subject</th>
                            <th>Teacher</th>
                            <th>Semester</th>
                            <th>
                              <button className="ce-sort" onClick={cycleSort}>
                                Enrolled Students <ArrowUpDown size={12} />
                              </button>
                            </th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((c) => {
                            const Icon = c.icon;
                            return (
                              <tr key={c.id}>
                                <td>
                                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} />
                                </td>
                                <td>
                                  <div className="ce-class">
                                    <span className="ce-class-icon" style={{ background: c.color }}>
                                      <Icon size={15} />
                                    </span>
                                    <strong>{c.name}</strong>
                                  </div>
                                </td>
                                <td className="ce-code">{c.code}</td>
                                <td className="ce-sub">{c.subject}</td>
                                <td>
                                  <div className="ce-teacher">
                                    <span className="ce-avatar sm" style={{ background: avatarColor(c.teacher) }}>
                                      {initials(c.teacher)}
                                    </span>
                                    {c.teacher}
                                  </div>
                                </td>
                                <td className="ce-sub">{c.semester}</td>
                                <td className="ce-enrolled">{c.enrolled}</td>
                                <td>
                                  <span className={`ce-status ${c.status.toLowerCase()}`}>
                                    <i /> {c.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="ce-actions">
                                    <button title="View"><Eye size={14} /></button>
                                    <button title="Edit"><Pencil size={14} /></button>
                                    <button title="More"><MoreVertical size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {rows.length === 0 && (
                            <tr><td colSpan={9} className="ce-empty">No classes found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="ce-pagination">
                      <span>
                        Showing {filtered.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} classes
                      </span>
                      <div className="ce-pages">
                        <button onClick={() => setPage(Math.max(1, currentPage - 1))}>
                          <ChevronLeft size={14} />
                        </button>
                        {pageButtons.map((p) => (
                          <button
                            key={p}
                            className={p === currentPage ? "active" : ""}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </button>
                        ))}
                        <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))}>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <aside className="ce-right">
              <div className="ce-panel">
                <h4><Zap size={16} /> Quick Actions</h4>
                {quick.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button className="ce-qa" key={q.title}>
                      <span className="ce-qa-icon"><Icon size={17} /></span>
                      <span className="ce-qa-text">
                        <strong>{q.title}</strong>
                        <small>{q.sub}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>

              <div className="ce-panel">
                <h4><PieChart size={16} /> Class Status Overview</h4>
                <div className="ce-dist">
                  <div className="ce-donut">
                    <div className="ce-donut-inner">
                      <strong>24</strong>
                      <span>Total Classes</span>
                    </div>
                  </div>
                  <ul>
                    <li><i style={{ background: "#1fc08e" }} /><div><span>Active</span><strong>20 (83%)</strong></div></li>
                    <li><i style={{ background: "#f5b82e" }} /><div><span>Pending</span><strong>2 (8%)</strong></div></li>
                    <li><i style={{ background: "#a78bfa" }} /><div><span>Archived</span><strong>2 (8%)</strong></div></li>
                  </ul>
                </div>
              </div>

              <div className="ce-panel">
                <div className="ce-panel-head">
                  <h4><CalendarDays size={16} /> Recent Classes</h4>
                  <a href="#">View All →</a>
                </div>
                {RECENT.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div className="ce-recent" key={r.name}>
                      <span className="ce-class-icon" style={{ background: r.color }}><Icon size={15} /></span>
                      <div className="ce-recent-info">
                        <strong>{r.name}</strong>
                        <span>{r.meta}</span>
                      </div>
                      <div className="ce-recent-side">
                        <em className={`ce-pill ${r.status.toLowerCase()}`}>{r.status}</em>
                        <small>{r.when}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ce-help">
                <span className="ce-help-icon"><HelpCircle size={16} /></span>
                <div>
                  <strong>Need Help?</strong>
                  <p>Manage classes, enrollments and teachers efficiently from this section.</p>
                </div>
                <button>Get Help</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}