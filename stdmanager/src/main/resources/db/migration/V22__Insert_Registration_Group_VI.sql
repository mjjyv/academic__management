-- stdmanager/src/main/resources/db/migration/V19__Insert_Registration_Group_VI.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @SemesterId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM semesters WHERE semester_code = 'HK1_2024_2025');

-- Nếu chưa có học kỳ mẫu, tạo tạm một bản ghi để tránh lỗi FK
IF @SemesterId IS NULL
BEGIN
    SET @SemesterId = NEWID();
    INSERT INTO semesters (id, semester_code, semester_name, academic_year, start_date, end_date, is_active)
    VALUES (@SemesterId, 'HK1_2024_2025', N'Học kỳ 1 năm 2024-2025', '2024-2025', '2024-08-15', '2025-01-15', 1);
END

-- ======================================================================
-- 2. INSERT REGISTRATION_PERIODS (Đợt đăng ký)
-- ======================================================================
DECLARE @PeriodId UNIQUEIDENTIFIER = NEWID();

IF NOT EXISTS (SELECT 1 FROM registration_periods WHERE name = N'Đợt đăng ký chính thức HK1 - 2024')
BEGIN
    INSERT INTO registration_periods (
        id, name, semester_id, start_time, end_time, target_config, 
        max_credits, min_credits, allow_retake, is_active, 
        created_at, created_by
    )
    VALUES (
        @PeriodId, 
        N'Đợt đăng ký chính thức HK1 - 2024', 
        @SemesterId, 
        '2024-08-01 08:00:00', 
        '2024-08-15 23:59:59', 
        N'{"cohorts": ["K20", "K21", "K22"], "departments": ["CNTT", "KT"]}', 
        25, 12, 1, 1, 
        GETDATE(), @AdminId
    );
END
ELSE SET @PeriodId = (SELECT id FROM registration_periods WHERE name = N'Đợt đăng ký chính thức HK1 - 2024');

-- ======================================================================
-- 3. INSERT EQUIVALENT_COURSES (Môn tương đương)
-- ======================================================================
DECLARE @Course_NhapMon UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');
DECLARE @Course_CấuTrúc UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');

IF @Course_NhapMon IS NOT NULL AND @Course_CấuTrúc IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM equivalent_courses WHERE original_course_id = @Course_NhapMon AND equivalent_course_id = @Course_CấuTrúc)
    BEGIN
        INSERT INTO equivalent_courses (
            id, original_course_id, equivalent_course_id, equivalence_type, 
            effect_date, note, is_active, created_at, created_by
        )
        VALUES (
            NEWID(), @Course_NhapMon, @Course_CấuTrúc, 
            2, -- Tương đương song song
            '2024-01-01', N'Thay đổi mã môn học theo chương trình đào tạo mới 2024', 
            1, GETDATE(), @AdminId
        );
    END
END

-- ======================================================================
-- 4. INSERT COURSE_REGISTRATIONS (Chi tiết đăng ký)
-- ======================================================================
-- Lấy ID sinh viên và Lớp học phần mẫu (Giả định đã có lớp IT101-01 từ Module V)
DECLARE @Stu_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200001');
DECLARE @Stu_Hanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210002');
DECLARE @Section_Web UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'IT101-01');

-- Nếu chưa có Section mẫu (để script chạy được luôn), tạo tạm 1 section
IF @Section_Web IS NULL AND @Course_NhapMon IS NOT NULL
BEGIN
    SET @Section_Web = NEWID();
    INSERT INTO course_sections (id, class_code, course_id, semester_id, status, is_active)
    VALUES (@Section_Web, 'IT101-01', @Course_NhapMon, @SemesterId, 'open', 1);
END

-- Sinh viên Phạm Minh Đức đăng ký học mới
IF @Stu_Duc IS NOT NULL AND @Section_Web IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu_Duc AND course_section_id = @Section_Web)
    BEGIN
        INSERT INTO course_registrations (
            id, student_id, course_section_id, registration_period_id, 
            registration_type, registered_at, status, is_paid, 
            created_at, created_by
        )
        VALUES (
            NEWID(), @Stu_Duc, @Section_Web, @PeriodId, 
            1, -- Học mới
            GETDATE(), 1, 0, 
            GETDATE(), @AdminId
        );
    END
END

-- Sinh viên Nguyễn Thị Hạnh đăng ký học lại
IF @Stu_Hanh IS NOT NULL AND @Section_Web IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu_Hanh AND course_section_id = @Section_Web)
    BEGIN
        INSERT INTO course_registrations (
            id, student_id, course_section_id, registration_period_id, 
            registration_type, registered_at, status, is_paid, 
            created_at, created_by
        )
        VALUES (
            NEWID(), @Stu_Hanh, @Section_Web, @PeriodId, 
            2, -- Học lại
            GETDATE(), 1, 0, 
            GETDATE(), @AdminId
        );
    END
END
GO