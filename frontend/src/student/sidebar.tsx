import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Play,
  LayoutGrid,
  FileText,
  FilePlus2,
  History,
  BarChart3,
  Sparkles,
  CalendarDays,
  Layers,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

interface MenuItem {
  label: string;
  icon: ReactNode;
  to: string;
  badge?: number;
  end?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const ICON_SIZE = 18;

const sections: MenuSection[] = [
  {
    items: [
      { label: "Overview", icon: <LayoutGrid size={ICON_SIZE} />, to: "/student", end: true },
      { label: "My Documents", icon: <FileText size={ICON_SIZE} />, to: "/student/documents" },
      { label: "Generate Quiz", icon: <FilePlus2 size={ICON_SIZE} />, to: "/student/generate-quiz" },
      { label: "Quiz History", icon: <History size={ICON_SIZE} />, to: "/student/quiz-history" },
    ],
  },
  {
    title: "MY PROGRESS",
    items: [
      { label: "Performance Analytics", icon: <BarChart3 size={ICON_SIZE} />, to: "/student/analytics" },
      { label: "AI Recommendations", icon: <Sparkles size={ICON_SIZE} />, to: "/student/recommendations" },
    ],
  },
  {
    title: "PLANNING & REVISION",
    items: [
      { label: "Study Schedule", icon: <CalendarDays size={ICON_SIZE} />, to: "/student/schedule" },
      { label: "Flashcards", icon: <Layers size={ICON_SIZE} />, to: "/student/flashcards" },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { label: "Notifications", icon: <Bell size={ICON_SIZE} />, to: "/student/notifications", badge: 3 },
      { label: "My Profile", icon: <User size={ICON_SIZE} />, to: "/student/profile" },
      { label: "Settings", icon: <Settings size={ICON_SIZE} />, to: "/student/settings" },
    ],
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sb">
      <div className="sb-brand">
        <div className="sb-logo">
          <Play size={16} fill="#fff" />
        </div>
        <div>
          <h2 className="sb-brand-name">LearnIQ</h2>
          <p className="sb-brand-tag">Smart Learning, Better Future</p>
        </div>
      </div>

      <nav className="sb-nav">
        {sections.map((section, idx) => (
          <div className="sb-section" key={idx}>
            {section.title && (
              <p className="sb-section-title">{section.title}</p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sb-item ${isActive ? "active" : ""}`
                }
              >
                <span className="sb-item-icon">{item.icon}</span>
                <span className="sb-item-label">{item.label}</span>
                {item.badge && <span className="sb-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-promo">
        <p>
          Small steps
          <br />
          every day lead to
          <br />
          big results.
        </p>
        <svg
          className="sb-promo-art"
          viewBox="0 0 120 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="10,78 55,22 80,50 95,36 118,78" fill="#c4b5fd" />
          <polygon points="40,78 70,38 100,78" fill="#8b5cf6" />
          <line x1="55" y1="22" x2="55" y2="8" stroke="#6d4aff" strokeWidth="2" />
          <polygon points="55,8 70,13 55,18" fill="#6d4aff" />
        </svg>
        <div className="sb-dots">
          <span className="on" />
          <span />
          <span />
        </div>
      </div>

      <button type="button" className="sb-item sb-logout" onClick={handleLogout}>
        <span className="sb-item-icon">
          <LogOut size={ICON_SIZE} />
        </span>
        <span className="sb-item-label">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;