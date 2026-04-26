USE stdmanager_db;
GO

-- =====================================================
-- TẠO DỮ LIỆU MẪU CHO NHÓM SINH VIÊN (STUDENT GROUP)
-- =====================================================

-- 1. Khai báo các biến ID cần thiết từ các nhóm trước
DECLARE @DeptCNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @DeptKinhTe UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'KINHTE');
DECLARE @EmpGiangVien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002'); -- gv.hung
DECLARE @EmpTruongKhoa UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001'); -- admin

-- Biến mật khẩu mẫu
DECLARE @PassHash NVARCHAR(255) = '$2a$12$EAtHE.br2wezN804QlF4bufDIgWvyGn6o0ifLuJ6zM5kji7sbg7Ey';

-- 2. Dữ liệu cho bảng 'student_classes' (Lớp hành chính)
-- Tạo ID cố định để dùng tham chiếu
DECLARE @ClassCNTTK46 UNIQUEIDENTIFIER = NEWID();
DECLARE @ClassKinhTeK46 UNIQUEIDENTIFIER = NEWID();

INSERT INTO student_classes (id, class_code, class_name, course_year, department_id, advisor_id, is_active) VALUES
(@ClassCNTTK46, 'CNTT-K46A', N'Công nghệ thông tin K46A', '2022', @DeptCNTT, @EmpGiangVien, 1),
(@ClassKinhTeK46, 'KINH-K46A', N'Quản trị kinh doanh K46A', '2022', @DeptKinhTe, @EmpTruongKhoa, 1);

-- 3. Dữ liệu cho bảng 'students' (Sinh viên cơ bản)
-- Lấy User ID của sinh viên đã tạo ở Nhóm I (username: 'sv.anh')
DECLARE @UserSinhvienId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.anh');

-- Tạo ID sinh viên để dùng cho bảng student_status
DECLARE @StudentAnhId UNIQUEIDENTIFIER = NEWID();
DECLARE @StudentBinhId UNIQUEIDENTIFIER = NEWID();
DECLARE @NewUserId UNIQUEIDENTIFIER = NEWID();

-- Thêm Sinh viên 1: Phạm Thị Anh (User sv.anh)
INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, personal_identification_number, address, department_id, class_id, admission_year, is_active) VALUES
(@StudentAnhId, @UserSinhvienId, 'SV20220001', N'Phạm Thị Anh', '2004-03-15', N'Nữ', '001204005678', N'Hà Nội', @DeptCNTT, @ClassCNTTK46, 2022, 1);

-- Thêm User và Sinh viên 2: Nguyễn Văn Bình
INSERT INTO users (id, username, password_hash, full_name, email, is_active) 
VALUES (@NewUserId, 'sv.binh', @PassHash, N'Nguyễn Văn Bình', 'binh.nv@student.edu.vn', 1);

INSERT INTO students (id, user_id, student_code, full_name, date_of_birth, gender, personal_identification_number, address, department_id, class_id, admission_year, is_active) VALUES
(@StudentBinhId, @NewUserId, 'SV20220002', N'Nguyễn Văn Bình', '2004-07-10', N'Nam', '001204009876', N'Hải Phòng', @DeptCNTT, @ClassCNTTK46, 2022, 1);

-- 4. Dữ liệu cho bảng 'student_status' (Trạng thái cơ bản)
INSERT INTO student_status (student_id, status_code, status_name, start_date, end_date, description, reason, is_active) VALUES
-- Sinh viên Anh: Đang học
(@StudentAnhId, 'STUDYING', N'Đang học', '2022-09-01', NULL, N'Sinh viên chính thức', N'Nhập học đầu khóa', 1),

-- Sinh viên Bình: Đã bảo lưu -> Tái nhập học
(@StudentBinhId, 'SUSPENDED', N'Bảo lưu', '2023-09-01', '2024-09-01', N'Bảo lưu 1 năm học', N'Lý do cá nhân', 1),
(@StudentBinhId, 'STUDYING', N'Đang học', '2024-09-02', NULL, N'Tái nhập học sau bảo lưu', N'Hết thời hạn bảo lưu', 1);


-- =====================================================
-- MỞ RỘNG DỮ LIỆU SINH VIÊN (MULTI-STATUS)
-- =====================================================

-- A. SINH VIÊN 3: Nguyễn Văn Bảo Lưu (Trạng thái: Đang Bảo lưu)
DECLARE @User_BaoLuu UNIQUEIDENTIFIER = NEWID();
DECLARE @Student_BaoLuu UNIQUEIDENTIFIER = NEWID();

INSERT INTO users (id, username, password_hash, full_name, email, is_active) VALUES 
(@User_BaoLuu, 'sv.baoluu', @PassHash, N'Nguyễn Văn Bảo Lưu', 'baoluu.nv@student.edu.vn', 1);

INSERT INTO students (id, user_id, student_code, full_name, gender, department_id, class_id, admission_year, is_active) VALUES 
(@Student_BaoLuu, @User_BaoLuu, 'SV20220003', N'Nguyễn Văn Bảo Lưu', N'Nam', @DeptCNTT, @ClassCNTTK46, 2022, 1);
-- Gán lớp CNTT-K46A (sửa lỗi tham chiếu biến @ClassCNTT)

INSERT INTO student_status (student_id, status_code, status_name, start_date, end_date, reason, is_active) VALUES 
(@Student_BaoLuu, 'SUSPENDED', N'Bảo lưu học tập', '2024-01-15', NULL, N'Đi công tác nước ngoài 1 năm', 1);


-- B. SINH VIÊN 4: Trần Thị Đã Nghỉ (Trạng thái: Buộc thôi học)
DECLARE @User_NghiHoc UNIQUEIDENTIFIER = NEWID();
DECLARE @Student_NghiHoc UNIQUEIDENTIFIER = NEWID();

INSERT INTO users (id, username, password_hash, full_name, email, is_active) VALUES 
(@User_NghiHoc, 'sv.dangnghi', @PassHash, N'Trần Thị Đã Nghỉ', 'dangnghi.tt@student.edu.vn', 0); -- User inactive

INSERT INTO students (id, user_id, student_code, full_name, gender, department_id, class_id, admission_year, is_active) VALUES 
(@Student_NghiHoc, @User_NghiHoc, 'SV20220004', N'Trần Thị Đã Nghỉ', N'Nữ', @DeptKinhTe, @ClassKinhTeK46, 2022, 0); 
-- Gán lớp KINH-K46A (sửa lỗi tham chiếu biến @ClassKinhTe)

INSERT INTO student_status (student_id, status_code, status_name, start_date, end_date, reason, is_active) VALUES 
(@Student_NghiHoc, 'STUDYING', N'Đang học', '2022-09-01', '2023-05-20', N'Học kỳ đầu', 1),
(@Student_NghiHoc, 'EXPELLED', N'Buộc thôi học', '2023-05-21', NULL, N'Vi phạm quy chế đào tạo', 1);


-- C. SINH VIÊN 5: Lê Hoàn Thành (Trạng thái: Đã tốt nghiệp)
DECLARE @User_TotNghiep UNIQUEIDENTIFIER = NEWID();
DECLARE @Student_TotNghiep UNIQUEIDENTIFIER = NEWID();

INSERT INTO users (id, username, password_hash, full_name, email, is_active) VALUES 
(@User_TotNghiep, 'sv.totnghiep', @PassHash, N'Lê Hoàn Thành', 'thanh.lh@student.edu.vn', 1);

INSERT INTO students (id, user_id, student_code, full_name, gender, department_id, class_id, admission_year, is_active) VALUES 
(@Student_TotNghiep, @User_TotNghiep, 'SV20190099', N'Lê Hoàn Thành', N'Nam', @DeptCNTT, @ClassCNTTK46, 2019, 1);
-- Giả sử cựu sinh viên này thuộc lớp CNTT-K46A (hoặc có thể tạo lớp riêng, nhưng dùng lại cho đơn giản)

INSERT INTO student_status (student_id, status_code, status_name, start_date, end_date, reason, is_active) VALUES 
(@Student_TotNghiep, 'STUDYING', N'Đang học', '2019-09-01', '2023-06-30', N'Hoàn thành khóa học', 1),
(@Student_TotNghiep, 'GRADUATED', N'Tốt nghiệp', '2023-07-01', NULL, N'Ra trường loại Giỏi', 1);


-- D. SINH VIÊN 6: Phạm Tân Sinh (Trạng thái: Chờ nhập học)
DECLARE @User_Moi UNIQUEIDENTIFIER = NEWID();
DECLARE @Student_Moi UNIQUEIDENTIFIER = NEWID();

INSERT INTO users (id, username, password_hash, full_name, email, is_active) VALUES 
(@User_Moi, 'sv.tansinh', @PassHash, N'Phạm Tân Sinh', 'tansinh.p@student.edu.vn', 1);

INSERT INTO students (id, user_id, student_code, full_name, gender, department_id, class_id, admission_year, is_active) VALUES 
(@Student_Moi, @User_Moi, 'SV20240001', N'Phạm Tân Sinh', N'Nam', @DeptCNTT, @ClassCNTTK46, 2024, 1);

INSERT INTO student_status (student_id, status_code, status_name, start_date, end_date, reason, is_active) VALUES 
(@Student_Moi, 'PENDING', N'Chờ nhập học', '2024-08-01', NULL, N'Trúng tuyển kỳ thi 2024', 1);

GO

-- =====================================================
-- BỔ SUNG GÁN VAI TRÒ (ROLE) CHO SINH VIÊN TRONG V16
-- =====================================================

-- 1. Lấy ID của vai trò 'SINHVIEN' từ bảng roles
DECLARE @RoleSinhvienId UNIQUEIDENTIFIER = (SELECT id FROM roles WHERE code = 'SINHVIEN');

-- 2. Lấy ID của các User sinh viên vừa tạo (dựa vào username định danh)
DECLARE @UserBinhId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.binh');
DECLARE @UserBaoLuuId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.baoluu');
DECLARE @UserNghiHocId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.dangnghi');
DECLARE @UserTotNghiepId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.totnghiep');
DECLARE @UserMoiId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'sv.tansinh');

-- 3. Thêm dữ liệu vào bảng 'user_roles'
-- Kiểm tra NULL để đảm bảo Role và User tồn tại trước khi insert
IF @RoleSinhvienId IS NOT NULL
BEGIN
    -- Gán role cho Nguyễn Văn Bình
    IF @UserBinhId IS NOT NULL
        INSERT INTO user_roles (id, user_id, role_id, is_active) VALUES (NEWID(), @UserBinhId, @RoleSinhvienId, 1);

    -- Gán role cho Nguyễn Văn Bảo Lưu
    IF @UserBaoLuuId IS NOT NULL
        INSERT INTO user_roles (id, user_id, role_id, is_active) VALUES (NEWID(), @UserBaoLuuId, @RoleSinhvienId, 1);

    -- Gán role cho Trần Thị Đã Nghỉ (Dù user inactive, vẫn cần giữ mapping role để lịch sử)
    IF @UserNghiHocId IS NOT NULL
        INSERT INTO user_roles (id, user_id, role_id, is_active) VALUES (NEWID(), @UserNghiHocId, @RoleSinhvienId, 1);

    -- Gán role cho Lê Hoàn Thành (Cựu sinh viên)
    IF @UserTotNghiepId IS NOT NULL
        INSERT INTO user_roles (id, user_id, role_id, is_active) VALUES (NEWID(), @UserTotNghiepId, @RoleSinhvienId, 1);

    -- Gán role cho Phạm Tân Sinh (Sinh viên mới)
    IF @UserMoiId IS NOT NULL
        INSERT INTO user_roles (id, user_id, role_id, is_active) VALUES (NEWID(), @UserMoiId, @RoleSinhvienId, 1);
END
ELSE
BEGIN
    PRINT N'Cảnh báo: Không tìm thấy vai trò SINHVIEN trong hệ thống. Vui lòng kiểm tra bảng roles.';
END
GO