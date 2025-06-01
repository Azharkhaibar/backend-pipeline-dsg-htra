CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`todo` varchar(255) NOT NULL,
	`is_done` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`user_profile_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`phone` varchar(20),
	`image_url` varchar(255),
	`bio` text,
	CONSTRAINT `user_profiles_user_profile_id` PRIMARY KEY(`user_profile_id`)
);
--> statement-breakpoint
ALTER TABLE `activities` RENAME COLUMN `id` TO `activity_customer_id`;--> statement-breakpoint
ALTER TABLE `activities` DROP FOREIGN KEY `activities_customer_id_customers_customer_id_fk`;
--> statement-breakpoint
ALTER TABLE `activities` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `activities` ADD PRIMARY KEY(`activity_customer_id`);--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_admin_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admin`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;