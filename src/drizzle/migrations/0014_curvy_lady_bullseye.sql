DROP TABLE `todo_list`;--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `kontak_telepon` varchar(12);--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `address` text NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` ADD `perusahaan` varchar(100) NOT NULL;