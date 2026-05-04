-- Enhance_Tuition_Cohort_And_Exemptions.sql

USE stdmanager_db;
GO

-- 1. QUẢN LÝ HỌC PHÍ THEO KHÓA (Cohort Pricing)
-- Bổ sung admission_year vào bảng đơn giá học phí

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('tuition_fees') AND name = 'admission_year')
    ALTER TABLE tuition_fees ADD admission_year INT;

-- 2. QUẢN LÝ MIỄN GIẢM HỌC PHÍ (Tuition Exemptions/Discounts)
-- Lưu thông tin sinh viên được miễn giảm theo chính sách

CREATE TABLE tuition_exemptions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    student_id UNIQUEIDENTIFIER NOT NULL,
    exemption_type NVARCHAR(100), -- VD: Hộ nghèo, Con thương binh, Khuyết tật
    exemption_percentage DECIMAL(5,2), -- Tỉ lệ miễn giảm (0-100%)
    start_semester_id UNIQUEIDENTIFIER, -- Bắt đầu từ học kỳ
    end_semester_id UNIQUEIDENTIFIER,   -- Đến hết học kỳ (NULL nếu vĩnh viễn)
    description NVARCHAR(255),
    is_active BIT DEFAULT 1,
    lock_version INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    CONSTRAINT FK_TuitionExemptions_Students FOREIGN KEY (student_id) REFERENCES students(id)
);

GO


-- Implement_Triggers_And_Conflict_Detection.sql

USE stdmanager_db;
GO

-- 1. TRIGGER TỰ ĐỘNG GHI LỊCH SỬ TRẠNG THÁI SINH VIÊN
-- Tự động chèn bản ghi vào student_status khi students.status_id thay đổi

CREATE TRIGGER trg_StudentStatus_Update
ON students
AFTER UPDATE
AS
BEGIN
    IF UPDATE(status_id)
    BEGIN
        INSERT INTO student_status (id, student_id, status_code, status_name, start_date, created_at, is_active)
        SELECT 
            NEWID(), 
            i.id, 
            'TRIGGER_UPDATED', -- Có thể tinh chỉnh để lấy code từ bảng danh mục trạng thái nếu có
            N'Cập nhật tự động từ hệ thống', 
            CAST(GETDATE() AS DATE), 
            GETDATE(), 
            1
        FROM inserted i
        JOIN deleted d ON i.id = d.id
        WHERE i.status_id <> d.status_id OR (d.status_id IS NULL AND i.status_id IS NOT NULL);
    END
END;
GO

-- 2. TRIGGER KIỂM TRA XUNG ĐỘT LỊCH HỌC (Conflict Detection)
-- Ngăn chặn việc trùng phòng hoặc trùng giảng viên trong cùng một thời điểm

CREATE TRIGGER trg_Schedule_Conflict_Check
ON schedules
AFTER INSERT, UPDATE
AS
BEGIN
    -- Kiểm tra trùng phòng học
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN schedules s ON i.room_id = s.room_id 
            AND i.day_of_week = s.day_of_week
            AND i.id <> s.id
            AND s.is_active = 1
        WHERE (i.start_period BETWEEN s.start_period AND s.end_period)
           OR (i.end_period BETWEEN s.start_period AND s.end_period)
           OR (s.start_period BETWEEN i.start_period AND i.end_period)
    )
    BEGIN
        RAISERROR (N'Xung đột lịch học: Phòng học đã được sử dụng trong khoảng thời gian này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Kiểm tra trùng giảng viên
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN schedules s ON i.lecturer_id = s.lecturer_id 
            AND i.day_of_week = s.day_of_week
            AND i.id <> s.id
            AND s.is_active = 1
        WHERE (i.start_period BETWEEN s.start_period AND s.end_period)
           OR (i.end_period BETWEEN s.start_period AND s.end_period)
           OR (s.start_period BETWEEN i.start_period AND i.end_period)
    )
    BEGIN
        RAISERROR (N'Xung đột lịch học: Giảng viên đã có lịch dạy trong khoảng thời gian này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO



-- Filtered_Indexes_And_Optimizations.sql

USE stdmanager_db;
GO

-- 1. FILTERED UNIQUE INDEXES CHO SOFT DELETE
-- Cho phép dùng lại mã code (username, student_code...) nếu bản ghi cũ đã bị xóa mềm

-- Bảng users: username
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_Users_Username' AND object_id = OBJECT_ID('users'))
    DROP INDEX UQ_Users_Username ON users;

CREATE UNIQUE INDEX UQ_Users_Username_Active 
ON users(username) 
WHERE deleted_at IS NULL;

-- Bảng students: student_code
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_Students_StudentCode' AND object_id = OBJECT_ID('students'))
    DROP INDEX UQ_Students_StudentCode ON students;

CREATE UNIQUE INDEX UQ_Students_StudentCode_Active 
ON students(student_code) 
WHERE deleted_at IS NULL;

-- Bảng employees: employee_code
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_Employees_EmployeeCode' AND object_id = OBJECT_ID('employees'))
    DROP INDEX UQ_Employees_EmployeeCode ON employees;

CREATE UNIQUE INDEX UQ_Employees_EmployeeCode_Active 
ON employees(employee_code) 
WHERE deleted_at IS NULL;

-- Bảng departments: code
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_Departments_Code' AND object_id = OBJECT_ID('departments'))
    DROP INDEX UQ_Departments_Code ON departments;

CREATE UNIQUE INDEX UQ_Departments_Code_Active 
ON departments(code) 
WHERE deleted_at IS NULL;

GO


-- Enhance_Curriculum_And_Prerequisites.sql

USE stdmanager_db;
GO

-- 1. CẢI TIẾN CHƯƠNG TRÌNH ĐÀO TẠO (Curriculum Enhancements)
-- Bổ sung phân loại môn học tự chọn (Elective) và thứ tự ưu tiên

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('training_program_courses') AND name = 'is_elective')
    ALTER TABLE training_program_courses ADD is_elective BIT DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('training_program_courses') AND name = 'elective_group_code')
    ALTER TABLE training_program_courses ADD elective_group_code NVARCHAR(50); -- Nhóm môn tự chọn

-- 2. CẢI TIẾN ĐIỀU KIỆN TIÊN QUYẾT (Prerequisite Enhancements)
-- Phân loại điều kiện (Tiên quyết cứng, Tiên quyết mềm/Song hành)

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('course_prerequisites') AND name = 'prerequisite_type')
    ALTER TABLE course_prerequisites ADD prerequisite_type NVARCHAR(50) DEFAULT 'HARD'; -- HARD, SOFT, COREQUISITE

GO

-- Add_Temporal_Check_Constraints.sql

USE stdmanager_db;
GO

-- 1. Semesters: Start Date must be before End Date
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Semesters_DateRange')
    ALTER TABLE semesters ADD CONSTRAINT CK_Semesters_DateRange CHECK (start_date < end_date);

-- 2. Registration Periods: Start Time must be before End Time
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_RegistrationPeriods_TimeRange')
    ALTER TABLE registration_periods ADD CONSTRAINT CK_RegistrationPeriods_TimeRange CHECK (start_time < end_time);

-- 3. Student Status History: Start Date must be before End Date (if end_date exists)
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_StudentStatus_DateRange')
    ALTER TABLE student_status ADD CONSTRAINT CK_StudentStatus_DateRange CHECK (start_date <= end_date OR end_date IS NULL);

-- 4. Employees: Hire Date must be in the past or reasonably near future
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Employees_HireDate')
    ALTER TABLE employees ADD CONSTRAINT CK_Employees_HireDate CHECK (hire_date <= DATEADD(year, 1, GETDATE()));

-- 5. Tuition Fees: Effective Date check
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_TuitionFees_EffectiveDate')
BEGIN
    -- Dọn dẹp dữ liệu cũ (gán ngày mặc định cho các bản ghi bị NULL)
    UPDATE tuition_fees SET effective_date = '2025-01-01' WHERE effective_date IS NULL;
    ALTER TABLE tuition_fees ADD CONSTRAINT CK_TuitionFees_EffectiveDate CHECK (effective_date IS NOT NULL);
END

GO


-- Implement_Grade_Recalculation_Trigger.sql

USE stdmanager_db;
GO

-- Trigger để tự động tính lại điểm tổng kết khi có sự thay đổi ở điểm thành phần
CREATE OR ALTER TRIGGER TRG_RecalculateStudentSummary
ON student_component_grades
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Lấy danh sách registration_id bị ảnh hưởng
    DECLARE @AffectedRegistrations TABLE (registration_id UNIQUEIDENTIFIER);
    
    INSERT INTO @AffectedRegistrations (registration_id)
    SELECT DISTINCT registration_id FROM inserted
    UNION
    SELECT DISTINCT registration_id FROM deleted;

    -- Cập nhật bảng student_summaries cho từng registration bị ảnh hưởng
    -- Lưu ý: Logic này giả định trọng số (weight) đã được lưu ở bảng grade_components
    UPDATE ss
    SET 
        ss.total_score = Calc.NewTotalScore,
        ss.updated_at = GETDATE()
    FROM student_summaries ss
    INNER JOIN (
        SELECT 
            scg.registration_id,
            SUM(scg.score * (gc.weight_percentage / 100.0)) as NewTotalScore
        FROM student_component_grades scg
        INNER JOIN grade_components gc ON scg.component_id = gc.id
        WHERE scg.registration_id IN (SELECT registration_id FROM @AffectedRegistrations)
          AND scg.deleted_at IS NULL
          AND gc.deleted_at IS NULL
        GROUP BY scg.registration_id
    ) AS Calc ON ss.registration_id = Calc.registration_id
    WHERE ss.is_finalized = 0; -- Chỉ cập nhật nếu chưa chốt điểm

END;
GO


-- Implement_Cascade_Soft_Delete_Triggers.sql

USE stdmanager_db;
GO

-- 1. Trigger cho bảng courses: Khi xóa môn học, xóa các lớp học phần liên quan
CREATE OR ALTER TRIGGER TRG_CascadeSoftDelete_Course
ON courses
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Nếu cột deleted_at được cập nhật từ NULL sang một giá trị (Xóa mềm)
    IF UPDATE(deleted_at)
    BEGIN
        UPDATE cs
        SET cs.deleted_at = i.deleted_at,
            cs.deleted_by = i.deleted_by,
            cs.is_active = 0
        FROM course_sections cs
        INNER JOIN inserted i ON cs.course_id = i.id
        WHERE i.deleted_at IS NOT NULL AND cs.deleted_at IS NULL;
    END
END;
GO

-- 2. Trigger cho bảng course_sections: Khi xóa lớp học phần, xóa các đăng ký liên quan
CREATE OR ALTER TRIGGER TRG_CascadeSoftDelete_Section
ON course_sections
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF UPDATE(deleted_at)
    BEGIN
        UPDATE cr
        SET cr.deleted_at = i.deleted_at,
            cr.deleted_by = i.deleted_by,
            cr.is_active = 0
        FROM course_registrations cr
        INNER JOIN inserted i ON cr.course_section_id = i.id
        WHERE i.deleted_at IS NOT NULL AND cr.deleted_at IS NULL;
    END
END;
GO
