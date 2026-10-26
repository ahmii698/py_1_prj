import { useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  FileSpreadsheet,
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  CalendarDays,
  GraduationCap,
  BarChart3,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./report.css";

/* ---------------- Types & data ---------------- */

type Status = "Excellent" | "Good" | "Average" | "Needs Help";

interface StudentRow {
  name: string;
  avg: number;
  quizzes: number;
  assignments: number;
}

const topFive: StudentRow[] = [
  { name: "Sara Ahmed", avg: 98, quizzes: 5, assignments: 4 },
  { name: "Usman Khalid", avg: 96, quizzes: 5, assignments: 4 },
  { name: "Fatima Zahra", avg: 94, quizzes: 5, assignments: 4 },
  { name: "Ahmed Khan", avg: 92, quizzes: 5, assignments: 3 },
  { name: "Ayesha Noor", avg: 90, quizzes: 4, assignments: 3 },
];

const otherNames = [
  "Taha Qureshi", "Zainab Malik", "Daniyal Shah", "Hamza Ali", "Maryam Siddiqui",
  "Bilal Raza", "Hira Tariq", "Omar Farooq", "Sana Javed", "Zain Abbas",
  "Iqra Noman", "Fahad Mirza", "Areeba Khan", "Danish Qadir", "Nimra Aslam",
  "Kamran Yousuf", "Laiba Hussain", "Rehan Saeed", "Mahnoor Zia", "Hassan Raza",
  "Komal Shah", "Junaid Iqbal", "Saad Mehmood", "Anam Fatima", "Waqas Ahmed",
  "Rabia Basri", "Talha Hussain",
];

const otherRows: StudentRow[] = otherNames.map((name, i) => {
  const avg = Math.round(89 - i * 1.8);
  return {
    name,
    avg,
    quizzes: avg >= 90 ? 5 : avg >= 75 ? 4 : avg >= 60 ? 3 : 2,
    assignments: avg >= 88 ? 4 : avg >= 70 ? 3 : avg >= 55 ? 2 : 1,
  };
});

const students: StudentRow[] = [...topFive, ...otherRows];

const PAGE_SIZE = 5;

const statusFor = (avg: number): Status =>
  avg >= 95 ? "Excellent" : avg >= 85 ? "Good" : avg >= 70 ? "Average" : "Needs Help";

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

const topStats: {
  label: string;
  value: string;
  delta: string;
  dir: "up" | "down" | "plus";
  icon: ReactNode;
  tone: string;
}[] = [
  { label: "Total Students", value: "124", delta: "12% from last month", dir: "up", icon: <Users size={20} />, tone: "purple" },
  { label: "Total Quizzes", value: "24", delta: "8% from last month", dir: "up", icon: <ClipboardList size={20} />, tone: "violet" },
  { label: "Class Average", value: "76%", delta: "6% from last month", dir: "up", icon: <TrendingUp size={20} />, tone: "green" },
  { label: "Completion Rate", value: "92%", delta: "7% from last month", dir: "up", icon: <CheckCircle2 size={20} />, tone: "purple" },
  { label: "Pending Submissions", value: "8", delta: "3% from last month", dir: "down", icon: <Clock size={20} />, tone: "violet" },
  { label: "Available Reports", value: "7", delta: "2 new this month", dir: "plus", icon: <FileText size={20} />, tone: "purple" },
];

const templates: { id: string; desc: string; icon: ReactNode; tone: string }[] = [
  { id: "Student Performance", desc: "Individual student progress and performance details", icon: <GraduationCap size={20} />, tone: "purple" },
  { id: "Class Performance", desc: "Overall class statistics and comparison", icon: <BarChart3 size={20} />, tone: "blue" },
  { id: "Quiz Results", desc: "Quiz-wise marks and question analysis", icon: <CheckCircle2 size={20} />, tone: "green" },
  { id: "Subject Analysis", desc: "Subject and topic-wise performance", icon: <BookOpen size={20} />, tone: "red" },
  { id: "Assignment Report", desc: "Submission status and marks", icon: <ClipboardList size={20} />, tone: "orange" },
  { id: "AI Insights Report", desc: "Learning gaps and recommendations", icon: <Sparkles size={20} />, tone: "violet" },
];

const classOptions = ["BSCS - Semester 3", "BSCS - Semester 5", "BSSE - Semester 3"];
const subjectOptions = ["Data Structures", "C Programming", "Algorithms", "Database Systems", "Web Development"];

const rangeText: Record<string, string> = {
  "Last 4 Weeks": "May 1, 2025 - May 31, 2025",
  "Last 7 Days": "May 25, 2025 - May 31, 2025",
  "Last 3 Months": "Mar 1, 2025 - May 31, 2025",
  "This Semester": "Jan 15, 2025 - May 31, 2025",
};

const recentReports: { title: string; sub: string; type: string; format: "PDF" | "Excel" }[] = [
  { title: "Student Performance Report", sub: "BSCS - Semester 3 | May 1 - May 31, 2025", type: "Student Performance", format: "PDF" },
  { title: "Class Performance Report", sub: "BSCS - Semester 3 | Apr 1 - Apr 30, 2025", type: "Class Performance", format: "Excel" },
  { title: "Quiz Results Report", sub: "Data Structures Quiz 1 | May 10, 2025", type: "Quiz Results", format: "PDF" },
  { title: "Subject Analysis Report", sub: "All Subjects | May 1 - May 31, 2025", type: "Subject Analysis", format: "Excel" },
];

const templateFor = (id: string) => templates.find((t) => t.id === id) ?? templates[0];

/* ---------------- CSV export ---------------- */

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

function downloadCsv() {
  const header = ["#", "Student Name", "Avg. Score", "Quizzes Taken", "Assignments", "Status"];
  const lines = students.map((s, i) =>
    [i + 1, s.name, `${s.avg}%`, `${s.quizzes}/5`, `${s.assignments}/4`, statusFor(s.avg)].map(csvCell).join(",")
  );
  const csv = [header.map(csvCell).join(","), ...lines].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student-performance-report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- Page ---------------- */

interface Snapshot {
  type: string;
  cls: string;
  subject: string;
  range: string;
}

function Report() {
  const [reportType, setReportType] = useState("Student Performance");
  const [cls, setCls] = useState(classOptions[0]);
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [range, setRange] = useState("Last 4 Weeks");

  const [generated, setGenerated] = useState<Snapshot>({
    type: "Student Performance",
    cls: classOptions[0],
    subject: subjectOptions[0],
    range: "Last 4 Weeks",
  });
  const [generating, setGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerated({ type: reportType, cls, subject, range });
      setPage(1);
      setGenerating(false);
      showToast("Report generated successfully");
    }, 700);
  };

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const rows = students.slice(startIdx, startIdx + PAGE_SIZE);

  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(windowStart - 1, windowStart + 4);

  const highest = Math.max(...students.map((s) => s.avg));
  const lowest = Math.min(...students.map((s) => s.avg));

  const previewStats: { label: string; value: string; icon: ReactNode; tone: string }[] = [
    { label: "Total Students", value: String(students.length), icon: <Users size={17} />, tone: "purple" },
    { label: "Avg. Score", value: "76%", icon: <CheckCircle2 size={17} />, tone: "green" },
    { label: "Highest Score", value: `${highest}%`, icon: <TrendingUp size={17} />, tone: "red" },
    { label: "Lowest Score", value: `${lowest}%`, icon: <TrendingDown size={17} />, tone: "pink" },
    { label: "Pass Rate", value: "81%", icon: <Percent size={17} />, tone: "violet" },
  ];

  const genTemplate = templateFor(generated.type);

  return (
    <div className="rp-layout">
      <Sidebar />

      <div className="rp-main">
        <Header />

        <div className="rp-content">
          {/* ============ CENTER ============ */}
          <div className="rp-center">
            {/* Banner */}
            <section className="rp-banner">
              <span className="rp-banner-icon">
                <FileText size={26} />
              </span>
              <div>
                <h1>Reports &amp; Export</h1>
                <p>Generate detailed reports, track performance and export data in PDF or Excel format.</p>
              </div>
              <svg className="rp-banner-art" viewBox="0 0 190 90" xmlns="http://www.w3.org/2000/svg">
                <rect x="40" y="10" width="62" height="74" rx="6" fill="#ffffff" stroke="#d6ccff" />
                <rect x="50" y="22" width="30" height="5" rx="2.5" fill="#c9bfff" />
                <rect x="50" y="33" width="42" height="4" rx="2" fill="#e4dcff" />
                <rect x="50" y="42" width="36" height="4" rx="2" fill="#ede9fe" />
                <rect x="72" y="22" width="62" height="62" rx="6" fill="#f5f2ff" stroke="#d6ccff" />
                <circle cx="148" cy="66" r="18" fill="#7c5cfc" />
                <path d="M148 58 V73 M142 68 L148 74 L154 68" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </section>

            {/* Top stats */}
            <section className="rp-stats">
              {topStats.map((s) => (
                <div className="rp-stat" key={s.label}>
                  <span className={`ic tone-${s.tone}`}>{s.icon}</span>
                  <div>
                    <p className="lbl">{s.label}</p>
                    <p className="val">{s.value}</p>
                    <p className={`delta ${s.dir}`}>
                      {s.dir === "up" && <ArrowUp size={10} />}
                      {s.dir === "down" && <ArrowDown size={10} />}
                      {s.dir === "plus" && "+ "}
                      {s.delta}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Templates */}
            <section className="rp-card">
              <h3 className="rp-title">Report Templates</h3>
              <p className="rp-sub">Choose a report type to generate detailed insights and export data.</p>

              <div className="rp-templates">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`rp-template ${reportType === t.id ? "on" : ""}`}
                    onClick={() => setReportType(t.id)}
                  >
                    <span className={`ic tone-${t.tone}`}>{t.icon}</span>
                    <strong>{t.id}</strong>
                    <small>{t.desc}</small>
                  </button>
                ))}
              </div>
            </section>

            {/* Filter & generate */}
            <section className="rp-card">
              <h3 className="rp-title">Filter &amp; Generate Report</h3>
              <p className="rp-sub">Set your preferences to generate the report.</p>

              <div className="rp-filters">
                <label>
                  Class
                  <select value={cls} onChange={(e) => setCls(e.target.value)}>
                    {classOptions.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Subject
                  <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {subjectOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Report Type
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    {templates.map((t) => (
                      <option key={t.id}>{t.id}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Time Range
                  <span className="rp-range">
                    <select value={range} onChange={(e) => setRange(e.target.value)}>
                      {Object.keys(rangeText).map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <CalendarDays size={14} />
                  </span>
                </label>

                <button type="button" className="rp-generate" onClick={handleGenerate} disabled={generating}>
                  <FileText size={15} />
                  {generating ? "Generating..." : "Generate Report"}
                </button>
              </div>

              {/* Preview */}
              <div className="rp-preview">
                <div className="rp-preview-head">
                  <span className={`ic tone-${genTemplate.tone}`}>{genTemplate.icon}</span>
                  <div>
                    <h4>{generated.type} Report</h4>
                    <small>
                      {generated.cls} | {generated.subject} | {generated.range}
                    </small>
                  </div>
                  <em>{rangeText[generated.range]}</em>
                </div>

                <div className="rp-mini-stats">
                  {previewStats.map((p) => (
                    <div className="rp-mini" key={p.label}>
                      <span className={`ic tone-${p.tone}`}>{p.icon}</span>
                      <div>
                        <small>{p.label}</small>
                        <b>{p.value}</b>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rp-table-head">
                  <h5>Student Performance Overview</h5>
                  <a href="#details" className="rp-link">
                    View Details <ArrowRight size={11} />
                  </a>
                </div>

                <div className="rp-table-wrap">
                  <table className="rp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Avg. Score</th>
                        <th>Quizzes Taken</th>
                        <th>Assignments</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((s, i) => {
                        const status = statusFor(s.avg);
                        return (
                          <tr key={s.name}>
                            <td className="num">{startIdx + i + 1}</td>
                            <td>
                              <div className="rp-student">
                                <span
                                  className="avatar"
                                  style={{ background: avatarColors[(startIdx + i) % avatarColors.length] }}
                                >
                                  {initialsOf(s.name)}
                                </span>
                                {s.name}
                              </div>
                            </td>
                            <td className="bold">{s.avg}%</td>
                            <td>{s.quizzes}/5</td>
                            <td>{s.assignments}/4</td>
                            <td>
                              <span className="rp-progress">
                                <span style={{ width: `${s.avg}%` }} />
                              </span>
                            </td>
                            <td>
                              <span className={`rp-status ${statusClass[status]}`}>{status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="rp-foot">
                  <span>
                    Showing {startIdx + 1} to {Math.min(startIdx + PAGE_SIZE, students.length)} of {students.length}{" "}
                    students
                  </span>
                  <div className="rp-pager">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {visiblePages.map((n) => (
                      <button key={n} type="button" className={n === page ? "on" : ""} onClick={() => setPage(n)}>
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      aria-label="Next page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="rp-right">
            <section className="rp-card">
              <h3 className="rp-title with-icon">
                <Download size={15} /> Quick Export
              </h3>
              <p className="rp-sub">Download reports in your preferred format.</p>

              <ul className="rp-quick">
                <li>
                  <button type="button" onClick={() => showToast("PDF export will be connected with the backend")}>
                    <span className="ic tone-red">
                      <FileText size={20} />
                    </span>
                    <span className="tx">
                      <strong>Download PDF</strong>
                      <small>Complete report with charts and summary</small>
                    </span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => showToast("Excel export will be connected with the backend")}>
                    <span className="ic tone-green">
                      <FileSpreadsheet size={20} />
                    </span>
                    <span className="tx">
                      <strong>Export Excel (XLSX)</strong>
                      <small>Editable data with all details</small>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      downloadCsv();
                      showToast("CSV downloaded");
                    }}
                  >
                    <span className="ic tone-blue">
                      <FileText size={20} />
                    </span>
                    <span className="tx">
                      <strong>Export CSV</strong>
                      <small>Raw data for further analysis</small>
                    </span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => window.print()}>
                    <span className="ic tone-purple">
                      <Printer size={20} />
                    </span>
                    <span className="tx">
                      <strong>Print Report</strong>
                      <small>Directly print the report</small>
                    </span>
                  </button>
                </li>
              </ul>
            </section>

            <section className="rp-card">
              <div className="rp-card-head">
                <h3 className="rp-title with-icon">
                  <FileText size={15} /> Recent Reports
                </h3>
                <a className="rp-link" href="#all">
                  View All <ArrowRight size={11} />
                </a>
              </div>

              <ul className="rp-recent">
                {recentReports.map((r) => {
                  const t = templateFor(r.type);
                  return (
                    <li key={r.title}>
                      <span className={`ic tone-${t.tone}`}>{t.icon}</span>
                      <div className="info">
                        <strong>{r.title}</strong>
                        <small>{r.sub}</small>
                      </div>
                      <div className="side">
                        <span className={`rp-tag ${r.format === "PDF" ? "pdf" : "excel"}`}>{r.format}</span>
                        <button
                          type="button"
                          aria-label={`Download ${r.title}`}
                          onClick={() => showToast("Report download will be connected with the backend")}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rp-promo">
              <h4>Save time, get better insights.</h4>
              <p>Use our AI insights to identify learning gaps and improve your teaching strategy.</p>
              <button type="button">View AI Insights</button>
              <Sparkles size={44} className="art" />
            </section>
          </aside>
        </div>
      </div>

      {toast && <div className="rp-toast">{toast}</div>}
    </div>
  );
}

export default Report;