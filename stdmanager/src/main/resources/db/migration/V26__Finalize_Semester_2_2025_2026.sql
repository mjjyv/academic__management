-- stdmanager/src/main/resources/db/migration/V26__Finalize_Semester_2_2025_2026.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. CẬP NHẬT TRẠNG THÁI VÀ GIẢNG VIÊN CHO CÁC LỚP HỌC PHẦN HK2 2526
-- ======================================================================

DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @GV_Huong UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');
DECLARE @GV_An UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV003');

-- Cập nhật giảng viên và trạng thái kết thúc (finished)
UPDATE course_sections 
SET lecturer_id = @GV_Kien, status = 'finished'
WHERE class_code = 'INT1302.01';

UPDATE course_sections 
SET lecturer_id = @GV_Huong, status = 'finished'
WHERE class_code = 'INT1304.01';

UPDATE course_sections 
SET lecturer_id = @GV_An, status = 'finished'
WHERE class_code = 'INT2203.01';

-- ======================================================================
-- 2. ĐĂNG KÝ HỌC PHẦN CHO SINH VIÊN K25 (BỔ SUNG NẾU THIẾU)
-- ======================================================================

DECLARE @Section_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @Section_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @Section_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
DECLARE @Period_HK2 UNIQUEIDENTIFIER = (SELECT id FROM registration_periods WHERE name LIKE N'%HK2 - 2526%');

-- Đăng ký bổ sung cho sinh viên K25
INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid, created_at, updated_at)
SELECT NEWID(), s.id, sec.id, @Period_HK2, 1, GETDATE(), 1, 1, GETDATE(), GETDATE()
FROM students s
CROSS JOIN (
    SELECT id FROM course_sections WHERE class_code IN ('INT1302.01', 'INT1304.01', 'INT2203.01')
) sec
WHERE s.student_code LIKE 'SV2025%'
AND @Period_HK2 IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM course_registrations cr 
    WHERE cr.student_id = s.id AND cr.course_section_id = sec.id
);

-- ======================================================================
-- 3. NHẬP ĐIỂM MẪU CHO CÁC SINH VIÊN NÀY
-- ======================================================================

-- Lấy danh sách component (đã được tạo ở V20 hoặc script khác)
DECLARE @Comp_CTDL_GK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @Section_CTDL AND (component_code = 'GK' OR component_name LIKE N'%Giữa kỳ%'));
DECLARE @Comp_CTDL_CK UNIQUEIDENTIFIER = (SELECT id FROM grade_components WHERE course_section_id = @Section_CTDL AND (component_code = 'CK' OR component_name LIKE N'%Cuối kỳ%'));

-- Nhập điểm thành phần mẫu cho một số SV (Ví dụ SV20250001)
DECLARE @Reg_SV1_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = (SELECT id FROM students WHERE student_code = 'SV20250001') AND course_section_id = @Section_CTDL);

IF @Reg_SV1_CTDL IS NOT NULL AND @Comp_CTDL_GK IS NOT NULL
BEGIN
    -- Xóa điểm cũ nếu có
    DELETE FROM student_component_grades WHERE registration_id = @Reg_SV1_CTDL;
    DELETE FROM student_summaries WHERE registration_id = @Reg_SV1_CTDL;

    INSERT INTO student_component_grades (id, registration_id, component_id, score, is_active, created_at, updated_at)
    VALUES (NEWID(), @Reg_SV1_CTDL, @Comp_CTDL_GK, 8.5, 1, GETDATE(), GETDATE());
    
    INSERT INTO student_component_grades (id, registration_id, component_id, score, is_active, created_at, updated_at)
    VALUES (NEWID(), @Reg_SV1_CTDL, @Comp_CTDL_CK, 7.0, 1, GETDATE(), GETDATE());

    -- Tạo summary
    INSERT INTO student_summaries (id, registration_id, total_score, letter_grade, gpa_value, result, is_active, created_at, updated_at)
    VALUES (NEWID(), @Reg_SV1_CTDL, 7.6, 'B', 3.0, 'PASS', 1, GETDATE(), GETDATE());
END

GO
