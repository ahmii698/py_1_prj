"""
models.py - AI Adaptive Learning & Smart Assessment System

Laravel me Model + Migration alag hote hain, SQLAlchemy me ye ek hi jagah hota hai.
Jab uvicorn start hoga to Base.metadata.create_all() ye saare tables MySQL me bana dega.

Tables (spec ke sections ke hisaab se):
  Users / Course        -> Student module, Teacher dashboard
  Chapter               -> Teacher ki upload ki hui PDF
  Concept               -> Concept dependency graph ke nodes (6.2)
  ConceptPrerequisite   -> Graph ke edges: Variables -> Conditions -> Loops (6.2)
  Question              -> MCQ, har sawal ek concept se mapped (Phase 2)
  LearningResource      -> Concept ke notes / exercises / videos (Recovery module)
  QuizAttempt           -> Test / quiz, pre-test, post-test (Evaluation plan)
  AttemptAnswer         -> Har sawal ka jawab + time (Phase 2)
  ConceptMastery        -> Student ka abhi ka mastery (BKT) (6.3)
  MasteryHistory        -> Mastery ki history: pichle test se compare + graphs (6.3, 9)
  RecoveryPath/Step     -> Personalized recovery path + explanation (6.4, 6.5)
"""
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime,
    ForeignKey, UniqueConstraint,
)
from sqlalchemy.dialects.mysql import LONGTEXT

from database import Base


def utcnow():
    # Sab time UTC me save honge. Karachi time frontend par dikhana (UTC+5).
    return datetime.now(timezone.utc)


# Bade PDF text ke liye: MySQL me LONGTEXT, baaki jagah normal Text
BigText = Text().with_variant(LONGTEXT(), "mysql")


# ---------------------------------------------------------------------------
# 1. USERS
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)   # asli password kabhi save nahi karna
    role = Column(String(20), nullable=False)             # "teacher" ya "student"
    created_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 2. COURSE aur ENROLLMENT
# Spec: pehle sirf ek course (e.g. Programming Fundamentals). Table phir bhi
# alag rakha hai taake baad me doosra subject (Maths) bina badlaav ke add ho.
# ---------------------------------------------------------------------------
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)           # e.g. "Programming Fundamentals"
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)


class Enrollment(Base):
    """Kaun sa student kis course me hai (teacher dashboard isi se students dikhata hai)."""
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("course_id", "student_id", name="uq_enrollment"),)

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    enrolled_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 3. CHAPTER (teacher ki PDF)
# ---------------------------------------------------------------------------
class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False)           # e.g. "Chapter 1: Variables"
    order_no = Column(Integer, default=1)                 # chapters ki tarteeb
    pdf_filename = Column(String(255))
    pdf_text = Column(BigText)                            # PDF se nikala hua text
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 4. CONCEPT DEPENDENCY GRAPH (spec 6.2)
# Concept = node.  ConceptPrerequisite = directed edge.
# ---------------------------------------------------------------------------
class Concept(Base):
    __tablename__ = "concepts"
    __table_args__ = (UniqueConstraint("course_id", "name", name="uq_concept_name"),)

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))   # kis chapter ka concept hai (optional)
    name = Column(String(200), nullable=False)                # e.g. "Loops"
    description = Column(Text)

    # Bayesian Knowledge Tracing ke 4 parameters (spec 6.3).
    # Ye shuru ke default hain, baad me test karke tune karenge.
    bkt_p_init = Column(Float, default=0.30)    # shuru me concept aata hone ka imkaan
    bkt_p_learn = Column(Float, default=0.20)   # ek attempt me seekh lene ka imkaan
    bkt_p_slip = Column(Float, default=0.10)    # aata hai phir bhi galat kar de
    bkt_p_guess = Column(Float, default=0.25)   # nahi aata phir bhi tukka sahi lag jaye (4 option = 0.25)

    created_at = Column(DateTime, default=utcnow)


class ConceptPrerequisite(Base):
    """
    Ek row = ek teer:  prerequisite  ->  concept
    Example: prerequisite="Conditions", concept="Loops"  (pehle Conditions, phir Loops)
    """
    __tablename__ = "concept_prerequisites"
    __table_args__ = (UniqueConstraint("concept_id", "prerequisite_id", name="uq_prereq_pair"),)

    id = Column(Integer, primary_key=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)        # aagay wala concept
    prerequisite_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)   # pehle seekhna wala concept
    is_reviewed = Column(Boolean, default=False)   # teacher/subject expert ne confirm kiya? (Risk: galat prerequisites)
    source = Column(String(20), default="teacher") # "teacher" ya "ai" (AI ne suggest kiya)


# ---------------------------------------------------------------------------
# 5. QUESTION (MCQ, har sawal ek concept se mapped)
# ---------------------------------------------------------------------------
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)   # BKT/weak analysis isi par chalta hai

    question_text = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_option = Column(String(1), nullable=False)    # "a", "b", "c" ya "d"
    explanation = Column(Text)                            # galat jawab ke baad dikhane ke liye

    difficulty = Column(Integer, default=2)               # 1 = easy, 2 = medium, 3 = hard (adaptive quiz)
    source = Column(String(20), default="ai")             # "ai" ya "manual"
    is_approved = Column(Boolean, default=False)          # teacher approve kare tabhi student ko dikhe
    created_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 6. LEARNING RESOURCE (concept ke notes, exercises, videos)
# ---------------------------------------------------------------------------
class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)
    title = Column(String(200), nullable=False)
    resource_type = Column(String(20), default="notes")   # "notes", "video", "exercise", "link"
    content_text = Column(Text)                           # notes ya exercise ka text
    url = Column(String(500))                             # video / link
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 7. QUIZ ATTEMPT aur ANSWERS
# ---------------------------------------------------------------------------
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))   # chapter-wise test; adaptive me khali ho sakta hai

    # "pretest", "practice", "adaptive", "followup", "posttest"
    # pre/post test alag type isliye ke evaluation (spec section 9) me improvement nikalni hai
    attempt_type = Column(String(20), default="practice")

    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    started_at = Column(DateTime, default=utcnow)
    submitted_at = Column(DateTime)                       # khali = abhi submit nahi hua


class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)   # question se copy, taake analysis tez ho

    selected_option = Column(String(1))                   # "a".."d", khali = chhoda hua
    is_correct = Column(Boolean, default=False)
    time_taken_sec = Column(Integer)                      # kitni der me jawab diya
    answered_at = Column(DateTime, default=utcnow)        # BKT me jawabon ki tarteeb zaroori hai


# ---------------------------------------------------------------------------
# 8. CONCEPT MASTERY (spec 6.3)
# ---------------------------------------------------------------------------
class ConceptMastery(Base):
    """Ek student + ek concept = ek row. Har test ke baad update hoti hai."""
    __tablename__ = "concept_mastery"
    __table_args__ = (UniqueConstraint("student_id", "concept_id", name="uq_student_concept"),)

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)

    p_known = Column(Float, default=0.30)       # BKT ka andaza: concept aata hai (0 se 1)
    attempts_count = Column(Integer, default=0)  # is concept ke kitne sawal solve kiye
    correct_count = Column(Integer, default=0)   # kitne sahi

    # "unknown" (data kam), "weak", "learning", "mastered"
    # Thresholds spec ke mutabiq test karke tay honge, isliye code me config rakhna
    status = Column(String(20), default="unknown")
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)


class MasteryHistory(Base):
    """
    Har attempt ke baad snapshot. Isse:
      - "pichle test se compare" nikalta hai
      - student progress graph banta hai
      - baseline (simple accuracy) vs BKT ka comparison hota hai (spec section 9)
    """
    __tablename__ = "mastery_history"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)

    p_known = Column(Float)                      # BKT mastery us waqt
    accuracy = Column(Float)                     # baseline: is attempt me us concept par sahi / total
    created_at = Column(DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# 9. RECOVERY PATH (spec 6.4 aur 6.5)
# ---------------------------------------------------------------------------
class RecoveryPath(Base):
    """Student kisi concept (e.g. Loops) me weak hai to uske liye ek ordered plan."""
    __tablename__ = "recovery_paths"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    target_concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)  # jis concept me dikkat hai

    status = Column(String(20), default="active")        # "active", "completed", "abandoned"
    explanation = Column(Text)                           # teacher ko dikhane ke liye wajah (explainability)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)


class RecoveryStep(Base):
    """Path ka ek qadam. Example: 1) Conditions revise  2) Loop exercises  3) Follow-up quiz"""
    __tablename__ = "recovery_steps"

    id = Column(Integer, primary_key=True)
    path_id = Column(Integer, ForeignKey("recovery_paths.id"), nullable=False, index=True)
    step_order = Column(Integer, nullable=False)         # 1, 2, 3 ... (prerequisite pehle)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)

    step_type = Column(String(20), default="revise")     # "revise", "exercise", "quiz"
    resource_id = Column(Integer, ForeignKey("learning_resources.id"))   # recommend kiya gaya material

    # Explainability (6.5): "Conditions weak hain (mastery 0.35), isliye Loops se pehle"
    reason = Column(Text)

    status = Column(String(20), default="pending")       # "pending", "done", "skipped"
    completed_at = Column(DateTime)