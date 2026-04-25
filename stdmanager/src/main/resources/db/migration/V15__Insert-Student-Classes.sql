USE stdmanager_db;
GO

-- 1. TẠO DỮ LIỆU PHỤ THUỘC (NẾU CHƯA CÓ)
-- Chèn Khoa mẫu
IF NOT EXISTS (SELECT 1 FROM departments WHERE code = 'CNTT')
    INSERT INTO departments (id, code, name, established_year) 
    VALUES (NEWID(), 'CNTT', N'Khoa Công nghệ thông tin', 2000);

-- Chèn Ngành mẫu
DECLARE @DeptId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM departments WHERE code = 'CNTT');
IF NOT EXISTS (SELECT 1 FROM majors WHERE major_code = 'KTPM')
    INSERT INTO majors (id, department_id, major_code, major_name) 
    VALUES (NEWID(), @DeptId, 'KTPM', N'Kỹ thuật phần mềm');

-- Lấy ID Cố vấn (Giảng viên đã tạo ở V14)
DECLARE @AdvisorId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM employees WHERE employee_code = 'gv_hoatv');
DECLARE @MajorId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM majors WHERE major_code = 'KTPM');

-- 2. CHÈN DỮ LIỆU MẪU CHO STUDENT_CLASSES
INSERT INTO student_classes (
    id, class_code, class_name, course_year, 
    major_id, department_id, advisor_id, is_active
)
VALUES 
(NEWID(), 'CNTT-K22A', N'Lớp Công nghệ thông tin K22 Khóa A', '2022', @MajorId, @DeptId, @AdvisorId, 1),
(NEWID(), 'CNTT-K22B', N'Lớp Công nghệ thông tin K22 Khóa B', '2022', @MajorId, @DeptId, @AdvisorId, 1),
(NEWID(), 'KTPM-K23A', N'Lớp Kỹ thuật phần mềm K23 Khóa A', '2023', @MajorId, @DeptId, @AdvisorId, 1),
(NEWID(), 'KTPM-K24A', N'Lớp Kỹ thuật phần mềm K24 Khóa A', '2024', @MajorId, @DeptId, NULL, 1); -- Chưa có cố vấn

GO

-- 3. KIỂM TRA DỮ LIỆU
SELECT sc.class_code, sc.class_name, m.major_name, d.name as department_name, sc.course_year
FROM student_classes sc
LEFT JOIN majors m ON sc.major_id = m.id
LEFT JOIN departments d ON sc.department_id = d.id;