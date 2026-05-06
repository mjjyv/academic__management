USE stdmanager_db;
GO

-- ======================================================================
-- 1. CẬP NHẬT TRẠNG THÁI ACTIVE CHO HỌC KỲ
-- ======================================================================
-- Chỉ để Học kỳ hè là Active (vì đang trong đợt đăng ký)
-- Học kỳ 2 2526 đã xong việc học, chuyển về Inactive để tránh recalculate
UPDATE semesters SET is_active = 0 WHERE semester_code IN ('HK1_2025_2026', 'HK2_2025_2026');
UPDATE semesters SET is_active = 1 WHERE semester_code IN ('2526_HE', '2526_HLCT');

-- ======================================================================
-- 2. ĐỒNG BỘ DỮ LIỆU HỌC PHÍ HỌC KỲ 2 (2025-2026) - PHẢI ĐÓNG ĐỦ
-- ======================================================================
DECLARE @Sem_HK2 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');

-- Đảm bảo tất cả đăng ký HK2 là Thành công (status=1) và Đã đóng tiền (is_paid=1)
UPDATE course_registrations
SET status = 1, is_paid = 1
WHERE course_section_id IN (SELECT id FROM course_sections WHERE semester_id = @Sem_HK2);

-- Cập nhật StudentTuition cho HK2: Đóng đủ 100%
-- Giả sử đơn giá là 500k/TC (theo V31)
UPDATE st
SET st.total_credits = s_stats.total_credits,
    st.raw_amount = s_stats.total_credits * 500000,
    st.net_amount = s_stats.total_credits * 500000,
    st.paid_amount = s_stats.total_credits * 500000,
    st.debt_amount = 0,
    st.status = 1 -- PAID
FROM student_tuition st
JOIN (
    SELECT cr.student_id, SUM(c.credits) as total_credits
    FROM course_registrations cr
    JOIN course_sections cs ON cr.course_section_id = cs.id
    JOIN courses c ON cs.course_id = c.id
    WHERE cs.semester_id = @Sem_HK2
    AND cr.status = 1
    GROUP BY cr.student_id
) s_stats ON st.student_id = s_stats.student_id
WHERE st.semester_id = @Sem_HK2;

-- Nếu chưa có bản ghi student_tuition cho HK2 thì tạo mới (đóng đủ)
INSERT INTO student_tuition (id, student_id, semester_id, total_credits, raw_amount, net_amount, paid_amount, debt_amount, status, deadline, is_active, created_at)
SELECT 
    NEWID(), cr.student_id, @Sem_HK2, SUM(c.credits), SUM(c.credits * 500000), SUM(c.credits * 500000), SUM(c.credits * 500000), 0, 1, '2026-06-30', 1, GETDATE()
FROM course_registrations cr
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN courses c ON cs.course_id = c.id
WHERE cs.semester_id = @Sem_HK2
AND cr.status = 1
AND NOT EXISTS (SELECT 1 FROM student_tuition WHERE student_id = cr.student_id AND semester_id = @Sem_HK2)
GROUP BY cr.student_id;

-- Cập nhật lịch sử thanh toán cho HK2
INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at)
SELECT 
    NEWID(), st.id, st.net_amount - ISNULL(p.total_paid, 0), 1, GETDATE(), 'TXN_SYNC_FULL_PAID_HK2', 'SUCCESS', 1, GETDATE()
FROM student_tuition st
LEFT JOIN (SELECT tuition_id, SUM(amount_paid) as total_paid FROM payments GROUP BY tuition_id) p ON st.id = p.tuition_id
WHERE st.semester_id = @Sem_HK2
AND st.net_amount > ISNULL(p.total_paid, 0);

-- ======================================================================
-- 3. ĐỒNG BỘ DỮ LIỆU HỌC PHÍ HÈ (CHƯA BẮT BUỘC ĐÓNG)
-- ======================================================================
DECLARE @Sem_HE UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = '2526_HE');

-- Học hè mới đăng ký, chưa đóng tiền
UPDATE course_registrations
SET is_paid = 0
WHERE course_section_id IN (SELECT id FROM course_sections WHERE semester_id = @Sem_HE);

-- Reset paid_amount về 0 cho kỳ hè
UPDATE student_tuition
SET paid_amount = 0,
    debt_amount = net_amount,
    status = 3 -- DEBT
WHERE semester_id = @Sem_HE;

-- Xóa các payment nhầm cho kỳ hè (nếu có từ seed cũ)
DELETE FROM payments WHERE tuition_id IN (SELECT id FROM student_tuition WHERE semester_id = @Sem_HE);

GO
