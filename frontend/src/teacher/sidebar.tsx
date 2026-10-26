import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  BookOpen,
  HelpCircle,
  FilePlus2,
  FileText,
  TrendingUp,
  Sparkles,
  FileDown,
  Bell,
  User,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// NOTE: paths apne routes ke mutabiq change kar lena
const SECTIONS: NavSection[] = [
  {
    items: [{ label: "Dashboard", path: "/teacher", icon: LayoutDashboard, end: true }],
  },
  {
    title: "TEACHING",
    items: [
      { label: "My Classes", path: "/teacher/classes", icon: Users },
      { label: "My Students", path: "/teacher/students", icon: UserRound },
      { label: "Courses & Subjects", path: "/teacher/courses", icon: BookOpen },
      { label: "Question Bank", path: "/teacher/question-bank", icon: HelpCircle },
    ],
  },
  {
    title: "ASSESSMENTS",
    items: [
      { label: "Create Quiz", path: "/teacher/create-quiz", icon: FilePlus2 },
      { label: "My Quizzes", path: "/teacher/quizzes", icon: FileText },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Student Performance", path: "/teacher/performance", icon: TrendingUp },
      { label: "AI Teaching Insights", path: "/teacher/ai-insights", icon: Sparkles },
      { label: "Reports & Export", path: "/teacher/reports", icon: FileDown },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { label: "Notifications", path: "/teacher/notifications", icon: Bell },
      { label: "Teacher Profile", path: "/teacher/profile", icon: User },
      { label: "Settings", path: "/teacher/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="ts-sidebar">
      <div className="ts-logo">
        <span className="ts-logo-icon">
          <GraduationCap size={22} />
        </span>
        <div className="ts-logo-text">
          <strong>LearnIQ</strong>
          <small>Smart Learning, Better Future</small>
        </div>
      </div>

      <nav className="ts-nav">
        {SECTIONS.map((section, i) => (
          <div className="ts-section" key={i}>
            {section.title && <p className="ts-section-title">{section.title}</p>}
            <ul>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) => (isActive ? "ts-link active" : "ts-link")}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="ts-section">
          <button type="button" className="ts-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}