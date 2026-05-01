-- stdmanager/src/main/resources/db/migration/V20__Fix_Registration_DataTypes.sql

USE stdmanager_db;
GO

-- ======================================================================
-- 1. XỬ LÝ CHO BẢNG course_registrations
-- ======================================================================

-- Xử lý cột status (có default constraint)
DECLARE @StatusConstraintName NVARCHAR(200);
SELECT @StatusConstraintName = d.name
FROM sys.default_constraints d
INNER JOIN sys.columns c ON d.parent_column_id = c.column_id AND d.parent_object_id = c.object_id
WHERE d.parent_object_id = OBJECT_ID('course_registrations') AND c.name = 'status';

IF @StatusConstraintName IS NOT NULL
    EXEC('ALTER TABLE course_registrations DROP CONSTRAINT ' + @StatusConstraintName);

ALTER TABLE course_registrations ALTER COLUMN status INT;
ALTER TABLE course_registrations ADD CONSTRAINT DF_CourseRegistrations_Status DEFAULT 1 FOR status;

-- Xử lý cột registration_type
ALTER TABLE course_registrations ALTER COLUMN registration_type INT NOT NULL;
GO


-- ======================================================================
-- 2. XỬ LÝ CHO BẢNG registration_periods
-- ======================================================================

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'registration_periods')
BEGIN
    -- Xử lý max_credits
    DECLARE @MaxCreditsConstraint NVARCHAR(200);
    SELECT @MaxCreditsConstraint = d.name
    FROM sys.default_constraints d
    INNER JOIN sys.columns c ON d.parent_column_id = c.column_id AND d.parent_object_id = c.object_id
    WHERE d.parent_object_id = OBJECT_ID('registration_periods') AND c.name = 'max_credits';

    IF @MaxCreditsConstraint IS NOT NULL
        EXEC('ALTER TABLE registration_periods DROP CONSTRAINT ' + @MaxCreditsConstraint);

    ALTER TABLE registration_periods ALTER COLUMN max_credits INT;
    ALTER TABLE registration_periods ADD CONSTRAINT DF_RegPeriods_MaxCredits DEFAULT 25 FOR max_credits;

    -- Xử lý min_credits
    DECLARE @MinCreditsConstraint NVARCHAR(200);
    SELECT @MinCreditsConstraint = d.name
    FROM sys.default_constraints d
    INNER JOIN sys.columns c ON d.parent_column_id = c.column_id AND d.parent_object_id = c.object_id
    WHERE d.parent_object_id = OBJECT_ID('registration_periods') AND c.name = 'min_credits';

    IF @MinCreditsConstraint IS NOT NULL
        EXEC('ALTER TABLE registration_periods DROP CONSTRAINT ' + @MinCreditsConstraint);

    ALTER TABLE registration_periods ALTER COLUMN min_credits INT;
    ALTER TABLE registration_periods ADD CONSTRAINT DF_RegPeriods_MinCredits DEFAULT 12 FOR min_credits;
END
GO
