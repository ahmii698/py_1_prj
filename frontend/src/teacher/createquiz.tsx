import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePlus2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Eye,
  Sparkles,
  Database,
  ClipboardList,
  Plus,
  X,
  ArrowRight,
  UploadCloud,
  Clock,
  Users,
  ListChecks,
  Hash,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./createquiz.css";

type QType = "MCQ" | "True/False" | "Short Answer" | "Long Answer";
type Difficulty = "Easy" | "Medium" | "Hard";
type TypeFilter = "all" | QType;
type QuizStatus = "Published" | "Draft";

interface BankQuestion {
  id: number;
  text: string;
  type: QType;
  subject: string;
  className: string;
  difficulty: Difficulty;
  added: string; // YYYY-MM-DD
}

interface RecentQuiz {
  id: number;
  title: string;
  kind: string;
  className: string;
  date: string;
  status: QuizStatus;
}

const PAGE_SIZE = 9;
const MAX_PDF_MB = 10;

const SUBJECTS = ["Data Structures", "C Programming", "Algorithms", "Web Development", "Database Systems"];
const CLASSES = ["BSCS - Semester 2", "BSCS - Semester 3", "BSCS - Semester 4"];

const TYPE_LIST: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All Questions" },
  { key: "MCQ", label: "MCQ" },
  { key: "True/False", label: "True/False" },
  { key: "Short Answer", label: "Short Answer" },
  { key: "Long Answer", label: "Long Answer" },
];

const TYPE_CLASS: Record<QType, string> = {
  MCQ: "mcq",
  "True/False": "tf",
  "Short Answer": "sa",
  "Long Answer": "la",
};

/* ---------- sample question bank (TODO: replace with API: GET /api/teacher/questions) ---------- */

function q(
  id: number,
  text: string,
  type: QType,
  subject: string,
  className: string,
  difficulty: Difficulty,
  added: string
): BankQuestion {
  return { id, text, type, subject, className, difficulty, added };
}

const FIRST_NINE: BankQuestion[] = [
  q(1, "What is the time complexity of accessing an element in an array?", "MCQ", "Data Structures", "BSCS - Semester 3", "Easy", "2025-05-20"),
  q(2, "Which of the following is a correct way to declare an array in C?", "MCQ", "C Programming", "BSCS - Semester 3", "Medium", "2025-05-19"),
  q(3, "What will be the output of the following code? int arr[5] = {1, 2, 3, 4, 5};", "MCQ", "C Programming", "BSCS - Semester 3", "Medium", "2025-05-18"),
  q(4, "If the array size is 10, how many elements can it hold?", "MCQ", "Data Structures", "BSCS - Semester 3", "Easy", "2025-05-18"),
  q(5, "Explain the difference between static and dynamic arrays.", "Short Answer", "Data Structures", "BSCS - Semester 3", "Medium", "2025-05-17"),
  q(6, "What is meant by an array being 'sorted'?", "Short Answer", "Data Structures", "BSCS - Semester 3", "Medium", "2025-05-17"),
  q(7, "Write a function to find the largest element in an array.", "Long Answer", "Data Structures", "BSCS - Semester 3", "Hard", "2025-05-16"),
  q(8, "Which sorting algorithm is most suitable for small arrays?", "MCQ", "Algorithms", "BSCS - Semester 4", "Medium", "2025-05-15"),
  q(9, "True or False: Binary search can only be applied to sorted arrays.", "True/False", "Algorithms", "BSCS - Semester 4", "Easy", "2025-05-15"),
];

const POOL: Record<QType, string[]> = {
  MCQ: [
    "Which data structure follows the LIFO principle?",
    "What is the time complexity of binary search?",
    "Which keyword is used to define a constant in C?",
    "What does SQL stand for?",
    "Which HTTP method is used to fetch data?",
    "What is the worst-case complexity of quick sort?",
    "Which of these is a non-linear data structure?",
    "What is the output of 5 / 2 in C using integers?",
    "Which normal form removes partial dependency?",
    "Which tag is used for the largest heading in HTML?",
  ],
  "True/False": [
    "True or False: A stack allows insertion at both ends.",
    "True or False: A primary key can contain NULL values.",
    "True or False: Merge sort has O(n log n) time complexity.",
    "True or False: C is a case-insensitive language.",
    "True or False: HTML is a programming language.",
    "True or False: A queue follows FIFO order.",
  ],
  "Short Answer": [
    "Define a linked list.",
    "What is normalization in databases?",
    "Differentiate between a stack and a queue.",
    "What is recursion?",
    "Explain what a pointer is in C.",
  ],
  "Long Answer": [
    "Explain the working of merge sort with an example.",
    "Describe the ACID properties of a database transaction.",
    "Write a program to reverse a string in C.",
  ],
};

function buildBank(): BankQuestion[] {
  const types: QType[] = [
    ...Array<QType>(163).fill("MCQ"),
    ...Array<QType>(41).fill("True/False"),
    ...Array<QType>(24).fill("Short Answer"),
    ...Array<QType>(11).fill("Long Answer"),
  ]; // 239 + 9 above = 248 (168 / 42 / 26 / 12)
  const diffs: Difficulty[] = ["Easy", "Medium", "Medium", "Easy", "Hard", "Medium"];
  const counters: Record<QType, number> = { MCQ: 0, "True/False": 0, "Short Answer": 0, "Long Answer": 0 };
  const list: BankQuestion[] = [...FIRST_NINE];

  for (let j = 0; j < 239; j++) {
    const type = types[(j * 97) % 239];
    const n = counters[type]++;
    const pool = POOL[type];
    const d = new Date(Date.UTC(2025, 4, 14 - Math.floor(j / 6)));
    list.push({
      id: 10 + j,
      text: pool[n % pool.length],
      type,
      subject: SUBJECTS[j % SUBJECTS.length],
      className: CLASSES[(j + 1) % CLASSES.length],
      difficulty: type === "Long Answer" ? "Hard" : diffs[j % diffs.length],
      added: d.toISOString().slice(0, 10),
    });
  }
  return list;
}

const BANK = buildBank();

const INITIAL_RECENT: RecentQuiz[] = [
  { id: 1, title: "Data Structures Quiz 1", kind: "MCQ", className: "BSCS - Semester 3", date: "2025-05-20", status: "Published" },
  { id: 2, title: "C Programming Quiz", kind: "Mixed", className: "BSCS - Semester 2", date: "2025-05-18", status: "Published" },
  { id: 3, title: "Algorithms Practice", kind: "MCQ", className: "BSCS - Semester 4", date: "2025-05-15", status: "Draft" },
];

/* ---------- helpers ---------- */

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function pageList(current: number, total: number): (number | "...")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "..."];
  if (current >= total - 2) return ["...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "..."];
}

/* ---------- page ---------- */

function CreateQuiz() {
  const navigate = useNavigate();
  const bankRef = useRef<HTMLElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* step 1 */
  const [source, setSource] = useState<"bank" | "pdf">("bank");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [onlySelected, setOnlySelected] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [preview, setPreview] = useState<BankQuestion | null>(null);

  /* pdf source */
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfCount, setPdfCount] = useState("10");
  const [pdfError, setPdfError] = useState("");

  /* step 2 */
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classPick, setClassPick] = useState("");
  const [marks, setMarks] = useState("100");
  const [timeLimit, setTimeLimit] = useState("60");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [showAnswers, setShowAnswers] = useState(true);

  /* step 3 */
  const [assigned, setAssigned] = useState<string[]>(["BSCS - Semester 3"]);
  const [showAddClass, setShowAddClass] = useState(false);

  const [recent, setRecent] = useState<RecentQuiz[]>(INITIAL_RECENT);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  /* ----- derived ----- */
  const baseFiltered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return BANK.filter((x) => {
      if (subjectFilter !== "all" && x.subject !== subjectFilter) return false;
      if (classFilter !== "all" && x.className !== classFilter) return false;
      if (s && !x.text.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [search, subjectFilter, classFilter]);

  const typeCounts = useMemo(() => {
    const c: Record<TypeFilter, number> = {
      all: baseFiltered.length,
      MCQ: 0,
      "True/False": 0,
      "Short Answer": 0,
      "Long Answer": 0,
    };
    baseFiltered.forEach((x) => c[x.type]++);
    return c;
  }, [baseFiltered]);

  const filtered = useMemo(
    () =>
      baseFiltered.filter((x) => {
        if (typeFilter !== "all" && x.type !== typeFilter) return false;
        if (onlySelected && !selected.includes(x.id)) return false;
        return true;
      }),
    [baseFiltered, typeFilter, onlySelected, selected]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const allOnPage = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const marksNum = Number(marks) || 0;
  const availableClasses = CLASSES.filter((c) => !assigned.includes(c));

  /* ----- handlers ----- */
  const resetPage = () => setPage(1);

  const toggleOne = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () => {
    if (allOnPage) setSelected((s) => s.filter((id) => !rows.some((r) => r.id === id)));
    else setSelected((s) => [...new Set([...s, ...rows.map((r) => r.id)])]);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const onPickClass = (value: string) => {
    setClassPick(value);
    if (value && !assigned.includes(value)) setAssigned((a) => [...a, value]);
  };

  const removeClass = (c: string) => {
    setAssigned((a) => a.filter((x) => x !== c));
    if (classPick === c) setClassPick("");
  };

  const addClass = (c: string) => {
    setAssigned((a) => [...a, c]);
    setShowAddClass(false);
  };

  const onPdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setPdfError("");
    const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return setPdfError("Only PDF files are supported.");
    if (f.size > MAX_PDF_MB * 1024 * 1024) return setPdfError(`File is too large. Max size is ${MAX_PDF_MB}MB.`);
    setPdfFile(f);
  };

  const generateFromPdf = () => {
    if (!pdfFile) return;
    // TODO: POST /api/quiz/generate-questions (file + count) then add returned questions to the selection
    console.log("Generate from PDF:", pdfFile.name, pdfCount);
    showToast("AI generation will be connected to the backend");
  };

  const goBank = () => {
    setSource("bank");
    window.setTimeout(() => bankRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const submit = (status: QuizStatus) => {
    setError("");

    if (!title.trim()) return setError("Please enter a quiz title.");
    if (!subject) return setError("Please select a subject.");
    if (selected.length === 0) return setError("Select at least one question for the quiz.");
    if (marksNum <= 0) return setError("Total marks must be greater than 0.");
    if (!(Number(timeLimit) > 0)) return setError("Time limit must be greater than 0 minutes.");
    if (endDate < startDate) return setError("End date cannot be before the start date.");
    if (assigned.length === 0) return setError("Assign the quiz to at least one class.");

    const picked = BANK.filter((x) => selected.includes(x.id));
    const kinds = new Set(picked.map((x) => x.type));
    const kind = kinds.size === 1 ? [...kinds][0] === "True/False" ? "T/F" : picked[0].type : "Mixed";

    // TODO: POST /api/teacher/quizzes { title, subject, marks, timeLimit, startDate, endDate, showAnswers, classes: assigned, questionIds: selected, status }
    setRecent((r) => [
      {
        id: Date.now(),
        title: title.trim(),
        kind,
        className: assigned[0],
        date: todayISO(),
        status,
      },
      ...r,
    ].slice(0, 5));

    showToast(status === "Published" ? `Quiz "${title.trim()}" created` : `Quiz "${title.trim()}" saved as draft`);
    setTitle("");
    setSubject("");
    setClassPick("");
    setSelected([]);
    setOnlySelected(false);
  };

  return (
    <div className="cq-shell">
      <Sidebar />

      <div className="cq-main">
        <Header />

        <div className="cq-content">
          {/* ===== Center ===== */}
          <div className="cq-center">
            {/* Banner */}
            <section className="cq-banner">
              <div className="cq-banner-icon">
                <FilePlus2 size={26} />
              </div>
              <div className="cq-banner-text">
                <h1>Create Quiz</h1>
                <p>Build a quiz from your question bank, set rules and assign it to your class.</p>
              </div>
              <svg className="cq-banner-art" viewBox="0 0 160 90" aria-hidden="true">
                <rect x="52" y="10" width="62" height="74" rx="8" fill="#ede9fe" stroke="#c4b5fd" />
                <rect x="68" y="4" width="30" height="12" rx="4" fill="#8b5cf6" />
                <rect x="62" y="28" width="8" height="8" rx="2" fill="#a78bfa" />
                <rect x="76" y="30" width="30" height="4" rx="2" fill="#ddd6fe" />
                <rect x="62" y="44" width="8" height="8" rx="2" fill="#a78bfa" />
                <rect x="76" y="46" width="30" height="4" rx="2" fill="#ddd6fe" />
                <rect x="62" y="60" width="8" height="8" rx="2" fill="#a78bfa" />
                <rect x="76" y="62" width="24" height="4" rx="2" fill="#ddd6fe" />
                <circle cx="112" cy="66" r="14" fill="#fff" stroke="#8b5cf6" strokeWidth="3" />
                <path d="M112 58v8l5 3" stroke="#6d4aff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </section>

            {/* Step 1 */}
            <section className="cq-card" ref={bankRef}>
              <div className="cq-step-head">
                <span className="cq-step-num">1</span>
                <div>
                  <h2>Select Questions</h2>
                  <p>Choose questions from your question bank or generate new ones from chapter PDF (optional).</p>
                </div>
              </div>

              <div className="cq-source-tabs">
                <button type="button" className={source === "bank" ? "on" : ""} onClick={() => setSource("bank")}>
                  From Question Bank
                </button>
                <button type="button" className={source === "pdf" ? "on" : ""} onClick={() => setSource("pdf")}>
                  From Chapter PDF
                </button>
              </div>

              {source === "bank" ? (
                <>
                  <div className="cq-filters">
                    <div className="cq-search">
                      <Search size={14} />
                      <input
                        type="text"
                        placeholder="Search questions..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          resetPage();
                        }}
                      />
                    </div>

                    <div className="cq-select">
                      <select
                        value={subjectFilter}
                        onChange={(e) => {
                          setSubjectFilter(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="all">All Subjects</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <div className="cq-select">
                      <select
                        value={classFilter}
                        onChange={(e) => {
                          setClassFilter(e.target.value);
                          resetPage();
                        }}
                      >
                        <option value="all">All Classes</option>
                        {CLASSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <div className="cq-select">
                      <select
                        value={typeFilter}
                        onChange={(e) => {
                          setTypeFilter(e.target.value as TypeFilter);
                          resetPage();
                        }}
                      >
                        <option value="all">All Question Types</option>
                        {TYPE_LIST.slice(1).map((t) => (
                          <option key={t.key} value={t.key}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <button
                      type="button"
                      className={`cq-selected-btn ${onlySelected ? "on" : ""}`}
                      onClick={() => {
                        setOnlySelected(!onlySelected);
                        resetPage();
                      }}
                      title="Show only selected questions"
                    >
                      <ListFilter size={14} /> Selected: {selected.length}
                    </button>
                  </div>

                  <div className="cq-bank">
                    {/* Type list */}
                    <ul className="cq-types">
                      {TYPE_LIST.map((t) => (
                        <li key={t.key}>
                          <button
                            type="button"
                            className={typeFilter === t.key ? "on" : ""}
                            onClick={() => {
                              setTypeFilter(t.key);
                              resetPage();
                            }}
                          >
                            <span>{t.label}</span>
                            <b>{typeCounts[t.key]}</b>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Table */}
                    <div className="cq-table-box">
                      {rows.length === 0 ? (
                        <div className="cq-empty">
                          <FileText size={34} strokeWidth={1.4} />
                          <p>No questions found</p>
                          <span>Try changing your search or filters.</span>
                        </div>
                      ) : (
                        <div className="cq-table-wrap">
                          <table className="cq-table">
                            <thead>
                              <tr>
                                <th className="cq-check">
                                  <input type="checkbox" checked={allOnPage} onChange={toggleAll} />
                                </th>
                                <th>Question</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Difficulty</th>
                                <th>Added</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((x) => (
                                <tr
                                  key={x.id}
                                  className={selected.includes(x.id) ? "sel" : ""}
                                  onClick={() => toggleOne(x.id)}
                                >
                                  <td className="cq-check" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={selected.includes(x.id)}
                                      onChange={() => toggleOne(x.id)}
                                    />
                                  </td>
                                  <td className="cq-q">{x.text}</td>
                                  <td>
                                    <span className={`cq-chip ${TYPE_CLASS[x.type]}`}>{x.type}</span>
                                  </td>
                                  <td className="cq-subject">{x.subject}</td>
                                  <td>
                                    <span className={`cq-diff ${x.difficulty.toLowerCase()}`}>{x.difficulty}</span>
                                  </td>
                                  <td className="cq-date">{fmtDate(x.added)}</td>
                                  <td onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className="cq-eye"
                                      aria-label="Preview question"
                                      onClick={() => setPreview(x)}
                                    >
                                      <Eye size={13} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {filtered.length > 0 && (
                        <div className="cq-pager">
                          <p>
                            Showing {start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} questions
                          </p>
                          <div className="cq-pages">
                            <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
                              <ChevronLeft size={14} />
                            </button>
                            {pageList(current, totalPages).map((n, i) =>
                              n === "..." ? (
                                <span key={`d${i}`} className="cq-dots">
                                  …
                                </span>
                              ) : (
                                <button type="button" key={n} className={n === current ? "on" : ""} onClick={() => setPage(n)}>
                                  {n}
                                </button>
                              )
                            )}
                            <button type="button" disabled={current === totalPages} onClick={() => setPage(current + 1)} aria-label="Next page">
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="cq-pdf">
                  <input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={onPdfChange} />

                  {!pdfFile ? (
                    <div className="cq-drop">
                      <UploadCloud size={40} strokeWidth={1.5} />
                      <p>Upload a chapter PDF</p>
                      <span>AI will read it and generate questions for your quiz (Max {MAX_PDF_MB}MB)</span>
                      <button type="button" className="cq-btn-primary" onClick={() => fileRef.current?.click()}>
                        Choose PDF
                      </button>
                    </div>
                  ) : (
                    <div className="cq-file">
                      <span className="cq-file-icon">
                        <FileText size={22} />
                      </span>
                      <div>
                        <b>{pdfFile.name}</b>
                        <small>{(pdfFile.size / 1024 / 1024).toFixed(2)} MB • PDF</small>
                      </div>
                      <button type="button" onClick={() => setPdfFile(null)} aria-label="Remove file">
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  {pdfError && (
                    <p className="cq-inline-error">
                      <AlertCircle size={14} /> {pdfError}
                    </p>
                  )}

                  <div className="cq-pdf-row">
                    <div className="cq-field">
                      <label>Number of Questions</label>
                      <div className="cq-select full">
                        <select value={pdfCount} onChange={(e) => setPdfCount(e.target.value)}>
                          {["5", "10", "15", "20", "30"].map((n) => (
                            <option key={n} value={n}>
                              {n} Questions
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    <button type="button" className="cq-btn-primary lg" disabled={!pdfFile} onClick={generateFromPdf}>
                      <Sparkles size={15} /> Generate Questions
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Step 2 */}
            <section className="cq-card">
              <div className="cq-step-head">
                <span className="cq-step-num">2</span>
                <div>
                  <h2>Quiz Settings</h2>
                  <p>Configure quiz details, marks and time limit.</p>
                </div>
              </div>

              <div className="cq-settings">
                <div className="cq-field span2">
                  <label>
                    Quiz Title <i>*</i>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures Quiz 1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="cq-field">
                  <label>
                    Subject <i>*</i>
                  </label>
                  <div className="cq-select full">
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                      <option value="">Select subject</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>

                <div className="cq-field">
                  <label>
                    Class <i>*</i>
                  </label>
                  <div className="cq-select full">
                    <select value={classPick} onChange={(e) => onPickClass(e.target.value)}>
                      <option value="">Select class</option>
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>

                <div className="cq-field">
                  <label>
                    Total Marks <i>*</i>
                  </label>
                  <input type="number" min={1} value={marks} onChange={(e) => setMarks(e.target.value)} />
                </div>

                <div className="cq-field">
                  <label>Time Limit (minutes)</label>
                  <input type="number" min={1} value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
                </div>

                <div className="cq-field">
                  <label>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="cq-field">
                  <label>End Date</label>
                  <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="cq-toggle-row">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showAnswers}
                    className={`cq-switch ${showAnswers ? "on" : ""}`}
                    onClick={() => setShowAnswers(!showAnswers)}
                  >
                    <span />
                  </button>
                  <div>
                    <b>Show Correct Answers</b>
                    <small>Students will be able to see answers after submission</small>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="cq-card">
              <div className="cq-step-head">
                <span className="cq-step-num">3</span>
                <div>
                  <h2>Assign to Class</h2>
                  <p>Select the class(es) to which you want to assign this quiz.</p>
                </div>
              </div>

              {error && (
                <p className="cq-error">
                  <AlertCircle size={15} /> {error}
                </p>
              )}

              <div className="cq-assign">
                <div className="cq-assign-box">
                  {assigned.map((c) => (
                    <span key={c} className="cq-class-chip">
                      {c}
                      <button type="button" onClick={() => removeClass(c)} aria-label={`Remove ${c}`}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}

                  <div className="cq-add-wrap">
                    <button
                      type="button"
                      className="cq-add"
                      disabled={availableClasses.length === 0}
                      onClick={() => setShowAddClass(!showAddClass)}
                    >
                      <Plus size={13} /> Add More Classes
                    </button>
                    {showAddClass && availableClasses.length > 0 && (
                      <div className="cq-add-menu">
                        {availableClasses.map((c) => (
                          <button type="button" key={c} onClick={() => addClass(c)}>
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="cq-assign-actions">
                  <button type="button" className="cq-btn-ghost" onClick={() => submit("Draft")}>
                    Save as Draft
                  </button>
                  <button type="button" className="cq-btn-primary" onClick={() => submit("Published")}>
                    Create Quiz
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ===== Right column ===== */}
          <aside className="cq-right">
            <section className="cq-side-card">
              <h3 className="cq-side-title">
                <ClipboardList size={16} /> Quiz Summary
              </h3>
              <ul className="cq-summary">
                <li>
                  <ListChecks size={14} />
                  <span>Total Questions</span>
                  <b>{selected.length}</b>
                </li>
                <li>
                  <Hash size={14} />
                  <span>Total Marks</span>
                  <b>{marksNum}</b>
                </li>
                <li>
                  <Clock size={14} />
                  <span>Time Limit</span>
                  <b>{Number(timeLimit) || 0} mins</b>
                </li>
                <li>
                  <Users size={14} />
                  <span>Class(es)</span>
                  <b>{assigned.length} selected</b>
                </li>
              </ul>

              <div className="cq-ready">
                <span className="cq-ready-icon">
                  <CheckCircle2 size={22} />
                </span>
                <b>Ready to go!</b>
                <p>Your quiz will be created and assigned to the selected class.</p>
              </div>
            </section>

            <section className="cq-side-card">
              <h3 className="cq-side-title">
                <Sparkles size={16} /> Quick Actions
              </h3>
              <div className="cq-quick">
                <button type="button" onClick={() => setSource("pdf")}>
                  <span className="cq-quick-icon">
                    <Sparkles size={16} />
                  </span>
                  <span>
                    <b>Generate Questions with AI</b>
                    <small>Create questions from selected chapter PDF</small>
                  </span>
                </button>
                <button type="button" onClick={goBank}>
                  <span className="cq-quick-icon">
                    <Database size={16} />
                  </span>
                  <span>
                    <b>Browse Question Bank</b>
                    <small>View and manage all questions</small>
                  </span>
                </button>
                <button type="button" onClick={() => navigate("/teacher/quizzes")}>
                  <span className="cq-quick-icon">
                    <ClipboardList size={16} />
                  </span>
                  <span>
                    <b>View My Quizzes</b>
                    <small>Check existing quizzes and their results</small>
                  </span>
                </button>
              </div>
            </section>

            <section className="cq-side-card">
              <div className="cq-side-head">
                <h3 className="cq-side-title plain">Recent Quizzes</h3>
                <button type="button" className="cq-link" onClick={() => navigate("/teacher/quizzes")}>
                  View All <ArrowRight size={11} />
                </button>
              </div>
              <ul className="cq-recent">
                {recent.map((r) => (
                  <li key={r.id}>
                    <span className="cq-recent-icon">{r.kind}</span>
                    <div className="cq-recent-body">
                      <p>{r.title}</p>
                      <small>
                        <Users size={11} /> {r.className}
                      </small>
                      <small className="date">{fmtDate(r.date)}</small>
                    </div>
                    <span className={`cq-status ${r.status.toLowerCase()}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="cq-overlay" onClick={() => setPreview(null)}>
          <div className="cq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cq-modal-head">
              <h3>Question Preview</h3>
              <button type="button" onClick={() => setPreview(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="cq-modal-tags">
              <span className={`cq-chip ${TYPE_CLASS[preview.type]}`}>{preview.type}</span>
              <span className={`cq-diff ${preview.difficulty.toLowerCase()}`}>{preview.difficulty}</span>
              <span className="cq-subject">{preview.subject}</span>
            </div>
            <p className="cq-modal-q">{preview.text}</p>
            <div className="cq-modal-foot">
              <button type="button" className="cq-btn-ghost" onClick={() => setPreview(null)}>
                Close
              </button>
              <button
                type="button"
                className="cq-btn-primary"
                onClick={() => {
                  if (!selected.includes(preview.id)) toggleOne(preview.id);
                  setPreview(null);
                }}
              >
                {selected.includes(preview.id) ? "Already Selected" : "Add to Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="cq-toast">{toast}</div>}
    </div>
  );
}

export default CreateQuiz;