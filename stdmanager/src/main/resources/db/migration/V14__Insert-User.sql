USE stdmanager_db;
GO

-- 1. XÓA DỮ LIỆU CŨ ĐỂ TRÁNH TRÙNG LẶP (NẾU CẦN)
DELETE FROM user_roles;
DELETE FROM users;
DELETE FROM roles;
GO

-- 2. CHÈN CÁC VAI TRÒ HỆ THỐNG 
INSERT INTO roles (id, code, name, description, is_system, is_active)
VALUES 
(NEWID(), 'ADMIN', N'Quản trị viên', N'Toàn quyền quản trị hệ thống', 1, 1),
(NEWID(), 'GIAOVU', N'Giáo vụ', N'Quản lý đào tạo và sinh viên', 1, 1),
(NEWID(), 'GIANGVIEN', N'Giảng viên', N'Quản lý lớp học và nhập điểm', 1, 1),
(NEWID(), 'SINHVIEN', N'Sinh viên', N'Đăng ký học phần và xem kết quả', 1, 1);
GO

-- 3. KHỞI TẠO TÀI KHOẢN MẪU (Password mặc định: Admin123!) [cite: 2, 3, 136]
-- Lưu ý: password_hash dưới đây tương ứng với BCrypt $2a$10$...
DECLARE @AdminId UNIQUEIDENTIFIER = NEWID();
DECLARE @GiaoVuId UNIQUEIDENTIFIER = NEWID();
DECLARE @GiangVienId UNIQUEIDENTIFIER = NEWID();
DECLARE @SinhVienId UNIQUEIDENTIFIER = NEWID();

INSERT INTO users (id, username, password_hash, full_name, email, is_active)
VALUES 
(@AdminId, 'admin', '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li', N'Nguyễn Quản Trị', 'admin@uda.edu.vn', 1),
(@GiaoVuId, 'giaovu01', '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li', N'Trần Thị Giáo Vụ', 'giaovu@uda.edu.vn', 1),
(@GiangVienId, 'gv_hoatv', '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li', N'Thầy Trương Văn Hòa', 'hoatv@uda.edu.vn', 1),
(@SinhVienId, 'sv2026001', '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li', N'Lê Văn Sinh Viên', 'sv2026@uda.edu.vn', 1);

-- 4. GÁN VAI TRÒ CHO NGƯỜI DÙNG [cite: 3, 138]
INSERT INTO user_roles (user_id, role_id, is_active)
SELECT @AdminId, id, 1 FROM roles WHERE code = 'ADMIN';

INSERT INTO user_roles (user_id, role_id, is_active)
SELECT @GiaoVuId, id, 1 FROM roles WHERE code = 'GIAOVU';

INSERT INTO user_roles (user_id, role_id, is_active)
SELECT @GiangVienId, id, 1 FROM roles WHERE code = 'GIANGVIEN';

INSERT INTO user_roles (user_id, role_id, is_active)
SELECT @SinhVienId, id, 1 FROM roles WHERE code = 'SINHVIEN';
GO

-- 5. CHÈN QUYỀN MẪU CHO MODULE [cite: 2, 4, 139]
INSERT INTO permissions (code, name, module, description)
VALUES 
('USER_VIEW', N'Xem người dùng', 'AUTH', N'Quyền xem danh sách tài khoản'),
('STUDENT_EDIT', N'Sửa sinh viên', 'STUDENT', N'Quyền cập nhật thông tin sinh viên'),
('GRADE_INPUT', N'Nhập điểm', 'GRADE', N'Quyền nhập điểm cho giảng viên'),
('COURSE_REG', N'Đăng ký môn', 'REGISTRATION', N'Quyền đăng ký học phần');
GO