import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Target,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Flame,
  Check,
  BookOpen,
  ClipboardList,
  ListChecks,
  Code2,
  FileText,
  Award,
  Trophy,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./schedule.css";

/* ---------------- DATA ---------------- */

type EventType = "study" | "quiz" | "task" | "personal";

interface CalEvent {
  day: number; // 0 = Sun
  title: string;
  start: number; // 24h decimal
  end: number;
  time: string;
  type: EventType;
}

const START_HOUR = 8;
const END_HOUR = 21;
const ROW = 44; // px per hour

const days = [
  { name: "Sun", date: "May 18" },
  { name: "Mon", date: "May 19" },
  { name: "Tue", date: "May 20" },
  { name: "Wed", date: "May 21" },
  { name: "Thu", date: "May 22" },
  { name: "Fri", date: "May 23" },
  { name: "Sat", date: "May 24" },
];

const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
  const h = START_HOUR + i;
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h > 12 ? h - 12 : h;
  return `${hh}:00 ${suffix}`;
});

const events: CalEvent[] = [
  { day: 0, title: "Data Structures", start: 9, end: 10.5, time: "09:00 - 10:30", type: "study" },
  { day: 0, title: "Quiz Practice", start: 11, end: 12, time: "11:00 - 12:00", type: "quiz" },
  { day: 0, title: "OOP Concepts", start: 14, end: 15.5, time: "02:00 - 03:30", type: "task" },
  { day: 0, title: "Workout", start: 17, end: 18, time: "05:00 - 06:00", type: "personal" },
  { day: 0, title: "Web Development", start: 19, end: 20.5, time: "07:00 - 08:30", type: "study" },

  { day: 1, title: "Database Systems", start: 10, end: 11.5, time: "10:00 - 11:30", type: "quiz" },
  { day: 1, title: "Task Review", start: 13, end: 13.5, time: "01:00 - 01:30", type: "task" },
  { day: 1, title: "Algorithms", start: 16, end: 17.5, time: "04:00 - 05:30", type: "study" },
  { day: 1, title: "Quiz Attempt", start: 19, end: 20, time: "07:00 - 08:00", type: "quiz" },

  { day: 2, title: "Linked Lists", start: 9, end: 10.5, time: "09:00 - 10:30", type: "study" },
  { day: 2, title: "Study Break", start: 11.5, end: 12.5, time: "12:00 - 12:30", type: "task" },
  { day: 2, title: "Programming", start: 15, end: 16.5, time: "03:00 - 04:30", type: "quiz" },
  { day: 2, title: "Personal Time", start: 18, end: 19, time: "06:00 - 07:00", type: "personal" },

  { day: 3, title: "Web Development", start: 10, end: 11.5, time: "10:00 - 11:30", type: "study" },
  { day: 3, title: "Quiz Practice", start: 12, end: 14, time: "12:00 - 02:00", type: "quiz" },
  { day: 3, title: "Computer Networks", start: 16, end: 17.5, time: "04:00 - 05:30", type: "quiz" },
  { day: 3, title: "Reading / Notes", start: 19, end: 20, time: "07:00 - 08:00", type: "task" },

  { day: 4, title: "Database Systems", start: 9, end: 10.5, time: "09:00 - 10:30", type: "study" },
  { day: 4, title: "Task Submission", start: 12, end: 13, time: "12:00 - 01:00", type: "task" },
  { day: 4, title: "Quiz Attempt", start: 15, end: 16, time: "03:00 - 04:00", type: "quiz" },
  { day: 4, title: "Workout", start: 18, end: 19, time: "06:00 - 07:00", type: "personal" },

  { day: 5, title: "Machine Learning", start: 10, end: 11.5, time: "10:00 - 11:30", type: "study" },
  { day: 5, title: "Revision", start: 14, end: 15, time: "02:00 - 03:00", type: "task" },
  { day: 5, title: "JavaScript Essentials", start: 17, end: 18.5, time: "05:00 - 06:30", type: "study" },

  { day: 6, title: "Final Quiz", start: 9, end: 10, time: "09:00 - 10:00", type: "quiz" },
  { day: 6, title: "React JS", start: 12, end: 13.5, time: "12:00 - 01:30", type: "study" },
  { day: 6, title: "Weekly Review", start: 16, end: 17, time: "04:00 - 05:00", type: "task" },
  { day: 6, title: "Free Time", start: 19, end: 20, time: "07:00 - 08:00", type: "personal" },
];

const stats = [
  { label: "Total Study Sessions", value: "24", note: "5 this week", icon: <CalendarDays size={18} />, tone: "violet", up: true },
  { label: "Study Hours", value: "18.6 hrs", note: "6% from last week", icon: <Clock size={18} />, tone: "indigo", up: true },
  { label: "Daily Goal", value: "2.0 hrs", note: "0.5 hrs today", icon: <Target size={18} />, tone: "purple", up: true },
  { label: "Completed Sessions", value: "18", note: "75% completion rate", icon: <CheckCircle2 size={18} />, tone: "blue", up: false },
];

const initialPlan = [
  { id: 1, title: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", status: "In Progress", done: true },
  { id: 2, title: "Quiz Practice", time: "11:00 AM - 12:00 PM", status: "Upcoming", done: false },
  { id: 3, title: "Task Submission", time: "01:00 PM - 01:30 PM", status: "Upcoming", done: false },
  { id: 4, title: "Web Development", time: "07:00 PM - 08:30 PM", status: "Upcoming", done: false },
];

const streakDays = [
  { d: "Mon", done: true },
  { d: "Tue", done: true },
  { d: "Wed", done: true },
  { d: "Thu", done: true },
  { d: "Fri", done: true },
  { d: "Sat", done: true },
  { d: "Sun", done: false },
  { d: "Mon", done: false },
];

const quickActions = [
  { label: "Add Study Session", icon: <Plus size={14} />, tone: "violet" },
  { label: "Add Task", icon: <ListChecks size={14} />, tone: "blue" },
  { label: "View Goals", icon: <Target size={14} />, tone: "green" },
  { label: "View Calendar", icon: <CalendarDays size={14} />, tone: "orange" },
];

const activity = [
  { title: "Completed quiz: Data Structures Quiz", sub: "Score: 90% • 2 hours ago", icon: <ClipboardList size={14} />, tone: "violet" },
  { title: "Study session completed", sub: "Web Development • 1 day ago", icon: <BookOpen size={14} />, tone: "blue" },
  { title: "New PDF uploaded", sub: "Python Basics.pdf • 1 day ago", icon: <FileText size={14} />, tone: "indigo" },
  { title: "Goal updated", sub: "Improve Quiz Score • 2 days ago", icon: <Target size={14} />, tone: "red" },
  { title: "Achievement unlocked", sub: "Consistent Learner • 2 days ago", icon: <Award size={14} />, tone: "blue" },
];

const monthly = [
  { label: "Study Sessions", value: "18/24", color: "#7c4dff" },
  { label: "Quizzes", value: "12/15", color: "#3b9cff" },
  { label: "Tasks", value: "8/10", color: "#22b573" },
  { label: "Goals", value: "3/5", color: "#fbb02d" },
];

const upcoming = [
  { title: "Data Structures & Algorithms", time: "Today • 09:00 AM - 10:30 AM", icon: <BookOpen size={16} />, tone: "violet" },
  { title: "Quiz Practice", time: "Today • 11:00 AM - 12:00 PM", icon: <ClipboardList size={16} />, tone: "blue" },
  { title: "Task Submission", time: "Today • 01:00 PM - 01:30 PM", icon: <ListChecks size={16} />, tone: "green" },
  { title: "Web Development", time: "Today • 07:00 PM - 08:30 PM", icon: <Code2 size={16} />, tone: "violet" },
];

const goals = [
  { title: "Complete DSA Course", sub: "12/15 chapters", value: 80, pct: 50, color: "#7c4dff" },
  { title: "Improve Quiz Score", sub: "Target: 80% average", value: 68, pct: 66, color: "#3b9cff" },
  { title: "Study 5 Hours Daily", sub: "This week", value: 30, pct: 30, color: "#14b88a", right: "3/5" },
];

/* ---------------- HELPERS ---------------- */

const DR = 52;
const DCIRC = 2 * Math.PI * DR;
const OVERALL = 78;

const GR = 14;
const GCIRC = 2 * Math.PI * GR;

/* ---------------- COMPONENT ---------------- */

function Schedule() {
  const [tab, setTab] = useState<"calendar" | "weekly" | "monthly">("calendar");
  const [plan, setPlan] = useState(initialPlan);

  const togglePlan = (id: number) =>
    setPlan((p) => p.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const gridHeight = (END_HOUR - START_HOUR) * ROW;

  return (
    <div className="sc-shell">
      <Sidebar />

      <div className="sc-main">
        <Header />

        <div className="sc-content">
          {/* ============ CENTER ============ */}
          <div className="sc-center">
            {/* Banner */}
            <div className="sc-banner">
              <span className="sc-banner-icon">
                <CalendarDays size={26} />
              </span>
              <div>
                <h1 className="sc-title">Study Schedule / Planner</h1>
                <p className="sc-subtitle">Plan your study sessions, stay consistent, and achieve your learning goals.</p>
              </div>
              <span className="sc-banner-note">
                Better
                <br />
                Planning
                <br />
                Bigger Progress!
              </span>
            </div>

            {/* Stats */}
            <div className="sc-stats-wrap">
              <button type="button" className="sc-create">
                <Plus size={11} /> Create New Session
              </button>
              <div className="sc-stats">
                {stats.map((s) => (
                  <div className="sc-card sc-stat" key={s.label}>
                    <span className={`sc-stat-icon ${s.tone}`}>{s.icon}</span>
                    <div>
                      <p className="sc-stat-label">{s.label}</p>
                      <p className="sc-stat-value">{s.value}</p>
                      <p className={`sc-stat-note ${s.up ? "up" : ""}`}>
                        {s.up && "↑ "}
                        {s.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="sc-card sc-cal">
              <div className="sc-cal-bar">
                <div className="sc-tabs">
                  <button type="button" className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>
                    Calendar
                  </button>
                  <button type="button" className={tab === "weekly" ? "active" : ""} onClick={() => setTab("weekly")}>
                    Weekly View
                  </button>
                  <button type="button" className={tab === "monthly" ? "active" : ""} onClick={() => setTab("monthly")}>
                    Monthly View
                  </button>
                </div>

                <div className="sc-nav">
                  <button type="button" className="sc-nav-btn" aria-label="Previous">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="sc-nav-month">May 2025</span>
                  <button type="button" className="sc-nav-btn" aria-label="Next">
                    <ChevronRight size={14} />
                  </button>
                  <button type="button" className="sc-today">
                    Today
                  </button>
                </div>

                <div className="sc-legend">
                  <span><i className="study" /> Study</span>
                  <span><i className="quiz" /> Quiz</span>
                  <span><i className="task" /> Task</span>
                  <span><i className="personal" /> Personal</span>
                </div>
              </div>

              <div className="sc-grid-scroll">
                <div className="sc-grid">
                  <div className="sc-grid-head">
                    <div />
                    {days.map((d) => (
                      <div className="sc-day-head" key={d.name}>
                        <b>{d.name}</b>
                        <span>{d.date}</span>
                      </div>
                    ))}
                  </div>

                  <div className="sc-grid-body" style={{ height: gridHeight }}>
                    <div className="sc-times">
                      {hours.map((h) => (
                        <span key={h} style={{ height: ROW }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {days.map((d, di) => (
                      <div
                        className="sc-day-col"
                        key={d.name}
                        style={{ backgroundSize: `100% ${ROW}px` }}
                      >
                        {events
                          .filter((e) => e.day === di)
                          .map((e) => (
                            <div
                              key={`${e.day}-${e.title}-${e.start}`}
                              className={`sc-event ${e.type}`}
                              style={{
                                top: (e.start - START_HOUR) * ROW + 1,
                                height: (e.end - e.start) * ROW - 3,
                              }}
                            >
                              <b>{e.title}</b>
                              <span>{e.time}</span>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="sc-bottom">
              <div className="sc-card">
                <div className="sc-card-head">
                  <h3>Today's Plan</h3>
                  <a href="#all" className="sc-link">
                    View All <ArrowRight size={11} />
                  </a>
                </div>
                <div className="sc-plan">
                  {plan.map((p) => (
                    <div className="sc-plan-item" key={p.id}>
                      <button
                        type="button"
                        className={`sc-check ${p.done ? "done" : ""}`}
                        onClick={() => togglePlan(p.id)}
                        aria-label={`Toggle ${p.title}`}
                      >
                        {p.done && <Check size={11} />}
                      </button>
                      <div className="sc-plan-info">
                        <p>{p.title}</p>
                        <span>{p.time}</span>
                      </div>
                      <span className={`sc-status ${p.status === "In Progress" ? "progress" : "upcoming"}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sc-mid-col">
                <div className="sc-card">
                  <div className="sc-card-head">
                    <h3 className="sc-head-icon">
                      <Flame size={15} className="flame" /> Study Streak
                    </h3>
                    <a href="#all" className="sc-link">
                      View Details <ArrowRight size={11} />
                    </a>
                  </div>
                  <p className="sc-streak-days">7 Days</p>
                  <p className="sc-streak-note">Keep your streak going!</p>
                  <div className="sc-streak-row">
                    {streakDays.map((s, i) => (
                      <div className="sc-streak-day" key={i}>
                        <span className={`sc-streak-dot ${s.done ? "done" : ""}`}>{s.done && <Check size={10} />}</span>
                        <span>{s.d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sc-card">
                  <div className="sc-card-head">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="sc-qa">
                    {quickActions.map((q) => (
                      <button type="button" className="sc-qa-btn" key={q.label}>
                        <span className={`sc-qa-icon ${q.tone}`}>{q.icon}</span>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sc-card">
                <div className="sc-card-head">
                  <h3>Recent Activity</h3>
                  <a href="#all" className="sc-link">
                    View All <ArrowRight size={11} />
                  </a>
                </div>
                <div className="sc-activity">
                  {activity.map((a) => (
                    <div className="sc-act" key={a.title}>
                      <span className={`sc-act-icon ${a.tone}`}>{a.icon}</span>
                      <div>
                        <p>{a.title}</p>
                        <span>{a.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="sc-right">
            <div className="sc-card">
              <div className="sc-card-head">
                <h3>Monthly Progress</h3>
                <div className="sc-month-pill">
                  May 2025 <ChevronRight size={11} className="rot" />
                </div>
              </div>
              <div className="sc-monthly">
                <div className="sc-donut">
                  <svg viewBox="0 0 140 140">
                    <defs>
                      <linearGradient id="scGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7c4dff" />
                        <stop offset="100%" stopColor="#3b9cff" />
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r={DR} className="sc-donut-bg" />
                    <circle
                      cx="70"
                      cy="70"
                      r={DR}
                      className="sc-donut-fg"
                      strokeDasharray={`${(OVERALL / 100) * DCIRC} ${DCIRC}`}
                      transform="rotate(-90 70 70)"
                    />
                  </svg>
                  <div className="sc-donut-center">
                    <b>{OVERALL}%</b>
                    <span>Overall Progress</span>
                  </div>
                </div>
                <ul className="sc-monthly-list">
                  {monthly.map((m) => (
                    <li key={m.label}>
                      <i style={{ background: m.color }} />
                      <span>{m.label}</span>
                      <b>{m.value}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sc-card">
              <div className="sc-card-head">
                <h3>Upcoming Sessions</h3>
                <a href="#all" className="sc-link">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <div className="sc-up-list">
                {upcoming.map((u) => (
                  <div className="sc-up" key={u.title}>
                    <span className={`sc-up-icon ${u.tone}`}>{u.icon}</span>
                    <div className="sc-up-info">
                      <p>{u.title}</p>
                      <span>{u.time}</span>
                    </div>
                    <ChevronRight size={14} className="sc-up-arrow" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-card">
              <div className="sc-card-head">
                <h3>Study Goals</h3>
                <a href="#all" className="sc-link">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <div className="sc-goals">
                {goals.map((g) => (
                  <div className="sc-goal" key={g.title}>
                    <div className="sc-goal-ring">
                      <svg viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r={GR} className="sc-ring-bg" />
                        <circle
                          cx="18"
                          cy="18"
                          r={GR}
                          className="sc-ring-fg"
                          stroke={g.color}
                          strokeDasharray={`${(g.pct / 100) * GCIRC} ${GCIRC}`}
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                      <span>{g.pct}%</span>
                    </div>
                    <div className="sc-goal-body">
                      <div className="sc-goal-top">
                        <div>
                          <p>{g.title}</p>
                          <small>{g.sub}</small>
                        </div>
                        <b>{g.right ?? `${g.value}%`}</b>
                      </div>
                      <div className="sc-goal-bar">
                        <div style={{ width: `${g.value}%`, background: g.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-promo">
              <span className="sc-promo-icon">
                <Trophy size={20} />
              </span>
              <div>
                <p className="sc-promo-title">
                  Consistent effort
                  <br />
                  builds great results!
                </p>
                <p className="sc-promo-sub">You're doing amazing. Keep going!</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Schedule;