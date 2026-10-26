import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  BadgeCheck,
  MapPin,
  Mail,
  CalendarDays,
  Pencil,
  MoreVertical,
  BookOpen,
  FileText,
  Star,
  Target,
  GraduationCap,
  Code2,
  ArrowRight,
  Flame,
  Zap,
  Clock,
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  Compass,
  Crown,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Moon,
  Globe,
  ChevronDown,
  Activity,
  BarChart3,
  Camera,
  Upload,
  User,
  Hash,
  Phone,
  Check,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./profile.css";

/* ---------------- DATA ---------------- */

const stats: { label: string; value: string; note: string; icon: ReactNode; tone: string }[] = [
  { label: "Total Quizzes", value: "48", note: "12% this month", icon: <BookOpen size={20} />, tone: "violet" },
  { label: "Study Hours", value: "186.5", note: "8% this month", icon: <FileText size={20} />, tone: "green" },
  { label: "Average Score", value: "78%", note: "6% this month", icon: <Star size={20} />, tone: "orange" },
  { label: "Goals Completed", value: "5 / 8", note: "2 this month", icon: <Target size={20} />, tone: "blue" },
];

const quickStats = [
  { label: "Current Streak", value: "7 Days", icon: <Flame size={20} />, tone: "orange" },
  { label: "Longest Streak", value: "21 Days", icon: <Zap size={20} />, tone: "violet" },
  { label: "Total Study Time", value: "186.5 Hours", icon: <Clock size={20} />, tone: "indigo" },
  { label: "Quizzes Attempted", value: "48", icon: <FileText size={20} />, tone: "purple" },
];

const achievements = [
  { name: "First Quiz", xp: "+50 XP", icon: <Award size={20} />, tone: "violet" },
  { name: "Consistent Learner", xp: "+200 XP", icon: <Medal size={20} />, tone: "orange" },
  { name: "Top Scorer", xp: "+300 XP", icon: <Trophy size={20} />, tone: "green" },
  { name: "Streak 7 Days", xp: "+100 XP", icon: <Flame size={20} />, tone: "amber" },
  { name: "Goal Achiever", xp: "+150 XP", icon: <ShieldCheck size={20} />, tone: "blue" },
  { name: "Explorer", xp: "+150 XP", icon: <Compass size={20} />, tone: "purple" },
];

const skills = [
  { name: "HTML", tone: "blue" },
  { name: "CSS", tone: "blue" },
  { name: "JavaScript", tone: "yellow" },
  { name: "Bootstrap", tone: "purple" },
  { name: "PHP", tone: "green" },
  { name: "Laravel", tone: "red" },
  { name: "React", tone: "green" },
  { name: "MySQL", tone: "green" },
  { name: "MongoDB", tone: "green" },
  { name: "ASP.NET", tone: "purple" },
  { name: "Flutter", tone: "blue" },
  { name: "Three.js", tone: "purple" },
  { name: "Node.js", tone: "purple" },
  { name: "Express.js", tone: "blue" },
  { name: "Python", tone: "green" },
];

const activity = [
  { title: "Completed Quiz: Database Systems", sub: "Score: 85% • 12 questions", time: "2 hours ago", icon: <FileText size={14} />, tone: "violet" },
  { title: "Uploaded Document: Deep Learning Notes.pdf", sub: "1.2 MB • PDF", time: "5 hours ago", icon: <Upload size={14} />, tone: "blue" },
  { title: "Achieved Achievement: Top Scorer", sub: "+300 XP", time: "1 day ago", icon: <Flame size={14} />, tone: "orange" },
  { title: "Updated Profile Information", sub: "Changed education details", time: "2 days ago", icon: <User size={14} />, tone: "purple" },
];

const academic = [
  { label: "Degree Program", value: "MS Software Engineering" },
  { label: "University", value: "FAST-NUCES Karachi" },
  { label: "Batch", value: "2026 (In Progress)" },
  { label: "Current Semester", value: "1st Semester" },
];

const MAX_ABOUT = 500;

/* ---------------- SMALL PIECES ---------------- */

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`pr-toggle ${on ? "on" : ""}`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

/* ---------------- COMPONENT ---------------- */

function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "Ahmed Khan",
    email: "ahmedkhan@email.com",
    phone: "+92 300 1234567",
    location: "Karachi, Pakistan",
    education: "MS Software Engineering",
    university: "FAST-NUCES Karachi",
    age: "23",
    cgpa: "3.4",
    about:
      "Passionate about software engineering, web development and AI. I love building real-world projects and constantly learning new technologies. My goal is to become a skilled software engineer and contribute to meaningful projects.",
  });

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [prefs, setPrefs] = useState({ reminder: true, email: true, dark: true });
  const [language, setLanguage] = useState("English");

  const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size is 2MB.");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  };

  const submitPassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      setPwMsg({ type: "err", text: "Please fill all password fields." });
      return;
    }
    if (pw.next.length < 6) {
      setPwMsg({ type: "err", text: "New password must be at least 6 characters." });
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwMsg({ type: "err", text: "New and confirm password do not match." });
      return;
    }
    setPwMsg({ type: "ok", text: "Password updated successfully." });
    setPw({ current: "", next: "", confirm: "" });
  };

  const initials = form.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatar = (size: "lg" | "md") => (
    <div className={`pr-avatar ${size}`}>
      {photo ? <img src={photo} alt="Profile" /> : <span>{initials}</span>}
    </div>
  );

  const passwordRows: { key: "current" | "next" | "confirm"; label: string; ph: string }[] = [
    { key: "current", label: "Current Password", ph: "Enter current password" },
    { key: "next", label: "New Password", ph: "Enter new password" },
    { key: "confirm", label: "Confirm Password", ph: "Confirm new password" },
  ];

  return (
    <div className="pr-shell">
      <Sidebar />

      <div className="pr-main">
        <Header />

        <div className="pr-content">
          {/* ============ CENTER ============ */}
          <div className="pr-center">
            {/* Hero */}
            <div className="pr-hero">
              <div className="pr-hero-left">
                <div className="pr-hero-avatar">
                  {avatar("lg")}
                  <button type="button" className="pr-cam" aria-label="Change photo" onClick={() => fileRef.current?.click()}>
                    <Camera size={10} />
                  </button>
                </div>
                <div className="pr-hero-info">
                  <h1>
                    {form.fullName} <BadgeCheck size={16} className="verified" />
                  </h1>
                  <p className="pr-role">Student • {form.education}</p>
                  <p className="pr-tag">Learning today for a better tomorrow.</p>
                  <div className="pr-chips">
                    <span>
                      <MapPin size={11} /> {form.location}
                    </span>
                    <span>
                      <Mail size={11} /> {form.email}
                    </span>
                    <span>
                      <CalendarDays size={11} /> Joined: Jan 2025
                    </span>
                  </div>
                </div>
              </div>

              <div className="pr-hero-actions">
                <button type="button" className="pr-edit">
                  <Pencil size={12} /> Edit Profile
                </button>
                <button type="button" className="pr-more" aria-label="More">
                  <MoreVertical size={14} />
                </button>
              </div>

              <p className="pr-quote">
                "Discipline today
                <br />
                builds freedom tomorrow."
              </p>
            </div>

            {/* Stats */}
            <div className="pr-stats">
              {stats.map((s) => (
                <div className="pr-card pr-stat" key={s.label}>
                  <span className={`pr-stat-icon ${s.tone}`}>{s.icon}</span>
                  <div>
                    <p className="pr-stat-label">{s.label}</p>
                    <p className="pr-stat-value">{s.value}</p>
                    <p className="pr-stat-note">↑ {s.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Columns */}
            <div className="pr-cols">
              {/* LEFT */}
              <div className="pr-col">
                <div className="pr-card">
                  <h3 className="pr-h2">Profile Details</h3>
                  <p className="pr-muted">Update your personal information and academic details.</p>

                  <div className="pr-form-grid">
                    <div className="pr-photo-box">
                      <p className="pr-label">Profile Photo</p>
                      {avatar("md")}
                      <button type="button" className="pr-btn-outline" onClick={() => fileRef.current?.click()}>
                        Change Photo
                      </button>
                      <small>JPG, PNG (Max 2MB)</small>
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onPhoto} />
                    </div>

                    <div className="pr-fields">
                      <label className="pr-field">
                        <span className="pr-label">Full Name</span>
                        <input value={form.fullName} onChange={setField("fullName")} />
                      </label>
                      <label className="pr-field">
                        <span className="pr-label">Email Address</span>
                        <input type="email" value={form.email} onChange={setField("email")} />
                      </label>

                      <label className="pr-field">
                        <span className="pr-label">Phone Number</span>
                        <div className="pr-input-icon">
                          <Phone size={12} />
                          <input value={form.phone} onChange={setField("phone")} />
                        </div>
                      </label>
                      <label className="pr-field">
                        <span className="pr-label">Location</span>
                        <div className="pr-input-icon">
                          <MapPin size={12} />
                          <select value={form.location} onChange={setField("location")}>
                            <option>Karachi, Pakistan</option>
                            <option>Lahore, Pakistan</option>
                            <option>Islamabad, Pakistan</option>
                            <option>Peshawar, Pakistan</option>
                          </select>
                          <ChevronDown size={12} />
                        </div>
                      </label>

                      <label className="pr-field">
                        <span className="pr-label">Education Level</span>
                        <div className="pr-input-icon plain">
                          <select value={form.education} onChange={setField("education")}>
                            <option>MS Software Engineering</option>
                            <option>BS Computer Science</option>
                            <option>BS Software Engineering</option>
                            <option>MS Computer Science</option>
                          </select>
                          <ChevronDown size={12} />
                        </div>
                      </label>
                      <label className="pr-field">
                        <span className="pr-label">University / Institute</span>
                        <div className="pr-input-icon">
                          <GraduationCap size={12} />
                          <input value={form.university} onChange={setField("university")} />
                        </div>
                      </label>

                      <label className="pr-field">
                        <span className="pr-label">Age</span>
                        <input type="number" min={10} max={80} value={form.age} onChange={setField("age")} />
                      </label>
                      <label className="pr-field">
                        <span className="pr-label">CGPA</span>
                        <div className="pr-input-icon">
                          <Hash size={12} />
                          <input value={form.cgpa} onChange={setField("cgpa")} />
                        </div>
                      </label>
                    </div>
                  </div>

                  <label className="pr-field pr-about">
                    <span className="pr-label">About Me</span>
                    <textarea
                      rows={4}
                      maxLength={MAX_ABOUT}
                      value={form.about}
                      onChange={setField("about")}
                    />
                    <small>
                      {form.about.length}/{MAX_ABOUT}
                    </small>
                  </label>
                </div>

                <div className="pr-card">
                  <div className="pr-card-head">
                    <h3 className="pr-head-icon">
                      <Activity size={14} /> Recent Activity
                    </h3>
                    <a href="#all" className="pr-link">
                      View All <ArrowRight size={11} />
                    </a>
                  </div>
                  <div className="pr-act-list">
                    {activity.map((a) => (
                      <div className="pr-act" key={a.title}>
                        <span className={`pr-act-icon ${a.tone}`}>{a.icon}</span>
                        <div className="pr-act-info">
                          <p>{a.title}</p>
                          <span>{a.sub}</span>
                        </div>
                        <small>{a.time}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="pr-col">
                <div className="pr-card">
                  <div className="pr-card-head">
                    <h3 className="pr-head-icon">
                      <GraduationCap size={16} /> Academic Information
                    </h3>
                    <a href="#all" className="pr-link">
                      View Details <ArrowRight size={11} />
                    </a>
                  </div>
                  <div className="pr-acad">
                    {academic.map((a) => (
                      <div key={a.label}>
                        <small>{a.label}</small>
                        <p>{a.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pr-progress-top">
                    <span>Overall Progress</span>
                    <b>35%</b>
                  </div>
                  <div className="pr-progress">
                    <div style={{ width: "35%" }} />
                  </div>
                </div>

                <div className="pr-card">
                  <div className="pr-card-head">
                    <h3 className="pr-head-icon">
                      <Code2 size={16} /> Skills &amp; Technologies
                    </h3>
                    <a href="#all" className="pr-link">
                      Edit <ArrowRight size={11} />
                    </a>
                  </div>
                  <div className="pr-skills">
                    {skills.map((s) => (
                      <span className={`pr-skill ${s.tone}`} key={s.name}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pr-card">
                  <h3 className="pr-head-icon pr-pw-title">
                    <Lock size={16} /> Change Password
                  </h3>
                  <p className="pr-muted">Update your password for better security.</p>

                  <div className="pr-pw">
                    {passwordRows.map((r) => (
                      <label className="pr-field" key={r.key}>
                        <span className="pr-label">{r.label}</span>
                        <div className="pr-pw-input">
                          <input
                            type={show[r.key] ? "text" : "password"}
                            placeholder={r.ph}
                            value={pw[r.key]}
                            onChange={(e) => setPw((p) => ({ ...p, [r.key]: e.target.value }))}
                          />
                          <button
                            type="button"
                            aria-label="Toggle visibility"
                            onClick={() => setShow((s) => ({ ...s, [r.key]: !s[r.key] }))}
                          >
                            {show[r.key] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </label>
                    ))}
                  </div>

                  {pwMsg && <p className={`pr-msg ${pwMsg.type}`}>{pwMsg.text}</p>}

                  <button type="button" className="pr-btn-primary" onClick={submitPassword}>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="pr-right">
            <div className="pr-card">
              <div className="pr-card-head">
                <h3 className="pr-head-icon">
                  <BarChart3 size={15} /> Quick Stats
                </h3>
              </div>
              <div className="pr-qs">
                {quickStats.map((q) => (
                  <div className="pr-qs-item" key={q.label}>
                    <span className={`pr-qs-icon ${q.tone}`}>{q.icon}</span>
                    <div>
                      <small>{q.label}</small>
                      <p>{q.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pr-card">
              <div className="pr-card-head">
                <h3 className="pr-head-icon">
                  <Trophy size={15} /> Achievements
                </h3>
                <a href="#all" className="pr-link">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <div className="pr-ach">
                {achievements.map((a) => (
                  <div className="pr-ach-item" key={a.name}>
                    <span className={`pr-ach-icon ${a.tone}`}>{a.icon}</span>
                    <p>{a.name}</p>
                    <small>{a.xp}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="pr-card">
              <div className="pr-card-head">
                <h3 className="pr-head-icon">
                  <Crown size={15} /> Preferences
                </h3>
                <a href="#all" className="pr-link">
                  Edit <ArrowRight size={11} />
                </a>
              </div>

              <div className="pr-pref">
                <span className="pr-pref-icon">
                  <Bell size={14} />
                </span>
                <div className="pr-pref-text">
                  <b>Study Reminder</b>
                  <small>Get notified about your study schedule</small>
                </div>
                <Toggle label="Study reminder" on={prefs.reminder} onChange={() => setPrefs((p) => ({ ...p, reminder: !p.reminder }))} />
              </div>

              <div className="pr-pref">
                <span className="pr-pref-icon">
                  <Mail size={14} />
                </span>
                <div className="pr-pref-text">
                  <b>Email Notifications</b>
                  <small>Receive updates and reminders via email</small>
                </div>
                <Toggle label="Email notifications" on={prefs.email} onChange={() => setPrefs((p) => ({ ...p, email: !p.email }))} />
              </div>

              <div className="pr-pref">
                <span className="pr-pref-icon">
                  <Moon size={14} />
                </span>
                <div className="pr-pref-text">
                  <b>Dark Mode</b>
                  <small>Enable dark mode for better focus</small>
                </div>
                <Toggle label="Dark mode" on={prefs.dark} onChange={() => setPrefs((p) => ({ ...p, dark: !p.dark }))} />
              </div>

              <div className="pr-pref lang">
                <span className="pr-pref-icon">
                  <Globe size={14} />
                </span>
                <div className="pr-pref-text">
                  <b>Language</b>
                </div>
              </div>
              <div className="pr-lang">
                <Globe size={12} />
                <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                </select>
                <ChevronDown size={12} />
              </div>

              <span className="pr-sr">
                <Check size={0} />
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Profile;