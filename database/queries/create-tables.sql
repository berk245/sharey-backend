CREATE TABLE `UserReport` (
  `report_id` bigint,
  `creator_id` bigint,
  `reported_user_id` bigint,
  `created_at` timestamp,
  `report_text` mediumtext,
  `is_active` bool,
  `is_resolved` bool,
  PRIMARY KEY (`report_id`)
);

CREATE TABLE `UserReview` (
  `review_id` bigint,
  `creator_id` bigint,
  `reviewed_user_id` bigint,
  `created_at` timestamp,
  `review_text` text,
  `is_rating_positive` bool,
  `is_active` bool,
  PRIMARY KEY (`review_id`)
);

CREATE TABLE `User` (
  `user_id` bigint,
  `email` varchar(255),
  `password` varchar(255),
  `name` varchar(50),
  `last_name` varchar(50),
  `phone` varchar(12),
  `city` varchar(50),
  `address` varchar(255),
  `member_since` timestamp,
  `profile_photo_url` varchar(255),
  `is_active` bool,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `ItemPhoto` (
  `photo_id` bigint,
  `item_id` bigint,
  `photo_url` varchar(255),
  `description` varchar(100),
  `uploaded_at` timestamp,
  PRIMARY KEY (`photo_id`)
);

CREATE TABLE `ItemUsage` (
  `usage_id` bigint,
  `user_id` bigint,
  `item_id` bigint,
  `usage_request_id` bigint,
  `status` enum('cancelled', 'active', 'completed', 'conflict'),
  `created_at` timestamp,
  PRIMARY KEY (`usage_id`)
);

CREATE TABLE `ItemUsageRequest` (
  `request_id` bigint,
  `user_id` bigint,
  `item_id` bigint,
  `created_at` timestamp,
  `date_from` timestamp,
  `date_to` timestamp,
  `request_message` text,
  `status` enum('pending', 'accepted', 'declined'),
  `is_active` bool,
  PRIMARY KEY (`request_id`)
);

CREATE TABLE `ItemReview` (
  `review_id` bigint,
  `creator_id` bigint,
  `reviewed_item_id` bigint,
  `created_at` timestamp,
  `review_text` text,
  `is_rating_positive` bool,
  `is_active` bool,
  PRIMARY KEY (`review_id`)
);

CREATE TABLE `Item` (
  `item_id` bigint,
  `owner_id` bigint,
  `category_id` bigint,
  `item_name` varchar(50),
  `item_description` text,
  `created_at` timestamp,
  `updated_at` timestamp,
  `quantity` int,
  `is_active` bool,
  PRIMARY KEY (`item_id`)
);

CREATE TABLE `Category` (
  `category_id` bigint,
  `category_name` varchar(100),
  PRIMARY KEY (`category_id`)
);

CREATE TABLE `ItemReport` (
  `report_id` bigint,
  `creator_id` bigint,
  `reported_item_id` bigint,
  `created_at` timestamp,
  `report_text` mediumtext,
  `is_active` bool,
  `is_resolved` bool,
  PRIMARY KEY (`report_id`)
);

CREATE TABLE `ItemUsageReport` (
  `report_id` bigint,
  `creator_id` bigint,
  `reported_usage_id` bigint,
  `created_at` timestamp,
  `report_text` mediumtext,
  `is_active` bool,
  `is_resolved` bool,
  PRIMARY KEY (`report_id`)
);

