-- stdmanager/src/main/resources/db/migration/V1__Init_Auth_Group_I.sql

USE stdmanager_db;
GO

-- 2. Bảng roles: Định nghĩa vai trò (ADMIN, GIAOVU, GIANGVIEN, SINHVIEN)
CREATE TABLE roles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    is_system BIT DEFAULT 0, -- Vai trò hệ thống không được xóa [cite: 3]
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 3. Bảng users: Lưu thông tin tài khoản đăng nhập
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    username NVARCHAR(50) NOT NULL UNIQUE, -- 
    password_hash NVARCHAR(255) NOT NULL, -- 
    full_name NVARCHAR(100), -- 
    email NVARCHAR(100),
    phone NVARCHAR(20),
    avatar_url NVARCHAR(255),
    last_login_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 4. Bảng user_roles: Bảng trung gian gán vai trò cho người dùng
CREATE TABLE user_roles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

-- 5. Bảng permissions: Lưu danh sách quyền chi tiết (STUDENT, COURSE, GRADE, ...)
CREATE TABLE permissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(150) NOT NULL,
    module NVARCHAR(100), -- Nhóm chức năng [cite: 4]
    description NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 6. Bảng role_permissions: Gán quyền chi tiết cho từng vai trò
CREATE TABLE role_permissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    role_id UNIQUEIDENTIFIER NOT NULL,
    permission_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
GO



-- stdmanager/src/main/resources/db/migration/V2__Init_Lecturer_Group_III.sql


-- 1. Bảng departments: Khoa / Viện / Phòng ban quản lý 
CREATE TABLE departments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code VARCHAR(10) NOT NULL UNIQUE, -- Mã khoa 
    name NVARCHAR(100) NOT NULL, -- Tên khoa / viện 
    description NVARCHAR(255), -- Mô tả 
    established_year INT, -- Năm thành lập 
    created_at DATETIME2 DEFAULT GETDATE(), -- 
    updated_at DATETIME2, -- 
    created_by UNIQUEIDENTIFIER, -- 
    updated_by UNIQUEIDENTIFIER, -- 
    deleted_at DATETIME2, -- 
    deleted_by UNIQUEIDENTIFIER, -- 
    is_active BIT DEFAULT 1 -- 
);
GO

-- 2. Bảng positions: Định nghĩa chức danh/vị trí công tác
CREATE TABLE positions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    code VARCHAR(10) NOT NULL UNIQUE, -- Mã chức danh
    name NVARCHAR(50) NOT NULL, -- Tên chức danh
    level INT, -- Thứ bậc học thuật
    description NVARCHAR(255), -- Mô tả
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1 --
);
GO

-- 3. Bảng employees: Thông tin giảng viên/nhân viên/giáo vụ 8]
CREATE TABLE employees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- Tài khoản đăng nhập (FK -> users.id) 8]
    employee_code VARCHAR(20) NOT NULL UNIQUE, -- Mã nhân viên 
    full_name NVARCHAR(100) NOT NULL, -- Họ tên 
    date_of_birth DATE, -- Ngày sinh 
    gender NVARCHAR(10), -- Giới tính (1: Nam, 2: Nữ, 0: Khác) 
    email NVARCHAR(100), -- Email 
    phone VARCHAR(20), -- Số điện thoại 
    address NVARCHAR(255), -- Địa chỉ 
    department_id UNIQUEIDENTIFIER, -- Phòng ban / khoa (FK -> departments.id) 
    position_id UNIQUEIDENTIFIER, -- Chức danh (FK -> positions.id)
    hire_date DATE, -- Ngày tuyển dụng 
    contract_type NVARCHAR(255), -- Loại hợp đồng 
    salary_coefficient DECIMAL(4,2), -- Hệ số lương 
    academic_degree NVARCHAR(50), -- Học vị (ThS, TS) 
    academic_title NVARCHAR(50), -- Học hàm (GS, PGS) 
    specialization NVARCHAR(255), -- Chuyên môn 
    created_at DATETIME2 DEFAULT GETDATE(), -- 
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Employees_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Employees_Departments FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT FK_Employees_Positions FOREIGN KEY (position_id) REFERENCES positions(id)
);
GO

-- 4. Bảng lecturer_degrees: Bằng cấp giảng viên 
CREATE TABLE lecturer_degrees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên (FK -> employees.id)
    degree NVARCHAR(50), -- Học vị
    major NVARCHAR(100), -- Chuyên ngành
    university NVARCHAR(150), -- Trường đào tạo
    graduation_year INT, -- Năm tốt nghiệp
    is_highest BIT DEFAULT 0, -- Học vị cao nhất
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Degrees_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO

-- 5. Bảng lecturer_positions_history: Lịch sử chức danh
CREATE TABLE lecturer_positions_history (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    position_id UNIQUEIDENTIFIER NOT NULL, -- Chức danh
    start_date DATE, -- Ngày bắt đầu
    end_date DATE, -- Ngày kết thúc
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_History_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id),
    CONSTRAINT FK_History_Positions FOREIGN KEY (position_id) REFERENCES positions(id)
);
GO

-- 6. Bảng contracts: Thông tin hợp đồng lao động
CREATE TABLE contracts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    contract_type NVARCHAR(50), -- Loại hợp đồng
    start_date DATE, -- Ngày bắt đầu
    end_date DATE, -- Ngày kết thúc
    salary_coefficient DECIMAL(5,2), -- Hệ số lương
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Contracts_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO

-- 7. Bảng lecturer_specializations: Chuyên môn sâu
CREATE TABLE lecturer_specializations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    lecturer_id UNIQUEIDENTIFIER NOT NULL, -- Giảng viên
    specialization NVARCHAR(100), -- Chuyên môn
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    is_active BIT DEFAULT 1, --
    CONSTRAINT FK_Specializations_Employees FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO


-- stdmanager/src/main/resources/db/migration/V3__Init_Student_Group_II.sql


-- ===================== GROUP 2 =======================
-- =====================================================


-- 1. Bảng student_classes: Danh sách lớp hành chính/lớp sinh hoạt
-- Cần tạo trước để bảng students có thể tham chiếu class_id
CREATE TABLE student_classes (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    class_code VARCHAR(20) NOT NULL UNIQUE, -- VD: CNTT-K20A
    class_name NVARCHAR(100) NOT NULL,
    course_year VARCHAR(20), -- Khóa học (VD: 2020)
    major_id UNIQUEIDENTIFIER, -- FK -> majors (Nhóm IV)
    department_id UNIQUEIDENTIFIER, -- FK -> departments (Nhóm III)
    advisor_id UNIQUEIDENTIFIER, -- Cố vấn học tập (FK -> employees)
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1
);
GO

-- 2. Bảng students: Thông tin hồ sơ chi tiết của sinh viên
CREATE TABLE students (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- FK -> users.id (Nhóm I) 
    student_code VARCHAR(20) NOT NULL UNIQUE, -- 
    full_name NVARCHAR(100) NOT NULL, -- 
    date_of_birth DATE, -- 
    gender NVARCHAR(10), -- 1: Nam, 2: Nữ, 0: Khác 
    personal_identification_number VARCHAR(20), -- CMND/CCCD 
    date_of_issue DATE, -- 
    card_place NVARCHAR(100), -- 
    address NVARCHAR(300), -- Địa chỉ thường trú 
    current_address NVARCHAR(300), -- Địa chỉ hiện tại 
    department_id UNIQUEIDENTIFIER, -- FK -> khoa (Nhóm III)
    major_id UNIQUEIDENTIFIER, -- FK -> ngành (Nhóm IV)
    program_id UNIQUEIDENTIFIER, -- FK -> Chương trình đào tạo (Nhóm IV)
    status_id UNIQUEIDENTIFIER, -- Trạng thái hiện tại (Liên kết student_status)
    class_id UNIQUEIDENTIFIER, -- FK -> student_classes.id
    admission_year INT, -- Năm nhập học
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_Students_Users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Students_Classes FOREIGN KEY (class_id) REFERENCES student_classes(id)
);
GO

-- 3. Bảng student_status: Lịch sử trạng thái sinh viên (đang học, bảo lưu, thôi học...)
CREATE TABLE student_status (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    student_id UNIQUEIDENTIFIER NOT NULL,
    status_code NVARCHAR(50),
    status_name NVARCHAR(100),
    start_date DATE,
    end_date DATE,
    description NVARCHAR(255),
    reason NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,
    is_active BIT DEFAULT 1,
    CONSTRAINT FK_StudentStatus_Students FOREIGN KEY (student_id) REFERENCES students(id)
);
GO



-- stdmanager/src/main/resources/db/migration/V4__Init_Course_Group_IV.sql


USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[course_prerequisites]    Script Date: 19/03/2026 9:10:03 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[course_prerequisites](
	[id] [uniqueidentifier] NOT NULL,
	[course_id] [uniqueidentifier] NULL,
	[prerequisite_course_id] [uniqueidentifier] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[courses]    Script Date: 19/03/2026 9:10:03 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[courses](
	[id] [uniqueidentifier] NOT NULL,
	[department_id] [uniqueidentifier] NULL,
	[course_code] [varchar](20) NULL,
	[course_name] [nvarchar](255) NULL,
	[course_name_en] [nvarchar](255) NULL,
	[credits] [decimal](5, 1) NULL,
	[course_type] [varchar](20) NULL,
	[theory_hours] [decimal](5, 1) NULL,
	[practice_hours] [decimal](5, 1) NULL,
	[self_study_hours] [decimal](5, 1) NULL,
	[internship_credits] [decimal](5, 1) NULL,
	[description] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'8737a34d-6df0-4c63-ad6d-1e9d38535acc', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'f657ac56-b1e6-4b0a-9632-0de67b0a09a8', N'23d90512-1d9c-458f-9014-8e95f8c1ed7c', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'd1bf9262-c979-412c-b02d-205ecea00033', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'88309ae4-05cb-4a22-8bb8-2ba37c41b585', N'2f947d0f-d17e-43fa-9aba-f19dfd656660', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'72521cfc-706d-46da-86e4-231ef9441e04', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'e934d41a-104f-4883-accd-08e6d5e83217', N'b49929a8-6ca5-4b7c-8393-8083c3200dd4', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'35aa81a4-9e80-4403-8ad0-343998b6753f', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'a354de1d-9cf6-4379-a2a9-9b4974aa2b2f', N'f6b4a155-d4f1-4078-a350-3776516ca1fa', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'198c2a9e-9f19-4e5b-a72c-3b560e865080', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'79ff4855-2bcb-4c10-8210-8c5ed349ee6a', N'4d0814d7-53cd-4d73-ae3b-4eb3019ab11f', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'85558802-9d24-4079-af63-515a9367e37f', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'42b593ae-2690-4913-b1ba-c276736884b3', N'459ded70-7537-4bca-8113-7c0a84e6917f', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'bcf55261-811d-4d70-b1fd-64d0d44c9236', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'15e60810-afc0-4872-93bb-056c8b2ccbf1', N'e3a0405c-bb9f-40c8-94bc-588aebd8da4c', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'76edfddf-d46a-4964-9295-a06aa97cdc20', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'eb1046a7-01e1-450a-abe8-bc46801bbf74', N'b9d153ec-f8a7-4571-acbe-3063fc5d6ec8', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'2202c649-6ec5-4b44-9167-abc29f6317dd', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'3796ff78-f41c-4c74-a161-45014516f4b9', N'f6e0c451-0229-4701-a778-fe0f6946abaf', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'bc074202-db8f-408e-b70f-aede42851972', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'2f9bbffb-5a49-4e10-9ff4-4d9e9c02769f', N'0fe8501b-eec8-46f4-b34b-fecfe5a5b3ee', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'd81adeb6-98ff-41f6-9660-b0798776753f', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'4234bc10-e548-4036-bd5a-8add916681eb', N'd2fee5d3-51c6-4fda-8a7d-25edaa1b54e0', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'7a6b7335-37ae-42b3-b011-b89947ac1c4a', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'0c6b181d-ad52-413a-8b45-2f0fcad78f6b', N'0472bbeb-9642-423e-9251-1d146ba2067d', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'0c5b37e1-01a8-47fc-beb3-e36276bfa4a8', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'abbef52b-82b2-4c4e-8d9f-c474cc58cf37', N'1da279cf-bda3-49e0-8415-959d04a56e21', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'455e9ba1-d42b-4929-81be-e7222ab32195', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'33a0e277-2cf9-4b9c-8f75-6a503bc43a7c', N'76b1bc12-2586-41e6-b712-ac568d95c3c6', NULL, NULL, 1)
INSERT [dbo].[course_prerequisites] ([id], [course_id], [prerequisite_course_id], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'e9affe0d-101a-4f3c-bf9c-fe4de121f65e', N'9475d676-3c68-4c7b-8994-01859389883d', N'7d634730-4af8-4a51-9e6f-15c00384725b', CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6433333' AS DateTime2), N'56f52a05-6dd7-4f6a-bc5b-f007d9d1c6f2', N'94e88854-e120-4416-9770-6809be66bd9e', NULL, NULL, 1)
GO
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'9475d676-3c68-4c7b-8994-01859389883d', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT005', N'Mạng máy tính', N'Network', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Network', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'c55bedf9-bac2-4e8a-a4d5-606ab320cc87', N'6f336460-49fe-4400-99e4-c9e7437accd9', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'9f8eed99-7137-4bf6-a521-0ff1f5d0c4ac', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT010', N'Web', N'Web Dev', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Web', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'aca705e8-6f7e-49cd-850a-896f761a495f', N'875867e5-2474-4f09-abc2-593f2e402a10', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'7d634730-4af8-4a51-9e6f-15c00384725b', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT009', N'Deep Learning', N'DL', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'DL', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'ae03e2f1-c087-46cb-820f-c594173536ff', N'78825fae-dc79-4143-90d9-423e14b9214d', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'9ec79ac2-5a23-4e03-8a45-191280605d42', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT012', N'Cloud', N'Cloud', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Cloud', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'9ed5371d-43cd-4023-981a-ea7063a179d0', N'8a3f35ef-c518-40e6-9bed-789a9a7b1288', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'e9e6be89-d1db-47d1-858e-1eb36bded6f0', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT002', N'Cấu trúc dữ liệu', N'Data Structures', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'DS', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'ae860d2b-eff7-49a4-8b0b-d05ace918d60', N'ace24499-e3d4-4235-9ee1-b9b61438c2fb', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'0a52865f-93be-4448-9572-216fe1d69aac', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT004', N'Cơ sở dữ liệu', N'Database', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'DB', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'ef5fd346-a9f1-4052-917d-b65676b1cade', N'0123f0d9-c09c-4729-b606-344aee198077', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'78305f0d-b58f-4966-97b3-5025d53836ba', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT013', N'DevOps', N'DevOps', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'DevOps', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'a0102266-28cc-4b5e-b7a1-3b71bd225100', N'58fad324-05b9-452b-a7b6-3c000c105b39', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'fec6611b-f949-42cf-96dc-74d063f3c63a', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT011', N'Mobile', N'Mobile Dev', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Mobile', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'0aa97195-c7fd-425f-97b2-8fbcf9961924', N'd3c9632e-0188-45a3-93c6-067f52e4d6e0', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'ae62842d-060a-46e1-b36b-8d944de0298f', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT006', N'Hệ điều hành', N'OS', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'OS', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'89240245-f844-4219-8d2e-8dfef31ad7cb', N'aafc6f12-d310-437a-9b90-87d9abcb8138', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'260f0199-ae4d-4543-a915-8e50ff3102cd', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT015', N'Blockchain', N'Blockchain', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'BC', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'347dae54-df5e-462f-aa97-011eb0caf48d', N'efbd60d7-9917-4907-a9a9-e64318c2fb5f', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'b56c546b-a01b-4142-a6e7-a3c3e323cc45', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT014', N'Big Data', N'Big Data', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'BigData', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'79988c79-96d9-48d8-9be0-c2760c643f4e', N'261e078a-9191-4e99-8495-bb597c62f210', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'b19173ff-61db-4673-8157-a58565fa5342', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT003', N'Giải thuật', N'Algorithms', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Algo', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'4b41afc1-817f-4561-b3e1-956c383bab52', N'fb44c077-ca50-495e-87fb-f39fb3c730c9', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'd3235641-5cb3-4d9b-8d42-c0c93d7017a0', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT001', N'Lập trình C', N'C Programming', CAST(3.0 AS Decimal(5, 1)), N'Core', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'Môn cơ bản', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'76d327c8-3611-4aad-8ad4-064aa1a71900', N'f5773d06-a867-4dab-a993-8865aff76061', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'a1cb5881-1edf-47ad-a5b2-d2255ffdab0b', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT008', N'Machine Learning', N'ML', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'ML', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'09f20adc-43fb-48b2-887f-78682b981983', N'792717be-8245-4c63-aae6-c5d5068e8866', NULL, NULL, 1)
INSERT [dbo].[courses] ([id], [department_id], [course_code], [course_name], [course_name_en], [credits], [course_type], [theory_hours], [practice_hours], [self_study_hours], [internship_credits], [description], [created_at], [updated_at], [created_by], [updated_by], [deleted_at], [deleted_by], [is_active]) VALUES (N'b721e8b7-bcd1-44aa-a3b8-dc7bcf4e86ab', N'48dce894-1a5e-4f1f-aa54-0317b946faf8', N'IT007', N'AI cơ bản', N'AI Basic', CAST(3.0 AS Decimal(5, 1)), N'Elective', CAST(30.0 AS Decimal(5, 1)), CAST(15.0 AS Decimal(5, 1)), CAST(45.0 AS Decimal(5, 1)), CAST(0.0 AS Decimal(5, 1)), N'AI', CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), CAST(N'2026-03-19T09:02:23.6233333' AS DateTime2), N'7b119b7e-2e66-4fea-90ef-850f111da0a5', N'4ac1248e-7cfb-4322-864f-d67ebc1195bc', NULL, NULL, 1)
GO





USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[majors]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[majors](
	[id] [uniqueidentifier] NOT NULL,
	[department_id] [uniqueidentifier] NULL,
	[major_code] [varchar](20) NULL,
	[major_name] [nvarchar](255) NULL,
	[description] [nvarchar](max) NULL,
	[effective_date] [date] NULL,
	[expiry_date] [date] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[training_program_courses]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[training_program_courses](
	[id] [uniqueidentifier] NOT NULL,
	[training_program_id] [uniqueidentifier] NULL,
	[course_id] [uniqueidentifier] NULL,
	[course_code] [varchar](50) NULL,
	[course_name] [nvarchar](255) NULL,
	[semester] [int] NULL,
	[year] [int] NULL,
	[is_required] [bit] NULL,
	[group_code] [nvarchar](50) NULL,
	[credits] [decimal](5, 1) NULL,
	[prerequisite_course_id] [uniqueidentifier] NULL,
	[is_prerequisite_required] [bit] NULL,
	[note] [nvarchar](500) NULL,
	[sort_order] [int] NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[training_programs]    Script Date: 19/03/2026 9:06:40 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[training_programs](
	[id] [uniqueidentifier] NOT NULL,
	[program_code] [varchar](50) NULL,
	[program_name] [nvarchar](255) NULL,
	[program_name_en] [nvarchar](255) NULL,
	[major_id] [uniqueidentifier] NULL,
	[department_id] [uniqueidentifier] NULL,
	[degree_level] [nvarchar](50) NULL,
	[education_type] [nvarchar](50) NULL,
	[total_credits] [decimal](5, 1) NULL,
	[required_credits] [decimal](5, 1) NULL,
	[elective_credits] [decimal](5, 1) NULL,
	[internship_credits] [decimal](5, 1) NULL,
	[thesis_credits] [decimal](5, 1) NULL,
	[admission_year] [date] NULL,
	[duration_years] [decimal](5, 1) NULL,
	[max_duration_years] [decimal](5, 1) NULL,
	[effective_date] [date] NULL,
	[expiry_date] [date] NULL,
	[description] [nvarchar](max) NULL,
	[objectives] [nvarchar](max) NULL,
	[learning_outcomes] [nvarchar](max) NULL,
	[version] [nvarchar](20) NULL,
	[status] [nvarchar](20) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO




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



-- stdmanager/src/main/resources/db/migration/V6__Init_Registration_Group_VI.sql

USE stdmanager_db
GO

-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS course_registrations;
GO

CREATE TABLE course_registrations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    student_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng students 
    course_section_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng course_sections 
    registration_period_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng registration_periods 
    registration_type TINYINT NOT NULL, -- 1: Học mới; 2: Học lại; 3: Cải thiện 
    replaced_grade_id UNIQUEIDENTIFIER NULL, -- ID điểm cũ nếu học lại/cải thiện 
    registered_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm thực hiện đăng ký 
    status TINYINT DEFAULT 1, -- 1: Thành công; 2: Chờ thanh toán; 3: Đã hủy [cite: 22]
    is_paid BIT DEFAULT 0, -- Trạng thái thanh toán [cite: 22]
    row_version ROWVERSION, -- Xử lý tranh chấp dữ liệu (concurrency) [cite: 22]

    -- Các trường thông tin hệ thống [cite: 22]
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER
);




-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS equivalent_courses;
GO


CREATE TABLE equivalent_courses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính 
    original_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn cũ/gốc 
    equivalent_course_id UNIQUEIDENTIFIER NOT NULL, -- FK môn mới/thay thế 
    equivalence_type TINYINT NOT NULL, -- 1: Thay thế hoàn toàn; 2: Tương đương song song 
    effect_date DATE DEFAULT GETDATE(), -- Ngày bắt đầu áp dụng 
    note NVARCHAR(500), -- Lý do tương đương 
    
    -- Các trường thông tin hệ thống 
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc tránh trùng lặp môn gốc và môn tương đương
    CONSTRAINT CHK_NotSameCourse CHECK (original_course_id <> equivalent_course_id)
);



-- ======================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI 
-- ======================================================================
DROP TABLE IF EXISTS registration_periods;
GO

CREATE TABLE registration_periods (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính [cite: 16]
    name NVARCHAR(200) NOT NULL, -- Tên đợt đăng ký [cite: 16]
    semester_id UNIQUEIDENTIFIER NOT NULL, -- FK liên kết bảng semesters [cite: 16]
    start_time DATETIME2 NOT NULL, -- Thời điểm bắt đầu [cite: 17]
    end_time DATETIME2 NOT NULL, -- Thời điểm kết thúc [cite: 17]
    target_config NVARCHAR(MAX), -- Cấu hình đối tượng dạng JSON (Khóa, Khoa...) [cite: 18]
    max_credits TINYINT DEFAULT 25, -- Số tín chỉ tối đa [cite: 18]
    min_credits TINYINT DEFAULT 12, -- Số tín chỉ tối thiểu [cite: 19]
    allow_retake BIT DEFAULT 1, -- Cho phép học lại/cải thiện [cite: 19]
    
    -- Các trường thông tin hệ thống [cite: 20]
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2,
    created_by UNIQUEIDENTIFIER,
    updated_by UNIQUEIDENTIFIER,
    deleted_at DATETIME2,
    deleted_by UNIQUEIDENTIFIER,

    -- Ràng buộc logic thời gian
    CONSTRAINT CHK_RegistrationTime CHECK (end_time > start_time)
);




-- stdmanager/src/main/resources/db/migration/V7__Init_Schedule_Group_VII.sql

-- 1. Bảng buildings: Quản lý thông tin tòa nhà 35]
CREATE TABLE buildings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    building_code VARCHAR(10) NOT NULL UNIQUE, -- Mã tòa nhà
    building_name NVARCHAR(100) NOT NULL, -- Tên tòa nhà
    address NVARCHAR(200), -- Địa chỉ khuôn viên
    total_floors TINYINT, -- Tổng số tầng
    building_type VARCHAR(10), -- Loại tòa nhà
    description NVARCHAR(255), -- Mô tả chức năng
    note NVARCHAR(255), -- Ghi chú vận hành
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực 35]
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER --
);
GO

-- 2. Bảng rooms: Quản lý thông tin chi tiết phòng học 29]
CREATE TABLE rooms (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    room_code VARCHAR(20) NOT NULL UNIQUE, -- Mã phòng
    room_name NVARCHAR(100), -- Tên đầy đủ của phòng
    building_id UNIQUEIDENTIFIER NOT NULL, -- Khóa ngoại liên kết Buildings
    floor INT, -- Vị trí tầng
    capacity INT, -- Sức chứa sinh viên
    room_type NVARCHAR(50), -- Loại phòng (Lab, lý thuyết...)
    status NVARCHAR(50), -- Tình trạng sử dụng
    has_projector BIT DEFAULT 0, --
    has_air_conditioner BIT DEFAULT 0, --
    has_computer BIT DEFAULT 0, --
    description NVARCHAR(255), --
    is_active BIT DEFAULT 1, --
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    CONSTRAINT FK_Rooms_Buildings FOREIGN KEY (building_id) REFERENCES Buildings(id)
);
GO

-- 3. Bảng time_slots: Định nghĩa khung giờ ca học 32, 33]
CREATE TABLE time_slots (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    slot_code NVARCHAR(50) NOT NULL UNIQUE, -- Mã ca học (Ca1, Ca2...)
    start_time TIME NOT NULL, -- Giờ bắt đầu
    end_time TIME NOT NULL, -- Giờ kết thúc
    is_active BIT DEFAULT 1, -- 32]
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER --
);
GO

-- 5. Bảng schedules: Lịch học chi tiết cho từng lớp học phần 30]
CREATE TABLE schedules (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    course_section_id UNIQUEIDENTIFIER NOT NULL, -- FK -> course_sections
    lecturer_id UNIQUEIDENTIFIER, -- Giảng viên phụ trách
    room_id UNIQUEIDENTIFIER, -- Phòng học
    day_of_week INT, -- Thứ trong tuần
    date DATE, -- Ngày cụ thể 
    shift NVARCHAR(50), -- Ca học
    start_period INT, -- Tiết bắt đầu
    end_period INT, -- Tiết kết thúc
    number_of_periods INT, -- Số tiết thực tế
    start_date DATETIME2, -- Ngày bắt đầu học phần
    end_date DATETIME2, -- Ngày kết thúc học phần
    mode NVARCHAR(100), -- ONLINE/OFFLINE/HYBRID
    status NVARCHAR(255), -- Trạng thái (OFFICIAL/CANCELLED...)
    schedule_status VARCHAR(50), -- Trạng thái lịch
    note NVARCHAR(255), -- Ghi chú thay đổi lịch
    is_active BIT DEFAULT 1, --
    created_at DATETIME2 DEFAULT GETDATE(), --
    updated_at DATETIME2, --
    created_by UNIQUEIDENTIFIER, --
    updated_by UNIQUEIDENTIFIER, --
    deleted_at DATETIME2, --
    deleted_by UNIQUEIDENTIFIER, --
    CONSTRAINT FK_Schedules_Rooms FOREIGN KEY (room_id) REFERENCES Rooms(id),
    CONSTRAINT FK_Schedules_Lecturers FOREIGN KEY (lecturer_id) REFERENCES employees(id)
);
GO


-- stdmanager/src/main/resources/db/migration/V8__Init_Grade_Group_VIII.sql

USE [stdmanager_db]
GO
/****** Object:  Table [dbo].[grade_components]    Script Date: 19/03/2026 7:56:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grade_components](
	[id] [uniqueidentifier] NOT NULL,
	[course_section_id] [uniqueidentifier] NOT NULL,
	[component_code] [varchar](20) NOT NULL,
	[component_name] [nvarchar](50) NOT NULL,
	[weight_percentage] [decimal](5, 2) NULL,
	[min_score] [decimal](4, 2) NULL,
	[max_score] [decimal](4, 2) NULL,
	[is_required] [bit] NOT NULL,
	[allow_retake] [bit] NOT NULL,
	[input_order] [int] NULL,
	[note] [nvarchar](255) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_grade_components] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((0)) FOR [is_required]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((0)) FOR [allow_retake]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[grade_components] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO



/****** Object:  Table [dbo].[grade_scales]    Script Date: 3/19/2026 7:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grade_scales](
	[id] [uniqueidentifier] NOT NULL,
	[scale_code] [varchar](10) NOT NULL,
	[min_score] [decimal](4, 2) NULL,
	[max_score] [decimal](4, 2) NULL,
	[letter_grade] [varchar](2) NULL,
	[gpa_value] [decimal](3, 2) NULL,
	[description] [nvarchar](100) NULL,
	[is_pass] [bit] NOT NULL,
	[display_order] [int] NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_grade_scales] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT ((0)) FOR [is_pass]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[grade_scales] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO


-- 4. Bảng student_component_grades: Điểm thành phần
CREATE TABLE [dbo].[student_component_grades](
	[id] [uniqueidentifier] NOT NULL,
	[registration_id] [uniqueidentifier] NOT NULL,
	[component_id] [uniqueidentifier] NOT NULL,
	[score] [decimal](4, 2) NULL,
	[is_retake] [bit] NOT NULL,
	[is_locked] [bit] NOT NULL,
	[graded_at] [datetime2](7) NULL,
	[graded_by] [uniqueidentifier] NULL,
	[note] [nvarchar](255) NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_student_component_grades] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((0)) FOR [is_retake]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((0)) FOR [is_locked]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[student_component_grades] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO

-- 5. Bảng student_summaries: Điểm tổng kết
CREATE TABLE [dbo].[student_summaries](
	[id] [uniqueidentifier] NOT NULL,
	[registration_id] [uniqueidentifier] NOT NULL,
	[total_score] [decimal](4, 2) NULL,
	[scale_id] [uniqueidentifier] NULL,
	[letter_grade] [varchar](2) NULL,
	[gpa_value] [decimal](3, 2) NULL,
	[result] [varchar](10) NULL,
	[is_finalized] [bit] NOT NULL,
	[is_active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_at] [datetime2](7) NOT NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
 CONSTRAINT [PK_student_summaries] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (newsequentialid()) FOR [id]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT ((0)) FOR [is_finalized]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[student_summaries] ADD  DEFAULT (sysdatetime()) FOR [updated_at]
GO



-- stdmanager/src/main/resources/db/migration/V9__Init_Tuition_Group_IX.sql

-- 1. Bảng tuition_fees: Mức định mức học phí theo tín chỉ hoặc chương trình
CREATE TABLE tuition_fees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    program_id UNIQUEIDENTIFIER, -- Liên kết với bảng Chương trình đào tạo
    course_year VARCHAR(10), -- Khóa học (Ví dụ: K23, K24)
    price_per_credit DECIMAL(15, 2), -- Đơn giá cho mỗi tín chỉ
    base_tuition DECIMAL(15, 2), -- Học phí cố định mỗi kỳ
    effective_date DATE, -- Ngày bắt đầu áp dụng mức phí
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo định mức
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật định mức
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 2. Bảng student_tuition: Học phí sinh viên theo từng học kỳ
CREATE TABLE student_tuition (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    student_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng sinh viên
    semester_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng học kỳ
    tuition_fee_id UNIQUEIDENTIFIER, -- FK tham chiếu tuition_fees
    total_credits INT, -- Tổng số tín chỉ đăng ký trong kỳ
    raw_amount DECIMAL(15, 2), -- Tổng tiền gốc (tín chỉ x đơn giá)
    scholarship_deduction DECIMAL(15, 2), -- Số tiền được trừ từ học bổng
    exemption_amount DECIMAL(15, 2), -- Số tiền được miễn giảm chính sách
    net_amount DECIMAL(15, 2), -- Số tiền thực nộp (gốc - giảm - học bổng)
    paid_amount DECIMAL(15, 2) DEFAULT 0, -- Tổng số tiền đã nộp
    debt_amount DECIMAL(15, 2), -- Số tiền còn nợ
    status TINYINT, -- Trạng thái: 1-PAID, 2-PARTIAL, 3-DEBT, 4-OVERDUE
    deadline DATE, -- Hạn chót hoàn thành học phí
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo bản ghi
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo/Hệ thống tạo
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện xóa
    CONSTRAINT FK_StudentTuition_Students FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT FK_StudentTuition_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT FK_StudentTuition_TuitionFees FOREIGN KEY (tuition_fee_id) REFERENCES tuition_fees(id)
);
GO

-- 3. Bảng payments: Lịch sử giao dịch thanh toán học phí
CREATE TABLE payments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính giao dịch
    tuition_id UNIQUEIDENTIFIER NOT NULL, -- Liên kết với bảng student_tuition
    amount_paid DECIMAL(15, 2) NOT NULL, -- Số tiền nộp trong lần này
    payment_date DATETIME2 DEFAULT GETDATE(), -- Ngày giờ thực tế giao dịch
    payment_method TINYINT, -- 1-Bank Transfer, 2-Cash, 3-E-wallet
    payment_status VARCHAR(20), -- PENDING, SUCCESS, FAILED, REFUNDED, CANCELLED
    transaction_ref VARCHAR(100), -- Mã tham chiếu ngân hàng
    cashier_id UNIQUEIDENTIFIER, -- Người thu tiền hoặc hệ thống tự động
    notes NVARCHAR(MAX), -- Ghi chú thêm
    is_active BIT DEFAULT 1, -- Trạng thái giao dịch
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm ghi nhận vào hệ thống
    updated_at DATETIME2, -- Thời điểm cập nhật cuối
    created_by UNIQUEIDENTIFIER, -- Người thực hiện ghi nhận
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật thông tin
    deleted_at DATETIME2, -- Thời điểm hủy/xóa giao dịch
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện hủy
    CONSTRAINT FK_Payments_StudentTuition FOREIGN KEY (tuition_id) REFERENCES student_tuition(id)
);
GO



-- stdmanager/src/main/resources/db/migration/V10__Init_Exam_Group_X.sql

USE [stdmanager_db]
GO

-- 1. Bảng exam_types (Loại kỳ thi)
CREATE TABLE [dbo].[exam_types](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [name] [nvarchar](100) NOT NULL,
    [description] [nvarchar](MAX) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

-- 2. Bảng exams (Lịch thi)
CREATE TABLE [dbo].[exams](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_type_id] [uniqueidentifier] NOT NULL,
    [course_section_id] [uniqueidentifier] NOT NULL, -- Sẽ liên kết với bảng lớp học/học phần sau
    [semester_id] [uniqueidentifier] NOT NULL,     -- Sẽ liên kết với bảng học kỳ sau
    [exam_date] [date] NULL,
    [start_time] [time](7) NULL,
    [duration_minutes] [smallint] NULL,
    [end_time] [time](7) NULL,
    [exam_format] [varchar](20) NULL,
    [exam_status] [varchar](20) NULL,
    [supervisor_count] [tinyint] DEFAULT 1,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Exams_ExamTypes] FOREIGN KEY([exam_type_id]) REFERENCES [dbo].[exam_types] ([id]),
CONSTRAINT [FK_Exams_CourseSections] FOREIGN KEY([course_section_id]) REFERENCES [dbo].[course_sections] ([id]),
CONSTRAINT [FK_Exams_Semesters] FOREIGN KEY([semester_id]) REFERENCES [dbo].[semesters] ([id])
) ON [PRIMARY]
GO

-- 3. Bảng exam_rooms (Phòng thi)
CREATE TABLE [dbo].[exam_rooms](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [room_id] [uniqueidentifier] NOT NULL, -- Liên kết với danh mục phòng học chung
    [capacity] [int] NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_ExamRooms_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id])
) ON [PRIMARY]
GO

-- 4. Bảng exam_registrations (Danh sách thí sinh)
CREATE TABLE [dbo].[exam_registrations](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [exam_room_id] [uniqueidentifier] NOT NULL,
    [student_id] [uniqueidentifier] NOT NULL,
    [roll_number] [varchar](20) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Registrations_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id]),
CONSTRAINT [FK_Registrations_ExamRooms] FOREIGN KEY([exam_room_id]) REFERENCES [dbo].[exam_rooms] ([id]),
CONSTRAINT [FK_Registrations_Students] FOREIGN KEY([student_id]) REFERENCES [dbo].[students] ([id])
) ON [PRIMARY]
GO

-- 5. Bảng exam_results (Kết quả thi)
CREATE TABLE [dbo].[exam_results](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [registration_id] [uniqueidentifier] NOT NULL,
    [score] [decimal](4, 2) NULL,
    [status] [nvarchar](50) NULL,
    [graded_by] [uniqueidentifier] NULL,
    [graded_at] [datetime] NULL,
    [is_locked] [bit] DEFAULT 0,
    [appeal_status] [varchar](20) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Results_Registrations] FOREIGN KEY([registration_id]) REFERENCES [dbo].[exam_registrations] ([id])
) ON [PRIMARY]
GO

-- 6. Bảng exam_papers (Đề thi)
CREATE TABLE [dbo].[exam_papers](
    [id] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
    [exam_id] [uniqueidentifier] NOT NULL,
    [paper_code] [varchar](20) NULL,
    [file_url] [nvarchar](500) NULL,
    [created_at] [datetime2] DEFAULT GETDATE(),
    [updated_at] [datetime2] NULL,
    [created_by] [uniqueidentifier] NULL,
    [updated_by] [uniqueidentifier] NULL,
    [deleted_at] [datetime2] NULL,
    [deleted_by] [uniqueidentifier] NULL,
    [is_active] [bit] DEFAULT 1,
PRIMARY KEY CLUSTERED ([id] ASC),
CONSTRAINT [FK_Papers_Exams] FOREIGN KEY([exam_id]) REFERENCES [dbo].[exams] ([id])
) ON [PRIMARY]
GO



-- stdmanager/src/main/resources/db/migration/V11__Init_Graduation_Group_XI.sql

USE [stdmanager_db]
GO

/****** Object:  Table [dbo].[graduation_conditions]    Script Date: 19/03/2026 08:21:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[graduation_conditions](
	[id] [uniqueidentifier] NOT NULL,
	[program_id] [uniqueidentifier] NOT NULL,
	[applied_cohort] [nvarchar](10) NULL,
	[min_total_credits] [int] NULL,
	[min_gpa] [decimal](3, 2) NULL,
	[max_failed_credits] [int] NULL,
	[english_requirement] [nvarchar](100) NULL,
	[it_requirement] [nvarchar](100) NULL,
	[conduct_required] [nvarchar](50) NULL,
	[note] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[graduation_conditions] ADD  DEFAULT ((1)) FOR [is_active]
GO



/****** Object:  Table [dbo].[graduation_results]    Script Date: 19/03/2026 08:23:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[graduation_results](
	[id] [uniqueidentifier] NOT NULL,
	[student_id] [uniqueidentifier] NOT NULL,
	[condition_id] [uniqueidentifier] NULL,
	[gpa] [decimal](3, 2) NULL,
	[total_credits] [int] NULL,
	[failed_credits] [int] NULL,
	[result] [tinyint] NULL,
	[classification] [tinyint] NULL,
	[decision_date] [date] NULL,
	[reviewer] [uniqueidentifier] NULL,
	[note] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[graduation_results] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[graduation_results]  WITH CHECK ADD  CONSTRAINT [FK_GraduationResults_Conditions] FOREIGN KEY([condition_id])
REFERENCES [dbo].[graduation_conditions] ([id])
GO
ALTER TABLE [dbo].[graduation_results] CHECK CONSTRAINT [FK_GraduationResults_Conditions]
GO



-- stdmanager/src/main/resources/db/migration/V12__Init_Notification_Group_XII.sql


USE [stdmanager_db]
GO

/****** Object:  Table [dbo].[logs]    Script Date: 3/19/2026 8:49:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[logs](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[action] [nvarchar](100) NULL,
	[table_name] [nvarchar](100) NULL,
	[record_id] [uniqueidentifier] NULL,
	[description] [nvarchar](max) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[logs] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[logs]  WITH CHECK ADD  CONSTRAINT [FK_logs_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[logs] CHECK CONSTRAINT [FK_logs_user]
GO




/****** Object:  Table [dbo].[notifications]    Script Date: 3/19/2026 8:45:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[notifications](
	[id] [uniqueidentifier] NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[content] [nvarchar](max) NULL,
	[type_id] [uniqueidentifier] NULL,
	[target_role_id] [uniqueidentifier] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD  CONSTRAINT [FK_notifications_role] FOREIGN KEY([target_role_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[notifications] CHECK CONSTRAINT [FK_notifications_role]
GO



/****** Object:  Table [dbo].[settings]    Script Date: 3/19/2026 8:50:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[settings](
	[id] [uniqueidentifier] NOT NULL,
	[key] [nvarchar](100) NOT NULL,
	[value] [nvarchar](max) NULL,
	[description] [nvarchar](255) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[created_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[settings] ADD  DEFAULT (getdate()) FOR [created_at]
GO




/****** Object:  Table [dbo].[user_notifications]    Script Date: 3/19/2026 8:47:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_notifications](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[notification_id] [uniqueidentifier] NOT NULL,
	[is_read] [bit] NULL,
	[read_at] [datetime2](7) NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[deleted_at] [datetime2](7) NULL,
	[deleted_by] [uniqueidentifier] NULL,
	[updated_by] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT ((0)) FOR [is_read]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT ((1)) FOR [is_active]
GO
ALTER TABLE [dbo].[user_notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[user_notifications]  WITH CHECK ADD  CONSTRAINT [FK_user_notifications_notification] FOREIGN KEY([notification_id])
REFERENCES [dbo].[notifications] ([id])
GO
ALTER TABLE [dbo].[user_notifications] CHECK CONSTRAINT [FK_user_notifications_notification]
GO
ALTER TABLE [dbo].[user_notifications]  WITH CHECK ADD  CONSTRAINT [FK_user_notifications_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_notifications] CHECK CONSTRAINT [FK_user_notifications_user]
GO



-- stdmanager/src/main/resources/db/migration/V13__Init_Email_Group_XIV.sql

-- 1. Bảng email_templates: Lưu trữ các mẫu email (tiêu đề, nội dung HTML) dùng chung 104]
CREATE TABLE email_templates (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính mẫu email
    name NVARCHAR(255) NOT NULL, -- Tên mẫu email
    subject NVARCHAR(255), -- Tiêu đề mặc định của email
    body_html NVARCHAR(MAX), -- Nội dung email định dạng HTML
    is_active BIT DEFAULT 1, -- Trạng thái sử dụng
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo mẫu
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật cuối
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 2. Bảng smtp_configs: Lưu cấu hình kết nối máy chủ gửi email (SMTP) 115]
CREATE TABLE smtp_configs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính cấu hình
    host NVARCHAR(255) NOT NULL, -- Máy chủ SMTP
    port INT, -- Cổng SMTP
    username NVARCHAR(255), -- Tên đăng nhập
    password NVARCHAR(255), -- Mật khẩu (đã mã hóa)
    encryption NVARCHAR(50), -- TLS / SSL
    is_active BIT DEFAULT 1, -- Cấu hình đang sử dụng
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo cấu hình
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa
    deleted_by UNIQUEIDENTIFIER -- Người xóa
);
GO

-- 3. Bảng email_groups: Định nghĩa nhóm người nhận (theo lớp, khoa, hoặc loại đối tượng) 108]
CREATE TABLE email_groups (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    group_name NVARCHAR(200) NOT NULL, -- Tên nhóm người nhận
    group_type NVARCHAR(100), -- Loại nhóm (Lớp/Khoa/SV)
    description NVARCHAR(500), -- Mô tả nhóm
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo nhóm
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật nhóm
    deleted_at DATETIME2, -- Thời điểm xóa mềm
    deleted_by UNIQUEIDENTIFIER -- Người thực hiện xóa
);
GO

-- 4. Bảng email_queue: Hàng đợi chứa các email đang chờ hệ thống gửi tự động 111]
CREATE TABLE email_queue (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính hàng đợi
    recipient_email NVARCHAR(255) NOT NULL, -- Email người nhận
    template_id UNIQUEIDENTIFIER, -- Khóa ngoại liên kết email_templates
    status TINYINT DEFAULT 1, -- Trạng thái (1: PENDING, 2: SENT, 3: FAILED)
    retry_count INT DEFAULT 0, -- Số lần gửi lại
    scheduled_at DATETIME2, -- Thời gian dự kiến gửi
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo lệnh
    updated_at DATETIME2, -- Thời điểm cập nhật trạng thái
    created_by UNIQUEIDENTIFIER, -- Người/Hệ thống kích hoạt lệnh
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật trạng thái
    deleted_at DATETIME2, -- Thời điểm hủy lệnh gửi
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện hủy
    CONSTRAINT FK_EmailQueue_Templates FOREIGN KEY (template_id) REFERENCES email_templates(id)
);
GO

-- 5. Bảng email_attachments: Quản lý các tệp tin đính kèm gắn với email 106]
CREATE TABLE email_attachments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính
    email_queue_id UNIQUEIDENTIFIER NOT NULL, -- Thuộc email_queue
    file_name NVARCHAR(255), -- Tên file
    file_path NVARCHAR(500), -- Đường dẫn lưu trữ
    file_type NVARCHAR(50), -- Loại file
    is_active BIT DEFAULT 1, -- Trạng thái
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo
    updated_at DATETIME2, -- Thời điểm cập nhật
    created_by UNIQUEIDENTIFIER, -- Người tạo đính kèm
    updated_by UNIQUEIDENTIFIER, -- Người cập nhật
    deleted_at DATETIME2, -- Thời điểm xóa
    deleted_by UNIQUEIDENTIFIER, -- Người xóa
    CONSTRAINT FK_EmailAttachments_Queue FOREIGN KEY (email_queue_id) REFERENCES email_queue(id)
);
GO

-- 6. Bảng email_logs: Nhật ký lưu lại lịch sử và kết quả của các email đã gửi 118]
CREATE TABLE email_logs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(), -- Khóa chính log email
    template_id UNIQUEIDENTIFIER, -- Khóa ngoại liên kết email_templates
    sender_email VARCHAR(255), -- Email người gửi
    recipient_email VARCHAR(255), -- Email người nhận
    subject NVARCHAR(500), -- Tiêu đề email đã gửi
    body_html NVARCHAR(MAX), -- Nội dung email đã gửi
    status TINYINT, -- Trạng thái (1: SUCCESS, 2: FAILED)
    error_message NVARCHAR(MAX), -- Thông báo lỗi nếu có
    sent_at DATETIME2, -- Thời điểm gửi thành công
    is_active BIT DEFAULT 1, -- Trạng thái hiệu lực của bản ghi log
    created_at DATETIME2 DEFAULT GETDATE(), -- Thời điểm tạo log
    updated_at DATETIME2, -- Thời điểm cập nhật log
    created_by UNIQUEIDENTIFIER, -- Hệ thống ghi nhận log
    deleted_at DATETIME2, -- Thời điểm ẩn log
    deleted_by UNIQUEIDENTIFIER, -- Người thực hiện ẩn
    CONSTRAINT FK_EmailLogs_Templates FOREIGN KEY (template_id) REFERENCES email_templates(id)
);
GO