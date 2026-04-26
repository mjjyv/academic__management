-- =====================================================
-- FIX DỮ LIỆU SINH VIÊN (NGÀNH HỌC VÀ TRẠNG THÁI)
-- =====================================================

-- 1. Cập nhật Ngành học (Major) cho các Lớp sinh viên dựa trên Khoa
-- (Mỗi khoa thường có một ngành chủ đạo trong dữ liệu mẫu)
UPDATE sc
SET sc.major_id = m.id
FROM student_classes sc
JOIN majors m ON sc.department_id = m.department_id
WHERE sc.major_id IS NULL;
GO

-- 2. Cập nhật Ngành học (Major) cho Sinh viên từ Lớp của họ
UPDATE s
SET s.major_id = sc.major_id
FROM students s
JOIN student_classes sc ON s.class_id = sc.id
WHERE s.major_id IS NULL;
GO

-- 3. Đồng bộ trạng thái hiện tại (status_id) trong bảng students
-- Ưu tiên lấy bản ghi student_status đang active mới nhất
UPDATE s
SET s.status_id = (
    SELECT TOP 1 ss.id 
    FROM student_status ss 
    WHERE ss.student_id = s.id 
    ORDER BY ss.is_active DESC, ss.start_date DESC
)
FROM students s
WHERE s.status_id IS NULL;
GO

-- 4. Đối với những sinh viên hoàn toàn chưa có bản ghi trong student_status,
-- tạo mới một trạng thái 'ACTIVE' và liên kết lại.
DECLARE @NewStatuses TABLE (
    student_id UNIQUEIDENTIFIER,
    status_id UNIQUEIDENTIFIER
);

INSERT INTO student_status (student_id, status_code, status_name, start_date, is_active)
OUTPUT inserted.student_id, inserted.id INTO @NewStatuses
SELECT id, 'ACTIVE', N'Đang học', GETDATE(), 1
FROM students
WHERE status_id IS NULL;

UPDATE s
SET s.status_id = ns.status_id
FROM students s
JOIN @NewStatuses ns ON s.id = ns.student_id;
GO
