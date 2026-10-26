import { useMemo, useState } from "react";
import {
  Bell,
  Flag,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  User,
  ClipboardCheck,
  CalendarDays,
  FileWarning,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Filter,
  Calendar,
  ChevronDown,
  Settings,
  Mail,
  type LucideIcon,
} from "lucide-react";

// ⚠️ Apne project ke hisaab se path adjust kar lena
import Sidebar from "./sidebar";
import Header from "./header";

import "./notification.css";

type NType = "announcement" | "quiz" | "student" | "assignment" | "system";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NType;
  hoursAgo: number;
  icon: LucideIcon;
  unread: boolean;
  alert?: boolean;
}

const TYPE_META: Record<NType, { label: string; summary: string }> = {
  announcement: { label: "Announcement", summary: "Announcement" },
  quiz: { label: "Quiz", summary: "Quiz" },
  student: { label: "Student", summary: "Student" },
  assignment: { label: "Assignment", summary: "Assignment" },
  system: { label: "System", summary: "System" },
};

const INITIAL: NotificationItem[] = [
  { id: 1, title: "New Announcement", message: 'You have a new announcement from the administration: "Midterm exam schedule has been updated."', type: "announcement", hoursAgo: 2, icon: Flag, unread: true },
  { id: 2, title: "Quiz Completed", message: 'Sara Ahmed completed "Data Structures Quiz 1" and scored 92%.', type: "quiz", hoursAgo: 3, icon: CheckCircle2, unread: false },
  { id: 3, title: "Low Performance Alert", message: "Usman Khalid's average score dropped below 60% in recent quizzes.", type: "student", hoursAgo: 4, icon: AlertTriangle, unread: true, alert: true },
  { id: 4, title: "Assignment Submitted", message: 'Fatima Zahra submitted "Arrays Assignment" for BSCS - Semester 3.', type: "assignment", hoursAgo: 6, icon: FileUp, unread: false },
  { id: 5, title: "New Student Enrolled", message: "Ahmed Raza has been added to your BSCS - Semester 3 class.", type: "student", hoursAgo: 8, icon: User, unread: true },
  { id: 6, title: "Quiz Published", message: '"C Programming Quiz 2" has been published and assigned to BSCS - Semester 3.', type: "quiz", hoursAgo: 10, icon: ClipboardCheck, unread: false },
  { id: 7, title: "Class Schedule Updated", message: "The schedule for BSCS - Semester 3 has been updated by the administration.", type: "system", hoursAgo: 12, icon: CalendarDays, unread: false },
  { id: 8, title: "Submission Overdue", message: '5 students have not submitted their assignment "Database Design" yet.', type: "assignment", hoursAgo: 24, icon: FileWarning, unread: false },
  { id: 9, title: "Quiz Results Available", message: 'Results for "Algorithms Practice Test" are now available. View details to check performance.', type: "quiz", hoursAgo: 26, icon: TrendingUp, unread: false },
  { id: 10, title: "System Update", message: "LearnIQ has been updated to version 1.2.0. Check out the new features and improvements.", type: "system", hoursAgo: 48, icon: ShieldAlert, unread: false },
  { id: 11, title: "Student Progress Update", message: "Hina Malik has completed 80% of the Operating Systems course.", type: "student", hoursAgo: 52, icon: User, unread: false },
  { id: 12, title: "New Student Enrolled", message: "Bilal Aslam has been added to your BSCS - Semester 5 class.", type: "student", hoursAgo: 60, icon: User, unread: false },
  { id: 13, title: "Quiz Completed", message: 'Zain Ali completed "Algorithms Practice Test" and scored 78%.', type: "quiz", hoursAgo: 72, icon: CheckCircle2, unread: false },
  { id: 14, title: "Quiz Published", message: '"Database Quiz 1" has been published and assigned to BSCS - Semester 5.', type: "quiz", hoursAgo: 80, icon: ClipboardCheck, unread: false },
  { id: 15, title: "Assignment Submitted", message: 'Ayesha Noor submitted "Linked List Assignment" for BSCS - Semester 3.', type: "assignment", hoursAgo: 96, icon: FileUp, unread: false },
  { id: 16, title: "Maintenance Scheduled", message: "Scheduled maintenance will take place this Sunday from 2:00 AM to 4:00 AM.", type: "system", hoursAgo: 100, icon: ShieldAlert, unread: false },
  { id: 17, title: "Low Attendance Alert", message: "Hamza Tariq has attended less than 70% of your classes this month.", type: "student", hoursAgo: 110, icon: AlertTriangle, unread: false, alert: true },
  { id: 18, title: "Room Changed", message: "Your BSCS - Semester 5 class has been moved to Room 204.", type: "system", hoursAgo: 120, icon: CalendarDays, unread: false },
  { id: 19, title: "Student Progress Update", message: "Maryam Iqbal improved her quiz average by 15% this week.", type: "student", hoursAgo: 126, icon: TrendingUp, unread: false },
  { id: 20, title: "New Student Enrolled", message: "Danish Shah has been added to your BSCS - Semester 3 class.", type: "student", hoursAgo: 132, icon: User, unread: false },
  { id: 21, title: "Profile Reminder", message: "Please complete your teacher profile to get personalised insights.", type: "system", hoursAgo: 140, icon: Settings, unread: false },
  { id: 22, title: "Password Changed", message: "Your account password was changed successfully.", type: "system", hoursAgo: 150, icon: ShieldAlert, unread: false },
  { id: 23, title: "Student Progress Update", message: "Rabia Anwar has completed all pending assignments.", type: "student", hoursAgo: 160, icon: User, unread: false },
  { id: 24, title: "Feature Available", message: "AI Teaching Insights is now available in your analytics section.", type: "system", hoursAgo: 165, icon: ShieldAlert, unread: false },
];

const TABS: { key: "all" | NType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "system", label: "System" },
  { key: "student", label: "Students" },
  { key: "quiz", label: "Quizzes" },
  { key: "assignment", label: "Assignments" },
  { key: "announcement", label: "Announcements" },
];

const RANGES = [
  { value: "24h", label: "Last 24 hours", hours: 24 },
  { value: "7d", label: "Last 7 days", hours: 24 * 7 },
  { value: "30d", label: "Last 30 days", hours: 24 * 30 },
  { value: "all", label: "All time", hours: Infinity },
];

const PAGE_SIZE = 10;

const timeAgo = (h: number) =>
  h < 24 ? `${h} hours ago` : `${Math.floor(h / 24)} day${h >= 48 ? "s" : ""} ago`;

export default function Notification() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL);
  const [tab, setTab] = useState<"all" | NType>("all");
  const [range, setRange] = useState("7d");
  const [typeFilter, setTypeFilter] = useState<"all" | NType>("all");
  const [page, setPage] = useState(1);

  const rangeHours = RANGES.find((r) => r.value === range)!.hours;

  // Date range + dropdown type filter (right panel)
  const inRange = useMemo(
    () =>
      items.filter(
        (n) => n.hoursAgo <= rangeHours && (typeFilter === "all" || n.type === typeFilter)
      ),
    [items, rangeHours, typeFilter]
  );

  const count = (t: "all" | NType) =>
    t === "all" ? inRange.length : inRange.filter((n) => n.type === t).length;

  const filtered = tab === "all" ? inRange : inRange.filter((n) => n.type === tab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const unreadCount = inRange.filter((n) => n.unread).length;

  const markRead = (id: number) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const clearFilters = () => {
    setRange("7d");
    setTypeFilter("all");
    setTab("all");
    setPage(1);
  };

  const summaryRows: { key: string; label: string; value: number; cls: string; icon: LucideIcon; dot?: boolean }[] = [
    { key: "total", label: "Total Notifications", value: count("all"), cls: "purple", icon: Bell },
    { key: "unread", label: "Unread", value: unreadCount, cls: "red", icon: Bell, dot: true },
    { key: "system", label: "System", value: count("system"), cls: "blue", icon: ShieldAlert },
    { key: "student", label: "Student", value: count("student"), cls: "pink", icon: User },
    { key: "quiz", label: "Quiz", value: count("quiz"), cls: "sky", icon: ClipboardCheck },
    { key: "assignment", label: "Assignment", value: count("assignment"), cls: "orange", icon: FileUp },
    { key: "announcement", label: "Announcement", value: count("announcement"), cls: "violet", icon: Flag },
  ];

  return (
    <div className="teacher-layout">
      <Sidebar />

      <div className="teacher-main">
        <Header />

        <div className="ntf-page">
          {/* ===== Left / main column ===== */}
          <section className="ntf-main">
            <div className="ntf-hero">
              <div className="ntf-hero-icon">
                <Bell size={26} />
              </div>
              <div>
                <h1>Notifications</h1>
                <p>Stay updated with the latest activities, student progress, quiz results and important announcements.</p>
              </div>
              <div className="ntf-hero-art" aria-hidden="true">
                <Bell size={54} />
              </div>
            </div>

            <div className="ntf-card">
              <div className="ntf-tabs">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`ntf-tab ${tab === t.key ? "active" : ""}`}
                    onClick={() => {
                      setTab(t.key);
                      setPage(1);
                    }}
                  >
                    {t.label}
                    <span className="ntf-tab-count">{count(t.key)}</span>
                  </button>
                ))}
              </div>

              <ul className="ntf-list">
                {visible.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li
                      key={n.id}
                      className={`ntf-item ${n.unread ? "unread" : ""}`}
                      onClick={() => markRead(n.id)}
                    >
                      <div className={`ntf-icon ${n.type}`}>
                        <Icon size={22} />
                      </div>

                      <div className="ntf-body">
                        <h3>{n.title}</h3>
                        <p>{n.message}</p>
                      </div>

                      <div className="ntf-meta">
                        <span className="ntf-time">{timeAgo(n.hoursAgo)}</span>
                        <span className={`ntf-tag ${n.type}`}>{TYPE_META[n.type].label}</span>
                      </div>

                      <span className={`ntf-dot ${n.alert ? "alert" : ""} ${n.unread ? "" : "read"}`} />
                      <ChevronRight size={16} className="ntf-arrow" />
                    </li>
                  );
                })}

                {visible.length === 0 && (
                  <li className="ntf-empty">No notifications found for these filters.</li>
                )}
              </ul>

              <div className="ntf-footer">
                <span>
                  Showing {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} notifications
                </span>

                <div className="ntf-pager">
                  <button disabled={current === 1} onClick={() => setPage(current - 1)}>
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} className={p === current ? "active" : ""} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}
                  <button disabled={current === totalPages} onClick={() => setPage(current + 1)}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Right column ===== */}
          <aside className="ntf-side">
            <div className="ntf-card ntf-panel">
              <h4 className="ntf-panel-title">
                <Filter size={15} /> Quick Filters
              </h4>

              <label className="ntf-label">Date Range</label>
              <div className="ntf-select">
                <Calendar size={15} />
                <select value={range} onChange={(e) => { setRange(e.target.value); setPage(1); }}>
                  {RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </div>

              <label className="ntf-label">Notification Type</label>
              <div className="ntf-select">
                <Bell size={15} />
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value as "all" | NType); setPage(1); }}
                >
                  <option value="all">All Types</option>
                  <option value="system">System</option>
                  <option value="student">Student</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="announcement">Announcement</option>
                </select>
                <ChevronDown size={15} />
              </div>

              <button className="ntf-clear" onClick={clearFilters}>Clear Filters</button>
            </div>

            <div className="ntf-card ntf-panel">
              <div className="ntf-panel-head">
                <h4 className="ntf-panel-title">
                  <Settings size={15} /> Notification Summary
                </h4>
                <button className="ntf-link" onClick={() => { setTab("all"); setPage(1); }}>View All →</button>
              </div>

              <ul className="ntf-summary">
                {summaryRows.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li key={r.key}>
                      <span className={`ntf-sum-icon ${r.cls}`}><Icon size={17} /></span>
                      <span className="ntf-sum-label">{r.label}</span>
                      <span className="ntf-sum-value">
                        {r.dot && <i className="ntf-red-dot" />}
                        {r.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="ntf-promo">
              <div>
                <h5>Never miss<br />an important update!</h5>
                <p>Get notified about your students, quizzes and class activities.</p>
              </div>
              <Mail size={56} className="ntf-promo-art" />
              <button onClick={markAllRead}>Mark All as Read</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}