USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN THAM CHIẾU TỪ CÁC NHÓM TRƯỚC
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin'); --
DECLARE @LecturerId UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001'); --
DECLARE @SectionId UNIQUEIDENTIFIER = (SELECT id FROM course_sections WHERE class_code = 'INT1302.01'); --

-- ======================================================================
-- 2. INSERT BẢNG buildings (Tòa nhà)
-- ======================================================================
DECLARE @BuildingId UNIQUEIDENTIFIER = NEWID(); --

INSERT INTO buildings (
    id, building_code, building_name, address, total_floors, 
    building_type, description, note, is_active, 
    created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
)
VALUES (
    @BuildingId, 'TOA_A1', N'Tòa nhà trung tâm A1', N'Số 1, Đại học ABC', 5, 
    'ACADEMIC', N'Tòa nhà giảng đường chính', N'Hoạt động bình thường', 1, 
    GETDATE(), GETDATE(), @AdminId, @AdminId, NULL, NULL
); --

-- ======================================================================
-- 3. INSERT BẢNG rooms (Phòng học)
-- ======================================================================
DECLARE @RoomId UNIQUEIDENTIFIER = NEWID(); --

INSERT INTO rooms (
    id, room_code, room_name, building_id, floor, capacity, 
    room_type, status, has_projector, has_air_conditioner, has_computer, 
    description, is_active, created_at, updated_at, created_by, 
    updated_by, deleted_at, deleted_by
)
VALUES (
    @RoomId, 'A1-101', N'Phòng Lý thuyết 101', @BuildingId, 1, 60, 
    N'Theory', N'Available', 1, 1, 0, 
    N'Phòng học tiêu chuẩn tầng 1', 1, GETDATE(), GETDATE(), @AdminId, 
    @AdminId, NULL, NULL
); --

-- ======================================================================
-- 4. INSERT BẢNG time_slots (Ca học)
-- ======================================================================
DECLARE @SlotId UNIQUEIDENTIFIER = NEWID(); --

INSERT INTO time_slots (
    id, slot_code, start_time, end_time, is_active, 
    created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
)
VALUES (
    @SlotId, 'CA_01', '07:00:00', '09:25:00', 1, 
    GETDATE(), GETDATE(), @AdminId, @AdminId, NULL, NULL
); --

-- ======================================================================
-- 5. INSERT BẢNG schedules (Lịch học chi tiết)
-- ======================================================================
INSERT INTO schedules (
    id, course_section_id, lecturer_id, room_id, day_of_week, 
    date, shift, start_period, end_period, number_of_periods, 
    start_date, end_date, mode, status, schedule_status, 
    note, is_active, created_at, updated_at, created_by, 
    updated_by, deleted_at, deleted_by
)
VALUES (
    NEWID(), @SectionId, @LecturerId, @RoomId, 2, 
    '2026-03-02', N'Sáng', 1, 3, 3, 
    '2026-02-19 00:00:00', '2026-06-30 23:59:59', N'OFFLINE', N'OFFICIAL', 'ACTIVE', 
    N'Lịch học cố định hàng tuần', 1, GETDATE(), GETDATE(), @AdminId, 
    @AdminId, NULL, NULL
); --
GO