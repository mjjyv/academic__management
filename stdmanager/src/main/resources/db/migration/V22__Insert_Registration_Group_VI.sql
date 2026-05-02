-- stdmanager/src/main/resources/db/migration/V22__Insert_Registration_Group_VI.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @SemesterId UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2026_2027');

-- Nếu không tìm thấy HK1_2026_2027, thử tìm bất kỳ HK nào có hiệu lực
IF @SemesterId IS NULL
    SET @SemesterId = (SELECT TOP 1 id FROM semesters WHERE is_active = 1 ORDER BY start_date DESC);

-- ======================================================================
-- 2. INSERT REGISTRATION_PERIODS (Đợt đăng ký)
-- ======================================================================
DECLARE @PeriodId UNIQUEIDENTIFIER = NEWID();
DECLARE @RetakePeriodId UNIQUEIDENTIFIER = NEWID();
DECLARE @ExtraPeriodId UNIQUEIDENTIFIER = NEWID();

IF @SemesterId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM registration_periods WHERE semester_id = @SemesterId AND name LIKE N'%chính thức%')
BEGIN
    INSERT INTO registration_periods (id, name, semester_id, start_time, end_time, max_credits, min_credits, is_active, created_at, created_by)
    VALUES (
        @PeriodId, N'Đợt đăng ký chính thức HK1 - 2026', @SemesterId, 
        '2026-04-01 00:00:00', '2026-09-15 23:59:59', 24, 12, 1, GETDATE(), @AdminId
    );
    
    INSERT INTO registration_periods (id, name, semester_id, start_time, end_time, max_credits, min_credits, is_active, created_at, created_by)
    VALUES (
        @RetakePeriodId, N'Đợt đăng ký học lại/cải thiện HK1 - 2026', @SemesterId, 
        '2026-04-01 00:00:00', '2026-09-30 23:59:59', 12, 0, 1, GETDATE(), @AdminId
    );

    INSERT INTO registration_periods (id, name, semester_id, start_time, end_time, target_config, max_credits, min_credits, allow_retake, is_active, created_at, created_by)
    VALUES (
        @ExtraPeriodId, N'Đợt đăng ký bổ sung HK1 - 2026', @SemesterId, 
        '2026-10-01 08:00:00', '2026-10-10 17:00:00', 
        N'{"target_departments": ["CNTT"], "target_cohorts": ["K2020", "K2021"]}', 28, 0, 1, 1, GETDATE(), @AdminId
    );
END
ELSE 
BEGIN
    SET @PeriodId = (SELECT TOP 1 id FROM registration_periods WHERE semester_id = @SemesterId AND name LIKE N'%chính thức%');
    SET @RetakePeriodId = (SELECT TOP 1 id FROM registration_periods WHERE semester_id = @SemesterId AND name LIKE N'%học lại%');
    SET @ExtraPeriodId = (SELECT TOP 1 id FROM registration_periods WHERE semester_id = @SemesterId AND name LIKE N'%bổ sung%');
END

-- ======================================================================
-- 3. INSERT EQUIVALENT_COURSES (Môn tương đương)
-- ======================================================================
DECLARE @Course_Java UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
DECLARE @Course_Logic UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');
DECLARE @Course_CSharp UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2204');
DECLARE @Course_DB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3306');
DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1303');

IF @Course_Java IS NOT NULL AND @Course_CSharp IS NOT NULL AND NOT EXISTS (SELECT 1 FROM equivalent_courses WHERE original_course_id = @Course_Java AND equivalent_course_id = @Course_CSharp)
    INSERT INTO equivalent_courses (id, original_course_id, equivalent_course_id, equivalence_type, note, is_active, created_at, created_by)
    VALUES (NEWID(), @Course_Java, @Course_CSharp, 1, N'Thay thế Java bằng C# trong chương trình mới', 1, GETDATE(), @AdminId);

IF @Course_Logic IS NOT NULL AND @Course_DB IS NOT NULL AND NOT EXISTS (SELECT 1 FROM equivalent_courses WHERE original_course_id = @Course_Logic AND equivalent_course_id = @Course_DB)
    INSERT INTO equivalent_courses (id, original_course_id, equivalent_course_id, equivalence_type, note, is_active, created_at, created_by)
    VALUES (NEWID(), @Course_Logic, @Course_DB, 2, N'Môn Nhập môn lập trình và Cơ sở dữ liệu có phần kiến thức giao thoa', 1, GETDATE(), @AdminId);

-- ======================================================================
-- 4. INSERT COURSE_REGISTRATIONS (Chi tiết đăng ký)
-- ======================================================================
-- Lấy danh sách SV
DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200001');
DECLARE @Stu2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210002');
DECLARE @Stu3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210003');
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200004');
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200005');
DECLARE @Stu6 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200006');

-- Lấy danh sách Lớp học phần
DECLARE @Sec_Java UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');
DECLARE @Sec_Web UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT3305.01');
DECLARE @Sec_Logic UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1301.01');
DECLARE @Sec_JavaLab UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.L01');

-- SV1: Đăng ký Java (Chính thức), Web (Chính thức)
IF @Stu1 IS NOT NULL AND @PeriodId IS NOT NULL
BEGIN
    IF @Sec_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @Sec_Java)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu1, @Sec_Java, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    
    IF @Sec_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu1 AND course_section_id = @Sec_Web)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu1, @Sec_Web, @PeriodId, 1, 1, 0, GETDATE(), @AdminId);
END

-- SV2: Đăng ký Logic (Học lại - Đợt học lại), JavaLab (Chính thức)
IF @Stu2 IS NOT NULL
BEGIN
    IF @Sec_Logic IS NOT NULL AND @RetakePeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @Sec_Logic)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu2, @Sec_Logic, @RetakePeriodId, 2, 1, 1, GETDATE(), @AdminId);
    
    IF @Sec_JavaLab IS NOT NULL AND @PeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu2 AND course_section_id = @Sec_JavaLab)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu2, @Sec_JavaLab, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
END

-- SV3: Đăng ký Java (Chính thức), Web (Hủy - status 3)
IF @Stu3 IS NOT NULL AND @PeriodId IS NOT NULL
BEGIN
    IF @Sec_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @Sec_Java)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu3, @Sec_Java, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu3 AND course_section_id = @Sec_Web)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu3, @Sec_Web, @PeriodId, 1, 3, 0, GETDATE(), @AdminId);
END

-- SV4: Đăng ký Logic (Chính thức), Java (Cải thiện - status 1)
IF @Stu4 IS NOT NULL
BEGIN
    IF @Sec_Logic IS NOT NULL AND @PeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @Sec_Logic)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu4, @Sec_Logic, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_Java IS NOT NULL AND @RetakePeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu4 AND course_section_id = @Sec_Java)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu4, @Sec_Java, @RetakePeriodId, 3, 1, 0, GETDATE(), @AdminId);
END

-- SV5: Đăng ký Web (Bổ sung), JavaLab (Chờ thanh toán - status 2)
IF @Stu5 IS NOT NULL
BEGIN
    IF @Sec_Web IS NOT NULL AND @ExtraPeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @Sec_Web)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu5, @Sec_Web, @ExtraPeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_JavaLab IS NOT NULL AND @PeriodId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu5 AND course_section_id = @Sec_JavaLab)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu5, @Sec_JavaLab, @PeriodId, 1, 2, 0, GETDATE(), @AdminId);
END

-- SV6: Đăng ký full bộ (Logic, Java, JavaLab, Web)
IF @Stu6 IS NOT NULL AND @PeriodId IS NOT NULL
BEGIN
    IF @Sec_Logic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @Sec_Logic)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_Logic, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_Java IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @Sec_Java)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_Java, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_JavaLab IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @Sec_JavaLab)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_JavaLab, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

    IF @Sec_Web IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_registrations WHERE student_id = @Stu6 AND course_section_id = @Sec_Web)
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_Web, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
END

GO