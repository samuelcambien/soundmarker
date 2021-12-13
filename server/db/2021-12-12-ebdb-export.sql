-- MySQL dump 10.13  Distrib 8.0.26, for macos11.3 (x86_64)
--
-- Host: localhost    Database: ebdb
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Ad`
--

DROP TABLE IF EXISTS `Ad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ad` (
  `ad_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `html` longtext,
  `impressions` bigint DEFAULT NULL,
  `exposure_time` time DEFAULT NULL,
  `clicks` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `limits` bigint DEFAULT NULL,
  PRIMARY KEY (`ad_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ad`
--

LOCK TABLES `Ad` WRITE;
/*!40000 ALTER TABLE `Ad` DISABLE KEYS */;
/*!40000 ALTER TABLE `Ad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `comment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `version_id` bigint unsigned DEFAULT NULL,
  `notes` text,
  `start_time` bigint DEFAULT NULL,
  `end_time` bigint DEFAULT NULL,
  `checked` tinyint(1) DEFAULT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `name` tinytext,
  `include_start` tinyint(1) DEFAULT NULL,
  `include_end` tinyint(1) DEFAULT NULL,
  `comment_time` bigint DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `version_id` (`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DailyUpdates`
--

DROP TABLE IF EXISTS `DailyUpdates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DailyUpdates` (
  `update_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint DEFAULT NULL,
  `emailaddress` varchar(255) DEFAULT NULL,
  `last_comment_id` mediumtext,
  `notify_id` int DEFAULT NULL,
  PRIMARY KEY (`update_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DailyUpdates`
--

LOCK TABLES `DailyUpdates` WRITE;
/*!40000 ALTER TABLE `DailyUpdates` DISABLE KEYS */;
/*!40000 ALTER TABLE `DailyUpdates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Emails`
--

DROP TABLE IF EXISTS `Emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Emails` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email_name` varchar(255) DEFAULT NULL,
  `email_string` longtext,
  `email_string_text` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Emails`
--

LOCK TABLES `Emails` WRITE;
/*!40000 ALTER TABLE `Emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `Emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `File` (
  `file_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `version_id` bigint unsigned DEFAULT NULL,
  `extension` varchar(255) DEFAULT NULL,
  `metadata` text,
  `aws_path` text,
  `file_name` text,
  `file_size` bigint DEFAULT NULL,
  `identifier` int DEFAULT NULL,
  `chunk_length` int DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `version_id` (`version_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File`
--

LOCK TABLES `File` WRITE;
/*!40000 ALTER TABLE `File` DISABLE KEYS */;
INSERT INTO `File` VALUES (16,16,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F16%2F11.%252520Monk%252520In%252520Harlem','11.%20Monk%20In%20Harlem',14563033,0,10),(17,17,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F17%2F03.%252520Kofifi%252520Blue','03.%20Kofifi%20Blue',6363715,0,10),(18,18,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F18%2F01.%252520Excursions','01.%20Excursions',6779584,0,10),(19,19,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F19%2F11.%252520Monk%252520In%252520Harlem','11.%20Monk%20In%20Harlem',14562947,0,10),(20,20,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F20%2F03.%252520Kofifi%252520Blue','03.%20Kofifi%20Blue',6363715,0,10),(21,21,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F21%2F03.%252520Kofifi%252520Blue','03.%20Kofifi%20Blue',6363715,0,10),(22,22,'mp3','','https%3A%2F%2Fs3-eu-central-1.amazonaws.com%2Fsoundmarkerfiles-staging-local%2F22%2F3house','3house',8377991,0,10);
/*!40000 ALTER TABLE `File` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Log`
--

DROP TABLE IF EXISTS `Log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Log` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `log_type` int DEFAULT NULL,
  `version_id` bigint unsigned DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `version_id` (`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Log`
--

LOCK TABLES `Log` WRITE;
/*!40000 ALTER TABLE `Log` DISABLE KEYS */;
/*!40000 ALTER TABLE `Log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `notification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `emailaddress` varchar(255) DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `type` int DEFAULT NULL,
  `type_id` bigint unsigned DEFAULT NULL,
  `read` int DEFAULT NULL,
  `senddate` datetime DEFAULT NULL,
  `status` int DEFAULT NULL,
  `recipientemail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES (1,'samuelcambien@gmail.com',NULL,0,12,NULL,'2021-11-11 14:54:30',0,''),(2,'samuelcambien@gmail.com',NULL,0,13,NULL,'2021-11-11 15:01:04',0,''),(3,'samuelcambien@gmail.com',NULL,0,14,NULL,'2021-11-11 15:04:36',0,''),(4,'test%20email',NULL,0,14,NULL,'2021-10-18 15:28:16',0,''),(5,'test%20email',NULL,0,15,NULL,'2021-10-18 15:30:16',0,''),(6,'test%20email',NULL,0,15,NULL,'2021-10-18 15:30:51',0,''),(7,'test%20email',NULL,0,17,NULL,'2021-10-25 14:28:30',0,''),(8,'test%20email',NULL,0,18,NULL,'2021-10-25 14:31:18',0,''),(9,'test%20email',NULL,0,19,NULL,'2021-10-25 14:47:30',0,''),(10,'samuelcambien@gmail.com',NULL,0,20,NULL,'2022-01-13 16:26:48',0,'');
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageSettings`
--

DROP TABLE IF EXISTS `PageSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageSettings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `field_name` varchar(255) DEFAULT NULL,
  `html` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageSettings`
--

LOCK TABLES `PageSettings` WRITE;
/*!40000 ALTER TABLE `PageSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `PageSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Photo`
--

DROP TABLE IF EXISTS `Photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Photo` (
  `photo_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `file` tinytext,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Photo`
--

LOCK TABLES `Photo` WRITE;
/*!40000 ALTER TABLE `Photo` DISABLE KEYS */;
/*!40000 ALTER TABLE `Photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `project_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `title` tinytext,
  `password` varchar(255) DEFAULT NULL,
  `url` tinytext,
  `expiration_date` datetime DEFAULT NULL,
  `date_of_last_activity` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `hash` text,
  `ipaddr` varchar(255) DEFAULT NULL,
  `stream_type` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (15,1,'Test%20Project','923b969c9c3769ca313d30480411b55f04b7914fd7c37b8041b08d03466ce136',NULL,'2021-10-18 15:30:51','2021-10-11 17:29:46',1,'79e8451e-3c12-4e58-9209-c9b62b2ac3d8a418ca6b-8b69-4c0a-ad5e-5302cb9383b3','::1 - ::1','1'),(16,1,'Test%20Project%20bis','',NULL,NULL,'2021-10-11 17:31:52',1,'e2a6c35f-c82e-4dbf-a390-7e129ee2b23b662ed614-3a9b-46f9-9b92-426769f58b84','::1 - ::1','1'),(17,1,'Test%20Project%20password','iedemenne',NULL,'2021-10-25 14:28:30','2021-10-18 16:28:09',0,'5f489681-6f28-49f5-bd58-89fab0644d334f9e55c4-51e8-456c-bcc4-1b87e498e016','::1 - ::1','0'),(18,1,'Test%20Project%20password','923b969c9c3769ca313d30480411b55f04b7914fd7c37b8041b08d03466ce136',NULL,'2021-10-25 14:31:18','2021-10-18 16:31:05',1,'c160b3d6-d6df-4562-aa15-e051be0961d8a0ac9d1e-6f47-4927-a782-e1c839f6a710','::1 - ::1','0'),(19,1,'Test%20Project%20no%20password','',NULL,'2021-10-25 14:47:30','2021-10-18 16:47:17',1,'a68b470e-1b0d-4a5a-8a9d-76f90a2b575115f86c38-9599-48af-b5c0-27802dd3c37d','::1 - ::1','0'),(20,1,'','',NULL,'2022-01-13 16:26:48','2021-12-13 17:26:34',1,'e2be26ec-3cf0-4f37-9543-776e3355ea3fb89e40a5-4cfe-43fb-a427-b0fd379558d8','::1 - ::1','');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `setting` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Track`
--

DROP TABLE IF EXISTS `Track`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Track` (
  `track_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned DEFAULT NULL,
  `title` tinytext,
  `visibility` tinyint(1) DEFAULT NULL,
  `artist` tinytext,
  `hash` varchar(255) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`track_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Track`
--

LOCK TABLES `Track` WRITE;
/*!40000 ALTER TABLE `Track` DISABLE KEYS */;
INSERT INTO `Track` VALUES (15,15,'11.%20Monk%20In%20Harlem.mp3',1,'',NULL,NULL),(16,16,'01.%20Excursions.mp3',1,'',NULL,NULL),(17,17,'11.%20Monk%20In%20Harlem.mp3',1,'',NULL,NULL),(18,18,'03.%20Kofifi%20Blue.mp3',1,'',NULL,NULL),(19,19,'03.%20Kofifi%20Blue.mp3',1,'',NULL,NULL),(20,20,'3house',1,'',NULL,NULL);
/*!40000 ALTER TABLE `Track` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `emailaddress` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `website` tinytext,
  `profile_picture` tinytext,
  `password_hash` varchar(255) DEFAULT NULL,
  `preferences` text,
  `hash` varchar(255) DEFAULT NULL,
  `user_nicename` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_nicename` (`user_nicename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Version`
--

DROP TABLE IF EXISTS `Version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Version` (
  `version_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `track_id` bigint unsigned DEFAULT NULL,
  `notes` text,
  `lossy_stream` bigint unsigned DEFAULT NULL,
  `lossless_stream` bigint unsigned DEFAULT NULL,
  `downloadable` tinyint(1) DEFAULT NULL,
  `download` bigint unsigned DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT NULL,
  `version_title` text,
  `wave_png` longtext,
  `track_length` int DEFAULT NULL,
  `version_number` int DEFAULT NULL,
  `last_seen` bigint DEFAULT NULL,
  PRIMARY KEY (`version_id`),
  KEY `lossy_stream` (`lossy_stream`),
  KEY `lossless_stream` (`lossless_stream`),
  KEY `download` (`download`),
  KEY `track_id` (`track_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Version`
--

LOCK TABLES `Version` WRITE;
/*!40000 ALTER TABLE `Version` DISABLE KEYS */;
INSERT INTO `Version` VALUES (16,15,'',NULL,NULL,0,NULL,1,'','s3',364,1,1633966786258),(17,15,'',NULL,NULL,0,NULL,1,'','s3',159,2,1639399786363),(18,16,'',NULL,NULL,0,NULL,1,'','s3',169,1,1634570283062),(19,17,'',NULL,NULL,0,NULL,1,'','s3',364,1,NULL),(20,18,'',NULL,NULL,0,NULL,1,'','s3',159,1,1638803129082),(21,19,'',NULL,NULL,0,NULL,1,'','s3',159,1,1635778814322),(22,20,'',NULL,NULL,0,NULL,1,'','s3',209,1,NULL);
/*!40000 ALTER TABLE `Version` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-13 18:28:53
