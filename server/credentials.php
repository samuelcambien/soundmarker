<?php

$config = array();

$config['RDS_HOSTNAME'] = (($_SERVER["RDS_HOSTNAME"]) != "") ? $_SERVER["RDS_HOSTNAME"] : 'localhost';
$config['RDS_DB_NAME'] = (($_SERVER["RDS_DB_NAME"]) != "") ? $_SERVER["RDS_DB_NAME"] : 'soundmarker';
$config['RDS_USERNAME'] = (($_SERVER["RDS_USERNAME"]) != "") ? $_SERVER["RDS_USERNAME"] : 'root';
$config['RDS_PASSWORD'] = (($_SERVER["RDS_PASSWORD"]) != "") ? $_SERVER["RDS_PASSWORD"] : 'mysql';
$config['SERVER_URL'] = (($_SERVER["SERVER_URL"]) != "") ? $_SERVER["SERVER_URL"] : 'http://localhost:4200';
$config['PHPSERVER_URL'] = (($_SERVER["PHPSERVER_URL"]) != "") ? $_SERVER["PHPSERVER_URL"] : 'http://localhost/soundmarker-sass/server/';
$config['AWS_S3_PATH'] = (($_SERVER["AWSS3_PATH"]) != "") ? $_SERVER["AWSS3_PATH"] : 'https://s3-eu-west-1.amazonaws.com/soundmarkersass-local-robin/';
$config['AWS_S3_BUCKET'] = (($_SERVER["AWSS3_BUCKET"]) != "") ? $_SERVER["AWSS3_BUCKET"] : 'soundmarkersass-local-robin';
$config['OAUTH_CLIENT_ID'] = (($_SERVER["OAUTH_CLIENT_ID"]) != "") ? $_SERVER["OAUTH_CLIENT_ID"] : 'O7mazXp53IMKB7kF7meEH4AiuPJDTJwIuZEBw3dT';
$config['OAUTH_CLIENT_SECRET'] = (($_SERVER["OAUTH_CLIENT_SECRET"]) != "") ? $_SERVER["OAUTH_CLIENT_SECRET"] : '40MdwYAlVET0OKjIUx62skLbPgFhCkxkkVAz8gDD';
$config['OAUTH_SERVER_LOCATION'] = (($_SERVER["OAUTH_SERVER_LOCATION"]) != "") ? $_SERVER["OAUTH_SERVER_LOCATION"] : 'https://www.leapwingaudio.com';
