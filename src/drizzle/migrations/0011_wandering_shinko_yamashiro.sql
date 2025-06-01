ALTER TABLE `product` MODIFY COLUMN `harga` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `stok` int;--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `stok_minimum` int;