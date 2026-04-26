-- =====================================================
-- TẠO DỮ LIỆU MẪU CHO NHÓM GIẢNG VIÊN (LECTURER GROUP)
-- =====================================================

-- 1. Dữ liệu cho bảng 'departments' (Khoa/Phòng ban)
DECLARE @DeptCNTT UNIQUEIDENTIFIER = NEWID();
DECLARE @DeptKinhTe UNIQUEIDENTIFIER = NEWID();
DECLARE @DeptGiaoVu UNIQUEIDENTIFIER = NEWID();

INSERT INTO departments (id, code, name, description, established_year, is_active) VALUES
(@DeptCNTT, 'CNTT', N'Khoa Công nghệ thông tin', N'Đào tạo chuyên ngành CNTT và Software', 2005, 1),
(@DeptKinhTe, 'KINHTE', N'Khoa Kinh tế', N'Đào tạo chuyên ngành Quản trị kinh doanh', 2000, 1),
(@DeptGiaoVu, 'GVU', N'Phòng Đào tạo', N'Bộ phận quản lý đào tạo hàng đầu', 1998, 1);
GO

-- 2. Dữ liệu cho bảng 'positions' (Chức danh)
DECLARE @PosGiangVien UNIQUEIDENTIFIER = NEWID();
DECLARE @PosTruongKhoa UNIQUEIDENTIFIER = NEWID();
DECLARE @PosGiaoVien UNIQUEIDENTIFIER = NEWID();
DECLARE @PosNhanVien UNIQUEIDENTIFIER = NEWID();

INSERT INTO positions (id, code, name, level, description, is_active) VALUES
(@PosGiangVien, 'GV', N'Giảng viên', 3, N'Giảng viên cơ hữu', 1),
(@PosTruongKhoa, 'TK', N'Trưởng khoa', 1, N'Người đứng đầu khoa', 1),
(@PosGiaoVien, 'PGV', N'Phòng giáo vụ', 2, N'Nhân viên phòng giáo vụ', 1),
(@PosNhanVien, 'NV', N'Nhân viên hành chính', 4, N'Hỗ trợ hành chính', 1);
GO

-- 3. Dữ liệu cho bảng 'employees' (Nhân viên/Giảng viên)
-- Lấy User ID từ bảng users (Giả định dữ liệu mẫu trước đó đã tồn tại)
DECLARE @UserGiaovuId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'giaovu01');
DECLARE @UserGiangvienId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'gv.hung');

-- Tạo thêm user mới cho Trưởng khoa (nếu chưa có trong hệ thống)
-- Để an toàn, ta lấy ID của admin làm Trưởng khoa hoặc tạo mới
DECLARE @UserTruongKhoaId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');

-- Lấy lại ID Departments và Positions vừa tạo ở trên
DECLARE @DeptCNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @DeptKinhTe UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'KINHTE');
DECLARE @DeptGiaoVu UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'GVU');

DECLARE @PosGiangVien UNIQUEIDENTIFIER = (SELECT id FROM positions WHERE code = 'GV');
DECLARE @PosTruongKhoa UNIQUEIDENTIFIER = (SELECT id FROM positions WHERE code = 'TK');
DECLARE @PosGiaoVien UNIQUEIDENTIFIER = (SELECT id FROM positions WHERE code = 'PGV');

-- Tạo ID cho employees để tham chiếu ở các bảng con
DECLARE @EmpTruongKhoa UNIQUEIDENTIFIER = NEWID();
DECLARE @EmpGiangVien UNIQUEIDENTIFIER = NEWID();
DECLARE @EmpGiaoVu UNIQUEIDENTIFIER = NEWID();

INSERT INTO employees (id, user_id, employee_code, full_name, date_of_birth, gender, email, phone, address, department_id, position_id, hire_date, contract_type, salary_coefficient, academic_degree, academic_title, specialization, is_active) VALUES
-- Trưởng khoa CNTT (Giả sử là user Admin)
(@EmpTruongKhoa, @UserTruongKhoaId, 'GV001', N'Nguyễn Văn Admin', '1980-05-15', N'Nam', 'admin@stdmanager.edu.vn', '0901112222', N'Hà Nội', @DeptCNTT, @PosTruongKhoa, '2010-06-01', N'Biên chế', 4.50, N'Tiến sĩ', N'Phó Giáo sư', N'Trí tuệ nhân tạo', 1),

-- Giảng viên (User gv.hung)
(@EmpGiangVien, @UserGiangvienId, 'GV002', N'Lê Văn Hùng', '1985-08-20', N'Nam', 'hung.lv@stdmanager.edu.vn', '0905556666', N'Hồ Chí Minh', @DeptCNTT, @PosGiangVien, '2015-09-01', N'Hợp đồng', 2.80, N'Thạc sĩ', NULL, N'Công nghệ phần mềm', 1),

-- Nhân viên giáo vụ (User giaovu01)
(@EmpGiaoVu, @UserGiaovuId, 'NV001', N'Trần Thị Giáo Vụ', '1990-12-10', N'Nữ', 'giaovu@stdmanager.edu.vn', '0903334444', N'Đà Nẵng', @DeptGiaoVu, @PosGiaoVien, '2018-01-15', N'Biên chế', 2.10, N'Cử nhân', NULL, N'Quản lý giáo dục', 1);
GO

-- 4. Dữ liệu cho bảng 'lecturer_degrees' (Bằng cấp)
DECLARE @EmpGiangVien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');

INSERT INTO lecturer_degrees (lecturer_id, degree, major, university, graduation_year, is_highest, is_active) VALUES
(@EmpGiangVien, N'Cử nhân', N'Công nghệ thông tin', N'ĐH Bách Khoa Hà Nội', 2007, 0, 1),
(@EmpGiangVien, N'Thạc sĩ', N'Khoa học máy tính', N'ĐH Quốc gia TP.HCM', 2010, 1, 1);
GO

-- 5. Dữ liệu cho bảng 'lecturer_positions_history' (Lịch sử chức danh)
DECLARE @EmpTruongKhoa UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV001');
DECLARE @PosGiangVien UNIQUEIDENTIFIER = (SELECT id FROM positions WHERE code = 'GV');
DECLARE @PosTruongKhoa UNIQUEIDENTIFIER = (SELECT id FROM positions WHERE code = 'TK');

INSERT INTO lecturer_positions_history (lecturer_id, position_id, start_date, end_date, is_active) VALUES
(@EmpTruongKhoa, @PosGiangVien, '2010-06-01', '2015-05-31', 1), -- Làm giảng viên trước
(@EmpTruongKhoa, @PosTruongKhoa, '2015-06-01', NULL, 1); -- Lên trưởng khoa sau
GO

-- 6. Dữ liệu cho bảng 'contracts' (Hợp đồng)
DECLARE @EmpGiangVien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');

INSERT INTO contracts (lecturer_id, contract_type, start_date, end_date, salary_coefficient, is_active) VALUES
(@EmpGiangVien, N'Hợp đồng mùa vụ', '2015-09-01', '2017-08-31', 2.50, 1),
(@EmpGiangVien, N'Hợp đồng xác định thời hạn', '2017-09-01', '2020-08-31', 2.70, 1),
(@EmpGiangVien, N'Hợp đồng không xác định thời hạn', '2020-09-01', NULL, 2.80, 1); -- Hiện tại
GO

-- 7. Dữ liệu cho bảng 'lecturer_specializations' (Chuyên môn sâu)
DECLARE @EmpGiangVien UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_code = 'GV002');

INSERT INTO lecturer_specializations (lecturer_id, specialization, is_active) VALUES
(@EmpGiangVien, N'Lập trình Java Enterprise', 1),
(@EmpGiangVien, N'Phát triển ứng dụng Web', 1),
(@EmpGiangVien, N'Cơ sở dữ liệu phân tán', 1);
GO