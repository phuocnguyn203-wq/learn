-- Xóa dữ liệu cũ, reset id về 1 để chạy lại nhiều lần
TRUNCATE users, projects, tasks, labels, task_labels RESTART IDENTITY CASCADE;

-- 5 user
INSERT INTO users (name, email) VALUES
  ('An',   'an@example.com'),
  ('Bình', 'binh@example.com'),
  ('Chi',  'chi@example.com'),
  ('Dũng', 'dung@example.com'),
  ('Em',   'em@example.com');

-- 10 project, mỗi user 2 project. Project 10 không có task nào.
INSERT INTO projects (user_id, name, description) VALUES
  (1, 'Website công ty', 'Làm lại website'),
  (1, 'Marketing Q4',    NULL),
  (2, 'Quản lý kho',     'Hệ thống kho hàng'),
  (2, 'Tự học',          NULL),
  (3, 'Dự án khách A',   'Phần mềm cho khách A'),
  (3, 'Hạ tầng',         NULL),
  (4, 'Xuất bản sách',   NULL),
  (4, 'Nhân sự',         NULL),
  (5, 'Tiệc cuối năm',   NULL),
  (5, 'Ý tưởng',         'Chưa bắt đầu');

-- 50 task. Ngày tính tương đối so với NOW() để query luôn đúng dù chạy hôm nào.
-- Quá hạn = due_date < NOW() và completed_at IS NULL
INSERT INTO tasks (project_id, title, priority, due_date, created_at, completed_at) VALUES
  -- Project 1 (An): 10 task, 2 quá hạn, 7 tạo tháng này
  (1, 'Thiết kế trang chủ',  'high',   NOW() + INTERVAL '3 days',  date_trunc('month', NOW()), NULL),
  (1, 'Viết API đăng nhập',  'high',   NOW() - INTERVAL '2 days',  date_trunc('month', NOW()), NULL),
  (1, 'Sửa lỗi footer',      'low',    NOW() - INTERVAL '5 days',  NOW() - INTERVAL '40 days', NULL),
  (1, 'Tối ưu ảnh',          'medium', NOW() + INTERVAL '7 days',  date_trunc('month', NOW()), NULL),
  (1, 'Viết README',         'low',    NOW() - INTERVAL '10 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '1 day'),
  (1, 'Cài CI',              'medium', NOW() - INTERVAL '3 days',  date_trunc('month', NOW()), NOW()),
  (1, 'Thêm dark mode',      'low',    NULL,                       date_trunc('month', NOW()), NULL),
  (1, 'Kiểm thử form',       'medium', NOW() + INTERVAL '1 day',   date_trunc('month', NOW()), NOW() - INTERVAL '2 days'),
  (1, 'Deploy staging',      'high',   NOW() - INTERVAL '20 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '25 days'),
  (1, 'Viết unit test',      'medium', NOW() + INTERVAL '10 days', date_trunc('month', NOW()), NULL),

  -- Project 2 (An): 6 task, 0 quá hạn, 2 tạo tháng này
  (2, 'Lên kế hoạch marketing', 'medium', NOW() + INTERVAL '5 days',  NOW() - INTERVAL '40 days', NULL),
  (2, 'Viết bài blog',          'low',    NOW() + INTERVAL '2 days',  date_trunc('month', NOW()), NULL),
  (2, 'Chụp ảnh sản phẩm',      'low',    NOW() - INTERVAL '30 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '35 days'),
  (2, 'Làm video demo',         'high',   NOW() + INTERVAL '14 days', date_trunc('month', NOW()), NULL),
  (2, 'Gửi newsletter',         'medium', NOW() - INTERVAL '1 day',   NOW() - INTERVAL '40 days', NOW() - INTERVAL '6 days'),
  (2, 'Khảo sát khách hàng',    'low',    NULL,                       NOW() - INTERVAL '40 days', NULL),

  -- Project 3 (Bình): 8 task, 3 quá hạn, 5 tạo tháng này
  (3, 'Nhập kho tháng',     'high',   NOW() - INTERVAL '4 days',  date_trunc('month', NOW()), NULL),
  (3, 'Kiểm kê',            'medium', NOW() - INTERVAL '8 days',  NOW() - INTERVAL '40 days', NULL),
  (3, 'Đặt hàng NCC',       'high',   NOW() - INTERVAL '1 day',   date_trunc('month', NOW()), NULL),
  (3, 'In hóa đơn',         'low',    NOW() + INTERVAL '3 days',  date_trunc('month', NOW()), NOW() - INTERVAL '1 day'),
  (3, 'Báo cáo doanh thu',  'high',   NOW() + INTERVAL '6 days',  date_trunc('month', NOW()), NULL),
  (3, 'Cập nhật giá',       'medium', NOW() - INTERVAL '15 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '16 days'),
  (3, 'Liên hệ đối tác',    'low',    NOW() + INTERVAL '20 days', date_trunc('month', NOW()), NULL),
  (3, 'Dọn dữ liệu cũ',     'low',    NULL,                       NOW() - INTERVAL '40 days', NOW() - INTERVAL '4 days'),

  -- Project 4 (Bình): 5 task, 1 quá hạn, 2 tạo tháng này
  (4, 'Học SQL',             'medium', NOW() - INTERVAL '2 days',  NOW() - INTERVAL '40 days', NULL),
  (4, 'Đọc sách TS',         'low',    NOW() + INTERVAL '30 days', date_trunc('month', NOW()), NULL),
  (4, 'Luyện thuật toán',    'medium', NOW() + INTERVAL '4 days',  NOW() - INTERVAL '40 days', NOW()),
  (4, 'Làm bài tập Express', 'high',   NOW() - INTERVAL '6 days',  NOW() - INTERVAL '40 days', NOW() - INTERVAL '6 days'),
  (4, 'Ôn tập Git',          'low',    NULL,                       date_trunc('month', NOW()), NOW() - INTERVAL '2 days'),

  -- Project 5 (Chi): 7 task, 1 quá hạn, 4 tạo tháng này
  (5, 'Phân tích yêu cầu',  'high',   NOW() - INTERVAL '3 days',  date_trunc('month', NOW()), NULL),
  (5, 'Vẽ ERD',             'medium', NOW() + INTERVAL '2 days',  date_trunc('month', NOW()), NOW() - INTERVAL '1 day'),
  (5, 'Viết tài liệu API',  'medium', NOW() + INTERVAL '8 days',  date_trunc('month', NOW()), NULL),
  (5, 'Họp khách hàng',     'high',   NOW() - INTERVAL '12 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '13 days'),
  (5, 'Chuẩn bị demo',      'high',   NOW() + INTERVAL '1 day',   date_trunc('month', NOW()), NULL),
  (5, 'Viết hợp đồng',      'low',    NOW() + INTERVAL '15 days', NOW() - INTERVAL '40 days', NULL),
  (5, 'Báo giá',            'medium', NOW() - INTERVAL '25 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '26 days'),

  -- Project 6 (Chi): 4 task, 0 quá hạn, 1 tạo tháng này
  (6, 'Mua thiết bị',       'medium', NOW() + INTERVAL '9 days',  NOW() - INTERVAL '40 days', NULL),
  (6, 'Cài máy chủ',        'high',   NOW() - INTERVAL '7 days',  NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days'),
  (6, 'Cấu hình firewall',  'high',   NOW() + INTERVAL '2 days',  date_trunc('month', NOW()), NULL),
  (6, 'Sao lưu dữ liệu',    'low',    NULL,                       NOW() - INTERVAL '40 days', NOW()),

  -- Project 7 (Dũng): 4 task, 2 quá hạn, 2 tạo tháng này
  (7, 'Dịch tài liệu',  'medium', NOW() - INTERVAL '9 days',  NOW() - INTERVAL '40 days', NULL),
  (7, 'Hiệu đính',      'low',    NOW() - INTERVAL '1 day',   date_trunc('month', NOW()), NULL),
  (7, 'Dàn trang',      'low',    NOW() + INTERVAL '5 days',  date_trunc('month', NOW()), NULL),
  (7, 'Gửi nhà in',     'high',   NOW() + INTERVAL '12 days', NOW() - INTERVAL '40 days', NULL),

  -- Project 8 (Dũng): 3 task, 0 quá hạn, 1 tạo tháng này
  (8, 'Tuyển dụng',  'high',   NOW() + INTERVAL '20 days', NOW() - INTERVAL '40 days', NULL),
  (8, 'Phỏng vấn',   'medium', NOW() - INTERVAL '5 days',  NOW() - INTERVAL '40 days', NOW() - INTERVAL '6 days'),
  (8, 'Onboarding',  'low',    NOW() + INTERVAL '3 days',  date_trunc('month', NOW()), NOW() - INTERVAL '1 day'),

  -- Project 9 (Em): 3 task, 0 quá hạn, 1 tạo tháng này
  (9, 'Lên thực đơn', 'low',    NOW() + INTERVAL '2 days', date_trunc('month', NOW()), NULL),
  (9, 'Đi chợ',       'medium', NOW() - INTERVAL '3 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '4 days'),
  (9, 'Nấu tiệc',     'high',   NOW() + INTERVAL '6 days', NOW() - INTERVAL '40 days', NULL);

-- Label thuộc về từng project
INSERT INTO labels (project_id, name, color) VALUES
  (1, 'bug',     '#e11d48'),
  (1, 'urgent',  '#f97316'),
  (1, 'ui',      '#3b82f6'),
  (3, 'urgent',  '#f97316'),
  (3, 'finance', '#16a34a'),
  (5, 'urgent',  '#f97316'),
  (5, 'docs',    '#a855f7'),
  (7, 'urgent',  '#f97316');

-- Gắn label theo tên, JOIN cùng project_id để không gắn nhầm label của project khác
INSERT INTO task_labels (task_id, label_id)
SELECT t.id, l.id
FROM tasks t
JOIN labels l ON l.project_id = t.project_id
WHERE (t.title, l.name) IN (
  ('Thiết kế trang chủ', 'ui'),
  ('Thiết kế trang chủ', 'urgent'),
  ('Viết API đăng nhập', 'bug'),
  ('Viết API đăng nhập', 'urgent'),
  ('Sửa lỗi footer',     'bug'),
  ('Sửa lỗi footer',     'ui'),
  ('Sửa lỗi footer',     'urgent'),
  ('Đặt hàng NCC',       'urgent'),
  ('Báo cáo doanh thu',  'urgent'),
  ('Báo cáo doanh thu',  'finance'),
  ('Cập nhật giá',       'finance'),
  ('Chuẩn bị demo',      'urgent'),
  ('Viết tài liệu API',  'docs'),
  ('Hiệu đính',          'urgent')
);
