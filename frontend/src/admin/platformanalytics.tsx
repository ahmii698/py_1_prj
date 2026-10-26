import { useState } from "react";
import type { ComponentType } from "react";
import {
  Users, GraduationCap, User, BookOpen, FileText, ClipboardList, Sparkles,
  BarChart3, ShieldCheck, Database, ArrowUp, Brain, Lightbulb, TrendingUp,
  Server, Cpu, HardDrive, CheckCircle2, XCircle, Clock, UserPlus, Calendar,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./platformanalytics.css";

type IconType = ComponentType<{ size?: number }>;

const STATS: { label: string; value: string; icon: IconType; tone: string; trend: string }[] = [
  { label: "Total Users", value: "2,482", icon: Users, tone: "blue", trend: "12%" },
  { label: "Students", value: "1,248", icon: GraduationCap, tone: "blue", trend: "14%" },
  { label: "Teachers", value: "86", icon: User, tone: "blue", trend: "6%" },
  { label: "Total Classes", value: "42", icon: BookOpen, tone: "purple", trend: "9%" },
  { label: "Total Quizzes", value: "356", icon: ClipboardList, tone: "purple", trend: "18%" },
  { label: "AI Generations", value: "8,742", icon: Brain, tone: "purple", trend: "24%" },
];

const CHART_LABELS = ["May 16", "May 19", "May 22", "May 25", "May 28", "May 31", "Jun 3", "Jun 6", "Jun 9", "Jun 12", "Jun 15"];
const STUDENTS_DATA = [72, 88, 110, 102, 108, 124, 132, 128, 150, 168, 220];
const TEACHERS_DATA = [28, 42, 56, 54, 58, 66, 70, 68, 90, 112, 152];

const USAGE = [
  { label: "Students", value: 50.3, count: "1,248", color: "#8b5cf6" },
  { label: "Teachers", value: 3.5, count: "86", color: "#3b82f6" },
  { label: "Admins", value: 0.1, count: "3", color: "#10b981" },
  { label: "Others", value: 46.1, count: "1,145", color: "#9fb0dd" },
];

const SUBJECTS = [
  { name: "Mathematics", value: 26.8, color: "#8b5cf6" },
  { name: "Computer Science", value: 18.4, color: "#3b82f6" },
  { name: "Physics", value: 12.6, color: "#f59e0b" },
  { name: "English Literature", value: 9.7, color: "#a78bfa" },
  { name: "Chemistry", value: 8.9, color: "#10b981" },
  { name: "Others", value: 16.3, color: "#f87171" },
];

const ACTIVITY: { title: string; sub: string; time: string; icon: IconType; tone: string }[] = [
  { title: "New student registration", sub: "Ayesha Khan (BSCS Semester 1)", time: "2 mins ago", icon: UserPlus, tone: "blue" },
  { title: "Quiz generated", sub: "Mathematics - Chapter 3", time: "5 mins ago", icon: ClipboardList, tone: "orange" },
  { title: "Teacher registered", sub: "Bilal Ahmed", time: "12 mins ago", icon: User, tone: "purple" },
  { title: "PDF processed", sub: "Physics Notes.pdf", time: "18 mins ago", icon: FileText, tone: "blue" },
  { title: "Class created", sub: "BSCS Semester 3", time: "25 mins ago", icon: BookOpen, tone: "blue" },
];

const TOP_CLASSES = [
  { name: "BSCS Semester 1", subject: "Computer Science", count: 45, color: "#8b5cf6" },
  { name: "BSCS Semester 3", subject: "Computer Science", count: 38, color: "#3b82f6" },
  { name: "Mathematics", subject: "Mathematics", count: 52, color: "#8b5cf6" },
  { name: "Physics", subject: "Physics", count: 40, color: "#f59e0b" },
  { name: "English Literature", subject: "English", count: 28, color: "#4f46e5" },
];

const REGISTRATIONS = [
  { name: "Hira Fatima", role: "Student", date: "Jun 15, 2025", status: "Pending" },
  { name: "Zain Ali", role: "Teacher", date: "Jun 15, 2025", status: "Pending" },
  { name: "Anum Shahzad", role: "Student", date: "Jun 14, 2025", status: "Active" },
  { name: "Usman Raza", role: "Teacher", date: "Jun 14, 2025", status: "Active" },
  { name: "Sara Khan", role: "Student", date: "Jun 13, 2025", status: "Active" },
];

const INSIGHTS: { title: string; sub: string; icon: IconType }[] = [
  { title: "Student Growth", sub: "+14% new students this month", icon: TrendingUp },
  { title: "Quiz Generation", sub: "+24% increase in AI generations", icon: Sparkles },
  { title: "Active Classes", sub: "42 classes currently active", icon: Users },
  { title: "System Uptime", sub: "99.8% (last 30 days)", icon: ShieldCheck },
];

const SYSTEM: { name: string; icon: IconType; state: string }[] = [
  { name: "Backend API", icon: Server, state: "Online" },
  { name: "Database", icon: Database, state: "Online" },
  { name: "AI Service", icon: Cpu, state: "Online" },
  { name: "PDF Processing Queue", icon: FileText, state: "Normal" },
];

/* ---------- chart helpers ---------- */
const W = 640, H = 260, PL = 38, PR = 12, PT = 12, PB = 30;
const IW = W - PL - PR, IH = H - PT - PB, YMAX = 250;
const cx = (i: number, n: number) => PL + (n <= 1 ? 0 : (i * IW) / (n - 1));
const cy = (v: number) => PT + IH - (v / YMAX) * IH;

const smoothPath = (vals: number[]) => {
  const n = vals.length;
  let d = `M ${cx(0, n)} ${cy(vals[0])}`;
  for (let i = 1; i < n; i++) {
    const x0 = cx(i - 1, n), x1 = cx(i, n), mid = (x0 + x1) / 2;
    d += ` C ${mid} ${cy(vals[i - 1])} ${mid} ${cy(vals[i])} ${x1} ${cy(vals[i])}`;
  }
  return d;
};

const areaPath = (vals: number[]) => {
  const n = vals.length;
  return `${smoothPath(vals)} L ${cx(n - 1, n)} ${PT + IH} L ${cx(0, n)} ${PT + IH} Z`;
};

const conic = (items: { value: number; color: string }[]) => {
  let acc = 0;
  const total = items.reduce((s, i) => s + i.value, 0);
  const parts = items.map((i) => {
    const from = (acc / total) * 100;
    acc += i.value;
    const to = (acc / total) * 100;
    return `${i.color} ${from}% ${to}%`;
  });
  return `conic-gradient(${parts.join(", ")})`;
};

export default function PlatformAnalytics() {
  const [range, setRange] = useState<"7" | "30">("30");

  const count = range === "7" ? 4 : CHART_LABELS.length;
  const labels = CHART_LABELS.slice(-count);
  const students = STUDENTS_DATA.slice(-count);
  const teachers = TEACHERS_DATA.slice(-count);
  const yTicks = [0, 50, 100, 150, 200, 250];

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="pa-app">
          <div className="pa-content">
            {/* LEFT */}
            <div className="pa-left">
              {/* HERO */}
              <div className="pa-hero">
                <div className="pa-hero-icon"><BarChart3 size={26} /></div>
                <div className="pa-hero-text">
                  <h1>Platform Analytics</h1>
                  <p>Track platform performance, user growth and key metrics.</p>
                </div>
                <div className="pa-range">
                  <Calendar size={15} />
                  <select value={range} onChange={(e) => setRange(e.target.value as "7" | "30")}>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* STATS */}
              <div className="pa-stats">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="pa-stat" key={s.label}>
                      <div className="pa-stat-top">
                        <span className={`pa-stat-icon ${s.tone}`}><Icon size={20} /></span>
                        <div>
                          <span className="pa-stat-label">{s.label}</span>
                          <h3>{s.value}</h3>
                        </div>
                      </div>
                      <p className="pa-trend"><ArrowUp size={11} /> {s.trend}</p>
                      <small>vs. last 30 days</small>
                    </div>
                  );
                })}
              </div>

              {/* ROW 1 */}
              <div className="pa-row pa-row-1">
                <div className="pa-card">
                  <div className="pa-card-head">
                    <div>
                      <h4>User Growth</h4>
                      <p>New registrations over the last {range} days.</p>
                    </div>
                    <div className="pa-legend">
                      <span><i style={{ background: "#8b5cf6" }} /> Students</span>
                      <span><i style={{ background: "#3b82f6" }} /> Teachers</span>
                    </div>
                  </div>

                  <svg className="pa-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="User growth chart">
                    <defs>
                      <linearGradient id="pa-grad-s" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="pa-grad-t" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {yTicks.map((t) => (
                      <g key={t}>
                        <line x1={PL} x2={W - PR} y1={cy(t)} y2={cy(t)} stroke="#ecebf5" strokeDasharray="3 4" />
                        <text x={PL - 8} y={cy(t) + 4} textAnchor="end" className="pa-axis">{t}</text>
                      </g>
                    ))}

                    {labels.map((l, i) => (
                      <text key={l} x={cx(i, labels.length)} y={H - 8} textAnchor="middle" className="pa-axis">{l}</text>
                    ))}

                    <path d={areaPath(students)} fill="url(#pa-grad-s)" />
                    <path d={areaPath(teachers)} fill="url(#pa-grad-t)" />
                    <path d={smoothPath(students)} fill="none" stroke="#8b5cf6" strokeWidth="2" />
                    <path d={smoothPath(teachers)} fill="none" stroke="#3b82f6" strokeWidth="2" />

                    {students.map((v, i) => (
                      <circle key={`s${i}`} cx={cx(i, students.length)} cy={cy(v)} r="3.5" fill="#fff" stroke="#8b5cf6" strokeWidth="2">
                        <title>{`Students ${labels[i]}: ${v}`}</title>
                      </circle>
                    ))}
                    {teachers.map((v, i) => (
                      <circle key={`t${i}`} cx={cx(i, teachers.length)} cy={cy(v)} r="3.5" fill="#fff" stroke="#3b82f6" strokeWidth="2">
                        <title>{`Teachers ${labels[i]}: ${v}`}</title>
                      </circle>
                    ))}
                  </svg>
                </div>

                <div className="pa-card">
                  <div className="pa-card-head">
                    <div>
                      <h4>Platform Usage Distribution</h4>
                      <p>Overall usage by user type.</p>
                    </div>
                  </div>
                  <div className="pa-usage">
                    <div className="pa-donut" style={{ background: conic(USAGE) }}>
                      <div className="pa-donut-inner">
                        <strong>2,482</strong>
                        <span>Total Users</span>
                      </div>
                    </div>
                    <ul className="pa-usage-list">
                      {USAGE.map((u) => (
                        <li key={u.label}>
                          <i style={{ background: u.color }} />
                          <div>
                            <strong>{u.label}</strong>
                            <span>{u.count} ({u.value}%)</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ROW 2 */}
              <div className="pa-row pa-row-2">
                <div className="pa-card">
                  <div className="pa-card-head">
                    <h4>Most Used Subjects</h4>
                    <a href="#">View All →</a>
                  </div>
                  <div className="pa-subjects">
                    {SUBJECTS.map((s) => (
                      <div className="pa-subject" key={s.name}>
                        <div className="pa-subject-top">
                          <span><i style={{ background: s.color }} /> {s.name}</span>
                          <b>{s.value}%</b>
                        </div>
                        <div className="pa-bar">
                          <div style={{ width: `${(s.value / 30) * 100}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pa-card">
                  <div className="pa-card-head">
                    <h4>AI Generation Success Rate</h4>
                  </div>
                  <div className="pa-ai">
                    <div
                      className="pa-donut sm"
                      style={{ background: "conic-gradient(#5b8def 0 96.2%, #e8e6f7 96.2% 100%)" }}
                    >
                      <div className="pa-donut-inner">
                        <strong>96.2%</strong>
                        <span>Success Rate</span>
                      </div>
                    </div>
                    <ul className="pa-ai-list">
                      <li>
                        <CheckCircle2 size={18} className="ok" />
                        <div><strong>8,742</strong><span>Successful</span></div>
                      </li>
                      <li>
                        <XCircle size={18} className="bad" />
                        <div><strong>339</strong><span>Failed</span></div>
                      </li>
                      <li>
                        <Clock size={18} className="time" />
                        <div><strong>4.2s</strong><span>Avg. Response Time</span></div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pa-card">
                  <div className="pa-card-head">
                    <h4>Recent Activity</h4>
                    <a href="#">View All →</a>
                  </div>
                  <div className="pa-activity">
                    {ACTIVITY.map((a) => {
                      const Icon = a.icon;
                      return (
                        <div className="pa-act" key={a.title}>
                          <span className={`pa-act-icon ${a.tone}`}><Icon size={15} /></span>
                          <div className="pa-act-info">
                            <strong>{a.title}</strong>
                            <span>{a.sub}</span>
                          </div>
                          <small>{a.time}</small>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ROW 3 */}
              <div className="pa-row pa-row-3">
                <div className="pa-card">
                  <div className="pa-card-head">
                    <h4>Top Classes by Enrollment</h4>
                    <a href="#">View All →</a>
                  </div>
                  <table className="pa-table">
                    <thead>
                      <tr>
                        <th>Class Name</th>
                        <th>Subject</th>
                        <th>Enrolled Students</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_CLASSES.map((c) => (
                        <tr key={c.name}>
                          <td><span className="pa-dotname"><i style={{ background: c.color }} /> {c.name}</span></td>
                          <td className="muted">{c.subject}</td>
                          <td>
                            <div className="pa-bar thin">
                              <div style={{ width: `${(c.count / 60) * 100}%`, background: "#8b5cf6" }} />
                            </div>
                          </td>
                          <td className="num">{c.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pa-card">
                  <div className="pa-card-head">
                    <h4>Recent Registrations</h4>
                    <a href="#">View All →</a>
                  </div>
                  <table className="pa-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGISTRATIONS.map((r) => (
                        <tr key={r.name}>
                          <td><span className="pa-dotname"><i style={{ background: "#6a45e8" }} /> {r.name}</span></td>
                          <td><span className="pa-role">{r.role}</span></td>
                          <td className="muted">{r.date}</td>
                          <td><span className={`pa-status ${r.status.toLowerCase()}`}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="pa-right">
              <div className="pa-panel">
                <h4><Lightbulb size={16} /> Quick Insights</h4>
                {INSIGHTS.map((q) => {
                  const Icon = q.icon;
                  return (
                    <div className="pa-insight" key={q.title}>
                      <span className="pa-insight-icon"><Icon size={17} /></span>
                      <div>
                        <strong>{q.title}</strong>
                        <small>{q.sub}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pa-panel">
                <div className="pa-card-head">
                  <h4 className="pa-nomargin">System Status</h4>
                  <a href="#">View Details →</a>
                </div>
                <div className="pa-sys">
                  {SYSTEM.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div className="pa-sys-row" key={s.name}>
                        <span className="pa-sys-icon"><Icon size={15} /></span>
                        <span className="pa-sys-name">{s.name}</span>
                        <em className={`pa-pill ${s.state === "Online" ? "online" : "normal"}`}>{s.state}</em>
                      </div>
                    );
                  })}
                  <div className="pa-sys-row storage">
                    <span className="pa-sys-icon"><HardDrive size={15} /></span>
                    <span className="pa-sys-name">Storage Usage</span>
                    <b>68%</b>
                  </div>
                  <div className="pa-bar thin full">
                    <div style={{ width: "68%", background: "#8b5cf6" }} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}