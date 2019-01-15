<?php

$config = array();

$config['RDS_HOSTNAME'] = (($_SERVER["RDS_HOSTNAME"]) != "") ? $_SERVER["RDS_HOSTNAME"] : '127.0.0.1';
$config['RDS_DB_NAME'] = (($_SERVER["RDS_DB_NAME"]) != "") ? $_SERVER["RDS_DB_NAME"] : 'ebdb';
$config['RDS_USERNAME'] = (($_SERVER["RDS_USERNAME"]) != "") ? $_SERVER["RDS_USERNAME"] : 'root';
$config['RDS_PASSWORD'] = (($_SERVER["RDS_PASSWORD"]) != "") ? $_SERVER["RDS_PASSWORD"] : 'root';
$config['SERVER_URL'] = (($_SERVER["SERVER_URL"]) != "") ? $_SERVER["SERVER_URL"] : 'http://localhost:4200';
$config['PHPSERVER_URL'] = (($_SERVER["PHPSERVER_URL"]) != "") ? $_SERVER["PHPSERVER_URL"] : 'http://localhost:4200/soundmarker-sass/server/';
$config['AWS_S3_PATH'] = (($_SERVER["AWSS3_PATH"]) != "") ? $_SERVER["AWSS3_PATH"] : 'https://s3-eu-central-1.amazonaws.com/soundmarkerfiles-staging-local/';
$config['AWS_S3_REGION'] = (($_SERVER["AWS_S3_REGION"]) != "") ? $_SERVER["AWS_S3_REGION"] : 'eu-central-1';
$config['AWS_S3_BUCKET'] = (($_SERVER["AWSS3_BUCKET"]) != "") ? $_SERVER["AWSS3_BUCKET"] : 'soundmarkerfiles-staging-local';
$config['OAUTH_CLIENT_ID'] = (($_SERVER["OAUTH_CLIENT_ID"]) != "") ? $_SERVER["OAUTH_CLIENT_ID"] : 'O7mazXp53IMKB7kF7meEH4AiuPJDTJwIuZEBw3dT';
$config['OAUTH_CLIENT_SECRET'] = (($_SERVER["OAUTH_CLIENT_SECRET"]) != "") ? $_SERVER["OAUTH_CLIENT_SECRET"] : '40MdwYAlVET0OKjIUx62skLbPgFhCkxkkVAz8gDD';
$config['OAUTH_SERVER_LOCATION'] = (($_SERVER["OAUTH_SERVER_LOCATION"]) != "") ? $_SERVER["OAUTH_SERVER_LOCATION"] : 'https://www.leapwingaudio.com';
$config['FFMPEG_PATH'] = (($_SERVER["FFMPEG_PATH"]) != "") ? $_SERVER["FFMPEG_PATH"] : '/usr/local/bin';
