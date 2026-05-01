-- stdmanager/src/main/resources/db/migration/V19__Fix_Database_Constraints_And_Performance.sql

-- ======================================================================
-- 1. BỔ SUNG FOREIGN KEY CONSTRAINTS (Referential Integrity)
-- ======================================================================

-- Dọn dẹp dữ liệu rác trước khi tạo ràng buộc (Orphan Cleanup)
UPDATE student_classes SET major_id = NULL WHERE major_id IS NOT NULL AND major_id NOT IN (SELECT id FROM majors);
UPDATE student_classes SET department_id = NULL WHERE department_id IS NOT NULL AND department_id NOT IN (SELECT id FROM departments);
UPDATE student_classes SET advisor_id = NULL WHERE advisor_id IS NOT NULL AND advisor_id NOT IN (SELECT id FROM employees);

UPDATE students SET department_id = NULL WHERE department_id IS NOT NULL AND department_id NOT IN (SELECT id FROM departments);
UPDATE students SET major_id = NULL WHERE major_id IS NOT NULL AND major_id NOT IN (SELECT id FROM majors);
UPDATE students SET program_id = NULL WHERE program_id IS NOT NULL AND program_id NOT IN (SELECT id FROM training_programs);

-- Group II: Student & Classes
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Majors')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Majors FOREIGN KEY (major_id) REFERENCES majors(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Departments')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Departments FOREIGN KEY (department_id) REFERENCES departments(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StudentClasses_Advisors')
    ALTER TABLE student_classes ADD CONSTRAINT FK_StudentClasses_Advisors FOREIGN KEY (advisor_id) REFERENCES employees(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Departments')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Departments FOREIGN KEY (department_id) REFERENCES departments(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Majors')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Majors FOREIGN KEY (major_id) REFERENCES majors(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Programs')
    ALTER TABLE students ADD CONSTRAINT FK_Students_Programs FOREIGN KEY (program_id) REFERENCES training_programs(id);

-- Group V: Semesters & Course Sections
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Courses')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Courses FOREIGN KEY (course_id) REFERENCES courses(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Semesters')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Lecturers')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Lecturers FOREIGN KEY (lecturer_id) REFERENCES employees(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Rooms')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Rooms FOREIGN KEY (room_id) REFERENCES rooms(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_CourseSections_Buildings')
    ALTER TABLE course_sections ADD CONSTRAINT FK_CourseSections_Buildings FOREIGN KEY (building_id) REFERENCES buildings(id);

-- Group VI: Registrations
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Students')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Students FOREIGN KEY (student_id) REFERENCES students(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Sections')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Sections FOREIGN KEY (course_section_id) REFERENCES course_sections(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Registrations_Periods')
    ALTER TABLE course_registrations ADD CONSTRAINT FK_Registrations_Periods FOREIGN KEY (registration_period_id) REFERENCES registration_periods(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_RegistrationPeriods_Semesters')
    ALTER TABLE registration_periods ADD CONSTRAINT FK_RegistrationPeriods_Semesters FOREIGN KEY (semester_id) REFERENCES semesters(id);

-- Group VIII: Grades
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GradeComponents_Sections')
    ALTER TABLE grade_components ADD CONSTRAINT FK_GradeComponents_Sections FOREIGN KEY (course_section_id) REFERENCES course_sections(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ComponentGrades_Registrations')
    ALTER TABLE student_component_grades ADD CONSTRAINT FK_ComponentGrades_Registrations FOREIGN KEY (registration_id) REFERENCES course_registrations(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ComponentGrades_Components')
    ALTER TABLE student_component_grades ADD CONSTRAINT FK_ComponentGrades_Components FOREIGN KEY (component_id) REFERENCES grade_components(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Summaries_Registrations')
    ALTER TABLE student_summaries ADD CONSTRAINT FK_Summaries_Registrations FOREIGN KEY (registration_id) REFERENCES course_registrations(id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Summaries_Scales')
    ALTER TABLE student_summaries ADD CONSTRAINT FK_Summaries_Scales FOREIGN KEY (scale_id) REFERENCES grade_scales(id);

-- ======================================================================
-- 2. TỐI ƯU HÓA HIỆU SUẤT (Indexing)
-- ======================================================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_FullName' AND object_id = OBJECT_ID('students'))
    CREATE INDEX IX_Students_FullName ON students(full_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('users'))
    CREATE INDEX IX_Users_Email ON users(email);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Phone' AND object_id = OBJECT_ID('users'))
    CREATE INDEX IX_Users_Phone ON users(phone);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_FullName' AND object_id = OBJECT_ID('employees'))
    CREATE INDEX IX_Employees_FullName ON employees(full_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Courses_Name' AND object_id = OBJECT_ID('courses'))
    CREATE INDEX IX_Courses_Name ON courses(course_name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_ClassId' AND object_id = OBJECT_ID('students'))
    CREATE INDEX IX_Students_ClassId ON students(class_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseSections_CourseId' AND object_id = OBJECT_ID('course_sections'))
    CREATE INDEX IX_CourseSections_CourseId ON course_sections(course_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseSections_SemesterId' AND object_id = OBJECT_ID('course_sections'))
    CREATE INDEX IX_CourseSections_SemesterId ON course_sections(semester_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseRegistrations_StudentId' AND object_id = OBJECT_ID('course_registrations'))
    CREATE INDEX IX_CourseRegistrations_StudentId ON course_registrations(student_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CourseRegistrations_SectionId' AND object_id = OBJECT_ID('course_registrations'))
    CREATE INDEX IX_CourseRegistrations_SectionId ON course_registrations(course_section_id);

-- ======================================================================
-- 3. XỬ LÝ TRANH CHẤP DỮ LIỆU (Concurrency Control)
-- ======================================================================

-- Bổ sung cột version cho Optimistic Locking (JPA @Version)
-- Áp dụng cho các bảng chính kế thừa BaseEntity
DECLARE @tableName NVARCHAR(255);
DECLARE table_cursor CURSOR FOR 
SELECT t.name 
FROM sys.tables t
JOIN sys.columns c1 ON t.object_id = c1.object_id AND c1.name = 'id'
JOIN sys.columns c2 ON t.object_id = c2.object_id AND c2.name = 'created_at'
WHERE t.is_ms_shipped = 0; -- Chỉ lấy bảng người dùng tạo

OPEN table_cursor;
FETCH NEXT FROM table_cursor INTO @tableName;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @sql NVARCHAR(MAX) = 'IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(''' + @tableName + ''') AND name = ''lock_version'') 
                                 BEGIN ALTER TABLE [' + @tableName + '] ADD lock_version INT DEFAULT 0; END';
    EXEC sp_executesql @sql;
    FETCH NEXT FROM table_cursor INTO @tableName;
END

CLOSE table_cursor;
DEALLOCATE table_cursor;
