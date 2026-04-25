-- stdmanager/src/main/resources/db/migration/V5__Init_Semester_Group_V.sql

-- 1. Bảng semesters: Quản lý thông tin các học kỳ 
CREATE TABLE semesters (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính học kỳ 
    semester_code NVARCHAR(50) NOT NULL UNIQUE, -- Mã học kỳ (VD: HK1_2024_2025) 
    semester_name NVARCHAR(100) NOT NULL, -- Tên học kỳ (VD: Học kỳ 1 năm 2024–2025) 
    academic_year NVARCHAR(20) NOT NULL, -- Năm học (VD: 2024–2025) 
    start_date DATE, -- Ngày bắt đầu học kỳ 
    end_date DATE, -- Ngày kết thúc học kỳ 
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực 
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo 
    updated_at DATETIME2, -- Thời điểm cập nhật 
    created_by UNIQUEIDENTIFIER, -- Người tạo 
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật 
    deleted_at DATETIME2, -- Thời điểm xóa (xóa mềm) 
    deleted_by UNIQUEIDENTIFIER -- Người xóa 
);
GO

-- 2. Bảng course_sections: Quản lý thông tin các lớp học phần 
CREATE TABLE course_sections (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính của lớp học phần 
    class_code VARCHAR(50) NOT NULL UNIQUE, -- Mã lớp học phần (VD: IT101-01) 
    course_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết tới môn học (FK -> courses.id) 
    semester_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết tới học kỳ (FK -> semesters.id) 
    academic_year NVARCHAR(20), -- Năm học 
    lecturer_id UNIQUEIDENTIFIER, -- Giảng viên chính phụ trách 
    room_id UNIQUEIDENTIFIER, -- Phòng học của lớp 
    building_id UNIQUEIDENTIFIER, -- Tòa nhà nơi đặt phòng học 
    max_students INT, -- Sĩ số tối đa 
    min_students INT, -- Sĩ số tối thiểu 
    class_type NVARCHAR(50), -- Loại lớp (theory / lab / hybrid) 
    status NVARCHAR(50), -- Trạng thái (planned / open / closed / canceled) [cite: 16, 17]
    registration_start DATETIME2, -- Thời gian bắt đầu đăng ký 
    registration_end DATETIME2, -- Thời gian kết thúc đăng ký 
    note NVARCHAR(255), -- Ghi chú thêm 
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo 
    updated_at DATETIME2, -- Thời điểm cập nhật 
    created_by UNIQUEIDENTIFIER, -- Người tạo 
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật 
    deleted_at DATETIME2, -- Thời điểm xóa 
    deleted_by UNIQUEIDENTIFIER, -- Người xóa 
    is_active BIT DEFAULT 1 -- Trạng thái hiệu lực 
);
GO


-- 4. Bảng lecturer_course_sections: Quản lý phân công giảng viên 
CREATE TABLE lecturer_course_sections (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- FK -> employees.id (vai trò GIANGVIEN) 
    course_section_id UNIQUEIDENTIFIER NOT NULL, -- FK -> course_sections.id 
    role NVARCHAR(50), -- Vai trò giảng dạy (Giảng viên chính / Giảng viên phụ) 
    is_active BIT DEFAULT 1, -- Trạng thái phân công 
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm phân công 
    updated_at DATETIME2, -- Thời điểm cập nhật 
    created_by UNIQUEIDENTIFIER, -- Người thực hiện phân công 
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật thông tin phân công 
    deleted_at DATETIME2, -- Thời điểm hủy phân công (xóa mềm) 
    deleted_by UNIQUEIDENTIFIER -- Người hủy phân công 
);
GO