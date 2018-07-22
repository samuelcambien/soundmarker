# ************************************************************
# Sequel Pro SQL dump
# Version 4499
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: aa199fnkw44qa8z.cmqrrqn97axa.eu-central-1.rds.amazonaws.com (MySQL 5.6.39-log)
# Database: ebdb
# Generation Time: 2018-06-17 13:39:18 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Ad
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Ad`;

CREATE TABLE `Ad` (
  `ad_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `html` mediumint(9) DEFAULT NULL,
  `impressions` bigint(20) DEFAULT NULL,
  `exposure_time` time DEFAULT NULL,
  `limit` bigint(20) DEFAULT NULL,
  `clicks` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ad_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Comment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Comment`;

CREATE TABLE `Comment` (
  `comment_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `version_id` bigint(20) unsigned DEFAULT NULL,
  `notes` text,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `checked` tinyint(1) DEFAULT NULL,
  `parent_comment_id` bigint(20) DEFAULT NULL,
  `name` tinytext,
  PRIMARY KEY (`comment_id`),
  KEY `version_id` (`version_id`),
  CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `Version` (`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table File
# ------------------------------------------------------------

DROP TABLE IF EXISTS `File`;

CREATE TABLE `File` (
  `file_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `version_id` bigint(20) unsigned DEFAULT NULL,
  `extension` varchar(255) DEFAULT NULL,
  `metadata` text,
  `aws_path` text,
  `file_name` text,
  `file_size` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `version_id` (`version_id`),
  CONSTRAINT `File_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `Version` (`version_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Log`;

CREATE TABLE `Log` (
  `log_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `log_type` int(20) DEFAULT NULL,
  `version_id` bigint(20) unsigned DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `version_id` (`version_id`),
  CONSTRAINT `Log_ibfk_1` FOREIGN KEY (`version_id`) REFERENCES `Version` (`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Notification`;

CREATE TABLE `Notification` (
  `notification_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `emailaddress` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `type` int(20) DEFAULT NULL,
  `type_id` bigint(20) unsigned DEFAULT NULL,
  `read` int(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` int(20) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Photo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Photo`;

CREATE TABLE `Photo` (
  `photo_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `file` tinytext,
  `type` int(20) DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Photo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Project`;

CREATE TABLE `Project` (
  `project_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `title` tinytext,
  `password` varchar(255) DEFAULT NULL,
  `url` tinytext,
  `expiration_date` datetime DEFAULT NULL,
  `date_of_last_activity` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Project_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Track
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Track`;

CREATE TABLE `Track` (
  `track_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned DEFAULT NULL,
  `title` tinytext,
  `visibility` tinyint(1) DEFAULT NULL,
  `artist` tinytext,
  `hash` varchar(255) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`track_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `Track_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`project_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `emailaddress` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `website` tinytext,
  `profile_picture` tinytext,
  `password_hash` varchar(255) DEFAULT NULL,
  `preferences` text,
  `hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Version
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Version`;

CREATE TABLE `Version` (
  `version_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `track_id` bigint(20) unsigned DEFAULT NULL,
  `notes` text,
  `streamable` tinyint(1) DEFAULT NULL,
  `lossy_stream` bigint(20) unsigned DEFAULT NULL,
  `lossless_stream` bigint(20) unsigned DEFAULT NULL,
  `downloadable` tinyint(1) DEFAULT NULL,
  `download` bigint(20) unsigned DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT NULL,
  `version_title` text,
  PRIMARY KEY (`version_id`),
  KEY `lossy_stream` (`lossy_stream`),
  KEY `lossless_stream` (`lossless_stream`),
  KEY `download` (`download`),
  KEY `track_id` (`track_id`),
  CONSTRAINT `Version_ibfk_1` FOREIGN KEY (`lossy_stream`) REFERENCES `File` (`file_id`),
  CONSTRAINT `Version_ibfk_2` FOREIGN KEY (`lossless_stream`) REFERENCES `File` (`file_id`),
  CONSTRAINT `Version_ibfk_3` FOREIGN KEY (`download`) REFERENCES `File` (`file_id`),
  CONSTRAINT `Version_ibfk_4` FOREIGN KEY (`track_id`) REFERENCES `Track` (`track_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
