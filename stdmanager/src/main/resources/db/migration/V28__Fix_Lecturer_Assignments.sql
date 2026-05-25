-- stdmanager/src/main/resources/db/migration/V28__Fix_Lecturer_Assignments.sql
-- V29__Fix_Data_Inconsistencies
-- V30__Fix_Summer_Registration_Inconsistency
-- V31__Normalize_User_Data_And_RBAC

USE stdmanager_db;
GO

-- ======================================================================
-- SỬA LỖI ĐỒNG BỘ DỮ LIỆU GIẢNG VIÊN VÀ LỚP HỌC PHẦN
-- Lỗi: Bảng course_sections và lecturer_course_sections bị lệch dữ liệu
-- (Do V25 cập nhật course_sections nhưng quên cập nhật lecturer_course_sections)
-- ======================================================================

DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @GV_Huong UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002'); -- Trần Thị Bích
DECLARE @GV_An UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV003');

DECLARE @Section_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @Section_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @Section_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

-- 1. Xóa tất cả các phân công cũ trong lecturer_course_sections cho 3 lớp này
DELETE FROM lecturer_course_sections 
WHERE course_section_id IN (@Section_CTDL, @Section_AI, @Section_OOP);

-- 2. Thêm lại chính xác theo bảng course_sections (đã được V25 chuẩn hóa)
IF @GV_Kien IS NOT NULL AND @Section_CTDL IS NOT NULL
    INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at)
    VALUES (NEWID(), @GV_Kien, @Section_CTDL, N'Giảng viên chính', 1, GETDATE(), GETDATE());

IF @GV_Huong IS NOT NULL AND @Section_AI IS NOT NULL
    INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at)
    VALUES (NEWID(), @GV_Huong, @Section_AI, N'Giảng viên chính', 1, GETDATE(), GETDATE());

IF @GV_An IS NOT NULL AND @Section_OOP IS NOT NULL
    INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at)
    VALUES (NEWID(), @GV_An, @Section_OOP, N'Giảng viên chính', 1, GETDATE(), GETDATE());

GO


-- stdmanager/src/main/resources/db/migration/V29__Fix_Data_Inconsistencies.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. SỬA LỖI THỜI GIAN ĐĂNG KÝ VÀ TRẠNG THÁI HỌC KỲ
-- ======================================================================

-- Đảm bảo đợt đăng ký kết thúc vào 15/02/2026
UPDATE registration_periods 
SET end_time = '2026-02-15 23:59:59'
WHERE name LIKE N'%HK2 - 2526%';

-- Cập nhật thời điểm đăng ký về trước thời hạn (trước 15/02/2026)
UPDATE course_registrations
SET registered_at = '2026-02-10 08:00:00',
    created_at = '2026-02-10 08:00:00'
WHERE registration_period_id IN (SELECT id FROM registration_periods WHERE name LIKE N'%HK2 - 2526%')
AND (registered_at > '2026-02-15' OR created_at > '2026-02-15');

-- Khôi phục trạng thái các lớp học phần HK2 (vẫn đang diễn ra, chưa kết thúc)
UPDATE course_sections
SET status = 'open'
WHERE semester_id IN (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026')
AND status = 'finished';

-- ======================================================================
-- 2. ĐỒNG BỘ PHÂN CÔNG GIẢNG VIÊN (REVERT VỀ V20 ĐỂ NHẤT QUÁN)
-- ======================================================================

DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @GV_Huong UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');
DECLARE @S_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @S_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @S_OOP UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

-- Cập nhật bảng course_sections
UPDATE course_sections SET lecturer_id = @GV_Kien WHERE id = @S_CTDL;
UPDATE course_sections SET lecturer_id = @GV_Kien WHERE id = @S_AI;
UPDATE course_sections SET lecturer_id = @GV_Huong WHERE id = @S_OOP;

-- Cập nhật bảng lecturer_course_sections
DELETE FROM lecturer_course_sections WHERE course_section_id IN (@S_CTDL, @S_AI, @S_OOP);
INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
VALUES 
(NEWID(), @GV_Kien, @S_CTDL, N'Giảng viên chính', 1),
(NEWID(), @GV_Kien, @S_AI, N'Giảng viên chính', 1),
(NEWID(), @GV_Huong, @S_OOP, N'Giảng viên chính', 1);

-- ======================================================================
-- 3. SỬA LỖI LOGIC ĐIỂM SỐ VÀ TRÙNG LẶP (SV20250001)
-- ======================================================================

DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250001');
DECLARE @Reg1_CTDL UNIQUEIDENTIFIER = (SELECT id FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @S_CTDL);

IF @Reg1_CTDL IS NOT NULL
BEGIN
    -- Xóa dữ liệu điểm cũ (cả bản ghi ở V23 và V25/V26) để nạp lại chuẩn
    DELETE FROM student_component_grades WHERE registration_id = @Reg1_CTDL;
    DELETE FROM student_summaries WHERE registration_id = @Reg1_CTDL;

    -- Nạp lại điểm thành phần (CC=10, GK=8.5, CK=7.0)
    INSERT INTO student_component_grades (id, registration_id, component_id, score, is_active, created_at)
    SELECT NEWID(), @Reg1_CTDL, id, val, 1, GETDATE()
    FROM (SELECT id, component_code FROM grade_components WHERE course_section_id = @S_CTDL) c
    JOIN (VALUES ('CC', 10.0), ('GK', 8.5), ('CK', 7.0)) v(code, val) ON c.component_code = v.code;

    -- Nạp lại tổng kết (Trọng số 10/30/60 -> 10*0.1 + 8.5*0.3 + 7.0*0.6 = 7.75)
    INSERT INTO student_summaries (id, registration_id, total_score, letter_grade, gpa_value, result, is_active, created_at)
    VALUES (NEWID(), @Reg1_CTDL, 7.75, 'B', 3.0, 'PASS', 1, GETDATE());
END

-- ======================================================================
-- 4. CẬP NHẬT TRẠNG THÁI HỌC PHÍ QUÁ HẠN (OVERDUE)
-- ======================================================================

-- Cập nhật status = 4 cho các trường hợp nợ tiền sau ngày 31/03/2026
UPDATE student_tuition
SET status = 4
WHERE deadline < '2026-05-03' 
AND debt_amount > 0 
AND status IN (2, 3);

-- ======================================================================
-- 5. XỬ LÝ ĐĂNG KÝ TRÙNG LẶP VÀ SAI CHƯƠNG TRÌNH ĐÀO TẠO
-- ======================================================================

-- Xóa các đăng ký không nằm trong chương trình đào tạo của sinh viên
-- (Hệ quả của việc CROSS JOIN hàng loạt ở V25/V26)
-- Xóa các bản ghi phụ thuộc trước khi xóa đăng ký
-- 5.1 Xóa điểm chi tiết
DELETE scg
FROM student_component_grades scg
JOIN course_registrations cr ON scg.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN students s ON cr.student_id = s.id
WHERE NOT EXISTS (
    SELECT 1 FROM training_program_courses tpc
    WHERE tpc.training_program_id = s.program_id
    AND tpc.course_id = cs.course_id
);

-- 5.2 Xóa tổng kết điểm
DELETE ss
FROM student_summaries ss
JOIN course_registrations cr ON ss.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN students s ON cr.student_id = s.id
WHERE NOT EXISTS (
    SELECT 1 FROM training_program_courses tpc
    WHERE tpc.training_program_id = s.program_id
    AND tpc.course_id = cs.course_id
);

-- 5.3 Xóa đăng ký
DELETE cr
FROM course_registrations cr
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN students s ON cr.student_id = s.id
WHERE NOT EXISTS (
    SELECT 1 FROM training_program_courses tpc
    WHERE tpc.training_program_id = s.program_id
    AND tpc.course_id = cs.course_id
);

GO



-- stdmanager/src/main/resources/db/migration/V30__Fix_Summer_Registration_Inconsistency.sql

USE stdmanager_db;
GO

-- Xóa các đăng ký học hè (V27) cho những sinh viên đã đạt (PASS) môn học đó ở các kỳ trước
-- Điều này sẽ tự động làm sạch Personal Schedule của sinh viên

-- Xóa điểm chi tiết cho đăng ký học hè trùng lặp
DELETE scg
FROM student_component_grades scg
JOIN course_registrations cr ON scg.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN semesters sem ON cs.semester_id = sem.id
WHERE sem.semester_code = '2526_HE'
AND EXISTS (
    SELECT 1 
    FROM student_summaries ss_old
    JOIN course_registrations cr_old ON ss_old.registration_id = cr_old.id
    JOIN course_sections cs_old ON cr_old.course_section_id = cs_old.id
    WHERE cr_old.student_id = cr.student_id
    AND cs_old.course_id = cs.course_id
    AND ss_old.result = 'PASS'
    AND cs_old.id <> cs.id
);

-- Xóa tổng kết điểm cho đăng ký học hè trùng lặp
DELETE ss
FROM student_summaries ss
JOIN course_registrations cr ON ss.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN semesters sem ON cs.semester_id = sem.id
WHERE sem.semester_code = '2526_HE'
AND EXISTS (
    SELECT 1 
    FROM student_summaries ss_old
    JOIN course_registrations cr_old ON ss_old.registration_id = cr_old.id
    JOIN course_sections cs_old ON cr_old.course_section_id = cs_old.id
    WHERE cr_old.student_id = cr.student_id
    AND cs_old.course_id = cs.course_id
    AND ss_old.result = 'PASS'
    AND cs_old.id <> cs.id
);

-- Cuối cùng mới xóa đăng ký
DELETE cr
FROM course_registrations cr
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN semesters sem ON cs.semester_id = sem.id
WHERE sem.semester_code = '2526_HE' -- Học kỳ hè (V27)
AND EXISTS (
    -- Kiểm tra xem sinh viên đã có điểm tổng kết đạt (PASS) cho môn học này chưa
    SELECT 1 
    FROM student_summaries ss
    JOIN course_registrations cr_old ON ss.registration_id = cr_old.id
    JOIN course_sections cs_old ON cr_old.course_section_id = cs_old.id
    WHERE cr_old.student_id = cr.student_id
    AND cs_old.course_id = cs.course_id
    AND ss.result = 'PASS'
    AND cs_old.id <> cs.id -- Không tính chính nó (đề phòng)
);

GO


-- stdmanager/src/main/resources/db/migration/V31__Normalize_User_Data_And_RBAC.sql

USE stdmanager_db;
GO

-- 1. CHUẨN HÓA DỮ LIỆU NGƯỜI DÙNG (Normalization)
-- Loại bỏ các cột dư thừa đã có trong bảng users

-- Bảng employees
DECLARE @ConstraintName NVARCHAR(200);

-- Drop indexes that depend on full_name
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_FullName' AND object_id = OBJECT_ID('employees'))
    DROP INDEX IX_Employees_FullName ON employees;

-- Drop constraints for employees.full_name
SELECT @ConstraintName = name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('employees') AND parent_column_id = (SELECT column_id FROM sys.columns WHERE name = 'full_name' AND object_id = OBJECT_ID('employees'));
IF @ConstraintName IS NOT NULL EXEC('ALTER TABLE employees DROP CONSTRAINT ' + @ConstraintName);
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('employees') AND name = 'full_name')
    ALTER TABLE employees DROP COLUMN full_name;

-- Drop constraints for employees.email
SET @ConstraintName = NULL;
SELECT @ConstraintName = name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('employees') AND parent_column_id = (SELECT column_id FROM sys.columns WHERE name = 'email' AND object_id = OBJECT_ID('employees'));
IF @ConstraintName IS NOT NULL EXEC('ALTER TABLE employees DROP CONSTRAINT ' + @ConstraintName);
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('employees') AND name = 'email')
    ALTER TABLE employees DROP COLUMN email;

-- Drop constraints for employees.phone
SET @ConstraintName = NULL;
SELECT @ConstraintName = name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('employees') AND parent_column_id = (SELECT column_id FROM sys.columns WHERE name = 'phone' AND object_id = OBJECT_ID('employees'));
IF @ConstraintName IS NOT NULL EXEC('ALTER TABLE employees DROP CONSTRAINT ' + @ConstraintName);
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('employees') AND name = 'phone')
    ALTER TABLE employees DROP COLUMN phone;

-- Bảng students
SET @ConstraintName = NULL;

-- Drop indexes that depend on full_name
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_FullName' AND object_id = OBJECT_ID('students'))
    DROP INDEX IX_Students_FullName ON students;

-- Drop constraints for students.full_name
SELECT @ConstraintName = name FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID('students') AND parent_column_id = (SELECT column_id FROM sys.columns WHERE name = 'full_name' AND object_id = OBJECT_ID('students'));
IF @ConstraintName IS NOT NULL EXEC('ALTER TABLE students DROP CONSTRAINT ' + @ConstraintName);
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('students') AND name = 'full_name')
    ALTER TABLE students DROP COLUMN full_name;


-- 2. CƠ CHẾ KHÓA ĐIỂM (Grade Locking)
-- Bổ sung trạng thái chốt điểm để ngăn chặn việc sửa đổi sau khi đã phê duyệt

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('student_summaries') AND name = 'is_finalized')
    ALTER TABLE student_summaries ADD is_finalized BIT DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('student_summaries') AND name = 'locked_at')
    ALTER TABLE student_summaries ADD locked_at DATETIME2;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('student_summaries') AND name = 'locked_by')
    ALTER TABLE student_summaries ADD locked_by UNIQUEIDENTIFIER;

GO
