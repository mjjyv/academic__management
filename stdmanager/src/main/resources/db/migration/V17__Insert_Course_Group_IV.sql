-- stdmanager/src/main/resources/db/migration/V17__Insert_Course_Group_IV.sql

USE [stdmanager_db];
GO

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM IV (HỌC PHẦN, CHƯƠNG TRÌNH & NGÀNH)
-- ======================================================================

-- Lấy ID của User Admin làm người tạo/cập nhật dữ liệu chuẩn
DECLARE @AdminUserId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @Dept_KT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'KT');
DECLARE @Dept_NN UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'NN');

-- ======================================================================
-- 1. INSERT MAJORS (Ngành đào tạo)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_KTPM')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_KTPM', N'Kỹ thuật Phần mềm', @Dept_CNTT, N'Chuyên ngành đào tạo kỹ sư phần mềm, lập trình ứng dụng', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'CNTT_MMT')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CNTT_MMT', N'Mạng máy tính & Truyền thông', @Dept_CNTT, N'Chuyên ngành về hạ tầng mạng, an ninh mạng và truyền thông', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KT_QTKD')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'KT_QTKD', N'Quản trị Kinh doanh', @Dept_KT, N'Đào tạo nhân sự quản trị, điều hành doanh nghiệp', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KT_KT')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'KT_KT', N'Kế toán', @Dept_KT, N'Đào tạo chuyên viên kế toán, kiểm toán và tài chính', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'NN_NNA')
    INSERT INTO majors (id, major_code, major_name, department_id, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'NN_NNA', N'Ngôn ngữ Anh', @Dept_NN, N'Đào tạo cử nhân ngoại ngữ chuyên ngành tiếng Anh', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 2. INSERT TRAINING_PROGRAMS (Chương trình đào tạo)
-- ======================================================================

DECLARE @Major_KTPM UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_KTPM');
DECLARE @Major_MMT UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'CNTT_MMT');
DECLARE @Major_QTKD UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'KT_QTKD');
DECLARE @Major_NNA UNIQUEIDENTIFIER = (SELECT id FROM majors WHERE major_code = 'NN_NNA');

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_KTPM_2022')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_KTPM_2022', N'Chương trình KTPM Khóa 2022', @Major_KTPM, 135, 4.5, N'Chương trình đào tạo kỹ sư KTPM theo chuẩn CDIO áp dụng từ khóa 2022', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_MMT_2022')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_MMT_2022', N'Chương trình MMT Khóa 2022', @Major_MMT, 138, 4.5, N'Chương trình đào tạo kỹ sư Mạng và An toàn thông tin', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_QTKD_2023')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_QTKD_2023', N'Chương trình QTKD Khóa 2023', @Major_QTKD, 120, 4, N'Chương trình cử nhân QTKD cập nhật theo chuẩn AACSB', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_programs WHERE program_code = 'CT_NNA_2023')
    INSERT INTO training_programs (id, program_code, program_name, major_id, total_credits, duration_years, description, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'CT_NNA_2023', N'Chương trình Ngôn ngữ Anh Khóa 2023', @Major_NNA, 125, 4, N'Chương trình cử nhân Ngôn ngữ Anh biên dịch - phiên dịch', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 3. INSERT COURSES (Học phần danh mục)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1301')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1301', N'Nhập môn Lập trình', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT1302')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT1302', N'Cấu trúc Dữ liệu & Giải thuật', 4, 45, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT2203')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT2203', N'Lập trình hướng đối tượng (Java)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3305')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT3305', N'Phát triển ứng dụng Web (Spring Boot)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ECO1101')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ECO1101', N'Kinh tế vĩ mô', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'MGT2201')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'MGT2201', N'Quản trị học đại cương', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG1101')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ENG1101', N'Kỹ năng nghe nói tiếng Anh B1', 2, 15, 45, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'POL1001')
    INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'POL1001', N'Triết học Mác - Lênin', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);



-- ======================================================================
-- 4. INSERT COURSES (Tiếp tục bổ sung học phần danh mục)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3306')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT3306', N'Cơ sở Dữ liệu', N'Database Fundamentals', 4, 30, 45, 30, 'MAJ_REQUIRED', N'Học phần cung cấp kiến thức nền tảng về hệ quản trị CSDL quan hệ và ngôn ngữ SQL', @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3307')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT3307', N'Kiểm thử Phần mềm', N'Software Testing', 3, 30, 30, 15, 'MAJ_ELECTIVE', N'Các phương pháp và kỹ thuật kiểm thử phần mềm hiện đại', @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT4308')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'INT4308', N'Kiến trúc Phần mềm', N'Software Architecture', 3, 30, 15, 30, 'MAJ_REQUIRED', N'Thiết kế kiến trúc hệ thống phần mềm phân tán', @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'NET2201')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'NET2201', N'Mạng Máy tính', N'Computer Networks', 4, 45, 30, 15, 'MAJ_REQUIRED', N'Kiến thức nền tảng về giao thức, mô hình OSI và TCP/IP', @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'NET3302')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'NET3302', N'An toàn Thông tin', N'Information Security', 3, 30, 30, 15, 'MAJ_REQUIRED', N'Các kỹ thuật bảo mật hệ thống, mã hóa và phòng chống tấn công', @Dept_CNTT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ACC2201')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ACC2201', N'Kế toán Tài chính', N'Financial Accounting', 4, 45, 30, 15, 'MAJ_REQUIRED', N'Nguyên lý và phương pháp kế toán tài chính doanh nghiệp', @Dept_KT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG2202')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ENG2202', N'Kỹ năng Viết Tiếng Anh B2', N'English Writing Skills B2', 2, 15, 45, 30, 'MAJ_REQUIRED', N'Rèn luyện kỹ năng viết học thuật và giao tiếp tiếng Anh trình độ B2', @Dept_NN, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG3303')
    INSERT INTO courses (id, course_code, course_name, course_name_en, credits, theory_hours, practice_hours, self_study_hours, course_type, description, department_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), 'ENG3303', N'Dịch Thuật 1', N'Translation 1', 3, 30, 30, 15, 'MAJ_REQUIRED', N'Kỹ năng dịch Anh - Việt các văn bản kinh tế, xã hội', @Dept_NN, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 5. INSERT COURSE_PREREQUISITES (Tiền điều kiện học phần)
-- ======================================================================

DECLARE @Course_NhapMon UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');
DECLARE @Course_CTDLGT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');
DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
DECLARE @Course_CSDL UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3306');
DECLARE @Course_KiemThu UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3307');
DECLARE @Course_KienTruc UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT4308');
DECLARE @Course_Mang UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'NET2201');
DECLARE @Course_ATTT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'NET3302');

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_CTDLGT AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_CTDLGT, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_OOP AND prerequisite_course_id = @Course_NhapMon)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_OOP, @Course_NhapMon, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_CSDL AND prerequisite_course_id = @Course_CTDLGT)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_CSDL, @Course_CTDLGT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_Web AND prerequisite_course_id = @Course_OOP)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_Web, @Course_OOP, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_KiemThu AND prerequisite_course_id = @Course_OOP)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_KiemThu, @Course_OOP, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_KienTruc AND prerequisite_course_id = @Course_Web)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_KienTruc, @Course_Web, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM course_prerequisites WHERE course_id = @Course_ATTT AND prerequisite_course_id = @Course_Mang)
    INSERT INTO course_prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Course_ATTT, @Course_Mang, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- ======================================================================
-- 6. INSERT TRAINING_PROGRAM_COURSES (Gắn học phần vào chương trình đào tạo)
-- ======================================================================

DECLARE @Prog_KTPM UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_KTPM_2022');
DECLARE @Prog_MMT UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_MMT_2022');
DECLARE @Prog_QTKD UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_QTKD_2023');
DECLARE @Prog_NNA UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_NNA_2023');

-- 6.1. Các học phần cho Chương trình Kỹ thuật Phần mềm (KTPM)
IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_KTPM AND course_code = 'INT3306')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_KTPM, @Course_CSDL, 'INT3306', N'Cơ sở Dữ liệu', 3, 2, 1, 'CK_NGANH', 4, 1, N'Bắt buộc học trước CTDLGT', 1, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_KTPM AND course_code = 'INT3307')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_KTPM, @Course_KiemThu, 'INT3307', N'Kiểm thử Phần mềm', 5, 3, 0, 'CK_TUCHON', 3, 1, N'Tự chọn chuyên ngành', 2, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_KTPM AND course_code = 'INT4308')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_KTPM, @Course_KienTruc, 'INT4308', N'Kiến trúc Phần mềm', 7, 4, 1, 'CK_NGANH', 3, 1, N'Học kỳ 7', 3, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- 6.2. Các học phần cho Chương trình Mạng Máy tính & Truyền thông (MMT)
IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_MMT AND course_code = 'NET2201')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_MMT, @Course_Mang, 'NET2201', N'Mạng Máy tính', 3, 2, 1, 'CK_NGANH', 4, 0, NULL, 1, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_MMT AND course_code = 'NET3302')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_MMT, @Course_ATTT, 'NET3302', N'An toàn Thông tin', 5, 3, 1, 'CK_NGANH', 3, 1, N'Bắt buộc có kiến thức Mạng', 2, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_MMT AND course_code = 'INT3306')
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_MMT, @Course_CSDL, 'INT3306', N'Cơ sở Dữ liệu', 5, 3, 0, 'CK_TUCHON', 4, 1, N'Học phần tự chọn ngành Mạng', 3, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- 6.3. Các học phần cho Chương trình Quản trị Kinh doanh (QTKD)
IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_QTKD AND course_code = 'ACC2201')
BEGIN
    DECLARE @Course_KTTC UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ACC2201');
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_QTKD, @Course_KTTC, 'ACC2201', N'Kế toán Tài chính', 3, 2, 1, 'CK_NGANH', 4, 0, N'Kiến thức nền tảng cho QTKD', 1, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);
END

-- 6.4. Các học phần cho Chương trình Ngôn ngữ Anh (NNA)
IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_NNA AND course_code = 'ENG2202')
BEGIN
    DECLARE @Course_VietAnh UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ENG2202');
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_NNA, @Course_VietAnh, 'ENG2202', N'Kỹ năng Viết Tiếng Anh B2', 3, 2, 1, 'CK_NGANH', 2, 0, N'Tiếp nối kỹ năng nghe nói B1', 1, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);
END

IF NOT EXISTS (SELECT 1 FROM training_program_courses WHERE training_program_id = @Prog_NNA AND course_code = 'ENG3303')
BEGIN
    DECLARE @Course_DichThuat UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ENG3303');
    INSERT INTO training_program_courses (id, training_program_id, course_id, course_code, course_name, semester, year, is_required, group_code, credits, is_prerequisite_required, note, sort_order, status, is_active, created_at, updated_at, created_by, updated_by)
    VALUES (NEWID(), @Prog_NNA, @Course_DichThuat, 'ENG3303', N'Dịch Thuật 1', 5, 3, 1, 'CK_NGANH', 3, 0, N'Chuyên ngành biên dịch phiên dịch', 2, 'APPROVED', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);
END
GO