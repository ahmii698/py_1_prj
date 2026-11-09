import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Moon, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./header.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Naam login wale user se aata hai
  const displayName = user?.name ?? "Student";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Dropdown band karke page par redirect
  const goTo = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

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

  return (
    <header className="hd">
      <div className="hd-search">
        <Search size={16} className="hd-search-icon" />
        <input
          type="text"
          placeholder="Search for courses, topics, quizzes..."
        />
        <span className="hd-kbd">⌘ K</span>
      </div>

      <div className="hd-right">
        <button
          type="button"
          className="hd-icon-btn"
          aria-label="Notifications"
          onClick={() => navigate("/student/notifications")}
        >
          <Bell size={18} />
          <span className="hd-notif">3</span>
        </button>

        <button type="button" className="hd-icon-btn" aria-label="Dark mode">
          <Moon size={18} />
        </button>

        <div className="hd-profile-wrap" ref={menuRef}>
          <div
            className="hd-user"
            onClick={() => setMenuOpen((o) => !o)}
            role="button"
            tabIndex={0}
          >
            <div className="hd-avatar">{initials}</div>
            <div className="hd-user-info">
              <p className="hd-user-name">{displayName}</p>
              <p className="hd-user-role">Student</p>
            </div>
            <ChevronDown
              size={16}
              className={menuOpen ? "hd-chevron open" : "hd-chevron"}
            />
          </div>

          {menuOpen && (
            <div className="hd-dropdown">
              <button type="button" onClick={() => goTo("/student/profile")}>
                <User size={16} /> My Profile
              </button>
              <button type="button" onClick={() => goTo("/student/settings")}>
                <Settings size={16} /> Settings
              </button>
              <div className="hd-divider" />
              <button type="button" className="hd-logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;