import { useState } from "react";
import {
  Bell, Send, Mail, User, AlertCircle, Settings, ChevronRight, Eye,
  MoreVertical, Pencil, ArrowUp, ArrowDown, ArrowRight, Headphones,
  FilePlus, CalendarClock, Megaphone,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./notification.css";

/* ---------------- DATA ---------------- */
const stats = [
  { label: "Total Notifications", value: "248", change: "12%", up: true, icon: Bell },
  { label: "Total Emails Sent", value: "1,842", change: "18%", up: true, icon: Send },
  { label: "Delivery Rate", value: "98.6%", change: "2%", up: true, icon: Mail },
  { label: "Total Recipients", value: "3,246", change: "15%", up: true, icon: User },
  { label: "Failed Emails", value: "32", change: "42%", up: false, icon: AlertCircle },
];

const notifications = [
  { id: 1, title: "Semester 3 Midterm Schedule", sub: "The midterm exams for BSCS Semester 3...", type: "Academic", audience: "Students", priority: "High", status: "Sent", date: "Jun 10, 2025", time: "10:30 AM", color: "purple", icon: Megaphone },
  { id: 2, title: "System Maintenance Notice", sub: "The platform will be under maintenance...", type: "System", audience: "All Users", priority: "Normal", status: "Sent", date: "Jun 08, 2025", time: "02:15 PM", color: "blue", icon: Mail },
  { id: 3, title: "New Course Added: Data Structures", sub: 'A new course "Data Structures" has been...', type: "Academic", audience: "Students", priority: "Normal", status: "Sent", date: "Jun 05, 2025", time: "11:45 AM", color: "green", icon: Bell },
  { id: 4, title: "Holiday Notice (Eid UI Adha)", sub: "The platform will remain closed from...", type: "General", audience: "All Users", priority: "High", status: "Scheduled", date: "May 28, 2025", time: "04:30 PM", color: "orange", icon: AlertCircle },
  { id: 5, title: "Quiz Deadline Extension", sub: "The deadline for Quiz 2 has been extended...", type: "Academic", audience: "Students", priority: "Normal", status: "Sent", date: "May 25, 2025", time: "01:10 PM", color: "pink", icon: Bell },
];

const templates = [
  { id: 1, name: "Welcome Email", type: "General", audience: "All Users", updated: "Jun 01, 2025 10:20 AM" },
  { id: 2, name: "Password Reset", type: "Security", audience: "All Users", updated: "May 30, 2025 02:45 PM" },
  { id: 3, name: "Course Enrollment", type: "Academic", audience: "Students", updated: "May 28, 2025 11:15 AM" },
  { id: 4, name: "Quiz Reminder", type: "Academic", audience: "Students", updated: "May 25, 2025 09:40 AM" },
  { id: 5, name: "System Maintenance", type: "System", audience: "All Users", updated: "May 20, 2025 04:10 PM" },
];

const quickActions = [
  { title: "Send Notification", sub: "Send a new notification to users", icon: Send },
  { title: "Send Email", sub: "Send email using a template", icon: Mail },
  { title: "Create Template", sub: "Add new email template", icon: FilePlus },
  { title: "Notification Settings", sub: "Configure delivery preferences", icon: Settings },
];

const activity = [
  { title: "Email sent to all students", sub: "System Maintenance Notice", time: "2 hours ago", color: "blue", icon: Mail },
  { title: "Notification sent to teachers", sub: "New Course Added", time: "4 hours ago", color: "orange", icon: Bell },
  { title: "Email template updated", sub: "Password Reset", time: "6 hours ago", color: "purple", icon: Pencil },
  { title: "Notification scheduled", sub: "Holiday Notice (Eid UI Adha)", time: "1 day ago", color: "red", icon: CalendarClock },
  { title: "Email delivery failed", sub: "Quiz Deadline Extension", time: "1 day ago", color: "red", icon: AlertCircle },
];

/* ---------------- DONUT ---------------- */
const Donut = () => {
  const r = 52, c = 2 * Math.PI * r;
  const seg = (pct: number) => (pct / 100) * c;
  const delivered = 98.6, bounced = 1.0, failed = 0.8; // visual only
  return (
    <svg viewBox="0 0 140 140" className="nt-donut-svg">
      <g transform="rotate(-90 70 70)" fill="none" strokeWidth="14">
        <circle cx="70" cy="70" r={r} stroke="#10b981" strokeDasharray={`${seg(delivered)} ${c}`} />
        <circle cx="70" cy="70" r={r} stroke="#f59e0b" strokeDasharray={`${seg(bounced)} ${c}`} strokeDashoffset={-seg(delivered)} />
        <circle cx="70" cy="70" r={r} stroke="#ef4444" strokeDasharray={`${seg(failed)} ${c}`} strokeDashoffset={-seg(delivered + bounced)} />
      </g>
    </svg>
  );
};

/* ---------------- PAGE ---------------- */
export default function Notification() {
  const [tab, setTab] = useState<"notifications" | "templates">("notifications");
  const [type, setType] = useState("General Notification");
  const [audience, setAudience] = useState("All Users");
  const [priority, setPriority] = useState("Normal");

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="nt-app">
          <div className="nt-content">
            {/* ---------- LEFT ---------- */}
            <div className="nt-left">
              <section className="nt-hero">
                <div className="nt-hero-icon"><Bell size={22} /></div>
                <div>
                  <h1>Notifications &amp; Email</h1>
                  <p>Send notifications and manage email communications with users.</p>
                </div>
                <div className="nt-hero-art"><Mail size={64} /></div>
              </section>

              <section className="nt-stats">
                {stats.map((s) => (
                  <div key={s.label} className="nt-stat">
                    <div className="nt-stat-icon"><s.icon size={22} /></div>
                    <div>
                      <span className="nt-stat-label">{s.label}</span>
                      <strong className="nt-stat-value">{s.value}</strong>
                    </div>
                    <div className={`nt-stat-change ${s.up ? "up" : "down"}`}>
                      {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.change}
                    </div>
                    <small>vs. last 30 days</small>
                  </div>
                ))}
              </section>

              <section className="nt-panel">
                <div className="nt-tabs">
                  <button className={tab === "notifications" ? "active" : ""} onClick={() => setTab("notifications")}>Notifications</button>
                  <button className={tab === "templates" ? "active" : ""} onClick={() => setTab("templates")}>Email Templates</button>
                </div>

                <div className="nt-box">
                  <h3>Send Notification</h3>
                  <div className="nt-form">
                    <label>
                      Notification Type
                      <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option>General Notification</option><option>Academic</option><option>System</option>
                      </select>
                    </label>
                    <label>
                      Audience
                      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
                        <option>All Users</option><option>Students</option><option>Teachers</option>
                      </select>
                    </label>
                    <label>
                      Priority
                      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option>Normal</option><option>High</option><option>Low</option>
                      </select>
                    </label>
                    <button className="nt-btn-primary"><Send size={15} /> Compose &amp; Send</button>
                  </div>
                </div>

                {tab === "notifications" && (
                  <div className="nt-box">
                    <div className="nt-box-head"><h3>Recent Notifications</h3><a>View All <ArrowRight size={13} /></a></div>
                    <table className="nt-table">
                      <thead>
                        <tr><th>#</th><th>Title</th><th>Type</th><th>Audience</th><th>Priority</th><th>Status</th><th>Sent At</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {notifications.map((n) => (
                          <tr key={n.id}>
                            <td>{n.id}</td>
                            <td>
                              <div className="nt-title-cell">
                                <span className={`nt-tile ${n.color}`}><n.icon size={15} /></span>
                                <div><strong>{n.title}</strong><small>{n.sub}</small></div>
                              </div>
                            </td>
                            <td><span className={`nt-pill type-${n.type.toLowerCase()}`}>{n.type}</span></td>
                            <td><span className={`nt-pill aud-${n.audience === "Students" ? "students" : "all"}`}>{n.audience}</span></td>
                            <td><span className={`nt-pill pri-${n.priority.toLowerCase()}`}>{n.priority}</span></td>
                            <td><span className={`nt-pill st-${n.status.toLowerCase()}`}>{n.status}</span></td>
                            <td className="nt-date">{n.date}<br />{n.time}</td>
                            <td>
                              <div className="nt-actions">
                                <button><Eye size={15} /></button>
                                <button><MoreVertical size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="nt-box">
                  <div className="nt-box-head"><h3>Email Templates</h3><a>View All <ArrowRight size={13} /></a></div>
                  <table className="nt-table compact">
                    <thead>
                      <tr><th>#</th><th>Template Name</th><th>Type</th><th>Audience</th><th>Last Updated</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {templates.map((t) => (
                        <tr key={t.id}>
                          <td>{t.id}</td>
                          <td>{t.name}</td>
                          <td><span className={`nt-pill type-${t.type.toLowerCase()}`}>{t.type}</span></td>
                          <td><span className={`nt-pill aud-${t.audience === "Students" ? "students" : "all"}`}>{t.audience}</span></td>
                          <td className="nt-date">{t.updated}</td>
                          <td>
                            <div className="nt-actions">
                              <button><Pencil size={14} /></button>
                              <button><MoreVertical size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ---------- RIGHT ---------- */}
            <aside className="nt-right">
              <div className="nt-card">
                <h4 className="nt-card-title"><Bell size={15} /> Quick Actions</h4>
                {quickActions.map((q) => (
                  <button key={q.title} className="nt-quick">
                    <span className="nt-quick-icon"><q.icon size={17} /></span>
                    <span><strong>{q.title}</strong><small>{q.sub}</small></span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>

              <div className="nt-card">
                <h4 className="nt-card-title"><Settings size={15} /> Notification &amp; Email Status</h4>
                <div className="nt-donut-wrap">
                  <div className="nt-donut">
                    <Donut />
                    <div className="nt-donut-center"><strong>98.6%</strong><span>Delivery Rate</span></div>
                  </div>
                  <ul className="nt-legend">
                    <li><i style={{ background: "#10b981" }} /><div>Delivered<b>1,812 (98.6%)</b></div></li>
                    <li><i style={{ background: "#f59e0b" }} /><div>Bounced<b>18 (1.0%)</b></div></li>
                    <li><i style={{ background: "#ef4444" }} /><div>Failed<b>14 (0.8%)</b></div></li>
                  </ul>
                </div>
              </div>

              <div className="nt-card">
                <div className="nt-box-head"><h4 className="nt-card-title"><CalendarClock size={15} /> Recent Activity</h4><a>View All <ArrowRight size={13} /></a></div>
                {activity.map((a, i) => (
                  <div key={i} className="nt-activity">
                    <span className={`nt-tile sm ${a.color}`}><a.icon size={14} /></span>
                    <div><strong>{a.title}</strong><small>{a.sub}</small></div>
                    <time>{a.time}</time>
                  </div>
                ))}
              </div>

              <div className="nt-help">
                <Headphones size={26} />
                <div>
                  <strong>Need Help?</strong>
                  <p>Having issues with notifications or email?</p>
                  <button className="nt-btn-primary sm">Contact Support</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}