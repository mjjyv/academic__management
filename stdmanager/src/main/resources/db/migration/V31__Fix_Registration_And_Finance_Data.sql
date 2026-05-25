-- stdmanager/src/main/resources/db/migration/V31__Fix_Registration_And_Finance_Data.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. SỬA LỖI ĐĂNG KÝ NHẦM ĐỢT (Do bug V30 lấy TOP 1 Period)
-- ======================================================================
DECLARE @Period_HK2 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM registration_periods WHERE name LIKE N'%HK2 - 2526%' ORDER BY created_at ASC);

-- Chuyển các đăng ký của các môn HK2 về đúng đợt đăng ký HK2
UPDATE course_registrations
SET registration_period_id = @Period_HK2
WHERE course_section_id IN (
    SELECT id FROM course_sections 
    WHERE class_code IN ('INT1302.01', 'INT1304.01', 'INT2203.01', 'INT1302.02', 'INT1304.02', 'INT2203.02')
)
AND @Period_HK2 IS NOT NULL;

-- ======================================================================
-- 2. XÓA NỢ HỌC KỲ 2 (Vì đã qua)
-- ======================================================================
DECLARE @Sem_HK2 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');

-- Cập nhật trạng thái PAID và xóa nợ
UPDATE student_tuition
SET status = 1, -- PAID
    paid_amount = net_amount,
    debt_amount = 0,
    updated_at = GETDATE()
WHERE semester_id = @Sem_HK2;

-- Thêm lịch sử thanh toán cho các khoản nợ vừa được xóa
INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
SELECT 
    NEWID(), 
    t.id, 
    t.net_amount - ISNULL(p_total.paid, 0), 
    1, GETDATE(), 'TXN_CLEAR_DEBT_HK2', 'SUCCESS', 1, GETDATE(), t.created_by
FROM student_tuition t
LEFT JOIN (
    SELECT tuition_id, SUM(amount_paid) as paid FROM payments GROUP BY tuition_id
) p_total ON t.id = p_total.tuition_id
WHERE t.semester_id = @Sem_HK2
AND t.net_amount > ISNULL(p_total.paid, 0);

-- ======================================================================
-- 3. CẬP NHẬT ĐƠN GIÁ HỌC PHÍ MỚI (500K/750K theo UI)
-- ======================================================================
UPDATE tuition_fees SET price_per_credit = 500000 WHERE fee_type = 'NEW' AND course_year = '2025';
IF NOT EXISTS (SELECT 1 FROM tuition_fees WHERE fee_type = 'RETAKE' AND course_year = '2025')
    INSERT INTO tuition_fees (id, course_year, fee_type, price_per_credit, effective_date, is_active, created_at)
    VALUES (NEWID(), '2025', 'RETAKE', 750000, GETDATE(), 1, GETDATE());
ELSE
    UPDATE tuition_fees SET price_per_credit = 750000 WHERE fee_type = 'RETAKE' AND course_year = '2025';

-- ======================================================================
-- 4. TÍNH HỌC PHÍ CHO HỌC KỲ HÈ VÀ HỌC LẠI HÈ
-- ======================================================================
DECLARE @Sem_Summer UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = '2526_HE');
DECLARE @Sem_HLCT UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = '2526_HLCT');
DECLARE @Fee_NEW UNIQUEIDENTIFIER = (SELECT id FROM tuition_fees WHERE fee_type = 'NEW' AND course_year = '2025');
DECLARE @Fee_Retake UNIQUEIDENTIFIER = (SELECT id FROM tuition_fees WHERE fee_type = 'RETAKE' AND course_year = '2025');

-- Tính học phí 2526_HE (Học mới - 500k)
INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at)
SELECT 
    NEWID(),
    s_stats.student_id,
    @Sem_Summer,
    @Fee_NEW,
    s_stats.total_credits,
    s_stats.amount,
    s_stats.amount,
    0,
    s_stats.amount,
    3, -- DEBT
    '2026-06-30',
    1,
    GETDATE()
FROM (
    SELECT 
        cr.student_id,
        SUM(c.credits) as total_credits,
        SUM(c.credits * 500000) as amount
    FROM course_registrations cr
    JOIN course_sections cs ON cr.course_section_id = cs.id
    JOIN courses c ON cs.course_id = c.id
    WHERE cs.semester_id = @Sem_Summer
    AND cr.status != 3
    GROUP BY cr.student_id
) s_stats
WHERE NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = s_stats.student_id AND semester_id = @Sem_Summer);

-- Tính học phí 2526_HLCT (Học lại - 750k)
INSERT INTO student_tuition (id, student_id, semester_id, tuition_fee_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at)
SELECT 
    NEWID(),
    s_stats.student_id,
    @Sem_HLCT,
    @Fee_Retake,
    s_stats.total_credits,
    s_stats.amount,
    s_stats.amount,
    0,
    s_stats.amount,
    3, -- DEBT
    '2026-06-30',
    1,
    GETDATE()
FROM (
    SELECT 
        cr.student_id,
        SUM(c.credits) as total_credits,
        SUM(c.credits * 750000) as amount
    FROM course_registrations cr
    JOIN course_sections cs ON cr.course_section_id = cs.id
    JOIN courses c ON cs.course_id = c.id
    WHERE cs.semester_id = @Sem_HLCT
    AND cr.status != 3
    GROUP BY cr.student_id
) s_stats
WHERE NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = s_stats.student_id AND semester_id = @Sem_HLCT);

GO
