import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  School,
  BarChart3,
  FileBarChart,
  Megaphone,
  Mail,
  UserCheck,
  UserCircle,
  BookMarked,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

const sections = [
  {
    title: "USER MANAGEMENT",
    items: [
      { label: "All Users", to: "/admin/users", icon: Users },
      { label: "Classes & Enrollment", to: "/admin/classes", icon: School },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Platform Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "Reports & Export", to: "/admin/reports", icon: FileBarChart },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
      { label: "Notifications & Email", to: "/admin/notifications", icon: Mail },
    ],
  },
  {
    title: "SYSTEM ADMINISTRATION",
    items: [
      { label: "Pending Approvals", to: "/admin/approvals", icon: UserCheck },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { label: "Admin Profile", to: "/admin/profile", icon: UserCircle },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="adm-sidebar">
      <div className="adm-brand">
        <div className="adm-brand-logo">
          <BookMarked size={22} />
        </div>
        <div className="adm-brand-text">
          <span className="adm-brand-name">LearnIQ</span>
          <span className="adm-brand-sub">AI Adaptive Learning Platform</span>
        </div>
      </div>

      <nav className="adm-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            "adm-link adm-link-dash" + (isActive ? " active" : "")
          }
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>

        {sections.map((section) => (
          <div className="adm-section" key={section.title}>
            <p className="adm-section-title">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    "adm-link" + (isActive ? " active" : "")
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <button type="button" className="adm-logout" onClick={logout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      <div className="adm-promo">
        <div className="adm-promo-text">
          <span>Better Learning</span>
          <span>Brighter Future</span>
        </div>
        <div className="adm-promo-art">🎓</div>
      </div>
    </aside>
  );
}