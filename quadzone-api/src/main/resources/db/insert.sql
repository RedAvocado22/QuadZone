
-- Categories (5)
INSERT INTO category (category_id, name, is_active, image_url) VALUES
  (1, 'Phones & Accessories', 1, '/images/electronics.jpg'),
  (2, 'Computers & Laptops', 1, '/images/laptops.jpg'),
  (3, 'Home Appliances', 1, '/images/home_appliances.jpg'),
  (4, 'Audio Devices', 1, '/images/audio.jpg'),
  (5, 'Gaming Equipment', 1, '/images/gaming.jpg');

-- Subcategories (7)
INSERT INTO sub_category (subcategory_id, subcategory_name, description, is_active, category_id) VALUES
  (1, 'Smartphones', 'Modern smart mobile phones', 1, 1),
  (2, 'Phone Accessories', 'Cases, chargers, headphones', 1, 1),
  (3, 'Laptops', 'Laptops for work and study', 1, 2),
  (4, 'PC & Components', 'Desktops and computer parts', 1, 2),
  (5, 'Small Home Appliances', 'Blenders, rice cookers, mini fridges', 1, 3),
  (6, 'Headphones & Speakers', 'Personal audio devices', 1, 4),
  (7, 'Consoles & Accessories', 'Gaming consoles and controllers', 1, 5);

-- Products (15)
INSERT INTO product (product_id, product_name, brand, model_number, description, quantity, price, cost_price, weight, image_url, is_active, created_at, subcategory_id) VALUES
  (1, 'Galaxy S25 VN', 'Samsung', 'S25-VN', 'Vietnam edition, large battery', 120, 999.99, 650.00, 0.18, 'galaxy_s25.jpg', 1, NOW(), 1),
  (2, 'iPhone 15', 'Apple', 'IPH15', 'OLED display, excellent camera', 80, 1199.99, 800.00, 0.17, 'iphone15.jpg', 1, NOW(), 1),
  (3, 'Xiaomi Redmi Note 14', 'Xiaomi', 'RN14', 'Affordable with long battery life', 200, 199.99, 120.00, 0.19, 'redmi_note14.jpg', 1, NOW(), 1),
  (4, '65W Fast Charger', 'Baseus', 'BS-65W', 'Fast charger for phones and laptops', 300, 29.99, 12.00, 0.05, 'charger_65w.jpg', 1, NOW(), 2),
  (5, 'Clear Protective Case', 'Memumi', 'CASE-TP', 'Shock-resistant TPU clear case', 500, 5.99, 1.50, 0.02, 'case_clear.jpg', 1, NOW(), 2),
  (6, 'ThinkPad X14', 'Lenovo', 'TP-X14', 'Lightweight business laptop', 40, 899.99, 600.00, 1.25, 'thinkpad_x14.jpg', 1, NOW(), 3),
  (7, 'MacBook Air 15', 'Apple', 'MBA-15', 'M-series chip, ultra thin', 25, 1299.99, 900.00, 1.2, 'macbook_air15.jpg', 1, NOW(), 3),
  (8, 'GTX Graphics Card', 'NVIDIA', 'GTX-1660', 'Mid-range gaming GPU', 15, 249.99, 160.00, 0.7, 'gpu_gtx.jpg', 1, NOW(), 4),
  (9, '1.8L Rice Cooker', 'Electrolux', 'RC-18', 'Family-size rice cooker', 60, 49.99, 30.00, 2.5, 'rice_cooker.jpg', 1, NOW(), 5),
  (10, 'Blender', 'Philips', 'BL-400', 'Multi-purpose blender', 90, 39.99, 20.00, 3.0, 'blender.jpg', 1, NOW(), 5),
  (11, 'Bluetooth ANC Headphones', 'Sony', 'WH-1000XM5', 'Active noise cancellation', 70, 299.99, 180.00, 0.25, 'sony_wh1000xm5.jpg', 1, NOW(), 6),
  (12, 'Portable Bluetooth Speaker', 'JBL', 'CHARGE-5', 'Long battery life & powerful sound', 85, 149.99, 90.00, 1.1, 'jbl_charge5.jpg', 1, NOW(), 6),
  (13, 'PlayStation 5', 'Sony', 'PS5-DIG', 'Next-gen gaming console', 30, 499.99, 350.00, 4.5, 'ps5.jpg', 1, NOW(), 7),
  (14, 'Pro Controller', 'Sony', 'DS5-PRO', 'Premium wireless controller', 120, 69.99, 40.00, 0.4, 'dualshock5_pro.jpg', 1, NOW(), 7),
  (15, 'SSD 1TB NVMe', 'Samsung', 'EVO-1TB', 'High-speed NVMe solid state drive', 150, 119.99, 70.00, 0.05, 'ssd_1tb.jpg', 1, NOW(), 4);

-- Users (5)
INSERT INTO _user (id, email, password, first_name, last_name, role, created_at) VALUES
  (1, 'admin@quadzone.vn', 'adminpass', 'Admin', 'QuadZone', 'ADMIN', NOW()),
  (2, 'nguyen.van.a@example.com', 'custpass1', 'Nguyen', 'A', 'CUSTOMER', NOW()),
  (3, 'tran.thi.b@example.com', 'custpass2', 'Tran', 'B', 'CUSTOMER', NOW()),
  (4, 'le.van.c@example.com', 'custpass3', 'Le', 'C', 'CUSTOMER', NOW()),
  (5, 'pham.staff@example.com', 'staffpass', 'Pham', 'Staff', 'STAFF', NOW()),
  (6, 'dinh.shipper@example.com','shipperypass','Dinh', 'Shipper', 'SHIPPER', NOW());

-- Carts
INSERT INTO cart (id, created_at, customer_id, updated_at) VALUES
  (1, NOW(), 2, NULL),
  (2, NOW(), 3, NULL),
  (3, NOW(), 4, NULL),
  (4, NOW(), 5, NULL);

-- Cart items
INSERT INTO cart_item (id, quantity, added_at, cart_id, product_id) VALUES
  (1, 1, NOW(), 1, 1),
  (2, 2, NOW(), 1, 5),
  (3, 1, NOW(), 2, 6),
  (4, 1, NOW(), 3, 11),
  (5, 3, NOW(), 4, 14);

-- Orders
INSERT INTO orders (id, order_date, subtotal, tax_amount, shipping_cost, discount_amount, total_amount, user_id, address, notes, order_status) VALUES
  (1, NOW(), 999.99, 0.00, 10.00, 0.00, 1009.99, 2, 'Hanoi, Hoan Kiem', 'Deliver during business hours', 'PENDING'),
  (2, NOW(), 1199.99, 0.00, 15.00, 50.00, 1364.99, 3, 'Hanoi, Ba Dinh', 'Gift wrap please', 'PENDING'),
  (3, NOW(), 49.99, 0.00, 5.00, 0.00, 54.99, 4, 'Hanoi, Tay Ho', '', 'PENDING'),
  (4, NOW(), 299.99, 0.00, 10.00, 0.00, 309.99, 2, 'Hanoi, Cau Giay', 'Deliver outside regular hours', 'PENDING'),
  (5, NOW(), 499.99, 0.00, 20.00, 0.00, 519.99, 5, 'Hanoi, Hoa Lac', 'Please deliver quickly if possible', 'PENDING');

-- Order items
INSERT INTO order_item (id, quantity, unit_price, sub_total, order_id, product_id) VALUES
  (1, 1, 999.99, 999.99, 1, 1),
  (2, 1, 1199.99, 1199.99, 2, 2),
  (3, 1, 49.99, 49.99, 3, 9),
  (4, 1, 299.99, 299.99, 4, 11),
  (5, 1, 499.99, 499.99, 5, 13);

-- Payments
INSERT INTO payment (id, order_id, transaction_id, amount, payment_method, payment_status, payment_date, created_at) VALUES
  (1, 1, 'TXN-VN-0001', 1009.99, 'CREDIT_CARD', 'COMPLETED', NOW(), NOW()),
  (2, 2, 'TXN-VN-0002', 1364.99, 'BANK_TRANSFER', 'COMPLETED', NOW(), NOW()),
  (3, 3, 'TXN-VN-0003', 54.99, 'CASH_ON_DELIVERY', 'PENDING', NULL, NOW()),
  (4, 4, 'TXN-VN-0004', 309.99, 'CREDIT_CARD', 'COMPLETED', NOW(), NOW()),
  (5, 5, 'TXN-VN-0005', 519.99, 'CREDIT_CARD', 'COMPLETED', NOW(), NOW());

-- Deliveries
INSERT INTO deliveries (id, order_id, staff_id, carrier, delivery_status, tracking_number, delivery_notes, estimated_delivery_date, actual_delivery_date, signature_required, created_at, updated_at) VALUES
  (1, 1, 5, 'GiaoHangNhanh', 'SHIPPED', 'GHN-VN-1001', 'Call before delivery', CURDATE() + INTERVAL 2 DAY, NULL, 1, NOW(), NULL),
  (2, 2, 5, 'VNPost', 'SHIPPED', 'VNP-VN-2002', 'Allow inspection before receiving', CURDATE() + INTERVAL 3 DAY, NULL, 1, NOW(), NULL),
  (3, 3, 5, 'GHN', 'PENDING', 'GHN-VN-3003', NULL, CURDATE() + INTERVAL 5 DAY, NULL, 1, NOW(), NULL),
  (4, 4, 5, 'GHTK', 'SHIPPED', 'GHTK-VN-4004', 'Deliver during business hours', CURDATE() + INTERVAL 1 DAY, NULL, 1, NOW(), NULL),
  (5, 5, 5, 'GiaoHangNhanh', 'SHIPPED', 'GHN-VN-5005', 'Confirm before delivery', CURDATE() + INTERVAL 4 DAY, NULL, 1, NOW(), NULL);

-- Reviews
INSERT INTO review (id, rating, created_at, customer_id, order_id, product_id, review_title, review_text, updated_at) VALUES
  (1, 5, NOW(), 2, 1, 1, 'Very satisfied', 'Smooth performance, great battery. Fast delivery.', NULL),
  (2, 4, NOW(), 3, 2, 2, 'Great product', 'Good performance, gets slightly warm under heavy use.', NULL),
  (3, 5, NOW(), 4, 3, 9, 'Good rice cooker', 'Cooks well and easy to use.', NULL),
  (4, 4, NOW(), 2, 4, 11, 'Great sound', 'Excellent noise cancellation and comfortable.', NULL),
  (5, 5, NOW(), 5, 5, 13, 'PS5 is awesome', 'Brand new and runs very well.', NULL);
