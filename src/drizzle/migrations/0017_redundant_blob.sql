ALTER TABLE `product` DROP FOREIGN KEY `product_fk_vendor_vendors_vendor_id_fk`;
--> statement-breakpoint
ALTER TABLE `product` DROP FOREIGN KEY `product_fk_category_category_category_id_fk`;
--> statement-breakpoint
ALTER TABLE `admin_profile` MODIFY COLUMN `team` enum('Staff','Finance','Tech','Marketing') NOT NULL DEFAULT 'Staff';--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fk_vendor_vendors_vendor_id_fk` FOREIGN KEY (`fk_vendor`) REFERENCES `vendors`(`vendor_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fk_category_category_category_id_fk` FOREIGN KEY (`fk_category`) REFERENCES `category`(`category_id`) ON DELETE set null ON UPDATE no action;