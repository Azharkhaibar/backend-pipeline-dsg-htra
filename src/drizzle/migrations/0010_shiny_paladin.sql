CREATE TABLE `cart_item` (
	`cart_item_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`product_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_item_cart_item_id` PRIMARY KEY(`cart_item_id`)
);
--> statement-breakpoint
ALTER TABLE `category` MODIFY COLUMN `deskripsi_kategori` varchar(255);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `harga` int NOT NULL;--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `stok` int;--> statement-breakpoint
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_customer_id_customers_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE cascade ON UPDATE no action;