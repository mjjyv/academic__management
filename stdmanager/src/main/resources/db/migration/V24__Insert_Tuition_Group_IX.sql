-- stdmanager/src/main/resources/db/migration/V24__Insert_Tuition_Group_IX.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN TRUNG GIAN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @SemesterId UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2024_2025');

-- Nếu không tìm thấy HK1_2024_2025, thử tìm bất kỳ HK nào có hiệu lực
IF @SemesterId IS NULL
    SET @SemesterId = (SELECT TOP 1 id FROM semesters WHERE is_active = 1 ORDER BY start_date DESC);

-- ======================================================================
-- 2. INSERT TUITION_FEES (Cấu hình đơn giá)
-- ======================================================================
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE course_year = 'K2020')
BEGIN
    INSERT INTO tuition_fees (id, course_year, fee_type, price_per_credit, is_active, created_at, created_by)
    VALUES 
    (NEWID(), 'K2020', 'NEW',    500000.00, 1, GETDATE(), @AdminId),
    (NEWID(), 'K2020', 'RETAKE', 750000.00, 1, GETDATE(), @AdminId);
END

IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE course_year = 'K2021')
BEGIN
    INSERT INTO tuition_fees (id, course_year, fee_type, price_per_credit, is_active, created_at, created_by)
    VALUES 
    (NEWID(), 'K2021', 'NEW',    550000.00, 1, GETDATE(), @AdminId),
    (NEWID(), 'K2021', 'RETAKE', 825000.00, 1, GETDATE(), @AdminId);
END

-- ======================================================================
-- 3. INSERT STUDENT_TUITION (Tổng hợp học phí sinh viên)
-- ======================================================================
DECLARE @Stu_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200001');
DECLARE @Stu_Hanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210002');

-- Nếu không có SV mẫu cụ thể, lấy TOP 2 SV bất kỳ
IF @Stu_Duc IS NULL SET @Stu_Duc = (SELECT TOP 1 id FROM students);
IF @Stu_Hanh IS NULL SET @Stu_Hanh = (SELECT TOP 1 id FROM students WHERE id <> @Stu_Duc);

-- Phạm Minh Đức (Học mới 3 tín chỉ)
IF @Stu_Duc IS NOT NULL AND @SemesterId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Duc AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, total_credits, raw_amount, 
        scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, is_active, created_at, created_by
    )
    VALUES (
        NEWID(), @Stu_Duc, @SemesterId, 3, 1500000.00, 
        0, 0, 1500000.00, 
        0, 1500000.00, 3, '2024-10-31', 1, GETDATE(), @AdminId
    );
END

-- Nguyễn Thị Hạnh (Học lại 3 tín chỉ)
IF @Stu_Hanh IS NOT NULL AND @SemesterId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Hanh AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, total_credits, raw_amount, 
        scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, is_active, created_at, created_by
    )
    VALUES (
        NEWID(), @Stu_Hanh, @SemesterId, 3, 2250000.00, 
        500000.00, 0, 1750000.00, 
        0, 1750000.00, 3, '2024-10-31', 1, GETDATE(), @AdminId
    );
END

-- ======================================================================
-- 4. INSERT STUDENT_TUITION (Bổ sung thêm sinh viên có học bổng và đã thanh toán)
-- ======================================================================
DECLARE @Stu_Tuan UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210005');
DECLARE @Stu_Mai UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200010');

IF @Stu_Tuan IS NULL SET @Stu_Tuan = (SELECT TOP 1 id FROM students WHERE id NOT IN (@Stu_Duc, @Stu_Hanh));
IF @Stu_Mai IS NULL SET @Stu_Mai = (SELECT TOP 1 id FROM students WHERE id NOT IN (@Stu_Duc, @Stu_Hanh, @Stu_Tuan));

-- Võ Minh Tuấn (Học mới 18 tín chỉ, Có học bổng 30%, Miễn giảm chính sách 500k)
IF @Stu_Tuan IS NOT NULL AND @SemesterId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Tuan AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, 
        scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @Stu_Tuan, @SemesterId, (SELECT TOP 1 id FROM tuition_fees WHERE course_year = 'K2021' AND fee_type = 'NEW'), 18, 9900000.00, 
        2970000.00, 500000.00, 6430000.00, 
        6430000.00, 0, 1, '2024-10-15', 
        1, GETDATE(), GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- Trần Thị Mai (Học mới 15 tín chỉ, Nợ học phí quá hạn)
IF @Stu_Mai IS NOT NULL AND @SemesterId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Mai AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, 
        scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @Stu_Mai, @SemesterId, (SELECT TOP 1 id FROM tuition_fees WHERE course_year = 'K2020' AND fee_type = 'NEW'), 15, 7500000.00, 
        0, 0, 7500000.00, 
        2000000.00, 5500000.00, 4, '2024-09-30', 
        1, '2024-09-15', GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- ======================================================================
-- 5. INSERT PAYMENTS (Lịch sử thanh toán chi tiết)
-- ======================================================================
DECLARE @TuitionId_Duc UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM student_tuition WHERE student_id = @Stu_Duc AND semester_id = @SemesterId);
DECLARE @TuitionId_Hanh UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM student_tuition WHERE student_id = @Stu_Hanh AND semester_id = @SemesterId);
DECLARE @TuitionId_Tuan UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM student_tuition WHERE student_id = @Stu_Tuan AND semester_id = @SemesterId);
DECLARE @TuitionId_Mai UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM student_tuition WHERE student_id = @Stu_Mai AND semester_id = @SemesterId);
DECLARE @CashierId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM users WHERE username = 'giaovu');

-- 5.1. Giao dịch thanh toán của Phạm Minh Đức (Chuyển khoản thành công)
IF @TuitionId_Duc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @TuitionId_Duc)
BEGIN
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, payment_status, 
        transaction_ref, cashier_id, notes, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @TuitionId_Duc, 1500000.00, '2024-10-20 14:30:00', 1, 'SUCCESS', 
        'BANK-VNP-20241020143000-9988', @CashierId, N'Sinh viên chuyển khoản qua VNPAY', 
        1, '2024-10-20 14:30:00', GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- 5.2. Giao dịch thanh toán của Nguyễn Thị Hạnh (Nộp tiền mặt tại quầy 1 lần)
IF @TuitionId_Hanh IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @TuitionId_Hanh)
BEGIN
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, payment_status, 
        transaction_ref, cashier_id, notes, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @TuitionId_Hanh, 1750000.00, '2024-10-25 09:15:00', 2, 'SUCCESS', 
        'CASH-REC-202410250915', @CashierId, N'Nộp tiền mặt tại phòng kế toán', 
        1, '2024-10-25 09:15:00', GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- 5.3. Giao dịch thanh toán của Võ Minh Tuán (Thanh toán qua ví điện tử Momo)
IF @TuitionId_Tuan IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @TuitionId_Tuan)
BEGIN
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, payment_status, 
        transaction_ref, cashier_id, notes, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @TuitionId_Tuan, 6430000.00, '2024-10-10 11:05:00', 3, 'SUCCESS', 
        'MOMO-54321678901234', @CashierId, N'Thanh toán đầy đủ qua ví MoMo', 
        1, '2024-10-10 11:05:00', GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- 5.4. Giao dịch thanh toán của Trần Thị Mai (Nộp 1 phần tiền mặt, còn nợ)
IF @TuitionId_Mai IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @TuitionId_Mai)
BEGIN
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, payment_status, 
        transaction_ref, cashier_id, notes, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @TuitionId_Mai, 2000000.00, '2024-09-28 16:45:00', 2, 'SUCCESS', 
        'CASH-REC-202409281645', @CashierId, N'Nộp tạm ứng 2 triệu, hẹn tuần sau nốt', 
        1, '2024-09-28 16:45:00', GETDATE(), @AdminId, @AdminId, NULL, NULL
    );
END

-- 5.5. Giao dịch lỗi mạng của Trần Thị Mai (Thử chuyển khoản nhưng lỗi, bị hủy)
IF @TuitionId_Mai IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments WHERE tuition_id = @TuitionId_Mai AND transaction_ref = 'BANK-TCB-FAIL-001')
BEGIN
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, payment_status, 
        transaction_ref, cashier_id, notes, 
        is_active, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by
    )
    VALUES (
        NEWID(), @TuitionId_Mai, 5500000.00, '2024-10-05 08:00:00', 1, 'CANCELLED', 
        'BANK-TCB-FAIL-001', @CashierId, N'Lỗi timeout kết nối ngân hàng Techcombank, giao dịch tự động hủy', 
        1, '2024-10-05 08:05:00', '2024-10-05 08:05:00', @AdminId, @AdminId, NULL, NULL
    );
END
-- ======================================================================
-- 6. BỔ SUNG HỌC PHÍ CHO HK1 2026-2027
-- ======================================================================

DECLARE @Sem_2627 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK1_2026_2027');
DECLARE @Price_K2021 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM tuition_fees WHERE course_year = 'K2021' AND fee_type = 'NEW');

-- Thêm học phí cho SV Đức ở HK1 2026-2027 (Dựa trên đăng ký ở V20: Mobile + AI = 6 tín chỉ)
DECLARE @SV_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV001');

IF @SV_Duc IS NOT NULL AND @Sem_2627 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @SV_Duc AND semester_id = @Sem_2627)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, 
        scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, is_active, created_at, created_by
    )
    VALUES (
        NEWID(), @SV_Duc, @Sem_2627, @Price_K2021, 6, 3300000.00, 
        0, 0, 3300000.00, 
        0, 3300000.00, 3, '2026-10-31', 1, GETDATE(), @AdminId
    );
END

GO
