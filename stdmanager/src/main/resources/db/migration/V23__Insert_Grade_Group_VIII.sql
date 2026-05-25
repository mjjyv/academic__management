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
-- Nhóm 1 (.01)
DECLARE @S_CTDL1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @S_AI1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @S_OOP1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

-- Nhóm 2 (.02)
DECLARE @S_CTDL2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.02');
DECLARE @S_AI2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.02');
DECLARE @S_OOP2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.02');

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

-- Cấu hình điểm cho Nhóm 1 (.01)
IF @S_CTDL1 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_CTDL1, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_CTDL1, 'GK', N'Giữa kỳ',    30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1),
    (NEWID(), @S_CTDL1, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_AI1 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_AI1, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI1, 'BTL', N'Bài tập lớn', 40.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI1, 'CK', N'Cuối kỳ',    50.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_OOP1 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_OOP1, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP1, 'TH', N'Thực hành',  30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP1, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

-- Cấu hình điểm cho Nhóm 2 (.02) - Giả sử cấu trúc tương tự
IF @S_CTDL2 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_CTDL2, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_CTDL2, 'GK', N'Giữa kỳ',    30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1),
    (NEWID(), @S_CTDL2, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_AI2 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_AI2, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI2, 'BTL', N'Bài tập lớn', 40.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_AI2, 'CK', N'Cuối kỳ',    50.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

IF @S_OOP2 IS NOT NULL
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by, allow_retake)
    VALUES 
    (NEWID(), @S_OOP2, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP2, 'TH', N'Thực hành',  30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 0),
    (NEWID(), @S_OOP2, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId, 1);
END

-- ======================================================================
-- 4. INSERT GRADE DETAILS (Điểm chi tiết và Tổng kết)
-- ======================================================================
-- YÊU CẦU MỚI:
-- SINHVIEN 1, 2, 3 nhận điểm *01 (Tương ứng với các lớp .01)
-- SINHVIEN 4, 5, 6 nhận điểm *02 (Tương ứng với các lớp .02)

-- SV1: Nguyễn Văn Một (Học lớp .01)
DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250001');
IF @Stu1 IS NOT NULL
BEGIN
    -- Lớp CTDL1
    DECLARE @R1_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_CTDL1);
    IF @R1_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R1_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL1) c
        JOIN (VALUES ('CC', 10.0), ('GK', 9.5), ('CK', 9.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R1_CTDL, 9.25, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp OOP1
    DECLARE @R1_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_OOP1);
    IF @R1_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R1_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP1) c
        JOIN (VALUES ('CC', 9.0), ('TH', 9.0), ('CK', 8.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R1_OOP, 8.7, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp AI1
    DECLARE @R1_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_AI1);
    IF @R1_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R1_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI1) c
        JOIN (VALUES ('CC', 8.0), ('BTL', 8.0), ('CK', 8.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R1_AI, 8.0, @ScaleB, 'B', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV2: Trần Thị Hai (Học lớp .01)
DECLARE @Stu2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250002');
IF @Stu2 IS NOT NULL
BEGIN
    DECLARE @R2_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @S_CTDL1);
    IF @R2_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R2_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL1) c
        JOIN (VALUES ('CC', 8.0), ('GK', 7.5), ('CK', 7.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R2_CTDL, 7.25, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp OOP1
    DECLARE @R2_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @S_OOP1);
    IF @R2_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R2_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP1) c
        JOIN (VALUES ('CC', 7.0), ('TH', 8.0), ('CK', 7.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R2_OOP, 7.5, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp AI1
    DECLARE @R2_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @S_AI1);
    IF @R2_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R2_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI1) c
        JOIN (VALUES ('CC', 7.0), ('BTL', 7.0), ('CK', 8.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R2_AI, 7.85, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV3: Lê Văn Ba (Học lớp .01)
DECLARE @Stu3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250003');
IF @Stu3 IS NOT NULL
BEGIN
    DECLARE @R3_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @S_CTDL1);
    IF @R3_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R3_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL1) c
        JOIN (VALUES ('CC', 7.0), ('GK', 6.0), ('CK', 5.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R3_CTDL, 5.8, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp OOP1
    DECLARE @R3_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @S_OOP1);
    IF @R3_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R3_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP1) c
        JOIN (VALUES ('CC', 6.0), ('TH', 5.5), ('CK', 5.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R3_OOP, 5.5, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp AI1
    DECLARE @R3_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @S_AI1);
    IF @R3_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R3_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI1) c
        JOIN (VALUES ('CC', 9.0), ('BTL', 8.0), ('CK', 8.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R3_AI, 8.55, @ScaleB, 'B', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV4: Phạm Thị Bốn (Học lớp .02 - Thay đổi từ .01 sang .02 theo yêu cầu)
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250004');
IF @Stu4 IS NOT NULL
BEGIN
    -- Lớp AI2 (Thay vì AI1)
    DECLARE @R4_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @S_AI2);
    IF @R4_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R4_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI2) c
        JOIN (VALUES ('CC', 10.0), ('BTL', 9.5), ('CK', 9.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R4_AI, 9.55, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp CTDL2 (Thay vì CTDL1)
    DECLARE @R4_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @S_CTDL2);
    IF @R4_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R4_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL2) c
        JOIN (VALUES ('CC', 8.0), ('GK', 7.5), ('CK', 7.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R4_CTDL, 7.35, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp OOP2
    DECLARE @R4_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @S_OOP2);
    IF @R4_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R4_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP2) c
        JOIN (VALUES ('CC', 6.0), ('TH', 6.0), ('CK', 6.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R4_OOP, 6.15, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV5: Hoàng Văn Năm (Học lớp .02 - Thay đổi từ .01 sang .02 theo yêu cầu)
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250005');
IF @Stu5 IS NOT NULL
BEGIN
    -- Lớp AI2
    DECLARE @R5_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @S_AI2);
    IF @R5_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R5_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI2) c
        JOIN (VALUES ('CC', 5.0), ('BTL', 4.0), ('CK', 3.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R5_AI, 3.6, @ScaleF, 'F', 0.0, 'FAIL', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp CTDL2
    DECLARE @R5_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @S_CTDL2);
    IF @R5_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R5_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL2) c
        JOIN (VALUES ('CC', 6.0), ('GK', 4.5), ('CK', 5.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R5_CTDL, 5.1, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp OOP2
    DECLARE @R5_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @S_OOP2);
    IF @R5_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R5_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP2) c
        JOIN (VALUES ('CC', 5.0), ('TH', 5.0), ('CK', 5.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R5_OOP, 5.0, @ScaleC, 'C', 2.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- SV6: Ngô Thị Sáu (Học lớp .02 - Thay đổi từ .01 sang .02 theo yêu cầu)
DECLARE @Stu6 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250006');
IF @Stu6 IS NOT NULL
BEGIN
    DECLARE @R6_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @S_AI2);
    IF @R6_AI IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R6_AI, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_AI2) c
        JOIN (VALUES ('CC', 9.0), ('BTL', 8.5), ('CK', 8.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R6_AI, 8.3, @ScaleB_Plus, 'B+', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
    -- Lớp CTDL2
    DECLARE @R6_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @S_CTDL2);
    IF @R6_CTDL IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R6_CTDL, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL2) c
        JOIN (VALUES ('CC', 9.5), ('GK', 8.5), ('CK', 8.0)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R6_CTDL, 8.55, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp OOP2
    DECLARE @R6_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @S_OOP2);
    IF @R6_OOP IS NOT NULL
    BEGIN
        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
        SELECT NEWID(), @R6_OOP, id, val, 0, 1, 1, GETDATE(), @AdminId
        FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_OOP2) c
        JOIN (VALUES ('CC', 8.0), ('TH', 8.0), ('CK', 8.5)) v(code, val) ON c.component_code = v.code;
        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @R6_OOP, 8.25, @ScaleB_Plus, 'B+', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

GO