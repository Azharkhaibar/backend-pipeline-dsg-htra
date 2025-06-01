CREATE TABLE `expenses` (
	`expenses_id` int AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL,
	`product_id` int NOT NULL,
	`expense_type` varchar(100),
	`quantity` int,
	`amount` decimal(15,2) NOT NULL,
	`description` text,
	`expense_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_expenses_id` PRIMARY KEY(`expenses_id`)
);
--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `language` enum('english','indonesia') NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `job_title` varchar(100);--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `status` enum('active','inactive');--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `team` enum('staff','finance','tech') NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_profile` ADD `created_by` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_vendor_id_vendors_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;