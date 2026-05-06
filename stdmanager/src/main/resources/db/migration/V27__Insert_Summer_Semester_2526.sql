USE stdmanager_db;
GO

-- ======================================================================
-- 1. TẠO HỌC KỲ HÈ 2025-2026
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @SummerSemesterId UNIQUEIDENTIFIER = NEWID();
DECLARE @SummerHLCT_SemesterId UNIQUEIDENTIFIER = NEWID();

INSERT INTO semesters (
    id, semester_code, semester_name, academic_year, start_date, end_date, 
    is_active, created_at, created_by
)
VALUES (
    @SummerSemesterId, '2526_HE', N'Học kỳ hè 2025-2026', '2025-2026', '2026-07-01', '2026-08-15', 
    1, GETDATE(), @AdminId
);


INSERT INTO semesters (
    id, semester_code, semester_name, academic_year, start_date, end_date, 
    is_active, created_at, created_by
)
VALUES (
    @SummerHLCT_SemesterId, '2526_HLCT', N'Học kỳ học lại và cải thiện hè 2526', '2025-2026', '2026-07-01', '2026-08-15', 
    1, GETDATE(), @AdminId
);

-- 2. TẠO ĐỢT ĐĂNG KÝ HỌC HÈ
DECLARE @RegPeriodSummerId UNIQUEIDENTIFIER = NEWID();
INSERT INTO registration_periods (
    id, name, semester_id, start_time, end_time, max_credits, min_credits, is_active, created_at
)
VALUES (
    @RegPeriodSummerId, N'Đợt đăng ký Học kỳ hè 2526', @SummerSemesterId, '2026-05-01 00:00:00', '2026-06-25 23:00:00', 10, 2, 1, GETDATE()
);

-- 3. TẠO ĐỢT ĐĂNG KÝ HỌC LẠI
DECLARE @RegPeriodHLCT_StudyId UNIQUEIDENTIFIER = NEWID();
INSERT INTO registration_periods (
    id, name, semester_id, start_time, end_time, max_credits, min_credits, is_active, created_at
)
VALUES (
    @RegPeriodHLCT_StudyId, N'Đợt đăng ký Học lại kỳ hè 2526', @SummerHLCT_SemesterId, '2026-05-02 00:00:00', '2026-06-25 23:00:00', 10, 2, 1, GETDATE()
);


-- ======================================================================
-- 4. TẠO CÁC LỚP HỌC PHẦN HÈ
-- ======================================================================
DECLARE @Course_Discrete UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MAT1001');
DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
DECLARE @Course_WEB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2204');
DECLARE @Course_CTDLGT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');
DECLARE @GV_Kien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @Building_A1 UNIQUEIDENTIFIER = (SELECT id FROM buildings WHERE building_code = 'TOA_A1');
DECLARE @Room_101 UNIQUEIDENTIFIER = (SELECT id FROM rooms WHERE room_code = 'A1-101');

DECLARE @Section_Discrete UNIQUEIDENTIFIER = NEWID();
DECLARE @Section_WEB UNIQUEIDENTIFIER = NEWID();
DECLARE @Section_CTDLGT UNIQUEIDENTIFIER = NEWID();
DECLARE @Section_OOP UNIQUEIDENTIFIER = NEWID();

INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, status, is_active)
VALUES (@Section_Discrete, 'MAT1001.H01', @Course_Discrete, @SummerSemesterId, '2025-2026', @GV_Kien, @Room_101, @Building_A1, 40, 'open', 1);

INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, status, is_active)
VALUES (@Section_WEB, 'INT2204.H01', @Course_WEB, @SummerSemesterId, '2025-2026', @GV_Kien, @Room_101, @Building_A1, 40, 'open', 1);


INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, status, is_active)
VALUES (@Section_CTDLGT, 'INT1302.HLCT01', @Course_CTDLGT, @SummerHLCT_SemesterId, '2025-2026', @GV_Kien, @Room_101, @Building_A1, 40, 'open', 1);

INSERT INTO course_sections (id, class_code, course_id, semester_id, academic_year, lecturer_id, room_id, building_id, max_students, status, is_active)
VALUES (@Section_OOP, 'INT2203.HLCT01', @Course_OOP, @SummerHLCT_SemesterId, '2025-2026', @GV_Kien, @Room_101, @Building_A1, 40, 'open', 1);

-- ======================================================================
-- 4. TẠO LỊCH HỌC HÈ
-- ======================================================================
-- Lớp Toán rời rạc học Thứ 3 sáng (Tiết 1-3)
INSERT INTO schedules (
    id, course_section_id, lecturer_id, room_id, day_of_week, shift, start_period, end_period, 
    start_date, end_date, mode, status, schedule_status, is_active
)
VALUES (
    NEWID(), @Section_Discrete, @GV_Kien, @Room_101, 3, N'Sáng', 1, 3, 
    '2026-07-01', '2026-08-15', N'ONLINE', N'OPEN', 'ACTIVE', 1
);

-- Lớp Web học Thứ 5 chiều (Tiết 7-9)
INSERT INTO schedules (
    id, course_section_id, lecturer_id, room_id, day_of_week, shift, start_period, end_period, 
    start_date, end_date, mode, status, schedule_status, is_active
)
VALUES (
    NEWID(), @Section_WEB, @GV_Kien, @Room_101, 5, N'Chiều', 7, 9, 
    '2026-07-01', '2026-08-15', N'OFFLINE', N'OPEN', 'ACTIVE', 1
);

-- ======================================================================
-- 5. ĐĂNG KÝ CHO SINH VIÊN K25 HỌC HÈ (Tất cả SV K25)
-- ======================================================================
INSERT INTO course_registrations (id, student_id, course_section_id, registration_period_id, registration_type, registered_at, status, is_paid)
SELECT NEWID(), s.id, sec.id, @RegPeriodSummerId, 1, GETDATE(), 1, 1
FROM students s
CROSS JOIN (
    SELECT id FROM course_sections WHERE class_code IN ('MAT1001.H01', 'INT2204.H01')
) sec
WHERE s.student_code LIKE 'SV2025%';

GO
