-- stdmanager/src/main/resources/db/migration/V20__Insert_Semester_Group_V.sql

USE [stdmanager_db];
GO

-- Xóa dữ liệu cũ nếu chạy lại script
DELETE FROM lecturer_course_sections;
DELETE FROM student_course_sections;
DELETE FROM course_sections;
DELETE FROM semesters;

-- ======================================================================
-- 1. INSERT SEMESTERS (Học kỳ)
-- ======================================================================

-- Năm học 2025-2026
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2025_2026')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK1_2025_2026', N'Học kỳ 1 năm học 2025-2026', '2025-2026', '2025-09-04', '2026-01-15', 1);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2025_2026')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK2_2025_2026', N'Học kỳ 2 năm học 2025-2026', '2025-2026', '2026-02-19', '2026-06-30', 1);

GO

-- ======================================================================
-- 2. INSERT COURSE SECTIONS (Lớp học phần cho HK2_2025_2026)
-- ======================================================================

-- Đảm bảo có dữ liệu Tòa nhà & Phòng học
IF NOT EXISTS (SELECT 1 FROM buildings WHERE building_code = 'TOA_T3')
    INSERT INTO buildings (id, building_code, building_name, is_active) VALUES (NEWID(), 'TOA_T3', N'Tòa nhà T3', 1);
IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_code = 'PHONG_LAB1')
    INSERT INTO rooms (id, room_code, room_name, building_id, is_active) VALUES (NEWID(), 'PHONG_LAB1', N'Phòng Lab 1', (SELECT id FROM buildings WHERE building_code = 'TOA_T3'), 1);

DECLARE @Semester_HK2_2526 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');
DECLARE @Course_CTDL UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');
DECLARE @Course_AI UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1304');
DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');

IF @Semester_HK2_2526 IS NOT NULL
BEGIN
    -- Lớp Cấu trúc dữ liệu
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT1302.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT1302.01', @Course_CTDL, @Semester_HK2_2526, '2025-2026', 40, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'));

    -- Lớp Nhập môn AI
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT1304.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT1304.01', @Course_AI, @Semester_HK2_2526, '2025-2026', 40, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'));

    -- Lớp Lập trình Hướng đối tượng
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT2203.01', @Course_OOP, @Semester_HK2_2526, '2025-2026', 40, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'));
END

-- ======================================================================
-- 3. INSERT LECTURER ASSIGNMENTS (Phân công giảng viên)
-- ======================================================================

DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @GV_Huong UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');
DECLARE @S_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @S_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @S_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

IF @GV_Kien IS NOT NULL
BEGIN
    IF @S_CTDL IS NOT NULL
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @GV_Kien, @S_CTDL, N'Giảng viên chính', 1);

    IF @S_AI IS NOT NULL
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @GV_Kien, @S_AI, N'Giảng viên chính', 1);
END

IF @GV_Huong IS NOT NULL
BEGIN
    IF @S_OOP IS NOT NULL
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @GV_Huong, @S_OOP, N'Giảng viên chính', 1);
END

GO
