import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";

import Dashboard from "./student/Dashboard";
import MyDocuments from "./student/MyDocuments";
import GenerateQuiz from "./student/Generatequiz";
import QuizHistory from "./student/quizhistory";
import Performance from "./student/perfomance";
import AIRecommendation from "./student/AIRecommendation";
import Schedule from "./student/schedule";
import Flashcard from "./student/flashcard";
import NotificationsPage from "./student/notification";
import Profile from "./student/profile";
import Setting from "./student/setting";

import TeacherDashboard from "./teacher/dashboard";
import TeacherClasses from "./teacher/classes";
import TeacherProgress from "./teacher/progress";
import TeacherStudents from "./teacher/students";
import TeacherCourses from "./teacher/courses";
import TeacherQuestionBank from "./teacher/questionbank";
import TeacherCreateQuiz from "./teacher/createquiz";
import TeacherViewQuiz from "./teacher/viewquiz";
import TeacherStudentPerformance from "./teacher/studentperfomance";
import TeacherAITeaching from "./teacher/aiteaching";
import TeacherReport from "./teacher/report";
import TeacherNotification from "./teacher/notification";
import TeacherProfile from "./teacher/profile";
import TeacherSettings from "./teacher/settings";

import AdminDashboard from "./admin/dashboard";
import AdminAllUsers from "./admin/alluser";
import AdminClassesEnrollment from "./admin/classesenrollment";
import AdminPlatformAnalytics from "./admin/platformanalytics";
import AdminReports from "./admin/reports";
import AdminAnnouncements from "./admin/announcements";
import AdminNotifications from "./admin/notification";
import AdminPending from "./admin/pending";
import AdminProfile from "./admin/profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login, register, forgot password (logged in user yahan nahi aa sakta) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Student panel */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<Dashboard />} />
        <Route path="/student/documents" element={<MyDocuments />} />
        <Route path="/student/generate-quiz" element={<GenerateQuiz />} />
        <Route path="/student/quiz-history" element={<QuizHistory />} />
        <Route path="/student/analytics" element={<Performance />} />
        <Route path="/student/recommendations" element={<AIRecommendation />} />
        <Route path="/student/schedule" element={<Schedule />} />
        <Route path="/student/flashcards" element={<Flashcard />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/settings" element={<Setting />} />
      </Route>

      {/* Teacher panel */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/question-bank" element={<TeacherQuestionBank />} />
        <Route path="/teacher/create-quiz" element={<TeacherCreateQuiz />} />
        <Route path="/teacher/quizzes" element={<TeacherViewQuiz />} />
        <Route path="/teacher/performance" element={<TeacherStudentPerformance />} />
        <Route path="/teacher/ai-insights" element={<TeacherAITeaching />} />
        <Route path="/teacher/reports" element={<TeacherReport />} />
        <Route path="/teacher/notifications" element={<TeacherNotification />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/settings" element={<TeacherSettings />} />
        <Route path="/teacher/progress" element={<TeacherProgress />} />
      </Route>

      {/* Admin panel */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminAllUsers />} />
        <Route path="/admin/classes" element={<AdminClassesEnrollment />} />
        <Route path="/admin/analytics" element={<AdminPlatformAnalytics />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/approvals" element={<AdminPending />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Koi bhi purana/hataya hua admin URL dashboard pe bhej do */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;