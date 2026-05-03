-- stdmanager/src/main/resources/db/migration/V23__Insert_Grade_Group_VIII.sql

USE stdmanager_db;
GO

-- Xóa dữ liệu rác (nếu chạy lại script)
DELETE FROM student_summaries;
DELETE FROM student_component_grades;
DELETE FROM grade_components;
DELETE FROM grade_scales;

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN & DỮ LIỆU NỀN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');

-- Danh sách các Lớp học phần HK2_2025_2026
DECLARE @S_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @S_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @S_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

-- ======================================================================
-- 2. INSERT GRADE_SCALES (Thang điểm quy đổi)
-- ======================================================================
IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'A')
BEGIN
    INSERT INTO grade_scales (id, scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order, is_active, created_at, created_by)
    VALUES 
    (NEWID(), 'A',  8.5, 10.0, 'A',  4.0, N'Xuất sắc', 1, 1, 1, GETDATE(), @AdminId),
    (NEWID(), 'B+', 8.0, 8.4,  'B+', 3.5, N'Giỏi',     1, 2, 1, GETDATE(), @AdminId),
    (NEWID(), 'B',  7.0, 7.9,  'B',  3.0, N'Khá giỏi', 1, 3, 1, GETDATE(), @AdminId),
    (NEWID(), 'C+', 6.5, 6.9,  'C+', 2.5, N'Khá',      1, 4, 1, GETDATE(), @AdminId),
    (NEWID(), 'C',  5.5, 6.4,  'C',  2.0, N'Trung bình khá', 1, 5, 1, GETDATE(), @AdminId),
    (NEWID(), 'D+', 5.0, 5.4,  'D+', 1.5, N'Trung bình', 1, 6, 1, GETDATE(), @AdminId),
    (NEWID(), 'D',  4.0, 4.9,  'D',  1.0, N'Trung bình yếu', 1, 7, 1, GETDATE(), @AdminId),
    (NEWID(), 'F',  0.0, 3.9,  'F',  0.0, N'Kém (Không đạt)', 0, 8, 1, GETDATE(), @AdminId);
END

DECLARE @ScaleA UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'A');
DECLARE @ScaleB_Plus UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'B+');
DECLARE @ScaleB UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'B');
DECLARE @ScaleC UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'C');
DECLARE @ScaleD UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'D');
DECLARE @ScaleF UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'F');

-- ======================================================================
-- 3. INSERT GRADE_COMPONENTS (Thành phần điểm cho các lớp học phần)
-- ======================================================================

IF @S_CTDL IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_CTDL, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_CTDL, 'GK', N'Giữa kỳ',    30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1),
    (NEWID(), @S_CTDL, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_AI IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_AI, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI, 'BTL', N'Bài tập lớn', 40.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI, 'CK', N'Cuối kỳ',    50.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_OOP IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_OOP, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP, 'TH', N'Thực hành',  30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

-- ======================================================================
-- 4. INSERT GRADE DETAILS (Điểm chi tiết và Tổng kết) cho toàn bộ 6 SV
-- ======================================================================

-- Hàm nội bộ giả lập: Chèn điểm cho 1 đăng ký
-- Vì T-SQL không hỗ trợ PROCEDURE trong migration dễ dàng, dùng khối lệnh lặp lại

-- SV1: Nguyễn Văn An (Giỏi)
DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250001');
IF @Stu1 IS NOT NULL
BEGIN
    -- Lớp CTDL
    DECLARE @R1_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_CTDL);
    IF @R1_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R1_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL) c
        JOIN (VALUES ('CC', 10.0), ('GK', 9.5), ('CK', 9.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R1_CTDL, 9.25, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp OOP
    DECLARE @R1_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_OOP);
    IF @R1_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R1_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP) c
        JOIN (VALUES ('CC', 9.0), ('TH', 9.0), ('CK', 8.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R1_OOP, 8.7, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV2: Trần Thị Hai (Khá)
DECLARE @Stu2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250002');
IF @Stu2 IS NOT NULL
BEGIN
    DECLARE @R2_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @S_CTDL);
    IF @R2_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R2_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL) c
        JOIN (VALUES ('CC', 8.0), ('GK', 7.5), ('CK', 7.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R2_CTDL, 7.25, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV3: Lê Công Ba (Trung bình)
DECLARE @Stu3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250003');
IF @Stu3 IS NOT NULL
BEGIN
    DECLARE @R3_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @S_CTDL);
    IF @R3_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R3_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL) c
        JOIN (VALUES ('CC', 7.0), ('GK', 6.0), ('CK', 5.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R3_CTDL, 5.8, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV4: Phạm Thị Bốn (Xuất sắc)
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250004');
IF @Stu4 IS NOT NULL
BEGIN
    DECLARE @R4_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @S_AI);
    IF @R4_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R4_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI) c
        JOIN (VALUES ('CC', 10.0), ('BTL', 9.5), ('CK', 9.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R4_AI, 9.55, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV5: Hoàng Văn Năm (Yếu - F)
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250005');
IF @Stu5 IS NOT NULL
BEGIN
    DECLARE @R5_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @S_AI);
    IF @R5_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R5_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI) c
        JOIN (VALUES ('CC', 5.0), ('BTL', 4.0), ('CK', 3.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R5_AI, 3.6, @ScaleF, 'F', 0.0, 'FAIL', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV6: Ngô Thị Sáu (Khá giỏi)
DECLARE @Stu6 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250006');
IF @Stu6 IS NOT NULL
BEGIN
    DECLARE @R6_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @S_AI);
    IF @R6_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R6_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI) c
        JOIN (VALUES ('CC', 9.0), ('BTL', 8.5), ('CK', 8.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R6_AI, 8.3, @ScaleB_Plus, 'B+', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

GO
