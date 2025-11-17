INSERT INTO _user (id, email, password, first_name, last_name, role, created_at, status)
VALUES
    (1, 'customer@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'John', 'Doe', 'CUSTOMER', NOW(), 'ACTIVE'),
    (2, 'admin@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Admin', 'ADMIN', NOW(), 'ACTIVE'),
    (3, 'staff@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Staff', 'STAFF', NOW(),'ACTIVE'),
    (4, 'shipper@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Test', 'Shipper', 'SHIPPER', NOW(), 'ACTIVE'),
    (5, 'an.nguyen@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Anna', 'Smith', 'CUSTOMER', NOW(), 'ACTIVE'),
    (6, 'binh.le@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Ben', 'Lee', 'CUSTOMER', NOW(), 'ACTIVE'),
    (7, 'chi.pham@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Chloe', 'Pham', 'CUSTOMER', NOW(), 'ACTIVE'),
    (8, 'dung.tran@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'David', 'Tran', 'CUSTOMER', NOW(), 'ACTIVE');

INSERT INTO category (id, name, is_active, image_url)
VALUES
    (1, 'Electronics', true, 'https://example.com/images/electronics.jpg');

INSERT INTO sub_category (id, name, description, is_active, category_id)
VALUES
    (1, 'Laptops', 'Powerful laptops for work and play.', true, 1),
    (2, 'Smartphones', 'The latest mobile technology.', true, 1),
    (3, 'Audio', 'Speakers, headphones, and more.', true, 1),
    (4, 'Cameras', 'Digital cameras and camcorders.', true, 1),
    (5, 'Peripherals', 'Printers, monitors, and accessories.', true, 1),
    (6, 'Gaming', 'Consoles and gaming accessories.', true, 1),
    (7, 'Tablets', 'Portable tablets for work and play.', true, 1);

INSERT INTO product (id, name, brand, model_number, color, description, price, cost_price, weight, stock_quantity, image_url, created_at, is_active, subcategory_id)
VALUES
    (1, 'Wireless Egg Speaker', 'QuadZone', 'QZ-SPK-EGG', 'White', '360-degree sound in a stunning design.', 249.99, 150.00, 1.5, 50, '/src/assets/img/212X200/img1.jpg', DATE_SUB(NOW(), INTERVAL 10 DAY), true, 3),
    (2, 'Convertible Laptop 14"', 'QuadZone', 'QZ-LP-CV14', 'Silver', 'A versatile 2-in-1 laptop for productivity.', 1099.50, 700.00, 1.8, 150, '/src/assets/img/212X200/img2.jpg', DATE_SUB(NOW(), INTERVAL 12 DAY), true, 1),
    (3, 'Rose Gold Headphones', 'QuadZone Beats', 'QZ-HP-RG', 'Rose Gold', 'Wireless over-ear headphones with noise cancelling.', 129.99, 50.00, 0.4, 500, '/src/assets/img/212X200/img3.jpg', DATE_SUB(NOW(), INTERVAL 30 DAY), true, 3),
    (4, 'Smartphone 6S', 'QuadZone', 'QZ-PH-6S', 'Gold', '["6.1-inch Full HD+ Display","128GB Internal Storage","8GB RAM for smooth multitasking","48MP AI Triple Camera System","5000mAh Battery with Fast Charging","Dual SIM + 5G Connectivity","Face Unlock & In-Display Fingerprint Sensor"]', 699.00, 400.00, 0.14, 80, '/src/assets/img/212X200/img4.jpg', DATE_SUB(NOW(), INTERVAL 5 DAY), true, 2),
    (5, 'Digital Camera Mint', 'Samsung', 'QZ-CAM-M', 'Mint Blue', 'A sleek point-and-shoot camera with 20MP.', 299.00, 200.00, 0.3, 75, '/src/assets/img/212X200/img5.jpg', DATE_SUB(NOW(), INTERVAL 8 DAY), true, 4),
    (6, 'Color Laser Printer', 'HP', 'QZ-PRN-CL', 'White', 'High-quality color printing for your home office.', 179.99, 100.00, 5.5, 200, '/src/assets/img/212X200/img6.jpg', DATE_SUB(NOW(), INTERVAL 25 DAY), true, 5),
    (7, 'Gaming Console White', 'Sony', 'QZ-PS4-WHT', 'White Marble', 'Special edition gaming console.', 399.99, 280.00, 2.8, 300, '/src/assets/img/212X200/img7.jpg', DATE_SUB(NOW(), INTERVAL 30 DAY), true, 6),
    (8, 'HD Camcorder', 'Generic', 'QZ-VID-HDW', 'White', 'Capture all your moments in high definition.', 149.99, 80.00, 0.6, 120, '/src/assets/img/212X200/img8.jpg', DATE_SUB(NOW(), INTERVAL 15 DAY), true, 4),
    (9, 'Tablet Mini', 'Apple', 'QZ-TAB-MGL', 'Gold', 'A powerful tablet in a compact 7.9-inch size.', 429.00, 300.00, 0.3, 50, '/src/assets/img/212X200/img9.jpg', DATE_SUB(NOW(), INTERVAL 7 DAY), true, 7),
    (10, 'Tablet Pro 10-inch', 'Samsung', 'QZ-TAB-P10', 'White', 'A large display tablet perfect for media.', 349.50, 220.00, 0.5, 250, '/src/assets/img/212X200/img10.jpg', DATE_SUB(NOW(), INTERVAL 20 DAY), true, 7);


INSERT INTO cart (id, customer_id, created_at, updated_at)
VALUES
    (1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
    (2, 6, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW());

INSERT INTO cart_item (id, quantity, added_at, cart_id, product_id)
VALUES
    (1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 1),
    (2, 2, DATE_SUB(NOW(), INTERVAL 3 HOUR), 1, 7),
    (3, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 2, 9);

INSERT INTO orders (id, order_date, subtotal, tax_amount, shipping_cost, discount_amount, total_amount, order_status, notes, address, user_id)
VALUES
    (1, DATE_SUB(NOW(), INTERVAL 10 DAY), 699.00, 55.92, 15.00, 0.00, 769.92, 'COMPLETED', 'Please leave at the front door.', '123 Main St, HCMC', 1),
    (2, DATE_SUB(NOW(), INTERVAL 8 DAY), 479.98, 38.40, 15.00, 0.00, 533.38, 'COMPLETED', 'Fast delivery.', '456 Oak Ave, Hanoi', 5),
    (3, DATE_SUB(NOW(), INTERVAL 7 DAY), 1099.50, 87.96, 15.00, 100.00, 1102.46, 'PROCESSING', 'Used 100 voucher.', '789 Pine Blvd, Da Nang', 6),
    (4, DATE_SUB(NOW(), INTERVAL 6 DAY), 179.99, 14.40, 15.00, 0.00, 209.39, 'PENDING', 'Awaiting confirmation.', '101 Maple Rd, Hanoi', 7),
    (5, DATE_SUB(NOW(), INTERVAL 5 DAY), 428.99, 34.32, 15.00, 0.00, 478.31, 'COMPLETED', 'Loyal customer.', '123 Main St, HCMC', 1),
    (6, DATE_SUB(NOW(), INTERVAL 4 DAY), 429.00, 34.32, 15.00, 0.00, 478.32, 'CANCELLED', 'Customer cancelled.', '202 Birch Ln, HCMC', 8),
    (7, DATE_SUB(NOW(), INTERVAL 3 DAY), 349.50, 27.96, 15.00, 0.00, 392.46, 'COMPLETED', '', '456 Oak Ave, Hanoi', 5),
    (8, DATE_SUB(NOW(), INTERVAL 2 DAY), 279.98, 22.40, 15.00, 5.00, 312.38, 'PENDING', '', '789 Pine Blvd, Da Nang', 6),
    (9, DATE_SUB(NOW(), INTERVAL 1 DAY), 179.99, 14.40, 15.00, 0.00, 209.39, 'PROCESSING', 'Urgent delivery.', '123 Main St, HCMC', 1),
    (10, DATE_SUB(NOW(), INTERVAL 1 DAY), 249.99, 20.00, 0.00, 20.00, 249.99, 'COMPLETED', 'Free shipping, 20 discount.', '101 Maple Rd, Hanoi', 7),
    (11, DATE_SUB(NOW(), INTERVAL 12 HOUR), 399.99, 32.00, 15.00, 0.00, 446.99, 'PENDING', '', '456 Oak Ave, Hanoi', 5),
    (12, DATE_SUB(NOW(), INTERVAL 6 HOUR), 309.98, 24.80, 15.00, 0.00, 349.78, 'COMPLETED', 'Deliver during business hours.', '789 Pine Blvd, Da Nang', 6);

INSERT INTO order_items (id, quantity, price_at_purchase, order_id, product_id)
VALUES
    (1, 1, 699.00, 1, 4),
    (2, 1, 129.99, 2, 3),
    (3, 1, 399.99, 2, 7),
    (4, 1, 1099.50, 3, 2),
    (5, 1, 179.99, 4, 6),
    (6, 1, 129.99, 5, 3),
    (7, 1, 299.00, 5, 5),
    (8, 1, 429.00, 6, 9),
    (9, 1, 349.50, 7, 10),
    (10, 1, 149.99, 8, 8),
    (11, 1, 129.99, 8, 3),
    (12, 1, 179.99, 9, 6),
    (13, 1, 249.99, 10, 1),
    (14, 1, 399.99, 11, 7),
    (15, 1, 129.99, 12, 3),
    (16, 1, 179.99, 12, 6);

INSERT INTO payment (id, order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at)
VALUES
    (1, 1, 769.92, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_123456789', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (2, 2, 533.38, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_234567890', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (3, 3, 1102.46, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_345678901', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (4, 5, 478.31, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_456789012', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (5, 7, 392.46, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_567890123', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (6, 9, 209.39, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_678901234', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (7, 10, 249.99, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_789012345', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (8, 12, 349.78, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_890123456', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR));

INSERT INTO deliveries (id, tracking_number, carrier, delivery_status, estimated_delivery_date, actual_delivery_date, delivery_notes, signature_required, order_id, staff_id, created_at)
VALUES
    (1, '1Z999ABC1234567890', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), 'Delivered.', true, 1, 3, DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (2, '1Z999ABC1234567891', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 'Delivered.', false, 2, 3, DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (3, '1Z999ABC1234567892', 'Vietel Post', 'SHIPPED', DATE_SUB(NOW(), INTERVAL 5 DAY), null, 'On the way.', true, 3, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (4, '1Z999ABC1234567893', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 'Delivered.', true, 5, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (5, '1Z999ABC1234567894', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Delivery successful.', false, 7, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (6, '1Z999ABC1234567895', 'QuadZone Express', 'OUT_FOR_DELiVERY', DATE_SUB(NOW(), INTERVAL 0 DAY), null, 'Out for delivery.', true, 9, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (7, '1Z999ABC1234567896', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 0 DAY), DATE_SUB(NOW(), INTERVAL 0 DAY), 'Delivered.', true, 10, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (8, '1Z999ABC1234567897', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 0 DAY), DATE_SUB(NOW(), INTERVAL 0 DAY), 'Delivered.', false, 12, 3, DATE_SUB(NOW(), INTERVAL 6 HOUR));

INSERT INTO review (id, rating, review_title, text, created_at, product_id, customer_id, order_item_id)
VALUES
    (1, 5, 'Best Phone!', 'This phone is amazing! Works perfectly.', DATE_SUB(NOW(), INTERVAL 9 DAY), 4, 1, 1),
    (2, 4, 'Good Headphones', 'Nice sound, good quality. Will buy again.', DATE_SUB(NOW(), INTERVAL 7 DAY), 3, 5, 2),
    (3, 5, 'Great Camera for Travel', 'Light, reliable, and takes great photos.', DATE_SUB(NOW(), INTERVAL 4 DAY), 5, 1, 7),
    (4, 3, 'Okay tablet for the price', 'The screen is decent, but the battery life is a bit short.', DATE_SUB(NOW(), INTERVAL 2 DAY), 10, 5, 9),
    (5, 5, 'Amazing Sound!', 'This speaker has incredible sound for its size. Worth every penny.', DATE_SUB(NOW(), INTERVAL 0 DAY), 1, 7, 13),
    (6, 4, 'Sleek Printer', 'Love the design and it prints fast. Setup was easy.', DATE_SUB(NOW(), INTERVAL 0 DAY), 6, 6, 16);