CREATE TABLE `activities` (
	`activity_customer_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`activity_date` timestamp NOT NULL DEFAULT (now()),
	`activity_type` varchar(100) NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `admin_profile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`profile_picture` varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT `admin_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_profile_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `admin_default` (
	`default_admin_id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_default_default_admin_id` PRIMARY KEY(`default_admin_id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`contact_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`contact_date` timestamp NOT NULL DEFAULT (now()),
	`contact_method` varchar(50),
	`subject` varchar(255),
	`message` text,
	CONSTRAINT `contacts_contact_id` PRIMARY KEY(`contact_id`)
);
--> statement-breakpoint
CREATE TABLE `customer_details` (
	`customer_detail_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`alamat` varchar(255),
	`kelurahan` varchar(100),
	`kecamatan` varchar(100),
	`kota` varchar(100),
	`provinsi` varchar(100),
	`kode_pos` varchar(10),
	CONSTRAINT `customer_details_customer_detail_id` PRIMARY KEY(`customer_detail_id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`customer_id` int AUTO_INCREMENT NOT NULL,
	`nama_customer` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`status` enum('active','inactive') DEFAULT 'active',
	`last_contacted` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_customer_id` PRIMARY KEY(`customer_id`),
	CONSTRAINT `customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `customer_behavior` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`page_views` int NOT NULL DEFAULT 0,
	`cart_adds` int NOT NULL DEFAULT 0,
	`wishlist_adds` int NOT NULL DEFAULT 0,
	`last_visit` timestamp,
	CONSTRAINT `customer_behavior_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sc_meeting_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meeting_subject` varchar(100) NOT NULL,
	`meeting_place` varchar(100) NOT NULL,
	`meeting_date` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sc_meeting_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tbl_default_meeting` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meeting_id_fk` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tbl_default_meeting_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`order_item_id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_order_item_id` PRIMARY KEY(`order_item_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`order_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','cancelled'),
	`notes` varchar(255),
	`order_date` timestamp NOT NULL DEFAULT (now()),
	`payment_status` varchar(50) DEFAULT 'unpaid',
	`payment_date` timestamp,
	`shipping_address` json,
	CONSTRAINT `orders_order_id` PRIMARY KEY(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`payment_id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`metode_pembayaran` varchar(55) NOT NULL DEFAULT 'cash',
	`jumlah_bayar` decimal(10,2) NOT NULL,
	`status_pembayaran` varchar(30) NOT NULL,
	`payment_date` timestamp NOT NULL DEFAULT (now()),
	`customer_id` int NOT NULL,
	CONSTRAINT `payments_payment_id` PRIMARY KEY(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`cart_item_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`product_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_item_cart_item_id` PRIMARY KEY(`cart_item_id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`nama_kategori` varchar(100) NOT NULL,
	`deskripsi_kategori` varchar(255) NOT NULL,
	CONSTRAINT `category_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`nama_produk` varchar(100) NOT NULL,
	`review_produk` varchar(255) NOT NULL,
	`warna_produk` varchar(50) NOT NULL,
	`foto_produk` varchar(255) NOT NULL,
	`deskripsi_produk` text NOT NULL,
	`harga` decimal(10,2) NOT NULL,
	`fkVendor` varchar(36) NOT NULL,
	`fkcategory` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`review_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`rating` decimal(2,1) NOT NULL,
	`review_text` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_review_id` PRIMARY KEY(`review_id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`sales_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`order_id` int NOT NULL,
	`sale_date` timestamp NOT NULL DEFAULT (now()),
	`amount` decimal(10,2) NOT NULL,
	`product_details` json,
	`by_country` varchar(100),
	CONSTRAINT `sales_sales_id` PRIMARY KEY(`sales_id`)
);
--> statement-breakpoint
CREATE TABLE `todo_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`target` varchar(255) NOT NULL,
	`status` enum('Inactive','Pending','In-Progress','Completed') NOT NULL,
	`deadline` datetime,
	`assigned_to` varchar(100) NOT NULL,
	`todo_priority` enum('Low','Medium','High') NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by` varchar(255),
	CONSTRAINT `todo_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tb_users_default` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`user_secure_id` int NOT NULL,
	`create_at` timestamp NOT NULL DEFAULT (now()),
	`update_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tb_users_default_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_secure` (
	`user_secure_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_secure_user_secure_id` PRIMARY KEY(`user_secure_id`),
	CONSTRAINT `users_secure_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`nama_depan` varchar(100),
	`nama_belakang` varchar(100),
	`fullname` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`vendor_id` int AUTO_INCREMENT NOT NULL,
	`nama_vendor` varchar(100) NOT NULL,
	`kontak_email` varchar(100) NOT NULL,
	`kontak_telepon` varchar(20),
	`address` text,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_vendor_id` PRIMARY KEY(`vendor_id`),
	CONSTRAINT `vendors_kontak_email_unique` UNIQUE(`kontak_email`)
);
--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin` ADD CONSTRAINT `admin_admin_profile_id_admin_profile_id_fk` FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profile`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_default` ADD CONSTRAINT `admin_default_admin_id_admin_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_details` ADD CONSTRAINT `customer_details_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_behavior` ADD CONSTRAINT `customer_behavior_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tbl_default_meeting` ADD CONSTRAINT `tbl_default_meeting_meeting_id_fk_sc_meeting_table_id_fk` FOREIGN KEY (`meeting_id_fk`) REFERENCES `sc_meeting_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fkVendor_vendors_vendor_id_fk` FOREIGN KEY (`fkVendor`) REFERENCES `vendors`(`vendor_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fkcategory_category_category_id_fk` FOREIGN KEY (`fkcategory`) REFERENCES `category`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_order_id_orders_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tb_users_default` ADD CONSTRAINT `tb_users_default_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tb_users_default` ADD CONSTRAINT `tb_users_default_user_secure_id_users_secure_user_secure_id_fk` FOREIGN KEY (`user_secure_id`) REFERENCES `users_secure`(`user_secure_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_secure` ADD CONSTRAINT `users_secure_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;