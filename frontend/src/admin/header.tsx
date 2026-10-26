import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // bahar click ya Esc par dropdown band
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const goProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <header className="adm-header">
      <div className="adm-search">
        <Search size={16} className="adm-search-icon" />
        <input
          type="text"
          placeholder="Search users, classes, courses, quizzes..."
        />
        <span className="adm-kbd">Ctrl + K</span>
      </div>

      <div className="adm-header-right">
        <button className="adm-bell" aria-label="Notifications">
          <Bell size={20} />
          <span className="adm-bell-badge">2</span>
        </button>

        <div className="adm-profile-wrap" ref={wrapRef}>
          <button
            type="button"
            className="adm-profile"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <div className="adm-avatar">AK</div>
            <div className="adm-profile-text">
              <span className="adm-profile-name">Ahmed Khan</span>
              <span className="adm-profile-role">Admin</span>
            </div>
            <ChevronDown
              size={16}
              className={"adm-chevron" + (open ? " open" : "")}
            />
          </button>

          {open && (
            <div className="adm-menu" role="menu">
              <button
                type="button"
                className="adm-menu-item"
                role="menuitem"
                onClick={goProfile}
              >
                <UserCircle size={16} />
                <span>Admin Profile</span>
              </button>
              <button
                type="button"
                className="adm-menu-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}