USE stdmanager_db;
GO

-- ======================================================================
-- 1. LẤY THÔNG TIN CƠ SỞ (DATA SEEDING)
-- ======================================================================

-- Lấy ID của vai trò Sinh viên
DECLARE @RoleStudentId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'SINHVIEN');

-- Lấy thông tin Khoa và Ngành (Giả định đã chạy script Nhóm III và IV)
-- Nếu chưa có, script này sẽ tạo tạm để không bị lỗi khóa ngoại
IF NOT EXISTS (SELECT 1 FROM departments WHERE code = 'CNTT')
    INSERT INTO departments (id, code, name) VALUES (NEWID(), 'CNTT', N'Khoa Công nghệ thông tin');
DECLARE @DeptId UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KTPM')
    INSERT INTO majors (id, department_id, major_code, major_name) VALUES (NEWID(), @DeptId, 'KTPM', N'Kỹ thuật phần mềm');
DECLARE @MajorId UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'KTPM');

-- Lấy ID Cố vấn học tập (Giảng viên mẫu đã tạo ở V14)
DECLARE @AdvisorId UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'gv_hoatv');

-- ======================================================================
-- 2. KHỞI TẠO LỚP HÀNH CHÍNH (student_classes)
-- ======================================================================
DECLARE @ClassId UNIQUEIDENTIFIER = NEWID();

INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id)
VALUES (@ClassId, 'CNTT-K22A', N'Lớp Công nghệ thông tin K22A', '2022', @MajorId, @DeptId, @AdvisorId);

-- ======================================================================
-- 3. KHỞI TẠO SINH VIÊN MẪU (Lặp 3 sinh viên)
-- ======================================================================
-- Mật khẩu chung: $2a$12$EAtHE.br2wezN804QlF4bufDIgWvyGn6o0ifLuJ6zM5kji7sbg7Ey
DECLARE @PassHash NVARCHAR(255) = '$2a$12$EAtHE.br2wezN804QlF4bufDIgWvyGn6o0ifLuJ6zM5kji7sbg7Ey';

-- Sinh viên 1
DECLARE @UserId1 UNIQUEIDENTIFIER = NEWID();
DECLARE @StudentId1 UNIQUEIDENTIFIER = NEWID();
INSERT INTO users (id, username, password_hash, full_name, email, is_active)
VALUES (@UserId1, 'SV2026004', @PassHash, N'Nguyễn Văn An', 'an.nv@gmail.com', 1);

INSERT INTO user_roles (user_id, role_id) VALUES (@UserId1, @RoleStudentId);

INSERT INTO students (id, user_id, student_code, full_name, gender, date_of_birth, class_id, department_id, major_id, admission_year)
VALUES (@StudentId1, @UserId1, 'SV2026004', N'Nguyễn Văn An', N'Nam', '2004-05-15', @ClassId, @DeptId, @MajorId, 2022);

INSERT INTO student_status (student_id, status_code, status_name, start_date, description)
VALUES (@StudentId1, 'STUDYING', N'Đang học', GETDATE(), N'Nhập học chính thức');

-- Sinh viên 2
DECLARE @UserId2 UNIQUEIDENTIFIER = NEWID();
DECLARE @StudentId2 UNIQUEIDENTIFIER = NEWID();
INSERT INTO users (id, username, password_hash, full_name, email, is_active)
VALUES (@UserId2, 'SV2026002', @PassHash, N'Trần Thị Bình', 'binh.tt@gmail.com', 1);

INSERT INTO user_roles (user_id, role_id) VALUES (@UserId2, @RoleStudentId);

INSERT INTO students (id, user_id, student_code, full_name, gender, date_of_birth, class_id, department_id, major_id, admission_year)
VALUES (@StudentId2, @UserId2, 'SV2026002', N'Trần Thị Bình', N'Nữ', '2004-10-20', @ClassId, @DeptId, @MajorId, 2022);

INSERT INTO student_status (student_id, status_code, status_name, start_date, description)
VALUES (@StudentId2, 'STUDYING', N'Đang học', GETDATE(), N'Nhập học chính thức');

-- Sinh viên 3 (Trạng thái bảo lưu)
DECLARE @UserId3 UNIQUEIDENTIFIER = NEWID();
DECLARE @StudentId3 UNIQUEIDENTIFIER = NEWID();
INSERT INTO users (id, username, password_hash, full_name, email, is_active)
VALUES (@UserId3, 'SV2026003', @PassHash, N'Lê Hoàng Nam', 'nam.lh@gmail.com', 1);

INSERT INTO user_roles (user_id, role_id) VALUES (@UserId3, @RoleStudentId);

INSERT INTO students (id, user_id, student_code, full_name, gender, date_of_birth, class_id, department_id, major_id, admission_year)
VALUES (@StudentId3, @UserId3, 'SV2026003', N'Lê Hoàng Nam', N'Nam', '2004-01-10', @ClassId, @DeptId, @MajorId, 2022);

INSERT INTO student_status (student_id, status_code, status_name, start_date, description)
VALUES (@StudentId3, 'RESERVED', N'Bảo lưu', GETDATE(), N'Nghỉ học kỳ 1 do việc gia đình');

GO

-- ======================================================================
-- 4. KIỂM TRA KẾT QUẢ
-- ======================================================================
SELECT s.student_code, s.full_name, u.username, r.code as role_code, sc.class_code, st.status_name
FROM students s
JOIN users u ON s.user_id = u.id
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN student_classes sc ON s.class_id = sc.id
JOIN student_status st ON s.id = st.student_id
WHERE s.is_active = 1;