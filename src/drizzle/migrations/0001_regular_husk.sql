ALTER TABLE `activities` RENAME COLUMN `activity_customer_id` TO `id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `payment_date` TO `created_at`;--> statement-breakpoint
ALTER TABLE `activities` MODIFY COLUMN `customer_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `payment_status` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `shipping_address` json NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `orders` ADD `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `sales` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE no action ON UPDATE no action;