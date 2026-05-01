-- stdmanager/src/main/resources/db/migration/V20__Insert_Semester_Group_V.sql

USE [stdmanager_db];
GO

-- ======================================================================
-- 1. INSERT SEMESTERS (Học kỳ)
-- ======================================================================

-- Năm học 2023-2024 (Đã kết thúc)
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2023_2024')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK1_2023_2024', N'Học kỳ 1 năm học 2023-2024', '2023-2024', '2023-09-04', '2024-01-15', 1);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2023_2024')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK2_2023_2024', N'Học kỳ 2 năm học 2023-2024', '2023-2024', '2024-02-19', '2024-06-30', 1);

-- Năm học 2024-2025 (Hiện tại & Kế hoạch)
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2024_2025')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK1_2024_2025', N'Học kỳ 1 năm học 2024-2025', '2024-2025', '2024-09-02', '2025-01-19', 1);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2024_2025')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK2_2024_2025', N'Học kỳ 2 năm học 2024-2025', '2024-2025', '2025-02-17', '2025-06-29', 1);

GO

-- ======================================================================
-- 2. INSERT COURSE SECTIONS (Lớp học phần)
-- ======================================================================

DECLARE @Semester_HK1_2425 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2024_2025');
DECLARE @Course_Java UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
DECLARE @Course_Logic UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');

-- Lớp học phần cho HK1_2024_2025
IF @Semester_HK1_2425 IS NOT NULL
BEGIN
    -- Lớp Java OOP
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT2203.01', @Course_Java, @Semester_HK1_2425, '2024-2025', 40, 10, 'open', 'theory');

    -- Lớp Web Spring Boot
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT3305.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT3305.01', @Course_Web, @Semester_HK1_2425, '2024-2025', 35, 10, 'open', 'theory');

    -- Lớp Nhập môn lập trình
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT1301.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT1301.01', @Course_Logic, @Semester_HK1_2425, '2024-2025', 50, 15, 'open', 'theory');
END
GO

-- ======================================================================
-- 3. INSERT LECTURER ASSIGNMENTS (Phân công giảng viên)
-- ======================================================================

DECLARE @Lecturer1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM employees); -- Lấy giảng viên đầu tiên làm mẫu
DECLARE @Section_Java UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
DECLARE @Section_Web UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.01');

IF @Lecturer1 IS NOT NULL
BEGIN
    IF @Section_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_Java)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @Lecturer1, @Section_Java, N'Giảng viên chính', 1);

    IF @Section_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_Web)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @Lecturer1, @Section_Web, N'Giảng viên chính', 1);
END
GO

-- ======================================================================
-- 4. INSERT STUDENT ENROLLMENTS (Đăng ký học phần)
-- ======================================================================

DECLARE @Student1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM students); -- Lấy sinh viên đầu tiên làm mẫu
DECLARE @Section_Java UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
DECLARE @Section_Web UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.01');

IF @Student1 IS NOT NULL
BEGIN
    IF @Section_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student1 AND course_section_id = @Section_Java)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @Student1, @Section_Java, 'active', 1);

    IF @Section_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student1 AND course_section_id = @Section_Web)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @Student1, @Section_Web, 'active', 1);
END
GO