import { useState } from "react";
import type { ReactNode } from "react";
import {
  Layers,
  BookOpen,
  Brain,
  Network,
  Database,
  Globe,
  Code2,
  Share2,
  Boxes,
  Plus,
  LayoutGrid,
  MoreHorizontal,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Check,
  Star,
  ArrowRight,
  Target,
  Bot,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Copy,
} from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./flashcard.css";

/* ---------------- DATA ---------------- */

interface Deck {
  id: string;
  name: string;
  subject: string;
  cards: number;
  progress: number;
  tone: string;
  icon: ReactNode;
}

interface Card {
  q: string;
  a: string;
  tag: string;
}

const decks: Deck[] = [
  { id: "ds", name: "Data Structures", subject: "Computer Science", cards: 42, progress: 68, tone: "violet", icon: <Network size={16} /> },
  { id: "algo", name: "Algorithms", subject: "Computer Science", cards: 36, progress: 55, tone: "green", icon: <Brain size={16} /> },
  { id: "db", name: "Database Systems", subject: "Database", cards: 28, progress: 72, tone: "orange", icon: <Database size={16} /> },
  { id: "web", name: "Web Development", subject: "Web Development", cards: 31, progress: 61, tone: "blue", icon: <Globe size={16} /> },
  { id: "py", name: "Python Basics", subject: "Programming", cards: 24, progress: 50, tone: "yellow", icon: <Code2 size={16} /> },
  { id: "ml", name: "Machine Learning", subject: "AI & Data Science", cards: 18, progress: 39, tone: "indigo", icon: <Bot size={16} /> },
  { id: "net", name: "Computer Networks", subject: "Computer Science", cards: 22, progress: 45, tone: "pink", icon: <Share2 size={16} /> },
  { id: "oop", name: "OOP Concepts", subject: "Programming", cards: 20, progress: 60, tone: "teal", icon: <Boxes size={16} /> },
];

const cardBank: Record<string, Card[]> = {
  ds: [
    { q: "What is a Stack in Data Structures?", a: "A stack is a linear data structure that follows Last In First Out (LIFO) principle. Elements can only be added or removed from the top of the stack.", tag: "LIFO" },
    { q: "What is a Queue?", a: "A queue is a linear data structure that follows First In First Out (FIFO) principle. Elements are added at the rear and removed from the front.", tag: "FIFO" },
    { q: "What is a Linked List?", a: "A linked list is a linear collection of nodes where each node stores data and a reference to the next node.", tag: "Nodes" },
  ],
  algo: [
    { q: "What is the time complexity of Binary Search?", a: "Binary search runs in O(log n) time because it halves the search space on every step. The array must be sorted.", tag: "O(log n)" },
    { q: "What is Recursion?", a: "Recursion is a technique where a function calls itself to solve smaller instances of the same problem, with a base case to stop.", tag: "Base case" },
  ],
  db: [
    { q: "What is Normalization?", a: "Normalization is organizing database tables to reduce redundancy and improve data integrity.", tag: "1NF-3NF" },
    { q: "What is a Primary Key?", a: "A primary key uniquely identifies each row in a table and cannot contain NULL values.", tag: "Unique" },
  ],
  web: [
    { q: "What is the Virtual DOM in React?", a: "The virtual DOM is a lightweight copy of the real DOM. React compares changes and updates only what is needed.", tag: "React" },
    { q: "What does CSS Flexbox do?", a: "Flexbox is a one-dimensional layout model that distributes space and aligns items inside a container.", tag: "Layout" },
  ],
  py: [
    { q: "What is a list comprehension?", a: "A concise way to create lists in Python using a single expression, e.g. [x*2 for x in range(5)].", tag: "Python" },
    { q: "Difference between list and tuple?", a: "Lists are mutable, tuples are immutable. Tuples are slightly faster and can be used as dictionary keys.", tag: "Mutable" },
  ],
  ml: [
    { q: "What is Overfitting?", a: "Overfitting happens when a model learns training data too well, including noise, and performs poorly on new data.", tag: "Bias-Variance" },
  ],
  net: [
    { q: "What is the OSI model?", a: "A 7-layer conceptual framework that describes how data moves through a network, from physical to application layer.", tag: "7 Layers" },
  ],
  oop: [
    { q: "What is Encapsulation?", a: "Encapsulation bundles data and methods in a class and restricts direct access to some of the object's components.", tag: "OOP" },
  ],
};

const stats = [
  { label: "Total Flashcards", value: "248", note: "12% from last week", icon: <BookOpen size={18} />, tone: "indigo" },
  { label: "Decks Created", value: "8", note: "2 new this week", icon: <Copy size={18} />, tone: "blue" },
  { label: "Cards Studied", value: "142", note: "18% from last week", icon: <Layers size={18} />, tone: "orange" },
  { label: "Retention Rate", value: "76%", note: "9% from last week", icon: <Target size={18} />, tone: "violet" },
];

const progressList = [
  { label: "Data Structures", value: 68, color: "#7c4dff" },
  { label: "Algorithms", value: 55, color: "#22b573" },
  { label: "Database Systems", value: 72, color: "#fbb02d" },
  { label: "Web Development", value: 61, color: "#3b9cff" },
  { label: "Others", value: 48, color: "#9a7bff" },
];

const schedule = [
  { m: "May", d: 20, title: "Data Structures Flashcards", time: "10:00 AM - 10:30 AM", tag: "Today", tone: "violet" },
  { m: "May", d: 21, title: "Algorithms Revision", time: "09:00 AM - 09:30 AM", tag: "Tomorrow", tone: "blue" },
  { m: "May", d: 22, title: "Database Systems", time: "11:00 AM - 11:30 AM", tag: "In 2 days", tone: "green" },
  { m: "May", d: 23, title: "Web Development", time: "02:00 PM - 02:30 PM", tag: "In 3 days", tone: "green" },
];

const activity = [
  { title: "Studied 5 cards from Data Structures", sub: "2 hours ago", icon: <BookOpen size={15} />, tone: "violet" },
  { title: "Created new deck: Machine Learning", sub: "Yesterday", icon: <Plus size={15} />, tone: "violet" },
  { title: "Completed revision: Algorithms", sub: "Yesterday", icon: <ShieldCheck size={15} />, tone: "green" },
  { title: "Studied 8 cards from Python Basics", sub: "May 18, 2025", icon: <Star size={15} />, tone: "orange" },
  { title: "Marked 3 cards for review", sub: "May 17, 2025", icon: <Layers size={15} />, tone: "violet" },
];

/* ---------------- HELPERS ---------------- */

const R = 48;
const CIRC = 2 * Math.PI * R;
const OVERALL = 76;

/* ---------------- COMPONENT ---------------- */

function Flashcard() {
  const [activeId, setActiveId] = useState("ds");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [query, setQuery] = useState("");
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});

  const activeDeck = decks.find((d) => d.id === activeId) ?? decks[0];
  const list = (cardBank[activeId] ?? []).filter((c) =>
    c.q.toLowerCase().includes(query.trim().toLowerCase())
  );
  const safeIdx = list.length ? Math.min(idx, list.length - 1) : 0;
  const current = list[safeIdx];
  const cardKey = `${activeId}-${current?.q ?? ""}`;

  const selectDeck = (id: string) => {
    setActiveId(id);
    setIdx(0);
    setFlipped(false);
    setQuery("");
  };

  const go = (dir: 1 | -1) => {
    if (!list.length) return;
    setIdx((safeIdx + dir + list.length) % list.length);
    setFlipped(false);
  };

  const markKnow = () => {
    if (!current) return;
    setKnown((k) => ({ ...k, [cardKey]: true }));
    setReview((r) => ({ ...r, [cardKey]: false }));
  };

  const markReview = () => {
    if (!current) return;
    setReview((r) => ({ ...r, [cardKey]: true }));
    setKnown((k) => ({ ...k, [cardKey]: false }));
  };

  return (
    <div className="fc-shell">
      <Sidebar />

      <div className="fc-main">
        <Header />

        <div className="fc-content">
          {/* ============ CENTER ============ */}
          <div className="fc-center">
            {/* Banner */}
            <div className="fc-banner">
              <span className="fc-banner-icon">
                <Layers size={28} />
              </span>
              <div>
                <h1 className="fc-title">Flashcards &amp; Revision</h1>
                <p className="fc-subtitle">
                  Turn your notes into powerful flashcards and revise smarter with spaced repetition.
                </p>
              </div>
              <span className="fc-banner-note">
                Small cards
                <br />
                Big progress!
              </span>
            </div>

            {/* Stats */}
            <div className="fc-stats">
              {stats.map((s) => (
                <div className="fc-card fc-stat" key={s.label}>
                  <span className={`fc-stat-icon ${s.tone}`}>{s.icon}</span>
                  <div>
                    <p className="fc-stat-label">{s.label}</p>
                    <p className="fc-stat-value">{s.value}</p>
                    <p className="fc-stat-note">↑ {s.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decks + Study progress */}
            <div className="fc-row-decks">
              <div className="fc-card">
                <div className="fc-decks-head">
                  <div>
                    <h3 className="fc-h2">My Flashcard Decks</h3>
                    <p className="fc-muted">Browse your flashcard decks or create a new one.</p>
                  </div>
                  <div className="fc-decks-actions">
                    <button type="button" className="fc-btn-primary">
                      <Plus size={12} /> Create New Deck
                    </button>
                    <button type="button" className="fc-icon-btn" aria-label="Grid view">
                      <LayoutGrid size={14} />
                    </button>
                  </div>
                </div>

                <div className="fc-deck-grid">
                  {decks.map((d) => (
                    <div
                      className={`fc-deck ${d.id === activeId ? "active" : ""}`}
                      key={d.id}
                      onClick={() => selectDeck(d.id)}
                    >
                      <div className="fc-deck-top">
                        <span className={`fc-deck-icon ${d.tone}`}>{d.icon}</span>
                        <MoreHorizontal size={14} className="fc-dots" />
                      </div>
                      <p className="fc-deck-name">{d.name}</p>
                      <p className="fc-deck-sub">{d.subject}</p>
                      <div className="fc-deck-foot">
                        <span>{d.cards} cards</span>
                        <span>{d.progress}%</span>
                      </div>
                      <div className="fc-bar">
                        <div className={d.tone} style={{ width: `${d.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fc-card">
                <div className="fc-card-head">
                  <h3>Study Progress</h3>
                  <a href="#all" className="fc-link">
                    View All <ArrowRight size={11} />
                  </a>
                </div>
                <div className="fc-donut">
                  <svg viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="fcGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7c4dff" />
                        <stop offset="100%" stopColor="#5b6cf0" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r={R} className="fc-donut-bg" />
                    <circle
                      cx="60"
                      cy="60"
                      r={R}
                      className="fc-donut-fg"
                      strokeDasharray={`${(OVERALL / 100) * CIRC} ${CIRC}`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="fc-donut-center">
                    <b>{OVERALL}%</b>
                    <span>Overall Progress</span>
                  </div>
                </div>
                <ul className="fc-legend">
                  {progressList.map((p) => (
                    <li key={p.label}>
                      <i style={{ background: p.color }} />
                      <span>{p.label}</span>
                      <b>{p.value}%</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Study flashcards */}
            <div className="fc-card">
              <div className="fc-study-head">
                <div>
                  <h3 className="fc-h2">Study Flashcards</h3>
                  <p className="fc-muted">Start with a deck or continue your last session.</p>
                </div>
                <div className="fc-study-tools">
                  <div className="fc-search">
                    <Search size={13} />
                    <input
                      type="text"
                      placeholder="Search flashcards..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setIdx(0);
                        setFlipped(false);
                      }}
                    />
                  </div>
                  <div className="fc-select">
                    <select value={activeId} onChange={(e) => selectDeck(e.target.value)} aria-label="Deck">
                      <option value="all" disabled>
                        All Decks
                      </option>
                      {decks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} />
                  </div>
                </div>
              </div>

              <div className="fc-study">
                <div className="fc-study-list">
                  {decks.slice(0, 5).map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      className={`fc-study-deck ${d.id === activeId ? "active" : ""}`}
                      onClick={() => selectDeck(d.id)}
                    >
                      <span className={`fc-deck-icon sm ${d.tone}`}>{d.icon}</span>
                      <span className="fc-study-deck-text">
                        <b>{d.name}</b>
                        <small>{d.cards} cards</small>
                      </span>
                      {d.id === activeId && <ChevronRight size={12} />}
                    </button>
                  ))}
                  <a href="#all" className="fc-view-decks">
                    View All Decks <ArrowRight size={11} />
                  </a>
                </div>

                <div className="fc-study-stage">
                  <div className="fc-stage-box">
                    {current ? (
                      <div
                        className={`fc-flip ${flipped ? "back" : "front"}`}
                        onClick={() => setFlipped((f) => !f)}
                      >
                        <div className="fc-flip-top">
                          <span className="fc-flip-tag">{activeDeck.name}</span>
                          <span className="fc-flip-count">
                            {safeIdx + 1} / {list.length}
                          </span>
                        </div>

                        {!flipped ? (
                          <div className="fc-face">
                            <span className="fc-face-icon">
                              <Layers size={20} />
                            </span>
                            <p className="fc-face-label">Front</p>
                            <p className="fc-face-q">{current.q}</p>
                          </div>
                        ) : (
                          <div className="fc-face back">
                            <p className="fc-face-label left">Back</p>
                            <p className="fc-face-a">{current.a}</p>
                            <span className="fc-answer-tag">{current.tag}</span>
                          </div>
                        )}

                        <p className="fc-hint">
                          <RotateCw size={10} /> Click to flip
                        </p>
                      </div>
                    ) : (
                      <p className="fc-empty">No flashcards found.</p>
                    )}
                  </div>

                  <div className="fc-controls">
                    <button type="button" className="fc-circle" onClick={() => go(-1)} aria-label="Previous">
                      <ChevronLeft size={14} />
                    </button>
                    <button type="button" className="fc-flip-btn" onClick={() => setFlipped((f) => !f)}>
                      <RotateCw size={12} /> Flip
                    </button>
                    <button type="button" className="fc-circle" onClick={() => go(1)} aria-label="Next">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="fc-mark-row">
                    <button
                      type="button"
                      className={`fc-mark know ${known[cardKey] ? "on" : ""}`}
                      onClick={markKnow}
                    >
                      <Check size={13} /> Mark as Know
                    </button>
                    <button
                      type="button"
                      className={`fc-mark review ${review[cardKey] ? "on" : ""}`}
                      onClick={markReview}
                    >
                      <Star size={13} /> Mark for Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <aside className="fc-right">
            <div className="fc-card">
              <div className="fc-card-head">
                <h3>Revision Schedule</h3>
                <a href="#all" className="fc-link">
                  View Calendar <ArrowRight size={11} />
                </a>
              </div>
              <div className="fc-sched">
                {schedule.map((s) => (
                  <div className="fc-sched-item" key={s.title}>
                    <div className="fc-date">
                      <small>{s.m}</small>
                      <b>{s.d}</b>
                    </div>
                    <div className="fc-sched-info">
                      <p>{s.title}</p>
                      <span>{s.time}</span>
                    </div>
                    <span className={`fc-sched-tag ${s.tone}`}>{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fc-promo">
              <div>
                <p className="fc-promo-title">
                  Consistent revision
                  <br />
                  builds strong memory!
                </p>
                <div className="fc-promo-dots">
                  <i className="on" />
                  <i />
                  <i />
                </div>
              </div>
              <span className="fc-promo-art">
                <Bot size={46} />
              </span>
            </div>

            <div className="fc-card">
              <div className="fc-card-head">
                <h3>Recent Activity</h3>
                <a href="#all" className="fc-link">
                  View All <ArrowRight size={11} />
                </a>
              </div>
              <div className="fc-act-list">
                {activity.map((a) => (
                  <div className="fc-act" key={a.title}>
                    <span className={`fc-act-icon ${a.tone}`}>{a.icon}</span>
                    <div>
                      <p>{a.title}</p>
                      <span>{a.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fc-revise">
              <div className="fc-revise-text">
                <h3>Revise Smarter, Not Harder</h3>
                <p>Use flashcards, track your progress and improve your retention rate.</p>
                <button type="button" className="fc-btn-primary">
                  Start Learning <ArrowRight size={12} />
                </button>
              </div>
              <span className="fc-revise-art">
                <Lightbulb size={40} />
                <TrendingUp size={0} />
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;