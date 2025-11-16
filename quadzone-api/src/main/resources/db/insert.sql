-- =================================================================
-- CREATE USER DATA (_user)
-- Passwords for all users: "password123" (BCrypt hashed)
-- User roles are based on UserRole.java
-- =================================================================
INSERT INTO _user (id, email, password, first_name, last_name, role, created_at)
VALUES
    (1, 'customer@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Customer', 'CUSTOMER', NOW()),
    (2, 'admin@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Admin', 'ADMIN', NOW()),
    (3, 'staff@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Staff', 'STAFF', NOW()),
    (4, 'shipper@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Shipper', 'SHIPPER', NOW());

-- =================================================================
-- CATEGORIES (category)
-- =================================================================
INSERT INTO category (id, name, is_active, image_url)
VALUES
    (1, 'Electronics', true, 'https://example.com/images/electronics.jpg'),
    (2, 'Apparel', true, 'https://example.com/images/apparel.jpg'),
    (3, 'Home & Kitchen', true, 'https://example.com/images/home.jpg');

-- =================================================================
-- SUB-CATEGORIES (sub_category)
-- =================================================================
INSERT INTO sub_category (id, name, description, is_active, category_id)
VALUES
    (1, 'Laptops', 'Powerful laptops for work and play.', true, 1),
    (2, 'Smartphones', 'The latest mobile technology.', true, 1),
    (3, 'T-Shirts', 'Comfortable and stylish t-shirts.', true, 2),
    (4, 'Kitchen Appliances', 'Make your cooking easier.', true, 3);

-- =================================================================
-- PRODUCTS (product)
-- =================================================================
INSERT INTO product (id, name, brand, model_number, color, description, price, cost_price, weight, stock_quantity, image_url, created_at, is_active, subcategory_id)
VALUES
    (1, 'Product 1', 'QuadZone', 'QZ-LP-16P', 'Space Gray', 'The most powerful QuadZone laptop ever.', 2399.99, 1800.00, 2.0, 30, '@assets/img/212X200/img1.jpg', NOW(), true, 1),
    (2, 'Product 2', 'QuadZone', 'QZ-PH-15P', 'Titanium Black', 'Next-generation smartphone.', 1099.50, 700.00, 0.19, 150, '@assets/img/212X200/img2.jpg', NOW(), true, 2),
    (3, 'Product 3', 'QuadZone Merch', 'QZ-TS-BLK', 'Black', 'Official QuadZone logo t-shirt, 100% cotton.', 29.99, 10.00, 0.3, 500, '@assets/img/212X200/img4.jpg', NOW(), true, 3),
    (4, 'Product 4', 'QuadZone Home', 'QZ-BLND-S1', 'Stainless Steel', 'A smart blender with 5 pre-set programs.', 129.00, 60.00, 3.0, 80, '@assets/img/212X200/img5.jpg', NOW(), true, 4),
    (5, 'Product 5', 'QuadZone', 'QZ-LP-14B', 'Silver', 'A great laptop for everyday tasks.', 999.00, 750.00, 1.5, 75, '@assets/img/212X200/img6.jpg', NOW(), true, 1);

-- =================================================================
-- CART (cart) AND CART ITEMS (cart_item)
-- =================================================================
INSERT INTO cart (id, customer_id, created_at, updated_at)
VALUES (1, 1, NOW(), NOW());

INSERT INTO cart_item (id, quantity, added_at, cart_id, product_id)
VALUES
    (1, 1, NOW(), 1, 1), -- 1x Product 1
    (2, 2, NOW(), 1, 2); -- 2x Product 2

-- =================================================================
-- ORDERS (orders) AND ORDER ITEMS (order_items)
-- OrderStatus is 'COMPLETED'
-- =================================================================
INSERT INTO orders (id, order_date, subtotal, tax_amount, shipping_cost, discount_amount, total_amount, order_status, notes, address, user_id)
VALUES
    (1, DATE_SUB(NOW(), INTERVAL 2 DAY), 129.00, 10.32, 15.00, 0.00, 154.32, 'COMPLETED', 'Please leave at the front door.', '123 Nguyen Hue, HCMC', 1);

INSERT INTO order_items (id, quantity, price_at_purchase, order_id, product_id)
VALUES
    (1, 1, 129.00, 1, 4); -- 1x Product 4

-- =================================================================
-- PAYMENT (payment)
-- PaymentStatus is 'COMPLETED'
-- =================================================================
INSERT INTO payment (id, order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at)
VALUES
    (1, 1, 154.32, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_123456789', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- =================================================================
-- DELIVERY (deliveries)
-- DeliveryStatus is 'DELIVERED'
-- =================================================================
INSERT INTO deliveries (id, tracking_number, carrier, delivery_status, estimated_delivery_date, actual_delivery_date, delivery_notes, signature_required, order_id, staff_id, created_at)
VALUES
    (1, '1Z999ABC1234567890', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'Delivered.', true, 1, 3, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- =================================================================
-- REVIEW (review)
-- FIXED: Changed 'title' to 'review_title'
-- =================================================================
INSERT INTO review (id, rating, review_title, text, created_at, product_id, customer_id, order_item_id)
VALUES
    (1, 5, 'Best Blender!', 'This blender is amazing! Works perfectly.', DATE_SUB(NOW(), INTERVAL 1 DAY), 4, 1, 1);