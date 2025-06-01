ALTER TABLE `product` MODIFY COLUMN `nama_produk` varchar(100);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `warna_produk` varchar(50);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `foto_produk` varchar(255);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `harga` decimal(10,2);--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `fk_vendor` int;--> statement-breakpoint
ALTER TABLE `product` MODIFY COLUMN `fk_category` int;