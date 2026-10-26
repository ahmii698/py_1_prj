import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Moon, Sun, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./header.css";

interface HeaderProps {
  teacherName?: string;
  teacherRole?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

export default function Header({
  teacherName,
  teacherRole = "Teacher",
  notificationCount = 3,
  onLogout,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Naam login wale user se aata hai (agar parent ne alag naam nahi diya)
  const displayName = teacherName ?? user?.name ?? "Teacher";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout?.();
    logout();
    navigate("/login", { replace: true });
  };

  // Ctrl+K / Cmd+K se search focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bahar click par dropdown band
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Dark mode: html par data-theme set hota hai
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="th-header">
      <div className="th-search">
        <Search size={17} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search students, classes, or quizzes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <kbd>Ctrl + K</kbd>
      </div>

      <div className="th-right">
        <button className="th-icon-btn" aria-label="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && <span className="th-badge">{notificationCount}</span>}
        </button>

        <button
          className="th-icon-btn"
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="th-profile-wrap" ref={menuRef}>
          <button className="th-profile" onClick={() => setMenuOpen((o) => !o)}>
            <span className="th-avatar">{initials}</span>
            <span className="th-profile-text">
              <strong>{displayName}</strong>
              <small>{teacherRole}</small>
            </span>
            <ChevronDown size={16} className={menuOpen ? "th-chevron open" : "th-chevron"} />
          </button>

          {menuOpen && (
            <div className="th-dropdown">
              <button><User size={16} /> Teacher Profile</button>
              <button><Settings size={16} /> Settings</button>
              <div className="th-divider" />
              <button className="th-logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}