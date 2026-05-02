-- stdmanager/src/main/resources/db/migration/V23__Insert_Grade_Group_VIII.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @LecturerId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'nguyenvana');
DECLARE @SectionId UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'IT101-01');

-- ======================================================================
-- 2. INSERT GRADE_SCALES (Thang điểm quy đổi chuẩn 4.0)
-- ======================================================================
IF NOT EXISTS (SELECT 1 FROM grade_scales WHERE scale_code = 'A')
BEGIN
    INSERT INTO grade_scales (id, scale_code, min_score, max_score, letter_grade, gpa_value, description, is_pass, display_order, is_active, created_at, created_by, updated_at)
    VALUES 
    (NEWID(), 'A',  8.5, 10.0, 'A',  4.0, N'Xuất sắc', 1, 1, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'B+', 8.0, 8.4,  'B+', 3.5, N'Giỏi',     1, 2, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'B',  7.0, 7.9,  'B',  3.0, N'Khá giỏi', 1, 3, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'C+', 6.5, 6.9,  'C+', 2.5, N'Khá',      1, 4, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'C',  5.5, 6.4,  'C',  2.0, N'Trung bình khá', 1, 5, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'D+', 5.0, 5.4,  'D+', 1.5, N'Trung bình', 1, 6, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'D',  4.0, 4.9,  'D',  1.0, N'Trung bình yếu', 1, 7, 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (NEWID(), 'F',  0.0, 3.9,  'F',  0.0, N'Kém (Không đạt)', 0, 8, 1, SYSDATETIME(), @AdminId, SYSDATETIME());
END

-- ======================================================================
-- 3. INSERT GRADE_COMPONENTS (Thành phần điểm cho lớp IT101-01)
-- ======================================================================
DECLARE @Comp_CC UNIQUEIDENTIFIER = NEWID();
DECLARE @Comp_GK UNIQUEIDENTIFIER = NEWID();
DECLARE @Comp_CK UNIQUEIDENTIFIER = NEWID();

IF @SectionId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM grade_components WHERE course_section_id = @SectionId)
BEGIN
    INSERT INTO grade_components (id, course_section_id, component_code, component_name, weight_percentage, min_score, max_score, is_required, allow_retake, input_order, note, is_active, created_at, created_by, updated_at)
    VALUES 
    (@Comp_CC, @SectionId, 'CC', N'Chuyên cần', 10.00, 0.0, 10.0, 1, 0, 1, N'Tính trên số buổi tham gia', 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (@Comp_GK, @SectionId, 'GK', N'Giữa kỳ',    30.00, 0.0, 10.0, 1, 0, 2, N'Hình thức Trắc nghiệm', 1, SYSDATETIME(), @AdminId, SYSDATETIME()),
    (@Comp_CK, @SectionId, 'CK', N'Cuối kỳ',    60.00, 0.0, 10.0, 1, 1, 3, N'Thi tự luận tập trung', 1, SYSDATETIME(), @AdminId, SYSDATETIME());
END
ELSE 
BEGIN
    SELECT @Comp_CC = id FROM grade_components WHERE course_section_id = @SectionId AND component_code = 'CC';
    SELECT @Comp_GK = id FROM grade_components WHERE course_section_id = @SectionId AND component_code = 'GK';
    SELECT @Comp_CK = id FROM grade_components WHERE course_section_id = @SectionId AND component_code = 'CK';
END

-- ======================================================================
-- 4. INSERT STUDENT_COMPONENT_GRADES (Điểm chi tiết cho sinh viên)
-- ======================================================================
DECLARE @Reg_Duc UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = (SELECT id FROM students WHERE student_code = 'SV20200001') AND course_section_id = @SectionId);
DECLARE @Reg_Hanh UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = (SELECT id FROM students WHERE student_code = 'SV20210002') AND course_section_id = @SectionId);

IF @Reg_Duc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_component_grades WHERE registration_id = @Reg_Duc)
BEGIN
    -- Điểm cho Phạm Minh Đức (Học giỏi)
    INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, graded_at, graded_by, note, is_active, created_at, created_by, updated_at)
    VALUES 
    (NEWID(), @Reg_Duc, @Comp_CC, 10.0, 0, 1, GETDATE(), @LecturerId, N'Đầy đủ', 1, SYSDATETIME(), @LecturerId, SYSDATETIME()),
    (NEWID(), @Reg_Duc, @Comp_GK, 8.5,  0, 1, GETDATE(), @LecturerId, NULL,     1, SYSDATETIME(), @LecturerId, SYSDATETIME()),
    (NEWID(), @Reg_Duc, @Comp_CK, 9.0,  0, 1, GETDATE(), @LecturerId, NULL,     1, SYSDATETIME(), @LecturerId, SYSDATETIME());
END

IF @Reg_Hanh IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_component_grades WHERE registration_id = @Reg_Hanh)
BEGIN
    -- Điểm cho Nguyễn Thị Hạnh (Trung bình)
    INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, graded_at, graded_by, note, is_active, created_at, created_by, updated_at)
    VALUES 
    (NEWID(), @Reg_Hanh, @Comp_CC, 8.0, 0, 1, GETDATE(), @LecturerId, N'Vắng 2 buổi', 1, SYSDATETIME(), @LecturerId, SYSDATETIME()),
    (NEWID(), @Reg_Hanh, @Comp_GK, 5.5, 0, 1, GETDATE(), @LecturerId, NULL,          1, SYSDATETIME(), @LecturerId, SYSDATETIME()),
    (NEWID(), @Reg_Hanh, @Comp_CK, 4.5, 0, 1, GETDATE(), @LecturerId, NULL,          1, SYSDATETIME(), @LecturerId, SYSDATETIME());
END

-- ======================================================================
-- 5. INSERT STUDENT_SUMMARIES (Tổng kết điểm)
-- ======================================================================
-- Điểm tổng kết = (10*0.1) + (8.5*0.3) + (9.0*0.6) = 8.95 -> A
DECLARE @ScaleA UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'A');
IF @Reg_Duc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Duc)
BEGIN
    INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by, updated_at)
    VALUES (NEWID(), @Reg_Duc, 8.95, @ScaleA, 'A', 4.0, 'PASS', 1, 1, SYSDATETIME(), @AdminId, SYSDATETIME());
END

-- Điểm tổng kết = (8*0.1) + (5.5*0.3) + (4.5*0.6) = 0.8 + 1.65 + 2.7 = 5.15 -> D+
DECLARE @ScaleDPlus UNIQUEIDENTIFIER = (SELECT id FROM grade_scales WHERE scale_code = 'D+');
IF @Reg_Hanh IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_summaries WHERE registration_id = @Reg_Hanh)
BEGIN
    INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by, updated_at)
    VALUES (NEWID(), @Reg_Hanh, 5.15, @ScaleDPlus, 'D+', 1.5, 'PASS', 1, 1, SYSDATETIME(), @AdminId, SYSDATETIME());
END
GO