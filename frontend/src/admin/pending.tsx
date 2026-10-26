import { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Check,
  X,
  Mail,
  Clock,
  Filter,
  ShieldCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./pending.css";

/* ---------- Types & static data (baad mein API se replace kar lena) ---------- */

type UserType = "Student" | "Teacher";
type Status = "pending" | "approved" | "rejected";

interface RequestItem {
  id: string;
  name: string;
  type: UserType;
  email: string;
  date: string; // ISO
  status: Status;
}

const initialRequests: RequestItem[] = [
  { id: "STU-1042", name: "Usman Raza", type: "Student", email: "usman.raza@example.com", date: "2025-05-22T10:24:00", status: "pending" },
  { id: "STU-1041", name: "Ayesha Khan", type: "Student", email: "ayesha.khan@example.com", date: "2025-05-22T09:17:00", status: "pending" },
  { id: "TCH-2031", name: "Ali Hamza", type: "Teacher", email: "ali.hamza@example.com", date: "2025-05-21T16:32:00", status: "pending" },
  { id: "STU-1039", name: "Sana Zulfiqar", type: "Student", email: "sana.zulfiqar@example.com", date: "2025-05-21T14:18:00", status: "pending" },
  { id: "TCH-2028", name: "Bilal Ahmed", type: "Teacher", email: "bilal.ahmed@example.com", date: "2025-05-20T11:03:00", status: "pending" },
  { id: "STU-1037", name: "Sara Iqbal", type: "Student", email: "sara.iqbal@example.com", date: "2025-05-20T10:45:00", status: "pending" },
  { id: "TCH-2026", name: "Danish Shah", type: "Teacher", email: "danish.shah@example.com", date: "2025-05-19T17:32:00", status: "pending" },
  { id: "STU-1035", name: "Fatima Ali", type: "Student", email: "fatima.ali@example.com", date: "2025-05-19T12:16:00", status: "pending" },
  { id: "STU-1033", name: "Hira Mustafa", type: "Student", email: "hira.mustafa@example.com", date: "2025-05-18T09:28:00", status: "pending" },
  { id: "TCH-2024", name: "Zain Ul Abideen", type: "Teacher", email: "zain.abideen@example.com", date: "2025-05-17T15:42:00", status: "pending" },
  { id: "STU-1031", name: "Anum Shahzad", type: "Student", email: "anum.shahzad@example.com", date: "2025-05-17T11:07:00", status: "pending" },
  { id: "TCH-2022", name: "Hasan Raza", type: "Teacher", email: "hasan.raza@example.com", date: "2025-05-16T16:51:00", status: "pending" },
];

const PAGE_SIZE = 12;
const AVATAR_COLORS = ["#e3dcff", "#d6ebff", "#d8f5e8", "#ffe3ea", "#ffecd6", "#efe0ff"];
const AVATAR_TEXT = ["#5b3fe0", "#2f8ae8", "#16a870", "#ef4466", "#e8821c", "#a14de0"];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

type TypeFilter = "all" | UserType;
type StatusFilter = "all" | Status;
type RangeFilter = "all" | "7" | "30";
type SortOrder = "newest" | "oldest";

/* ---------- Component ---------- */

export default function Pending() {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [range, setRange] = useState<RangeFilter>("7");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  /* Counts (sirf pending wali requests) */
  const pendingAll = requests.filter((r) => r.status === "pending");
  const pendingStudents = pendingAll.filter((r) => r.type === "Student").length;
  const pendingTeachers = pendingAll.filter((r) => r.type === "Teacher").length;

  /* Filtering + sorting */
  const refTime = Math.max(...requests.map((r) => new Date(r.date).getTime()));
  const q = search.trim().toLowerCase();

  const filtered = requests
    .filter((r) => (typeFilter === "all" ? true : r.type === typeFilter))
    .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
    .filter((r) => {
      if (range === "all") return true;
      const diffDays = (refTime - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= Number(range);
    })
    .filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === "newest" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  /* Actions */
  const setStatus = (ids: string[], status: Status) => {
    setRequests((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
    setSelected((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const approveOne = (r: RequestItem) => {
    setStatus([r.id], "approved");
    showToast(`${r.name} approved`);
  };

  const rejectOne = (r: RequestItem) => {
    setStatus([r.id], "rejected");
    showToast(`${r.name} rejected`);
  };

  const approveAll = () => {
    const ids = pendingAll.map((r) => r.id);
    if (!ids.length) return showToast("No pending requests");
    setStatus(ids, "approved");
    showToast(`${ids.length} requests approved`);
  };

  const rejectAll = () => {
    const ids = pendingAll.map((r) => r.id);
    if (!ids.length) return showToast("No pending requests");
    setStatus(ids, "rejected");
    showToast(`${ids.length} requests rejected`);
  };

  const toggleRow = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageRows.some((r) => r.id === id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageRows.map((r) => r.id)])));
    }
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("pending");
    setRange("7");
    setSort("newest");
    setSearch("");
    setPage(1);
  };

  const onTypeChange = (v: TypeFilter) => {
    setTypeFilter(v);
    setPage(1);
  };

  return (
    <div className="pend-page">
      <Sidebar />
      <Header />

      <main className="pend-main">
        <div className="pend-grid">
          {/* ================= LEFT ================= */}
          <div className="pend-left">
            {/* Banner */}
            <section className="pend-banner">
              <div className="pend-banner-left">
                <div className="pend-banner-icon">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h1>Pending Approvals</h1>
                  <p>Review and approve/reject new student and teacher registration requests.</p>
                </div>
              </div>
              <div className="pend-banner-art">🧑‍💼</div>
            </section>

            <section className="pend-card">
              {/* Tabs */}
              <div className="pend-tabs">
                <button
                  className={typeFilter === "all" ? "active" : ""}
                  onClick={() => onTypeChange("all")}
                >
                  All ({pendingAll.length})
                </button>
                <button
                  className={typeFilter === "Student" ? "active" : ""}
                  onClick={() => onTypeChange("Student")}
                >
                  Students ({pendingStudents})
                </button>
                <button
                  className={typeFilter === "Teacher" ? "active" : ""}
                  onClick={() => onTypeChange("Teacher")}
                >
                  Teachers ({pendingTeachers})
                </button>
              </div>

              {/* Toolbar */}
              <div className="pend-toolbar">
                <div className="pend-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search by name, email or ID..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="pend-select">
                  <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
                  >
                    <option value="all">All Types</option>
                    <option value="Student">Students</option>
                    <option value="Teacher">Teachers</option>
                  </select>
                  <ChevronDown size={14} />
                </div>

                <div className="pend-select">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as StatusFilter);
                      setPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown size={14} />
                </div>

                <div className="pend-select">
                  <ArrowUpDown size={13} className="lead" />
                  <select
                    className="with-lead"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOrder)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="pend-table-wrap">
                <table className="pend-table">
                  <thead>
                    <tr>
                      <th className="chk">
                        <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} />
                      </th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Email</th>
                      <th>Registration Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="pend-empty">
                          No requests found.
                        </td>
                      </tr>
                    )}
                    {pageRows.map((r, i) => (
                      <tr key={r.id}>
                        <td className="chk">
                          <input
                            type="checkbox"
                            checked={selected.includes(r.id)}
                            onChange={() => toggleRow(r.id)}
                          />
                        </td>
                        <td>
                          <div className="pend-user">
                            <span
                              className="pend-avatar"
                              style={{
                                background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                color: AVATAR_TEXT[i % AVATAR_TEXT.length],
                              }}
                            >
                              {initials(r.name)}
                            </span>
                            <div>
                              <b>{r.name}</b>
                              <small>ID: {r.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`pend-type ${r.type.toLowerCase()}`}>{r.type}</span>
                        </td>
                        <td className="pend-email">{r.email}</td>
                        <td>
                          <div className="pend-date">
                            <span>{fmtDate(r.date)}</span>
                            <small>{fmtTime(r.date)}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`pend-status ${r.status}`}>
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="pend-actions">
                            <button
                              className="pend-approve"
                              disabled={r.status !== "pending"}
                              onClick={() => approveOne(r)}
                            >
                              Approve
                            </button>
                            <button
                              className="pend-reject"
                              disabled={r.status !== "pending"}
                              onClick={() => rejectOne(r)}
                            >
                              Reject
                            </button>
                            <button className="pend-eye" title="View details">
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="pend-footer">
                <span>
                  Showing {filtered.length === 0 ? 0 : startIdx + 1} to{" "}
                  {Math.min(startIdx + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
                  {statusFilter === "all" ? "" : statusFilter} requests
                </span>
                <div className="pend-pager">
                  <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={p === safePage ? "active" : ""}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <aside className="pend-right">
            <div className="pend-card pend-summary">
              <h2>
                <Clock size={16} /> Pending Requests
              </h2>
              <div className="pend-total">
                <strong>{pendingAll.length}</strong>
                <span>Total Pending</span>
                <div className="pend-total-art">
                  <Users size={30} />
                </div>
              </div>
              <div className="pend-split">
                <div>
                  <strong>{pendingStudents}</strong>
                  <span>Students</span>
                </div>
                <div className="teachers">
                  <strong>{pendingTeachers}</strong>
                  <span>Teachers</span>
                </div>
              </div>
            </div>

            <div className="pend-card">
              <h2>
                <Zap size={16} /> Quick Actions
              </h2>
              <div className="pend-quick">
                <button className="primary" onClick={approveAll}>
                  <Check size={15} /> Approve All Pending
                </button>
                <button className="danger" onClick={rejectAll}>
                  <X size={15} /> Reject All Pending
                </button>
                <button
                  className="outline"
                  onClick={() => showToast("Notification sent to pending users")}
                >
                  <Mail size={15} /> Send Notification
                </button>
              </div>
            </div>

            <div className="pend-card">
              <div className="pend-filter-head">
                <h2>
                  <Filter size={16} /> Filters
                </h2>
                <button className="pend-clear" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              <label className="pend-label">User Type</label>
              <div className="pend-select block">
                <select
                  value={typeFilter}
                  onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
                >
                  <option value="all">All Types</option>
                  <option value="Student">Students</option>
                  <option value="Teacher">Teachers</option>
                </select>
                <ChevronDown size={14} />
              </div>

              <label className="pend-label">Status</label>
              <div className="pend-select block">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as StatusFilter);
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown size={14} />
              </div>

              <label className="pend-label">Date Range</label>
              <div className="pend-select block">
                <Calendar size={14} className="lead" />
                <select
                  className="with-lead"
                  value={range}
                  onChange={(e) => {
                    setRange(e.target.value as RangeFilter);
                    setPage(1);
                  }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="pend-note">
              <ShieldCheck size={22} />
              <div>
                <b>Note</b>
                <p>
                  Once approved, the user will be able to login to the platform and access their
                  dashboard based on their role.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {toast && <div className="pend-toast">{toast}</div>}
    </div>
  );
}