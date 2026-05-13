import {
    LayoutDashboard,
    Users,
    UserCheck,
    GraduationCap,
    BookOpen,
    ClipboardList,
    Calendar,
    Award,
    Wallet,
    Settings,
    FileText,
    Bell,
    Database,
    School,
    Layers,
    Network
} from 'lucide-react';

export const MENU_ITEMS = [
    {
        title: 'Bảng điều khiển',
        path: '/dashboard',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
        icon: LayoutDashboard
    },
    {
        title: 'Quản trị hệ thống',
        path: '/users',
        roles: ['ADMIN'],
        icon: Users
    },
    {
        title: 'Quản lý Sinh viên',
        path: '/students',
        roles: ['ADMIN', 'GIAOVU'],
        icon: UserCheck
    },
    {
        title: 'Quản lý Lớp học',
        path: '/student-classes',
        roles: ['ADMIN', 'GIAOVU'],
        icon: School
    },
    {
        title: 'Quản lý Giảng viên',
        path: '/lecturers',
        roles: ['ADMIN', 'GIAOVU'],
        icon: GraduationCap
    },
    {
        title: 'Cấu trúc Học thuật',
        path: '/academic-hierarchy',
        roles: ['ADMIN', 'GIAOVU'],
        icon: Network
    },
    {
        title: 'Danh mục Môn học',
        path: '/academic',
        roles: ['ADMIN', 'GIAOVU'],
        icon: BookOpen
    },
    {
        title: 'Quản lý Đào tạo',
        path: '/academic-management',
        roles: ['ADMIN', 'GIAOVU'],
        icon: ClipboardList
    },
    {
        title: 'Đăng ký học phần',
        path: '/registration',
        roles: ['ADMIN', 'GIAOVU', 'SINHVIEN'],
        icon: Layers
    },
    {
        title: 'Lịch học & Giảng dạy',
        path: '/schedule',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
        icon: Calendar
    },
    {
        title: 'Điểm & Kết quả',
        path: '/grades',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
        icon: Award
    },
    {
        title: 'Học phí & Tài chính',
        path: '/finance',
        roles: ['ADMIN', 'GIAOVU', 'SINHVIEN'],
        icon: Wallet
    },
    {
        title: 'Cấu hình Học phí',
        path: '/tuition-config',
        roles: ['ADMIN', 'GIAOVU'],
        icon: Settings
    },
    {
        title: 'Khảo thí & Tốt nghiệp',
        path: '/exams',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
        icon: FileText
    },
    {
        title: 'Thông báo & Cấu hình',
        path: '/settings',
        roles: ['ADMIN', 'GIAOVU'],
        icon: Bell
    },
    {
        title: 'Sơ đồ ER Hệ thống',
        path: '/er-diagram',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
        icon: Database
    },
];