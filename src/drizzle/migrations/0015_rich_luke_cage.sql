CREATE TABLE `stakeholder` (
	`stakeholder_id` int AUTO_INCREMENT NOT NULL,
	`stakeholeder_name` varchar(100) NOT NULL,
	`stakeholder_email` varchar(100) NOT NULL,
	`stakeholder_phone` varchar(100) NOT NULL,
	`create_at` timestamp DEFAULT (now()),
	`update_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stakeholder_stakeholder_id` PRIMARY KEY(`stakeholder_id`),
	CONSTRAINT `stakeholder_stakeholder_email_unique` UNIQUE(`stakeholder_email`)
);
