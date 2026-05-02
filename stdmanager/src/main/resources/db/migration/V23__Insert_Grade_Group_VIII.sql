-- stdmanager/src/main/resources/db/migration/V23__Insert_Grade_Group_VIII.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN & DỮ LIỆU NỀN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');

-- Danh sách các Lớp học phần
DECLARE @S_Web UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.01');
DECLARE @S_Logic UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1301.01');
DECLARE @S_Java UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
DECLARE @S_DB UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3306.01');
DECLARE @S_Mobile UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT4309.01');
DECLARE @S_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT4310.01');

-- Danh sách các Sinh viên
DECLARE @Stu_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200001');
DECLARE @Stu_Hanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210002');
DECLARE @Stu_Khanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210003');
DECLARE @Stu_Phuong UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200004');
DECLARE @Stu_Nam UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200005');
DECLARE @Stu_Anh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200006');

DECLARE @AnyPeriodId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM registration_periods ORDER BY start_time DESC);

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
DECLARE @ScaleC_Plus UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'C+');
DECLARE @ScaleC UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'C');
DECLARE @ScaleD UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'D');
DECLARE @ScaleF UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'F');

-- ======================================================================
-- 3. INSERT GRADE_COMPONENTS (Thành phần điểm cho các lớp học phần)
-- ======================================================================

-- 3.1. Lớp Web (INT3305.01)
IF @S_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM grade_components WHERE course_section_id = @S_Web)
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by)
    VALUES 
    (NEWID(), @S_Web, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Web, 'GK', N'Giữa kỳ',    30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Web, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId);
END

-- 3.2. Lớp Logic (INT1301.01)
IF @S_Logic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM grade_components WHERE course_section_id = @S_Logic)
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, allow_retake, input_order, is_active, created_at, created_by)
    VALUES 
    (NEWID(), @S_Logic, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Logic, 'BT', N'Bài tập',    20.00, 0.0, 10.0, 1, 0, 2, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Logic, 'GK', N'Giữa kỳ',    20.00, 0.0, 10.0, 1, 1, 3, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Logic, 'CK', N'Cuối kỳ',    50.00, 0.0, 10.0, 1, 1, 4, 1, GETDATE(), @AdminId);
END

-- 3.3. Lớp Java (INT2203.01)
IF @S_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM grade_components WHERE course_section_id = @S_Java)
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by)
    VALUES 
    (NEWID(), @S_Java, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Java, 'TH', N'Thực hành',  30.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_Java, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId);
END

-- 3.4. Lớp AI (INT4310.01)
IF @S_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM grade_components WHERE course_section_id = @S_AI)
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, is_active, created_at, created_by)
    VALUES 
    (NEWID(), @S_AI, 'GK', N'Kiểm tra giữa kỳ', 40.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId),
    (NEWID(), @S_AI, 'CK', N'Đồ án cuối kỳ',    60.00, 0.0, 10.0, 1, 1, GETDATE(), @AdminId);
END

-- ======================================================================
-- 4. INSERT GRADE DETAILS (Điểm chi tiết và Tổng kết)
-- ======================================================================

-- Hàm giả lập Đăng ký nếu chưa có (Để đảm bảo script chạy mượt)
-- (Trong thực tế V22 đã tạo nhiều, nhưng ở đây ta check lại cho chắc)

-- 4.1. PHẠM MINH ĐỨC (SV20200001) - Xuất sắc môn Web & Java
IF @Stu_Duc IS NOT NULL
BEGIN
    -- Lớp Web
    DECLARE @Reg_Duc_Web UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Duc AND course_section_id = @S_Web);
    IF @Reg_Duc_Web IS NULL AND @S_Web IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Duc_Web = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Duc_Web, @Stu_Duc, @S_Web, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Duc_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Duc_Web)
    BEGIN
        DECLARE @Comp_Web_CC UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'CC');
        DECLARE @Comp_Web_GK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'GK');
        DECLARE @Comp_Web_CK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, graded_at, graded_by, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Duc_Web, @Comp_Web_CC, 10.0, 1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Duc_Web, @Comp_Web_GK, 9.5,  1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Duc_Web, @Comp_Web_CK, 9.0,  1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Duc_Web, 9.25, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END

    -- Lớp Java
    DECLARE @Reg_Duc_Java UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Duc AND course_section_id = @S_Java);
    IF @Reg_Duc_Java IS NULL AND @S_Java IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Duc_Java = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Duc_Java, @Stu_Duc, @S_Java, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Duc_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Duc_Java)
    BEGIN
        DECLARE @Comp_Java_CC UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'CC');
        DECLARE @Comp_Java_TH UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'TH');
        DECLARE @Comp_Java_CK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, graded_at, graded_by, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Duc_Java, @Comp_Java_CC, 9.0, 1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Duc_Java, @Comp_Java_TH, 9.0, 1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Duc_Java, @Comp_Java_CK, 8.5, 1, GETDATE(), @AdminId, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Duc_Java, 8.7, @ScaleA, 'A', 4.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- 4.2. NGUYỄN THỊ HẠNH (SV20210002) - Cải thiện môn Logic (Fail -> Pass)
IF @Stu_Hanh IS NOT NULL
BEGIN
    -- 1. Bản ghi Cũ (Đã trượt)
    DECLARE @Old_Reg_Hanh UNIQUEIDENTIFIER = NEWID();
    IF @S_Logic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries ss JOIN course_registrations cr ON ss.registration_id = cr.id WHERE cr.student_id = @Stu_Hanh AND cr.course_section_id = @S_Logic AND ss.result = 'FAIL')
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Old_Reg_Hanh, @Stu_Hanh, @S_Logic, @AnyPeriodId, 1, '2023-08-15', 1, 1, 1, '2023-08-15', @AdminId);

        DECLARE @Comp_Logic_CC UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CC');
        DECLARE @Comp_Logic_BT UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'BT');
        DECLARE @Comp_Logic_GK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'GK');
        DECLARE @Comp_Logic_CK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Old_Reg_Hanh, @Comp_Logic_CC, 5.0, 1, 1, '2023-11-15', @AdminId),
        (NEWID(), @Old_Reg_Hanh, @Comp_Logic_BT, 4.0, 1, 1, '2023-11-20', @AdminId),
        (NEWID(), @Old_Reg_Hanh, @Comp_Logic_GK, 3.0, 1, 1, '2023-11-25', @AdminId),
        (NEWID(), @Old_Reg_Hanh, @Comp_Logic_CK, 2.0, 1, 1, '2023-12-28', @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Old_Reg_Hanh, 2.9, @ScaleF, 'F', 0.0, 'FAIL', 1, 1, '2023-12-30', @AdminId);
    END

    -- 2. Bản ghi Mới (Học lại và Đạt)
    DECLARE @New_Reg_Hanh UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Hanh AND course_section_id = @S_Logic AND registration_type = 2);
    IF @New_Reg_Hanh IS NULL AND @S_Logic IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @New_Reg_Hanh = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@New_Reg_Hanh, @Stu_Hanh, @S_Logic, @AnyPeriodId, 2, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @New_Reg_Hanh IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @New_Reg_Hanh)
    BEGIN
        SET @Comp_Logic_CC = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CC');
        SET @Comp_Logic_BT = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'BT');
        SET @Comp_Logic_GK = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'GK');
        SET @Comp_Logic_CK = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @New_Reg_Hanh, @Comp_Logic_CC, 8.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @New_Reg_Hanh, @Comp_Logic_BT, 7.5, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @New_Reg_Hanh, @Comp_Logic_GK, 7.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @New_Reg_Hanh, @Comp_Logic_CK, 6.5, 1, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @New_Reg_Hanh, 6.95, @ScaleC_Plus, 'C+', 2.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- 4.3. TRẦN QUỐC KHÁNH (SV20210003) - Điểm Khá môn AI
IF @Stu_Khanh IS NOT NULL
BEGIN
    DECLARE @Reg_Khanh_AI UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Khanh AND course_section_id = @S_AI);
    IF @Reg_Khanh_AI IS NULL AND @S_AI IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Khanh_AI = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Khanh_AI, @Stu_Khanh, @S_AI, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Khanh_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Khanh_AI)
    BEGIN
        DECLARE @Comp_AI_GK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_AI AND component_code = 'GK');
        DECLARE @Comp_AI_CK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @S_AI AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Khanh_AI, @Comp_AI_GK, 7.5, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Khanh_AI, @Comp_AI_CK, 8.0, 1, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Khanh_AI, 7.8, @ScaleB, 'B', 3.0, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- 4.4. LÊ THU PHƯƠNG (SV20200004) - Điểm Giỏi môn Web & DB
IF @Stu_Phuong IS NOT NULL
BEGIN
    -- Lớp Web
    DECLARE @Reg_Phuong_Web UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Phuong AND course_section_id = @S_Web);
    IF @Reg_Phuong_Web IS NULL AND @S_Web IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Phuong_Web = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Phuong_Web, @Stu_Phuong, @S_Web, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Phuong_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Phuong_Web)
    BEGIN
        SET @Comp_Web_CC = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'CC');
        SET @Comp_Web_GK = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'GK');
        SET @Comp_Web_CK = (SELECT id FROM grade_components WHERE course_section_id = @S_Web AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Phuong_Web, @Comp_Web_CC, 9.5, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Phuong_Web, @Comp_Web_GK, 8.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Phuong_Web, @Comp_Web_CK, 8.5, 1, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Phuong_Web, 8.45, @ScaleB_Plus, 'B+', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- 4.5. ĐỖ HOÀNG NAM (SV20200005) - Điểm Trung bình môn Logic
IF @Stu_Nam IS NOT NULL
BEGIN
    DECLARE @Reg_Nam_Logic UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Nam AND course_section_id = @S_Logic);
    IF @Reg_Nam_Logic IS NULL AND @S_Logic IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Nam_Logic = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Nam_Logic, @Stu_Nam, @S_Logic, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Nam_Logic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Nam_Logic)
    BEGIN
        SET @Comp_Logic_CC = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CC');
        SET @Comp_Logic_BT = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'BT');
        SET @Comp_Logic_GK = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'GK');
        SET @Comp_Logic_CK = (SELECT id FROM grade_components WHERE course_section_id = @S_Logic AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Nam_Logic, @Comp_Logic_CC, 7.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Nam_Logic, @Comp_Logic_BT, 6.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Nam_Logic, @Comp_Logic_GK, 5.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Nam_Logic, @Comp_Logic_CK, 4.5, 1, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Nam_Logic, 5.15, @ScaleD, 'D+', 1.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- 4.6. VŨ THỊ MAI ANH (SV20200006) - Điểm Giỏi môn Java
IF @Stu_Anh IS NOT NULL
BEGIN
    DECLARE @Reg_Anh_Java UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu_Anh AND course_section_id = @S_Java);
    IF @Reg_Anh_Java IS NULL AND @S_Java IS NOT NULL AND @AnyPeriodId IS NOT NULL
    BEGIN
        SET @Reg_Anh_Java = NEWID();
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, is_active, created_at, created_by)
        VALUES (@Reg_Anh_Java, @Stu_Anh, @S_Java, @AnyPeriodId, 1, GETDATE(), 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Reg_Anh_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Anh_Java)
    BEGIN
        SET @Comp_Java_CC = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'CC');
        SET @Comp_Java_TH = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'TH');
        SET @Comp_Java_CK = (SELECT id FROM grade_components WHERE course_section_id = @S_Java AND component_code = 'CK');

        INSERT INTO student_component_grades (id, registration_id, component_id, score, is_locked, is_active, created_at, created_by)
        VALUES 
        (NEWID(), @Reg_Anh_Java, @Comp_Java_CC, 8.5, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Anh_Java, @Comp_Java_TH, 8.0, 1, 1, GETDATE(), @AdminId),
        (NEWID(), @Reg_Anh_Java, @Comp_Java_CK, 8.0, 1, 1, GETDATE(), @AdminId);

        INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
        VALUES (NEWID(), @Reg_Anh_Java, 8.05, @ScaleB_Plus, 'B+', 3.5, 'PASS', 1, 1, GETDATE(), @AdminId);
    END
END

-- ======================================================================
-- 5. GIẢ LẬP QUÁ TRÌNH THAY ĐỔI ĐIỂM (AUDIT LOG & HISTORY)
-- ======================================================================
-- (Nếu bảng grade_history tồn tại, ta có thể thêm dữ liệu vào đó)
-- Ở đây ta chỉ tập trung vào dữ liệu chính như yêu cầu của USER.

GO
