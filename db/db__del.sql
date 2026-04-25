-- Phần 1
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(s.name) + '.' + QUOTENAME(t.name) + ' DROP CONSTRAINT ' + QUOTENAME(f.name) + ';'
FROM sys.foreign_keys AS f
INNER JOIN sys.tables AS t ON f.parent_object_id = t.object_id
INNER JOIN sys.schemas AS s ON t.schema_id = s.schema_id;
EXEC sp_executesql @sql;
GO -- Kết thúc batch 1

-- Phần 2
DECLARE @sql NVARCHAR(MAX) = N''; -- Phải DECLARE lại ở đây
SELECT @sql += 'DROP TABLE ' + QUOTENAME(s.name) + '.' + QUOTENAME(t.name) + ';'
FROM sys.tables AS t
INNER JOIN sys.schemas AS s ON t.schema_id = s.schema_id
WHERE t.is_ms_shipped = 0;
EXEC sp_executesql @sql;
GO -- Kết thúc batch 2
