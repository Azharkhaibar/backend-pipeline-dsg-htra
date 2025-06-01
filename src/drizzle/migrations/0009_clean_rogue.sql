DROP TABLE `cart_item`;--> statement-breakpoint
ALTER TABLE `product` RENAME COLUMN `fkVendor` TO `fk_vendor`;--> statement-breakpoint
ALTER TABLE `product` RENAME COLUMN `fkcategory` TO `fk_category`;--> statement-breakpoint
ALTER TABLE `product` DROP FOREIGN KEY `product_fkVendor_vendors_vendor_id_fk`;
--> statement-breakpoint
ALTER TABLE `product` DROP FOREIGN KEY `product_fkcategory_category_category_id_fk`;
--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `review_produk` varchar(255);--> statement-breakpoint
ALTER TABLE `product` ADD `stok` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `product` ADD `stok_minimum` int DEFAULT 2;--> statement-breakpoint
ALTER TABLE `product` ADD `isManageStock` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fk_vendor_vendors_vendor_id_fk` FOREIGN KEY (`fk_vendor`) REFERENCES `vendors`(`vendor_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_fk_category_category_category_id_fk` FOREIGN KEY (`fk_category`) REFERENCES `category`(`category_id`) ON DELETE no action ON UPDATE no action;