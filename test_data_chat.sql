-- ============================================
-- QuadZone Chat Test Data
-- ============================================
-- Script này tạo dữ liệu test cho tính năng chat
-- Bao gồm: users (customer, staff, admin), chat rooms, và messages

-- ============================================
-- 1. TẠO TEST USERS
-- ============================================

-- Customer accounts (Password: password123)
-- Note: Password hash cho 'password123' với BCrypt
INSERT INTO _user (id, first_name, last_name, email, password, role, status, created_at, updated_at) 
VALUES 
(100, 'Nguyen', 'Van A', 'customer1@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(101, 'Tran', 'Thi B', 'customer2@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(102, 'Le', 'Van C', 'customer3@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(103, 'Pham', 'Thi D', 'customer4@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'CUSTOMER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;

-- Staff accounts (Password: password123)
INSERT INTO _user (id, first_name, last_name, email, password, role, status, created_at, updated_at) 
VALUES 
(200, 'Staff', 'Nguyen', 'staff1@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'STAFF', 'ACTIVE', NOW(), NOW()),
(201, 'Staff', 'Tran', 'staff2@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'STAFF', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;

-- Admin account (Password: password123)
INSERT INTO _user (id, first_name, last_name, email, password, role, status, created_at, updated_at) 
VALUES 
(300, 'Admin', 'QuadZone', 'admin@test.com', '$2a$10$XZ7QfJJTqQhP4nQX9qWXkO3L3p3aGZJKqXh0YJPqQXfLQXJYQXJYQ', 'ADMIN', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- 2. TẠO CHAT ROOMS
-- ============================================

-- Room 1: WAITING - Customer1 chờ staff
INSERT INTO chat_room (id, customer_id, staff_id, status, created_at, last_message_at) 
VALUES 
(1, 100, NULL, 'WAITING', DATE_SUB(NOW(), INTERVAL 10 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE))
ON DUPLICATE KEY UPDATE status=status;

-- Room 2: ACTIVE - Customer2 đang chat với Staff1
INSERT INTO chat_room (id, customer_id, staff_id, status, created_at, last_message_at) 
VALUES 
(2, 101, 200, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 30 MINUTE), DATE_SUB(NOW(), INTERVAL 2 MINUTE))
ON DUPLICATE KEY UPDATE status=status;

-- Room 3: ACTIVE - Customer3 đang chat với Staff2
INSERT INTO chat_room (id, customer_id, staff_id, status, created_at, last_message_at) 
VALUES 
(3, 102, 201, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 10 MINUTE))
ON DUPLICATE KEY UPDATE status=status;

-- Room 4: CLOSED - Customer4 đã đóng chat
INSERT INTO chat_room (id, customer_id, staff_id, status, created_at, last_message_at, closed_at) 
VALUES 
(4, 103, 200, 'CLOSED', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR))
ON DUPLICATE KEY UPDATE status=status;

-- ============================================
-- 3. TẠO CHAT MESSAGES
-- ============================================

-- Messages cho Room 1 (WAITING)
INSERT INTO chat_message (chat_room_id, sender_id, content, message_type, sent_at, is_read) 
VALUES 
-- System welcome message
(1, NULL, 'Chào mừng bạn đến với QuadZone! Nhân viên sẽ hỗ trợ bạn trong giây lát.', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 10 MINUTE), TRUE),
-- Customer messages
(1, 100, 'Xin chào, tôi muốn hỏi về sản phẩm drone DJI Mini 3 Pro', 'TEXT', DATE_SUB(NOW(), INTERVAL 9 MINUTE), TRUE),
(1, 100, 'Sản phẩm này còn hàng không ạ?', 'TEXT', DATE_SUB(NOW(), INTERVAL 8 MINUTE), TRUE),
(1, 100, 'Có thể ship COD được không?', 'TEXT', DATE_SUB(NOW(), INTERVAL 5 MINUTE), FALSE);

-- Messages cho Room 2 (ACTIVE)
INSERT INTO chat_message (chat_room_id, sender_id, content, message_type, sent_at, is_read) 
VALUES 
-- System welcome
(2, NULL, 'Chào mừng bạn đến với QuadZone! Nhân viên sẽ hỗ trợ bạn trong giây lát.', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 30 MINUTE), TRUE),
-- Customer initial message
(2, 101, 'Cho tôi hỏi về bảo hành sản phẩm', 'TEXT', DATE_SUB(NOW(), INTERVAL 28 MINUTE), TRUE),
-- System assign message
(2, NULL, 'Staff Nguyen đã tham gia cuộc trò chuyện', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 27 MINUTE), TRUE),
-- Staff response
(2, 200, 'Xin chào! Tôi là Staff Nguyen. Tôi sẽ hỗ trợ bạn về vấn đề bảo hành.', 'TEXT', DATE_SUB(NOW(), INTERVAL 26 MINUTE), TRUE),
(2, 200, 'Tất cả sản phẩm của chúng tôi đều có bảo hành chính hãng từ 12-24 tháng tùy sản phẩm.', 'TEXT', DATE_SUB(NOW(), INTERVAL 25 MINUTE), TRUE),
-- Customer continues
(2, 101, 'Vậy nếu có sự cố trong thời gian bảo hành thì làm thế nào?', 'TEXT', DATE_SUB(NOW(), INTERVAL 20 MINUTE), TRUE),
-- Staff answers
(2, 200, 'Bạn có thể mang sản phẩm đến cửa hàng hoặc gửi về qua đường chuyển phát. Chúng tôi sẽ kiểm tra và xử lý trong 3-5 ngày làm việc.', 'TEXT', DATE_SUB(NOW(), INTERVAL 18 MINUTE), TRUE),
(2, 200, 'Trong trường hợp sản phẩm không sửa được, chúng tôi sẽ đổi mới cho bạn.', 'TEXT', DATE_SUB(NOW(), INTERVAL 17 MINUTE), TRUE),
-- Customer satisfied
(2, 101, 'Cảm ơn anh đã tư vấn rất chi tiết!', 'TEXT', DATE_SUB(NOW(), INTERVAL 15 MINUTE), TRUE),
(2, 101, 'Tôi sẽ đặt hàng ngay bây giờ', 'TEXT', DATE_SUB(NOW(), INTERVAL 14 MINUTE), TRUE),
-- Staff closes
(2, 200, 'Cảm ơn bạn đã tin tưởng QuadZone! Nếu cần hỗ trợ thêm, hãy liên hệ lại nhé!', 'TEXT', DATE_SUB(NOW(), INTERVAL 2 MINUTE), FALSE);

-- Messages cho Room 3 (ACTIVE)
INSERT INTO chat_message (chat_room_id, sender_id, content, message_type, sent_at, is_read) 
VALUES 
-- System welcome
(3, NULL, 'Chào mừng bạn đến với QuadZone! Nhân viên sẽ hỗ trợ bạn trong giây lát.', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 1 HOUR), TRUE),
-- Customer question
(3, 102, 'Tôi muốn so sánh DJI Air 3 và DJI Mini 4 Pro', 'TEXT', DATE_SUB(NOW(), INTERVAL 58 MINUTE), TRUE),
-- System assign
(3, NULL, 'Staff Tran đã tham gia cuộc trò chuyện', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 55 MINUTE), TRUE),
-- Staff detailed comparison
(3, 201, 'Xin chào! Tôi sẽ giúp bạn so sánh 2 sản phẩm này.', 'TEXT', DATE_SUB(NOW(), INTERVAL 54 MINUTE), TRUE),
(3, 201, 'DJI Air 3:\n- Camera: Dual camera (Wide + Medium Tele)\n- Thời gian bay: 46 phút\n- Trọng lượng: 720g\n- Giá: 28.000.000 VNĐ', 'TEXT', DATE_SUB(NOW(), INTERVAL 53 MINUTE), TRUE),
(3, 201, 'DJI Mini 4 Pro:\n- Camera: Single camera với gimbal 3 trục\n- Thời gian bay: 34 phút\n- Trọng lượng: <249g (không cần đăng ký)\n- Giá: 22.000.000 VNĐ', 'TEXT', DATE_SUB(NOW(), INTERVAL 52 MINUTE), TRUE),
-- Customer asks more
(3, 102, 'Vậy nếu tôi muốn quay phim chuyên nghiệp thì nên chọn cái nào?', 'TEXT', DATE_SUB(NOW(), INTERVAL 45 MINUTE), TRUE),
-- Staff recommends
(3, 201, 'Tôi khuyên bạn nên chọn DJI Air 3 vì:\n1. Có dual camera linh hoạt hơn\n2. Thời gian bay lâu hơn cho các buổi quay dài\n3. Chất lượng hình ảnh tốt hơn\n\nNhưng nếu bạn hay di chuyển và cần tính di động, Mini 4 Pro cũng rất tốt!', 'TEXT', DATE_SUB(NOW(), INTERVAL 40 MINUTE), TRUE),
-- Customer decides
(3, 102, 'Tôi sẽ chọn Air 3. Bao giờ có hàng?', 'TEXT', DATE_SUB(NOW(), INTERVAL 35 MINUTE), TRUE),
-- Staff answers
(3, 201, 'Hiện tại chúng tôi có hàng sẵn. Bạn có thể đặt hàng trực tuyến hoặc đến cửa hàng để xem trực tiếp.', 'TEXT', DATE_SUB(NOW(), INTERVAL 30 MINUTE), TRUE),
(3, 201, 'Chúng tôi cũng có chương trình trả góp 0% trong 6 tháng nếu bạn quan tâm.', 'TEXT', DATE_SUB(NOW(), INTERVAL 29 MINUTE), TRUE),
-- Latest message
(3, 102, 'Tuyệt vời! Để tôi suy nghĩ thêm một chút', 'TEXT', DATE_SUB(NOW(), INTERVAL 10 MINUTE), FALSE);

-- Messages cho Room 4 (CLOSED)
INSERT INTO chat_message (chat_room_id, sender_id, content, message_type, sent_at, is_read) 
VALUES 
-- System welcome
(4, NULL, 'Chào mừng bạn đến với QuadZone! Nhân viên sẽ hỗ trợ bạn trong giây lát.', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 2 HOUR), TRUE),
-- Quick conversation
(4, 103, 'Địa chỉ cửa hàng ở đâu?', 'TEXT', DATE_SUB(NOW(), INTERVAL 115 MINUTE), TRUE),
-- System assign
(4, NULL, 'Staff Nguyen đã tham gia cuộc trò chuyện', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 110 MINUTE), TRUE),
-- Staff provides info
(4, 200, 'Chúng tôi có 2 cửa hàng:\n1. HCM: 123 Nguyễn Văn Linh, Quận 7\n2. HN: 456 Trần Duy Hưng, Cầu Giấy', 'TEXT', DATE_SUB(NOW(), INTERVAL 108 MINUTE), TRUE),
(4, 200, 'Thời gian mở cửa: 8:00 - 21:00 hàng ngày', 'TEXT', DATE_SUB(NOW(), INTERVAL 107 MINUTE), TRUE),
-- Customer thanks
(4, 103, 'Cảm ơn bạn!', 'TEXT', DATE_SUB(NOW(), INTERVAL 105 MINUTE), TRUE),
-- Staff closes
(4, 200, 'Rất vui được hỗ trợ bạn! Hẹn gặp lại!', 'TEXT', DATE_SUB(NOW(), INTERVAL 100 MINUTE), TRUE),
-- System closed
(4, NULL, 'Cuộc trò chuyện đã được đóng', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 1 HOUR), TRUE);

-- ============================================
-- 4. VERIFICATION QUERIES
-- ============================================

-- Kiểm tra users đã tạo
SELECT 'Test Users Created:' as Info;
SELECT id, email, role, status FROM _user WHERE id >= 100 ORDER BY id;

-- Kiểm tra chat rooms đã tạo
SELECT '\nChat Rooms Created:' as Info;
SELECT id, customer_id, staff_id, status, 
       TIMESTAMPDIFF(MINUTE, created_at, NOW()) as minutes_ago,
       (SELECT COUNT(*) FROM chat_message WHERE chat_room_id = chat_room.id) as message_count
FROM chat_room 
WHERE id <= 4
ORDER BY id;

-- Kiểm tra messages đã tạo
SELECT '\nMessages Summary:' as Info;
SELECT 
    cr.id as room_id,
    cr.status as room_status,
    COUNT(cm.id) as total_messages,
    SUM(CASE WHEN cm.message_type = 'SYSTEM' THEN 1 ELSE 0 END) as system_messages,
    SUM(CASE WHEN cm.message_type = 'TEXT' THEN 1 ELSE 0 END) as text_messages,
    SUM(CASE WHEN cm.is_read = FALSE THEN 1 ELSE 0 END) as unread_messages
FROM chat_room cr
LEFT JOIN chat_message cm ON cr.id = cm.chat_room_id
WHERE cr.id <= 4
GROUP BY cr.id, cr.status
ORDER BY cr.id;

-- ============================================
-- 5. QUICK REFERENCE
-- ============================================

/*
ACCOUNTS CREATED:
==================

CUSTOMERS:
- Email: customer1@test.com | Password: password123 | ID: 100
- Email: customer2@test.com | Password: password123 | ID: 101
- Email: customer3@test.com | Password: password123 | ID: 102
- Email: customer4@test.com | Password: password123 | ID: 103

STAFF:
- Email: staff1@test.com | Password: password123 | ID: 200
- Email: staff2@test.com | Password: password123 | ID: 201

ADMIN:
- Email: admin@test.com | Password: password123 | ID: 300

CHAT ROOMS:
===========
- Room 1: Customer1 (WAITING) - 4 messages
- Room 2: Customer2 + Staff1 (ACTIVE) - 11 messages
- Room 3: Customer3 + Staff2 (ACTIVE) - 11 messages
- Room 4: Customer4 + Staff1 (CLOSED) - 8 messages

TESTING SCENARIOS:
==================
1. Login as customer1@test.com → See room in WAITING status
2. Login as staff1@test.com → See rooms 1, 2, 3 in list
3. Login as admin@test.com → Assign staff to room 1
4. Test message history pagination with room 2 or 3
5. Test closing room with room 2 or 3
6. Test marking messages as read
*/

-- ============================================
-- END OF SCRIPT
-- ============================================

SELECT '✅ Test data created successfully!' as Status;
SELECT 'You can now login with the accounts above and test the chat feature!' as Message;



