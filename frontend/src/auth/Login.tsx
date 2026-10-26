import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Play,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginUser } from "../services/api";
import type { Role } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const homeFor: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

const features = [
  "Turn your PDFs into smart quizzes",
  "Track your progress and weak topics",
  "Get AI recommendations to study better",
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res);
      navigate(homeFor[res.user.role], { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-shell">
        {/* ---------- Left brand panel ---------- */}
        <aside className="lg-side">
          <div className="lg-brand light">
            <span className="lg-logo">
              <Play size={16} fill="#6d4aff" />
            </span>
            <div>
              <h2>LearnIQ</h2>
              <p>Smart Learning, Better Future</p>
            </div>
          </div>

          <div className="lg-side-body">
            <h1>Learn smarter, not harder.</h1>
            <p>
              Upload your study material, generate quizzes and watch your
              performance grow every day.
            </p>
            <ul>
              {features.map((f) => (
                <li key={f}>
                  <CheckCircle2 size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>

          <small>Small steps every day lead to big results.</small>
        </aside>

        {/* ---------- Form ---------- */}
        <main className="lg-form-wrap">
          <form className="lg-form" onSubmit={handleSubmit} noValidate>
            <div className="lg-brand mobile">
              <span className="lg-logo">
                <Play size={16} fill="#fff" />
              </span>
              <div>
                <h2>LearnIQ</h2>
                <p>Smart Learning, Better Future</p>
              </div>
            </div>

            <h1>Welcome back</h1>
            <p className="lg-sub">Login to continue to your account.</p>

            <label className="lg-field">
              Email Address
              <div className="lg-input">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </label>

            <label className="lg-field">
              Password
              <div className="lg-input">
                <Lock size={16} />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <div className="lg-row">
              <Link to="/forgot-password" className="lg-forgot">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="lg-msg error">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="lg-switch">
              Don't have an account? <Link to="/register">Create account</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;