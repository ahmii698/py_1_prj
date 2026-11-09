import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  FolderOpen,
  Upload,
  FileText,
  Brain,
  HardDrive,
  Search,
  LayoutGrid,
  List,
  Eye,
  Download,
  Move,
  Filter,
  Activity,
  Calendar,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  Layers,
  Database,
  Globe,
  Code2,
  Network,
  Cpu,
  Terminal,
  Sparkles,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./MyDocuments.css";

type Subject =
  | "Computer Science"
  | "Web Development"
  | "AI & Data Science"
  | "Database"
  | "Others";

type Status = "Processed" | "Processing" | "Failed";

interface Doc {
  id: number;
  title: string;
  subject: Subject;
  pages: number; // 0 = abhi pata nahi
  date: string; // YYYY-MM-DD
  status: Status;
  sizeMB?: number; // sirf upload hui files ke liye
  url?: string; // upload hui file ka local link (view/download ke liye)
  cover: { a: string; b: string; lines: string[]; icon: ReactNode };
}

const ICON = 30;
const MAX_SIZE_MB = 20;
const BASE_STORAGE_MB = 24;
const STORAGE_LIMIT_MB = 100;

const initialDocs: Doc[] = [
  {
    id: 1,
    title: "Python Programming",
    subject: "Computer Science",
    pages: 48,
    date: "2025-05-20",
    status: "Processed",
    cover: { a: "#1b1f3b", b: "#0d1024", lines: ["Python"], icon: <Terminal size={ICON} color="#ffd43b" /> },
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    pages: 32,
    date: "2025-05-18",
    status: "Processed",
    cover: { a: "#1c2447", b: "#0b1030", lines: ["Data Structures", "& Algorithms"], icon: <Network size={ICON} color="#5eead4" /> },
  },
  {
    id: 3,
    title: "Web Development",
    subject: "Web Development",
    pages: 86,
    date: "2025-05-16",
    status: "Processing",
    cover: { a: "#1d2a5a", b: "#0b1233", lines: ["Web", "Development"], icon: <Globe size={ICON} color="#fb923c" /> },
  },
  {
    id: 4,
    title: "Database Systems",
    subject: "Computer Science",
    pages: 54,
    date: "2025-05-12",
    status: "Processed",
    cover: { a: "#13294b", b: "#07142b", lines: ["Database", "Systems"], icon: <Database size={ICON} color="#38bdf8" /> },
  },
  {
    id: 5,
    title: "Computer Networks",
    subject: "Computer Science",
    pages: 67,
    date: "2025-05-10",
    status: "Processed",
    cover: { a: "#0f2a3d", b: "#06131f", lines: ["Computer", "Networks"], icon: <Network size={ICON} color="#22d3ee" /> },
  },
  {
    id: 6,
    title: "Operating Systems",
    subject: "Computer Science",
    pages: 42,
    date: "2025-05-08",
    status: "Processed",
    cover: { a: "#1a2340", b: "#0a0f22", lines: ["Operating", "Systems"], icon: <Cpu size={ICON} color="#e2e8f0" /> },
  },
  {
    id: 7,
    title: "Machine Learning",
    subject: "AI & Data Science",
    pages: 73,
    date: "2025-05-05",
    status: "Processed",
    cover: { a: "#25164d", b: "#0e0a29", lines: ["Machine", "Learning"], icon: <Brain size={ICON} color="#a78bfa" /> },
  },
  {
    id: 8,
    title: "JavaScript Essentials",
    subject: "Web Development",
    pages: 38,
    date: "2025-05-02",
    status: "Processed",
    cover: { a: "#2b2410", b: "#12100a", lines: ["JavaScript", "Essentials"], icon: <Code2 size={ICON} color="#facc15" /> },
  },
];

const subjects: Subject[] = [
  "Computer Science",
  "Web Development",
  "AI & Data Science",
  "Database",
  "Others",
];

const statuses: Status[] = ["Processed", "Processing", "Failed"];

const statusDot: Record<Status, string> = {
  Processed: "#34c77b",
  Processing: "#ffab40",
  Failed: "#ff5d6c",
};

const subjectTone: Record<Subject, string> = {
  "Computer Science": "t-purple",
  "Web Development": "t-blue",
  "AI & Data Science": "t-pink",
  Database: "t-teal",
  Others: "t-gray",
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function MyDocuments() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("All Subjects");
  const [status, setStatus] = useState<string>("All Status");
  const [sort, setSort] = useState<string>("Newest First");
  const [range, setRange] = useState<string>("Last 30 Days");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<number[]>([]);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (type: "ok" | "error", text: string) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  // Upload PDF button click -> file picker khulega
  const openPicker = () => fileInputRef.current?.click();

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // taake same file dobara bhi select ho sake
    if (files.length === 0) return;

    const added: Doc[] = [];
    const errors: string[] = [];

    files.forEach((file, i) => {
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        errors.push(`"${file.name}" PDF nahi hai`);
        return;
      }
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        errors.push(`"${file.name}" ${MAX_SIZE_MB} MB se bari hai`);
        return;
      }

      const title = file.name.replace(/\.pdf$/i, "");
      added.push({
        id: Date.now() + i,
        title,
        subject: "Others",
        pages: 0,
        date: new Date().toISOString().slice(0, 10),
        status: "Processing",
        sizeMB,
        url: URL.createObjectURL(file),
        cover: {
          a: "#1b1f3b",
          b: "#0d1024",
          lines: [title.length > 16 ? title.slice(0, 16) + "…" : title],
          icon: <FileText size={ICON} color="#a78bfa" />,
        },
      });
    });

    if (added.length > 0) {
      setDocs((prev) => [...added, ...prev]);

      // Abhi mock hai: 2 second baad "Processed" ho jayega.
      // Backend ready hone par yahan asli upload API call aayegi.
      window.setTimeout(() => {
        const ids = added.map((a) => a.id);
        setDocs((prev) =>
          prev.map((d) => (ids.includes(d.id) ? { ...d, status: "Processed" } : d))
        );
      }, 2000);
    }

    if (errors.length > 0) {
      showNotice("error", errors.join(", "));
    } else if (added.length > 0) {
      showNotice(
        "ok",
        added.length === 1
          ? `"${added[0].title}" upload ho gayi.`
          : `${added.length} PDFs upload ho gayi.`
      );
    }
  };

  const viewDoc = (d: Doc) => {
    if (d.url) window.open(d.url, "_blank");
    else showNotice("error", "Yeh sample document hai, iski file maujood nahi.");
  };

  const downloadDoc = (d: Doc) => {
    if (!d.url) {
      showNotice("error", "Yeh sample document hai, iski file maujood nahi.");
      return;
    }
    const a = document.createElement("a");
    a.href = d.url;
    a.download = `${d.title}.pdf`;
    a.click();
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) &&
        (subject === "All Subjects" || d.subject === subject) &&
        (status === "All Status" || d.status === status)
    );
    return [...list].sort((a, b) => {
      if (sort === "Oldest First") return a.date.localeCompare(b.date);
      if (sort === "Name (A-Z)") return a.title.localeCompare(b.title);
      return b.date.localeCompare(a.date);
    });
  }, [docs, query, subject, status, sort]);

  const toggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearFilters = () => {
    setQuery("");
    setSubject("All Subjects");
    setStatus("All Status");
    setSort("Newest First");
    setRange("Last 30 Days");
  };

  const subjectCount = (s: Subject) => docs.filter((d) => d.subject === s).length;
  const statusCount = (s: Status) => docs.filter((d) => d.status === s).length;

  const totalPages = docs.reduce((sum, d) => sum + d.pages, 0);
  const uploadedMB = docs.reduce((sum, d) => sum + (d.sizeMB ?? 0), 0);
  const storageUsed = Math.round(BASE_STORAGE_MB + uploadedMB);

  // Sab se naye 3 documents
  const recent = [...docs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="md-layout">
      <Sidebar />

      <div className="md-main">
        <Header />

        <div className="md-content">
          {/* ============ CENTER ============ */}
          <div className="md-center">
            {/* Title row */}
            <div className="md-title-row">
              <div className="md-title">
                <span className="folder">
                  <FolderOpen size={26} />
                </span>
                <div>
                  <h1>My Documents / PDF Library</h1>
                  <p>
                    Manage your uploaded PDFs, generate quizzes and track your
                    learning materials.
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handleFiles}
                style={{ display: "none" }}
              />
              <button type="button" className="md-upload-btn" onClick={openPicker}>
                <Upload size={15} /> Upload PDF
              </button>
            </div>

            {/* Upload message */}
            {notice && (
              <div
                className="md-tip"
                style={
                  notice.type === "error"
                    ? { background: "#ffe6e9", color: "#ef4458" }
                    : undefined
                }
              >
                <strong>{notice.type === "error" ? "Error:" : "Done:"}</strong>
                <span>{notice.text}</span>
              </div>
            )}

            {/* Stats */}
            <div className="md-stats">
              <div className="md-stat">
                <div className="top">
                  <span className="ic"><FileText size={16} /></span>
                  <span>Total Documents</span>
                </div>
                <p className="val">{docs.length}</p>
                <p className="delta">↑ 2 this week</p>
              </div>

              <div className="md-stat">
                <div className="top">
                  <span className="ic"><Brain size={16} /></span>
                  <span>Quizzes Generated</span>
                </div>
                <p className="val">5</p>
                <p className="delta">↑ +3 this week</p>
              </div>

              <div className="md-stat">
                <div className="top">
                  <span className="ic"><Layers size={16} /></span>
                  <span>Total Pages</span>
                </div>
                <p className="val">{totalPages.toLocaleString()}</p>
                <p className="delta">↑ +342 this week</p>
              </div>

              <div className="md-stat">
                <div className="top">
                  <span className="ic"><HardDrive size={16} /></span>
                  <span>Storage Used</span>
                </div>
                <p className="val">{storageUsed} MB</p>
                <p className="muted">of {STORAGE_LIMIT_MB} MB</p>
              </div>

              <div className="md-promo">
                <span className="spark"><Sparkles size={26} /></span>
                <p>Turn your PDFs into smart quizzes!</p>
                <small>Upload → Generate → Learn →</small>
              </div>
            </div>

            {/* Toolbar */}
            <div className="md-toolbar">
              <div className="md-search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search your documents..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option>All Subjects</option>
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>All Status</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Name (A-Z)</option>
              </select>

              <div className="md-view-toggle">
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

            {/* Grid */}
            {visible.length === 0 ? (
              <div className="md-empty">
                <FileText size={34} />
                <p>No documents found. Try changing your filters.</p>
              </div>
            ) : (
              <div className={`md-grid ${view}`}>
                {visible.map((d) => (
                  <article className="md-card" key={d.id}>
                    <div className="md-card-top">
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        aria-label={`Select ${d.title}`}
                      />
                      <span className={`md-status s-${d.status.toLowerCase()}`}>
                        {d.status}
                      </span>
                    </div>

                    <div
                      className="md-cover"
                      style={{
                        background: `linear-gradient(160deg, ${d.cover.a}, ${d.cover.b})`,
                      }}
                    >
                      <span className="lines">
                        {d.cover.lines.map((l) => (
                          <span key={l}>{l}</span>
                        ))}
                      </span>
                      {d.cover.icon}
                    </div>

                    <div className="md-card-body">
                      <h4>{d.title}</h4>
                      <span className={`md-chip ${subjectTone[d.subject]}`}>
                        {d.subject}
                      </span>
                      <div className="md-meta">
                        <span>
                          <FileText size={11} /> {d.pages > 0 ? `${d.pages} pages` : "— pages"}
                        </span>
                        <span><Calendar size={11} /> {formatDate(d.date)}</span>
                      </div>
                    </div>

                    <div className="md-actions">
                      <button type="button" className="md-primary">
                        {d.status === "Processing" ? "View Details" : "Generate Quiz"}
                      </button>
                      <button
                        type="button"
                        className="md-icon-btn"
                        aria-label="View"
                        onClick={() => viewDoc(d)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="md-icon-btn"
                        aria-label="Download"
                        onClick={() => downloadDoc(d)}
                      >
                        <Download size={14} />
                      </button>
                      <button type="button" className="md-icon-btn" aria-label="Move">
                        <Move size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pro tip */}
            <div className="md-tip">
              <Lightbulb size={16} />
              <strong>Pro Tip:</strong>
              <span>
                Use specific keywords while searching (e.g. "arrays", "OOP",
                "database") to find your documents quickly.
              </span>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="md-right">
            <section className="md-panel">
              <h3 className="md-panel-title">
                <Filter size={14} /> Filters
              </h3>

              <p className="md-group">
                <Filter size={12} /> Subject
              </p>
              <ul className="md-filter-list">
                <li>
                  <button
                    type="button"
                    className={subject === "All Subjects" ? "on" : ""}
                    onClick={() => setSubject("All Subjects")}
                  >
                    <FileText size={12} />
                    <span>All Subjects</span>
                  </button>
                </li>
                {subjects.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className={subject === s ? "on" : ""}
                      onClick={() => setSubject(s)}
                    >
                      <FileText size={12} />
                      <span>{s}</span>
                      <em>({subjectCount(s)})</em>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="md-group">
                <Activity size={12} /> Status
              </p>
              <ul className="md-filter-list">
                <li>
                  <button
                    type="button"
                    className={status === "All Status" ? "on" : ""}
                    onClick={() => setStatus("All Status")}
                  >
                    <FileText size={12} />
                    <span>All Status</span>
                  </button>
                </li>
                {statuses.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className={status === s ? "on" : ""}
                      onClick={() => setStatus(s)}
                    >
                      <i className="dot" style={{ background: statusDot[s] }} />
                      <span>{s}</span>
                      <em>({statusCount(s)})</em>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="md-group">
                <Calendar size={12} /> Date Range
              </p>
              <select
                className="md-range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>

              <button type="button" className="md-clear" onClick={clearFilters}>
                Clear Filters <RefreshCw size={11} />
              </button>
            </section>

            <section className="md-panel">
              <h3 className="md-panel-title plain">Recent Uploads</h3>
              <ul className="md-recent">
                {recent.map((r) => (
                  <li key={r.id}>
                    <span
                      className="thumb"
                      style={{
                        background: `linear-gradient(160deg, ${r.cover.a}, ${r.cover.b})`,
                      }}
                    />
                    <div className="info">
                      <p>{r.title}</p>
                      <small>{formatDate(r.date)}</small>
                    </div>
                    <span className={`md-status s-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
              <a className="md-view-all" href="#all">
                View All Documents <ArrowRight size={11} />
              </a>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default MyDocuments;