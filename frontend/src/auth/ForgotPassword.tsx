import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { sendOtp, verifyOtp, resetPassword } from "../services/api";
import "./forgotpassword.css";

type Step = 1 | 2 | 3;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

const steps = ["Email", "Verify", "Reset"];

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);

  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  /* Resend timer */
  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  /* Reset hone ke baad login par redirect */
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => navigate("/login", { replace: true }), 1800);
    return () => window.clearTimeout(t);
  }, [done, navigate]);

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  /* ---------- Step 1: email ---------- */
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(email);
      setStep(2);
      setSeconds(RESEND_SECONDS);
      setInfo(`We sent a 6-digit OTP to ${email.trim()}`);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Step 2: otp ---------- */
  const setDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < OTP_LENGTH - 1) boxes.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      boxes.current[i - 1]?.focus();
    }
  };

  const onOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((d, idx) => (next[idx] = d));
    setOtp(next);
    boxes.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, code);
      setStep(3);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clearMessages();
    setLoading(true);
    try {
      await sendOtp(email);
      setOtp(Array(OTP_LENGTH).fill(""));
      setSeconds(RESEND_SECONDS);
      setInfo("A new OTP has been sent to your email");
      boxes.current[0]?.focus();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Step 3: new password ---------- */
  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

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
      await resetPassword(email, otp.join(""), password);
      setDone(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    clearMessages();
    setOtp(Array(OTP_LENGTH).fill(""));
    setStep(1);
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        {/* Brand */}
        <div className="fp-brand">
          <span className="fp-logo">
            <Play size={16} fill="#fff" />
          </span>
          <div>
            <h2>LearnIQ</h2>
            <p>Smart Learning, Better Future</p>
          </div>
        </div>

        {done ? (
          <div className="fp-success">
            <span className="fp-success-icon">
              <CheckCircle2 size={34} />
            </span>
            <h1>Password Reset!</h1>
            <p>Your password has been changed successfully. Redirecting you to login...</p>
            <Link to="/login" className="fp-btn">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <ol className="fp-steps">
              {steps.map((label, i) => {
                const n = i + 1;
                const state = n < step ? "done" : n === step ? "active" : "";
                return (
                  <li key={label} className={state}>
                    <span>{n < step ? "✓" : n}</span>
                    {label}
                  </li>
                );
              })}
            </ol>

            {/* ---------- Step 1 ---------- */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} noValidate>
                <h1>Forgot Password?</h1>
                <p className="fp-sub">
                  Enter your registered email and we'll send you an OTP to reset your password.
                </p>

                <label className="fp-field">
                  Email Address
                  <div className="fp-input">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </label>

                {error && (
                  <p className="fp-msg error">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}

                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* ---------- Step 2 ---------- */}
            {step === 2 && (
              <form onSubmit={handleVerify} noValidate>
                <h1>Enter OTP</h1>
                <p className="fp-sub">
                  Type the 6-digit code sent to <strong>{email.trim()}</strong>
                </p>

                <div className="fp-otp">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        boxes.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      autoFocus={i === 0}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onOtpKeyDown(i, e)}
                      onPaste={onOtpPaste}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                {info && (
                  <p className="fp-msg info">
                    <CheckCircle2 size={14} /> {info}
                  </p>
                )}
                {error && (
                  <p className="fp-msg error">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}

                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="fp-resend">
                  {seconds > 0 ? (
                    <span>Resend OTP in {seconds}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} disabled={loading}>
                      Resend OTP
                    </button>
                  )}
                  <button type="button" onClick={goBackToEmail}>
                    Change email
                  </button>
                </div>
              </form>
            )}

            {/* ---------- Step 3 ---------- */}
            {step === 3 && (
              <form onSubmit={handleReset} noValidate>
                <h1>Set New Password</h1>
                <p className="fp-sub">
                  Choose a strong password you haven't used before (minimum 8 characters).
                </p>

                <label className="fp-field">
                  New Password
                  <div className="fp-input">
                    <Lock size={16} />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="fp-eye"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="fp-field">
                  Confirm Password
                  <div className="fp-input">
                    <KeyRound size={16} />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </label>

                {error && (
                  <p className="fp-msg error">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}

                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <Link to="/login" className="fp-back">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;