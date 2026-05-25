-- stdmanager/src/main/resources/db/migration/V16__Insert_Lecturer_Group_III.sql

USE stdmanager_db;

-- ======================================================================
-- KHỞI TẠO DỮ LIỆU MẪU CHO NHÓM III (GIẢNG VIÊN / NHÂN SỰ)
-- ======================================================================

-- Bảng tạm để lưu ID của Users và Employees vừa tạo, phục vụ việc Insert các bảng con
DECLARE @GeneratedUsers TABLE (username VARCHAR(50), user_id UNIQUEIDENTIFIER, full_name NVARCHAR(100), email NVARCHAR(100), phone NVARCHAR(20));
DECLARE @GeneratedEmployees TABLE (employee_code VARCHAR(20), employee_id UNIQUEIDENTIFIER, user_id UNIQUEIDENTIFIER);

-- ======================================================================
-- 1. INSERT DEPARTMENTS (Khoa / Viện)
-- ======================================================================
-- Tạm thời bỏ qua FK created_by/updated_by để tránh vòng lặp tham chiếu, sẽ update sau nếu cần

IF NOT EXISTS (SELECT 1 FROM departments WHERE code = 'CNTT')
    INSERT INTO departments (id, code, name, description, established_year, is_active, created_at, updated_at)
    VALUES (NEWID(), 'CNTT', N'Khoa Công nghệ Thông tin', N'Đào tạo và nghiên cứu về CNTT', 2000, 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM departments WHERE code = 'KT')
    INSERT INTO departments (id, code, name, description, established_year, is_active, created_at, updated_at)
    VALUES (NEWID(), 'KT', N'Khoa Kinh tế', N'Đào tạo các chuyên ngành kinh tế và quản trị', 1998, 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM departments WHERE code = 'NN')
    INSERT INTO departments (id, code, name, description, established_year, is_active, created_at, updated_at)
    VALUES (NEWID(), 'NN', N'Khoa Ngoại ngữ', N'Đào tạo ngôn ngữ Anh, Pháp, Trung', 2005, 1, GETDATE(), GETDATE());

-- ======================================================================
-- 2. INSERT POSITIONS (Chức danh)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM positions WHERE code = 'GV')
    INSERT INTO positions (id, code, name, level, description, is_active, created_at, updated_at)
    VALUES (NEWID(), 'GV', N'Giảng viên', 1, N'Giảng viên giảng dạy cơ hữu', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM positions WHERE code = 'GVC')
    INSERT INTO positions (id, code, name, level, description, is_active, created_at, updated_at)
    VALUES (NEWID(), 'GVC', N'Giảng viên chính', 2, N'Chức danh giảng viên bậc cao', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM positions WHERE code = 'PGS')
    INSERT INTO positions (id, code, name, level, description, is_active, created_at, updated_at)
    VALUES (NEWID(), 'PGS', N'Phó Giáo sư', 3, N'Chức danh Phó Giáo sư', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM positions WHERE code = 'GVTH')
    INSERT INTO positions (id, code, name, level, description, is_active, created_at, updated_at)
    VALUES (NEWID(), 'GVTH', N'Giảng viên thỉnh giảng', 0, N'Giảng viên không cơ hữu', 1, GETDATE(), GETDATE());

-- ======================================================================
-- 3. INSERT USERS & EMPLOYEES (Tài khoản và Hồ sơ Nhân sự)
-- ======================================================================
-- Mật khẩu mặc định cho tất cả user: Admin@123 (BCrypt Hash)

DECLARE @PassHash NVARCHAR(255) = '$2a$12$obyHHLqZ1.98KEZjg8ZSZ.Q/W710jX8.dm7UxWL4BmhZhDVdI85li';

-- 3.1 Tạo User trước
DECLARE @Dept_CNTT UNIQUEIDENTIFIER;
DECLARE @Dept_KT UNIQUEIDENTIFIER;
DECLARE @Pos_GV UNIQUEIDENTIFIER;
DECLARE @Pos_GVC UNIQUEIDENTIFIER;
DECLARE @Pos_PGS UNIQUEIDENTIFIER;

-- Phải gán giá trị SAU khi đã đảm bảo các bản ghi tồn tại (do chạy cùng 1 batch)
SET @Dept_CNTT = (SELECT id FROM departments WHERE code = 'CNTT');
SET @Dept_KT = (SELECT id FROM departments WHERE code = 'KT');
SET @Pos_GV = (SELECT id FROM positions WHERE code = 'GV');
SET @Pos_GVC = (SELECT id FROM positions WHERE code = 'GVC');
SET @Pos_PGS = (SELECT id FROM positions WHERE code = 'PGS');

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'nguyenvana')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.phone INTO @GeneratedUsers
    VALUES (NEWID(), 'nguyenvana', @PassHash, N'Nguyễn Văn An', 'an.nv@stdmanager.edu.vn', '0912345678', '/avatars/an.jpg', NULL, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name, email, phone) 
    SELECT username, id, full_name, email, phone FROM users WHERE username = 'nguyenvana';

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'tranthibich')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.phone INTO @GeneratedUsers
    VALUES (NEWID(), 'tranthibich', @PassHash, N'Trần Thị Bích', 'bich.tt@stdmanager.edu.vn', '0912345679', '/avatars/bich.jpg', GETDATE(), 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name, email, phone) 
    SELECT username, id, full_name, email, phone FROM users WHERE username = 'tranthibich';

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'levancuong')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.phone INTO @GeneratedUsers
    VALUES (NEWID(), 'levancuong', @PassHash, N'Lê Văn Cường', 'cuong.lv@stdmanager.edu.vn', '0912345680', '/avatars/cuong.jpg', NULL, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name, email, phone) 
    SELECT username, id, full_name, email, phone FROM users WHERE username = 'levancuong';

-- 3.2 Tạo Employee và map với User
-- Dọn dẹp dữ liệu cũ nếu trùng mã nhân viên để tránh lỗi UNIQUE (Tùy chọn, ở đây ta dùng IF NOT EXISTS cho an toàn)
IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'GV001')
BEGIN
    INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active, created_at, updated_at)
    OUTPUT INSERTED.employee_code, INSERTED.id, INSERTED.user_id INTO @GeneratedEmployees
    SELECT NEWID(), user_id, 'GV001', full_name, '1985-05-10', N'1', email, phone, N'Số 1, Đại học ABC', @Dept_CNTT, @Pos_GVC, '2010-09-01', N'Biên chế', 4.50, N'Tiến sĩ', NULL, N'AI & Machine Learning', 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'nguyenvana';
END
ELSE
BEGIN
    INSERT INTO @GeneratedEmployees (employee_code, employee_id, user_id)
    SELECT employee_code, id, user_id FROM employees WHERE employee_code = 'GV001';
END

IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'GV002')
BEGIN
    INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active, created_at, updated_at)
    OUTPUT INSERTED.employee_code, INSERTED.id, INSERTED.user_id INTO @GeneratedEmployees
    SELECT NEWID(), user_id, 'GV002', full_name, '1980-08-15', N'2', email, phone, N'Số 2, Đại học ABC', @Dept_CNTT, @Pos_PGS, '2005-09-01', N'Biên chế', 5.20, N'Tiến sĩ', N'Phó Giáo sư', N'Mạng máy tính', 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'tranthibich';
END
ELSE
BEGIN
    INSERT INTO @GeneratedEmployees (employee_code, employee_id, user_id)
    SELECT employee_code, id, user_id FROM employees WHERE employee_code = 'GV002';
END

IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'GV003')
BEGIN
    INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active, created_at, updated_at)
    OUTPUT INSERTED.employee_code, INSERTED.id, INSERTED.user_id INTO @GeneratedEmployees
    SELECT NEWID(), user_id, 'GV003', full_name, '1990-02-20', N'1', email, phone, N'Số 3, Đại học ABC', @Dept_KT, @Pos_GV, '2018-09-01', N'Hợp đồng', 3.80, N'Thạc sĩ', NULL, N'Kế toán quản trị', 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'levancuong';
END
ELSE
BEGIN
    INSERT INTO @GeneratedEmployees (employee_code, employee_id, user_id)
    SELECT employee_code, id, user_id FROM employees WHERE employee_code = 'GV003';
END

-- ======================================================================
-- 4. INSERT LECTURER_DEGREES (Bằng cấp giảng viên)
-- ======================================================================

DECLARE @Emp_GV001 UNIQUEIDENTIFIER = (SELECT employee_id FROM @GeneratedEmployees WHERE employee_code = 'GV001');
DECLARE @Emp_GV002 UNIQUEIDENTIFIER = (SELECT employee_id FROM @GeneratedEmployees WHERE employee_code = 'GV002');
DECLARE @Emp_GV003 UNIQUEIDENTIFIER = (SELECT employee_id FROM @GeneratedEmployees WHERE employee_code = 'GV003');

IF NOT EXISTS (SELECT 1 FROM lecturer_degrees WHERE lecturer_id = @Emp_GV001)
BEGIN
    INSERT INTO lecturer_degrees (id, lecturer_id, degree, major, university, graduation_year, is_highest, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV001, N'Cử nhân', N'Khoa học Máy tính', N'ĐH Bách Khoa HN', 2007, 0, 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV001, N'Tiến sĩ', N'Trí tuệ nhân tạo', N'ĐH Công nghệ ĐHQG HN', 2015, 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_degrees WHERE lecturer_id = @Emp_GV002)
BEGIN
    INSERT INTO lecturer_degrees (id, lecturer_id, degree, major, university, graduation_year, is_highest, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV002, N'Tiến sĩ', N'Mạng & Truyền thông', N'ĐH Bách Khoa HCM', 2009, 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_degrees WHERE lecturer_id = @Emp_GV003)
BEGIN
    INSERT INTO lecturer_degrees (id, lecturer_id, degree, major, university, graduation_year, is_highest, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV003, N'Thạc sĩ', N'Quản trị Kinh doanh', N'ĐH Kinh tế Quốc dân', 2016, 1, 1, GETDATE(), GETDATE());
END



-- Gán role GIANGVIEN cho user nguyenvana
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'nguyenvana' AND r.code = 'GIANGVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'nguyenvana' AND r.code = 'GIANGVIEN';


-- Gán role GIANGVIEN cho user tranthibich
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'tranthibich' AND r.code = 'GIANGVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'tranthibich' AND r.code = 'GIANGVIEN';

-- Gán role GIANGVIEN cho user levancuong
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'levancuong' AND r.code = 'GIANGVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'levancuong' AND r.code = 'GIANGVIEN';


-- ======================================================================
-- 5. INSERT LECTURER_POSITIONS_HISTORY (Lịch sử chức danh)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM lecturer_positions_history WHERE lecturer_id = @Emp_GV001)
BEGIN
    INSERT INTO lecturer_positions_history (id, lecturer_id, position_id, start_date, end_date, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV001, (SELECT id FROM positions WHERE code = 'GV'), '2010-09-01', '2018-08-31', 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV001, (SELECT id FROM positions WHERE code = 'GVC'), '2018-09-01', NULL, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_positions_history WHERE lecturer_id = @Emp_GV002)
BEGIN
    INSERT INTO lecturer_positions_history (id, lecturer_id, position_id, start_date, end_date, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV002, (SELECT id FROM positions WHERE code = 'GVC'), '2005-09-01', '2020-08-31', 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV002, (SELECT id FROM positions WHERE code = 'PGS'), '2020-09-01', NULL, 1, GETDATE(), GETDATE());
END

-- ======================================================================
-- 6. INSERT CONTRACTS (Hợp đồng lao động)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM contracts WHERE lecturer_id = @Emp_GV001)
    INSERT INTO contracts (id, lecturer_id, contract_type, start_date, end_date, salary_coefficient, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV001, N'Hợp đồng lao động không xác định thời hạn', '2010-09-01', NULL, 4.50, 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM contracts WHERE lecturer_id = @Emp_GV003)
    INSERT INTO contracts (id, lecturer_id, contract_type, start_date, end_date, salary_coefficient, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV003, N'Hợp đồng lao động xác định thời hạn', '2018-09-01', '2025-08-31', 3.80, 1, GETDATE(), GETDATE());

-- ======================================================================
-- 7. INSERT LECTURER_SPECIALIZATIONS (Chuyên môn sâu)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM lecturer_specializations WHERE lecturer_id = @Emp_GV001)
BEGIN
    INSERT INTO lecturer_specializations (id, lecturer_id, specialization, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV001, N'Deep Learning', 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV001, N'Computer Vision', 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_specializations WHERE lecturer_id = @Emp_GV002)
    INSERT INTO lecturer_specializations (id, lecturer_id, specialization, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV002, N'An ninh mạng', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM lecturer_specializations WHERE lecturer_id = @Emp_GV003)
    INSERT INTO lecturer_specializations (id, lecturer_id, specialization, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV003, N'Phân tích tài chính', 1, GETDATE(), GETDATE());


    -- ======================================================================
-- 8. INSERT USERS & EMPLOYEES (Tiếp tục thêm Giảng viên Khoa NN & GVTH)
-- ======================================================================

DECLARE @Dept_NN UNIQUEIDENTIFIER;
DECLARE @Pos_GVTH UNIQUEIDENTIFIER;

SET @Dept_NN = (SELECT id FROM departments WHERE code = 'NN');
SET @Pos_GVTH = (SELECT id FROM positions WHERE code = 'GVTH');

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'phamthidung')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.phone INTO @GeneratedUsers
    VALUES (NEWID(), 'phamthidung', @PassHash, N'Phạm Thị Dũng', 'dung.pt@stdmanager.edu.vn', '0987654321', '/avatars/dung.jpg', NULL, 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name, email, phone) 
    SELECT username, id, full_name, email, phone FROM users WHERE username = 'phamthidung';

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'hoangvanem')
    INSERT INTO users (id, username, password_hash, full_name, email, phone, avatar_url, last_login_at, is_active, created_at, updated_at)
    OUTPUT INSERTED.username, INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.phone INTO @GeneratedUsers
    VALUES (NEWID(), 'hoangvanem', @PassHash, N'Hoàng Văn Em', 'em.hv@stdmanager.edu.vn', '0987654322', '/avatars/em.jpg', GETDATE(), 1, GETDATE(), GETDATE());
ELSE
    INSERT INTO @GeneratedUsers (username, user_id, full_name, email, phone) 
    SELECT username, id, full_name, email, phone FROM users WHERE username = 'hoangvanem';

IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'GV004')
BEGIN
    INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active, created_at, updated_at)
    OUTPUT INSERTED.employee_code, INSERTED.id, INSERTED.user_id INTO @GeneratedEmployees
    SELECT NEWID(), user_id, 'GV004', full_name, '1988-11-05', N'2', email, phone, N'Số 4, Đại học ABC', @Dept_NN, @Pos_GV, '2015-02-01', N'Biên chế', 4.00, N'Thạc sĩ', NULL, N'Ngôn ngữ học Anh văn', 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'phamthidung';
END
ELSE
BEGIN
    INSERT INTO @GeneratedEmployees (employee_code, employee_id, user_id)
    SELECT employee_code, id, user_id FROM employees WHERE employee_code = 'GV004';
END

IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'GV005')
BEGIN
    INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active, created_at, updated_at)
    OUTPUT INSERTED.employee_code, INSERTED.id, INSERTED.user_id INTO @GeneratedEmployees
    SELECT NEWID(), user_id, 'GV005', full_name, '1995-04-12', N'1', email, phone, N'Đường XYZ, Quận 1', @Dept_CNTT, @Pos_GVTH, '2023-09-01', N'Hợp đồng', 2.50, N'Cử nhân', NULL, N'Lập trình Web Fullstack', 1, GETDATE(), GETDATE()
    FROM @GeneratedUsers WHERE username = 'hoangvanem';
END
ELSE
BEGIN
    INSERT INTO @GeneratedEmployees (employee_code, employee_id, user_id)
    SELECT employee_code, id, user_id FROM employees WHERE employee_code = 'GV005';
END

-- ======================================================================
-- 9. GÁN ROLE & THÊM BẰNG CẤP CHO TẬP GIẢNG VIÊN MỚI
-- ======================================================================

DECLARE @Emp_GV004 UNIQUEIDENTIFIER = (SELECT employee_id FROM @GeneratedEmployees WHERE employee_code = 'GV004');
DECLARE @Emp_GV005 UNIQUEIDENTIFIER = (SELECT employee_id FROM @GeneratedEmployees WHERE employee_code = 'GV005');

IF NOT EXISTS (SELECT 1 FROM lecturer_degrees WHERE lecturer_id = @Emp_GV004)
BEGIN
    INSERT INTO lecturer_degrees (id, lecturer_id, degree, major, university, graduation_year, is_highest, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV004, N'Cử nhân', N'Ngôn ngữ Anh', N'ĐH Ngoại ngữ', 2010, 0, 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV004, N'Thạc sĩ', N'Teaching English to Speakers of Other Languages (TESOL)', N'ĐH Hà Nội', 2014, 1, 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_degrees WHERE lecturer_id = @Emp_GV005)
BEGIN
    INSERT INTO lecturer_degrees (id, lecturer_id, degree, major, university, graduation_year, is_highest, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV005, N'Cử nhân', N'Công nghệ Thông tin', N'ĐH FPT', 2017, 1, 1, GETDATE(), GETDATE());
END

-- Gán role GIANGVIEN
IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'phamthidung' AND r.code = 'GIANGVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'phamthidung' AND r.code = 'GIANGVIEN';

IF NOT EXISTS (SELECT 1 FROM user_roles ur JOIN users u ON ur.user_id = u.id JOIN roles r ON ur.role_id = r.id WHERE u.username = 'hoangvanem' AND r.code = 'GIANGVIEN')
    INSERT INTO user_roles (id, user_id, role_id, is_active, created_at, updated_at)
    SELECT NEWID(), u.id, r.id, 1, GETDATE(), GETDATE() FROM users u CROSS JOIN roles r WHERE u.username = 'hoangvanem' AND r.code = 'GIANGVIEN';

-- ======================================================================
-- 10. INSERT LECTURER_POSITIONS_HISTORY (Tiếp tục lịch sử cho GV mới)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM lecturer_positions_history WHERE lecturer_id = @Emp_GV004)
BEGIN
    INSERT INTO lecturer_positions_history (id, lecturer_id, position_id, start_date, end_date, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV004, (SELECT id FROM positions WHERE code = 'GV'), '2015-02-01', NULL, 1, GETDATE(), GETDATE());
END

-- ======================================================================
-- 11. INSERT CONTRACTS (Tiếp tục hợp đồng cho GV mới)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM contracts WHERE lecturer_id = @Emp_GV004)
    INSERT INTO contracts (id, lecturer_id, contract_type, start_date, end_date, salary_coefficient, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV004, N'Hợp đồng lao động không xác định thời hạn', '2015-02-01', NULL, 4.00, 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM contracts WHERE lecturer_id = @Emp_GV005)
    INSERT INTO contracts (id, lecturer_id, contract_type, start_date, end_date, salary_coefficient, is_active, created_at, updated_at)
    VALUES (NEWID(), @Emp_GV005, N'Hợp đồng thuê dịch vụ giảng viên thỉnh giảng', '2023-09-01', '2024-08-31', 2.50, 1, GETDATE(), GETDATE());

-- ======================================================================
-- 12. INSERT LECTURER_SPECIALIZATIONS (Tiếp tục chuyên môn cho GV mới)
-- ======================================================================

IF NOT EXISTS (SELECT 1 FROM lecturer_specializations WHERE lecturer_id = @Emp_GV004)
BEGIN
    INSERT INTO lecturer_specializations (id, lecturer_id, specialization, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV004, N'IELTS Training', 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV004, N'Ngữ pháp Tiếng Anh chuyên ngành', 1, GETDATE(), GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM lecturer_specializations WHERE lecturer_id = @Emp_GV005)
BEGIN
    INSERT INTO lecturer_specializations (id, lecturer_id, specialization, is_active, created_at, updated_at)
    VALUES 
    (NEWID(), @Emp_GV005, N'ReactJS & NodeJS', 1, GETDATE(), GETDATE()),
    (NEWID(), @Emp_GV005, N'Phát triển ứng dụng di động (Mobile App)', 1, GETDATE(), GETDATE());
END