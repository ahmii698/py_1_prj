import { useMemo, useState } from "react";
import {
  Users, BookOpen, Megaphone, Settings, ShieldCheck, Search, ChevronDown,
  ChevronRight, ChevronLeft, Plus, Eye, Pencil, MoreVertical, Filter,
  Calendar, Clock, Archive, Sparkles, FilePlus2, List, Cog,
  HelpCircle as HelpIcon, CalendarDays,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./announcements.css";

/* ---------- Data ---------- */
type Audience = "Students" | "Teachers" | "All Users";
type Status = "Active" | "Scheduled" | "Inactive" | "Archived";

interface Announcement {
  id: number;
  icon: any;
  color: string;
  title: string;
  desc: string;
  audience: Audience;
  type: string;
  status: Status;
  date: string;
  time: string;
}

const announcements: Announcement[] = [
  { id: 1, icon: CalendarDays, color: "purple", title: "Semester 3 Midterm Schedule", desc: "The midterm exams for BSCS Semester 3...", audience: "Students", type: "Academic", status: "Active", date: "Jun 10, 2025", time: "10:30 AM" },
  { id: 2, icon: Settings, color: "magenta", title: "System Maintenance Notice", desc: "The platform will be under maintenance...", audience: "All Users", type: "System", status: "Active", date: "Jun 08, 2025", time: "02:15 PM" },
  { id: 3, icon: BookOpen, color: "blue", title: "New Course Added: Data Structures", desc: "A new course 'Data Structures' has been...", audience: "Students", type: "Academic", status: "Active", date: "Jun 05, 2025", time: "11:45 AM" },
  { id: 4, icon: Users, color: "orange", title: "Teacher Training Program", desc: "All teachers are invited to join the online...", audience: "Teachers", type: "Event", status: "Active", date: "Jun 03, 2025", time: "09:20 AM" },
  { id: 5, icon: CalendarDays, color: "violet", title: "Holiday Notice (Eid Ul Adha)", desc: "The platform will remain closed from...", audience: "All Users", type: "General", status: "Active", date: "May 28, 2025", time: "04:30 PM" },
  { id: 6, icon: Clock, color: "blue", title: "Quiz Deadline Extension", desc: "The deadline for Quiz 2 has been extended...", audience: "Students", type: "Academic", status: "Active", date: "May 25, 2025", time: "01:10 PM" },
  { id: 7, icon: Calendar, color: "orange", title: "Campus Event - Tech Fest 2025", desc: "Join us for the annual Tech Fest 2025 on...", audience: "All Users", type: "Event", status: "Scheduled", date: "May 20, 2025", time: "09:00 AM" },
  { id: 8, icon: ShieldCheck, color: "blue", title: "Account Verification Reminder", desc: "Please verify your account to avoid any...", audience: "All Users", type: "System", status: "Inactive", date: "May 15, 2025", time: "11:25 AM" },
  { id: 9, icon: Archive, color: "gray", title: "Study Material Update", desc: "New study materials have been added to...", audience: "Students", type: "Academic", status: "Archived", date: "May 10, 2025", time: "03:40 PM" },
  { id: 10, icon: Sparkles, color: "purple", title: "Welcome to LearnIQ", desc: "Welcome to our platform! We're excited...", audience: "All Users", type: "General", status: "Active", date: "May 01, 2025", time: "10:00 AM" },
];

const stats = [
  { icon: Megaphone, label: "Total Announcements", value: "24", change: "↑ 33%", dir: "up", color: "purple" },
  { icon: Users, label: "Active", value: "18", change: "↑ 38%", dir: "up", color: "purple" },
  { icon: Clock, label: "Scheduled", value: "3", change: "↑ 200%", dir: "up", color: "purple" },
  { icon: Archive, label: "Archived", value: "3", change: "↓ 25%", dir: "down", color: "purple" },
];

const quickActions = [
  { icon: Megaphone, title: "Create Announcement", sub: "Send new announcement" },
  { icon: FilePlus2, title: "Manage Templates", sub: "Use predefined templates" },
  { icon: List, title: "View All Announcements", sub: "See complete list" },
  { icon: Cog, title: "Announcement Settings", sub: "Configure preferences" },
];

const audienceClass = (a: Audience) =>
  a === "Students" ? "blue" : a === "Teachers" ? "orange" : "purple";
const typeClass = (t: string) =>
  t === "Academic" ? "purple" : t === "General" ? "gray" : "blue";
const statusClass = (s: Status) => s.toLowerCase();

/* ---------- Page ---------- */
const Announcements = () => {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("All Audience");
  const [status, setStatus] = useState("All Status");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [audienceFilter, setAudienceFilter] = useState("All Users");

  const filtered = useMemo(
    () =>
      announcements.filter((a) => {
        const s = search.trim().toLowerCase();
        const matchSearch = !s || a.title.toLowerCase().includes(s) || a.desc.toLowerCase().includes(s);
        const matchAud = audience === "All Audience" || a.audience === audience;
        const matchStatus = status === "All Status" || a.status === status;
        return matchSearch && matchAud && matchStatus;
      }),
    [search, audience, status]
  );

  const allChecked = filtered.length > 0 && filtered.every((a) => selected.includes(a.id));

  const toggleAll = () =>
    setSelected(allChecked ? [] : filtered.map((a) => a.id));
  const toggleOne = (id: number) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const clearFilters = () => {
    setSearch("");
    setAudience("All Audience");
    setStatus("All Status");
  };

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="an-layout">
          <div className="an-body">
            {/* Left content */}
            <div className="an-content">
              <section className="an-hero">
                <div className="an-hero-icon"><Megaphone size={24} color="#fff" /></div>
                <div className="an-hero-text">
                  <h1>Announcements</h1>
                  <p>Create and manage announcements for students, teachers and all platform users.</p>
                </div>
                <button className="an-create">
                  <Plus size={16} /> Create Announcement
                </button>
              </section>

              <section className="an-stats">
                {stats.map((s) => (
                  <div key={s.label} className="an-stat">
                    <div className="an-ico purple"><s.icon size={20} /></div>
                    <div>
                      <p>{s.label}</p>
                      <h3>{s.value}</h3>
                      <small className={s.dir}>{s.change}</small>
                      <small className="muted">vs. last 30 days</small>
                    </div>
                  </div>
                ))}
              </section>

              <section className="an-card an-table-card">
                <div className="an-table-head">
                  <h3>All Announcements</h3>
                  <div className="an-filters">
                    <div className="an-input">
                      <Search size={14} />
                      <input
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="an-select">
                      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
                        <option>All Audience</option>
                        <option>Students</option>
                        <option>Teachers</option>
                        <option>All Users</option>
                      </select>
                      <ChevronDown size={14} />
                    </div>
                    <div className="an-select">
                      <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Scheduled</option>
                        <option>Inactive</option>
                        <option>Archived</option>
                      </select>
                      <ChevronDown size={14} />
                    </div>
                    <button className="an-clear" onClick={clearFilters}>
                      <Filter size={13} /> Clear Filters
                    </button>
                  </div>
                </div>

                <div className="an-table-wrap">
                  <table className="an-table">
                    <thead>
                      <tr>
                        <th className="w-check">
                          <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                        </th>
                        <th>Title</th>
                        <th>Audience</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Published Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a) => (
                        <tr key={a.id}>
                          <td className="w-check">
                            <input
                              type="checkbox"
                              checked={selected.includes(a.id)}
                              onChange={() => toggleOne(a.id)}
                            />
                          </td>
                          <td>
                            <div className="an-title-cell">
                              <div className={`an-row-ico ${a.color}`}><a.icon size={16} /></div>
                              <div>
                                <b>{a.title}</b>
                                <span>{a.desc}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className={`an-pill ${audienceClass(a.audience)}`}>{a.audience}</span></td>
                          <td><span className={`an-pill ${typeClass(a.type)}`}>{a.type}</span></td>
                          <td><span className={`an-status ${statusClass(a.status)}`}>{a.status}</span></td>
                          <td>
                            <div className="an-date">
                              <b>{a.date}</b>
                              <span>{a.time}</span>
                            </div>
                          </td>
                          <td>
                            <div className="an-actions">
                              <button title="View"><Eye size={14} /></button>
                              <button title="Edit"><Pencil size={14} /></button>
                              <button className="plain" title="More"><MoreVertical size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={7} className="an-empty">No announcements found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="an-pagination">
                  <span>Showing 1 to {filtered.length} of 24 announcements</span>
                  <div className="an-pages">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
                    {[1, 2, 3].map((n) => (
                      <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>
                        {n}
                      </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(3, p + 1))}><ChevronRight size={14} /></button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right panel */}
            <aside className="an-right">
              <div className="an-card">
                <div className="an-panel-head">
                  <Sparkles size={16} />
                  <h3>Quick Actions</h3>
                </div>
                <ul className="an-quick">
                  {quickActions.map((q) => (
                    <li key={q.title}>
                      <div className="an-ico sm purple"><q.icon size={16} /></div>
                      <div>
                        <b>{q.title}</b>
                        <span>{q.sub}</span>
                      </div>
                      <ChevronRight size={15} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="an-card">
                <div className="an-panel-head">
                  <Users size={16} />
                  <h3>Audience Filter</h3>
                </div>
                <div className="an-radios">
                  {["All Users", "Students", "Teachers", "Specific Classes"].map((r) => (
                    <label key={r} className={audienceFilter === r ? "checked" : ""}>
                      <input
                        type="radio"
                        name="audience"
                        checked={audienceFilter === r}
                        onChange={() => setAudienceFilter(r)}
                      />
                      <span className="an-radio" />
                      {r}
                    </label>
                  ))}
                </div>
                <div className="an-select full">
                  <select disabled={audienceFilter !== "Specific Classes"} defaultValue="">
                    <option value="">Select classes</option>
                    <option>BSCS Semester 1</option>
                    <option>BSCS Semester 3</option>
                    <option>BSCS Semester 5</option>
                  </select>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="an-card">
                <div className="an-panel-head between">
                  <div className="an-panel-title">
                    <Megaphone size={16} />
                    <h3>Recent Announcements</h3>
                  </div>
                  <a className="an-link">View All →</a>
                </div>
                <ul className="an-recent">
                  {announcements.slice(0, 5).map((a) => (
                    <li key={a.id}>
                      <div className={`an-row-ico ${a.color}`}><a.icon size={15} /></div>
                      <div className="an-recent-text">
                        <b>{a.title}</b>
                        <span>{a.date} • {a.time}</span>
                      </div>
                      <em className={`an-status mini ${statusClass(a.status)}`}>{a.status}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="an-help">
                <div className="an-help-top">
                  <div className="an-help-ico"><HelpIcon size={14} color="#fff" /></div>
                  <div>
                    <b>Need Help?</b>
                    <p>Manage announcements and keep your community informed.</p>
                  </div>
                </div>
                <button>Contact Admin</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Announcements;