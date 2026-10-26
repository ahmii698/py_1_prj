import { useState } from "react";
import {
  Users, GraduationCap, UserCheck, BookOpen, ClipboardList, HelpCircle, Bot,
  BarChart3, FileText, ChevronDown, ChevronRight, Download, Calendar, Layers,
  Brain, Activity, DollarSign, Server, Filter, School, FileCheck2, Upload,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./reports.css";

/* ---------- Data ---------- */
const stats = [
  { icon: Users, label: "Total Users", value: "3,482", change: "12%", color: "blue" },
  { icon: School, label: "Total Classes", value: "42", change: "9%", color: "purple" },
  { icon: ClipboardList, label: "Total Quizzes", value: "356", change: "18%", color: "violet" },
  { icon: FileCheck2, label: "Total Reports Generated", value: "24", change: "33%", color: "pink" },
  { icon: Upload, label: "Data Exports", value: "18", change: "50%", color: "indigo" },
];

const exportList = [
  { icon: Users, title: "User Report", sub: "All users, students, teachers, admins", color: "purple" },
  { icon: School, title: "Class Report", sub: "Classes, subjects, teacher assignments", color: "blue" },
  { icon: UserCheck, title: "Enrollment Report", sub: "Student enrollment details", color: "green" },
  { icon: ClipboardList, title: "Quiz Report", sub: "Quiz statistics and performance", color: "orange" },
  { icon: BookOpen, title: "Academic Report", sub: "Course progress and completion", color: "red" },
  { icon: Bot, title: "AI Usage Report", sub: "AI requests, success/failure rate", color: "teal" },
  { icon: Activity, title: "Activity Log Report", sub: "Recent activities and system logs", color: "pink" },
];

const topCourses = [
  { n: 1, name: "Computer Science", students: 542, growth: 18 },
  { n: 2, name: "Mathematics", students: 438, growth: 14 },
  { n: 3, name: "Physics", students: 321, growth: 12 },
  { n: 4, name: "English Literature", students: 289, growth: 10 },
  { n: 5, name: "Chemistry", students: 247, growth: 8 },
];

const recent = [
  { icon: Users, title: "New student registered", sub: "Ayesha Khan (BSCS Semester 1)", time: "2 mins ago", color: "blue" },
  { icon: HelpCircle, title: "Quiz generated", sub: "Mathematics • Chapter 3", time: "5 mins ago", color: "orange" },
  { icon: UserCheck, title: "Teacher registered", sub: "Bilal Ahmed", time: "12 mins ago", color: "blue" },
  { icon: FileText, title: "PDF processed", sub: "Physics Notes.pdf", time: "18 mins ago", color: "blue" },
  { icon: School, title: "Class created", sub: "BSCS Semester 3", time: "25 mins ago", color: "blue" },
];

const reportTypes = [
  { icon: Users, title: "User Reports", sub: "User growth, roles, activity", color: "purple" },
  { icon: GraduationCap, title: "Academic Reports", sub: "Course & class performance", color: "blue" },
  { icon: Brain, title: "AI Reports", sub: "Usage, errors, performance", color: "green" },
  { icon: DollarSign, title: "Financial Reports", sub: "(Future feature)", color: "orange" },
  { icon: Server, title: "System Reports", sub: "Logs, health, uptime", color: "pink" },
];

const dates = ["May 16", "May 19", "May 22", "May 25", "May 28", "May 31", "Jun 3", "Jun 6", "Jun 9", "Jun 12", "Jun 15"];
const series = [
  { name: "Students", color: "#8b5cf6", data: [68, 72, 100, 92, 100, 112, 108, 112, 130, 150, 165] },
  { name: "Teachers", color: "#3b82f6", data: [40, 45, 60, 55, 62, 72, 68, 76, 90, 100, 130] },
  { name: "Classes", color: "#10b981", data: [22, 26, 38, 35, 40, 48, 42, 52, 60, 68, 82] },
  { name: "Quizzes", color: "#f59e0b", data: [12, 18, 28, 24, 30, 36, 32, 40, 46, 50, 58] },
];

/* ---------- Charts ---------- */
const LineChart = () => {
  const W = 640, H = 170, L = 34, B = 24, T = 8;
  const max = 300;
  const x = (i: number) => L + (i * (W - L - 8)) / (dates.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rp-line-svg" preserveAspectRatio="none">
      {[0, 50, 100, 250].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - 8} y1={y(g)} y2={y(g)} className="rp-grid" />
          <text x={L - 6} y={y(g) + 3} textAnchor="end" className="rp-axis">{g}</text>
        </g>
      ))}
      {series.map((s) => {
        const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
        return (
          <g key={s.name}>
            <polygon points={`${L},${y(0)} ${pts} ${x(s.data.length - 1)},${y(0)}`} fill={s.color} opacity="0.08" />
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" />
            {s.data.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill="#fff" stroke={s.color} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
      {dates.map((d, i) => (
        <text key={d} x={x(i)} y={H - 6} textAnchor="middle" className="rp-axis">{d}</text>
      ))}
    </svg>
  );
};

const Donut = () => {
  const parts = [
    { v: 35.8, c: "#8b5cf6" },
    { v: 2.5, c: "#3b82f6" },
    { v: 0.1, c: "#a16207" },
    { v: 32.9, c: "#f5b83d" },
    { v: 28.7, c: "#14b8a6" },
  ];
  const r = 62, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" className="rp-donut">
      {parts.map((p, i) => {
        const len = (p.v / 100) * C;
        const el = (
          <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={p.c} strokeWidth="18"
            strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 80 80)" />
        );
        offset += len;
        return el;
      })}
      <text x="80" y="78" textAnchor="middle" className="rp-donut-num">3,482</text>
      <text x="80" y="95" textAnchor="middle" className="rp-donut-sub">Total Users</text>
    </svg>
  );
};

/* ---------- Page ---------- */
const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [range, setRange] = useState("Last 30 Days");
  const [format, setFormat] = useState("PDF");

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="rp-layout">
          <div className="rp-body">
            {/* Left content */}
            <div className="rp-content">
              <section className="rp-hero">
                <div className="rp-hero-icon"><BarChart3 size={26} color="#fff" /></div>
                <div className="rp-hero-text">
                  <h1>Reports &amp; Export</h1>
                  <p>View platform reports, analyse performance and export data for better decision making.</p>
                </div>
                <div className="rp-date-pick">
                  <Calendar size={14} />
                  <span>Last 30 Days</span>
                  <ChevronDown size={14} />
                </div>
              </section>

              <section className="rp-stats">
                {stats.map((s) => (
                  <div key={s.label} className="rp-stat">
                    <div className={`rp-ico ${s.color}`}><s.icon size={20} /></div>
                    <div>
                      <p>{s.label}</p>
                      <h3>{s.value}</h3>
                      <small className="up">↑ {s.change}</small>
                      <small className="muted"> vs. last 30 days</small>
                    </div>
                  </div>
                ))}
              </section>

              <section className="rp-row-2">
                <div className="rp-card rp-overview">
                  <div className="rp-card-head">
                    <div>
                      <h3>Platform Overview</h3>
                      <p>Key metrics and trends for the last 30 days.</p>
                    </div>
                    <div className="rp-legend">
                      {series.map((s) => (
                        <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>
                      ))}
                    </div>
                  </div>
                  <LineChart />
                </div>

                <div className="rp-card rp-dist">
                  <h3>User Distribution</h3>
                  <div className="rp-dist-body">
                    <Donut />
                    <ul>
                      <li><i style={{ background: "#8b5cf6" }} /><div><b>Students</b><span>1,248 (35.8%)</span></div></li>
                      <li><i style={{ background: "#3b82f6" }} /><div><b>Teachers</b><span>86 (2.5%)</span></div></li>
                      <li><i style={{ background: "#a16207" }} /><div><b>Admins</b><span>3 (0.1%)</span></div></li>
                      <li><i style={{ background: "#9ca3af" }} /><div><b>Others</b><span>1,145 (32.9%)</span></div></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rp-row-3">
                <div className="rp-card">
                  <div className="rp-card-head">
                    <h3>Top Courses / Subjects</h3>
                    <a className="rp-link">View All →</a>
                  </div>
                  <table className="rp-table">
                    <thead>
                      <tr><th>#</th><th>Course / Subject</th><th>Enrolled Students</th><th>Growth</th></tr>
                    </thead>
                    <tbody>
                      {topCourses.map((c) => (
                        <tr key={c.n}>
                          <td>{c.n}</td>
                          <td>{c.name}</td>
                          <td>{c.students}</td>
                          <td><span className="rp-growth">↑ {c.growth}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rp-card">
                  <div className="rp-card-head">
                    <h3>AI Usage Statistics</h3>
                    <a className="rp-link">View Details →</a>
                  </div>
                  <div className="rp-ai-grid">
                    <div><p>Total Requests</p><h2>1,248</h2><small className="up">↑ 22%</small></div>
                    <div><p>Success Rate</p><h2>96.2%</h2><small className="up">↑ 3%</small></div>
                    <div><p>Failed Requests</p><h2>39</h2><small className="down">↓ 6%</small></div>
                    <div><p>Avg. Response Time</p><h2>4.2s</h2><small className="up">↓ 18%</small></div>
                  </div>
                </div>

                <div className="rp-card">
                  <div className="rp-card-head">
                    <h3>Recent Activity</h3>
                    <a className="rp-link">View All →</a>
                  </div>
                  <ul className="rp-activity">
                    {recent.map((a) => (
                      <li key={a.title}>
                        <div className={`rp-ico sm ${a.color}`}><a.icon size={15} /></div>
                        <div className="rp-act-text">
                          <b>{a.title}</b>
                          <span>{a.sub}</span>
                        </div>
                        <small>{a.time}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="rp-card rp-types">
                <h4>Report Types</h4>
                <div className="rp-types-grid">
                  {reportTypes.map((t) => (
                    <div key={t.title} className="rp-type">
                      <div className={`rp-ico sm ${t.color}`}><t.icon size={16} /></div>
                      <b>{t.title}</b>
                      <span>{t.sub}</span>
                      <button className={`rp-view ${t.color}`}>View Report →</button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right panel */}
            <aside className="rp-right">
              <div className="rp-card">
                <div className="rp-export-head">
                  <Download size={16} />
                  <div>
                    <h3>Export Data</h3>
                    <p>Download reports in your preferred format.</p>
                  </div>
                </div>
                <ul className="rp-export-list">
                  {exportList.map((e) => (
                    <li key={e.title}>
                      <div className={`rp-ico sm ${e.color}`}><e.icon size={16} /></div>
                      <div>
                        <b>{e.title}</b>
                        <span>{e.sub}</span>
                      </div>
                      <ChevronRight size={15} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rp-card rp-custom">
                <div className="rp-export-head">
                  <Filter size={16} />
                  <div>
                    <h3>Custom Export</h3>
                    <p>Generate a custom report with your selected filters.</p>
                  </div>
                </div>

                <label>Report Type</label>
                <div className="rp-select">
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="">Select report type</option>
                    <option>User Report</option>
                    <option>Class Report</option>
                    <option>Enrollment Report</option>
                    <option>Quiz Report</option>
                    <option>Academic Report</option>
                    <option>AI Usage Report</option>
                    <option>Activity Log Report</option>
                  </select>
                  <ChevronDown size={14} />
                </div>

                <label>Date Range</label>
                <div className="rp-select">
                  <select value={range} onChange={(e) => setRange(e.target.value)}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>This Year</option>
                  </select>
                  <ChevronDown size={14} />
                </div>

                <label>Format</label>
                <div className="rp-select">
                  <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                  <ChevronDown size={14} />
                </div>

                <button className="rp-generate" disabled={!reportType}>
                  <Download size={15} /> Generate Report
                </button>
              </div>

              <div className="rp-help">
                <div className="rp-help-ico"><Layers size={14} color="#fff" /></div>
                <div>
                  <b>Need a Custom Report?</b>
                  <p>Contact your system administrator for advanced reporting and data analysis.</p>
                  <button>Contact Admin</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;