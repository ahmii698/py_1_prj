import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Search,
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  FileText,
  Layers,
  ArrowUp,
  LayoutGrid,
  List,
  Eye,
  Pencil,
  Settings2,
  RotateCcw,
  MoreVertical,
  Upload,
  Zap,
  UserPlus,
  ChevronDown,
  ArrowRight,
  Code2,
  Brain,
  Globe,
  Database,
  Smartphone,
  Cloud,
  X,
  Check,
  FolderOpen,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./courses.css";

type CourseStatus = "Published" | "Draft" | "Archived";
type ThemeKey = "code" | "ai" | "web" | "db" | "app" | "cloud";
type TabKey = "courses" | "subjects" | "chapters" | "materials";

interface Course {
  id: number;
  title: string;
  subject: string;
  className: string;
  chapters: number;
  materials: number;
  students: number;
  progress: number;
  status: CourseStatus;
  theme: ThemeKey;
}

const THEMES: Record<ThemeKey, { icon: ReactNode }> = {
  code: { icon: <Code2 size={44} strokeWidth={1.4} /> },
  ai: { icon: <Brain size={44} strokeWidth={1.4} /> },
  web: { icon: <Globe size={44} strokeWidth={1.4} /> },
  db: { icon: <Database size={44} strokeWidth={1.4} /> },
  app: { icon: <Smartphone size={44} strokeWidth={1.4} /> },
  cloud: { icon: <Cloud size={44} strokeWidth={1.4} /> },
};

const SUBJECTS = [
  "Data Structures",
  "Artificial Intelligence",
  "Computer Science",
  "Software Engineering",
];

const CLASSES = ["BSCS - Semester 3", "BSCS - Semester 4"];

const THEME_OPTIONS: { key: ThemeKey; label: string }[] = [
  { key: "code", label: "Code" },
  { key: "ai", label: "AI" },
  { key: "web", label: "Web" },
  { key: "db", label: "Database" },
  { key: "app", label: "Mobile" },
  { key: "cloud", label: "Cloud" },
];

// TODO: replace with API data (GET /api/teacher/courses)
const INITIAL_COURSES: Course[] = [
  { id: 1, title: "Data Structures & Algorithms", subject: "Data Structures", className: "BSCS - Semester 3", chapters: 5, materials: 12, students: 26, progress: 78, status: "Published", theme: "code" },
  { id: 2, title: "Introduction to AI", subject: "Artificial Intelligence", className: "BSCS - Semester 4", chapters: 6, materials: 15, students: 28, progress: 62, status: "Published", theme: "ai" },
  { id: 3, title: "Web Development", subject: "Computer Science", className: "BSCS - Semester 3", chapters: 7, materials: 18, students: 24, progress: 41, status: "Draft", theme: "web" },
  { id: 4, title: "Database Systems", subject: "Computer Science", className: "BSCS - Semester 4", chapters: 5, materials: 10, students: 20, progress: 68, status: "Published", theme: "db" },
  { id: 5, title: "Mobile App Development", subject: "Software Engineering", className: "BSCS - Semester 4", chapters: 6, materials: 14, students: 18, progress: 56, status: "Published", theme: "app" },
  { id: 6, title: "Operating Systems", subject: "Computer Science", className: "BSCS - Semester 4", chapters: 8, materials: 16, students: 12, progress: 23, status: "Archived", theme: "cloud" },
  { id: 7, title: "Computer Networks", subject: "Computer Science", className: "BSCS - Semester 3", chapters: 4, materials: 9, students: 22, progress: 35, status: "Draft", theme: "cloud" },
  { id: 8, title: "Machine Learning Basics", subject: "Artificial Intelligence", className: "BSCS - Semester 4", chapters: 6, materials: 11, students: 19, progress: 50, status: "Published", theme: "ai" },
];

const recentActivity = [
  { icon: <FileText size={16} />, tone: "purple", title: "Data Structures & Algorithms", sub: "Material added (Arrays Notes.pdf)", time: "2 hours ago" },
  { icon: <Globe size={16} />, tone: "green", title: "Web Development", sub: "New chapter added (API Integration)", time: "4 hours ago" },
  { icon: <Smartphone size={16} />, tone: "red", title: "Mobile App Development", sub: "Quiz created (UI/UX Basics)", time: "6 hours ago" },
  { icon: <Database size={16} />, tone: "green", title: "Database Systems", sub: "Course published", time: "1 day ago" },
  { icon: <Brain size={16} />, tone: "purple", title: "Introduction to AI", sub: "New material uploaded (AI Concepts.pdf)", time: "1 day ago" },
];

const quickActions = [
  { key: "course", icon: <Plus size={18} />, title: "Create New Course", sub: "Add a new course with chapters and materials" },
  { key: "subject", icon: <UserPlus size={18} />, title: "Add New Subject", sub: "Share subject with your classes" },
  { key: "material", icon: <Upload size={18} />, title: "Upload Material", sub: "PDF, document, video and more" },
  { key: "quiz", icon: <Zap size={18} />, title: "Generate Quiz", sub: "Create AI quiz from course material" },
];

/* ---------- page ---------- */

function Course() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [tab, setTab] = useState<TabKey>("courses");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // create course form
  const [fTitle, setFTitle] = useState("");
  const [fSubject, setFSubject] = useState(SUBJECTS[0]);
  const [fClass, setFClass] = useState(CLASSES[0]);
  const [fTheme, setFTheme] = useState<ThemeKey>("code");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (subjectFilter !== "all" && c.subject !== subjectFilter) return false;
      if (classFilter !== "all" && c.className !== classFilter) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.subject.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [courses, search, subjectFilter, classFilter]);

  const stats = [
    { label: "Total Courses", value: courses.length, sub: "2 new this month", icon: <Users size={20} />, tone: "purple" },
    { label: "Total Subjects", value: 6, sub: "1 new this month", icon: <UserPlus size={20} />, tone: "green" },
    { label: "Total Chapters", value: 24, sub: "3 new this month", icon: <BookOpen size={20} />, tone: "red" },
    { label: "Total Materials", value: 48, sub: "8 new this month", icon: <FileText size={20} />, tone: "orange" },
  ];

  const setStatus = (id: number, status: CourseStatus) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setMenuOpen(null);
  };

  const removeCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setMenuOpen(null);
  };

  const handleView = (c: Course) => {
    // TODO: navigate(`/teacher/courses/${c.id}`)
    console.log("View course:", c.id);
  };

  const handleEdit = (c: Course) => {
    // TODO: navigate(`/teacher/courses/${c.id}/edit`)
    console.log("Edit course:", c.id);
  };

  const handleManage = (c: Course) => {
    // TODO: navigate(`/teacher/courses/${c.id}/manage`)
    console.log("Manage course:", c.id);
  };

  const openModal = () => {
    setFTitle("");
    setShowModal(true);
  };

  const submitCourse = (e: FormEvent) => {
    e.preventDefault();
    if (!fTitle.trim()) return;
    setCourses((prev) => [
      {
        id: Date.now(),
        title: fTitle.trim(),
        subject: fSubject,
        className: fClass,
        chapters: 0,
        materials: 0,
        students: 0,
        progress: 0,
        status: "Draft",
        theme: fTheme,
      },
      ...prev,
    ]);
    setShowModal(false);
  };

  const onQuickAction = (key: string) => {
    if (key === "course") openModal();
    // TODO: wire other quick actions
  };

  const actionButtons = (c: Course) => (
    <div className="co-card-actions">
      <button type="button" onClick={() => handleView(c)}>
        <Eye size={13} /> View
      </button>
      <button type="button" onClick={() => handleEdit(c)}>
        <Pencil size={13} /> Edit
      </button>
      {c.status === "Archived" ? (
        <button type="button" onClick={() => setStatus(c.id, "Draft")}>
          <RotateCcw size={13} /> Restore
        </button>
      ) : (
        <button type="button" onClick={() => handleManage(c)}>
          <Settings2 size={13} /> Manage
        </button>
      )}
      <div className="co-more-wrap">
        <button
          type="button"
          className="co-more"
          aria-label="More actions"
          onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen === c.id && (
          <div className="co-menu">
            {c.status !== "Published" && (
              <button type="button" onClick={() => setStatus(c.id, "Published")}>
                Publish
              </button>
            )}
            {c.status === "Published" && (
              <button type="button" onClick={() => setStatus(c.id, "Draft")}>
                Move to Draft
              </button>
            )}
            {c.status !== "Archived" && (
              <button type="button" onClick={() => setStatus(c.id, "Archived")}>
                Archive
              </button>
            )}
            <button type="button" className="danger" onClick={() => removeCourse(c.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="co-shell">
      <Sidebar />

      <div className="co-main">
        <Header />

        <div className="co-content">
          {/* ===== Center ===== */}
          <div className="co-center">
            {/* Banner */}
            <section className="co-banner">
              <div className="co-banner-icon">
                <GraduationCap size={28} />
              </div>
              <div className="co-banner-text">
                <h1>Courses &amp; Subjects</h1>
                <p>
                  Manage your courses, subjects, chapters and learning materials.
                  Organize your content and track student progress all in one place.
                </p>
              </div>
              <button type="button" className="co-create" onClick={openModal}>
                <Plus size={16} /> Create Course
              </button>
            </section>

            {/* Tabs */}
            <section className="co-tabs">
              {(
                [
                  ["courses", "My Courses"],
                  ["subjects", "Subjects"],
                  ["chapters", "Chapters"],
                  ["materials", "Learning Materials"],
                ] as [TabKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={tab === key ? "on" : ""}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </section>

            {/* Stats */}
            <section className="co-stats">
              {stats.map((s) => (
                <div className="co-stat" key={s.label}>
                  <div className={`co-stat-icon ${s.tone}`}>{s.icon}</div>
                  <div>
                    <p className="co-stat-label">{s.label}</p>
                    <p className="co-stat-value">{s.value}</p>
                    <p className="co-stat-sub">
                      <ArrowUp size={11} /> {s.sub}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Main card */}
            <section className="co-card">
              {tab !== "courses" ? (
                <div className="co-placeholder">
                  <FolderOpen size={40} strokeWidth={1.4} />
                  <p>
                    {tab === "subjects" && "Subjects"}
                    {tab === "chapters" && "Chapters"}
                    {tab === "materials" && "Learning Materials"}
                  </p>
                  <span>This section will be available soon.</span>
                </div>
              ) : (
                <>
                  <div className="co-card-head">
                    <div className="co-card-head-icon">
                      <FileText size={18} />
                    </div>
                    <div className="co-card-head-text">
                      <h2>My Courses</h2>
                      <p>Manage your created courses and track their progress.</p>
                    </div>

                    <div className="co-search">
                      <Search size={14} />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="co-select">
                      <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                        <option value="all">All Subjects</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <div className="co-select">
                      <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                        <option value="all">All Classes</option>
                        {CLASSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <div className="co-toggle">
                      <button
                        type="button"
                        className={view === "grid" ? "on" : ""}
                        onClick={() => setView("grid")}
                        aria-label="Grid view"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button
                        type="button"
                        className={view === "list" ? "on" : ""}
                        onClick={() => setView("list")}
                        aria-label="List view"
                      >
                        <List size={14} />
                      </button>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="co-placeholder">
                      <FolderOpen size={40} strokeWidth={1.4} />
                      <p>No courses found</p>
                      <span>Try changing your search or filters.</span>
                    </div>
                  ) : (
                    <div className={view === "grid" ? "co-grid" : "co-list"}>
                      {filtered.map((c) => (
                        <article className={`co-course ${view}`} key={c.id}>
                          <div className={`co-thumb ${c.theme}`}>
                            <div className="co-thumb-art">{THEMES[c.theme].icon}</div>
                            <span className={`co-badge ${c.status.toLowerCase()}`}>
                              {c.status === "Published" && <i />}
                              {c.status}
                            </span>
                          </div>

                          <div className="co-course-body">
                            <h3>{c.title}</h3>
                            <p className="co-course-sub">
                              {c.subject} <b>•</b> {c.className}
                            </p>

                            <div className="co-meta">
                              <span>
                                <FileText size={13} /> {c.chapters} Chapters
                              </span>
                              <span>
                                <Layers size={13} /> {c.materials} Materials
                              </span>
                              <span>
                                <Users size={13} /> {c.students} Students
                              </span>
                            </div>

                            <p className="co-progress-label">
                              <b>{c.progress}%</b> Complete
                            </p>
                            <div className="co-progress">
                              <span style={{ width: `${c.progress}%` }} />
                            </div>

                            {actionButtons(c)}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ===== Right column ===== */}
          <aside className="co-right">
            <section className="co-side-card">
              <h3 className="co-side-title">
                <FileText size={16} /> Quick Actions
              </h3>
              <div className="co-quick">
                {quickActions.map((a) => (
                  <button type="button" key={a.key} onClick={() => onQuickAction(a.key)}>
                    <span className="co-quick-icon">{a.icon}</span>
                    <span>
                      <b>{a.title}</b>
                      <small>{a.sub}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="co-side-card">
              <div className="co-side-head">
                <h3 className="co-side-title">
                  <Layers size={16} /> Recent Activity
                </h3>
                <button type="button" className="co-link">
                  View All <ArrowRight size={11} />
                </button>
              </div>
              <ul className="co-activity">
                {recentActivity.map((a) => (
                  <li key={a.title}>
                    <span className={`co-act-icon ${a.tone}`}>{a.icon}</span>
                    <div>
                      <p className="co-act-title">{a.title}</p>
                      <p className="co-act-sub">{a.sub}</p>
                      <p className="co-act-time">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="co-help">
              <div className="co-help-top">
                <span className="co-help-icon">
                  <FileText size={22} />
                </span>
                <div>
                  <h4>Need Help?</h4>
                  <p>Learn how to manage courses, subjects and materials with our quick guide.</p>
                </div>
              </div>
              <button type="button" className="co-guide">
                View Guide <ArrowRight size={14} />
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* ===== Create course modal ===== */}
      {showModal && (
        <div className="co-overlay" onClick={() => setShowModal(false)}>
          <form className="co-modal" onClick={(e) => e.stopPropagation()} onSubmit={submitCourse}>
            <div className="co-modal-head">
              <h3>Create Course</h3>
              <button type="button" onClick={() => setShowModal(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <label>Course Title</label>
            <input
              type="text"
              placeholder="e.g. Data Structures & Algorithms"
              value={fTitle}
              onChange={(e) => setFTitle(e.target.value)}
              autoFocus
            />

            <div className="co-modal-row">
              <div>
                <label>Subject</label>
                <select value={fSubject} onChange={(e) => setFSubject(e.target.value)}>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Class</label>
                <select value={fClass} onChange={(e) => setFClass(e.target.value)}>
                  {CLASSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <label>Cover Style</label>
            <div className="co-themes">
              {THEME_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t.key}
                  className={`co-theme-pick ${t.key} ${fTheme === t.key ? "on" : ""}`}
                  onClick={() => setFTheme(t.key)}
                >
                  {fTheme === t.key && <Check size={12} />}
                  {t.label}
                </button>
              ))}
            </div>

            <div className="co-modal-foot">
              <button type="button" className="co-btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="co-btn-primary" disabled={!fTitle.trim()}>
                Create Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Course;