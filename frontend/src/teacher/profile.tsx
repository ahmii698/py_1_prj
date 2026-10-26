import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  BadgeCheck, Camera, Pencil, Mail, MapPin, Users, GraduationCap, BookOpen, Award,
  User, Phone, CalendarDays, Briefcase, FileText, Languages, Clock, Heart, Link2,
  Lock, Download, CalendarClock, ChevronRight, Zap, Settings2, TrendingUp, Activity,
  ClipboardCheck, FileUp, CalendarCheck, UserPlus, MessageCircle,
  Code2, Boxes, Globe, Database, Medal, Trophy, Star, type LucideIcon,
} from "lucide-react";

// ⚠️ Apne project ke hisaab se path adjust kar lena
import Sidebar from "./sidebar";
import Header from "./header";

import "./profile.css";

/* ---------------- Data (baad mein backend se aayega) ---------------- */
const TEACHER = {
  name: "Ahmed Khan",
  role: "Teacher",
  status: "Active",
  email: "ahmed.khan@example.com",
  location: "Karachi, Pakistan",
  phone: "+92 300 1234567",
  dob: "March 15, 1998",
  gender: "Male",
  qualification: "BS Computer Science (2020)",
  experience: "8 Years",
  bio: "Passionate about teaching and helping students achieve their goals. Always love to explore new ways of making learning easier and more effective.",
  languages: "English, Urdu",
  style: "Interactive & Practical",
  availability: "Mon - Fri (9:00 AM - 5:00 PM)",
  interests: "Technology, AI, Web Development, Teaching, Reading",
};

const STATS: { label: string; value: number; icon: LucideIcon }[] = [
  { label: "Total Classes", value: 5, icon: Users },
  { label: "Total Students", value: 124, icon: GraduationCap },
  { label: "Total Quizzes", value: 24, icon: BookOpen },
  { label: "Years Experience", value: 8, icon: Award },
];

const INFO: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Full Name", value: TEACHER.name, icon: User },
  { label: "Email Address", value: TEACHER.email, icon: Mail },
  { label: "Phone Number", value: TEACHER.phone, icon: Phone },
  { label: "Date of Birth", value: TEACHER.dob, icon: CalendarDays },
  { label: "Gender", value: TEACHER.gender, icon: User },
  { label: "Qualification", value: TEACHER.qualification, icon: GraduationCap },
  { label: "Experience", value: TEACHER.experience, icon: Briefcase },
  { label: "Location", value: TEACHER.location, icon: MapPin },
  { label: "Bio", value: TEACHER.bio, icon: FileText },
];

const SUBJECTS: { name: string; sub: string; classes: string; icon: LucideIcon; color: string }[] = [
  { name: "Data Structures & Algorithms", sub: "BSCS - Semester 3", classes: "2 Classes", icon: Code2, color: "green" },
  { name: "Object Oriented Programming", sub: "BSCS - Semester 3", classes: "1 Class", icon: Boxes, color: "pink" },
  { name: "Web Development", sub: "BSCS - Semester 4", classes: "1 Class", icon: Globe, color: "orange" },
  { name: "Database Systems", sub: "BSCS - Semester 3", classes: "1 Class", icon: Database, color: "blue" },
];

const TEACH_STATS: { label: string; value: string; icon: LucideIcon; color: string }[] = [
  { label: "Average Quiz Score", value: "92%", icon: TrendingUp, color: "green" },
  { label: "Assignment Completion", value: "85%", icon: ClipboardCheck, color: "violet" },
  { label: "Total Students", value: "124", icon: Users, color: "blue" },
  { label: "Total Assignments", value: "28", icon: FileText, color: "orange" },
];

const ACHIEVEMENTS: { title: string; by: string; icon: LucideIcon; color: string }[] = [
  { title: "Certified Laravel Developer", by: "Udemy • 2022", icon: Medal, color: "orange" },
  { title: "Advanced React Development", by: "Coursera • 2021", icon: Star, color: "blue" },
  { title: "Teaching Excellence Award", by: "FAST-NUCES • 2020", icon: Trophy, color: "violet" },
  { title: "Python for Data Science", by: "Coursera • 2019", icon: Award, color: "green" },
];

const QUICK: { label: string; icon: LucideIcon }[] = [
  { label: "Update Profile", icon: Pencil },
  { label: "Change Password", icon: Lock },
  { label: "Manage Subjects", icon: Settings2 },
  { label: "View Teaching Schedule", icon: CalendarClock },
  { label: "Download CV", icon: Download },
];

const ACTIVITY: { title: string; sub: string; time: string; icon: LucideIcon }[] = [
  { title: "New quiz created", sub: "Data Structures Quiz 2", time: "20 May, 2025 • 10:24 AM", icon: ClipboardCheck },
  { title: "Assignment submitted", sub: "OOP Assignment", time: "18 May, 2025 • 03:12 PM", icon: FileUp },
  { title: "Class session updated", sub: "BSCS - Semester 3", time: "16 May, 2025 • 11:45 AM", icon: CalendarCheck },
  { title: "New student enrolled", sub: "BSCS - Semester 3", time: "14 May, 2025 • 09:20 AM", icon: UserPlus },
];

/* ---------------- Small reusable pieces ---------------- */
const CardHead = ({ icon: Icon, title, action }: { icon: LucideIcon; title: string; action?: "edit" | string }) => (
  <div className="prf-card-head">
    <h3><span className="prf-head-icon"><Icon size={16} /></span>{title}</h3>
    {action === "edit" ? (
      <button className="prf-edit-btn"><Pencil size={11} /> Edit</button>
    ) : action ? (
      <button className="prf-link">{action}</button>
    ) : null}
  </div>
);

export default function Profile() {
  const [photo, setPhoto] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = TEACHER.name.split(" ").map((w) => w[0]).join("");

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const Avatar = ({ size }: { size: number }) => (
    <div className="prf-avatar" style={{ width: size, height: size }}>
      {photo ? <img src={photo} alt={TEACHER.name} /> : <span style={{ fontSize: size / 3 }}>{initials}</span>}
      <button className="prf-cam" onClick={() => fileRef.current?.click()} aria-label="Change photo">
        <Camera size={13} />
      </button>
    </div>
  );

  return (
    <div className="teacher-layout">
      <Sidebar />

      <div className="teacher-main">
        <Header />

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />

        <div className="prf-page">
          {/* ============ Center ============ */}
          <div className="prf-center">
            {/* Hero */}
            <section className="prf-hero">
              <Avatar size={104} />

              <div className="prf-hero-info">
                <h1>{TEACHER.name} <BadgeCheck size={18} className="prf-verified" /></h1>
                <div className="prf-role">
                  <span>{TEACHER.role}</span>
                  <em className="prf-active">{TEACHER.status}</em>
                </div>
                <p className="prf-line"><Mail size={12} /> {TEACHER.email}</p>
                <p className="prf-line"><MapPin size={12} /> {TEACHER.location}</p>
                <p className="prf-bio">{TEACHER.bio}</p>
              </div>

              <div className="prf-stats">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="prf-stat" key={s.label}>
                      <Icon size={15} />
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              <button className="prf-hero-edit"><Pencil size={12} /> Edit Profile</button>
            </section>

            <div className="prf-cols">
              {/* Left column */}
              <div className="prf-col">
                <section className="prf-card">
                  <CardHead icon={User} title="Profile Information" action="edit" />
                  <ul className="prf-info">
                    {INFO.map((r) => {
                      const Icon = r.icon;
                      return (
                        <li key={r.label}>
                          <span className="prf-info-label"><Icon size={13} />{r.label}</span>
                          <span className="prf-info-value">{r.value}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="prf-card">
                  <CardHead icon={Award} title="Achievements & Certifications" action="Manage" />
                  <ul className="prf-ach">
                    {ACHIEVEMENTS.map((a) => {
                      const Icon = a.icon;
                      return (
                        <li key={a.title}>
                          <span className={`prf-badge ${a.color}`}><Icon size={20} /></span>
                          <div><h4>{a.title}</h4><p>{a.by}</p></div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>

              {/* Middle column */}
              <div className="prf-col">
                <section className="prf-card">
                  <CardHead icon={BookOpen} title="Subjects & Classes" action="Manage" />
                  <ul className="prf-subjects">
                    {SUBJECTS.map((s) => {
                      const Icon = s.icon;
                      return (
                        <li key={s.name}>
                          <span className={`prf-badge ${s.color}`}><Icon size={20} /></span>
                          <div className="prf-sub-text"><h4>{s.name}</h4><p>{s.sub}</p></div>
                          <span className="prf-pill">{s.classes}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="prf-card">
                  <CardHead icon={TrendingUp} title="Teaching Statistics" action="View Details" />
                  <div className="prf-tstats">
                    {TEACH_STATS.map((t) => {
                      const Icon = t.icon;
                      return (
                        <div className={`prf-tstat ${t.color}`} key={t.label}>
                          <span className="prf-tstat-icon"><Icon size={20} /></span>
                          <div><strong>{t.value}</strong><p>{t.label}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="prf-card">
                  <CardHead icon={FileText} title="Additional Information" action="edit" />
                  <ul className="prf-extra">
                    <li><span><Languages size={13} />Languages</span><b>{TEACHER.languages}</b></li>
                    <li><span><BookOpen size={13} />Teaching Style</span><b>{TEACHER.style}</b></li>
                    <li><span><Clock size={13} />Availability</span><b>{TEACHER.availability}</b></li>
                    <li><span><Heart size={13} />Interests</span><b>{TEACHER.interests}</b></li>
                    <li>
                      <span><Link2 size={13} />Social Links</span>
                      <div className="prf-social">
                        <a href="#" aria-label="Website"><Globe size={15} /></a>
                        <a href="#" aria-label="Link"><Link2 size={15} /></a>
                        <a href="#" aria-label="Chat"><MessageCircle size={15} /></a>
                        <a href="#" aria-label="Email"><Mail size={15} /></a>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>

          {/* ============ Right ============ */}
          <aside className="prf-side">
            <section className="prf-card prf-photo-card">
              <CardHead icon={Zap} title="Profile Picture" action="edit" />
              <Avatar size={92} />
              <button className="prf-change" onClick={() => fileRef.current?.click()}>Change Photo</button>
            </section>

            <section className="prf-card">
              <CardHead icon={Zap} title="Quick Actions" />
              <ul className="prf-quick">
                {QUICK.map((q) => {
                  const Icon = q.icon;
                  return (
                    <li key={q.label}>
                      <button>
                        <span className="prf-quick-icon"><Icon size={14} /></span>
                        {q.label}
                        <ChevronRight size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="prf-card">
              <CardHead icon={Activity} title="Recent Activity" action="View All →" />
              <ul className="prf-activity">
                {ACTIVITY.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.title + a.time}>
                      <span className="prf-act-icon"><Icon size={17} /></span>
                      <div><h4>{a.title}</h4><p>{a.sub}</p><small>{a.time}</small></div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}