-- stdmanager/src/main/resources/db/migration/V22__Insert_Registration_Group_VI.sql

USE stdmanager_db;
GO

-- Xóa dữ liệu rác (do chạy lại script)
DELETE FROM course_registrations;
DELETE FROM equivalent_courses;
DELETE FROM registration_periods;

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @SemesterId UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');

-- ======================================================================
-- 2. INSERT REGISTRATION_PERIODS (Đợt đăng ký)
-- ======================================================================
DECLARE @PeriodId UNIQUEIDENTIFIER = NEWID();

IF @SemesterId IS NOT NULL
BEGIN
    INSERT INTO registration_periods (id, name, semester_id, start_time, end_time, max_credits, min_credits, is_active, created_at, created_by)
    VALUES (
        @PeriodId, N'Đợt đăng ký chính thức HK2 - 2526', @SemesterId, 
        '2025-12-01 00:00:00', '2026-02-15 23:59:59', 24, 12, 1, GETDATE(), @AdminId
    );
END

-- ======================================================================
-- 3. INSERT COURSE_REGISTRATIONS (Chi tiết đăng ký)
-- ======================================================================

DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250001');
DECLARE @Stu2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250002');
DECLARE @Stu3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250003');
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250004');
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250005');
DECLARE @Stu6 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250006');

DECLARE @Sec_CTDL1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01');
DECLARE @Sec_AI1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.01');
DECLARE @Sec_OOP1 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.01');

DECLARE @Sec_CTDL2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.02');
DECLARE @Sec_AI2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1304.02');
DECLARE @Sec_OOP2 UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT2203.02');

-- SV1, SV2, SV3 (KTPM): Đăng ký CTDL, OOP
IF @PeriodId IS NOT NULL
BEGIN
    IF @Stu1 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu1, @Sec_AI1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu1, @Sec_CTDL1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu1, @Sec_OOP1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Stu2 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu2, @Sec_CTDL1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
        
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu2, @Sec_OOP1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu2, @Sec_AI1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Stu3 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu3, @Sec_CTDL1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu3, @Sec_OOP1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu3, @Sec_AI1, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END
END

-- SV4, SV5, SV6 (TTNT): Đăng ký CTDL, AI
IF @PeriodId IS NOT NULL
BEGIN
    IF @Stu4 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu4, @Sec_CTDL2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
        
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu4, @Sec_AI2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu4, @Sec_OOP2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Stu5 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu5, @Sec_CTDL2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
        
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu5, @Sec_AI2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu5, @Sec_OOP2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END

    IF @Stu6 IS NOT NULL
    BEGIN
        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_AI2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_CTDL2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);

        INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, status, is_paid, created_at, created_by)
        VALUES (NEWID(), @Stu6, @Sec_OOP2, @PeriodId, 1, 1, 1, GETDATE(), @AdminId);
    END
END

GO