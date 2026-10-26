-- Xóa dữ liệu cũ, đưa id về 1
TRUNCATE users, projects, tasks, labels, task_labels RESTART IDENTITY CASCADE;

-- 1.000 user
INSERT INTO users (name, email)
SELECT 'User ' || i, 'user' || i || '@example.com'
FROM generate_series(1, 1000) AS i;

-- 10.000 project, mỗi user 10 project
INSERT INTO projects (user_id, name)
SELECT (i - 1) % 1000 + 1, 'Project ' || i
FROM generate_series(1, 10000) AS i;

-- 1.000.000 task, mỗi project 100 task → mỗi user 1.000 task (0,1% cả bảng)
INSERT INTO tasks (project_id, title, priority, due_date, created_at, completed_at)
SELECT
  (i - 1) % 10000 + 1,
  'Task ' || i,
  (ARRAY['low', 'medium', 'high'])[floor(random() * 3 + 1)::int],
  CASE WHEN random() < 0.9 THEN NOW() + random() * INTERVAL '60 days' - INTERVAL '30 days' END,  -- 10% không có hạn
  NOW() - random() * INTERVAL '60 days',
  CASE WHEN random() < 0.3 THEN NOW() - random() * INTERVAL '30 days' END                         -- 30% đã xong
FROM generate_series(1, 1000000) AS i;

-- Cập nhật thống kê cho query planner
ANALYZE;
