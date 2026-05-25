-- stdmanager/src/main/resources/db/migration/V32__Seed_Grades_And_Sync_Tuition.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. KHỞI TẠO BIẾN
-- ======================================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT id FROM users WHERE username = 'admin');
DECLARE @Dept_CNTT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE code = 'CNTT');
DECLARE @Sem_HK2 UNIQUEIDENTIFIER = (SELECT id FROM semesters WHERE semester_code = 'HK2_2025_2026');

-- ======================================================================
-- 2. DỌN DẸP DỮ LIỆU CŨ (Để sync lại từ đầu cho CNTT HK2)
-- ======================================================================
DELETE sg FROM student_component_grades sg
JOIN course_registrations cr ON sg.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN courses c ON cs.course_id = c.id
WHERE cs.semester_id = @Sem_HK2
AND c.department_id = @Dept_CNTT;

DELETE ss FROM student_summaries ss
JOIN course_registrations cr ON ss.registration_id = cr.id
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN courses c ON cs.course_id = c.id
WHERE cs.semester_id = @Sem_HK2
AND c.department_id = @Dept_CNTT;

-- ======================================================================
-- 3. SEED ĐIỂM THÀNH PHẦN (CHUYÊN CẦN, GIỮA KỲ/THỰC HÀNH/BTL, CUỐI KỲ)
-- ======================================================================

-- Seed cho CNTT-K25A (.01) - Điểm cao
INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
SELECT 
    NEWID(), 
    cr.id, 
    gc.id, 
    CASE 
        WHEN gc.component_code = 'CC' THEN 10.0
        WHEN gc.component_code IN ('GK', 'TH', 'BTL') THEN 9.0
        ELSE 8.5 -- CK
    END,
    0, 1, 1, GETDATE(), @AdminId
FROM course_registrations cr
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN grade_components gc ON cs.id = gc.course_section_id
WHERE cs.class_code IN ('INT1302.01', 'INT1304.01', 'INT2203.01')
AND cs.semester_id = @Sem_HK2;

-- Seed cho CNTT-K25B (.02) - Điểm khá
INSERT INTO student_component_grades (id, registration_id, component_id, score, is_retake, is_locked, is_active, created_at, created_by)
SELECT 
    NEWID(), 
    cr.id, 
    gc.id, 
    CASE 
        WHEN gc.component_code = 'CC' THEN 9.0
        WHEN gc.component_code IN ('GK', 'TH', 'BTL') THEN 7.5
        ELSE 7.0 -- CK
    END,
    0, 1, 1, GETDATE(), @AdminId
FROM course_registrations cr
JOIN course_sections cs ON cr.course_section_id = cs.id
JOIN grade_components gc ON cs.id = gc.course_section_id
WHERE cs.class_code IN ('INT1302.02', 'INT1304.02', 'INT2203.02')
AND cs.semester_id = @Sem_HK2;

-- ======================================================================
-- 4. TÍNH TOÁN VÀ SEED ĐIỂM TỔNG KẾT (STUDENT_SUMMARIES)
-- ======================================================================

INSERT INTO student_summaries (id, registration_id, total_score, scale_id, letter_grade, gpa_value, result, is_finalized, is_active, created_at, created_by)
SELECT 
    NEWID(),
    calc.registration_id,
    calc.total_score,
    gs.id,
    gs.letter_grade,
    gs.gpa_value,
    CASE WHEN gs.is_pass = 1 THEN 'PASS' ELSE 'FAIL' END,
    1, 1, GETDATE(), @AdminId
FROM (
    -- Tính điểm tổng kết theo trọng số
    SELECT 
        cr.id as registration_id,
        SUM(sg.score * gc.weight_percentage / 100.0) as total_score
    FROM course_registrations cr
    JOIN student_component_grades sg ON cr.id = sg.registration_id
    JOIN grade_components gc ON sg.component_id = gc.id
    GROUP BY cr.id
) calc
-- Ánh xạ vào thang điểm
JOIN grade_scales gs ON calc.total_score >= gs.min_score AND (gs.max_score IS NULL OR calc.total_score <= gs.max_score)
WHERE gs.is_active = 1;

-- ======================================================================
-- 5. ĐỒNG BỘ TRẠNG THÁI HỌC PHÍ (STUDENT_TUITION)
-- ======================================================================

-- Xóa nợ nếu tất cả đăng ký đã thanh toán
UPDATE st
SET st.status = 1, -- PAID
    st.paid_amount = st.net_amount,
    st.debt_amount = 0,
    st.updated_at = GETDATE()
FROM student_tuition st
WHERE EXISTS (
    SELECT 1 FROM course_registrations cr
    JOIN course_sections cs ON cr.course_section_id = cs.id
    WHERE cr.student_id = st.student_id
    AND cs.semester_id = st.semester_id
    AND cr.status != 3
)
AND NOT EXISTS (
    SELECT 1 FROM course_registrations cr
    JOIN course_sections cs ON cr.course_section_id = cs.id
    WHERE cr.student_id = st.student_id
    AND cs.semester_id = st.semester_id
    AND cr.status != 3
    AND (cr.is_paid IS NULL OR cr.is_paid = 0)
)
AND st.status != 1;

-- Insert lịch sử thanh toán nếu thiếu
INSERT INTO payments (id, tuition_id, amount_paid, payment_method, payment_date, transaction_ref, payment_status, is_active, created_at, created_by)
SELECT 
    NEWID(), 
    st.id, 
    st.net_amount - ISNULL(p_total.paid, 0), 
    1, GETDATE(), 'TXN_SYNC_PAID_V32_REFINED', 'SUCCESS', 1, GETDATE(), st.created_by
FROM student_tuition st
LEFT JOIN (
    SELECT tuition_id, SUM(amount_paid) as paid FROM payments GROUP BY tuition_id
) p_total ON st.id = p_total.tuition_id
WHERE st.status = 1
AND st.net_amount > ISNULL(p_total.paid, 0);

GO
