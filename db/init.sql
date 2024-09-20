-- CREATE DATABASE IF NOT EXISTS data_base
SELECT 'CREATE DATABASE data_base'
WHERE NOT EXISTS (SELECT FORM pg_database WHERE datname = 'data_base')\gexec