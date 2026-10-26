import { Search, Bell, Moon, ChevronDown } from "lucide-react";
import "./header.css";

function Header() {
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
        <button type="button" className="hd-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="hd-notif">3</span>
        </button>

        <button type="button" className="hd-icon-btn" aria-label="Dark mode">
          <Moon size={18} />
        </button>

        <div className="hd-user">
          <div className="hd-avatar">AK</div>
          <div className="hd-user-info">
            <p className="hd-user-name">Ahmed Khan</p>
            <p className="hd-user-role">Student</p>
          </div>
          <ChevronDown size={16} className="hd-chevron" />
        </div>
      </div>
    </header>
  );
}

export default Header;