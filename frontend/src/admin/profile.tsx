import { useState } from "react";
import {
  Mail, User, Settings, Lock, UserCircle, ArrowRight, Camera, Save, Globe,
  Clock, CalendarDays, LogIn, Pencil, ShieldCheck, Activity, UserPlus,
  Smartphone, History, Fingerprint, ClipboardCheck, Zap,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./profile.css";

/* ---------------- DATA ---------------- */
const quickActions = [
  { title: "Change Password", sub: "Update your password", icon: Lock },
  { title: "Edit Profile", sub: "Update personal info", icon: User },
  { title: "Account Settings", sub: "Manage preferences", icon: Settings },
  { title: "View Activity Log", sub: "Check recent activity", icon: Clock },
];

const activity = [
  { title: "Logged in", sub: "Admin panel access", time: "2 hours ago", color: "green", icon: LogIn },
  { title: "Profile updated", sub: "Changed bio information", time: "5 hours ago", color: "orange", icon: Pencil },
  { title: "Password changed", sub: "Security update", time: "1 day ago", color: "red", icon: Lock },
  { title: "System settings updated", sub: "Modified platform settings", time: "2 days ago", color: "purple", icon: Settings },
  { title: "New user registered", sub: "Teacher account approved", time: "3 days ago", color: "blue", icon: UserPlus },
];

const security = [
  { label: "Two-Factor Authentication", value: "Disabled", tone: "red", icon: Fingerprint },
  { label: "Login Attempts (24h)", value: "3", tone: "green", icon: History },
  { label: "Active Sessions", value: "2 devices", tone: "blue", icon: Smartphone },
  { label: "Last Security Check", value: "May 28, 2025", tone: "purple", icon: ClipboardCheck },
];

const tabs = ["Account Settings", "Notifications", "Appearance", "Privacy"];
const sideTabs = [
  { label: "General Settings", icon: Settings },
  { label: "Language & Region", icon: Globe },
  { label: "Time Zone", icon: Clock },
  { label: "Email Preferences", icon: Mail },
];

/* ---------------- PAGE ---------------- */
export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "Ahmed Khan",
    email: "ahmed@learniq.com",
    phone: "+92 300 1234567",
    role: "Administrator",
    department: "System Administration",
    bio: "Platform administrator with a passion for educational technology and learning innovation.",
  });
  const [settings, setSettings] = useState({
    displayName: "Ahmed Khan",
    timezone: "(GMT+05:00) Pakistan Standard Time",
    language: "English",
    dashboard: "Platform Analytics",
  });
  const [tab, setTab] = useState(tabs[0]);
  const [sideTab, setSideTab] = useState(sideTabs[0].label);

  const p = (k: keyof typeof profile) => (e: React.ChangeEvent<any>) =>
    setProfile({ ...profile, [k]: e.target.value });
  const s = (k: keyof typeof settings) => (e: React.ChangeEvent<any>) =>
    setSettings({ ...settings, [k]: e.target.value });

  return (
    <div className="dash-page">
      <Sidebar />
      <Header />

      <main className="dash-main">
        <div className="pf-app">
          <div className="pf-content">
            {/* ---------- LEFT ---------- */}
            <div className="pf-left">
              <section className="pf-hero">
                <div className="pf-hero-icon"><UserCircle size={22} /></div>
                <div>
                  <h1>Admin Profile</h1>
                  <p>Manage your <b>profile information</b>, preferences and account settings.</p>
                </div>
                <div className="pf-hero-art"><Settings size={56} /></div>
              </section>

              {/* Profile information */}
              <section className="pf-card">
                <h3 className="pf-card-title"><User size={15} /> Profile Information</h3>
                <div className="pf-profile-grid">
                  <div className="pf-profile-side">
                    <div className="pf-photo">
                      <div className="pf-avatar lg">AK</div>
                      <button className="pf-camera" aria-label="Change photo"><Camera size={13} /></button>
                    </div>
                    <h4>{profile.fullName}</h4>
                    <span className="pf-role">Administrator</span>
                    <span className="pf-pill green">Active</span>

                    <ul className="pf-meta">
                      <li><span className="pf-meta-ico"><CalendarDays size={14} /></span><div><small>Joined</small>Jun 01, 2025</div></li>
                      <li><span className="pf-meta-ico"><LogIn size={14} /></span><div><small>Last Login</small>May 28, 2025 04:32 PM</div></li>
                      <li><span className="pf-meta-ico"><UserCircle size={14} /></span><div><small>Account Status</small>Active</div></li>
                    </ul>
                  </div>

                  <div className="pf-form">
                    <label className="full">Full Name <b>*</b>
                      <input value={profile.fullName} onChange={p("fullName")} />
                    </label>
                    <label>Email Address <b>*</b>
                      <input type="email" value={profile.email} onChange={p("email")} />
                    </label>
                    <label>Phone Number
                      <input value={profile.phone} onChange={p("phone")} />
                    </label>
                    <label>Role
                      <select value={profile.role} onChange={p("role")}>
                        <option>Administrator</option><option>Moderator</option><option>Editor</option>
                      </select>
                    </label>
                    <label>Department
                      <input value={profile.department} onChange={p("department")} />
                    </label>
                    <label className="full">Bio
                      <textarea rows={4} value={profile.bio} onChange={p("bio")} />
                    </label>
                    <div className="full pf-right">
                      <button className="pf-btn"><Save size={14} /> Update Profile</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Settings tabs */}
              <section className="pf-card pf-settings">
                <div className="pf-tabs">
                  {tabs.map((t) => (
                    <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
                  ))}
                </div>

                <div className="pf-settings-body">
                  <ul className="pf-side-tabs">
                    {sideTabs.map((t) => (
                      <li key={t.label}>
                        <button className={sideTab === t.label ? "active" : ""} onClick={() => setSideTab(t.label)}>
                          <t.icon size={15} /> {t.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="pf-settings-pane">
                    <h3>General Settings</h3>
                    <p>Manage your basic account settings and preferences.</p>

                    <div className="pf-form">
                      <label className="full">Display Name
                        <input value={settings.displayName} onChange={s("displayName")} />
                      </label>
                      <label>Timezone
                        <select value={settings.timezone} onChange={s("timezone")}>
                          <option>(GMT+05:00) Pakistan Standard Time</option>
                          <option>(GMT+00:00) UTC</option>
                          <option>(GMT+04:00) Gulf Standard Time</option>
                        </select>
                      </label>
                      <label>Language
                        <select value={settings.language} onChange={s("language")}>
                          <option>English</option><option>Urdu</option>
                        </select>
                      </label>
                      <label>Default Dashboard
                        <select value={settings.dashboard} onChange={s("dashboard")}>
                          <option>Platform Analytics</option><option>User Overview</option><option>Notifications</option>
                        </select>
                      </label>
                      <div className="full pf-right">
                        <button className="pf-btn"><Save size={14} /> Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ---------- RIGHT ---------- */}
            <aside className="pf-right-col">
              <div className="pf-card">
                <h4 className="pf-card-title"><Zap size={15} /> Quick Actions</h4>
                <div className="pf-quick-grid">
                  {quickActions.map((q) => (
                    <button key={q.title} className="pf-quick">
                      <span className="pf-quick-ico"><q.icon size={17} /></span>
                      <span><strong>{q.title}</strong><small>{q.sub}</small></span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-head">
                  <h4 className="pf-card-title"><Activity size={15} /> Recent Activity</h4>
                  <a>View All <ArrowRight size={13} /></a>
                </div>
                {activity.map((a, i) => (
                  <div key={i} className="pf-activity">
                    <span className={`pf-circle ${a.color}`}><a.icon size={15} /></span>
                    <div><strong>{a.title}</strong><small>{a.sub}</small></div>
                    <time>{a.time}</time>
                  </div>
                ))}
              </div>

              <div className="pf-card">
                <div className="pf-head">
                  <h4 className="pf-card-title"><ShieldCheck size={15} /> Security Overview</h4>
                  <a>View Details <ArrowRight size={13} /></a>
                </div>
                {security.map((x) => (
                  <div key={x.label} className="pf-sec">
                    <span className="pf-circle purple"><x.icon size={15} /></span>
                    <strong>{x.label}</strong>
                    <span className={`pf-pill ${x.tone}`}>{x.value}</span>
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