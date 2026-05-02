import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import MainLayout from './layouts/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/students/StudentListPage';
import ClassHierarchyPage from './pages/students/ClassHierarchyPage';
import LecturerListPage from './pages/LecturerListPage';
import ProfilePage from './pages/ProfilePage';
import ERDiagramView from './pages/ERDiagramView';
import RegistrationManagementPage from './pages/registration/RegistrationManagementPage';
import CourseRegistrationPage from './pages/registration/CourseRegistrationPage';
import StudentTranscriptPage from './pages/grade/StudentTranscriptPage';
import GradeManagementPage from './pages/grade/GradeManagementPage';
import TuitionDashboardPage from './pages/finance/TuitionDashboardPage';
import TuitionManagementPage from './pages/finance/TuitionManagementPage';
import TuitionConfigPage from './pages/finance/TuitionConfigPage';
import useAuthStore from './store/useAuthStore';

// Modules IV & V
import CourseListPage from './pages/academic/CourseListPage';
import AcademicOverviewPage from './pages/academic/AcademicOverviewPage';

// Placeholder Components cho các Module chưa triển khai
const Placeholder = ({ title }) => (
  <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-500 italic">Tính năng này đang được phát triển theo lộ trình của Giai đoạn tiếp theo...</p>
  </div>
);

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* NHÓM 1: PUBLIC ROUTES - Dành cho khách / chưa đăng nhập */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
 
        {/* NHÓM 2: PROTECTED ROUTES - Yêu cầu Token & MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Mặc định vào Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
 
            {/* Thêm vào trong nhóm <Route element={<MainLayout />}> */}
            <Route path="/er-diagram" element={<ERDiagramView />} />
 
            {/* Đăng ký các Route tương ứng với menuConfig.js */}
            <Route path="/users" element={<Placeholder title="Quản trị Người dùng & Phân quyền" />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/student-classes" element={<ClassHierarchyPage />} />
            <Route path="/lecturers" element={<LecturerListPage />} />
            <Route path="/academic" element={<CourseListPage />} />
            <Route path="/academic-management" element={<AcademicOverviewPage />} />
            <Route 
              path="/registration" 
              element={
                user?.roles?.includes('SINHVIEN') 
                ? <CourseRegistrationPage /> 
                : <RegistrationManagementPage />
              } 
            />
            <Route 
              path="/grades" 
              element={
                user?.roles?.includes('SINHVIEN') 
                ? <StudentTranscriptPage /> 
                : <GradeManagementPage />
              } 
            />
            <Route 
              path="/finance" 
              element={
                user?.roles?.includes('SINHVIEN') 
                ? <TuitionDashboardPage /> 
                : <TuitionManagementPage />
              } 
            />
            <Route path="/tuition-config" element={<TuitionConfigPage />} />
            <Route path="/exams" element={<Placeholder title="Khảo thí & Xét tốt nghiệp" />} />
            <Route path="/settings" element={<Placeholder title="Thông báo & Cấu hình hệ thống" />} />
          </Route>
        </Route>

        {/* CẤU HÌNH FALLBACK: Mọi đường dẫn lạ đều đẩy về /login hoặc /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;