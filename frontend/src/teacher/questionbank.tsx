import { useMemo, useRef, useState } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  Check,
  X,
  Upload,
  FilePlus2,
  ArrowRight,
  BookOpen,
  Code2,
  BarChart3,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./questionbank.css";

type QType = "MCQ" | "True/False" | "Short Answer" | "Long Answer";
type Difficulty = "Easy" | "Medium" | "Hard";
type Source = "AI Generated" | "Manual";
type QStatus = "Active" | "Inactive";
type TabKey = "all" | QType;

interface Question {
  id: number;
  type: QType;
  text: string;
  options: string[];
  correct: number;
  answer: string;
  difficulty: Difficulty;
  created: string; // YYYY-MM-DD
  source: Source;
  status: QStatus;
  tags: string[];
}

const PAGE_SIZE = 10;
const LETTERS = ["A", "B", "C", "D"];

const COURSES = [
  { name: "Data Structures & Algorithms", cls: "BSCS - Semester 3" },
  { name: "Introduction to AI", cls: "BSCS - Semester 4" },
  { name: "Web Development", cls: "BSCS - Semester 3" },
];

const CHAPTERS = [
  { name: "Chapter 1: Introduction", materials: 8 },
  { name: "Chapter 2: Arrays", materials: 12 },
  { name: "Chapter 3: Linked Lists", materials: 10 },
  { name: "Chapter 4: Stacks & Queues", materials: 9 },
];

const TYPE_TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Questions" },
  { key: "MCQ", label: "MCQ" },
  { key: "True/False", label: "True/False" },
  { key: "Short Answer", label: "Short Answer" },
  { key: "Long Answer", label: "Long Answer" },
];

const TYPE_COLOR: Record<QType, string> = {
  MCQ: "#818cf8",
  "True/False": "#ec4899",
  "Short Answer": "#3b82f6",
  "Long Answer": "#f59e0b",
};

const TYPE_CLASS: Record<QType, string> = {
  MCQ: "mcq",
  "True/False": "tf",
  "Short Answer": "sa",
  "Long Answer": "la",
};

/* ---------- sample data (TODO: replace with API: GET /api/teacher/questions?chapter=...) ---------- */

function mk(
  id: number,
  type: QType,
  text: string,
  difficulty: Difficulty,
  created: string,
  source: Source,
  tags: string[],
  options: string[] = [],
  correct = 0,
  answer = ""
): Question {
  return { id, type, text, options, correct, answer, difficulty, created, source, status: "Active", tags };
}

const TF_OPTS = ["True", "False"];

const BASE: Question[] = [
  mk(1, "MCQ", "What is the time complexity of accessing an element in an array?", "Easy", "2025-05-20", "AI Generated", ["Array", "Time Complexity"], ["O(1)", "O(n)", "O(log n)", "O(n²)"], 0),
  mk(2, "MCQ", "Which of the following is a correct way to declare an array in C?", "Easy", "2025-05-20", "AI Generated", ["Array", "C"], ["int arr[5];", "array int arr(5);", "int arr = [5];", "arr int[5];"], 0),
  mk(3, "MCQ", "What will be the output of: int arr[5] = {1, 2, 3, 4, 5}; printf(\"%d\", arr[2]);", "Medium", "2025-05-19", "Manual", ["Array", "Output"], ["1", "2", "3", "4"], 2),
  mk(4, "MCQ", "If the array size is 10, how many elements can it hold?", "Easy", "2025-05-19", "AI Generated", ["Array", "Size"], ["9", "10", "11", "Unlimited"], 1),
  mk(5, "True/False", "True or False: Array indexing starts from 1 in most programming languages.", "Easy", "2025-05-18", "AI Generated", ["Array", "Indexing"], TF_OPTS, 1),
  mk(6, "Short Answer", "Explain the difference between static and dynamic arrays.", "Medium", "2025-05-18", "Manual", ["Array", "Memory"], [], 0, "A static array has a fixed size decided at compile time, while a dynamic array can grow or shrink at runtime."),
  mk(7, "Short Answer", "What is meant by an array being 'sorted'?", "Medium", "2025-05-17", "AI Generated", ["Array", "Sorting"], [], 0, "Its elements are arranged in ascending or descending order."),
  mk(8, "Long Answer", "Write a function to find the largest element in an array.", "Hard", "2025-05-16", "AI Generated", ["Array", "Function"], [], 0, "Loop through the array, keeping track of the maximum value seen so far, and return it."),
  mk(9, "MCQ", "Which sorting algorithm is most suitable for small arrays?", "Medium", "2025-05-15", "AI Generated", ["Sorting"], ["Insertion Sort", "Merge Sort", "Heap Sort", "Quick Sort"], 0),
  mk(10, "True/False", "True or False: Binary search can only be applied to sorted arrays.", "Medium", "2025-05-15", "Manual", ["Searching"], TF_OPTS, 0),
];

const MCQ_T: [string, string[], number][] = [
  ["What is the index of the first element in a zero-indexed array?", ["0", "1", "-1", "Depends on size"], 0],
  ["Which operation on an unsorted array takes O(n) time in the worst case?", ["Linear search", "Access by index", "Reading the length", "Swapping the first two items"], 0],
  ["What happens when you access an index outside the array bounds in C?", ["Undefined behavior", "The array resizes", "It returns 0", "A compile error always"], 0],
  ["Which of the following is a valid use of a 2D array?", ["Storing a matrix", "Storing a hash seed", "Storing a stack frame", "Storing a CPU register"], 0],
  ["What is the time complexity of inserting an element at the beginning of an array?", ["O(n)", "O(1)", "O(log n)", "O(n log n)"], 0],
  ["How are array elements stored in memory?", ["Contiguously", "Randomly", "In a linked chain", "In a tree"], 0],
  ["Which of these finds an element in a sorted array fastest?", ["Binary search", "Linear search", "Bubble sort", "Selection sort"], 0],
  ["What is the size of int arr[10] if an int is 4 bytes?", ["40 bytes", "10 bytes", "14 bytes", "4 bytes"], 0],
  ["Which of the following is NOT an array operation?", ["Pointer chasing", "Traversal", "Insertion", "Deletion"], 0],
];

const TF_T: [string, number][] = [
  ["True or False: Arrays store elements in contiguous memory locations.", 0],
  ["True or False: The size of a static array can change at runtime.", 1],
  ["True or False: Accessing an array element by index takes constant time.", 0],
  ["True or False: An array in C can hold elements of different data types.", 1],
];

const SA_T: [string, string][] = [
  ["Define a multidimensional array.", "An array whose elements are themselves arrays, e.g. a matrix."],
  ["What is an array index?", "The position number used to access an element."],
  ["State two advantages of using arrays.", "Fast random access and simple memory layout."],
  ["What is array traversal?", "Visiting every element of an array exactly once."],
];

const LA_T: [string, string][] = [
  ["Explain how binary search works on a sorted array with an example.", "Compare the target with the middle element and discard half of the range each step."],
];

function buildQuestions(): Question[] {
  const typeArr: QType[] = [
    ...Array<QType>(27).fill("MCQ"),
    ...Array<QType>(6).fill("True/False"),
    ...Array<QType>(4).fill("Short Answer"),
    "Long Answer",
  ];
  const diffArr: Difficulty[] = [
    ...Array<Difficulty>(14).fill("Easy"),
    ...Array<Difficulty>(17).fill("Medium"),
    ...Array<Difficulty>(7).fill("Hard"),
  ];
  const counters: Record<QType, number> = { MCQ: 0, "True/False": 0, "Short Answer": 0, "Long Answer": 0 };
  const list: Question[] = [...BASE];

  for (let j = 0; j < 38; j++) {
    const type = typeArr[(j * 11) % 38];
    const difficulty = diffArr[(j * 13) % 38];
    const n = counters[type]++;
    const d = new Date(Date.UTC(2025, 4, 14 - Math.floor(j / 2)));
    const created = d.toISOString().slice(0, 10);
    const source: Source = j % 3 === 0 ? "Manual" : "AI Generated";
    const id = 11 + j;

    if (type === "MCQ") {
      const t = MCQ_T[n % MCQ_T.length];
      list.push(mk(id, type, t[0], difficulty, created, source, ["Array"], t[1], t[2]));
    } else if (type === "True/False") {
      const t = TF_T[n % TF_T.length];
      list.push(mk(id, type, t[0], difficulty, created, source, ["Array"], TF_OPTS, t[1]));
    } else if (type === "Short Answer") {
      const t = SA_T[n % SA_T.length];
      list.push(mk(id, type, t[0], difficulty, created, source, ["Array"], [], 0, t[1]));
    } else {
      const t = LA_T[n % LA_T.length];
      list.push(mk(id, type, t[0], difficulty, created, source, ["Array", "Searching"], [], 0, t[1]));
    }
  }
  return list;
}

const INITIAL_QUESTIONS = buildQuestions();

/* ---------- helpers ---------- */

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function clone(q: Question): Question {
  return { ...q, options: [...q.options], tags: [...q.tags] };
}

function pageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

/* ---------- page ---------- */

function QuestionBank() {
  const editRef = useRef<HTMLDivElement>(null);

  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [courseIdx, setCourseIdx] = useState(0);
  const [chapterIdx, setChapterIdx] = useState(1);

  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"all" | Difficulty>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | Source>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<number[]>([]);

  const [selectedId, setSelectedId] = useState<number>(INITIAL_QUESTIONS[0].id);
  const [draft, setDraft] = useState<Question>(clone(INITIAL_QUESTIONS[0]));
  const [tagInput, setTagInput] = useState("");
  const [toast, setToast] = useState("");

  const course = COURSES[courseIdx];
  const chapter = CHAPTERS[chapterIdx];

  const selected = questions.find((q) => q.id === selectedId) ?? null;
  const selectedNo = selected ? questions.findIndex((q) => q.id === selected.id) + 1 : 0;

  /* stats */
  const stats = useMemo(() => {
    const total = questions.length;
    const ai = questions.filter((q) => q.source === "AI Generated").length;
    const manual = total - ai;
    const diff = { Easy: 0, Medium: 0, Hard: 0 };
    const types: Record<QType, number> = { MCQ: 0, "True/False": 0, "Short Answer": 0, "Long Answer": 0 };
    questions.forEach((q) => {
      diff[q.difficulty]++;
      types[q.type]++;
    });
    return { total, ai, manual, diff, types };
  }, [questions]);

  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  /* list */
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (tab !== "all" && q.type !== tab) return false;
      if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
      if (sourceFilter !== "all" && q.source !== sourceFilter) return false;
      if (s && !q.text.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [questions, tab, search, diffFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const allOnPage = rows.length > 0 && rows.every((r) => checked.includes(r.id));

  const tabCount = (key: TabKey) => (key === "all" ? stats.total : stats.types[key]);

  /* actions */
  const selectQuestion = (q: Question, scroll = false) => {
    setSelectedId(q.id);
    setDraft(clone(q));
    setTagInput("");
    if (scroll) editRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  };

  const removeQuestions = (ids: number[]) => {
    const remaining = questions.filter((q) => !ids.includes(q.id));
    setQuestions(remaining);
    setChecked((c) => c.filter((id) => !ids.includes(id)));
    if (ids.includes(selectedId)) {
      if (remaining[0]) selectQuestion(remaining[0]);
      else setSelectedId(-1);
    }
  };

  const deleteOne = (id: number) => {
    if (window.confirm("Delete this question?")) removeQuestions([id]);
  };

  const deleteChecked = () => {
    if (window.confirm(`Delete ${checked.length} selected question(s)?`)) removeQuestions(checked);
  };

  const toggleAll = () => {
    if (allOnPage) setChecked(checked.filter((id) => !rows.some((r) => r.id === id)));
    else setChecked([...new Set([...checked, ...rows.map((r) => r.id)])]);
  };

  const toggleOne = (id: number) =>
    setChecked(checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id]);

  const addManual = () => {
    const q: Question = {
      id: Date.now(),
      type: "MCQ",
      text: "",
      options: ["", "", "", ""],
      correct: 0,
      answer: "",
      difficulty: "Easy",
      created: new Date().toISOString().slice(0, 10),
      source: "Manual",
      status: "Active",
      tags: [],
    };
    setQuestions((prev) => [q, ...prev]);
    setTab("all");
    setSearch("");
    setPage(1);
    selectQuestion(q, true);
  };

  const updateQuestion = () => {
    if (!selected) return;
    setQuestions((prev) => prev.map((q) => (q.id === draft.id ? clone(draft) : q)));
    showToast("Question updated");
  };

  const setOption = (i: number, value: string) =>
    setDraft((d) => ({ ...d, options: d.options.map((o, idx) => (idx === i ? value : o)) }));

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || draft.tags.includes(t)) {
      setTagInput("");
      return;
    }
    setDraft((d) => ({ ...d, tags: [...d.tags, t] }));
    setTagInput("");
  };

  const removeTag = (t: string) => setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== t) }));

  const handleGenerateAI = () => {
    // TODO: open AI-generation modal / call POST /api/teacher/questions/generate
    console.log("Generate questions with AI for", course.name, chapter.name);
  };

  const recent = questions.slice(0, 3);

  const statTypes = (Object.keys(stats.types) as QType[]).map((k) => ({
    key: k,
    label: k,
    value: stats.types[k],
    color: TYPE_COLOR[k],
  }));

  return (
    <div className="qb-shell">
      <Sidebar />

      <div className="qb-main">
        <Header />

        <div className="qb-content">
          {/* ===== Center ===== */}
          <div className="qb-center">
            {/* Banner */}
            <section className="qb-banner">
              <div className="qb-banner-icon">
                <FileText size={28} />
              </div>
              <div className="qb-banner-text">
                <h1>Question Bank</h1>
                <p>
                  Create, manage and organize questions for your courses. Use AI to
                  generate questions from your materials or create them manually.
                </p>
              </div>
              <button type="button" className="qb-ai-btn" onClick={handleGenerateAI}>
                <Plus size={15} /> Generate with AI
              </button>
            </section>

            {/* Course / chapter pickers */}
            <section className="qb-pickers">
              <div className="qb-picker">
                <span className="qb-picker-icon">
                  <Code2 size={20} />
                </span>
                <div className="qb-picker-text">
                  <b>{course.name}</b>
                  <small>{course.cls}</small>
                </div>
                <ChevronDown size={16} />
                <select value={courseIdx} onChange={(e) => setCourseIdx(Number(e.target.value))} aria-label="Select course">
                  {COURSES.map((c, i) => (
                    <option key={c.name} value={i}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="qb-picker">
                <span className="qb-picker-icon alt">
                  <BookOpen size={20} />
                </span>
                <div className="qb-picker-text">
                  <b>{chapter.name}</b>
                  <small>
                    {chapter.materials} materials • {stats.total} questions
                  </small>
                </div>
                <ChevronDown size={16} />
                <select value={chapterIdx} onChange={(e) => setChapterIdx(Number(e.target.value))} aria-label="Select chapter">
                  {CHAPTERS.map((c, i) => (
                    <option key={c.name} value={i}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" className="qb-material-btn">
                <FileText size={14} /> View Chapter Material
              </button>
            </section>

            {/* Stats */}
            <section className="qb-stats">
              <div className="qb-stat">
                <span className="qb-stat-icon blue">
                  <FileText size={20} />
                </span>
                <div>
                  <p className="qb-stat-label">Total Questions</p>
                  <p className="qb-stat-value">{stats.total}</p>
                  <p className="qb-stat-sub up">
                    <ArrowUp size={10} /> 12 new this chapter
                  </p>
                </div>
              </div>

              <div className="qb-stat">
                <span className="qb-stat-icon purple">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="qb-stat-label">AI Generated</p>
                  <p className="qb-stat-value">{stats.ai}</p>
                  <p className="qb-stat-sub">{pct(stats.ai)}% of total</p>
                </div>
              </div>

              <div className="qb-stat">
                <span className="qb-stat-icon red">
                  <Pencil size={20} />
                </span>
                <div>
                  <p className="qb-stat-label">Manual Created</p>
                  <p className="qb-stat-value">{stats.manual}</p>
                  <p className="qb-stat-sub">{pct(stats.manual)}% of total</p>
                </div>
              </div>

              <div className="qb-stat">
                <span className="qb-stat-icon green">
                  <BarChart3 size={20} />
                </span>
                <div className="qb-stat-grow">
                  <p className="qb-stat-label">Easy / Medium / Hard</p>
                  <p className="qb-stat-value sm">
                    {stats.diff.Easy} / {stats.diff.Medium} / {stats.diff.Hard}
                  </p>
                  <div className="qb-diffbar">
                    <span className="e" style={{ flex: stats.diff.Easy }} />
                    <span className="m" style={{ flex: stats.diff.Medium }} />
                    <span className="h" style={{ flex: stats.diff.Hard }} />
                  </div>
                </div>
              </div>

              <div className="qb-stat types">
                <p className="qb-stat-label strong">Question Types</p>
                <ul>
                  {statTypes.map((t) => (
                    <li key={t.key}>
                      <i style={{ background: t.color }} />
                      <span>{t.label}</span>
                      <b>{t.value}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Table card */}
            <section className="qb-card">
              <div className="qb-toolbar">
                <div className="qb-tabs">
                  {TYPE_TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={tab === t.key ? "on" : ""}
                      onClick={() => {
                        setTab(t.key);
                        setPage(1);
                      }}
                    >
                      {t.label} ({tabCount(t.key)})
                    </button>
                  ))}
                </div>

                <div className="qb-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="qb-filter-wrap">
                  <button type="button" className="qb-filter-btn" onClick={() => setShowFilter(!showFilter)}>
                    <SlidersHorizontal size={13} /> Filter <ChevronDown size={13} />
                  </button>
                  {showFilter && (
                    <div className="qb-filter-pop">
                      <label>Difficulty</label>
                      <select
                        value={diffFilter}
                        onChange={(e) => {
                          setDiffFilter(e.target.value as "all" | Difficulty);
                          setPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <label>Source</label>
                      <select
                        value={sourceFilter}
                        onChange={(e) => {
                          setSourceFilter(e.target.value as "all" | Source);
                          setPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="AI Generated">AI Generated</option>
                        <option value="Manual">Manual</option>
                      </select>
                      <button
                        type="button"
                        className="qb-filter-clear"
                        onClick={() => {
                          setDiffFilter("all");
                          setSourceFilter("all");
                          setShowFilter(false);
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="qb-empty">
                  <FileText size={36} strokeWidth={1.4} />
                  <p>No questions found</p>
                  <span>Try changing your search or filters.</span>
                </div>
              ) : (
                <div className="qb-table-wrap">
                  <table className="qb-table">
                    <thead>
                      <tr>
                        <th className="qb-check">
                          <input type="checkbox" checked={allOnPage} onChange={toggleAll} />
                        </th>
                        <th className="qb-no">#</th>
                        <th>Question</th>
                        <th>Type</th>
                        <th>Difficulty</th>
                        <th>Created</th>
                        <th className="qb-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((q, i) => (
                        <tr
                          key={q.id}
                          className={q.id === selectedId ? "active" : ""}
                          onClick={() => selectQuestion(q)}
                        >
                          <td className="qb-check" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={checked.includes(q.id)} onChange={() => toggleOne(q.id)} />
                          </td>
                          <td className="qb-no">{start + i + 1}</td>
                          <td className="qb-q">{q.text || <em>Untitled question</em>}</td>
                          <td>
                            <span className={`qb-chip ${TYPE_CLASS[q.type]}`}>
                              {q.type}
                            </span>
                          </td>
                          <td>
                            <span className={`qb-diff ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                          </td>
                          <td className="qb-date">{fmtDate(q.created)}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="qb-actions">
                              <button type="button" aria-label="View" onClick={() => selectQuestion(q)}>
                                <Eye size={14} />
                              </button>
                              <button type="button" aria-label="Edit" onClick={() => selectQuestion(q, true)}>
                                <Pencil size={14} />
                              </button>
                              <button type="button" className="del" aria-label="Delete" onClick={() => deleteOne(q.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="qb-pager">
                  <p>
                    Showing {start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} questions
                    {checked.length > 0 && (
                      <button type="button" className="qb-bulk" onClick={deleteChecked}>
                        <Trash2 size={12} /> Delete selected ({checked.length})
                      </button>
                    )}
                  </p>
                  <div className="qb-pages">
                    <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
                      <ChevronLeft size={14} />
                    </button>
                    {pageList(current, totalPages).map((n, i) =>
                      n === "..." ? (
                        <span key={`d${i}`} className="qb-dots">
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
            </section>

            {/* Preview / Edit / Details */}
            <section className="qb-editor" ref={editRef}>
              {!selected ? (
                <div className="qb-empty wide">
                  <FileText size={36} strokeWidth={1.4} />
                  <p>No question selected</p>
                  <span>Select a question from the list to preview or edit it.</span>
                </div>
              ) : (
                <>
                  {/* Preview */}
                  <div className="qb-panel preview">
                    <div className="qb-panel-head">
                      <BookOpen size={15} />
                      <h3>Question Preview / Edit</h3>
                      <span className={`qb-chip ${TYPE_CLASS[selected.type]}`}>{selected.type}</span>
                      <small>
                        Question {selectedNo} of {questions.length}
                      </small>
                      <button type="button" className="qb-del-btn" onClick={() => deleteOne(selected.id)}>
                        <Trash2 size={12} /> Delete Question
                      </button>
                    </div>

                    <p className="qb-preview-q">{selected.text || "Untitled question"}</p>

                    {selected.type === "MCQ" || selected.type === "True/False" ? (
                      <ul className="qb-preview-opts">
                        {selected.options.map((o, i) => (
                          <li key={i} className={i === selected.correct ? "on" : ""}>
                            <i />
                            <span>
                              {selected.type === "MCQ" ? `${LETTERS[i]}) ` : ""}
                              {o || "—"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="qb-preview-ans">
                        <b>Model answer</b>
                        <p>{selected.answer || "No model answer added yet."}</p>
                      </div>
                    )}
                  </div>

                  {/* Edit */}
                  <div className="qb-panel edit">
                    <h3 className="qb-mini-title">Edit Question</h3>
                    <textarea
                      className="qb-textarea"
                      rows={2}
                      placeholder="Type your question here..."
                      value={draft.text}
                      onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                    />

                    {draft.type === "MCQ" && (
                      <div className="qb-opts">
                        {draft.options.map((o, i) => (
                          <div className="qb-opt" key={i}>
                            <span className="qb-opt-letter">{LETTERS[i]}</span>
                            <input
                              type="text"
                              value={o}
                              placeholder={`Option ${LETTERS[i]}`}
                              onChange={(e) => setOption(i, e.target.value)}
                            />
                            <button
                              type="button"
                              className={`qb-opt-ok ${draft.correct === i ? "on" : ""}`}
                              aria-label="Mark as correct"
                              onClick={() => setDraft({ ...draft, correct: i })}
                            >
                              <Check size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {draft.type === "True/False" && (
                      <div className="qb-opts">
                        {draft.options.map((o, i) => (
                          <div className="qb-opt" key={i}>
                            <span className="qb-opt-letter">{i === 0 ? "T" : "F"}</span>
                            <input type="text" value={o} readOnly />
                            <button
                              type="button"
                              className={`qb-opt-ok ${draft.correct === i ? "on" : ""}`}
                              aria-label="Mark as correct"
                              onClick={() => setDraft({ ...draft, correct: i })}
                            >
                              <Check size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {(draft.type === "Short Answer" || draft.type === "Long Answer") && (
                      <textarea
                        className="qb-textarea"
                        rows={draft.type === "Long Answer" ? 5 : 3}
                        placeholder="Model answer..."
                        value={draft.answer}
                        onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="qb-panel details">
                    <h3 className="qb-mini-title">Question Details</h3>

                    <label>Difficulty Level</label>
                    <div className="qb-sel">
                      <select
                        value={draft.difficulty}
                        onChange={(e) => setDraft({ ...draft, difficulty: e.target.value as Difficulty })}
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                      <ChevronDown size={12} />
                    </div>

                    <label>Status</label>
                    <div className="qb-sel">
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value as QStatus })}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                      <ChevronDown size={12} />
                    </div>

                    <label>Tags</label>
                    <div className="qb-tags">
                      {draft.tags.map((t) => (
                        <span key={t} className="qb-tag">
                          {t}
                          <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                    </div>

                    <button type="button" className="qb-update" onClick={updateQuestion}>
                      Update Question
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ===== Right column ===== */}
          <aside className="qb-right">
            <section className="qb-side-card">
              <div className="qb-side-head">
                <h3 className="qb-side-title">Chapter Information</h3>
                <button type="button" className="qb-edit-link">
                  <Pencil size={11} /> Edit
                </button>
              </div>
              <div className="qb-chapter">
                <div className="qb-chapter-thumb">
                  <Code2 size={30} strokeWidth={1.4} />
                </div>
                <div>
                  <h4>{chapter.name}</h4>
                  <p>{course.name}</p>
                  <p>
                    {chapter.materials} materials • {stats.total} questions
                  </p>
                </div>
              </div>
              <p className="qb-chapter-desc">
                In this chapter, we will learn about arrays, their properties, operations and common problems in DSA.
              </p>
            </section>

            <section className="qb-side-card">
              <h3 className="qb-side-title">Quick Actions</h3>
              <div className="qb-quick">
                <button type="button" onClick={handleGenerateAI}>
                  <span className="qb-quick-icon">
                    <Sparkles size={17} />
                  </span>
                  <span>
                    <b>Generate Questions with AI</b>
                    <small>Create questions from selected material</small>
                  </span>
                </button>
                <button type="button" onClick={addManual}>
                  <span className="qb-quick-icon">
                    <FilePlus2 size={17} />
                  </span>
                  <span>
                    <b>Add Manual Question</b>
                    <small>Create custom question</small>
                  </span>
                </button>
                <button type="button">
                  <span className="qb-quick-icon">
                    <Upload size={17} />
                  </span>
                  <span>
                    <b>Import from File</b>
                    <small>Upload PDF or document</small>
                  </span>
                </button>
              </div>
            </section>

            <section className="qb-side-card">
              <div className="qb-side-head">
                <h3 className="qb-side-title">Recently Added Questions</h3>
                <button type="button" className="qb-link">
                  View All <ArrowRight size={11} />
                </button>
              </div>
              <ul className="qb-recent">
                {recent.map((q) => (
                  <li key={q.id} onClick={() => selectQuestion(q, true)}>
                    <span className={`qb-recent-icon ${TYPE_CLASS[q.type]}`}>
                      <FileText size={15} />
                    </span>
                    <div>
                      <p className="qb-recent-text">{q.text || "Untitled question"}</p>
                      <div className="qb-recent-tags">
                        <span className={`qb-chip ${TYPE_CLASS[q.type]}`}>{q.type === "True/False" ? "T/F" : q.type}</span>
                        <span className={`qb-diff ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      </div>
                      <p className="qb-recent-meta">
                        {fmtDate(q.created)} • {q.source}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {toast && <div className="qb-toast">{toast}</div>}
    </div>
  );
}

export default QuestionBank;