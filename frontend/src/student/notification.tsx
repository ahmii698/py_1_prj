import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  BellRing,
  BellPlus,
  CalendarDays,
  CalendarCheck,
  CalendarPlus,
  ClipboardCheck,
  Trophy,
  FileText,
  Star,
  Settings,
  Lightbulb,
  Target,
  CheckCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Bot,
  Sparkles,
  Layers,
  Flame,
  Wrench,
  User,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./notification.css";

/* ---------------- TYPES + DATA ---------------- */

type Category = "notification" | "reminder" | "system" | "update";
type Tab = "all" | Category;

interface Item {
  id: number;
  title: string;
  text: string;
  time: string;
  cat: Category;
  tag: string;
  tagTone: string;
  tone: string;
  icon: ReactNode;
  unread: boolean;
}

const initialItems: Item[] = [
  { id: 1, title: "Study Session Reminder", text: 'Your study session for "Data Structures & Algorithms" is today at 10:00 AM.', time: "2 hours ago", cat: "reminder", tag: "Reminder", tagTone: "violet", tone: "violet", icon: <CalendarDays size={18} />, unread: true },
  { id: 2, title: "Quiz Completed", text: 'You completed the "Python Basics Quiz" with 85% score. Great job!', time: "4 hours ago", cat: "notification", tag: "Notification", tagTone: "green", tone: "green", icon: <ClipboardCheck size={18} />, unread: true },
  { id: 3, title: "New Achievement Unlocked", text: 'Congratulations! You\'ve unlocked the "Quick Learner" achievement.', time: "6 hours ago", cat: "notification", tag: "Achievement", tagTone: "purple", tone: "orange", icon: <Trophy size={18} />, unread: true },
  { id: 4, title: "New Study Material", text: 'A new revision material has been added for "Database Systems".', time: "8 hours ago", cat: "update", tag: "Update", tagTone: "blue", tone: "blue", icon: <FileText size={18} />, unread: false },
  { id: 5, title: "Reminder: Assignment Due", text: 'Your "Web Development Assignment" is due in 2 days (May 24, 2025).', time: "12 hours ago", cat: "reminder", tag: "Reminder", tagTone: "orange", tone: "red", icon: <BellRing size={18} />, unread: true },
  { id: 6, title: "Personalized Recommendation", text: 'Based on your recent performance, we recommend "Algorithms Revision".', time: "1 day ago", cat: "notification", tag: "Notification", tagTone: "green", tone: "green", icon: <Star size={18} />, unread: true },
  { id: 7, title: "System Update", text: "We've improved the flashcards feature with better performance and new themes.", time: "1 day ago", cat: "system", tag: "System", tagTone: "gray", tone: "gray", icon: <Settings size={18} />, unread: false },
  { id: 8, title: "Study Goal Progress", text: "You're 75% complete with your monthly study goal. Keep it up!", time: "2 days ago", cat: "notification", tag: "Notification", tagTone: "green", tone: "green", icon: <CalendarCheck size={18} />, unread: false },
  { id: 9, title: "AI Suggestion", text: 'Try the new "Machine Learning" flashcards to strengthen your concepts.', time: "2 days ago", cat: "update", tag: "Update", tagTone: "blue", tone: "blue", icon: <Lightbulb size={18} />, unread: false },
  { id: 10, title: "Document Processed", text: 'Your uploaded PDF "DSA_Notes.pdf" has been processed. You can now generate a quiz.', time: "2 days ago", cat: "notification", tag: "Notification", tagTone: "green", tone: "blue", icon: <FileText size={18} />, unread: false },
  { id: 11, title: "Quiz Reminder: Python Basics", text: "Your Python Basics quiz is scheduled for today at 2:00 PM.", time: "3 days ago", cat: "reminder", tag: "Reminder", tagTone: "violet", tone: "violet", icon: <ClipboardCheck size={18} />, unread: true },
  { id: 12, title: "Revision Reminder", text: 'Revise "Database Systems" flashcards on May 26 at 10:00 AM.', time: "3 days ago", cat: "reminder", tag: "Reminder", tagTone: "violet", tone: "blue", icon: <Layers size={18} />, unread: true },
  { id: 13, title: "Weekly Goal Review", text: "Review your weekly goals on May 27 at 9:00 AM.", time: "3 days ago", cat: "reminder", tag: "Reminder", tagTone: "orange", tone: "orange", icon: <Target size={18} />, unread: true },
  { id: 14, title: "Streak Reminder", text: "Study today to keep your 7 day streak going!", time: "4 days ago", cat: "reminder", tag: "Reminder", tagTone: "orange", tone: "orange", icon: <Flame size={18} />, unread: false },
  { id: 15, title: "Maintenance Scheduled", text: "Scheduled maintenance on May 28 from 2:00 AM to 3:00 AM.", time: "4 days ago", cat: "system", tag: "System", tagTone: "gray", tone: "gray", icon: <Wrench size={18} />, unread: false },
  { id: 16, title: "New Flashcard Deck Added", text: 'A new deck "Computer Networks" is now available.', time: "5 days ago", cat: "update", tag: "Update", tagTone: "blue", tone: "blue", icon: <Layers size={18} />, unread: false },
  { id: 17, title: "Profile Updated", text: "Your profile information was updated successfully.", time: "6 days ago", cat: "system", tag: "System", tagTone: "gray", tone: "gray", icon: <User size={18} />, unread: false },
  { id: 18, title: "New Feature: Dark Mode", text: "Dark mode is now available. Switch it from the header.", time: "1 week ago", cat: "update", tag: "Update", tagTone: "blue", tone: "violet", icon: <Sparkles size={18} />, unread: false },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "notification", label: "Notifications" },
  { key: "reminder", label: "Reminders" },
  { key: "system", label: "System" },
  { key: "update", label: "Updates" },
];

const PER_PAGE = 10;

/* calendar: May 2025 starts on Thursday */
const LEAD = 4;
const DAYS_IN_MONTH = 31;
const TODAY = 20;
const eventDots: Record<number, "violet" | "orange"> = {
  2: "violet",
  9: "violet",
  10: "violet",
  16: "violet",
  18: "violet",
  23: "violet",
  24: "violet",
  25: "orange",
  27: "violet",
  28: "violet",
};

const upcoming = [
  { title: "Study Session - DSA", time: "Today, 10:00 AM", tag: "Study", tone: "violet", icon: <CalendarDays size={15} /> },
  { title: "Quiz - Python Basics", time: "Today, 2:00 PM", tag: "Quiz", tone: "green", icon: <ClipboardCheck size={15} /> },
  { title: "Assignment Submission", time: "May 24, 2025, 11:59 PM", tag: "Assignment", tone: "orange", icon: <FileText size={15} /> },
  { title: "Revision - Database Systems", time: "May 26, 2025, 10:00 AM", tag: "Revision", tone: "blue", icon: <Layers size={15} /> },
  { title: "Weekly Goal Review", time: "May 27, 2025, 09:00 AM", tag: "Goal", tone: "purple", icon: <Target size={15} /> },
];

const quickActions = [
  { label: "Create Study Session", icon: <CalendarPlus size={18} /> },
  { label: "Set Reminder", icon: <BellPlus size={18} /> },
  { label: "View Calendar", icon: <CalendarDays size={18} /> },
  { label: "Manage Goals", icon: <Target size={18} /> },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---------------- COMPONENT ---------------- */

function NotificationsPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<number | null>(null);

  const filtered = tab === "all" ? items : items.filter((i) => i.cat === tab);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  const unreadOf = (key: Tab) =>
    items.filter((i) => i.unread && (key === "all" || i.cat === key)).length;

  const changeTab = (key: Tab) => {
    setTab(key);
    setPage(1);
    setMenuId(null);
  };

  const markAll = () => setItems((l) => l.map((i) => ({ ...i, unread: false })));

  const toggleRead = (id: number) => {
    setItems((l) => l.map((i) => (i.id === id ? { ...i, unread: !i.unread } : i)));
    setMenuId(null);
  };

  const remove = (id: number) => {
    setItems((l) => l.filter((i) => i.id !== id));
    setMenuId(null);
  };

  return (
    <div className="nt-shell">
      <Sidebar />

      <div className="nt-main">
        <Header />

        <div className="nt-content">
          {/* ============ CENTER ============ */}
          <div className="nt-center">
            {/* Banner */}
            <div className="nt-banner">
              <span className="nt-banner-icon">
                <Bell size={26} />
              </span>
              <div>
                <h1 className="nt-title">Notifications &amp; Reminders</h1>
                <p className="nt-subtitle">
                  Stay updated with your learning progress, important deadlines, and personalized reminders.
                </p>
              </div>
              <span className="nt-banner-note">
                Stay focused,
                <br />
                Stay consistent!
              </span>
            </div>

            {/* Tabs */}
            <div className="nt-tabs-row">
              <div className="nt-tabs">
                {tabs.map((t) => {
                  const count = t.key === "notification" || t.key === "reminder" ? unreadOf(t.key) : 0;
                  return (
                    <button
                      type="button"
                      key={t.key}
                      className={`nt-tab ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTab(t.key)}
                    >
                      {t.label}
                      {count > 0 && <span className="nt-tab-badge">{count}</span>}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="nt-markall" onClick={markAll}>
                <CheckCheck size={13} /> Mark all as read
              </button>
            </div>

            {/* List */}
            <div className="nt-card nt-list-card">
              {visible.length === 0 && <p className="nt-empty">No notifications here.</p>}

              {visible.map((n) => (
                <div className={`nt-item ${n.unread ? "unread" : ""}`} key={n.id}>
                  <span className={`nt-item-icon ${n.tone}`}>{n.icon}</span>
                  <div className="nt-item-body">
                    <p className="nt-item-title">
                      {n.title}
                      {n.unread && <i className="nt-unread-dot" />}
                    </p>
                    <p className="nt-item-text">{n.text}</p>
                  </div>
                  <span className="nt-item-time">{n.time}</span>
                  <span className={`nt-tag ${n.tagTone}`}>
                    <i />
                    {n.tag}
                  </span>
                  <div className="nt-menu-wrap">
                    <button
                      type="button"
                      className="nt-dots"
                      aria-label="More"
                      onClick={() => setMenuId(menuId === n.id ? null : n.id)}
                    >
                      <MoreVertical size={15} />
                    </button>
                    {menuId === n.id && (
                      <div className="nt-menu">
                        <button type="button" onClick={() => toggleRead(n.id)}>
                          {n.unread ? "Mark as read" : "Mark as unread"}
                        </button>
                        <button type="button" className="danger" onClick={() => remove(n.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="nt-foot">
              <p>
                {filtered.length === 0
                  ? "Showing 0 notifications"
                  : `Showing ${start + 1} to ${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} notifications`}
              </p>
              <div className="nt-pager">
                <button
                  type="button"
                  className="nt-page-btn"
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`nt-page-btn ${p === safePage ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  className="nt-page-btn"
                  onClick={() => setPage(Math.min(pages, safePage + 1))}
                  disabled={safePage === pages}
                  aria-label="Next page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="nt-right">
            {/* Calendar */}
            <div className="nt-card">
              <div className="nt-card-head">
                <h3 className="nt-head-icon">
                  <CalendarDays size={15} /> Calendar
                </h3>
                <a href="#all" className="nt-link">
                  View Full Calendar <ArrowRight size={11} />
                </a>
              </div>

              <div className="nt-cal-nav">
                <button type="button" className="nt-cal-btn" aria-label="Previous month">
                  <ChevronLeft size={13} />
                </button>
                <b>May 2025</b>
                <button type="button" className="nt-cal-btn" aria-label="Next month">
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="nt-cal-grid">
                {weekDays.map((d) => (
                  <span className="nt-cal-wd" key={d}>
                    {d}
                  </span>
                ))}
                {Array.from({ length: LEAD }, (_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
                  const day = i + 1;
                  const dot = eventDots[day];
                  return (
                    <span className={`nt-cal-day ${day === TODAY ? "today" : ""}`} key={day}>
                      <b>{day}</b>
                      {dot && day !== TODAY && <i className={dot} />}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Upcoming reminders */}
            <div className="nt-card">
              <div className="nt-card-head">
                <h3 className="nt-head-icon">
                  <Bell size={15} /> Upcoming Reminders
                </h3>
                <a href="#all" className="nt-link">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <div className="nt-up-list">
                {upcoming.map((u) => (
                  <div className="nt-up" key={u.title}>
                    <span className={`nt-up-icon ${u.tone}`}>{u.icon}</span>
                    <div className="nt-up-info">
                      <p>{u.title}</p>
                      <span>{u.time}</span>
                    </div>
                    <span className={`nt-up-tag ${u.tone}`}>{u.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="nt-card">
              <div className="nt-card-head">
                <h3 className="nt-head-icon">
                  <Zap size={15} /> Quick Actions
                </h3>
              </div>
              <div className="nt-qa">
                {quickActions.map((q) => (
                  <button type="button" className="nt-qa-btn" key={q.label}>
                    <span>{q.icon}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo */}
            <div className="nt-promo">
              <div>
                <p className="nt-promo-title">You're doing great!</p>
                <p className="nt-promo-text">
                  Every notification brings you one step closer to your goals.
                </p>
                <div className="nt-promo-dots">
                  <i className="on" />
                  <i />
                  <i />
                </div>
              </div>
              <span className="nt-promo-art">
                <Bot size={44} />
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;