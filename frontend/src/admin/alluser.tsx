import { useMemo, useState } from "react";
import {
  Users, GraduationCap, User, UserCheck, Search, Eye, MoreVertical, Plus,
  Download, Zap, Shield, Clock, RotateCcw, Calendar, PieChart, ArrowUp,
  ArrowDown, BookMarked, ChevronRight, ChevronLeft,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./alluser.css";

type Role = "Student" | "Teacher";
type Status = "Active" | "Pending" | "Suspended";

interface UserRow {
  id: number;
  name: string;
  uid: string;
  role: Role;
  email: string;
  main: string;
  sub: string;
  date: string;
  time: string;
  status: Status;
  ts: number;
}

const USERS: UserRow[] = [
  { id: 1, name: "Ali Raza", uid: "STL-0042", role: "Student", email: "ali.raza@example.com", main: "BSCS Semester 3", sub: "Data Structures", date: "22 May 2025", time: "10:24 AM", status: "Active", ts: 7 },
  { id: 2, name: "Sara Ahmed", uid: "STL-01041", role: "Student", email: "sara.ahmed@example.com", main: "BSCS Semester 2", sub: "Programming", date: "20 May 2025", time: "09:17 AM", status: "Active", ts: 6 },
  { id: 3, name: "Usman Khan", uid: "TCH-2031", role: "Teacher", email: "usman.khan@example.com", main: "Computer Science", sub: "3 classes", date: "18 May 2025", time: "02:45 PM", status: "Active", ts: 5 },
  { id: 4, name: "Ayesha Khan", uid: "STL-1041", role: "Student", email: "ayesha.khan@example.com", main: "BSCS Semester 3", sub: "Data Structures", date: "17 May 2025", time: "11:32 AM", status: "Pending", ts: 4 },
  { id: 5, name: "Bilal Ahmed", uid: "TCH-2028", role: "Teacher", email: "bilal.ahmed@example.com", main: "Mathematics", sub: "2 classes", date: "16 May 2025", time: "04:20 PM", status: "Active", ts: 3 },
  { id: 6, name: "Hira Fatima", uid: "STL-1035", role: "Student", email: "hira.fatima@example.com", main: "BSCS Semester 1", sub: "Intro to CS", date: "14 May 2025", time: "01:15 PM", status: "Suspended", ts: 2 },
  { id: 7, name: "Zain Ali", uid: "TCH-2024", role: "Teacher", email: "zain.ali@example.com", main: "Programming", sub: "4 classes", date: "12 May 2025", time: "09:50 AM", status: "Active", ts: 1 },
];

const RECENT = [
  { name: "Muhammad Zeeshan", meta: "Student • 2 hours ago" },
  { name: "Laiba Fatima", meta: "Student • 5 hours ago" },
  { name: "Hassan Raza", meta: "Teacher • 7 hours ago" },
];

const AVATAR_COLORS = ["#6d4de0", "#e0574d", "#2f9e8f", "#d98a1f", "#3b82c4", "#b04fb8", "#4a7c3f"];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

type Tab = "all" | "students" | "teachers" | "pending";

export default function AllUser() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [cls, setCls] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<number[]>([]);

  const classOptions = useMemo(
    () => Array.from(new Set(USERS.map((u) => u.main))),
    []
  );

  const filtered = useMemo(() => {
    let list = USERS.filter((u) => {
      if (tab === "students" && u.role !== "Student") return false;
      if (tab === "teachers" && u.role !== "Teacher") return false;
      if (tab === "pending" && u.status !== "Pending") return false;
      if (status !== "all" && u.status !== status) return false;
      if (cls !== "all" && u.main !== cls) return false;
      const q = search.trim().toLowerCase();
      if (q && !(`${u.name} ${u.email} ${u.uid}`.toLowerCase().includes(q))) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "newest") return b.ts - a.ts;
      if (sort === "oldest") return a.ts - b.ts;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [tab, search, status, cls, sort]);

  const allChecked = filtered.length > 0 && filtered.every((u) => selected.includes(u.id));

  const toggleAll = () =>
    setSelected(allChecked ? [] : filtered.map((u) => u.id));
  const toggleOne = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const clearFilters = () => {
    setSearch(""); setStatus("all"); setCls("all"); setSort("newest"); setTab("all");
  };

  const stats = [
    { label: "Total Users", value: "1,334", icon: User, tone: "blue", trend: "12%", up: true, vs: "vs. last month" },
    { label: "Students", value: "1,248", icon: GraduationCap, tone: "purple", trend: "14%", up: true, vs: "vs. last month" },
    { label: "Teachers", value: "86", icon: BookMarked, tone: "violet", trend: "6%", up: true, vs: "vs. last month" },
    { label: "Pending Approvals", value: "12", icon: Clock, tone: "orange", trend: "25%", up: false, vs: "vs. last week" },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All Users (1,334)" },
    { key: "students", label: "Students (1,248)" },
    { key: "teachers", label: "Teachers (86)" },
    { key: "pending", label: "Pending (12)" },
  ];

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="au-app">
          <div className="au-content">
            {/* LEFT */}
            <div className="au-left">
              <div className="au-hero">
                <div className="au-hero-icon"><Users size={26} /></div>
                <div>
                  <h1>All Users</h1>
                  <p>Manage students and teachers across your platform.</p>
                </div>
              </div>

              <div className="au-stats">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="au-stat" key={s.label}>
                      <div className={`au-stat-icon ${s.tone}`}><Icon size={22} /></div>
                      <div>
                        <span className="au-stat-label">{s.label}</span>
                        <h3>{s.value}</h3>
                        <p className={s.up ? "up" : "down"}>
                          {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.trend}
                        </p>
                        <small>{s.vs}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="au-card">
                <div className="au-tabs">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      className={tab === t.key ? "active" : ""}
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="au-filters">
                  <div className="au-filter-search">
                    <Search size={15} />
                    <input
                      placeholder="Search by name, email or user ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="au-select">
                    <label>Account Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="all">All statuses</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="au-select">
                    <label>Class / Subject</label>
                    <select value={cls} onChange={(e) => setCls(e.target.value)}>
                      <option value="all">All</option>
                      {classOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="au-select">
                    <label>Sort</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                  <button className="au-clear" onClick={clearFilters}>
                    <RotateCcw size={13} /> Clear Filters
                  </button>
                </div>

                <div className="au-table-wrap">
                  <table className="au-table">
                    <thead>
                      <tr>
                        <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Class / Subject</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(u.id)}
                              onChange={() => toggleOne(u.id)}
                            />
                          </td>
                          <td>
                            <div className="au-user">
                              <div
                                className="au-avatar lg"
                                style={{ background: AVATAR_COLORS[(u.id - 1) % AVATAR_COLORS.length] }}
                              >
                                {initials(u.name)}
                              </div>
                              <div>
                                <strong>{u.name}</strong>
                                <span>ID: {u.uid}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`au-role ${u.role.toLowerCase()}`}>{u.role}</span>
                          </td>
                          <td className="au-email">{u.email}</td>
                          <td>
                            <div className="au-two">
                              <strong>{u.main}</strong>
                              <span>{u.sub}</span>
                            </div>
                          </td>
                          <td>
                            <div className="au-two">
                              <strong>{u.date}</strong>
                              <span>{u.time}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`au-status ${u.status.toLowerCase()}`}>{u.status}</span>
                          </td>
                          <td>
                            <div className="au-actions">
                              <button title="View"><Eye size={15} /></button>
                              <button title="More"><MoreVertical size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={8} className="au-empty">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="au-pagination">
                  <span>
                    Showing {filtered.length ? 1 : 0} to {filtered.length} of {filtered.length} users
                  </span>
                  <div className="au-pages">
                    <button><ChevronLeft size={14} /></button>
                    <button className="active">1</button>
                    <button><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="au-right">
              <div className="au-panel">
                <h4><Zap size={16} /> Quick Actions</h4>
                <button className="au-qa primary"><Plus size={16} /> Add User</button>
                <button className="au-qa"><Download size={16} /> Export Users</button>
                <button className="au-qa">
                  <UserCheck size={16} /> View Pending Approvals
                  <em className="au-badge solid">12</em>
                </button>
                <button className="au-qa"><Shield size={16} /> Manage Roles</button>
              </div>

              <div className="au-panel">
                <div className="au-panel-head">
                  <h4><PieChart size={16} /> User Distribution</h4>
                  <a href="#">View Details →</a>
                </div>
                <div className="au-dist">
                  <div className="au-donut">
                    <div className="au-donut-inner">
                      <strong>1,334</strong>
                      <span>Total Users</span>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <i style={{ background: "#5b3fd6" }} />
                      <div><strong>Students</strong><span>93.6% (1,248)</span></div>
                    </li>
                    <li>
                      <i style={{ background: "#b9a8f5" }} />
                      <div><strong>Teachers</strong><span>6.4% (86)</span></div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="au-panel">
                <div className="au-panel-head">
                  <h4><Calendar size={16} /> Recently Joined</h4>
                  <a href="#">View All →</a>
                </div>
                {RECENT.map((r, i) => (
                  <div className="au-recent" key={r.name}>
                    <div
                      className="au-avatar lg"
                      style={{ background: AVATAR_COLORS[(i + 3) % AVATAR_COLORS.length] }}
                    >
                      {initials(r.name)}
                    </div>
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.meta}</span>
                    </div>
                    <ChevronRight size={15} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}