<?php

$config = array();

$config['RDS_HOSTNAME'] = (($_SERVER["RDS_HOSTNAME"]) != "") ? $_SERVER["RDS_HOSTNAME"] : 'localhost';
$config['RDS_DB_NAME'] = (($_SERVER["RDS_DB_NAME"]) != "") ? $_SERVER["RDS_DB_NAME"] : 'rrkmqmcpkw';
$config['RDS_USERNAME'] = (($_SERVER["RDS_USERNAME"]) != "") ? $_SERVER["RDS_USERNAME"] : 'rrkmqmcpkw';
$config['RDS_PASSWORD'] = (($_SERVER["RDS_PASSWORD"]) != "") ? $_SERVER["RDS_PASSWORD"] : 'ECRq62aVTv';
$config['SERVER_URL'] = (($_SERVER["SERVER_URL"]) != "") ? $_SERVER["SERVER_URL"] : 'http://localhost';
$config['PHPSERVER_URL'] = (($_SERVER["PHPSERVER_URL"]) != "") ? $_SERVER["PHPSERVER_URL"] : 'http://localhost/soundmarker-sass/server/';
$config['OAUTH_CLIENT_ID'] = (($_SERVER["OAUTH_CLIENT_ID"]) != "") ? $_SERVER["OAUTH_CLIENT_ID"] : 'O7mazXp53IMKB7kF7meEH4AiuPJDTJwIuZEBw3dT';
$config['OAUTH_CLIENT_SECRET'] = (($_SERVER["OAUTH_CLIENT_SECRET"]) != "") ? $_SERVER["OAUTH_CLIENT_SECRET"] : '40MdwYAlVET0OKjIUx62skLbPgFhCkxkkVAz8gDD';
$config['OAUTH_SERVER_LOCATION'] = (($_SERVER["OAUTH_SERVER_LOCATION"]) != "") ? $_SERVER["OAUTH_SERVER_LOCATION"] : 'https://www.leapwingaudio.com';
$config['FFMPEG_PATH'] = (($_SERVER["FFMPEG_PATH"]) != "") ? $_SERVER["FFMPEG_PATH"] : 'ffmpeg-4.1-64bit-static';
