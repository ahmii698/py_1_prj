import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Play,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { registerUser } from "../services/api";
import "./register.css";

type SignupRole = "student" | "teacher";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

const perks = [
  "Free account for students and teachers",
  "Quizzes generated from your own PDFs",
  "Progress tracking with smart insights",
];

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState<SignupRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  /* Account ban jaye to login par redirect */
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => navigate("/login", { replace: true }), 1800);
    return () => window.clearTimeout(t);
  }, [done, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError("Please enter your full name (at least 3 characters)");
      return;
    }
    if (!isEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password, role });
      setDone(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-shell">
        {/* ---------- Left brand panel ---------- */}
        <aside className="rg-side">
          <div className="rg-brand light">
            <span className="rg-logo">
              <Play size={16} fill="#6d4aff" />
            </span>
            <div>
              <h2>LearnIQ</h2>
              <p>Smart Learning, Better Future</p>
            </div>
          </div>

          <div className="rg-side-body">
            <h1>Start your learning journey today.</h1>
            <p>
              Create your account in a minute and turn your study material into
              a smarter way to learn.
            </p>
            <ul>
              {perks.map((p) => (
                <li key={p}>
                  <CheckCircle2 size={16} /> {p}
                </li>
              ))}
            </ul>
          </div>

          <small>Small steps every day lead to big results.</small>
        </aside>

        {/* ---------- Form ---------- */}
        <main className="rg-form-wrap">
          {done ? (
            <div className="rg-success">
              <span className="rg-success-icon">
                <CheckCircle2 size={34} />
              </span>
              <h1>Account Created!</h1>
              <p>
                Your {role} account is ready. Redirecting you to login...
              </p>
              <Link to="/login" className="rg-btn">
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="rg-form" onSubmit={handleSubmit} noValidate>
              <div className="rg-brand mobile">
                <span className="rg-logo">
                  <Play size={16} fill="#fff" />
                </span>
                <div>
                  <h2>LearnIQ</h2>
                  <p>Smart Learning, Better Future</p>
                </div>
              </div>

              <h1>Create account</h1>
              <p className="rg-sub">Sign up to get started with LearnIQ.</p>

              <p className="rg-label">I am a</p>
              <div className="rg-roles">
                <button
                  type="button"
                  className={`rg-role ${role === "student" ? "on" : ""}`}
                  onClick={() => setRole("student")}
                >
                  <GraduationCap size={18} />
                  Student
                </button>
                <button
                  type="button"
                  className={`rg-role ${role === "teacher" ? "on" : ""}`}
                  onClick={() => setRole("teacher")}
                >
                  <BookOpen size={18} />
                  Teacher
                </button>
              </div>

              <label className="rg-field">
                Full Name
                <div className="rg-input">
                  <User size={16} />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </label>

              <label className="rg-field">
                Email Address
                <div className="rg-input">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="rg-field">
                Password
                <div className="rg-input">
                  <Lock size={16} />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="rg-eye"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="rg-field">
                Confirm Password
                <div className="rg-input">
                  <KeyRound size={16} />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </label>

              {error && (
                <p className="rg-msg error">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              <button type="submit" className="rg-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="rg-switch">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

export default Register;