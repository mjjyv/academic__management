-- stdmanager/src/main/resources/db/migration/V30__Sync_Administrative_Classes_With_Course_Sections.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. DỌN DẸP DỮ LIỆU SAI LỆCH (Xóa các đăng ký chéo lớp)
-- ======================================================================

-- Lấy ID của các lớp hành chính
DECLARE @Class_K25A UNIQUEIDENTIFIER = (SELECT id FROM student_classes WHERE class_code = 'CNTT-K25A');
DECLARE @Class_K25B UNIQUEIDENTIFIER = (SELECT id FROM student_classes WHERE class_code = 'CNTT-K25B');

-- 1.1 Xóa đăng ký của SV lớp K25A vào các lớp học phần đuôi .02
DELETE cr FROM course_registrations cr
JOIN students s ON cr.student_id = s.id
JOIN course_sections cs ON cr.course_section_id = cs.id
WHERE s.class_id = @Class_K25A 
AND (cs.class_code LIKE '%.02' OR cs.class_code LIKE '%.H02');

-- 1.2 Xóa đăng ký của SV lớp K25B vào các lớp học phần đuôi .01
DELETE cr FROM course_registrations cr
JOIN students s ON cr.student_id = s.id
JOIN course_sections cs ON cr.course_section_id = cs.id
WHERE s.class_id = @Class_K25B 
AND (cs.class_code LIKE '%.01' OR cs.class_code LIKE '%.H01');

-- ======================================================================
-- 2. ĐẢM BẢO ĐĂNG KÝ ĐÚNG (SYNC HÀNG LOẠT)
-- ======================================================================

DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @PeriodId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM registration_periods ORDER BY created_at DESC);

-- 2.1 Đăng ký K25A -> .01 (CTDL, AI, OOP)
INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
SELECT 
    NEWID(), 
    s.id, 
    cs.id, 
    @PeriodId, 
    1, 1, 1, GETDATE(), @AdminId
FROM students s
CROSS JOIN course_sections cs
WHERE s.class_id = @Class_K25A
AND cs.class_code IN ('INT1302.01', 'INT1304.01', 'INT2203.01')
AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = s.id AND course_section_id = cs.id);

-- 2.2 Đăng ký K25B -> .02 (CTDL, AI, OOP)
INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
SELECT 
    NEWID(), 
    s.id, 
    cs.id, 
    @PeriodId, 
    1, 1, 1, GETDATE(), @AdminId
FROM students s
CROSS JOIN course_sections cs
WHERE s.class_id = @Class_K25B
AND cs.class_code IN ('INT1302.02', 'INT1304.02', 'INT2203.02')
AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = s.id AND course_section_id = cs.id);

-- ======================================================================
-- 3. ĐỒNG BỘ ĐIỂM (Dựa trên mapping mới)
-- ======================================================================

-- Đảm bảo có Grade Components cho các lớp .02 (Nếu thiếu)
-- Lấy Component ID mẫu từ lớp .01 để clone cho .02
DECLARE @ScaleA UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'A');
DECLARE @ScaleB UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'B');
DECLARE @ScaleC UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'C');
DECLARE @ScaleF UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'F');

-- SV4 (K25B) -> INT1302.02 (B), INT1304.02 (A), INT2203.02 (A)
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250004');
DECLARE @R4_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = (SELECT id FROM course_sections WHERE class_code = 'INT1304.02'));

IF @R4_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @R4_AI)
BEGIN
    INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
    VALUES (NEWID(), @R4_AI, 9.5, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
END

-- SV5 (K25B) -> INT1304.02 (F)
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250005');
DECLARE @R5_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = (SELECT id FROM course_sections WHERE class_code = 'INT1304.02'));

IF @R5_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @R5_AI)
BEGIN
    INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
    VALUES (NEWID(), @R5_AI, 3.5, @ScaleF, 'F', 0.0, 'FAIL', 1, 1, GETDATE(), @AdminId);
END

GO
