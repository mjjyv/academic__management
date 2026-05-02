-- stdmanager/src/main/resources/db/migration/V20__Insert_Semester_Group_V.sql

USE [stdmanager_db];
GO

-- ======================================================================
-- 1. INSERT SEMESTERS (Học kỳ)
-- ======================================================================

-- Năm học 2025-2026 (Đã kết thúc)
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2025_2026')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK1_2025_2026', N'Học kỳ 1 năm học 2025-2026', '2025-2026', '2025-09-04', '2026-01-15', 1);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2025_2026')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK2_2025_2026', N'Học kỳ 2 năm học 2025-2026', '2025-2026', '2026-02-19', '2026-06-30', 1);

-- Năm học 2026-2027 (Hiện tại & Kế hoạch)
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2026_2027')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK1_2026_2027', N'Học kỳ 1 năm học 2026-2027', '2026-2027', '2026-09-02', '2027-01-19', 1);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2026_2027')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK2_2026_2027', N'Học kỳ 2 năm học 2026-2027', '2026-2027', '2027-02-17', '2027-06-29', 1);

GO

-- ======================================================================
-- 2. INSERT COURSE SECTIONS (Lớp học phần)
-- ======================================================================

-- Đảm bảo có dữ liệu Tòa nhà & Phòng học để tránh lỗi UNIQUEIDENTIFIER conversion hoặc NULL FK
IF NOT EXISTS (SELECT 1 FROM buildings WHERE building_code = 'TOA_T3')
    INSERT INTO buildings (id, building_code, building_name, is_active) VALUES (NEWID(), 'TOA_T3', N'Tòa nhà T3', 1);
IF NOT EXISTS (SELECT 1 FROM buildings WHERE building_code = 'TOA_A')
    INSERT INTO buildings (id, building_code, building_name, is_active) VALUES (NEWID(), 'TOA_A', N'Tòa nhà A', 1);
IF NOT EXISTS (SELECT 1 FROM buildings WHERE building_code = 'TOA_B')
    INSERT INTO buildings (id, building_code, building_name, is_active) VALUES (NEWID(), 'TOA_B', N'Tòa nhà B', 1);
IF NOT EXISTS (SELECT 1 FROM buildings WHERE building_code = 'TOA_C')
    INSERT INTO buildings (id, building_code, building_name, is_active) VALUES (NEWID(), 'TOA_C', N'Tòa nhà C', 1);

IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_code = 'PHONG_LAB1')
    INSERT INTO rooms (id, room_code, room_name, building_id, is_active) VALUES (NEWID(), 'PHONG_LAB1', N'Phòng Lab 1', (SELECT id FROM buildings WHERE building_code = 'TOA_T3'), 1);
IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_code = 'A201')
    INSERT INTO rooms (id, room_code, room_name, building_id, is_active) VALUES (NEWID(), 'A201', N'Phòng A201', (SELECT id FROM buildings WHERE building_code = 'TOA_A'), 1);
IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_code = 'B101')
    INSERT INTO rooms (id, room_code, room_name, building_id, is_active) VALUES (NEWID(), 'B101', N'Phòng B101', (SELECT id FROM buildings WHERE building_code = 'TOA_B'), 1);
IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_code = 'C301')
    INSERT INTO rooms (id, room_code, room_name, building_id, is_active) VALUES (NEWID(), 'C301', N'Phòng C301', (SELECT id FROM buildings WHERE building_code = 'TOA_C'), 1);

DECLARE @Semester_HK1_2526 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2025_2026');
DECLARE @Course_Java UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
DECLARE @Course_Logic UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');

-- Lớp học phần cho HK1_2025_2026
IF @Semester_HK1_2526 IS NOT NULL
BEGIN
    -- Lớp Java OOP
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT2203.01', @Course_Java, @Semester_HK1_2526, '2025-2026', 40, 10, 'open', 'theory');

    -- Lớp Web Spring Boot
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT3305.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT3305.01', @Course_Web, @Semester_HK1_2526, '2025-2026', 35, 10, 'open', 'theory');

    -- Lớp Nhập môn lập trình
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT1301.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type)
        VALUES (NEWID(), 'INT1301.01', @Course_Logic, @Semester_HK1_2526, '2025-2026', 50, 15, 'open', 'theory');
END
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

-- 4. INSERT STUDENT ENROLLMENTS (Đăng ký học phần)
-- ======================================================================

DECLARE @Student1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM students); -- Lấy sinh viên đầu tiên làm mẫu
SET @Section_Java = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
SET @Section_Web = (SELECT id FROM course_sections WHERE class_code = 'INT3305.01');

IF @Student1 IS NOT NULL
BEGIN
    IF @Section_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student1 AND course_section_id = @Section_Java)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @Student1, @Section_Java, 'active', 1);

    IF @Section_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student1 AND course_section_id = @Section_Web)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @Student1, @Section_Web, 'active', 1);
END


-- 5. INSERT SEMESTERS BỔ SUNG (Học kỳ hè & Học kỳ cũ hơn)
-- ======================================================================

-- Học kỳ hè 2023-2024
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK3_2024_2025')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
    VALUES (NEWID(), 'HK3_2024_2025', N'Học kỳ hè năm học 2024-2025', '2024-2025', '2024-07-01', '2024-08-10', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);

-- Năm học 2022-2023 (Đã kết thúc)
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK1_2024_2025')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
    VALUES (NEWID(), 'HK1_2024_2025', N'Học kỳ 1 năm học 2024-2025', '2024-2025', '2024-09-05', '2025-01-15', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);

IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK2_2024_2025')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
    VALUES (NEWID(), 'HK2_2024_2025', N'Học kỳ 2 năm học 2024-2025', '2024-2025', '2023-02-20', '2023-06-30', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);

-- ======================================================================
-- 6. INSERT COURSE SECTIONS BỔ SUNG (Lớp thực hành, Lớp học phần cũ, Lớp hè)

DECLARE @Semester_HK2_2425 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2024_2025');
DECLARE @Semester_HK3_2425 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK3_2024_2025');
DECLARE @Semester_HK1_2425 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2024_2025');

-- Lớp thực hành Java (cùng học kỳ HK1_2024_2025)
IF @Semester_HK1_2425 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.L01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, min_students, class_type, status, registration_start, registration_end, note, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), 'INT2203.L01', @Course_Java, @Semester_HK1_2425, '2024-2025', NULL, (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'), 30, 10, 'lab', 'open', '2024-08-20 08:00:00', '2024-08-30 17:00:00', N'Yêu cầu đã qua môn Nhập môn lập trình', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Lớp học phần của học kỳ trước (HK2_2023_2024)
IF @Semester_HK2_2425 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT3305.02')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, min_students, class_type, status, registration_start, registration_end, note, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), 'INT3305.02', @Course_Web, @Semester_HK2_2425, '2024-2025', NULL, (SELECT id FROM rooms WHERE room_code = 'A201'), (SELECT id FROM buildings WHERE building_code = 'TOA_A'), 35, 10, 'theory', 'closed', '2024-02-10 08:00:00', '2024-02-18 17:00:00', N'Lớp đã đóng đăng ký', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Lớp học phần học kỳ hè
IF @Semester_HK3_2425 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT1301.H01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, min_students, class_type, status, registration_start, registration_end, note, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), 'INT1301.H01', @Course_Logic, @Semester_HK3_2425, '2024-2025', NULL, (SELECT id FROM rooms WHERE room_code = 'B101'), (SELECT id FROM buildings WHERE building_code = 'TOA_B'), 50, 15, 'theory', 'closed', '2024-06-20 08:00:00', '2024-06-28 17:00:00', N'Học kỳ hè rút gọn', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Lớp học phần đã hủy ở học kỳ cũ
IF @Semester_HK1_2425 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.99')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, min_students, class_type, status, registration_start, registration_end, note, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), 'INT2203.99', @Course_Java, @Semester_HK1_2425, '2024-2025', NULL, (SELECT id FROM rooms WHERE room_code = 'C301'), (SELECT id FROM buildings WHERE building_code = 'TOA_C'), 40, 10, 'theory', 'canceled', '2022-09-01 08:00:00', '2022-09-05 17:00:00', N'Hủy do không đủ số lượng đăng ký', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 0);
END

-- ======================================================================
-- 7. INSERT LECTURER ASSIGNMENTS BỔ SUNG (Phân công GV phụ & GV cho lớp cũ)
-- ======================================================================

DECLARE @Lecturer2 UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');
DECLARE @Lecturer3 UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV003');
DECLARE @Section_JavaLab UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.L01');
DECLARE @Section_Web02 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.02');
DECLARE @Section_LogicH01 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1301.H01');

-- Phân công GV chính và GV phụ cho lớp Lab Java
IF @Lecturer1 IS NOT NULL AND @Section_JavaLab IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_JavaLab AND lecturer_id = @Lecturer1)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
        VALUES (NEWID(), @Lecturer1, @Section_JavaLab, N'Giảng viên chính', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);

    IF @Lecturer2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_JavaLab AND lecturer_id = @Lecturer2)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
        VALUES (NEWID(), @Lecturer2, @Section_JavaLab, N'Giảng viên phụ', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);
END

-- Phân công cho lớp Web kỳ trước
IF @Lecturer2 IS NOT NULL AND @Section_Web02 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_Web02)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
        VALUES (NEWID(), @Lecturer2, @Section_Web02, N'Giảng viên chính', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);
END

-- Phân công cho lớp Nhập môn học kỳ hè
IF @Lecturer3 IS NOT NULL AND @Section_LogicH01 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @Section_LogicH01)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
        VALUES (NEWID(), @Lecturer3, @Section_LogicH01, N'Giảng viên chính', 1, GETDATE(), GETDATE(), NULL, NULL, NULL, NULL);
END

-- ======================================================================
-- 8. INSERT STUDENT ENROLLMENTS BỔ SUNG (Đăng ký & Điểm cho các lớp khác)
-- ======================================================================

DECLARE @Student2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV002');
DECLARE @Student3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV003');
SET @Section_JavaLab = (SELECT id FROM course_sections WHERE class_code = 'INT2203.L01');
SET @Section_Web02 = (SELECT id FROM course_sections WHERE class_code = 'INT3305.02');
SET @Section_LogicH01 = (SELECT id FROM course_sections WHERE class_code = 'INT1301.H01');

-- Sinh viên 1 đăng ký lớp Lab Java
IF @Student1 IS NOT NULL AND @Section_JavaLab IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student1 AND course_section_id = @Section_JavaLab)
        INSERT INTO student_course_sections (id, student_id, course_section_id, grade_point, grade_char, status, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), @Student1, @Section_JavaLab, NULL, NULL, 'active', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Sinh viên 2 đăng ký lớp Web kỳ trước và đã có điểm (completed)
IF @Student2 IS NOT NULL AND @Section_Web02 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student2 AND course_section_id = @Section_Web02)
        INSERT INTO student_course_sections (id, student_id, course_section_id, grade_point, grade_char, status, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), @Student2, @Section_Web02, 3.50, 'B+', 'completed', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Sinh viên 3 đăng ký lớp Nhập môn học kỳ hè và đã hoàn thành
IF @Student3 IS NOT NULL AND @Section_LogicH01 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student3 AND course_section_id = @Section_LogicH01)
        INSERT INTO student_course_sections (id, student_id, course_section_id, grade_point, grade_char, status, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), @Student3, @Section_LogicH01, 2.50, 'C+', 'completed', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END

-- Sinh viên 2 đăng ký lớp Nhập môn học kỳ hè nhưng rớt môn (dropped)
IF @Student2 IS NOT NULL AND @Section_LogicH01 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @Student2 AND course_section_id = @Section_LogicH01)
        INSERT INTO student_course_sections (id, student_id, course_section_id, grade_point, grade_char, status, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, is_active)
        VALUES (NEWID(), @Student2, @Section_LogicH01, NULL, 'F', 'dropped', GETDATE(), GETDATE(), NULL, NULL, NULL, NULL, 1);
END
GO
-- ======================================================================
-- 9. BỔ SUNG DỮ LIỆU NĂM HỌC 2026-2027 (Kế hoạch tương lai)
-- ======================================================================

-- Thêm học kỳ hè 2026-2027
IF NOT EXISTS (SELECT 1 FROM semesters WHERE semester_code = 'HK3_2026_2027')
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (NEWID(), 'HK3_2026_2027', N'Học kỳ hè năm học 2026-2027', '2026-2027', '2027-07-01', '2027-08-15', 1);

-- Thêm một vài học phần mới để làm phong phú dữ liệu 2026-2027
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT4309')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, created_by)
    VALUES (NEWID(), 'INT4309', N'Lập trình Di động (React Native)', 3, 30, 30, @Dept_CNTT, 1, GETDATE(), @AdminId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT4310')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, department_id, is_active, created_at, created_by)
    VALUES (NEWID(), 'INT4310', N'Nhập môn Trí tuệ Nhân tạo', 3, 45, 0, @Dept_CNTT, 1, GETDATE(), @AdminId);

-- ======================================================================
-- 10. COURSE SECTIONS CHO NĂM HỌC 2026-2027
-- ======================================================================

DECLARE @Sem_HK1_2627 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2026_2027');
DECLARE @Sem_HK2_2627 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2026_2027');
DECLARE @C_Mobile UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT4309');
DECLARE @C_AI UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT4310');
DECLARE @C_Java UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @C_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
DECLARE @C_DB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3306');

-- Lớp học HK1 2026-2027
IF @Sem_HK1_2627 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT4309.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT4309.01', @C_Mobile, @Sem_HK1_2627, '2026-2027', 40, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'));

    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT4310.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT4310.01', @C_AI, @Sem_HK1_2627, '2026-2027', 60, 20, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'A201'), (SELECT id FROM buildings WHERE building_code = 'TOA_A'));

    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT2203.02')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT2203.02', @C_Java, @Sem_HK1_2627, '2026-2027', 45, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'B101'), (SELECT id FROM buildings WHERE building_code = 'TOA_B'));
END

-- Lớp học HK2 2026-2027
IF @Sem_HK2_2627 IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT3305.03')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT3305.03', @C_Web, @Sem_HK2_2627, '2026-2027', 40, 10, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'PHONG_LAB1'), (SELECT id FROM buildings WHERE building_code = 'TOA_T3'));

    IF NOT EXISTS (SELECT 1 FROM course_sections WHERE class_code = 'INT3306.01')
        INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, max_students, min_students, status, class_type, room_id, building_id)
        VALUES (NEWID(), 'INT3306.01', @C_DB, @Sem_HK2_2627, '2026-2027', 50, 15, 'open', 'theory', (SELECT id FROM rooms WHERE room_code = 'C301'), (SELECT id FROM buildings WHERE building_code = 'TOA_C'));
END

-- ======================================================================
-- 11. PHÂN CÔNG GIẢNG VIÊN (2026-2027)
-- ======================================================================

DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @GV_Huong UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');
DECLARE @S_Mobile UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT4309.01');
DECLARE @S_AI UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT4310.01');
DECLARE @S_Web_New UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.03');

IF @GV_Kien IS NOT NULL
BEGIN
    IF @S_Mobile IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @S_Mobile)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @GV_Kien, @S_Mobile, N'Giảng viên chính', 1);

    IF @S_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @S_AI)
        INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
        VALUES (NEWID(), @GV_Kien, @S_AI, N'Giảng viên chính', 1);
END

IF @GV_Huong IS NOT NULL AND @S_Web_New IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lecturer_course_sections WHERE course_section_id = @S_Web_New)
BEGIN
    INSERT INTO lecturer_course_sections (id, lecturer_id, course_section_id, role, is_active)
    VALUES (NEWID(), @GV_Huong, @S_Web_New, N'Giảng viên chính', 1);
END

-- ======================================================================
-- 12. ĐĂNG KÝ HỌC PHẦN SINH VIÊN (2026-2027)
-- ======================================================================

DECLARE @SV_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV001');
DECLARE @SV_Hanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV002');

IF @SV_Duc IS NOT NULL
BEGIN
    IF @S_Mobile IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @SV_Duc AND course_section_id = @S_Mobile)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @SV_Duc, @S_Mobile, 'active', 1);

    IF @S_AI IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @SV_Duc AND course_section_id = @S_AI)
        INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
        VALUES (NEWID(), @SV_Duc, @S_AI, 'active', 1);
END

IF @SV_Hanh IS NOT NULL AND @S_Web_New IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_course_sections WHERE student_id = @SV_Hanh AND course_section_id = @S_Web_New)
BEGIN
    INSERT INTO student_course_sections (id, student_id, course_section_id, status, is_active)
    VALUES (NEWID(), @SV_Hanh, @S_Web_New, 'active', 1);
END

GO
