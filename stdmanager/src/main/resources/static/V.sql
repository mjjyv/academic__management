-- -- ======================================================================
-- -- 4. INSERT COURSES (Tiếp tục các học phần chuyên ngành & tự chọn)
-- -- ======================================================================

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3306')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'INT3306', N'Cơ sở Dữ liệu Nâng cao', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT3407')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'INT3407', N'Kiểm thử Phần mềm (Software Testing)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'INT4408')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'INT4408', N'Trí tuệ Nhân tạo (AI)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'NET2201')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'NET2201', N'Quản trị Hệ thống Mạng', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'NET3302')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'NET3302', N'An toàn Thông tin & An ninh Mạng', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'FIN2201')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'FIN2201', N'Kế toán Tài chính', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'MKT2202')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'MKT2202', N'Marketing Đại cương', 3, 45, 0, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG2202')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'ENG2202', N'Kỹ năng Viết Học thuật Tiếng Anh', 2, 30, 15, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'ENG3303')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'ENG3303', N'Dịch Thuật 1 (Anh - Việt)', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM courses WHERE course_code = 'PHY1101')
--     INSERT INTO courses (id, course_code, course_name, credits, theory_hours, practice_hours, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), 'PHY1101', N'Vật lý Đại cương 1', 3, 30, 30, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- -- ======================================================================
-- -- 5. INSERT PROGRAM_CURRICULUMS (Chương trình chi tiết / Khối kiến thức)
-- -- ======================================================================

-- DECLARE @Prog_KTPM UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_KTPM_2022');
-- DECLARE @Prog_MMT UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_MMT_2022');
-- DECLARE @Prog_QTKD UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_QTKD_2023');
-- DECLARE @Prog_NNA UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_NNA_2023');

-- -- Khối kiến thức Chung
-- DECLARE @Course_Triet UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'POL1001');
-- DECLARE @Course_Vatly UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'PHY1101');
-- DECLARE @Course_Anh1 UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ENG1101');

-- -- Khối CNTT
-- DECLARE @Course_NMLT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1301');
-- DECLARE @Course_CTDLGT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT1302');
-- DECLARE @Course_OOP UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT2203');
-- DECLARE @Course_Web UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3305');
-- DECLARE @Course_DB UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3306');
-- DECLARE @Course_Testing UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT3407');
-- DECLARE @Course_AI UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'INT4408');
-- DECLARE @Course_Network UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'NET2201');
-- DECLARE @Course_Security UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'NET3302');

-- -- Khối Kinh tế
-- DECLARE @Course_ViMo UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ECO1101');
-- DECLARE @Course_QLT UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MGT2201');
-- DECLARE @Course_KTTC UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'FIN2201');
-- DECLARE @Course_Marketing UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'MKT2202');

-- -- Khối Ngoại ngữ
-- DECLARE @Course_WriteEng UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ENG2202');
-- DECLARE @Course_Translate UNIQUEIDENTIFIER = (SELECT id FROM courses WHERE course_code = 'ENG3303');

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_NMLT)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_NMLT, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_CTDLGT)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_CTDLGT, 2, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_OOP)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_OOP, 2, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_Web)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_Web, 4, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_AI)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_AI, 6, N'Tự chọn', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_MMT AND course_id = @Course_NMLT)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_MMT, @Course_NMLT, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_MMT AND course_id = @Course_Network)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_MMT, @Course_Network, 3, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_MMT AND course_id = @Course_Security)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_MMT, @Course_Security, 5, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_QTKD AND course_id = @Course_ViMo)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_QTKD, @Course_ViMo, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_QTKD AND course_id = @Course_KTTC)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_QTKD, @Course_KTTC, 3, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_QTKD AND course_id = @Course_Marketing)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_QTKD, @Course_Marketing, 4, N'Tự chọn', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_NNA AND course_id = @Course_Anh1)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_NNA, @Course_Anh1, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_NNA AND course_id = @Course_WriteEng)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_NNA, @Course_WriteEng, 3, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_NNA AND course_id = @Course_Translate)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_NNA, @Course_Translate, 5, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- -- Các học phần Đại cương dùng chung
-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_Triet)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_Triet, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_MMT AND course_id = @Course_Triet)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_MMT, @Course_Triet, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_QTKD AND course_id = @Course_Triet)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_QTKD, @Course_Triet, 1, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_KTPM AND course_id = @Course_Anh1)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_KTPM, @Course_Anh1, 2, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM program_curriculums WHERE program_id = @Prog_QTKD AND course_id = @Course_Anh1)
--     INSERT INTO program_curriculums (id, program_id, course_id, semester_order, course_type, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Prog_QTKD, @Course_Anh1, 2, N'Bắt buộc', 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- -- ======================================================================
-- -- 6. INSERT PREREQUISITES (Học phần tiên quyết)
-- -- ======================================================================

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_CTDLGT AND prerequisite_course_id = @Course_NMLT)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_CTDLGT, @Course_NMLT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_OOP AND prerequisite_course_id = @Course_NMLT)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_OOP, @Course_NMLT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_Web AND prerequisite_course_id = @Course_OOP)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_Web, @Course_OOP, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_AI AND prerequisite_course_id = @Course_CTDLGT)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_AI, @Course_CTDLGT, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_Security AND prerequisite_course_id = @Course_Network)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_Security, @Course_Network, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- IF NOT EXISTS (SELECT 1 FROM prerequisites WHERE course_id = @Course_Translate AND prerequisite_course_id = @Course_WriteEng)
--     INSERT INTO prerequisites (id, course_id, prerequisite_course_id, is_active, created_at, updated_at, created_by, updated_by)
--     VALUES (NEWID(), @Course_Translate, @Course_WriteEng, 1, GETDATE(), GETDATE(), @AdminUserId, @AdminUserId);

-- GO