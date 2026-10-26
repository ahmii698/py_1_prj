import { useRef, useState } from "react";
import {
  Settings as SettingsIcon, Users, Bell, Palette, ShieldCheck, Plug, CreditCard,
  ChevronRight, Camera, Calendar, MapPin, ChevronDown, Lock, KeyRound, Smartphone,
  MonitorSmartphone, Globe, HelpCircle, ClipboardCheck, FileUp, MessageCircleQuestion,
  Megaphone, Server, UserCog, Check, type LucideIcon,
} from "lucide-react";

// ⚠️ Apne project ke hisaab se path adjust kar lena
import Sidebar from "./sidebar";
import Header from "./header";

import "./settings.css";

/* ---------------- Static data ---------------- */
type SectionKey = "account" | "class" | "notifications" | "appearance" | "privacy" | "integrations" | "billing";

const NAV: { key: SectionKey; title: string; sub: string; icon: LucideIcon }[] = [
  { key: "account", title: "Account Settings", sub: "Profile, email, password", icon: UserCog },
  { key: "class", title: "Class Management", sub: "Manage your classes & subjects", icon: Users },
  { key: "notifications", title: "Notifications", sub: "Email, push & in-app alerts", icon: Bell },
  { key: "appearance", title: "Appearance", sub: "Theme, layout & display", icon: Palette },
  { key: "privacy", title: "Privacy & Security", sub: "Data, login & permissions", icon: ShieldCheck },
  { key: "integrations", title: "Integrations", sub: "Connected tools & APIs", icon: Plug },
  { key: "billing", title: "Billing & Subscription", sub: "Plan and payment details", icon: CreditCard },
];

const NOTIFS: { key: string; title: string; sub: string; icon: LucideIcon }[] = [
  { key: "quiz", title: "New Quiz Assigned", sub: "Get notified when a quiz is assigned.", icon: ClipboardCheck },
  { key: "assignment", title: "Assignment Submissions", sub: "Get notified about new submissions.", icon: FileUp },
  { key: "questions", title: "Student Questions", sub: "Get notified when students ask questions.", icon: MessageCircleQuestion },
  { key: "announcements", title: "Announcements", sub: "Receive important platform updates.", icon: Megaphone },
  { key: "system", title: "System Notifications", sub: "Get notified about system updates and maintenance.", icon: Server },
];

const SECURITY: { title: string; sub: string; action: string; icon: LucideIcon }[] = [
  { title: "Change Password", sub: "Update your password regularly.", action: "Change", icon: KeyRound },
  { title: "Two-Factor Authentication", sub: "Add an extra layer of security to your account.", action: "Enable", icon: Smartphone },
  { title: "Login Sessions", sub: "Manage your active sessions and devices.", action: "View", icon: MonitorSmartphone },
];

const BIO_MAX = 500;

/* ---------------- Small components ---------------- */
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`stg-toggle ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span />
    </button>
  );
}

function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="stg-select">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} />
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Settings() {
  const [section, setSection] = useState<SectionKey>("account");
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92 300 1234567",
    gender: "Male",
    dob: "1998-03-15",
    qualification: "BS Computer Science (2020)",
    location: "Karachi, Pakistan",
    bio: "Passionate about teaching and helping students achieve their goals. Always love to explore new ways of making learning easier and more effective.",
  });

  const [prefs, setPrefs] = useState({
    defaultClass: "BSCS - Semester 3",
    defaultSubject: "Data Structures",
    onlyMine: true,
    language: "English",
    timezone: "(GMT+05:00) Karachi",
  });

  const [notif, setNotif] = useState<Record<string, boolean>>({
    quiz: true, assignment: true, questions: true, announcements: true, system: true,
  });

  const setF = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      alert("Photo must be 2MB or smaller.");
      return;
    }
    setPhoto(URL.createObjectURL(f));
  };

  const save = () => {
    // TODO: yahan Python API call lagana (form, prefs, notif bhejna)
    console.log({ form, prefs, notif });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const initials = form.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="teacher-layout">
      <Sidebar />

      <div className="teacher-main">
        <Header />

        <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onPhoto} />

        <div className="stg-page">
          {/* Title */}
          <div className="stg-title">
            <span className="stg-title-icon"><SettingsIcon size={24} /></span>
            <div>
              <h1>Settings</h1>
              <p>Manage your account, preferences and platform settings.</p>
            </div>
          </div>

          <div className="stg-grid">
            {/* ===== Left nav ===== */}
            <nav className="stg-nav">
              {NAV.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.key}
                    className={`stg-nav-item ${section === n.key ? "active" : ""}`}
                    onClick={() => setSection(n.key)}
                  >
                    <span className="stg-nav-icon"><Icon size={18} /></span>
                    <span className="stg-nav-text">
                      <strong>{n.title}</strong>
                      <small>{n.sub}</small>
                    </span>
                    <ChevronRight size={15} />
                  </button>
                );
              })}
            </nav>

            {/* ===== Center ===== */}
            <div className="stg-center">
              <section className="stg-card">
                <div className="stg-head">
                  <div>
                    <h2>Account Settings</h2>
                    <p>Update your personal information and account details.</p>
                  </div>
                  <button className="stg-save" onClick={save}>
                    {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
                  </button>
                </div>

                <div className="stg-photo">
                  <div className="stg-avatar">
                    {photo ? <img src={photo} alt="Profile" /> : <span>{initials}</span>}
                    <button className="stg-cam" onClick={() => fileRef.current?.click()} aria-label="Change photo">
                      <Camera size={12} />
                    </button>
                  </div>
                  <div>
                    <h4>Profile Photo</h4>
                    <p>Upload a new profile picture (JPG, PNG, max 2MB).</p>
                    <button className="stg-outline" onClick={() => fileRef.current?.click()}>Change Photo</button>
                  </div>
                </div>

                <div className="stg-form">
                  <label>
                    <span>Full Name</span>
                    <input value={form.fullName} onChange={setF("fullName")} />
                  </label>
                  <label>
                    <span>Email Address</span>
                    <input type="email" value={form.email} onChange={setF("email")} />
                  </label>
                  <label>
                    <span>Phone Number</span>
                    <input value={form.phone} onChange={setF("phone")} />
                  </label>
                  <label>
                    <span>Gender</span>
                    <Select value={form.gender} onChange={(v) => setForm((f) => ({ ...f, gender: v }))} options={["Male", "Female", "Other"]} />
                  </label>
                  <label>
                    <span>Date of Birth</span>
                    <div className="stg-input-icon">
                      <input type="date" value={form.dob} onChange={setF("dob")} />
                      <Calendar size={14} />
                    </div>
                  </label>
                  <label>
                    <span>Qualification</span>
                    <Select
                      value={form.qualification}
                      onChange={(v) => setForm((f) => ({ ...f, qualification: v }))}
                      options={["BS Computer Science (2020)", "MS Computer Science", "PhD Computer Science", "Other"]}
                    />
                  </label>
                  <label>
                    <span>Location</span>
                    <div className="stg-input-icon left">
                      <MapPin size={14} />
                      <input value={form.location} onChange={setF("location")} />
                    </div>
                  </label>
                  <label className="stg-bio">
                    <span>Bio</span>
                    <textarea
                      rows={4}
                      maxLength={BIO_MAX}
                      value={form.bio}
                      onChange={setF("bio")}
                    />
                    <em>{form.bio.length}/{BIO_MAX}</em>
                  </label>
                </div>
              </section>

              <section className="stg-card">
                <div className="stg-sec-head">
                  <span className="stg-round"><Lock size={18} /></span>
                  <div>
                    <h3>Account Security</h3>
                    <p>Keep your account safe and secure.</p>
                  </div>
                </div>

                <ul className="stg-sec-list">
                  {SECURITY.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.title}>
                        <span className="stg-mini"><Icon size={16} /></span>
                        <div>
                          <h4>{s.title}</h4>
                          <p>{s.sub}</p>
                        </div>
                        <button className="stg-outline small">{s.action}</button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            {/* ===== Right ===== */}
            <aside className="stg-right">
              <section className="stg-card">
                <div className="stg-sec-head">
                  <span className="stg-round"><Users size={18} /></span>
                  <div>
                    <h3>Class & Subject Preferences</h3>
                    <p>Set your default class and subject for a better experience.</p>
                  </div>
                </div>

                <label className="stg-field">
                  <span>Default Class</span>
                  <Select
                    value={prefs.defaultClass}
                    onChange={(v) => setPrefs((p) => ({ ...p, defaultClass: v }))}
                    options={["BSCS - Semester 3", "BSCS - Semester 4", "BSCS - Semester 5"]}
                  />
                </label>
                <label className="stg-field">
                  <span>Default Subject</span>
                  <Select
                    value={prefs.defaultSubject}
                    onChange={(v) => setPrefs((p) => ({ ...p, defaultSubject: v }))}
                    options={["Data Structures", "Object Oriented Programming", "Web Development", "Database Systems"]}
                  />
                </label>

                <div className="stg-row">
                  <div>
                    <h4>Show only my classes</h4>
                    <p>Hide classes you're not assigned to.</p>
                  </div>
                  <Toggle on={prefs.onlyMine} label="Show only my classes" onChange={(v) => setPrefs((p) => ({ ...p, onlyMine: v }))} />
                </div>
              </section>

              <section className="stg-card">
                <div className="stg-sec-head">
                  <span className="stg-round"><Bell size={18} /></span>
                  <div>
                    <h3>Notification Preferences</h3>
                    <p>Choose what kind of notifications you want to receive.</p>
                  </div>
                </div>

                <ul className="stg-notifs">
                  {NOTIFS.map((n) => {
                    const Icon = n.icon;
                    return (
                      <li key={n.key}>
                        <span className="stg-mini round"><Icon size={15} /></span>
                        <div>
                          <h4>{n.title}</h4>
                          <p>{n.sub}</p>
                        </div>
                        <Toggle
                          on={notif[n.key]}
                          label={n.title}
                          onChange={(v) => setNotif((s) => ({ ...s, [n.key]: v }))}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="stg-card">
                <div className="stg-sec-head">
                  <span className="stg-round"><Globe size={18} /></span>
                  <div>
                    <h3>Language & Region</h3>
                    <p>Set your preferred language and timezone.</p>
                  </div>
                </div>

                <label className="stg-field">
                  <span>Language</span>
                  <Select
                    value={prefs.language}
                    onChange={(v) => setPrefs((p) => ({ ...p, language: v }))}
                    options={["English", "Urdu"]}
                  />
                </label>
                <label className="stg-field">
                  <span>Timezone</span>
                  <Select
                    value={prefs.timezone}
                    onChange={(v) => setPrefs((p) => ({ ...p, timezone: v }))}
                    options={["(GMT+05:00) Karachi", "(GMT+00:00) London", "(GMT+04:00) Dubai", "(GMT-05:00) New York"]}
                  />
                </label>

                <div className="stg-help">
                  <span className="stg-mini round"><HelpCircle size={16} /></span>
                  <div>
                    <h4>Need Help?</h4>
                    <p>Check our help center or contact support.</p>
                  </div>
                  <button className="stg-get-help">Get Help</button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}