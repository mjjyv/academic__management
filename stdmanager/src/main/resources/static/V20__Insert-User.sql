USE stdmanager_db;
GO

-- Khai báo biến mật khẩu chung (Admin123!)
DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

-- 1. Tạo biến lưu ID để ánh xạ chính xác
DECLARE @RoleId_Admin UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleId_GiaoVu UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleId_GiangVien UNIQUEIDENTIFIER = NEWID();
DECLARE @RoleId_SinhVien UNIQUEIDENTIFIER = NEWID();

DECLARE @UserId_Admin UNIQUEIDENTIFIER = NEWID();
DECLARE @UserId_GiaoVu UNIQUEIDENTIFIER = NEWID();
DECLARE @UserId_GiangVien UNIQUEIDENTIFIER = NEWID();
DECLARE @UserId_SinhVien UNIQUEIDENTIFIER = NEWID();

-- 2. Chèn dữ liệu vào bảng roles
INSERT INTO roles (id, code, name, description, is_system, is_active)
VALUES 
(@RoleId_Admin, 'ADMIN', N'Quản trị viên', N'Toàn quyền quản trị hệ thống', 1, 1),
(@RoleId_GiaoVu, 'GIAOVU', N'Giáo vụ', N'Quản lý đào tạo và hồ sơ sinh viên', 1, 1),
(@RoleId_GiangVien, 'GIANGVIEN', N'Giảng viên', N'Quản lý lớp học và nhập điểm', 1, 1),
(@RoleId_SinhVien, 'SINHVIEN', N'Sinh viên', N'Đăng ký học phần và xem kết quả', 1, 1);

-- 3. Chèn dữ liệu vào bảng users
INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active)
VALUES 
(@UserId_Admin, 'admin', @PassHash, N'Nguyễn Quản Trị', 'admin@uda.edu.vn', '0905123456', 1),
(@UserId_GiaoVu, 'giaovu01', @PassHash, N'Trần Thị Giáo Vụ', 'giaovu@uda.edu.vn', '0905654321', 1),
(@UserId_GiangVien, 'gv_hoatv', @PassHash, N'Trương Văn Hòa', 'hoatv@uda.edu.vn', '0905111222', 1),
(@UserId_SinhVien, 'sv2026001', @PassHash, N'Lê Văn Sinh Viên', 'sv2026@uda.edu.vn', '0905333444', 1);

-- 4. Gán vai trò trong bảng user_roles
INSERT INTO user_roles (user_id, role_id, is_active)
VALUES 
(@UserId_Admin, @RoleId_Admin, 1),
(@UserId_GiaoVu, @RoleId_GiaoVu, 1),
(@UserId_GiangVien, @RoleId_GiangVien, 1),
(@UserId_SinhVien, @RoleId_SinhVien, 1);

-- 5. Khởi tạo quyền mẫu (Permissions)
INSERT INTO permissions (code, name, module, description)
VALUES 
('AUTH_ALL', N'Toàn quyền hệ thống', 'AUTH', N'Truy cập mọi chức năng quản trị'),
('STUDENT_MANAGE', N'Quản lý sinh viên', 'STUDENT', N'Xem và sửa hồ sơ sinh viên'),
('GRADE_INPUT', N'Nhập điểm', 'GRADE', N'Quyền nhập điểm cho lớp phụ trách'),
('COURSE_REG', N'Đăng ký môn', 'REGISTRATION', N'Quyền đăng ký học phần');

-- 6. Gán quyền cho vai trò (Role Permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT @RoleId_Admin, id FROM permissions; -- Admin lấy hết các quyền vừa tạo
GO