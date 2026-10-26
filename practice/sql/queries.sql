-- Cau 1
SELECT t.title, date_part('day', t.due_date - NOW())
FROM users u JOIN projects p
ON u.id=p.user_id JOIN tasks t
ON p.id=t.project_id
WHERE u.id=1 AND t.completed_at IS NULL
ORDER BY t.due_date;

--Cau 2
SELECT COUNT(t.id)
FROM tasks t RIGHT JOIN projects p
ON t.project_id=p.id
GROUP BY p.id
ORDER BY p.id;

--Cau 3
SELECT p.id
FROM projects p LEFT JOIN tasks t
ON p.id=t.project_id
WHERE t.id IS NULL;

--Cau 4
SELECT u.id, COUNT(*) AS "due tasks"
FROM users u JOIN projects p
ON u.id = p.user_id JOIN tasks t
ON p.id = t.project_id
WHERE (NOW() > t.due_date AND t.completed_at IS NULL)
GROUP BY u.id
HAVING COUNT(*) = (
  SELECT MAX(cnt)
  FROM (
    SELECT COUNT(*) AS "cnt"
    FROM users u JOIN projects p
    ON u.id = p.user_id JOIN tasks t
    ON p.id = t.project_id
    WHERE (NOW() > t.due_date AND t.completed_at IS NULL)
    GROUP BY u.id
  ) AS max_due_per_user
);

--Cau 5
SELECT p.id,
CASE
WHEN COUNT(t.id) = 0 THEN '?'
ELSE
ROUND(COUNT(*) FILTER (WHERE t.completed_at IS NOT NULL) / COUNT(*)::numeric * 100, 2):: text
END AS "finish_rate"
FROM projects p LEFT JOIN tasks t
ON p.id = t.project_id
GROUP BY p.id
ORDER BY p.id;

--Cau 6
SELECT t.title
FROM task_labels tl JOIN tasks t
ON tl.task_id = t.id JOIN labels l
ON tl.label_id = l.id
WHERE tl.label_id IN (
  SELECT id
  FROM labels
  WHERE name = 'urgent'
);

--Cau 7
SELECT p.id, COUNT(t.id)
FROM projects p JOIN tasks t
ON p.id = t.project_id
WHERE date_trunc('month', t.created_at) = date_trunc('month', NOW())
GROUP BY p.id
ORDER BY COUNT(t.id) DESC
LIMIT 3;

--Cau 8
SELECT m.day, COUNT(t.id)
FROM generate_series(0, -6, -1) AS m(day)
LEFT JOIN tasks t
ON t.completed_at::date = CURRENT_DATE + m.day
GROUP BY m.day
ORDER BY m.day;
