-- stdmanager/src/main/resources/db/migration/V17__Insert_Course_Group_IV.sql

USE [stdmanager_db];
GO

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM IV (HỌC PHẦN, CHƯƠNG TRÌNH & NGÀNH)
-- Focus: Khóa 2025 - Ngành Kỹ thuật phần mềm & Trí tuệ nhân tạo
-- ======================================================================

-- Lấy ID của User Admin làm người tạo/cập nhật dữ liệu chuẩn
DECLARE @AdminUserId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');

-- Xóa dữ liệu rác nếu có (Do chạy lại file)
DELETE FROM training_program_courses;
DELETE FROM course_prerequisites;
DELETE FROM training_programs;
DELETE FROM courses;
DELETE FROM majors;

-- ======================================================================
-- 1. INSERT MAJORS (Ngành đào tạo - Chỉ giữ Khoa CNTT)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_KTPM')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_KTPM', N'Kỹ thuật Phần mềm', @Dept_CNTT, N'Chuyên ngành đào tạo kỹ sư phần mềm, lập trình ứng dụng', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_TTNT')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_TTNT', N'Trí tuệ nhân tạo', @Dept_CNTT, N'Chuyên ngành đào tạo AI, Machine Learning', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 2. INSERT TRAINING_PROGRAMS (Chương trình đào tạo khóa 2025)
-- ======================================================================

DECLARE @Major_KTPM UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_KTPM');
DECLARE @Major_TTNT UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_TTNT');

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_KTPM_2025')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_KTPM_2025', N'Chương trình KTPM Khóa 2025', @Major_KTPM, 135, 4.0, N'Chương trình đào tạo kỹ sư KTPM áp dụng từ khóa 2025', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_TTNT_2025')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_TTNT_2025', N'Chương trình Trí tuệ Nhân tạo Khóa 2025', @Major_TTNT, 138, 4.0, N'Chương trình đào tạo kỹ sư TTNT', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 3. INSERT COURSES (Học phần danh mục - cho năm nhất)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1301')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1301', N'Nhập môn Lập trình', 3, 30, 30, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1302')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1302', N'Cấu trúc Dữ liệu & Giải thuật', 4, 45, 30, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1304')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1304', N'Nhập môn Trí tuệ Nhân tạo', 3, 30, 30, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'MAT1001')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'MAT1001', N'Toán rời rạc', 3, 45, 0, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT2203')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT2203', N'Lập trình Hướng đối tượng (Java)', 3, 30, 30, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT2204')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT2204', N'Lập trình Web (Frontend)', 3, 30, 30, @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 4. INSERT COURSE_PREREQUISITES (Tiền điều kiện học phần)
-- ======================================================================

DECLARE @Course_NhapMon UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');
DECLARE @Course_CTDLGT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');
DECLARE @Course_Toan UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MAT1001');
DECLARE @Course_AI UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1304');
DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_WEB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2204');

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_CTDLGT AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_CTDLGT, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_AI AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_AI, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_OOP AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_OOP, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_WEB AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_WEB, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 5. INSERT TRAINING_PROGRAM_COURSES (Gắn học phần vào chương trình)
-- ======================================================================

DECLARE @Prog_KTPM UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_KTPM_2025');
DECLARE @Prog_TTNT UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_TTNT_2025');

-- KTPM Courses (Kỳ 1 và 2)
IF @Prog_KTPM IS NOT NULL
BEGIN
    INSERT INTO training_program_courses
    (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, is_active, created_at, updated_at, created_by, updated_by)
    VALUES 
    (NEWID(), @Prog_KTPM, @Course_NhapMon, 'INT1301', N'Nhập môn Lập trình', 1, 1, 1, 'CK_NGANH', 3, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_KTPM, @Course_Toan, 'MAT1001', N'Toán rời rạc', 1, 1, 1, 'CK_NGANH', 3, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_KTPM, @Course_CTDLGT, 'INT1302', N'Cấu trúc Dữ liệu & Giải thuật', 2, 1, 1, 'CK_NGANH', 4, 1, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_KTPM, @Course_OOP, 'INT2203', N'Lập trình Hướng đối tượng', 2, 1, 1, 'CK_NGANH', 3, 1, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_KTPM, @Course_WEB, 'INT2204', N'Lập trình Web (Frontend)', 2, 1, 1, 'CK_NGANH', 3, 1, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);
END

-- TTNT Courses (Kỳ 1 và 2)
IF @Prog_TTNT IS NOT NULL
BEGIN
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, is_active, created_at, updated_at, created_by, updated_by)
    VALUES 
    (NEWID(), @Prog_TTNT, @Course_NhapMon, 'INT1301', N'Nhập môn Lập trình', 1, 1, 1, 'CK_NGANH', 3, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_TTNT, @Course_Toan, 'MAT1001', N'Toán rời rạc', 1, 1, 1, 'CK_NGANH', 3, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_TTNT, @Course_CTDLGT, 'INT1302', N'Cấu trúc Dữ liệu & Giải thuật', 2, 1, 1, 'CK_NGANH', 4, 1, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId),
    (NEWID(), @Prog_TTNT, @Course_AI, 'INT1304', N'Nhập môn Trí tuệ Nhân tạo', 2, 1, 1, 'CK_NGANH', 3, 1, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);
END
GO