-- =====================================================
-- TẠO DỮ LIỆU MẪU CHO NHÓM MÔN HỌC & CHƯƠNG TRÌNH (GROUP IV)
-- =====================================================

-- 1. Lấy lại ID Khoa đã tạo ở Nhóm III
DECLARE @DeptCNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @DeptKinhTe UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'KINHTE');

-- 2. Dữ liệu cho bảng 'majors' (Ngành đào tạo)
DECLARE @MajorCNTT UNIQUEIDENTIFIER = NEWID();
DECLARE @MajorKinhTe UNIQUEIDENTIFIER = NEWID();

INSERT INTO majors (id, department_id, major_code, major_name, description, effective_date, is_active) VALUES
(@MajorCNTT, @DeptCNTT, 'NG_CNTT', N'Ngành Công nghệ thông tin', N'Đào tạo kỹ sư CNTT', '2020-01-01', 1),
(@MajorKinhTe, @DeptKinhTe, 'NG_QTKD', N'Ngành Quản trị kinh doanh', N'Đào tạo cử nhân kinh tế', '2020-01-01', 1);
GO

-- 3. Dữ liệu cho bảng 'training_programs' (Chương trình đào tạo)
DECLARE @MajorCNTT UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'NG_CNTT');
DECLARE @DeptCNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');

DECLARE @ProgCNTT_K45 UNIQUEIDENTIFIER = NEWID();

INSERT INTO training_programs (
    id, program_code, program_name, major_id, department_id, 
    degree_level, total_credits, duration_years, status, is_active
) VALUES (
    @ProgCNTT_K45, 'CT_CNTT_K45', N'Chương trình CNTT Khóa 45', @MajorCNTT, @DeptCNTT, 
    N'Đại học', 135, 4.0, N'ACTIVE', 1
);
GO

-- 4. Dữ liệu cho bảng 'courses' (Môn học)
-- Tạo ID trước để dùng tham chiếu lẫn nhau (prerequisite)
DECLARE @CourseSQL UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseJava UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseDB UNIQUEIDENTIFIER = NEWID();
DECLARE @CourseWeb UNIQUEIDENTIFIER = NEWID();

DECLARE @DeptCNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');

INSERT INTO courses (id, department_id, course_code, course_name, credits, course_type, theory_hours, practice_hours, is_active) VALUES
(@CourseSQL, @DeptCNTT, 'MON_SQL', N'Cơ sở dữ liệu', 3.0, 'CORE', 30, 15, 1),          -- Môn cơ sở
(@CourseJava, @DeptCNTT, 'MON_JAVA', N'Lập trình Java', 4.0, 'CORE', 45, 15, 1),        -- Môn cơ sở
(@CourseDB, @DeptCNTT, 'MON_DBADV', N'CSDL Nâng cao', 3.0, 'ELECTIVE', 30, 15, 1),      -- Môn tự chọn (cần nền tảng SQL)
(@CourseWeb, @DeptCNTT, 'MON_WEB', N'Lập trình Web', 3.0, 'CORE', 30, 15, 1);          -- Môn chuyên ngành (cần Java)
GO

-- 5. Dữ liệu cho bảng 'course_prerequisites' (Môn học tiên quyết)
-- Lấy lại ID môn học vừa tạo
DECLARE @CourseSQL UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_SQL');
DECLARE @CourseJava UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_JAVA');
DECLARE @CourseDB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_DBADV');
DECLARE @CourseWeb UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_WEB');

-- Logic:
-- Để học 'CSDL Nâng cao' cần học xong 'Cơ sở dữ liệu'
-- Để học 'Lập trình Web' cần học xong 'Lập trình Java'
INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active) VALUES
(NEWID(), @CourseDB, @CourseSQL, 1),
(NEWID(), @CourseWeb, @CourseJava, 1);
GO

-- 6. Dữ liệu cho bảng 'training_program_courses' (Môn học thuộc chương trình)
DECLARE @ProgCNTT_K45 UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_CNTT_K45');
DECLARE @CourseSQL UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_SQL');
DECLARE @CourseJava UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_JAVA');
DECLARE @CourseDB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_DBADV');
DECLARE @CourseWeb UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_WEB');
DECLARE @CoursePrereqSQL UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MON_SQL');

INSERT INTO training_program_courses (
    id, training_program_id, course_id, course_code, course_name, 
    semester, is_required, credits, prerequisite_course_id, is_active
) VALUES 
-- Kỳ 1
(NEWID(), @ProgCNTT_K45, @CourseSQL, 'MON_SQL', N'Cơ sở dữ liệu', 1, 1, 3.0, NULL, 1),
(NEWID(), @ProgCNTT_K45, @CourseJava, 'MON_JAVA', N'Lập trình Java', 1, 1, 4.0, NULL, 1),
-- Kỳ 2 (Có môn tiên quyết)
(NEWID(), @ProgCNTT_K45, @CourseDB, 'MON_DBADV', N'CSDL Nâng cao', 2, 0, 3.0, @CoursePrereqSQL, 1), -- Tự chọn, cần SQL
(NEWID(), @ProgCNTT_K45, @CourseWeb, 'MON_WEB', N'Lập trình Web', 2, 1, 3.0, @CourseJava, 1);      -- Bắt buộc, cần Java
GO