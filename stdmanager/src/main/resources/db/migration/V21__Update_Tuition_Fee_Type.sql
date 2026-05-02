-- stdmanager/src/main/resources/db/migration/V10__Update_Tuition_Fee_Type.sql

USE [stdmanager_db]
GO

-- Thêm trường fee_type để phân biệt đơn giá học mới và học lại
ALTER TABLE tuition_fees ADD fee_type VARCHAR(20) DEFAULT 'NEW';
GO

-- Ràng buộc giá trị hợp lệ
ALTER TABLE tuition_fees ADD CONSTRAINT CHK_FeeType CHECK (fee_type IN ('NEW', 'RETAKE'));
GO
