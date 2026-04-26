-- TẠO DỮ LIỆU MẪU

-- 1. Dữ liệu cho bảng 'roles'
-- Tạo ID cố định để dễ dàng tham chiếu ở các bảng sau
DECLARE @RoleAdminId UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleGiaovuId UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleGiangvienId UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleSinhvienId UNIQUEIDENTIFIER = NEWID();

INSERT INTO roles (id, code, name, description, is_system, is_active) VALUES
(@RoleAdminId, 'ADMIN', N'Quản trị hệ thống', N'Toàn quyền truy cập hệ thống', 1, 1),
(@RoleGiaovuId, 'GIAOVU', N'Giáo vụ', N'Quản lý sinh viên, lớp học và đăng ký môn', 0, 1),
(@RoleGiangvienId, 'GIANGVIEN', N'Giảng viên', N'Quản lý điểm và lịch dạy', 0, 1),
(@RoleSinhvienId, 'SINHVIEN', N'Sinh viên', N'Xem thông tin cá nhân và đăng ký tín chỉ', 0, 1);
GO

-- 2. Dữ liệu cho bảng 'users'
-- Mật khẩu dưới đây là mã băm giả định (ví dụ: chuỗi 'hashed_password_...')
DECLARE @UserAdminId UNIQUEIDENTIFIER = NEWID();
DECLARE @UserGiaovuId UNIQUEIDENTIFIER = NEWID();
DECLARE @UserGiangvienId UNIQUEIDENTIFIER = NEWID();
DECLARE @UserSinhvienId UNIQUEIDENTIFIER = NEWID();

DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active) VALUES
(@UserAdminId, 'admin', @PassHash, N'Nguyễn Văn Admin', 'admin@stdmanager.edu.vn', '0901112222', 1),
(@UserGiaovuId, 'giaovu01', @PassHash, N'Trần Thị Giáo Vụ', 'giaovu@stdmanager.edu.vn', '0903334444', 1),
(@UserGiangvienId, 'gv.hung', @PassHash, N'Lê Văn Hùng', 'hung.lv@stdmanager.edu.vn', '0905556666', 1),
(@UserSinhvienId, 'sv.anh', @PassHash, N'Phạm Thị Anh', 'anh.pt@student.stdmanager.edu.vn', '0907778888', 1);
GO

-- 3. Dữ liệu cho bảng 'user_roles' (Gán người dùng vào vai trò)
-- Cần lấy ID từ các bảng đã insert ở trên
DECLARE @UserAdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @UserGiaovuId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'giaovu01');
DECLARE @UserGiangvienId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'gv.hung');
DECLARE @UserSinhvienId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.anh');

DECLARE @RoleAdminId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'ADMIN');
DECLARE @RoleGiaovuId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'GIAOVU');
DECLARE @RoleGiangvienId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'GIANGVIEN');
DECLARE @RoleSinhvienId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'SINHVIEN');

INSERT INTO user_roles (user_id, role_id, is_active) VALUES
(@UserAdminId, @RoleAdminId, 1),
(@UserGiaovuId, @RoleGiaovuId, 1),
(@UserGiangvienId, @RoleGiangvienId, 1),
(@UserSinhvienId, @RoleSinhvienId, 1);
GO

-- 4. Dữ liệu cho bảng 'permissions'
DECLARE @PermUserViewId UNIQUEIDENTIFIER = NEWID();
DECLARE @PermUserEditId UNIQUEIDENTIFIER = NEWID();
DECLARE @PermCourseViewId UNIQUEIDENTIFIER = NEWID();
DECLARE @PermCourseEditId UNIQUEIDENTIFIER = NEWID();
DECLARE @PermGradeInputId UNIQUEIDENTIFIER = NEWID();
DECLARE @PermGradeViewId UNIQUEIDENTIFIER = NEWID();

INSERT INTO permissions (id, code, name, module, description, is_active) VALUES
(@PermUserViewId, 'USER_VIEW', 'Xem người dùng', 'USER', 'Quyền xem danh sách người dùng', 1),
(@PermUserEditId, 'USER_EDIT', 'Sửa người dùng', 'USER', 'Quyền thêm/sửa/xóa người dùng', 1),
(@PermCourseViewId, 'COURSE_VIEW', 'Xem môn học', 'COURSE', 'Xem danh sách môn học', 1),
(@PermCourseEditId, 'COURSE_EDIT', 'Quản lý môn học', 'COURSE', 'Thêm/Sửa/Xóa môn học', 1),
(@PermGradeInputId, 'GRADE_INPUT', 'Nhập điểm', 'GRADE', 'Nhập điểm cho sinh viên', 1),
(@PermGradeViewId, 'GRADE_VIEW', 'Xem điểm', 'GRADE', 'Xem bảng điểm', 1);
GO

-- 5. Dữ liệu cho bảng 'role_permissions' (Gán quyền cho vai trò)
-- Lấy lại ID Roles và Permissions
DECLARE @RoleAdminId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'ADMIN');
DECLARE @RoleGiaovuId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'GIAOVU');
DECLARE @RoleGiangvienId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'GIANGVIEN');
DECLARE @RoleSinhvienId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'SINHVIEN');

-- Lấy ID Permissions
DECLARE @PermUserViewId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'USER_VIEW');
DECLARE @PermUserEditId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'USER_EDIT');
DECLARE @PermCourseViewId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'COURSE_VIEW');
DECLARE @PermCourseEditId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'COURSE_EDIT');
DECLARE @PermGradeInputId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'GRADE_INPUT');
DECLARE @PermGradeViewId UNIQUEIDENTIFIER = (SELECT id FROM permissions WHERE code = 'GRADE_VIEW');

-- Admin có tất cả quyền
INSERT INTO role_permissions (role_id, permission_id, is_active) VALUES
(@RoleAdminId, @PermUserViewId, 1),
(@RoleAdminId, @PermUserEditId, 1),
(@RoleAdminId, @PermCourseViewId, 1),
(@RoleAdminId, @PermCourseEditId, 1),
(@RoleAdminId, @PermGradeInputId, 1),
(@RoleAdminId, @PermGradeViewId, 1);

-- Giáo vụ quản lý môn học và xem điểm
INSERT INTO role_permissions (role_id, permission_id, is_active) VALUES
(@RoleGiaovuId, @PermCourseViewId, 1),
(@RoleGiaovuId, @PermCourseEditId, 1),
(@RoleGiaovuId, @PermGradeViewId, 1);

-- Giảng viên nhập điểm và xem môn học
INSERT INTO role_permissions (role_id, permission_id, is_active) VALUES
(@RoleGiangvienId, @PermCourseViewId, 1),
(@RoleGiangvienId, @PermGradeInputId, 1);

-- Sinh viên chỉ xem điểm và xem môn học
INSERT INTO role_permissions (role_id, permission_id, is_active) VALUES
(@RoleSinhvienId, @PermCourseViewId, 1),
(@RoleSinhvienId, @PermGradeViewId, 1);
GO