<?php

$rdshostname = (($_SERVER["RDS_HOSTNAME"]) != "") ? $_SERVER["RDS_HOSTNAME"] : 'localhost';
$rdsdb_name = (($_SERVER["RDS_DB_NAME"]) != "") ? $_SERVER["RDS_DB_NAME"] : 'soundmarker';
$rdsusername = (($_SERVER["RDS_USERNAME"]) != "") ? $_SERVER["RDS_USERNAME"] : 'root';
$rdspassword = (($_SERVER["RDS_PASSWORD"]) != "") ? $_SERVER["RDS_PASSWORD"] : 'mysql';
$serverurl = (($_SERVER["SERVER_URL"]) != "") ? $_SERVER["SERVER_URL"] : 'http://localhost:4200';
$awss3path = (($_SERVER["AWSS3_PATH"]) != "") ? $_SERVER["AWSS3_PATH"] : 'https://s3-eu-west-1.amazonaws.com/soundmarkersass-local-robin/';
$awss3bucket = (($_SERVER["AWSS3_BUCKET"]) != "") ? $_SERVER["AWSS3_BUCKET"] : 'soundmarkersass-local-robin';
