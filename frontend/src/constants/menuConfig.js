export const MENU_ITEMS = [
    {
        title: 'Bảng điều khiển',
        path: '/dashboard',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
    },
    {
        title: 'Quản trị hệ thống',
        path: '/users',
        roles: ['ADMIN'],
    },
    {
        title: 'Quản lý Sinh viên',
        path: '/students',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Lớp học',
        path: '/student-classes',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Giảng viên',
        path: '/lecturers',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Danh mục Môn học',
        path: '/academic',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Đào tạo',
        path: '/academic-management',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Đăng ký học phần',
        path: '/registration',
        roles: ['ADMIN', 'GIAOVU', 'SINHVIEN'],
    },
    {
        title: 'Lịch học & Giảng dạy',
        path: '/schedule',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
    },
    {
        title: 'Điểm & Kết quả',
        path: '/grades',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
    },
    {
        title: 'Học phí & Tài chính',
        path: '/finance',
        roles: ['ADMIN', 'GIAOVU', 'SINHVIEN'],
    },
    {
        title: 'Cấu hình Học phí',
        path: '/tuition-config',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Khảo thí & Tốt nghiệp',
        path: '/exams',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
    },
    {
        title: 'Thông báo & Cấu hình',
        path: '/settings',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Sơ đồ ER Hệ thống',
        path: '/er-diagram',
        roles: ['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'],
    },
];