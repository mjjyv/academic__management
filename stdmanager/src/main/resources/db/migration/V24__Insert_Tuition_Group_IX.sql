-- stdmanager/src/main/resources/db/migration/V24__Insert_Tuition_Group_IX.sql

USE stdmanager_db;
GO

-- Xóa dữ liệu rác nếu chạy lại script
DELETE FROM payments;
DELETE FROM student_tuition;
DELETE FROM tuition_fees;

DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Sem_HK2_2526 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');

-- ======================================================================
-- 1. INSERT TUITION_FEES
-- ======================================================================
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE course_year = '2025' AND fee_type = 'NEW')
    INSERT INTO tuition_fees (id, course_year, fee_type, price_per_credit, is_active, created_at, created_by)
    VALUES (NEWID(), '2025', 'NEW', 450000, 1, GETDATE(), @AdminId);

-- ======================================================================
-- 2. INSERT STUDENT_TUITION (Full 6 students)
-- ======================================================================

DECLARE @Stu1 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250001');
DECLARE @Stu2 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250002');
DECLARE @Stu3 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250003');
DECLARE @Stu4 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250004');
DECLARE @Stu5 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250005');
DECLARE @Stu6 UNIQUEIDENTIFIER = (SELECT id FROM students WHERE student_code = 'SV20250006');

-- SV1: 7 TC, Fully Paid
IF @Stu1 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T1, @Stu1, @Sem_HK2_2526, 7, 3150000, 3150000, 3150000, 0, 1, '2026-03-31', 1, GETDATE(), @AdminId);
    INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
    VALUES (NEWID(), @T1, 3150000, 1, GETDATE(), 'TXN_SV1_HK2', 'SUCCESS', 1, GETDATE(), @AdminId);
END

-- SV2: 7 TC, UNPAID (Fixed: debt_amount = 3150000)
IF @Stu2 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T2 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T2, @Stu2, @Sem_HK2_2526, 7, 3150000, 3150000, 0, 3150000, 3, '2026-03-31', 1, GETDATE(), @AdminId);
END

-- SV3: 4 TC, Fully Paid
IF @Stu3 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T3 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T3, @Stu3, @Sem_HK2_2526, 4, 1800000, 1800000, 1800000, 0, 1, '2026-03-31', 1, GETDATE(), @AdminId);
    INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
    VALUES (NEWID(), @T3, 1800000, 1, GETDATE(), 'TXN_SV3_HK2', 'SUCCESS', 1, GETDATE(), @AdminId);
END

-- SV4: 7 TC, Fully Paid
IF @Stu4 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T4 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T4, @Stu4, @Sem_HK2_2526, 7, 3150000, 3150000, 3150000, 0, 1, '2026-03-31', 1, GETDATE(), @AdminId);
    INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
    VALUES (NEWID(), @T4, 3150000, 1, GETDATE(), 'TXN_SV4_HK2', 'SUCCESS', 1, GETDATE(), @AdminId);
END

-- SV5: 7 TC, Partially Paid (1,500,000)
IF @Stu5 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T5 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T5, @Stu5, @Sem_HK2_2526, 7, 3150000, 3150000, 1500000, 1650000, 2, '2026-03-31', 1, GETDATE(), @AdminId);
    INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
    VALUES (NEWID(), @T5, 1500000, 1, GETDATE(), 'TXN_SV5_HK2', 'SUCCESS', 1, GETDATE(), @AdminId);
END

-- SV6: 3 TC, Fully Paid
IF @Stu6 IS NOT NULL AND @Sem_HK2_2526 IS NOT NULL
BEGIN
    DECLARE @T6 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at, created_by)
    VALUES (@T6, @Stu6, @Sem_HK2_2526, 3, 1350000, 1350000, 1350000, 0, 1, '2026-03-31', 1, GETDATE(), @AdminId);
    INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
    VALUES (NEWID(), @T6, 1350000, 1, GETDATE(), 'TXN_SV6_HK2', 'SUCCESS', 1, GETDATE(), @AdminId);
END

GO
