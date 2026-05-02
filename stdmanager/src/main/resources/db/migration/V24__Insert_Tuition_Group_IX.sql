-- stdmanager/src/main/resources/db/migration/V24__Insert_Tuition_Group_IX.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. LẤY THÔNG TIN TỪ CÁC NHÓM TRƯỚC
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @GiaovuId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'giaovu');

DECLARE @Prog_KTPM UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_KTPM_2022');
DECLARE @Prog_QTKD UNIQUEIDENTIFIER = (SELECT id FROM training_programs WHERE program_code = 'CT_QTKD_2023');

DECLARE @SemesterId UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM semesters WHERE semester_code = 'HK1_2024_2025');

-- ======================================================================
-- 2. INSERT TUITION_FEES (Định mức học phí cho từng ngành)
-- ======================================================================
DECLARE @Fee_KTPM UNIQUEIDENTIFIER = NEWID();
DECLARE @Fee_QTKD UNIQUEIDENTIFIER = NEWID();

IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE program_id = @Prog_KTPM AND course_year = 'K22')
BEGIN
    INSERT INTO tuition_fees (id, program_id, course_year, price_per_credit, base_tuition, effective_date, is_active, created_at, created_by)
    VALUES 
    (@Fee_KTPM, @Prog_KTPM, 'K22', 550000.00, 1000000.00, '2024-01-01', 1, GETDATE(), @AdminId),
    (@Fee_QTKD, @Prog_QTKD, 'K23', 480000.00, 800000.00,  '2024-01-01', 1, GETDATE(), @AdminId);
END
ELSE 
BEGIN
    SET @Fee_KTPM = (SELECT id FROM tuition_fees WHERE program_id = @Prog_KTPM);
    SET @Fee_QTKD = (SELECT id FROM tuition_fees WHERE program_id = @Prog_QTKD);
END

-- ======================================================================
-- 3. INSERT STUDENT_TUITION (Hóa đơn học kỳ cho sinh viên)
-- ======================================================================
DECLARE @Stu_Duc UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20200001');
DECLARE @Stu_Hanh UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20210002');

DECLARE @Tuition_Duc UNIQUEIDENTIFIER = NEWID();
DECLARE @Tuition_Hanh UNIQUEIDENTIFIER = NEWID();

-- Sinh viên Đức: Đăng ký 15 tín chỉ, có học bổng 2tr
IF @Stu_Duc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Duc AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, tuition_fee_id, total_credits, 
        raw_amount, scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, is_active, created_at, created_by
    )
    VALUES (
        @Tuition_Duc, @Stu_Duc, @SemesterId, @Fee_KTPM, 15, 
        (15 * 550000 + 1000000), 2000000.00, 0.00, (15 * 550000 + 1000000 - 2000000), 
        0.00, (15 * 550000 + 1000000 - 2000000), 3, '2024-10-30', 1, GETDATE(), @GiaovuId
    );
END

-- Sinh viên Hạnh: Đăng ký 12 tín chỉ, không giảm
IF @Stu_Hanh IS NOT NULL AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = @Stu_Hanh AND semester_id = @SemesterId)
BEGIN
    INSERT INTO student_tuition (
        id, student_id, semester_id, tuition_fee_id, total_credits, 
        raw_amount, scholarship_deduction, exemption_amount, net_amount, 
        paid_amount, debt_amount, status, deadline, is_active, created_at, created_by
    )
    VALUES (
        @Tuition_Hanh, @Stu_Hanh, @SemesterId, @Fee_KTPM, 12, 
        (12 * 550000 + 1000000), 0.00, 0.00, (12 * 550000 + 1000000), 
        0.00, (12 * 550000 + 1000000), 3, '2024-10-30', 1, GETDATE(), @GiaovuId
    );
END

-- ======================================================================
-- 4. INSERT PAYMENTS (Lịch sử giao dịch)
-- ======================================================================

-- Giao dịch 1: Đức thanh toán toàn bộ qua Ngân hàng
IF EXISTS (SELECT 1 FROM student_tuition WHERE id = @Tuition_Duc)
BEGIN
    DECLARE @PayAmt_Duc DECIMAL(15,2) = (SELECT net_amount FROM student_tuition WHERE id = @Tuition_Duc);
    
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, 
        payment_status, transaction_ref, notes, is_active, created_at, created_by
    )
    VALUES (
        NEWID(), @Tuition_Duc, @PayAmt_Duc, GETDATE(), 1, 
        'SUCCESS', 'VNPAY123456789', N'Thanh toán học phí qua cổng VNPAY', 1, GETDATE(), @Stu_Duc
    );

    -- Cập nhật trạng thái hóa đơn của Đức thành Đã nộp (PAID - 1)
    UPDATE student_tuition 
    SET paid_amount = @PayAmt_Duc, debt_amount = 0, status = 1 
    WHERE id = @Tuition_Duc;
END

-- Giao dịch 2: Hạnh thanh toán một phần bằng Tiền mặt tại quầy
IF EXISTS (SELECT 1 FROM student_tuition WHERE id = @Tuition_Hanh)
BEGIN
    DECLARE @PartialPay DECIMAL(15,2) = 3000000.00;
    
    INSERT INTO payments (
        id, tuition_id, amount_paid, payment_date, payment_method, 
        payment_status, transaction_ref, cashier_id, notes, is_active, created_at, created_by
    )
    VALUES (
        NEWID(), @Tuition_Hanh, @PartialPay, GETDATE(), 2, 
        'SUCCESS', 'CASH-2024-001', @GiaovuId, N'Nộp trước một phần tại phòng tài vụ', 1, GETDATE(), @GiaovuId
    );

    -- Cập nhật trạng thái hóa đơn của Hạnh thành Nộp một phần (PARTIAL - 2)
    UPDATE student_tuition 
    SET paid_amount = @PartialPay, 
        debt_amount = net_amount - @PartialPay, 
        status = 2 
    WHERE id = @Tuition_Hanh;
END
GO