USE stdmanager_db;
GO
-- ======================================================================
-- 1. KHỞI TẠO TRẠNG THÁI CHO CÁC SINH VIÊN ĐÃ CÓ
-- ======================================================================
-- Tạo bảng tạm để lưu Mapping giữa Student và Status mới
DECLARE @StatusMapping TABLE (
    student_id UNIQUEIDENTIFIER,
    status_id UNIQUEIDENTIFIER
);
-- Con trỏ duyệt qua danh sách sinh viên chưa có trạng thái
DECLARE @StudentId UNIQUEIDENTIFIER;
DECLARE student_cursor CURSOR FOR 
SELECT id FROM students WHERE status_id IS NULL;
OPEN student_cursor;
FETCH NEXT FROM student_cursor INTO @StudentId;
WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @NewStatusId UNIQUEIDENTIFIER = NEWID();
    
    -- 1. Chèn vào bảng student_status
    INSERT INTO student_status (id, student_id, status_code, status_name, start_date, is_active)
    VALUES (@NewStatusId, @StudentId, 'ACTIVE', N'Đang học', GETDATE(), 1);
    
    -- 2. Lưu lại ID để update ngược lại bảng students
    INSERT INTO @StatusMapping (student_id, status_id) VALUES (@StudentId, @NewStatusId);
    FETCH NEXT FROM student_cursor INTO @StudentId;
END
CLOSE student_cursor;
DEALLOCATE student_cursor;
-- ======================================================================
-- 2. CẬP NHẬT TRẠNG THÁI HIỆN TẠI VÀO BẢNG STUDENTS
-- ======================================================================
UPDATE s
SET s.status_id = m.status_id
FROM students s
JOIN @StatusMapping m ON s.id = m.student_id;
GO
-- Kiểm tra kết quả
SELECT s.student_code, s.full_name, ss.status_name 
FROM students s
LEFT JOIN student_status ss ON s.status_id = ss.id;