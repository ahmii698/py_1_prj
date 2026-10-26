import { useState } from "react";
import {
  Users,
  GraduationCap,
  School,
  ClipboardList,
  ClipboardCheck,
  Sparkles,
  Calendar,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  MoreVertical,
  Clock,
  Brain,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Settings,
  FileBarChart,
  Lock,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./dashboard.css";

/* ---------- Static data (baad mein API se replace kar lena) ---------- */

const stats = [
  { label: "Total Students", value: "1,248", change: "12%", up: true, icon: Users, color: "purple" },
  { label: "Total Teachers", value: "86", change: "8%", up: true, icon: GraduationCap, color: "blue" },
  { label: "Total Classes", value: "42", change: "5%", up: true, icon: School, color: "green" },
  { label: "Total Quizzes", value: "356", change: "18%", up: true, icon: ClipboardList, color: "orange" },
  { label: "Quiz Attempts", value: "8,742", change: "24%", up: true, icon: ClipboardCheck, color: "violet" },
  { label: "AI Generated Quizzes", value: "312", change: "32%", up: true, icon: Sparkles, color: "pink" },
];

const days = ["May 16", "May 17", "May 18", "May 19", "May 20", "May 21", "May 22"];
const chartSeries = [
  { name: "Students", color: "#7c5cf6", data: [105, 145, 170, 170, 225, 245, 295] },
  { name: "Teachers", color: "#3b9cf5", data: [55, 80, 100, 100, 135, 150, 175] },
  { name: "Quiz Attempts", color: "#16a870", data: [170, 225, 260, 265, 330, 335, 405] },
];

const distribution = [
  { label: "Students", value: 1248, pct: "93.4%", color: "#7c5cf6" },
  { label: "Teachers", value: 86, pct: "6.4%", color: "#3b9cf5" },
  { label: "Admins", value: 3, pct: "0.2%", color: "#16a870" },
];

const recentUsers = {
  Students: [
    { name: "Ali Raza", role: "Student", email: "ali.raza@example.com", joined: "2 mins ago", status: "Pending" },
    { name: "Sara Ahmed", role: "Student", email: "sara.ahmed@example.com", joined: "5 mins ago", status: "Active" },
    { name: "Danish Khan", role: "Student", email: "danish.khan@example.com", joined: "12 mins ago", status: "Active" },
    { name: "Hira Fatima", role: "Student", email: "hira.fatima@example.com", joined: "18 mins ago", status: "Pending" },
    { name: "Ahmed Zubair", role: "Student", email: "ahmed.zubair@example.com", joined: "25 mins ago", status: "Active" },
  ],
  Teachers: [
    { name: "Usman Ali", role: "Teacher", email: "usman.ali@example.com", joined: "1 hour ago", status: "Pending" },
    { name: "Bilal Ahmed", role: "Teacher", email: "bilal.ahmed@example.com", joined: "3 hours ago", status: "Pending" },
    { name: "Ayesha Khan", role: "Teacher", email: "ayesha.khan@example.com", joined: "5 hours ago", status: "Active" },
  ],
  Admins: [
    { name: "Ahmed Khan", role: "Admin", email: "admin@learniq.com", joined: "2 days ago", status: "Active" },
  ],
} as const;

const insights = [
  { value: "312", label: "AI Quiz Generations", change: "32%", up: true },
  { value: "98.7%", label: "Success Rate", change: "1.2%", up: true },
  { value: "4.2s", label: "Avg. Processing Time", change: "15%", up: false },
  { value: "12", label: "Errors", change: "60%", up: false },
];

const topSubjects = [
  { name: "Data Structures", count: 68 },
  { name: "Programming", count: 54 },
  { name: "Database Systems", count: 42 },
  { name: "Web Development", count: 38 },
  { name: "Computer Networks", count: 28 },
];

const activity = [
  { time: "2 minutes ago", text: "New student registered: Ali Raza", color: "#7c5cf6" },
  { time: "5 minutes ago", text: "Quiz created: Data Structures Quiz 2 (by Ahmed Khan)", color: "#3b9cf5" },
  { time: "12 minutes ago", text: "Teacher approved: Ayesha Khan", color: "#ef4466" },
  { time: "18 minutes ago", text: "New class created: BSCS - Semester 3", color: "#16a870" },
  { time: "25 minutes ago", text: "AI quiz generated: Programming Basics (10 questions)", color: "#3b9cf5" },
];

const approvals = [
  { name: "Ayesha Khan", type: "Student Registration", time: "Applied 2 hours ago" },
  { name: "Usman Ali", type: "Teacher Registration", time: "Applied 5 hours ago" },
  { name: "Fatima Zahra", type: "Student Registration", time: "Applied 7 hours ago" },
  { name: "Bilal Ahmed", type: "Teacher Registration", time: "Applied 10 hours ago" },
];

const notifications = [
  { title: "AI service maintenance scheduled", desc: "System will be under maintenance on 25 May...", time: "2 hours ago", icon: Brain, color: "purple" },
  { title: "New teacher registration pending", desc: "Bilal Ahmed has applied for teacher registration.", time: "5 hours ago", icon: UserCheck, color: "pink" },
  { title: "High number of failed quiz attempts", desc: "12 failed attempts detected in Data Structures Quiz.", time: "8 hours ago", icon: AlertTriangle, color: "orange" },
  { title: "Backup completed successfully", desc: "Database backup completed at 02:00 AM.", time: "12 hours ago", icon: CheckCircle2, color: "green" },
];

const quickAccess = [
  { label: "System Settings", icon: Settings },
  { label: "Generate Report", icon: FileBarChart },
  { label: "Manage Classes", icon: School },
  { label: "View Logs", icon: Lock },
];

/* ---------- Chart helpers ---------- */

const W = 520;
const H = 220;
const PAD_L = 36;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 26;
const MAX = 500;

const px = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / (days.length - 1);
const py = (v: number) => PAD_T + (1 - v / MAX) * (H - PAD_T - PAD_B);

function smoothPath(data: number[]) {
  const pts = data.map((v, i) => [px(i), py(v)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

function areaPath(data: number[]) {
  const base = H - PAD_B;
  return `${smoothPath(data)} L ${px(data.length - 1)} ${base} L ${px(0)} ${base} Z`;
}

/* ---------- Component ---------- */

type Tab = keyof typeof recentUsers;

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("Students");

  const R = 62;
  const C = 2 * Math.PI * R;
  const total = distribution.reduce((s, d) => s + d.value, 0);
  let offset = 0;

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="dash-grid">
          {/* ================= LEFT / CENTER ================= */}
          <div className="dash-center">
            {/* Welcome banner */}
            <section className="dash-welcome">
              <div className="dash-welcome-left">
                <div className="dash-welcome-icon">
                  <Settings size={20} />
                </div>
                <div>
                  <h1>Good Morning, Ahmed Khan 👋</h1>
                  <p>Here's what's happening on your platform today.</p>
                  <span className="dash-date">
                    <Calendar size={14} /> Thursday, 22 May 2025
                  </span>
                </div>
              </div>
              <div className="dash-welcome-art">💻</div>
            </section>

            {/* Stat cards */}
            <section className="dash-stats">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div className="dash-stat" key={s.label}>
                    <div className={`dash-stat-icon ${s.color}`}>
                      <Icon size={20} />
                    </div>
                    <p className="dash-stat-label">{s.label}</p>
                    <h3>{s.value}</h3>
                    <span className={`dash-stat-change ${s.up ? "up" : "down"}`}>
                      {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.change}
                    </span>
                    <small>vs. last month</small>
                  </div>
                );
              })}
            </section>

            {/* Growth + Distribution */}
            <section className="dash-row dash-row-chart">
              <div className="dash-card">
                <div className="dash-card-head">
                  <div>
                    <h2>Platform Growth Overview</h2>
                    <p className="dash-sub">User registrations and activity over the last 7 days.</p>
                  </div>
                  <div className="dash-legend">
                    {chartSeries.map((s) => (
                      <span key={s.name}>
                        <i style={{ background: s.color }} /> {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <svg viewBox={`0 0 ${W} ${H}`} className="dash-chart">
                  <defs>
                    {chartSeries.map((s, i) => (
                      <linearGradient id={`grad${i}`} key={s.name} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                      </linearGradient>
                    ))}
                  </defs>

                  {[0, 100, 200, 300, 400, 500].map((v) => (
                    <g key={v}>
                      <line
                        x1={PAD_L}
                        x2={W - PAD_R}
                        y1={py(v)}
                        y2={py(v)}
                        stroke="#eef0fa"
                        strokeWidth="1"
                      />
                      <text x={PAD_L - 8} y={py(v) + 3} textAnchor="end" fontSize="9" fill="#6b7194">
                        {v}
                      </text>
                    </g>
                  ))}

                  {days.map((d, i) => (
                    <text key={d} x={px(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#6b7194">
                      {d}
                    </text>
                  ))}

                  {[...chartSeries].reverse().map((s) => {
                    const idx = chartSeries.indexOf(s);
                    return <path key={`a${s.name}`} d={areaPath(s.data)} fill={`url(#grad${idx})`} />;
                  })}

                  {chartSeries.map((s) => (
                    <path
                      key={s.name}
                      d={smoothPath(s.data)}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
              </div>

              <div className="dash-card">
                <h2>User Distribution</h2>
                <p className="dash-sub">Total registered users by role.</p>
                <div className="dash-donut-wrap">
                  <div className="dash-donut">
                    <svg viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r={R} fill="none" stroke="#f1f2fb" strokeWidth="20" />
                      {distribution.map((d) => {
                        const len = (d.value / total) * C;
                        const el = (
                          <circle
                            key={d.label}
                            cx="80"
                            cy="80"
                            r={R}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="20"
                            strokeDasharray={`${len} ${C - len}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 80 80)"
                          />
                        );
                        offset += len;
                        return el;
                      })}
                    </svg>
                    <div className="dash-donut-center">
                      <strong>{total.toLocaleString()}</strong>
                      <span>Total Users</span>
                    </div>
                  </div>

                  <ul className="dash-donut-legend">
                    {distribution.map((d) => (
                      <li key={d.label}>
                        <i style={{ background: d.color }} />
                        <div>
                          <b>{d.label}</b>
                          <span>
                            {d.value.toLocaleString()} ({d.pct})
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Recent users + AI insights */}
            <section className="dash-row dash-row-mid">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h2>Recent Users</h2>
                  <a href="/admin/users" className="dash-viewall">
                    View All <ArrowRight size={13} />
                  </a>
                </div>

                <div className="dash-tabs">
                  {(Object.keys(recentUsers) as Tab[]).map((t) => (
                    <button
                      key={t}
                      className={tab === t ? "active" : ""}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers[tab].map((u) => (
                      <tr key={u.email}>
                        <td>
                          <div className="dash-user">
                            <span className="dash-user-avatar">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                            {u.name}
                          </div>
                        </td>
                        <td>
                          <span className="dash-role">{u.role}</span>
                        </td>
                        <td className="muted">{u.email}</td>
                        <td className="muted">{u.joined}</td>
                        <td>
                          <span className={`dash-status ${u.status.toLowerCase()}`}>{u.status}</span>
                        </td>
                        <td>
                          <MoreVertical size={14} className="muted" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dash-card">
                <div className="dash-ai-head">
                  <div className="dash-welcome-icon small">
                    <Brain size={16} />
                  </div>
                  <div>
                    <h2>AI &amp; Platform Insights</h2>
                    <p className="dash-sub">This month's AI usage and performance.</p>
                  </div>
                </div>

                <div className="dash-insights">
                  {insights.map((i) => (
                    <div className="dash-insight" key={i.label}>
                      <strong>{i.value}</strong>
                      <span>{i.label}</span>
                      <em className={i.up ? "up" : "down"}>
                        {i.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {i.change}
                      </em>
                    </div>
                  ))}
                </div>

                <h4 className="dash-subjects-title">Top Subjects by Quiz Generation</h4>
                <ul className="dash-subjects">
                  {topSubjects.map((s) => (
                    <li key={s.name}>
                      <span>{s.name}</span>
                      <div className="dash-bar">
                        <div style={{ width: `${(s.count / 68) * 100}%` }} />
                      </div>
                      <b>{s.count}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Activity + AI generations */}
            <section className="dash-row dash-row-bottom">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h2 className="with-icon">
                    <Clock size={15} /> Recent Activity
                  </h2>
                  <a href="/admin/security" className="dash-viewall">
                    View All
                  </a>
                </div>
                <ul className="dash-activity">
                  {activity.map((a) => (
                    <li key={a.text}>
                      <i style={{ background: a.color }} />
                      <span className="time">{a.time}</span>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dash-card dash-ai-card">
                <div>
                  <p>Total AI Quiz Generations</p>
                  <h3>312</h3>
                  <small>This month</small>
                  <a href="/admin/analytics" className="dash-btn-primary">
                    View AI Analytics <ArrowRight size={14} />
                  </a>
                </div>
                <div className="dash-ai-art">🤖</div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <aside className="dash-right">
            <div className="dash-card">
              <div className="dash-card-head">
                <h2 className="with-icon">
                  <UserCheck size={16} /> Pending Approvals
                </h2>
                <a href="/admin/users" className="dash-viewall">
                  View All <ArrowRight size={13} />
                </a>
              </div>
              <ul className="dash-approvals">
                {approvals.map((a) => (
                  <li key={a.name}>
                    <span className="dash-user-avatar big">
                      {a.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div className="info">
                      <b>{a.name}</b>
                      <span>{a.type}</span>
                      <small>{a.time}</small>
                    </div>
                    <button className="dash-approve">Approve</button>
                    <button className="dash-reject">Reject</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dash-card">
              <div className="dash-card-head">
                <h2 className="with-icon">
                  <Bell size={16} /> System Notifications
                </h2>
                <a href="/admin/notifications" className="dash-viewall">
                  View All <ArrowRight size={13} />
                </a>
              </div>
              <ul className="dash-notifs">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li key={n.title}>
                      <span className={`dash-notif-icon ${n.color}`}>
                        <Icon size={16} />
                      </span>
                      <div className="info">
                        <b>{n.title}</b>
                        <span>{n.desc}</span>
                      </div>
                      <small>{n.time}</small>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="dash-card">
              <h2 className="with-icon">
                <ShieldCheck size={16} /> Quick Access
              </h2>
              <div className="dash-quick">
                {quickAccess.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button key={q.label}>
                      <Icon size={16} />
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}