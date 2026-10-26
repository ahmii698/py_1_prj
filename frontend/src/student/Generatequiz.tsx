import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Sparkles,
  UploadCloud,
  FolderOpen,
  FileText,
  X,
  Settings2,
  HelpCircle,
  BarChart3,
  ListChecks,
  Layers,
  Tag,
  Clock,
  Upload,
  Zap,
  Lightbulb,
  Info,
  Check,
  ChevronRight,
  Code2,
  Globe,
  Terminal,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./generatequiz.css";

const MAX_SIZE_MB = 10;
const API_URL = "http://localhost:8000/api/quiz/generate";

/* Backend ready hone par isay false kar dena */
const USE_MOCK = true;

const steps = [
  { title: "Upload PDF", sub: "Add your study material" },
  { title: "Generate Quiz", sub: "AI will create questions" },
  { title: "Take Quiz", sub: "Answer the questions" },
  { title: "View Result", sub: "See your performance" },
];

const howItWorks = [
  { title: "Upload PDF", desc: "Add your study material (PDF)." },
  {
    title: "AI Generates Questions",
    desc: "Our AI analyzes the content and creates relevant questions.",
  },
  {
    title: "Take the Quiz",
    desc: "Answer the questions with a timer (if set).",
  },
  {
    title: "View Result",
    desc: "Get your score, detailed breakdown and improvement tips.",
  },
];

const tips = [
  "Use clear and readable PDFs for better results.",
  "For best accuracy, keep file size under 10MB.",
  "You can select specific pages or topics.",
  "The more focused your PDF, the better the quiz.",
];

const recentQuizzes = [
  {
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    score: "8/10",
    percent: 80,
    date: "May 18, 2025",
    color: "purple",
    icon: <Code2 size={18} />,
  },
  {
    title: "Web Development Basics",
    subject: "Web Development",
    score: "6/10",
    percent: 60,
    date: "May 16, 2025",
    color: "blue",
    icon: <Globe size={18} />,
  },
  {
    title: "Python Programming",
    subject: "Programming",
    score: "9/10",
    percent: 90,
    date: "May 12, 2025",
    color: "green",
    icon: <Terminal size={18} />,
  },
];

/* ---------- Fake quiz generator ---------- */
interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
}

interface Quiz {
  id: string;
  title: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function makeMockQuiz(opts: {
  fileName: string;
  count: number;
  difficulty: string;
  type: string;
  topic: string;
  timeLimit: number;
}): Quiz {
  const subject = opts.topic || opts.fileName.replace(/\.pdf$/i, "");
  const questions: Question[] = Array.from({ length: opts.count }, (_, i) => {
    const isTF =
      opts.type === "true_false" || (opts.type === "mixed" && i % 2 === 1);
    const answer = isTF ? i % 2 : i % 4;
    return {
      id: i + 1,
      text: isTF
        ? `(${opts.difficulty}) Statement ${i + 1} about "${subject}" is correct.`
        : `(${opts.difficulty}) Which of the following best describes concept ${i + 1} of "${subject}"?`,
      options: isTF
        ? ["True", "False"]
        : [`Option A`, `Option B`, `Option C`, `Option D`].map(
            (o, k) => `${o} for concept ${i + 1}${k === answer ? "" : ""}`
          ),
      answer,
    };
  });

  return {
    id: `mock-${Date.now()}`,
    title: `${subject} Quiz`,
    difficulty: opts.difficulty,
    timeLimit: opts.timeLimit,
    questions,
  };
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function GenerateQuiz() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [numQuestions, setNumQuestions] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionType, setQuestionType] = useState("mcq");
  const [pages, setPages] = useState("all");
  const [topic, setTopic] = useState("");
  const [timeLimit, setTimeLimit] = useState("0");

  // Stepper: 1 = upload, 2 = generating, 3 = generated (ready to take)
  const currentStep = quiz ? 3 : loading ? 2 : 1;

  const validateAndSet = (f: File | undefined | null) => {
    if (!f) return;
    setError("");

    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Only PDF files are supported.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setQuiz(null);
  };

  const onChoose = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0]);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setQuiz(null);
  };

  const resetAll = () => {
    setFile(null);
    setQuiz(null);
    setError("");
  };

  const handleGenerate = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setQuiz(null);

    try {
      if (USE_MOCK) {
        await sleep(2000); // fake processing time
        const mock = makeMockQuiz({
          fileName: file.name,
          count: Number(numQuestions),
          difficulty,
          type: questionType,
          topic: topic.trim(),
          timeLimit: Number(timeLimit),
        });
        try {
          localStorage.setItem("lastGeneratedQuiz", JSON.stringify(mock));
        } catch {
          /* ignore */
        }
        setQuiz(mock);
        return;
      }

      const form = new FormData();
      form.append("file", file);
      form.append("num_questions", numQuestions);
      form.append("difficulty", difficulty);
      form.append("question_type", questionType);
      form.append("pages", pages);
      form.append("topic", topic.trim());
      form.append("time_limit", timeLimit);

      const res = await fetch(API_URL, { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Failed to generate quiz.");
      }

      const data = await res.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gq-shell">
      <Sidebar />

      <div className="gq-main">
        <Header />

        <div className="gq-content">
          {/* ===== Center column ===== */}
          <div className="gq-center">
            {/* Banner */}
            <section className="gq-banner">
              <div className="gq-banner-icon">
                <Sparkles size={26} />
              </div>
              <div className="gq-banner-text">
                <h1>Generate Quiz</h1>
                <p>
                  Upload your PDF, let AI create questions, and test your
                  knowledge — all in one place.
                </p>
              </div>
              <div className="gq-banner-art" aria-hidden="true">
                <span className="gq-banner-note">
                  Turn your study
                  <br />
                  materials into
                  <br />
                  interactive quizzes!
                </span>
                <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="22"
                    y="14"
                    width="70"
                    height="66"
                    rx="8"
                    fill="#ede9fe"
                    stroke="#c4b5fd"
                  />
                  <rect x="32" y="26" width="34" height="5" rx="2.5" fill="#a78bfa" />
                  <rect x="32" y="38" width="50" height="4" rx="2" fill="#ddd6fe" />
                  <rect x="32" y="48" width="50" height="4" rx="2" fill="#ddd6fe" />
                  <rect x="32" y="58" width="40" height="4" rx="2" fill="#ddd6fe" />
                  <circle cx="92" cy="62" r="16" fill="#8b5cf6" />
                  <path
                    d="M85 62l5 5 9-10"
                    stroke="#fff"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </section>

            {/* Stepper */}
            <section className="gq-stepper">
              {steps.map((s, i) => {
                const n = i + 1;
                const state =
                  n < currentStep ? "done" : n === currentStep ? "active" : "";
                return (
                  <div className={`gq-step ${state}`} key={s.title}>
                    <div className="gq-step-num">
                      {n < currentStep ? <Check size={14} /> : n}
                    </div>
                    <div className="gq-step-text">
                      <p className="gq-step-title">{s.title}</p>
                      <p className="gq-step-sub">{s.sub}</p>
                    </div>
                    {i < steps.length - 1 && <div className="gq-step-line" />}
                  </div>
                );
              })}
            </section>

            {/* Upload card */}
            <section className="gq-card">
              <div className="gq-card-head">
                <div className="gq-card-head-icon">
                  <Upload size={22} />
                </div>
                <div>
                  <h2>Upload Your PDF</h2>
                  <p>
                    Select a PDF file from your device or drag and drop it here.
                    Our AI will extract the content and generate a quiz for you.
                  </p>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={onChoose}
              />

              {!file ? (
                <div
                  className={`gq-drop ${dragging ? "dragging" : ""}`}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={() => setDragging(false)}
                >
                  <UploadCloud size={44} strokeWidth={1.5} className="gq-drop-icon" />
                  <p className="gq-drop-title">Drag &amp; Drop your PDF here</p>
                  <span className="gq-drop-or">or</span>
                  <button
                    type="button"
                    className="gq-btn-primary"
                    onClick={() => inputRef.current?.click()}
                  >
                    <FolderOpen size={16} />
                    Choose File
                  </button>
                  <p className="gq-drop-hint">
                    Supported format: PDF &nbsp;(Max size: {MAX_SIZE_MB}MB)
                  </p>
                </div>
              ) : (
                <div className="gq-file">
                  <div className="gq-file-icon">
                    <FileText size={24} />
                  </div>
                  <div className="gq-file-info">
                    <p className="gq-file-name">{file.name}</p>
                    <p className="gq-file-size">{formatSize(file.size)} • PDF</p>
                  </div>
                  <button
                    type="button"
                    className="gq-file-remove"
                    onClick={removeFile}
                    aria-label="Remove file"
                    disabled={loading}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {error && (
                <div className="gq-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Quiz settings */}
              <div className="gq-settings-title">
                <Settings2 size={18} />
                <h3>Quiz Settings</h3>
              </div>

              <div className="gq-settings-grid">
                <div className="gq-field">
                  <label>
                    <HelpCircle size={14} /> Number of Questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                    <option value="30">30 Questions</option>
                  </select>
                </div>

                <div className="gq-field">
                  <label>
                    <BarChart3 size={14} /> Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="gq-field">
                  <label>
                    <ListChecks size={14} /> Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                  >
                    <option value="mcq">Multiple Choice (MCQs)</option>
                    <option value="true_false">True / False</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div className="gq-field">
                  <label>
                    <Layers size={14} /> Select Pages (Optional)
                  </label>
                  <select value={pages} onChange={(e) => setPages(e.target.value)}>
                    <option value="all">All Pages</option>
                    <option value="first10">First 10 Pages</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div className="gq-field">
                  <label>
                    <Tag size={14} /> Topic / Chapter (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 1, Arrays"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="gq-field">
                  <label>
                    <Clock size={14} /> Time Limit (Optional)
                  </label>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                  >
                    <option value="0">No Limit</option>
                    <option value="10">10 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="gq-generate"
                disabled={!file || loading}
                onClick={handleGenerate}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="gq-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Generate Quiz
                  </>
                )}
              </button>
              <p className="gq-generate-hint">
                <Zap size={12} />
                It may take a few seconds to process your PDF and generate the
                quiz.
              </p>
            </section>

            {/* Generated quiz preview */}
            {quiz && (
              <section className="gq-card gq-result">
                <div className="gq-result-head">
                  <div className="gq-result-ok">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="gq-result-title">
                    <h2>{quiz.title}</h2>
                    <p>
                      {quiz.questions.length} questions generated •{" "}
                      {quiz.difficulty} •{" "}
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : "No time limit"}
                    </p>
                  </div>
                  <button type="button" className="gq-result-again" onClick={resetAll}>
                    <RotateCcw size={14} /> New Quiz
                  </button>
                </div>

                <ol className="gq-qlist">
                  {quiz.questions.map((q) => (
                    <li key={q.id} className="gq-q">
                      <p className="gq-q-text">
                        <b>Q{q.id}.</b> {q.text}
                      </p>
                      <ul className="gq-q-options">
                        {q.options.map((o, idx) => (
                          <li
                            key={idx}
                            className={idx === q.answer ? "correct" : ""}
                          >
                            {String.fromCharCode(65 + idx)}. {o}
                            {idx === q.answer && <Check size={13} />}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* ===== Right column ===== */}
          <aside className="gq-right">
            <section className="gq-side-card">
              <h3 className="gq-side-title">
                <Lightbulb size={16} /> How It Works
              </h3>
              <ol className="gq-how">
                {howItWorks.map((h, i) => (
                  <li key={h.title}>
                    <span className="gq-how-num">{i + 1}</span>
                    <div>
                      <p className="gq-how-title">{h.title}</p>
                      <p className="gq-how-desc">{h.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="gq-side-card">
              <h3 className="gq-side-title">
                <Info size={16} /> Quick Tips
              </h3>
              <ul className="gq-tips">
                {tips.map((t) => (
                  <li key={t}>
                    <Check size={14} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="gq-side-card">
              <div className="gq-side-head">
                <h3 className="gq-side-title">
                  <Clock size={16} /> Recent Quizzes
                </h3>
                <button type="button" className="gq-link">
                  View All <ChevronRight size={12} />
                </button>
              </div>

              <div className="gq-recent">
                {recentQuizzes.map((q) => (
                  <button type="button" className="gq-recent-item" key={q.title}>
                    <div className={`gq-recent-icon ${q.color}`}>{q.icon}</div>
                    <div className="gq-recent-info">
                      <p className="gq-recent-title">{q.title}</p>
                      <p className="gq-recent-sub">{q.subject}</p>
                      <div className="gq-recent-meta">
                        <span className={`gq-score ${q.color}`}>
                          {q.score} &nbsp;{q.percent}%
                        </span>
                        <span className="gq-date">{q.date}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="gq-recent-arrow" />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default GenerateQuiz;