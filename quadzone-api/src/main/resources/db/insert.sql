SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO _user (id, email, password, first_name, last_name, role, created_at, status)
VALUES
    (1, 'customer@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'John', 'Doe', 'CUSTOMER', NOW(), 'ACTIVE'),
    (2, 'admin@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Test', 'Admin', 'ADMIN', NOW(), 'ACTIVE'),
    (3, 'staff@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Test', 'Staff', 'STAFF', NOW(),'ACTIVE'),
    (4, 'shipper@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Test', 'Shipper', 'SHIPPER', NOW(), 'ACTIVE'),
    (5, 'an.nguyen@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Anna', 'Smith', 'CUSTOMER', NOW(), 'ACTIVE'),
    (6, 'binh.le@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Ben', 'Lee', 'CUSTOMER', NOW(), 'ACTIVE'),
    (7, 'chi.pham@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Chloe', 'Pham', 'CUSTOMER', NOW(), 'ACTIVE'),
    (8, 'dung.tran@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'David', 'Tran', 'CUSTOMER', NOW(), 'ACTIVE'),
    (9, 'mia.ngo@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Mia', 'Ngo', 'CUSTOMER', NOW(), 'ACTIVE'),
    (10, 'khang.vo@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Khang', 'Vo', 'CUSTOMER', NOW(), 'ACTIVE'),
    (11, 'support1@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Support', 'One', 'STAFF', NOW(), 'ACTIVE'),
    (12, 'shipper2@example.com', '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i', 'Jane', 'Tran', 'SHIPPER', NOW(), 'ACTIVE');
-- password:Abc@1234
INSERT INTO category (id, name, is_active, image_url)
VALUES
    (1, 'Electronics', true, 'https://example.com/images/electronics.jpg'),
    (2, 'Software & Services', true, 'https://example.com/images/software.jpg'),
    (3, 'Home & Smart Devices', true, 'https://example.com/images/smarthome.jpg'),
    (4, 'Components & DIY', true, 'https://example.com/images/components.jpg'),
    (5, 'Wearables', true, 'https://example.com/images/wearables.jpg');

INSERT INTO sub_category (id, name, description, is_active, category_id)
VALUES
    (1, 'Laptops', 'Powerful laptops for work and play.', true, 1),
    (2, 'Smartphones', 'The latest mobile technology.', true, 1),
    (3, 'Audio', 'Speakers, headphones, and more.', true, 1),
    (4, 'Cameras', 'Digital cameras and camcorders.', true, 1),
    (5, 'Peripherals', 'Printers, monitors, and accessories.', true, 1),
    (6, 'Gaming', 'Consoles and gaming accessories.', true, 1),
    (7, 'Tablets', 'Portable tablets for work and play.', true, 1),
    -- Software & Services (category_id 2)
    (8, 'Operating Systems', 'Software to run your computer and devices.', true, 2),
    (9, 'Security & Antivirus', 'Protect your data and devices from threats.', true, 2),
    (10, 'Creative Software', 'Tools for design, video, and audio editing.', true, 2),

    -- Home & Smart Devices (category_id 3)
    (11, 'Smart Lighting', 'App-controlled bulbs and light strips.', true, 3),
    (12, 'Smart Security', 'Cameras and alarm systems for home monitoring.', true, 3),
    (13, 'Voice Assistants', 'Smart speakers and displays.', true, 3),

    -- Components & DIY (category_id 4)
    (14, 'Processors & CPUs', 'The brain of your computer.', true, 4),
    (15, 'Memory (RAM)', 'High-speed memory modules.', true, 4),
    (16, 'Storage (SSD/HDD)', 'Drives for all your data needs.', true, 4),
    -- Wearables (category_id 5)
    (17, 'Smart Watches', 'Fitness tracking & notifications on your wrist.', true, 5),
    (18, 'Health Trackers', 'Track your sleep, heart rate & more.', true, 5);

INSERT INTO product (id, name, brand, model_number, color, description, price, cost_price, weight, stock_quantity, image_url, created_at, is_active, subcategory_id)
VALUES
    (1, 'Wireless Egg Speaker', 'QuadZone', 'QZ-SPK-EGG', 'White',
     '["360° Surround Sound","Premium Acoustic Drivers","Bluetooth 5.2 Connectivity","12-hour Playtime","Touch Controls","USB-C Fast Charging","Deep Bass Enhanced Mode"]',
     249.99, 150.00, 1.5, 50, '/src/assets/img/212X200/img1.jpg', DATE_SUB(NOW(), INTERVAL 10 DAY), true, 3),

    (2, 'Convertible Laptop 14"', 'QuadZone', 'QZ-LP-CV14', 'Silver',
     '["14-inch Full HD Touch Display","360° Convertible Design","Intel i7 12th Gen","16GB DDR4 RAM","512GB NVMe SSD","Wi-Fi 6 Support","Backlit Keyboard","Fingerprint Reader"]',
     1099.50, 700.00, 1.8, 150, '/src/assets/img/212X200/img2.jpg', DATE_SUB(NOW(), INTERVAL 12 DAY), true, 1),

    (3, 'Rose Gold Headphones', 'QuadZone Beats', 'QZ-HP-RG', 'Rose Gold',
     '["Active Noise Cancellation","40mm Titanium Drivers","Bluetooth 5.3","Foldable Lightweight Design","Dual Device Pairing","Up to 20 Hours Playback"]',
     129.99, 50.00, 0.4, 500, '/src/assets/img/212X200/img3.jpg', DATE_SUB(NOW(), INTERVAL 30 DAY), true, 3),

    (4, 'Smartphone 6S', 'Apple', 'QZ-PH-6S', 'Gold',
     '["6.1-inch Full HD+ Display","128GB Storage","8GB RAM","48MP AI Triple Camera","5000mAh Battery","Fast Charging","Dual SIM + 5G","In-Display Fingerprint","Face Unlock"]',
     699.00, 400.00, 0.14, 80, '/src/assets/img/212X200/img4.jpg', DATE_SUB(NOW(), INTERVAL 5 DAY), true, 2),

    (5, 'Digital Camera Mint', 'Samsung', 'QZ-CAM-M', 'Mint Blue',
     '["20MP CMOS Sensor","3-inch LCD Display","Optical Zoom 5x","Image Stabilization","Lightweight Travel Design","1080p Full HD Video Recording"]',
     299.00, 200.00, 0.3, 75, '/src/assets/img/212X200/img5.jpg', DATE_SUB(NOW(), INTERVAL 8 DAY), true, 4),

    (6, 'All-in-One Inkjet Printer', 'HP', 'QZ-PRN-CL', 'White',
     '["Print/Scan/Copy Functions","Wireless Printing","HP Smart App Support","High Resolution Color Printing","Energy Efficient Mode","Suitable for Home Offices"]',
     179.99, 100.00, 5.5, 200, '/src/assets/img/212X200/img6.jpg', DATE_SUB(NOW(), INTERVAL 25 DAY), true, 5),

    (7, 'Gaming Console White', 'Sony', 'QZ-PS4-WHT', 'White Marble',
     '["4K Gaming Support","HDR Enabled","1TB Storage","Wireless DualShock Controller","Enhanced Cooling System","Wi-Fi & Bluetooth Connectivity"]',
     399.99, 280.00, 2.8, 300, '/src/assets/img/212X200/img7.jpg', DATE_SUB(NOW(), INTERVAL 30 DAY), true, 6),

    (8, 'HD Camcorder', 'Generic', 'QZ-VID-HDW', 'White',
     '["Full HD 1080p Recording","Wide Angle Lens","Anti-Shake Stabilization","Built-In Microphone","Portable Lightweight Body"]',
     149.99, 80.00, 0.6, 120, '/src/assets/img/212X200/img8.jpg', DATE_SUB(NOW(), INTERVAL 15 DAY), true, 4),

    (9, 'Tablet Mini', 'Apple', 'QZ-TAB-MGL', 'Gold',
     '["7.9-inch Retina Display","A13 Bionic Processor","64GB Storage","10-Hour Battery","Stereo Speakers","Apple Pencil Support"]',
     429.00, 300.00, 0.3, 50, '/src/assets/img/212X200/img9.jpg', DATE_SUB(NOW(), INTERVAL 7 DAY), true, 7),

    (10, 'Tablet Pro 10-inch', 'Samsung', 'QZ-TAB-P10', 'White',
     '["10.1-inch Full HD Display","Octa-core Processor","128GB Storage","Quad Stereo Speakers","Fast Charging","Slim & Lightweight"]',
     349.50, 220.00, 0.5, 250, '/src/assets/img/212X200/img10.jpg', DATE_SUB(NOW(), INTERVAL 20 DAY), true, 7),

    (11, 'Pro Video Editor License', 'EditMaster', 'EM-PRO-VID', 'Digital',
     '["1-Year License","Full HD & 4K Support","Advanced Color Grading","Multi-track Editing","AI Auto-cut Tool","Cloud Sync Support"]',
     199.99, 50.00, 0.0, 999, '/src/assets/img/212X200/img11.jpg', DATE_SUB(NOW(), INTERVAL 3 DAY), true, 10),

    (12, 'Ultimate Security Suite', 'GuardDog', 'GD-SEC-ULT', 'Digital',
     '["Lifetime License","5 Devices Protection","Anti-Malware + Firewall","Ransomware Shield","Real-time Alerts","Secure Cloud Backup"]',
     49.99, 15.00, 0.0, 800, '/src/assets/img/212X200/img12.jpg', DATE_SUB(NOW(), INTERVAL 1 DAY), true, 9),

    (13, 'Smart Speaker Mini', 'QuadZone', 'QZ-SMT-SPKM', 'Charcoal',
     '["Voice Assistant Support","360° Sound Output","Wi-Fi & Bluetooth","Compact Design","6 Hours Battery","Far-field Mic Array"]',
     49.00, 25.00, 0.25, 400, '/src/assets/img/212X200/img13.jpg', DATE_SUB(NOW(), INTERVAL 6 DAY), true, 13),

    (14, 'Outdoor Smart Cam Pro', 'SenseHome', 'SH-CAM-OUT', 'Black',
     '["Weatherproof IP67","Night Vision","1080p HD Recording","Motion Detection Alerts","Cloud + Local Storage","Two-way Audio"]',
     159.50, 80.00, 0.5, 120, '/src/assets/img/212X200/img14.jpg', DATE_SUB(NOW(), INTERVAL 14 DAY), true, 12),

    (15, 'E27 Smart Light Bulb', 'Lumi', 'LM-BULB-CLR', 'White',
     '["16M Color Modes","Smart App Control","Voice Assistant Compatible","Energy Saving","Adjustable Brightness","Wi-Fi Enabled"]',
     24.99, 10.00, 0.1, 750, '/src/assets/img/212X200/img15.jpg', DATE_SUB(NOW(), INTERVAL 9 DAY), true, 11),

    (16, 'M.2 NVMe SSD 1TB', 'Velocity', 'VEL-SSD-1TB', 'Black',
     '["1TB Storage","3500MB/s Read Speed","3000MB/s Write Speed","NVMe PCIe Gen3","Low Power Consumption","Slim M.2 Design"]',
     99.99, 60.00, 0.05, 180, '/src/assets/img/212X200/img16.jpg', DATE_SUB(NOW(), INTERVAL 2 DAY), true, 16),

    (17, 'DDR4 32GB (2x16GB) Kit', 'HyperData', 'HD-RAM-32', 'Red',
     '["32GB Total Capacity","3200MHz Frequency","Low Latency","Aluminum Heat Spreader","Dual Channel Optimized"]',
     119.00, 75.00, 0.1, 100, '/src/assets/img/212X200/img17.jpg', DATE_SUB(NOW(), INTERVAL 18 DAY), true, 15),

    (18, 'Intel Core i7 Processor', 'Intel', 'i7-14700K', 'Grey',
     '["14 Cores 20 Threads","5.4GHz Turbo Boost","Unlocked Multiplier","PCIe 5.0 Support","High-efficiency Thermal Design"]',
     389.00, 280.00, 0.08, 60, '/src/assets/img/212X200/img18.jpg', DATE_SUB(NOW(), INTERVAL 4 DAY), true, 14),

    (19, 'QuadZone FitWatch Pro', 'QuadZone', 'QZ-FW-PRO', 'Black',
     '["AMOLED Display","24/7 Heart Rate Tracking","GPS Built-In","Blood Oxygen Sensor","Up to 10 Days Battery","Waterproof 5ATM"]',
     199.99, 120.00, 0.07, 200, '/src/assets/img/212X200/img19.jpg', DATE_SUB(NOW(), INTERVAL 3 DAY), true, 17),

    (20, 'HealthBand Lite', 'VitalTech', 'VT-HB-LITE', 'Blue',
     '["Step Counter","Sleep Tracking","Silent Alarm","Mobile App Sync","Long Battery Life"]',
     49.99, 20.00, 0.03, 500, '/src/assets/img/212X200/img20.jpg', DATE_SUB(NOW(), INTERVAL 5 DAY), true, 18),

    (21, 'QuadZone SportWatch', 'QuadZone', 'QZ-SW-SPORT', 'Red',
     '["Sports Tracking Modes","Stress Monitoring","Smart Notifications","IP68 Waterproof","14-day Battery"]',
     129.99, 60.00, 0.06, 250, '/src/assets/img/212X200/img21.jpg', DATE_SUB(NOW(), INTERVAL 10 DAY), true, 17),

    (22, 'Bluetooth Mini Speaker', 'BeatBox', 'BB-MINI-SPK', 'Black',
     '["Portable Compact Size","Full Bass Engine","Bluetooth 5.2","USB-C Charging","8h Playtime"]',
     39.99, 15.00, 0.2, 300, '/src/assets/img/212X200/img22.jpg', DATE_SUB(NOW(), INTERVAL 4 DAY), true, 3),

    (23, 'USB-C Fast Charger 45W', 'PowerUp', 'PU-45W-USBC', 'White',
     '["45W Super Fast Charging","Universal USB-C","Overheat Protection","Compact Size"]',
     24.99, 8.00, 0.15, 800, '/src/assets/img/212X200/img23.jpg', DATE_SUB(NOW(), INTERVAL 6 DAY), true, 5),

    (24, 'Xiaomi Mi 14 Pro', 'Xiaomi', 'MI14-PRO', 'Silver',
     '["6.73-inch LTPO AMOLED","512GB UFS 4.0 Storage","16GB RAM","50MP Triple Leica Camera","5100mAh Battery","90W Fast Charging","WiFi 7"]',
     1899.00, 1200.00, 0.19, 50, '/src/assets/img/212X200/img24.jpg', DATE_SUB(NOW(), INTERVAL 11 DAY), true, 2),

    (25, 'Sony WH-1000XM6', 'Sony', 'WH1000XM6', 'Black',
     '["Adaptive Noise Cancelling","Bluetooth 5.4","40-hour Battery","Multi-Device Pairing","High-Resolution Audio","USB-C Fast Charging"]',
     449.00, 260.00, 0.28, 70, '/src/assets/img/212X200/img25.jpg', DATE_SUB(NOW(), INTERVAL 13 DAY), true, 3),

    (26, 'LG UltraGear 32GN600', 'LG', '32GN600', 'Black',
     '["32-inch QHD Display","165Hz Refresh Rate","1ms MBR","AMD FreeSync Premium","HDR10 Support","sRGB 95% Color"]',
     399.99, 270.00, 4.5, 35, '/src/assets/img/212X200/img26.jpg', DATE_SUB(NOW(), INTERVAL 18 DAY), true, 5),

    (27, 'Razer BlackWidow V4 Pro', 'Razer', 'BW-V4-PRO', 'Black',
     '["Mechanical Green Switch","Magnetic Wrist Rest","Per-Key RGB","Dedicated Macro Keys","Aluminum Top Plate","Programmable Dial"]',
     269.00, 150.00, 1.4, 60, '/src/assets/img/212X200/img27.jpg', DATE_SUB(NOW(), INTERVAL 8 DAY), true, 5),

    (28, 'Nintendo Switch 2', 'Nintendo', 'SWITCH-2', 'White',
     '["8-inch OLED Display","DLSS Upscaling","1080p Docked Mode","Backward Compatible","Improved Battery","Bluetooth 5.2","HD Rumble 2.0"]',
     499.00, 320.00, 0.42, 90, '/src/assets/img/212X200/img28.jpg', DATE_SUB(NOW(), INTERVAL 9 DAY), true, 6),

    (29, 'Canon EOS R9', 'Canon', 'EOS-R9', 'Black',
     '["32MP Full-Frame Sensor","8K60 Video","Dual Pixel AF II","5-Axis IBIS","Dual Card Slots","Weather Sealed Body"]',
     1899.00, 1300.00, 1.2, 18, '/src/assets/img/212X200/img29.jpg', DATE_SUB(NOW(), INTERVAL 20 DAY), true, 4),

    (30, 'Samsung Galaxy Tab S9 FE', 'Samsung', 'TAB-S9-FE', 'Mint',
     '["10.9-inch WQXGA Display","Exynos 1380 Chipset","8GB RAM","256GB Storage","IP68 Water Resistance","Dolby Atmos Speakers","S-Pen Included"]',
     599.00, 380.00, 0.5, 40, '/src/assets/img/212X200/img30.jpg', DATE_SUB(NOW(), INTERVAL 14 DAY), true, 7);

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
    (12, DATE_SUB(NOW(), INTERVAL 6 HOUR), 309.98, 24.80, 15.00, 0.00, 349.78, 'COMPLETED', 'Deliver during business hours.', '789 Pine Blvd, Da Nang', 6),
    (13, DATE_SUB(NOW(), INTERVAL 3 DAY), 199.99, 16.00, 10.00, 0.00, 225.99, 'COMPLETED', '', '22 Tran Hung Dao, Ha Noi', 9),
    (14, DATE_SUB(NOW(), INTERVAL 2 DAY), 129.99, 10.40, 5.00, 5.00, 140.39, 'PROCESSING', 'Gift wrap.', '55 Nguyen Hue, HCMC', 10),
    (15, DATE_SUB(NOW(), INTERVAL 12 HOUR), 74.98, 6.00, 10.00, 0.00, 90.98, 'PENDING', '', '99 Le Loi, Da Nang', 9),
    (16, DATE_SUB(NOW(), INTERVAL 5 DAY), 199.99, 16.00, 10.00, 0.00, 225.99, 'COMPLETED', 'Leave at reception.', '12 Cong Hoa, HCMC', 9),
    (17, DATE_SUB(NOW(), INTERVAL 4 DAY), 349.98, 28.00, 15.00, 10.00, 382.98, 'COMPLETED', '', '99 Nguyen Thai Hoc, Hanoi', 10),
    (18, DATE_SUB(NOW(), INTERVAL 3 DAY), 49.99, 4.00, 0.00, 0.00, 53.99, 'PENDING', '', '22 Tran Hung Dao, Da Nang', 6),
    (19, DATE_SUB(NOW(), INTERVAL 2 DAY), 299.98, 24.00, 15.00, 5.00, 333.98, 'PROCESSING', 'Fragile item.', '07 Phan Xich Long, HCMC', 5),
    (20, DATE_SUB(NOW(), INTERVAL 1 DAY), 429.00, 34.00, 15.00, 0.00, 478.00, 'COMPLETED', '', '42 Le Duan, HCMC', 1),
    (21, DATE_SUB(NOW(), INTERVAL 10 HOUR), 129.99, 10.00, 5.00, 0.00, 144.99, 'PROCESSING', 'Call before delivery.', '443 Tran Quang Dieu, Hanoi', 7),
    (22, DATE_SUB(NOW(), INTERVAL 3 HOUR), 389.00, 31.00, 15.00, 0.00, 435.00, 'PENDING', '', '55 Tran Hung Dao, HCMC', 8);

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
    (16, 1, 179.99, 12, 6),
    (17, 1, 199.99, 13, 19),
    (18, 1, 129.99, 14, 21),
    (19, 2, 24.99, 15, 23),
    (20, 1, 199.99, 16, 19),
    (21, 2, 129.99, 17, 21),
    (22, 1, 89.99, 17, 23),
    (23, 1, 49.99, 18, 20),
    (24, 2, 149.99, 19, 22),
    (25, 1, 399.99, 20, 7),
    (26, 1, 29.99, 21, 23),
    (27, 1, 129.99, 21, 3),
    (28, 1, 389.00, 22, 18),
    (29, 1, 49.00, 22, 13),
    (30, 1, 24.99, 22, 15);


INSERT INTO payment (id, order_id, amount, payment_method, payment_status, transaction_id, payment_date, created_at)
VALUES
    (1, 1, 769.92, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_123456789', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (2, 2, 533.38, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_234567890', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (3, 3, 1102.46, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_345678901', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (4, 5, 478.31, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_456789012', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (5, 7, 392.46, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_567890123', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (6, 9, 209.39, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_678901234', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (7, 10, 249.99, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_789012345', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (8, 12, 349.78, 'CASH_ON_DELIVERY', 'COMPLETED', 'txn_mysql_890123456', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),
    (9, 13, 225.99, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_999000111', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (10, 14, 140.39, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_999000112', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (11, 15, 90.98, 'CASH_ON_DELIVERY', 'PENDING', 'txn_mysql_999000113', DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (12, 16, 225.99, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_9001001', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (13, 17, 382.98, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_9001002', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (14, 18, 53.99, 'CASH_ON_DELIVERY', 'PENDING', 'txn_mysql_9001003', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (15, 19, 333.98, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_9001004', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (16, 20, 478.00, 'CREDIT_CARD', 'COMPLETED', 'txn_mysql_9001005', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (17, 21, 144.99, 'BANK_TRANSFER', 'COMPLETED', 'txn_mysql_9001006', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR)),
    (18, 22, 435.00, 'CASH_ON_DELIVERY', 'PENDING', 'txn_mysql_9001007', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR));

INSERT INTO deliveries (id, tracking_number, carrier, delivery_status, estimated_delivery_date, actual_delivery_date, delivery_notes, signature_required, order_id, staff_id, created_at)
VALUES
    (1, '1Z999ABC1234567890', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), 'Delivered.', true, 1, 3, DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (2, '1Z999ABC1234567891', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), 'Delivered.', false, 2, 3, DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (3, '1Z999ABC1234567892', 'Vietel Post', 'SHIPPED', DATE_SUB(NOW(), INTERVAL 5 DAY), null, 'On the way.', true, 3, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (4, '1Z999ABC1234567893', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 'Delivered.', true, 5, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (5, '1Z999ABC1234567894', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Delivery successful.', false, 7, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (6, '1Z999ABC1234567895', 'QuadZone Express', 'OUT_FOR_DELiVERY', DATE_SUB(NOW(), INTERVAL 0 DAY), null, 'Out for delivery.', true, 9, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (7, '1Z999ABC1234567896', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 0 DAY), DATE_SUB(NOW(), INTERVAL 0 DAY), 'Delivered.', true, 10, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (8, '1Z999ABC1234567897', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 0 DAY), DATE_SUB(NOW(), INTERVAL 0 DAY), 'Delivered.', false, 12, 3, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
    (9, 'TRK12345001', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Delivered to mailbox.', false, 13, 11, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (10, 'TRK12345002', 'Viettel Post', 'SHIPPED', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'On the way.', false, 14, 11, DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (11, 'TRK12345003', 'QuadZone Express', 'PENDING', DATE_ADD(NOW(), INTERVAL 1 DAY), NULL, '', true, 15, 11, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (12, 'DLV-100001', 'QuadZone Express', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 'Left at reception.', true, 16, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (13, 'DLV-100002', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), '', false, 17, 3, DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (14, 'DLV-100003', 'Viettel Post', 'OUT_FOR_DELIVERY', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'On the way.', true, 18, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (15, 'DLV-100004', 'QuadZone Express', 'SHIPPED', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'Handle with care.', true, 19, 3, DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (16, 'DLV-100005', 'GHTK', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 0 DAY), DATE_SUB(NOW(), INTERVAL 0 DAY), '', true, 20, 3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (17, 'DLV-100006', 'Viettel Post', 'SHIPPED', DATE_ADD(NOW(), INTERVAL 1 DAY), NULL, 'Call before arrival.', false, 21, 3, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
    (18, 'DLV-100007', 'QuadZone Express', 'PENDING', DATE_ADD(NOW(), INTERVAL 1 DAY), NULL, '', true, 22, 3, DATE_SUB(NOW(), INTERVAL 3 HOUR));

INSERT INTO review (id, rating, review_title, content, created_at, product_id, customer_id, order_item_id)
VALUES
    (1, 5, 'Best Phone!', 'This phone is amazing! Works perfectly.', DATE_SUB(NOW(), INTERVAL 9 DAY), 4, 1, 1),
    (2, 4, 'Good Headphones', 'Nice sound, good quality. Will buy again.', DATE_SUB(NOW(), INTERVAL 7 DAY), 3, 5, 2),
    (3, 5, 'Great Camera for Travel', 'Light, reliable, and takes great photos.', DATE_SUB(NOW(), INTERVAL 4 DAY), 5, 1, 7),
    (4, 3, 'Okay tablet for the price', 'The screen is decent, but the battery life is a bit short.', DATE_SUB(NOW(), INTERVAL 2 DAY), 10, 5, 9),
    (5, 5, 'Amazing Sound!', 'This speaker has incredible sound for its size. Worth every penny.', DATE_SUB(NOW(), INTERVAL 0 DAY), 1, 7, 13),
    (6, 4, 'Sleek Printer', 'Love the design and it prints fast. Setup was easy.', DATE_SUB(NOW(), INTERVAL 0 DAY), 6, 6, 16),
    (7, 5, 'Excellent Smartwatch', 'Battery life is incredible!', DATE_SUB(NOW(), INTERVAL 2 DAY), 19, 9, 17),
    (8, 4, 'Comfortable band', 'Nice design, good features.', DATE_SUB(NOW(), INTERVAL 1 DAY), 21, 10, 18),
    (9, 5, 'Fast charger works great', 'Charges my phone super fast!', NOW(), 23, 9, 19),
    (10, 5, 'Great Smartwatch!', 'Accurate tracking and the display is beautiful.', DATE_SUB(NOW(), INTERVAL 4 DAY), 19, 9, 20),
    (11, 4, 'Good value', 'SportWatch is comfortable and battery lasts long.', DATE_SUB(NOW(), INTERVAL 3 DAY), 21, 10, 21),
    (12, 3, 'Average charger', 'Fast but heats a bit.', DATE_SUB(NOW(), INTERVAL 2 DAY), 23, 10, 22),
    (13, 5, 'Amazing speaker', 'Small size but powerful bass!', DATE_SUB(NOW(), INTERVAL 1 DAY), 22, 6, 24),
    (14, 4, 'Excellent console', 'Games run smoothly, very satisfied!', NOW(), 7, 1, 25),
    (15, 5, 'Fast delivery', 'Item arrived earlier than expected.', NOW(), 23, 7, 26),
    (16, 4, 'Powerful CPU', 'Performance is outstanding for my build.', NOW(), 18, 8, 28);

SET FOREIGN_KEY_CHECKS = 1;
-- =====================================================
-- QuadZone Blog Sample Data
-- =====================================================

-- Note: Make sure you have users in your database first
-- This assumes user IDs 1, 2, 3 exist (adjust as needed)

-- =====================================================
-- BLOG POSTS
-- =====================================================

-- Blog Post 1: Latest Tech Trends
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('The Future of Artificial Intelligence in 2024',
     'future-of-ai-2024',
     '<p><strong>Artificial Intelligence is rapidly transforming the technology landscape.</strong> From machine learning algorithms to neural networks, AI is becoming an integral part of our daily lives.</p>
     <p>In this comprehensive guide, we explore the latest developments in AI technology and what they mean for consumers and businesses alike.</p>
     <h2>Key Developments</h2>
     <p>The AI industry has seen remarkable growth in recent years. Major tech companies are investing billions in AI research and development.</p>
     <ul>
     <li>Advanced natural language processing</li>
     <li>Computer vision improvements</li>
     <li>Autonomous systems</li>
     <li>AI-powered robotics</li>
     </ul>
     <h2>Impact on Electronics</h2>
     <p>AI is revolutionizing the electronics industry, from smart home devices to advanced computing systems. Modern smartphones now come equipped with AI chips that enable features like facial recognition, voice assistants, and intelligent photography.</p>
     <blockquote>
     <p>The integration of AI into consumer electronics is not just a trend—it''s the future of technology.</p>
     </blockquote>
     <p>As we move forward, we can expect to see even more innovative applications of AI in everyday devices, making our lives easier and more connected than ever before.</p>',
     'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1500&h=730&fit=crop',
     'PUBLISHED',
     1,
     '2024-01-15 10:30:00');

-- Blog Post 2: Smartphone Buying Guide
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('Ultimate Smartphone Buying Guide 2024',
     'smartphone-buying-guide-2024',
     '<p><strong>Choosing the right smartphone can be overwhelming with so many options available.</strong> This comprehensive guide will help you make an informed decision.</p>
     <h2>Key Factors to Consider</h2>
     <p>When shopping for a new smartphone, several critical factors should influence your decision:</p>
     <h3>1. Performance</h3>
     <p>The processor is the heart of your smartphone. Look for devices with the latest chipsets for smooth performance and future-proofing.</p>
     <h3>2. Camera Quality</h3>
     <p>Modern smartphones come with multiple camera lenses and AI-powered photography features. Consider your photography needs when making a choice.</p>
     <h3>3. Battery Life</h3>
     <p>A phone with excellent specs but poor battery life can be frustrating. Look for devices with at least 4,000mAh batteries and fast charging support.</p>
     <h2>Top Picks for 2024</h2>
     <p>Based on our extensive testing, here are some standout devices across different price ranges:</p>
     <ul>
     <li><strong>Flagship Category:</strong> Premium devices with cutting-edge features</li>
     <li><strong>Mid-Range Champions:</strong> Best value for money options</li>
     <li><strong>Budget Friendly:</strong> Excellent performance without breaking the bank</li>
     </ul>
     <p>Remember, the best smartphone for you depends on your specific needs and budget. Take your time to research and compare before making a purchase.</p>',
     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1500&h=730&fit=crop',
     'PUBLISHED',
     2,
     '2024-02-10 14:20:00');

-- Blog Post 3: Gaming Setup
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('Building the Perfect Gaming Setup in 2024',
     'perfect-gaming-setup-2024',
     '<p><strong>Creating an immersive gaming experience requires more than just a powerful PC or console.</strong> From monitors to peripherals, every component plays a crucial role.</p>
     <h2>Essential Components</h2>
     <p>A complete gaming setup consists of several key elements that work together to provide the ultimate gaming experience.</p>
     <h3>Display Technology</h3>
     <p>Your monitor or TV is your window into the gaming world. For competitive gaming, look for:</p>
     <ul>
     <li>144Hz or higher refresh rate</li>
     <li>1ms response time</li>
     <li>Adaptive sync technology (G-Sync or FreeSync)</li>
     <li>4K resolution for visual fidelity</li>
     </ul>
     <h3>Audio Setup</h3>
     <p>Immersive audio can make or break your gaming experience. Consider investing in quality headphones or a surround sound system.</p>
     <blockquote>
     <p>Great audio is just as important as visual quality in creating an immersive gaming experience.</p>
     </blockquote>
     <h2>Peripherals Matter</h2>
     <p>Don''t overlook the importance of quality peripherals:</p>
     <ul>
     <li><strong>Gaming Mouse:</strong> High DPI sensors and customizable buttons</li>
     <li><strong>Mechanical Keyboard:</strong> Responsive switches for competitive advantage</li>
     <li><strong>Gaming Chair:</strong> Comfort during long gaming sessions</li>
     </ul>
     <p>Investing in the right equipment will significantly enhance your gaming experience and potentially improve your performance.</p>',
     'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1500&h=730&fit=crop',
     'PUBLISHED',
     1,
     '2024-02-25 09:45:00');

-- Blog Post 4: Smart Home Tech
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('Smart Home Technology: A Beginner''s Guide',
     'smart-home-beginners-guide',
     '<p><strong>Transform your house into a smart home with the latest IoT devices and automation systems.</strong> This guide will walk you through the basics of home automation.</p>
     <h2>Getting Started</h2>
     <p>Building a smart home doesn''t have to be complicated or expensive. Start with a few key devices and expand over time.</p>
     <h3>Smart Speakers and Hubs</h3>
     <p>A smart speaker or hub acts as the central control point for your smart home ecosystem. Popular options include Amazon Echo, Google Home, and Apple HomePod.</p>
     <h3>Smart Lighting</h3>
     <p>Smart bulbs and switches are an excellent entry point into home automation. They offer:</p>
     <ul>
     <li>Remote control via smartphone</li>
     <li>Voice control integration</li>
     <li>Scheduling and automation</li>
     <li>Energy monitoring</li>
     </ul>
     <h2>Security and Safety</h2>
     <p>Smart home security devices provide peace of mind and enhanced protection:</p>
     <ul>
     <li>Smart doorbells with video</li>
     <li>Security cameras</li>
     <li>Smart locks</li>
     <li>Motion sensors</li>
     </ul>
     <h2>Climate Control</h2>
     <p>Smart thermostats can help reduce energy bills while maintaining comfort. They learn your preferences and adjust automatically.</p>
     <blockquote>
     <p>A smart home is not just about convenience—it''s about efficiency, security, and comfort.</p>
     </blockquote>
     <p>Start small, choose compatible devices, and gradually build your smart home ecosystem based on your needs and budget.</p>',
     'https://images.unsplash.com/photo-1558002038-1055907df827?w=1500&h=730&fit=crop',
     'PUBLISHED',
     2,
     '2024-03-05 11:15:00');

-- Blog Post 5: Laptop Buying Guide
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('How to Choose the Perfect Laptop for Your Needs',
     'choose-perfect-laptop',
     '<p><strong>With countless laptop models available, finding the right one can be challenging.</strong> This guide breaks down what you need to know.</p>
     <h2>Determine Your Use Case</h2>
     <p>Before shopping, identify your primary use case:</p>
     <ul>
     <li><strong>Students:</strong> Portability and battery life</li>
     <li><strong>Professionals:</strong> Performance and build quality</li>
     <li><strong>Gamers:</strong> Graphics power and cooling</li>
     <li><strong>Creators:</strong> Display quality and processing power</li>
     </ul>
     <h2>Key Specifications</h2>
     <h3>Processor (CPU)</h3>
     <p>The processor determines your laptop''s overall performance. For most users, an Intel Core i5 or AMD Ryzen 5 is sufficient.</p>
     <h3>RAM</h3>
     <p>8GB is the minimum for basic tasks, but 16GB is recommended for multitasking and demanding applications.</p>
     <h3>Storage</h3>
     <p>Always opt for an SSD over HDD. NVMe SSDs offer the best performance. Minimum 256GB, but 512GB is ideal.</p>
     <h2>Display Considerations</h2>
     <p>Your laptop screen is what you''ll be staring at for hours. Consider:</p>
     <ul>
     <li>Resolution: Full HD (1920x1080) minimum</li>
     <li>Panel type: IPS for better viewing angles</li>
     <li>Screen size: 13-15 inches for portability</li>
     <li>Touch support: Optional but useful</li>
     </ul>
     <h2>Battery Life</h2>
     <p>Look for laptops that offer at least 8 hours of battery life for all-day productivity.</p>
     <blockquote>
     <p>The best laptop is one that fits your specific needs and workflow, not necessarily the most expensive one.</p>
     </blockquote>',
     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1500&h=730&fit=crop',
     'PUBLISHED',
     1,
     '2024-03-12 15:30:00');

-- Blog Post 6: Wireless Audio
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('The Evolution of Wireless Audio Technology',
     'wireless-audio-evolution',
     '<p><strong>Wireless audio has come a long way from the early days of Bluetooth headphones.</strong> Today''s wireless audio devices offer exceptional sound quality and features.</p>
     <h2>Bluetooth Technology Advances</h2>
     <p>Modern Bluetooth codecs like aptX, LDAC, and AAC have dramatically improved wireless audio quality, approaching or matching wired connections.</p>
     <h3>True Wireless Earbuds</h3>
     <p>The true wireless revolution has changed how we listen to music:</p>
     <ul>
     <li>No wires between earbuds</li>
     <li>Compact charging cases</li>
     <li>Active noise cancellation</li>
     <li>Transparency modes</li>
     </ul>
     <h2>Over-Ear Wireless Headphones</h2>
     <p>For audiophiles and professionals, over-ear wireless headphones offer:</p>
     <ul>
     <li>Superior sound quality</li>
     <li>Longer battery life</li>
     <li>Better noise isolation</li>
     <li>Comfortable for extended use</li>
     </ul>
     <h2>Features to Consider</h2>
     <h3>Active Noise Cancellation (ANC)</h3>
     <p>ANC technology uses microphones to detect and cancel out ambient noise, perfect for travel or noisy environments.</p>
     <h3>Battery Life</h3>
     <p>Look for earbuds with 6+ hours per charge and headphones with 20+ hours for optimal convenience.</p>
     <blockquote>
     <p>Wireless doesn''t mean compromise anymore. Modern wireless audio delivers exceptional quality and convenience.</p>
     </blockquote>
     <p>Whether you''re commuting, working out, or relaxing at home, there''s a perfect wireless audio solution for your lifestyle.</p>',
     'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1500&h=730&fit=crop',
     'PUBLISHED',
     2,
     '2024-03-18 10:00:00');

-- Blog Post 7: Photography Tech
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('Digital Photography: Camera Technology Explained',
     'digital-camera-technology',
     '<p><strong>Understanding camera technology helps you make better purchasing decisions and take better photos.</strong> Let''s dive into the key technologies that make modern cameras amazing.</p>
     <h2>Sensor Technology</h2>
     <p>The image sensor is the heart of any digital camera. Two main types dominate the market:</p>
     <h3>Full-Frame Sensors</h3>
     <p>Full-frame sensors (36mm x 24mm) offer superior image quality, better low-light performance, and shallower depth of field.</p>
     <h3>Crop Sensors (APS-C)</h3>
     <p>Smaller and more affordable, crop sensors still deliver excellent image quality for most users.</p>
     <h2>Lens Technology</h2>
     <p>Your lens is just as important as your camera body:</p>
     <ul>
     <li><strong>Prime Lenses:</strong> Fixed focal length, excellent image quality</li>
     <li><strong>Zoom Lenses:</strong> Versatile focal range for various situations</li>
     <li><strong>Image Stabilization:</strong> Reduces camera shake</li>
     </ul>
     <h2>Autofocus Systems</h2>
     <p>Modern cameras use sophisticated autofocus systems:</p>
     <ul>
     <li>Phase detection for fast tracking</li>
     <li>Contrast detection for precision</li>
     <li>Eye detection for portraits</li>
     <li>Animal detection for wildlife</li>
     </ul>
     <h2>Video Capabilities</h2>
     <p>Today''s cameras are also powerful video tools, offering 4K and even 8K recording capabilities.</p>
     <blockquote>
     <p>The best camera is the one you have with you, but understanding technology helps you choose the right tool for your creative vision.</p>
     </blockquote>',
     'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1500&h=730&fit=crop',
     'PUBLISHED',
     1,
     '2024-03-22 13:45:00');

-- Blog Post 8: 5G Technology
INSERT INTO blog (title, slug, content, thumbnail_url, status, author_id, created_at) VALUES
    ('5G Technology: What It Means for Consumers',
     '5g-technology-explained',
     '<p><strong>5G is revolutionizing mobile connectivity with unprecedented speeds and reliability.</strong> Here''s what you need to know about this transformative technology.</p>
     <h2>What is 5G?</h2>
     <p>5G is the fifth generation of cellular network technology, offering dramatic improvements over 4G LTE:</p>
     <ul>
     <li>Download speeds up to 10 Gbps</li>
     <li>Ultra-low latency (under 1ms)</li>
     <li>Massive device connectivity</li>
     <li>Enhanced reliability</li>
     </ul>
     <h2>Real-World Applications</h2>
     <h3>Enhanced Mobile Broadband</h3>
     <p>Stream 4K and 8K video without buffering, download large files in seconds, and enjoy lag-free cloud gaming.</p>
     <h3>Internet of Things (IoT)</h3>
     <p>5G enables massive IoT deployments with billions of connected devices working seamlessly together.</p>
     <h3>Industry Applications</h3>
     <p>From autonomous vehicles to remote surgery, 5G is enabling revolutionary applications across industries.</p>
     <h2>5G Device Considerations</h2>
     <p>When buying a 5G device, consider:</p>
     <ul>
     <li>Sub-6GHz vs mmWave support</li>
     <li>Battery efficiency</li>
     <li>Coverage in your area</li>
     <li>Carrier compatibility</li>
     </ul>
     <blockquote>
     <p>5G isn''t just faster internet—it''s the foundation for the next generation of connected experiences.</p>
     </blockquote>
     <p>As 5G networks continue to expand, we''ll see even more innovative applications that leverage this powerful technology.</p>',
     'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1500&h=730&fit=crop',
     'PUBLISHED',
     2,
     '2024-03-28 16:20:00');

-- =====================================================
-- BLOG COMMENTS
-- =====================================================

-- Comments for Blog 1 (AI Article)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at)
VALUES ('John Smith', 'john.smith@email.com',
        'Great article! AI is definitely transforming how we interact with technology. I''m particularly excited about the developments in natural language processing.',
        1, '2024-01-16 08:30:00');

INSERT INTO comments (author_name, author_email, content, blog_id, created_at)
VALUES ('Sarah Johnson', 'sarah.j@email.com',
        'Very informative post. I''d love to see a follow-up article about the ethical implications of AI in consumer electronics.',
        1, '2024-01-17 14:20:00');

INSERT INTO comments (author_name, author_email, content, blog_id, created_at)
VALUES ('Mike Chen', 'mike.chen@email.com',
        'The section on AI in smartphones was particularly interesting. I didn''t realize how much AI is already integrated into our daily devices.',
        1, '2024-01-18 10:15:00');

-- Comments for Blog 2 (Smartphone Guide)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Emily Davis', 'emily.d@email.com', 'This guide helped me choose my new phone! The breakdown of features by use case was exactly what I needed.', 2, '2024-02-11 09:45:00'),
                                                                                   ('Robert Lee', 'robert.lee@email.com', 'Could you do a similar guide for tablets? I''m trying to decide between an iPad and Android tablet.', 2, '2024-02-12 15:30:00');

-- Comments for Blog 3 (Gaming Setup)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Alex Turner', 'alex.turner@email.com', 'Finally building my dream setup! This article covers everything I needed to know. Bookmarked for reference!', 3, '2024-02-26 11:00:00'),
                                                                                   ('Jessica Wang', 'jessica.w@email.com', 'Great tips on peripherals. I upgraded my mouse and keyboard based on your recommendations and it made a huge difference!', 3, '2024-02-27 16:45:00'),
                                                                                   ('David Kim', 'david.kim@email.com', 'Would love to see a budget-friendly version of this guide. Not everyone can afford high-end gaming gear.', 3, '2024-02-28 10:30:00');

-- Comments for Blog 4 (Smart Home)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Lisa Anderson', 'lisa.anderson@email.com', 'Just started my smart home journey with a few smart bulbs. This guide is perfect for beginners like me!', 4, '2024-03-06 13:20:00'),
                                                                                   ('Tom Wilson', 'tom.w@email.com', 'The security section was very helpful. Added smart locks and cameras to my setup and feel much safer now.', 4, '2024-03-07 09:15:00');

-- Comments for Blog 5 (Laptop Guide)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Rachel Green', 'rachel.green@email.com', 'Perfect timing! I was just about to buy a laptop for college. The student recommendations were spot on.', 5, '2024-03-13 14:50:00'),
                                                                                   ('James Brown', 'james.brown@email.com', 'Excellent breakdown of specs. The RAM and storage advice saved me from making an underpowered purchase.', 5, '2024-03-14 10:25:00');

-- Comments for Blog 6 (Wireless Audio)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Olivia Martinez', 'olivia.m@email.com', 'As an audiophile, I was skeptical of wireless, but modern codecs have won me over. Great explanation!', 6, '2024-03-19 11:40:00'),
                                                                                   ('Chris Taylor', 'chris.taylor@email.com', 'The ANC comparison was really useful. Ended up getting the headphones you recommended!', 6, '2024-03-20 15:10:00');

-- Comments for Blog 7 (Photography)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
                                                                                   ('Nina Patel', 'nina.patel@email.com', 'This explained sensor technology better than any other article I''ve read. Thank you!', 7, '2024-03-23 09:30:00'),
                                                                                   ('Mark Johnson', 'mark.j@email.com', 'Could you do a comparison of full-frame vs crop sensor cameras in different price ranges?', 7, '2024-03-24 14:00:00');

-- Comments for Blog 8 (5G)
INSERT INTO comments (author_name, author_email, content, blog_id, created_at) VALUES
('Sophie Turner', 'sophie.t@email.com', 'Finally understand what 5G actually means! The real-world applications section was eye-opening.', 8, '2024-03-29 10:15:00'),
('Daniel White', 'daniel.white@email.com', 'Great article! Would love to see coverage maps and carrier comparisons in a future post.', 8, '2024-03-30 13:45:00');


INSERT INTO wishlist (id, user_id) VALUES
                                       (1, 1),
                                       (2, 5),
                                       (3, 6),
                                       (4, 7),
                                       (5, 8);

INSERT INTO wishlist_products (wishlist_id, product_id) VALUES
                                                            (1, 1), (1, 3), (1, 4),
                                                            (2, 9), (2, 10),
                                                            (3, 16), (3, 17),
                                                            (4, 1), (4, 15),
                                                            (5, 7);

INSERT INTO coupons (code, coupon_value, discount_type, min_order_amount, max_discount_amount, is_active, start_date, end_date, usage_count, max_usage)
VALUES
    ('WELCOME10', 10, 'PERCENTAGE', 100, 50, true, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 0, 999),
    ('FLASH50', 50, 'FIXED_AMOUNT', 200, 50, true, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 0, 200),
    ('FREESHIP', 15, 'FIXED_AMOUNT', 50, 15, true, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 0, 1000);

INSERT INTO notifications (user_id, title, description, avatar_url, type, posted_at, is_unread)
VALUES
    (1, 'Your Order Has Been Delivered', 'Order #1 has been successfully delivered.', '/img/system/delivery.png', 'ORDER', NOW(), true),
    (2, 'A New Message from Customer', 'Customer has sent a new message.', '/img/system/message.png', 'CHAT', NOW(), true),
    (5, 'New Discount Available', 'FLASH50 voucher is now active.', '/img/system/discount.png', 'PROMO', NOW(), true),
    (6, 'Order Processing', 'Your order #3 is now being processed.', '/img/system/order.png', 'ORDER', NOW(), false),
    (7, 'Review Approved', 'Your review on Tablet Pro is now visible.', '/img/system/review.png', 'SYSTEM', NOW(), false);

INSERT INTO chat_room (id, customer_id, staff_id, status, created_at, last_message_at)
VALUES
    (1, 1, 3, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
    (2, 7, 3, 'CLOSED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO chat_message (chat_room_id, sender_id, content, message_type, sent_at, is_read)
VALUES
    (1, 1, 'Hi, I need help with my recent order.', 'TEXT', DATE_SUB(NOW(), INTERVAL 23 HOUR), true),
    (1, 3, 'Sure! Could you please provide your order number?', 'TEXT', DATE_SUB(NOW(), INTERVAL 22 HOUR), true),
    (1, 1, 'It''s order #1.', 'TEXT', DATE_SUB(NOW(), INTERVAL 21 HOUR), false),

    (2, 7, 'My tablet has an issue with the battery.', 'TEXT', DATE_SUB(NOW(), INTERVAL 2 DAY), true),
    (2, 3, 'Please bring it to our service center.', 'TEXT', DATE_SUB(NOW(), INTERVAL 2 DAY), true);

INSERT INTO contacts (name, email, subject, message, created_at) VALUES
                                                                     ('Laura Nguyen', 'laura@email.com', 'Order inquiry', 'When will my order arrive?', NOW()),
                                                                     ('Peter Do', 'peter@email.com', 'Warranty question', 'Does the laptop have an international warranty?', NOW());

INSERT INTO orders (id, order_date, subtotal, tax_amount, shipping_cost, discount_amount, total_amount,
                    order_status, notes, address, user_id)
VALUES
-- Order 13
(23, DATE_SUB(NOW(), INTERVAL 3 DAY),
 129.99, 10.40, 15.00, 0.00, 155.39,
 'CONFIRMED', 'Customer confirmed via email.', '123 Main St, HCMC', 1),

-- Order 14
(24, DATE_SUB(NOW(), INTERVAL 2 DAY),
 349.50, 27.96, 15.00, 20.00, 372.46,
 'CONFIRMED', 'Applied FLASH20 discount.', '456 Oak Ave, Hanoi', 5),

-- Order 15
(25, DATE_SUB(NOW(), INTERVAL 4 DAY),
 429.00, 34.32, 15.00, 0.00, 478.32,
 'CONFIRMED', 'Customer requested fast delivery.', '789 Pine Blvd, Da Nang', 6),

-- Order 16
(26, DATE_SUB(NOW(), INTERVAL 1 DAY),
 179.99, 14.40, 15.00, 5.00, 204.39,
 'CONFIRMED', 'Confirmed. Small voucher applied.', '101 Maple Rd, Hanoi', 7),

-- Order 17
(27, DATE_SUB(NOW(), INTERVAL 5 DAY),
 699.00, 55.92, 15.00, 0.00, 769.92,
 'CONFIRMED', 'Confirmed by customer.', '202 Birch Ln, HCMC', 8),

-- Order 18
(28, DATE_SUB(NOW(), INTERVAL 2 DAY),
 249.99, 20.00, 15.00, 10.00, 274.99,
 'CONFIRMED', 'Promotion applied successfully.', '123 Main St, HCMC', 1),

-- Order 19
(29, DATE_SUB(NOW(), INTERVAL 6 DAY),
 299.00, 23.92, 15.00, 0.00, 337.92,
 'CONFIRMED', 'Customer confirmed on phone.', '456 Oak Ave, Hanoi', 5),

-- Order 20
(30, DATE_SUB(NOW(), INTERVAL 8 DAY),
 99.99, 8.00, 15.00, 0.00, 122.99,
 'CONFIRMED', 'Awaiting packing.', '789 Pine Blvd, Da Nang', 6),

-- Order 21
(31, DATE_SUB(NOW(), INTERVAL 12 HOUR),
 159.50, 12.76, 15.00, 5.00, 182.26,
 'CONFIRMED', 'Confirmed after stock check.', '101 Maple Rd, Hanoi', 7),

-- Order 22
(32, DATE_SUB(NOW(), INTERVAL 10 HOUR),
 49.00, 3.92, 15.00, 0.00, 67.92,
 'CONFIRMED', 'Low-value order confirmed.', '202 Birch Ln, HCMC', 8);

INSERT INTO _user (created_at, email, first_name, last_name, password, role, status)
VALUES (NOW(), 'ship01@example.com', 'Nguyễn', 'Văn Hùng',
        '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i',
        'SHIPPER', 'ACTIVE');

INSERT INTO _user (created_at, email, first_name, last_name, password, role, status)
VALUES (NOW(), 'ship02@example.com', 'Trần', 'Anh Quân',
        '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i',
        'SHIPPER', 'ACTIVE');

INSERT INTO _user (created_at, email, first_name, last_name, password, role, status)
VALUES (NOW(), 'ship03@example.com', 'Phạm', 'Minh Tú',
        '$2y$10$TyY0L134mVANXy0zQqTnrumSCgHtK4ShKvI3eg1mik/VK2XMCqC0i',
        'SHIPPER', 'ACTIVE');
