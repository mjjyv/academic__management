import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import MainLayout from './layouts/MainLayout';

// Core State
import useAuthStore from './store/useAuthStore';

// Common Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ERDiagramView from './pages/ERDiagramView';

// Module I & III: Staff & Lecturers
import UserManagementPage from './pages/admin/UserManagementPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import LecturerListPage from './pages/LecturerListPage';

// Module II: Students
import StudentListPage from './pages/students/StudentListPage';
import ClassHierarchyPage from './pages/students/ClassHierarchyPage';

// Module IV & V: Academic Management
import CourseListPage from './pages/academic/CourseListPage';
import AcademicOverviewPage from './pages/academic/AcademicOverviewPage';
import SchedulePage from './pages/academic/SchedulePage';
import AcademicHierarchyPage from './pages/academic/AcademicHierarchyPage';
import CurriculumManagementPage from './pages/academic/CurriculumManagementPage';

// Module VI & IX: Registration & Finance
import CourseRegistrationPage from './pages/registration/CourseRegistrationPage';
import RegistrationManagementPage from './pages/registration/RegistrationManagementPage';
import TuitionDashboardPage from './pages/finance/TuitionDashboardPage';
import TuitionManagementPage from './pages/finance/TuitionManagementPage';
import TuitionConfigPage from './pages/finance/TuitionConfigPage';

// Module VIII: Grades
import StudentTranscriptPage from './pages/grade/StudentTranscriptPage';
import GradeManagementPage from './pages/grade/GradeManagementPage';

// Placeholder Components
const Placeholder = ({ title }) => (
  <div className="p-10 bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
    <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">{title}</h2>
    <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <p className="text-slate-500 font-bold italic text-center">
        Tính năng này đang được phát triển theo lộ trình của Giai đoạn tiếp theo...
      </p>
    </div>
  </div>
);

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* NHÓM 1: PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* NHÓM 2: PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Core */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/er-diagram" element={<ERDiagramView />} />

            {/* Admin & Personnel */}
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/roles" element={<RoleManagementPage />} />
            <Route path="/lecturers" element={<LecturerListPage />} />

            {/* Student & Classes */}
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/student-classes" element={<ClassHierarchyPage />} />

            {/* Academic & Schedule */}
            <Route path="/academic" element={<CourseListPage />} />
            <Route path="/academic-management" element={<AcademicOverviewPage />} />
            <Route path="/academic-hierarchy" element={<AcademicHierarchyPage />} />
            <Route path="/academic-hierarchy/programs/:programId/curriculum" element={<CurriculumManagementPage />} />
            <Route path="/schedule" element={<SchedulePage />} />

            {/* Registration */}
            <Route
              path="/registration"
              element={
                user?.roles?.includes('SINHVIEN')
                  ? <CourseRegistrationPage />
                  : <RegistrationManagementPage />
              }
            />

            {/* Grades & Transcript */}
            <Route
              path="/grades"
              element={
                user?.roles?.includes('SINHVIEN')
                  ? <StudentTranscriptPage />
                  : <GradeManagementPage />
              }
            />

            {/* Finance & Tuition */}
            <Route
              path="/finance"
              element={
                user?.roles?.includes('SINHVIEN')
                  ? <TuitionDashboardPage />
                  : <TuitionManagementPage />
              }
            />
            <Route path="/tuition-config" element={<TuitionConfigPage />} />

            {/* Coming Soon / Placeholders */}
            <Route path="/study-results-management" element={<Placeholder title="Quản lý Kết quả Học tập" />} />
            <Route path="/attendance-management" element={<Placeholder title="Quản lý Điểm danh" />} />
            <Route path="/exams" element={<Placeholder title="Khảo thí & Xét tốt nghiệp" />} />
            <Route path="/settings" element={<Placeholder title="Thông báo & Cấu hình hệ thống" />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;