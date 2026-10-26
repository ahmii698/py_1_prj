import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  Settings as SettingsIcon,
  Camera,
  Save,
  Brain,
  Lock,
  KeyRound,
  ShieldCheck,
  Clock,
  Bell,
  CalendarDays,
  ClipboardCheck,
  FileText,
  RefreshCw,
  Award,
  Mail,
  Monitor,
  BarChart3,
  Minimize2,
  Lightbulb,
  Sparkles,
  PanelLeftClose,
  Globe,
  Zap,
  Crown,
  HardDrive,
  Palette,
  Check,
  Download,
  Eye,
  Trash2,
  HelpCircle,
  MessageCircle,
  Bug,
  ChevronRight,
  UserRound,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./setting.css";

/* ---------------- Small reusable pieces ---------------- */

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`st-toggle ${checked ? "on" : ""}`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

function CardHead({
  icon,
  title,
  sub,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="st-card-head">
      <span className="st-card-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
    </div>
  );
}

/* ---------------- Data ---------------- */

const notificationItems: {
  key: string;
  title: string;
  sub: string;
  icon: ReactNode;
  tone: string;
}[] = [
  { key: "study", title: "Study Reminders", sub: "Get reminded about your study schedule.", icon: <CalendarDays size={15} />, tone: "purple" },
  { key: "quiz", title: "Quiz Results", sub: "Receive results and performance updates.", icon: <ClipboardCheck size={15} />, tone: "purple" },
  { key: "assign", title: "Assignment Alerts", sub: "Get notified about new assignments.", icon: <FileText size={15} />, tone: "purple" },
  { key: "system", title: "System Updates", sub: "Important updates and new features.", icon: <RefreshCw size={15} />, tone: "green" },
  { key: "badges", title: "Achievement Badges", sub: "Celebrate your milestones and progress.", icon: <Award size={15} />, tone: "orange" },
  { key: "email", title: "Email Notifications", sub: "Receive weekly reports and summaries.", icon: <Mail size={15} />, tone: "blue" },
];

const displayItems: {
  key: string;
  title: string;
  sub: string;
  icon: ReactNode;
}[] = [
  { key: "progress", title: "Show Progress Bar", sub: "Display progress indicators in all modules.", icon: <BarChart3 size={15} /> },
  { key: "compact", title: "Compact Mode", sub: "Show more content in less space.", icon: <Minimize2 size={15} /> },
  { key: "hints", title: "Show Hints", sub: "Display helpful hints and tips.", icon: <Lightbulb size={15} /> },
  { key: "anim", title: "Animations", sub: "Enable smooth animations and transitions.", icon: <Sparkles size={15} /> },
  { key: "collapse", title: "Sidebar Auto Collapse", sub: "Automatically collapse sidebar on small screens.", icon: <PanelLeftClose size={15} /> },
];

const focusAreas = ["Programming", "Database", "Web Development", "Mobile Development", "AI & ML", "Others"];

const accents = ["#6d4aff", "#2f9bff", "#16b58a", "#ffab40", "#ff5d6c", "#f43f9d"];

const securityItems: { title: string; sub: string; icon: ReactNode }[] = [
  { title: "Change Password", sub: "Update your password regularly.", icon: <KeyRound size={15} /> },
  { title: "Two-Factor Authentication (2FA)", sub: "Add an extra layer of security.", icon: <ShieldCheck size={15} /> },
  { title: "Login Activity", sub: "View your recent login activity.", icon: <Clock size={15} /> },
];

const privacyItems: { title: string; sub: string; icon: ReactNode; danger?: boolean }[] = [
  { title: "Download My Data", sub: "Get a copy of your account data.", icon: <Download size={15} /> },
  { title: "Privacy Settings", sub: "Manage your privacy preferences.", icon: <Eye size={15} /> },
  { title: "Delete Account", sub: "Permanently delete your account.", icon: <Trash2 size={15} />, danger: true },
];

const helpItems: { title: string; sub: string; icon: ReactNode; danger?: boolean }[] = [
  { title: "FAQs", sub: "Find answers to common questions.", icon: <HelpCircle size={15} /> },
  { title: "Contact Support", sub: "Get in touch with our team.", icon: <MessageCircle size={15} /> },
  { title: "Report a Bug", sub: "Help us improve LearnIQ.", icon: <Bug size={15} />, danger: true },
];

/* ---------------- Page ---------------- */

function Setting() {
  /* Account */
  const [account, setAccount] = useState({
    name: "Ahmed Khan",
    email: "ahmedkhan@email.com",
    phone: "+92 300 1234567",
    location: "Karachi, Pakistan",
    education: "MS Software Engineering",
    university: "FAST-NUCES Karachi",
    age: "23",
    cgpa: "3.4",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setAcc = (k: keyof typeof account) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAccount((p) => ({ ...p, [k]: e.target.value }));

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  /* Learning prefs */
  const [prefs, setPrefs] = useState({
    mode: "Visual Learning",
    difficulty: "Medium",
    goal: "2-3 hours",
    language: "English",
  });
  const [focus, setFocus] = useState<string[]>(["Programming", "Database"]);
  const toggleFocus = (f: string) =>
    setFocus((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  /* Notifications */
  const [notif, setNotif] = useState<Record<string, boolean>>({
    study: true,
    quiz: true,
    assign: true,
    system: true,
    badges: true,
    email: false,
  });

  /* Display */
  const [display, setDisplay] = useState<Record<string, boolean>>({
    progress: true,
    compact: false,
    hints: true,
    anim: true,
    collapse: false,
  });

  /* Region */
  const [region, setRegion] = useState({
    language: "English",
    zone: "(GMT+5:00) Pakistan Standard Time",
    dateFormat: "DD MMM, YYYY",
  });

  /* Theme */
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [accent, setAccent] = useState(accents[0]);

  const [saved, setSaved] = useState("");
  const flash = (msg: string) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(""), 2200);
  };

  return (
    <div className="st-layout" style={{ ["--st-accent" as string]: accent }}>
      <Sidebar />

      <div className="st-main">
        <Header />

        <div className="st-content">
          {/* ================= LEFT + CENTER ================= */}
          <div className="st-center">
            {/* Banner */}
            <section className="st-banner">
              <span className="st-banner-icon">
                <SettingsIcon size={28} />
              </span>
              <div>
                <h1>Settings</h1>
                <p>Customize your LearnIQ experience and manage your account preferences.</p>
              </div>
              <div className="st-banner-art">
                <em>
                  Your learning
                  <br />
                  Your way!
                </em>
                <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="14" width="120" height="66" rx="8" fill="#ffffff" stroke="#d6ccff" />
                  <rect x="20" y="14" width="120" height="12" rx="6" fill="#b9a8ff" />
                  <rect x="30" y="34" width="40" height="8" rx="3" fill="#e4dcff" />
                  <rect x="30" y="48" width="55" height="8" rx="3" fill="#ede9fe" />
                  <rect x="94" y="34" width="36" height="34" rx="5" fill="#ddd2ff" />
                  <circle cx="158" cy="56" r="22" fill="#a78bfa" />
                  <circle cx="158" cy="56" r="9" fill="#f4f0ff" />
                </svg>
              </div>
            </section>

            <div className="st-cols">
              {/* ---------- Column A ---------- */}
              <div className="st-col">
                {/* Account Settings */}
                <section className="st-card">
                  <CardHead
                    icon={<SettingsIcon size={18} />}
                    title="Account Settings"
                    sub="Manage your basic account information."
                  />

                  <div className="st-account">
                    <div className="st-photo">
                      <div className="avatar">
                        {photo ? <img src={photo} alt="Profile" /> : <UserRound size={44} />}
                      </div>
                      <button type="button" className="st-btn-soft" onClick={() => fileRef.current?.click()}>
                        <Camera size={12} /> Change Photo
                      </button>
                      <small>JPG, PNG (Max 2MB)</small>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        hidden
                        onChange={onPhoto}
                      />
                    </div>

                    <div className="st-form">
                      <label>
                        Full Name
                        <input value={account.name} onChange={setAcc("name")} />
                      </label>
                      <label>
                        Email Address
                        <input type="email" value={account.email} onChange={setAcc("email")} />
                      </label>
                      <label>
                        Phone Number
                        <input value={account.phone} onChange={setAcc("phone")} />
                      </label>
                      <label>
                        Location
                        <select value={account.location} onChange={setAcc("location")}>
                          <option>Karachi, Pakistan</option>
                          <option>Lahore, Pakistan</option>
                          <option>Islamabad, Pakistan</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label>
                        Education Level
                        <select value={account.education} onChange={setAcc("education")}>
                          <option>Matric</option>
                          <option>Intermediate</option>
                          <option>BS Computer Science</option>
                          <option>MS Software Engineering</option>
                          <option>PhD</option>
                        </select>
                      </label>
                      <label>
                        University / Institute
                        <input value={account.university} onChange={setAcc("university")} />
                      </label>
                      <label>
                        Age
                        <input value={account.age} onChange={setAcc("age")} />
                      </label>
                      <label>
                        CGPA
                        <input value={account.cgpa} onChange={setAcc("cgpa")} />
                      </label>
                    </div>
                  </div>

                  <div className="st-card-foot">
                    <button type="button" className="st-btn" onClick={() => flash("Account changes saved")}>
                      <Save size={13} /> Save Changes
                    </button>
                  </div>
                </section>

                {/* Learning Preferences */}
                <section className="st-card">
                  <CardHead
                    icon={<Brain size={18} />}
                    title="Learning Preferences"
                    sub="Set your learning style and preferences."
                  />

                  <div className="st-form two">
                    <label>
                      Preferred Study Mode
                      <select value={prefs.mode} onChange={(e) => setPrefs({ ...prefs, mode: e.target.value })}>
                        <option>Visual Learning</option>
                        <option>Reading / Writing</option>
                        <option>Practice Based</option>
                        <option>Audio Learning</option>
                      </select>
                    </label>
                    <label>
                      Difficulty Level
                      <select value={prefs.difficulty} onChange={(e) => setPrefs({ ...prefs, difficulty: e.target.value })}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </label>
                    <label>
                      Daily Study Goal
                      <select value={prefs.goal} onChange={(e) => setPrefs({ ...prefs, goal: e.target.value })}>
                        <option>1 hour</option>
                        <option>2-3 hours</option>
                        <option>4+ hours</option>
                      </select>
                    </label>
                    <label>
                      Learning Language
                      <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}>
                        <option>English</option>
                        <option>Urdu</option>
                      </select>
                    </label>
                  </div>

                  <p className="st-label">Focus Areas</p>
                  <div className="st-chips">
                    {focusAreas.map((f) => (
                      <label key={f} className={`st-chip ${focus.includes(f) ? "on" : ""}`}>
                        <input
                          type="checkbox"
                          checked={focus.includes(f)}
                          onChange={() => toggleFocus(f)}
                        />
                        <span className="box">
                          {focus.includes(f) && <Check size={10} strokeWidth={3} />}
                        </span>
                        {f}
                      </label>
                    ))}
                  </div>

                  <div className="st-card-foot">
                    <button type="button" className="st-btn" onClick={() => flash("Preferences saved")}>
                      <Save size={13} /> Save Preferences
                    </button>
                  </div>
                </section>

                {/* Security */}
                <section className="st-card">
                  <CardHead
                    icon={<Lock size={18} />}
                    title="Security"
                    sub="Keep your account safe and secure."
                  />
                  <ul className="st-rows">
                    {securityItems.map((s) => (
                      <li key={s.title}>
                        <button type="button" className="st-row">
                          <span className="ic">{s.icon}</span>
                          <span className="tx">
                            <strong>{s.title}</strong>
                            <small>{s.sub}</small>
                          </span>
                          <ChevronRight size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* ---------- Column B ---------- */}
              <div className="st-col">
                {/* Notification Preferences */}
                <section className="st-card">
                  <CardHead
                    icon={<Bell size={18} />}
                    title="Notification Preferences"
                    sub="Choose what notifications you want to receive."
                  />
                  <ul className="st-switches">
                    {notificationItems.map((n) => (
                      <li key={n.key}>
                        <span className={`ic tone-${n.tone}`}>{n.icon}</span>
                        <span className="tx">
                          <strong>{n.title}</strong>
                          <small>{n.sub}</small>
                        </span>
                        <Toggle
                          label={n.title}
                          checked={notif[n.key]}
                          onChange={() => setNotif((p) => ({ ...p, [n.key]: !p[n.key] }))}
                        />
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Appearance & Display */}
                <section className="st-card">
                  <CardHead
                    icon={<Monitor size={18} />}
                    title="Appearance & Display"
                    sub="Customize how LearnIQ looks for you."
                  />
                  <ul className="st-switches">
                    {displayItems.map((d) => (
                      <li key={d.key}>
                        <span className="ic tone-purple">{d.icon}</span>
                        <span className="tx">
                          <strong>{d.title}</strong>
                          <small>{d.sub}</small>
                        </span>
                        <Toggle
                          label={d.title}
                          checked={display[d.key]}
                          onChange={() => setDisplay((p) => ({ ...p, [d.key]: !p[d.key] }))}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="st-card-foot">
                    <button type="button" className="st-btn" onClick={() => flash("Display settings saved")}>
                      <Save size={13} /> Save Display Settings
                    </button>
                  </div>
                </section>

                {/* Language & Region */}
                <section className="st-card">
                  <CardHead
                    icon={<Globe size={18} />}
                    title="Language & Region"
                    sub="Set your preferred language and region."
                  />
                  <div className="st-form two">
                    <label>
                      Language
                      <select value={region.language} onChange={(e) => setRegion({ ...region, language: e.target.value })}>
                        <option>English</option>
                        <option>Urdu</option>
                      </select>
                    </label>
                    <label>
                      Time Zone
                      <select value={region.zone} onChange={(e) => setRegion({ ...region, zone: e.target.value })}>
                        <option>(GMT+5:00) Pakistan Standard Time</option>
                        <option>(GMT+0:00) UTC</option>
                        <option>(GMT+4:00) Gulf Standard Time</option>
                      </select>
                    </label>
                    <label>
                      Date Format
                      <select value={region.dateFormat} onChange={(e) => setRegion({ ...region, dateFormat: e.target.value })}>
                        <option>DD MMM, YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </label>
                  </div>
                  <div className="st-card-foot">
                    <button type="button" className="st-btn" onClick={() => flash("Region settings saved")}>
                      <Save size={13} /> Save Settings
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <aside className="st-right">
            {/* Quick Info */}
            <section className="st-card">
              <div className="st-card-top">
                <div className="st-card-title">
                  <span className="st-card-icon sm">
                    <Zap size={15} />
                  </span>
                  <h3>Quick Info</h3>
                </div>
                <a href="#edit" className="st-link">
                  Edit
                </a>
              </div>

              <div className="st-plan">
                <span className="crown">
                  <Crown size={20} />
                </span>
                <div>
                  <small>Current Plan</small>
                  <strong>Free Plan</strong>
                </div>
                <button type="button" className="st-btn-outline">
                  Upgrade Now
                </button>
              </div>

              <div className="st-storage">
                <span className="ic">
                  <HardDrive size={16} />
                </span>
                <div>
                  <p>
                    Storage Used
                    <em>24%</em>
                  </p>
                  <small>1.2 GB / 5 GB</small>
                </div>
              </div>
              <div className="st-bar">
                <span style={{ width: "24%" }} />
              </div>
            </section>

            {/* Theme Settings */}
            <section className="st-card">
              <div className="st-card-title spaced">
                <span className="st-card-icon sm">
                  <Palette size={15} />
                </span>
                <div>
                  <h3>Theme Settings</h3>
                  <p className="st-sub">Choose your preferred appearance.</p>
                </div>
              </div>

              <div className="st-themes">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`st-theme ${t} ${theme === t ? "on" : ""}`}
                    onClick={() => setTheme(t)}
                  >
                    <span className="preview">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="name">
                      {t[0].toUpperCase() + t.slice(1)}
                    </span>
                    {theme === t && (
                      <span className="tick">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <p className="st-label">Accent Color</p>
              <div className="st-accents">
                {accents.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Accent ${c}`}
                    className={accent === c ? "on" : ""}
                    style={{ background: c }}
                    onClick={() => setAccent(c)}
                  >
                    {accent === c && <Check size={13} strokeWidth={3} color="#fff" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Data & Privacy */}
            <section className="st-card">
              <div className="st-card-title spaced">
                <span className="st-card-icon sm">
                  <ShieldCheck size={15} />
                </span>
                <h3>Data & Privacy</h3>
              </div>
              <ul className="st-rows">
                {privacyItems.map((p) => (
                  <li key={p.title}>
                    <button type="button" className={`st-row ${p.danger ? "danger" : ""}`}>
                      <span className="ic">{p.icon}</span>
                      <span className="tx">
                        <strong>{p.title}</strong>
                        <small>{p.sub}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Help & Support */}
            <section className="st-card">
              <div className="st-card-title spaced">
                <span className="st-card-icon sm">
                  <HelpCircle size={15} />
                </span>
                <div>
                  <h3>Help & Support</h3>
                  <p className="st-sub">Need help? We're here for you.</p>
                </div>
              </div>
              <ul className="st-rows">
                {helpItems.map((h) => (
                  <li key={h.title}>
                    <button type="button" className={`st-row ${h.danger ? "danger" : ""}`}>
                      <span className="ic">{h.icon}</span>
                      <span className="tx">
                        <strong>{h.title}</strong>
                        <small>{h.sub}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {saved && <div className="st-toast">{saved}</div>}
    </div>
  );
}

export default Setting;