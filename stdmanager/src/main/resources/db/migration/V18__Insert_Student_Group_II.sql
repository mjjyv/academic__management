-- stdmanager/src/main/resources/db/migration/V18__Insert_Student_Group_II.sql

USE stdmanager_db;
GO

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM II (SINH VIÊN / LỚP HÀNH CHÍNH)
-- Focus: Sinh viên khóa 2025 (K25)
-- ======================================================================

DECLARE @GeneratedUsers TABLE (username VARCHAR(50), user_id UNIQUEIDENTIFIER, full_name NVARCHAR(100));
DECLARE @GeneratedClasses TABLE (class_code VARCHAR(20), class_id UNIQUEIDENTIFIER);
DECLARE @GeneratedStudents TABLE (student_code VARCHAR(20), student_id UNIQUEIDENTIFIER, user_id UNIQUEIDENTIFIER);

-- Xóa dữ liệu rác (nếu chạy lại script)
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'sv2025%');
DELETE FROM student_status;
DELETE FROM students;
DELETE FROM users WHERE username LIKE 'sv2025%';
DELETE FROM student_classes;

-- Lấy dữ liệu nền tảng
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @Major_KTPM UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_KTPM');
DECLARE @Major_TTNT UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_TTNT');
DECLARE @Program_KTPM UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_KTPM_2025');
DECLARE @Program_TTNT UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_TTNT_2025');
DECLARE @Advisor_GV001 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM employees WHERE department_id = @Dept_CNTT);

-- ======================================================================
-- 1. INSERT STUDENT_CLASSES (Lớp hành chính K25)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM student_classes WHERE class_code = 'CNTT-K25A')
    INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id, is_active, created_at, updated_at)
    OUTPUT INSERTED.class_code, INSERTED.id INTO @GeneratedClasses
    VALUES (NEWID(), 'CNTT-K25A', N'Kỹ thuật phần mềm K25A', '2025', @Major_KTPM, @Dept_CNTT, @Advisor_GV001, 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM student_classes WHERE class_code = 'CNTT-K25B')
    INSERT INTO student_classes (id, class_code, class_name, course_year, major_id, department_id, advisor_id, is_active, created_at, updated_at)
    OUTPUT INSERTED.class_code, INSERTED.id INTO @GeneratedClasses
    VALUES (NEWID(), 'CNTT-K25B', N'Trí tuệ nhân tạo K25B', '2025', @Major_TTNT, @Dept_CNTT, @Advisor_GV001, 1, GETDATE(), GETDATE());

-- ======================================================================
-- 2. INSERT USERS & STUDENTS (Sinh viên K25)
-- ======================================================================
DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';
DECLARE @Class_K25A UNIQUEIDENTIFIER = (SELECT class_id FROM @GeneratedClasses WHERE class_code = 'CNTT-K25A');
DECLARE @Class_K25B UNIQUEIDENTIFIER = (SELECT class_id FROM @GeneratedClasses WHERE class_code = 'CNTT-K25B');

-- SV1: sv20250001 (KTPM)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250001')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250001', @PassHash, N'Nguyễn Văn Một', 'mot.nv20250001@std.edu.vn', '0911111111', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250001', full_name, '2007-01-01', N'1', @Dept_CNTT, @Major_KTPM, @Program_KTPM, @Class_K25A, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250001';

-- SV2: sv20250002 (KTPM)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250002')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250002', @PassHash, N'Trần Thị Hai', 'hai.tt20250002@std.edu.vn', '0922222222', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250002', full_name, '2007-02-02', N'2', @Dept_CNTT, @Major_KTPM, @Program_KTPM, @Class_K25A, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250002';

-- SV3: sv20250003 (KTPM)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250003')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250003', @PassHash, N'Lê Văn Ba', 'ba.lv20250003@std.edu.vn', '0933333333', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250003', full_name, '2007-03-03', N'1', @Dept_CNTT, @Major_KTPM, @Program_KTPM, @Class_K25A, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250003';

-- SV4: sv20250004 (TTNT)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250004')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250004', @PassHash, N'Phạm Thị Bốn', 'bon.pt20250004@std.edu.vn', '0944444444', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250004', full_name, '2007-04-04', N'2', @Dept_CNTT, @Major_TTNT, @Program_TTNT, @Class_K25B, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250004';

-- SV5: sv20250005 (TTNT)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250005')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250005', @PassHash, N'Hoàng Văn Năm', 'nam.hv20250005@std.edu.vn', '0955555555', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250005', full_name, '2007-05-05', N'1', @Dept_CNTT, @Major_TTNT, @Program_TTNT, @Class_K25B, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250005';

-- SV6: sv20250006 (TTNT)
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sv20250006')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name INTO @GeneratedUsers
    VALUES (NEWID(), 'sv20250006', @PassHash, N'Đặng Thị Sáu', 'sau.dt20250006@std.edu.vn', '0966666666', 1, GETDATE(), GETDATE());

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, department_id, major_id, program_id, class_id, admission_year, is_active, created_at, updated_at)
OUTPUT INSERTED.student_code, INSERTED.id, INSERTED.user_id INTO @GeneratedStudents
SELECT NEWID(), user_id, 'SV20250006', full_name, '2007-06-06', N'2', @Dept_CNTT, @Major_TTNT, @Program_TTNT, @Class_K25B, 2025, 1, GETDATE(), GETDATE()
FROM @GeneratedUsers WHERE username = 'sv20250006';

-- ======================================================================
-- 3. INSERT STUDENT_STATUS (Lịch sử trạng thái sinh viên)
-- ======================================================================

DECLARE @StatusId UNIQUEIDENTIFIER;
DECLARE @CurrentStudentId UNIQUEIDENTIFIER;

-- Gán trạng thái STUDYING cho tất cả các SV vừa tạo từ tháng 9/2025
DECLARE student_cursor CURSOR FOR SELECT student_id FROM @GeneratedStudents;
OPEN student_cursor;
FETCH NEXT FROM student_cursor INTO @CurrentStudentId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @StatusId = NEWID();
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, is_active, created_at, updated_at)
    VALUES (@StatusId, @CurrentStudentId, 'STUDYING', N'Đang học', '2025-09-01', 1, GETDATE(), GETDATE());
    
    UPDATE students SET status_id = @StatusId WHERE id = @CurrentStudentId;

    FETCH NEXT FROM student_cursor INTO @CurrentStudentId;
END
CLOSE student_cursor;
DEALLOCATE student_cursor;

-- Gán role SINHVIEN cho users
INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() 
FROM users u CROSS JOIN roles r 
WHERE u.username LIKE 'sv2025%' AND r.code = 'SINHVIEN';

GO